import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ChatMessage } from "./types";

const GEMINI_API_KEY: string = import.meta.env.VITE_GEMINI_API_KEY ?? "";

const GEMINI_MODEL = "gemini-3.6-flash";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

async function fetchWithRetry(
    url: string,
    options: RequestInit,
    retries = 3,
    delayMs = 1000
): Promise<Response> {
    const res = await fetch(url, options);

    if ((res.status === 429 || res.status === 503) && retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        return fetchWithRetry(url, options, retries - 1, delayMs * 2);
    }

    return res;
}

function stripMarkdown(text: string): string {
    return text
        .replace(/```[\s\S]*?```/g, (block) => block.replace(/```/g, "")) // fenced code blocks
        .replace(/`([^`]+)`/g, "$1") // inline code
        .replace(/^#{1,6}\s+/gm, "") // headings
        .replace(/\*\*([^*]+)\*\*/g, "$1") // bold
        .replace(/__([^_]+)__/g, "$1") // bold (underscore)
        .replace(/\*([^*]+)\*/g, "$1") // italic
        .replace(/_([^_]+)_/g, "$1") // italic (underscore)
        .replace(/^\s*[-*+]\s+/gm, "") // bullet list markers
        .replace(/^\s*\d+\.\s+/gm, "") // numbered list markers
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // links -> just the text
        .replace(/^>\s?/gm, "") // blockquotes
        .trim();
}

type AiAssistPanelProps = {
    variant?: "sidebar" | "page";
};

export const AiAssistPanel = ({ variant = "sidebar" }: AiAssistPanelProps) => {
    const navigate = useNavigate();
    const isLoggedIn = Boolean(localStorage.getItem("accessToken"));

    const [aiMessages, setAiMessages] = useState<ChatMessage[]>([]);
    const [aiInput, setAiInput] = useState("");
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);

    const [isChatOpen, setIsChatOpen] = useState(true);
    const isOpen = variant === "page" ? true : isChatOpen;

    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isOpen) return;
        const el = chatContainerRef.current;
        if (el) {
            el.scrollTop = el.scrollHeight;
        }
    }, [aiMessages, aiLoading, isOpen]);

    async function sendQuestionToGemini() {
        const text = aiInput.trim();
        if (!text || aiLoading) return;

        const userMsg: ChatMessage = {
            id: crypto.randomUUID(),
            role: "user",
            content: text,
            timestamp: new Date(),
        };

        const nextMessages = [...aiMessages, userMsg];
        setAiMessages(nextMessages);
        setAiInput("");
        setAiLoading(true);
        setAiError(null);

        try {
            if (!GEMINI_API_KEY) {
                throw new Error(
                    "Missing VITE_GEMINI_API_KEY. Add it to a .env file in your frontend project root."
                );
            }

            const res = await fetchWithRetry(GEMINI_API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    systemInstruction: {
                        parts: [
                            {
                                text: "You are a concise, friendly AI assistant embedded in a Q&A forum app. Keep answers helpful and to the point. Reply in plain text only — do not use markdown formatting (no asterisks, pound signs, bullet dashes, backticks, or numbered-list syntax). Write plain sentences and paragraphs instead.",
                            },
                        ],
                    },
                    contents: nextMessages.slice(-20).map((m) => ({
                        role: m.role === "assistant" ? "model" : "user",
                        parts: [{ text: m.content }],
                    })),
                }),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => null);
                const apiMessage: string | undefined = body?.error?.message;

                if (res.status === 429) {
                    throw new Error(
                        "Rate limit reached. Please wait a moment and try again."
                    );
                }

                if (res.status === 503) {
                    throw new Error(
                        "The AI model is overloaded right now. Please try again shortly."
                    );
                }

                throw new Error(apiMessage || `Request failed: ${res.status}`);
            }

            const data: {
                candidates?: {
                    content?: { parts?: { text?: string }[] };
                }[];
            } = await res.json();

            const replyText =
                data.candidates?.[0]?.content?.parts?.[0]?.text ??
                "Sorry, I couldn't generate a response.";

            const aiMsg: ChatMessage = {
                id: crypto.randomUUID(),
                role: "assistant",
                content: stripMarkdown(replyText),
                timestamp: new Date(),
            };

            setAiMessages((prev) => [...prev, aiMsg]);
        } catch (err) {
            setAiError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong talking to the AI service."
            );
        } finally {
            setAiLoading(false);
        }
    }

    function handleSendQuestion() {
        if (!isLoggedIn) {
            sessionStorage.setItem("postLoginRedirect", "/ai-assist");
            navigate("/login");
            return;
        }
        sendQuestionToGemini();
    }

    function handleAiKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSendQuestion();
        }
    }

    return (
        <aside
            className={
                variant === "page"
                    ? "flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white px-4 py-6 transition-colors duration-300 dark:bg-slate-950 sm:px-6 lg:px-8 lg:py-8"
                    : `flex shrink-0 flex-col overflow-hidden bg-white transition-all duration-300 ease-in-out dark:bg-slate-950 ${
                          isOpen
                              ? "h-[28rem] w-full justify-between px-4 py-6 sm:px-6 lg:h-full lg:w-96 lg:py-8"
                              : "h-14 w-full justify-start px-4 py-3 sm:px-6 lg:h-full lg:w-14 lg:flex-col lg:items-center lg:py-6"
                      }`
            }
        >
            {/* Header row: title + toggle button (toggle hidden in "page" variant) */}
            <div
                className={`flex shrink-0 items-center ${
                    isOpen ? "justify-between" : "justify-center lg:flex-col lg:gap-3"
                }`}
            >
                {isOpen && (
                    <div className="flex-1">
                        <h3 className="text-center text-lg font-bold text-slate-900 dark:text-white lg:text-xl">
                            You're Welcome
                        </h3>
                        <p className="text-center text-base font-semibold text-slate-700 dark:text-white/90 lg:text-lg">
                            Have any question?
                        </p>
                    </div>
                )}

                {variant === "sidebar" && (
                    <button
                        type="button"
                        aria-label={isOpen ? "Collapse AI Assist" : "Expand AI Assist"}
                        aria-expanded={isOpen}
                        onClick={() => setIsChatOpen((prev) => !prev)}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-300 text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-500 dark:text-slate-200 dark:hover:bg-slate-700"
                    >
                        {/* Chevron rotates to indicate open/closed direction */}
                        <svg
                            className={`h-4 w-4 transition-transform duration-300 lg:rotate-90 ${
                                isOpen ? "rotate-180 lg:rotate-[270deg]" : "rotate-0 lg:rotate-90"
                            }`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                )}

                {variant === "sidebar" && !isOpen && (
                    <span className="hidden text-[10px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400 lg:block">
                        Chat
                    </span>
                )}
            </div>

            {/* Body — only rendered while open (always true for "page") */}
            {isOpen && (
                <>
                    <div className="mt-4 flex min-h-0 flex-1 flex-col lg:mt-6">
                        <div
                            ref={chatContainerRef}
                            className="flex-1 space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3 transition-colors duration-300 dark:border-slate-500 dark:bg-slate-800 sm:p-4"
                        >
                            {!isLoggedIn && (
                                <p className="rounded-lg bg-slate-100 p-2 text-xs text-slate-600 dark:bg-slate-700/60 dark:text-slate-300">
                                    Sign in to chat with the AI assistant.
                                </p>
                            )}

                            {aiMessages.length === 0 && !aiLoading && isLoggedIn && (
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Ask anything below and I'll answer here.
                                </p>
                            )}

                            {aiMessages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${
                                        msg.role === "user" ? "justify-end" : "justify-start"
                                    }`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                                            msg.role === "user"
                                                ? "bg-blue-600 text-white"
                                                : "bg-slate-200 text-slate-800 dark:bg-slate-700 dark:text-slate-100"
                                        }`}
                                    >
                                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide opacity-70">
                                            {msg.role === "user" ? "You" : "AI Assistant"}
                                        </p>
                                        <p className="leading-relaxed">{msg.content}</p>
                                    </div>
                                </div>
                            ))}

                            {aiLoading && (
                                <div className="flex justify-start">
                                    <div className="flex items-center gap-1 rounded-xl bg-slate-200 px-3 py-2 dark:bg-slate-700">
                                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 dark:bg-slate-300 [animation-delay:0s]" />
                                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 dark:bg-slate-300 [animation-delay:0.15s]" />
                                        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 dark:bg-slate-300 [animation-delay:0.3s]" />
                                    </div>
                                </div>
                            )}

                            {aiError && (
                                <p className="rounded-lg bg-red-50 p-2 text-xs text-red-600 dark:bg-red-950/50 dark:text-red-300">
                                    {aiError}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-4 flex shrink-0 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 transition-colors duration-300 dark:border-slate-500 dark:bg-slate-800 sm:px-4 sm:py-3 lg:mt-8">
                        <input
                            type="text"
                            placeholder="Ask anything ........"
                            value={aiInput}
                            onChange={(e) => setAiInput(e.target.value)}
                            onKeyDown={handleAiKeyDown}
                            disabled={aiLoading}
                            className="flex-1 border-b border-slate-300 bg-transparent pb-1 text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:opacity-50 dark:border-slate-500 dark:text-slate-100 dark:placeholder:text-slate-400"
                        />
                        <button
                            type="button"
                            aria-label="Send"
                            onClick={handleSendQuestion}
                            disabled={aiLoading || !aiInput.trim()}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-slate-300 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-400 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>
                </>
            )}
        </aside>
    );
};
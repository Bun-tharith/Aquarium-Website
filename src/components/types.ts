export type ChatRole = "user" | "assistant";

export interface ChatMessage {
    id: string;
    role: ChatRole;
    content: string;
    timestamp: Date;
}

export interface ChatApiResponse {
    role: "assistant";
    content: string;
}

export interface ChatApiError {
    error: string;
}

import { useEffect, useRef, useState } from "react";

function useReveal<T extends HTMLElement>(options?: IntersectionObserverInit) {
    const ref = useRef<T | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15, rootMargin: "0px 0px -10% 0px", ...options }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return { ref, isVisible };
}

function revealClass(isVisible: boolean) {
    return [
        "transition-all duration-700 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
    ].join(" ");
}

function revealStyle(delayMs = 0): React.CSSProperties {
    return { transitionDelay: `${delayMs}ms` };
}

type Member = {
    name: string;
    role: string;
    image: string;
    skills: string[];
    highlightedSkill?: string; // exact skill string to render highlighted, e.g. "Blockchain Development"
    links?: {
        website?: string;
        github?: string;
        linkedin?: string;
    };
};

const members: Member[] = [
    {
        name: "Srorng Sokcheat",
        role: "Mentor",
        image:
            "https://i.pinimg.com/736x/8e/ef/3b/8eef3b4b6aae5b017ac6e119d73194f9.jpg",
        skills: ["Full Stack Development", "Data Analytics", "Blockchain Development"],
        links: { website: "#", github: "#", linkedin: "#" },
    },
    {
        name: "Bun Tharith",
        role: "Member",
        image: "https://i.pinimg.com/736x/5d/00/b5/5d00b53573063b28a42571bd22d813e5.jpg",
        skills: ["Front-End", "Java Script", "React JS"],
        highlightedSkill: "Blockchain Development",
        links: { website: "#", github: "#", linkedin: "#" },
    },
];
const IconGlobe = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <circle cx={12} cy={12} r={9} />
        <path d="M3 12h18M12 3c2.5 2.7 3.8 6 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-6-3.8-9s1.3-6.3 3.8-9z" />
    </svg>
);

const IconGithub = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path
            d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 00-1.3-3.2 4.2 4.2 0 00-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 00-6.2 0C6.6 2.8 5.5 3.1 5.5 3.1a4.2 4.2 0 00-.1 3.2A4.6 4.6 0 004 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const IconLinkedin = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <rect x={3} y={3} width={18} height={18} rx={2} />
        <path d="M7 10v7M7 7v.01M11 17v-4.5a2 2 0 014 0V17M11 12.5V17" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const Reveal = ({
    children,
    delayMs = 0,
    className = "",
}: {
    children: React.ReactNode;
    delayMs?: number;
    className?: string;
}) => {
    const { ref, isVisible } = useReveal<HTMLDivElement>();
    return (
        <div ref={ref} className={`${revealClass(isVisible)} ${className}`} style={revealStyle(delayMs)}>
            {children}
        </div>
    );
};

export const AboutComponent = () => {
    const { ref: missionRef, isVisible: missionVisible } = useReveal<HTMLDivElement>();
    const { ref: visionRef, isVisible: visionVisible } = useReveal<HTMLDivElement>();

    return (
        <section className="w-full bg-white px-6 py-20 transition-colors duration-300 dark:bg-slate-950 sm:px-10 lg:px-16">
            <div className="mx-auto max-w-6xl">
                {/* Eyebrow badge */}
                <Reveal className="flex justify-center">
                    <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/40 bg-teal-500/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-teal-600 transition-colors duration-300 dark:border-teal-400/40 dark:bg-teal-400/10 dark:text-teal-300 sm:text-sm">
                        <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            viewBox="0 0 24 24"
                        >
                            <circle cx={12} cy={8} r={4} />
                            <path d="M9 12.5L6 21l6-3 6 3-3-8.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        Short Course Web Design · ISTAD Gen30
                    </span>
                </Reveal>

                {/* Heading */}
                <Reveal delayMs={100}>
                    <h1 className="mt-6 text-center text-5xl font-extrabold tracking-tight text-slate-900 transition-colors duration-300 dark:text-white sm:text-6xl lg:text-7xl">
                        About AQUARIUM
                    </h1>
                    <p className="mx-auto mt-4 max-w-xl text-center text-lg text-slate-600 transition-colors duration-300 dark:text-slate-400 sm:text-xl">
                        Public ask question and answer platform.
                    </p>
                </Reveal>

                {/* Featured photos */}
                <div className="mt-14 flex flex-wrap justify-center gap-4 sm:gap-6">
                    {members.map((member, i) => (
                        <Reveal
                            key={member.name}
                            delayMs={i * 120}
                            className="group relative h-80 w-56 shrink-0 overflow-hidden rounded-2xl sm:h-96 sm:w-64"
                        >
                            <img
                                src={member.image}
                                alt={member.name}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-600/30 via-indigo-500/10 to-transparent" />

                            {/* Name + role — always visible */}
                            <div className="absolute bottom-4 left-4 right-4">
                                <p className="text-lg font-bold text-white sm:text-xl">{member.name}</p>
                                <p className="text-sm text-slate-200">{member.role}</p>

                                {/* Skills + links — revealed on hover */}
                                <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-300 ease-out group-hover:mt-3 group-hover:grid-rows-[1fr] group-hover:opacity-100">
                                    <div className="overflow-hidden">
                                        <div className="flex flex-wrap gap-1.5">
                                            {member.skills.map((skill) => {
                                                const isHighlighted = skill === member.highlightedSkill;
                                                return (
                                                    <span
                                                        key={skill}
                                                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${isHighlighted
                                                                ? "bg-blue-600 text-white"
                                                                : "bg-white/10 text-slate-100 backdrop-blur-sm"
                                                            }`}
                                                    >
                                                        {skill}
                                                    </span>
                                                );
                                            })}
                                        </div>

                                        {member.links && (
                                            <div className="mt-3 flex items-center gap-3 text-slate-300">
                                                {member.links.website && (
                                                    <a
                                                        href={member.links.website}
                                                        aria-label={`${member.name} website`}
                                                        className="transition hover:text-white"
                                                    >
                                                        <IconGlobe />
                                                    </a>
                                                )}
                                                {member.links.github && (
                                                    <a
                                                        href={member.links.github}
                                                        aria-label={`${member.name} GitHub`}
                                                        className="transition hover:text-white"
                                                    >
                                                        <IconGithub />
                                                    </a>
                                                )}
                                                {member.links.linkedin && (
                                                    <a
                                                        href={member.links.linkedin}
                                                        aria-label={`${member.name} LinkedIn`}
                                                        className="transition hover:text-white"
                                                    >
                                                        <IconLinkedin />
                                                    </a>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Reveal>
                    ))}
                </div>

                {/* Description */}
                <Reveal>
                    <p className="mx-auto mt-14 max-w-3xl text-center text-lg leading-relaxed text-slate-700 transition-colors duration-300 dark:text-slate-300 sm:text-xl">
                        I am{" "}
                        <span className="font-bold text-slate-900 transition-colors duration-300 dark:text-white">
                            short course web design students from ISTAD Gen30
                        </span>
                        , applying what we've learned to build real-world forum website that can ask
                        the question in public for find the answer.
                    </p>
                </Reveal>

                {/* Mission & Vision */}
                <div className="mt-28 space-y-20">
                    {/* Our Mission — image left, text right */}
                    <div
                        ref={missionRef}
                        className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
                    >
                        <div
                            className={`overflow-hidden rounded-2xl bg-slate-100 transition-colors duration-300 dark:bg-slate-900/60 ${revealClass(
                                missionVisible
                            )}`}
                        >
                            <img
                                src="https://placehold.co/900x640/0f172a/2dd4bf?text=Mission+Illustration"
                                alt="Team collaborating on an idea"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div
                            className={revealClass(missionVisible)}
                            style={revealStyle(150)}
                        >
                            <div className="flex items-center gap-3">
                                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-600 transition-colors duration-300 dark:bg-indigo-500/20 dark:text-indigo-300">
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                                        <circle cx={12} cy={12} r={9} />
                                        <circle cx={12} cy={12} r={5} />
                                        <circle cx={12} cy={12} r={1} fill="currentColor" />
                                    </svg>
                                </span>
                                <h2 className="text-2xl font-extrabold text-slate-900 transition-colors duration-300 dark:text-white sm:text-3xl">Our Mission</h2>
                            </div>
                            <p className="mt-6 text-lg leading-relaxed text-slate-700 transition-colors duration-300 dark:text-slate-300">
                                As a Short Course Web Design student at ISTAD Gen 30, I sometimes face challenges when learning web design and development,
                                especially when I have questions and need help. That is why I created AQUARIUM, a website where students can ask questions and get helpful answers.
                                Its goal is to make learning easier and help students solve problems independently.
                            </p>
                            <p className="mt-5 text-lg leading-relaxed text-slate-700 transition-colors duration-300 dark:text-slate-300">
                                AQUARIUM is designed especially for students who want a simple place to ask questions and improve their knowledge without always having to wait for
                                someone else to be available.
                            </p>
                        </div>
                    </div>

                    {/* Our Vision — text left, image right */}
                    <div
                        ref={visionRef}
                        className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16"
                    >
                        <div
                            className={`order-2 lg:order-1 ${revealClass(visionVisible)}`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-500/15 text-teal-600 transition-colors duration-300 dark:bg-teal-500/20 dark:text-teal-300">
                                    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                                        <path d="M12 2c2.5 3 4 6.5 4 10a4 4 0 01-8 0c0-3.5 1.5-7 4-10z" />
                                        <path d="M9 15l-3 6 5-2 1 3 1-3 5 2-3-6" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </span>
                                <h2 className="text-2xl font-extrabold text-slate-900 transition-colors duration-300 dark:text-white sm:text-3xl">Our Vision</h2>
                            </div>
                            <p className="mt-6 text-lg leading-relaxed text-slate-700 transition-colors duration-300 dark:text-slate-300">
                                We envision a learning environment where students at ISTAD can easily ask questions and get the help they
                                need without always having to wait for a mentor or senior developer. AQUARIUM aims to make learning web design
                                and development easier, faster, and more independent.
                            </p>
                            <p className="mt-5 text-lg leading-relaxed text-slate-700 transition-colors duration-300 dark:text-slate-300">
                                As we grow, we want AQUARIUM to support students at every stage of their learning journey, from beginners who are learning
                                the basics to students working on more advanced projects. Our goal is to create a helpful space where students can learn from
                                their questions, and become more confident in their skills.
                            </p>
                        </div>
                        <div
                            className={`order-1 overflow-hidden rounded-2xl bg-slate-100 transition-colors duration-300 dark:bg-slate-900/60 lg:order-2 ${revealClass(
                                visionVisible
                            )}`}
                            style={revealStyle(150)}
                        >
                            <img
                                src="https://placehold.co/900x640/0f172a/2dd4bf?text=Vision+Illustration"
                                alt="Team presenting growth and data"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutComponent;

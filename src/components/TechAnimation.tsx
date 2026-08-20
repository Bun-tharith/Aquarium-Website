type TechItem = {
    name: string;

    iconUrl?: string;
};
const techStack: TechItem[] = [
    { name: "React JS", iconUrl: "https://cdn.simpleicons.org/react/61DAFB" },
    { name: "TypeScript", iconUrl: "https://cdn.simpleicons.org/typescript/3178C6" },
    { name: "Tailwind CSS", iconUrl: "https://cdn.simpleicons.org/tailwindcss/38BDF8" },
    { name: "GitHub", iconUrl: "https://cdn.simpleicons.org/github/FFFFFF" },
    { name: "Vercel", iconUrl: "https://cdn.simpleicons.org/vercel/FFFFFF" },
    { name: "JavaScript", iconUrl: "https://cdn.simpleicons.org/javascript/F7DF1E" },
    { name: "React JS", iconUrl: "https://cdn.simpleicons.org/react/61DAFB" },
    { name: "TypeScript", iconUrl: "https://cdn.simpleicons.org/typescript/3178C6" },
    { name: "Tailwind CSS", iconUrl: "https://cdn.simpleicons.org/tailwindcss/38BDF8" },
    { name: "GitHub", iconUrl: "https://cdn.simpleicons.org/github/FFFFFF" },
    { name: "Vercel", iconUrl: "https://cdn.simpleicons.org/vercel/FFFFFF" },
    { name: "JavaScript", iconUrl: "https://cdn.simpleicons.org/javascript/F7DF1E" },
];

const TechCard = ({ tech }: { tech: TechItem }) => (
    <div className="flex w-28 shrink-0 flex-col items-center gap-3 rounded-2xl bg-slate-100 px-4 py-6 transition-colors duration-300 hover:-translate-y-1 hover:bg-slate-200 dark:bg-slate-900/70 dark:hover:bg-slate-900 sm:w-32">
        {/*
          Icon box background stays dark in both themes on purpose: a couple
          of the brand icons (GitHub, Vercel) are pinned to white (FFFFFF)
          and would disappear against a light card background.
        */}
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-800">
            <img
                src={tech.iconUrl}
                alt={tech.name}

                width={36}
                height={36}
                className="h-9 w-9 shrink-0 object-contain"
                draggable={false}
                loading="eager"
                decoding="async"
            />
        </div>
        <span className="text-sm font-semibold text-slate-900 transition-colors duration-300 dark:text-white">{tech.name}</span>
    </div>
);

export const TechAnimation = () => {
    return (
        <section className="w-full overflow-hidden bg-white px-6 py-20 transition-colors duration-300 dark:bg-slate-950 sm:px-10">
            <style>{`
        @keyframes tech-marquee {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-50%, 0, 0); }
        }
        .tech-marquee-track {
          animation: tech-marquee 25s linear infinite;
          will-change: transform;
        }
        .tech-marquee-track:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .tech-marquee-track {
            animation: none;
          }
        }
      `}</style>

            <div className="mx-auto max-w-5xl text-center">
                <h2 className="text-3xl font-extrabold text-slate-900 transition-colors duration-300 dark:text-white sm:text-4xl">
                    Built With Modern Tech
                </h2>
                <p className="mt-3 text-base text-slate-600 transition-colors duration-300 dark:text-slate-400 sm:text-lg">
                    Cutting-edge technologies powering Endora
                </p>
            </div>

            {/* Fading edges so the scroll looks like it enters/exits the section */}
            <div className="relative mt-14">
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent transition-colors duration-300 dark:from-slate-950 sm:w-28" />
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent transition-colors duration-300 dark:from-slate-950 sm:w-28" />
                <div className="flex w-max gap-4 tech-marquee-track sm:gap-6">
                    {/*
            Render the list THREE times back-to-back (not twice).
            With only two copies, on narrow/wide viewports the visible
            window can briefly show the "seam" where copy 1 ends and
            copy 2 begins, which reads as a flicker/snap. Three copies
            guarantees a full extra buffer on each side no matter the
            screen width, so the loop is seamless.
          */}
                    {[...techStack, ...techStack, ...techStack].map((tech, i) => (
                        <TechCard key={`${tech.name}-${i}`} tech={tech} />
                    ))}
                </div>
            </div>
        </section>
    );
};

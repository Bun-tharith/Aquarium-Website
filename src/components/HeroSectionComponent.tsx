type HeroSectionComponentProps = {
    searchQuery: string;
    onSearchChange: (query: string) => void;
};

export function HeroSectionComponent({ searchQuery, onSearchChange }: HeroSectionComponentProps) {
    return (
        <div className="lg:sticky lg:top-20 z-20 bg-slate-50 pb-2 pt-0 transition-colors duration-300 dark:bg-slate-900">
            <div className="relative h-36 w-full overflow-hidden rounded-2xl bg-slate-900 sm:h-44 lg:h-56 lg:rounded-3xl">
                <img
                    src="https://d3vnc3w6v6jm99.cloudfront.net/the-crore-club-chase--india-s-ai-talent-war-skews-salaries.webp"
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="relative flex h-full flex-col justify-center px-5 sm:px-8 lg:px-10">
                    <h1 className="text-xl font-extrabold leading-tight text-blue-400 drop-shadow-lg sm:text-2xl lg:text-4xl">
                        Question
                    </h1>
                    <h2 className="text-lg font-extrabold text-blue-300 drop-shadow-lg sm:text-xl lg:text-3xl">
                        And
                    </h2>
                    <h1 className="text-xl font-extrabold leading-tight text-blue-400 drop-shadow-lg sm:text-2xl lg:text-4xl">
                        Answer
                    </h1>
                </div>
            </div>

            <div className="mt-4 h-px w-full bg-slate-300 transition-colors duration-300 dark:bg-slate-700 lg:mt-6" />

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between lg:mt-6">
                <h3 className="text-lg font-bold text-blue-700 transition-colors duration-300 dark:text-blue-400 lg:text-xl">
                    Popular Question
                    {searchQuery && (
                        <span className="ml-2 block text-sm font-normal text-slate-500 dark:text-slate-400 sm:inline">
                            — results for "{searchQuery}"
                        </span>
                    )}
                </h3>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 transition-colors duration-300 dark:border-slate-700 dark:bg-slate-800 sm:w-64">
                        <svg className="h-4 w-4 shrink-0 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <circle cx={11} cy={11} r={7} />
                            <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full bg-transparent text-sm text-slate-600 outline-none placeholder:text-slate-400 dark:text-slate-200 dark:placeholder:text-slate-500"
                        />
                    </div>

                    <button className="flex w-fit items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 transition-colors duration-300 hover:bg-blue-50 dark:border-blue-800 dark:bg-transparent dark:text-blue-400 dark:hover:bg-slate-800">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
                        </svg>
                        Filters
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HeroSectionComponent;

export default function Loading() {
  return (
    <main className="artsy-background relative flex min-h-screen items-center justify-center overflow-hidden px-5">
      <div className="pointer-events-none absolute inset-0">
        <div className="art-grid absolute inset-0 opacity-25" />
        <div className="noise absolute inset-0" />
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-[#3B4895]/20 blur-[120px]" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#934C60]/20 blur-[120px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="relative flex h-24 w-24 items-center justify-center">
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#F0CA77] border-r-[#DE8A61]" />
          <div className="absolute inset-2 rounded-full border border-white/10" />
          <img
            src="/images/a-logo.png"
            alt="AKIVSOFT"
            className="h-14 w-14 animate-pulse object-contain"
          />
        </div>

        <h1 className="mt-7 font-ethnocentric text-lg tracking-[0.15em] text-[#F0CA77]">
          AKIVSOFT
        </h1>

        <div className="mt-8 flex items-center gap-2">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#F0CA77]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#DE8A61] [animation-delay:150ms]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#934C60] [animation-delay:300ms]" />
        </div>

        <p className="mt-4 text-xs text-[#C5BFD0]/70">
          Loading
        </p>
      </div>
    </main>
  );
}
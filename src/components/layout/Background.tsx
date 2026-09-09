export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="bg-grid absolute inset-0" />
      <div className="absolute top-[-18%] left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-royal-800/15 blur-3xl dark:bg-royal-800/25" />
      <div className="absolute top-[28%] -left-32 h-[360px] w-[360px] rounded-full bg-navy-800/20 blur-3xl dark:bg-blue-950/40" />
      <div className="absolute right-[-12%] bottom-[8%] h-[420px] w-[420px] rounded-full bg-slate-400/10 blur-3xl dark:bg-indigo-950/40" />
    </div>
  )
}

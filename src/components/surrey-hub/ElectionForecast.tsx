export default function ElectionForecast() {
  return (
    <section className="min-h-screen pt-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <div className="inline-block px-4 py-1 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 text-xs font-bold uppercase tracking-widest mb-6">
          Live Model
        </div>
        <h1 className="text-5xl font-extrabold text-white mb-8">2027 Election Forecast</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="glass-panel p-8 rounded-2xl border-l-4 border-yellow-500">
            <h3 className="text-xl font-bold text-white mb-2">West Surrey</h3>
            <div className="text-4xl font-bold text-yellow-400 mb-2">Lib Dem Hold</div>
            <p className="text-slate-400 text-sm">
              90% Probability. Woking debt anger focused on historic Conservative administration.
            </p>
          </div>
          <div className="glass-panel p-8 rounded-2xl border-l-4 border-purple-500">
            <h3 className="text-xl font-bold text-white mb-2">East Surrey</h3>
            <div className="text-4xl font-bold text-purple-400 mb-2">Hung Council</div>
            <p className="text-slate-400 text-sm">
              Residents' Associations vs Conservatives. High likelihood of deadlock.
            </p>
          </div>
          <div className="glass-panel p-8 rounded-2xl border-l-4 border-rose-500">
            <h3 className="text-xl font-bold text-white mb-2">Risk Factor</h3>
            <div className="text-4xl font-bold text-rose-400 mb-2">Tax Revolt</div>
            <p className="text-slate-400 text-sm">
              Runnymede & Elmbridge voters swinging to Independents due to harmonisation hikes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

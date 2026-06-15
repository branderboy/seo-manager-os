// Geo-grid rank heatmap. Lower rank = better = greener.
function rankColor(rank: number): string {
  if (rank <= 3) return "bg-emerald-500 text-white";
  if (rank <= 6) return "bg-emerald-300 text-emerald-900";
  if (rank <= 10) return "bg-amber-300 text-amber-900";
  if (rank <= 15) return "bg-orange-400 text-white";
  return "bg-rose-500 text-white";
}

export function GeoGrid({ grid }: { grid: number[][] }) {
  return (
    <div>
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${grid[0].length}, minmax(0, 1fr))` }}
      >
        {grid.flatMap((row, y) =>
          row.map((rank, x) => (
            <div
              key={`${x}-${y}`}
              className={`flex aspect-square items-center justify-center rounded-md text-xs font-semibold ${rankColor(
                rank
              )}`}
              title={`Avg rank ${rank}`}
            >
              {rank}
            </div>
          ))
        )}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-600">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-emerald-500" /> Top 3
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-amber-300" /> 7–10
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-rose-500" /> 15+
        </span>
        <span className="ml-auto text-slate-500">Center pin = headquarters</span>
      </div>
    </div>
  );
}

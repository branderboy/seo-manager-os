// Geo-grid rank heatmap. Lower rank = better = greener.
// The ramp still reads green to red. The fills carrying white text are darkened so the
// number on them clears 4.5:1; the two light fills keep dark text of the same hue.
function rankColor(rank: number): string {
  if (rank <= 3) return "bg-emerald-700 text-white";
  if (rank <= 6) return "bg-emerald-300 text-emerald-900";
  if (rank <= 10) return "bg-amber-300 text-amber-900";
  if (rank <= 15) return "bg-orange-700 text-white";
  return "bg-rose-700 text-white";
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
      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-700">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-emerald-700" /> Top 3
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-amber-300" /> 7 to 10
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-rose-700" /> 15+
        </span>
        <span className="ml-auto text-slate-600">Center pin = headquarters</span>
      </div>
    </div>
  );
}

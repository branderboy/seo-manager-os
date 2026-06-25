"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

const tooltip = {
  borderRadius: 10,
  border: "1px solid #e6e8ee",
  boxShadow: "0 8px 24px -12px rgba(16,24,40,0.2)",
  fontSize: 12,
  padding: "6px 10px",
};

export function DonutChart({ data }: { data: { name: string; value: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div className="relative h-[180px] w-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={58}
            outerRadius={84}
            paddingAngle={2}
            stroke="none"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="tnum text-2xl font-bold text-[var(--foreground)]">{total}</span>
        <span className="text-xs text-[var(--muted)]">total</span>
      </div>
    </div>
  );
}

export function TrafficArea({ data }: { data: { label: string; value: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={150}>
      <AreaChart data={data} margin={{ top: 6, right: 4, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="traffic" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#16b364" stopOpacity={0.28} />
            <stop offset="100%" stopColor="#16b364" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#9aa1b1" }} interval="preserveStartEnd" />
        <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "#9aa1b1" }} width={42} />
        <Tooltip contentStyle={tooltip} />
        <Area type="monotone" dataKey="value" stroke="#16b364" strokeWidth={2.5} fill="url(#traffic)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

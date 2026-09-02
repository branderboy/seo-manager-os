"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  LabelList,
} from "recharts";

const ACCENT = "#635bff";
const PALETTE = ["#635bff", "#10b981", "#f59e0b", "#f43f5e", "#0ea5e9", "#8b5cf6"];

const axis = { fontSize: 12, fill: "#94a3b8" };
const tooltipStyle = {
  borderRadius: 10,
  border: "1px solid #e9ecf2",
  boxShadow: "0 8px 24px -12px rgba(16,24,40,0.18)",
  fontSize: 12,
};

export function TrendChart({
  data,
  keys,
}: {
  data: Record<string, number | string>[];
  keys: { key: string; label: string; color: string }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={axis} />
        <YAxis tickLine={false} axisLine={false} tick={axis} domain={[0, 100]} />
        <Tooltip contentStyle={tooltipStyle} />
        {keys.map((k) => (
          <Line
            key={k.key}
            type="monotone"
            dataKey={k.key}
            name={k.label}
            stroke={k.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function AreaTrend({
  data,
  dataKey,
  height = 200,
}: {
  data: Record<string, number | string>[];
  dataKey: string;
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={ACCENT} stopOpacity={0.25} />
            <stop offset="100%" stopColor={ACCENT} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={axis} />
        <YAxis tickLine={false} axisLine={false} tick={axis} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={ACCENT}
          strokeWidth={2}
          fill="url(#areaFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function BarMini({
  data,
  dataKey = "value",
  labelKey = "label",
  height = 220,
  color = ACCENT,
  horizontal = false,
}: {
  data: Record<string, number | string>[];
  dataKey?: string;
  labelKey?: string;
  height?: number;
  color?: string;
  horizontal?: boolean;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart
        data={data}
        layout={horizontal ? "vertical" : "horizontal"}
        margin={{ top: 8, right: 12, left: horizontal ? 8 : -16, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" vertical={horizontal} horizontal={!horizontal} />
        {horizontal ? (
          <>
            <XAxis type="number" tickLine={false} axisLine={false} tick={axis} />
            <YAxis dataKey={labelKey} type="category" tickLine={false} axisLine={false} tick={axis} width={120} />
          </>
        ) : (
          <>
            <XAxis dataKey={labelKey} tickLine={false} axisLine={false} tick={axis} />
            <YAxis tickLine={false} axisLine={false} tick={axis} />
          </>
        )}
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f7f8fb" }} />
        <Bar dataKey={dataKey} fill={color} radius={horizontal ? [0, 6, 6, 0] : [6, 6, 0, 0]} barSize={horizontal ? 16 : 28} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DonutChart({
  data,
  height = 220,
}: {
  data: { label: string; value: number }[];
  height?: number;
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const description = data
    .map((d) => `${d.label} ${total > 0 ? Math.round((d.value / total) * 100) : 0}%`)
    .join(", ");

  return (
    // Recharts gives every sector role="img" with no accessible name. One name on the
    // chart, internals hidden: the same numbers are read out in the text beside it.
    <div role="img" aria-label={`Donut chart. ${description}.`} style={{ width: "100%" }}>
    <div aria-hidden="true">
    <ResponsiveContainer width="100%" height={height}>
      <PieChart tabIndex={-1}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          innerRadius={56}
          outerRadius={84}
          paddingAngle={2}
          stroke="none"
          rootTabIndex={-1}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
      </PieChart>
    </ResponsiveContainer>
    </div>
    </div>
  );
}

export function FunnelBars({
  data,
}: {
  data: { stage: string; value: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 28, left: 8, bottom: 0 }}>
        <XAxis type="number" hide domain={[0, 100]} />
        <YAxis dataKey="stage" type="category" tickLine={false} axisLine={false} tick={axis} width={120} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#f7f8fb" }} />
        <Bar dataKey="value" fill={ACCENT} radius={[0, 6, 6, 0]} barSize={22}>
          <LabelList dataKey="value" position="right" formatter={(v: number) => `${v}%`} style={{ fontSize: 12, fill: "#64748b" }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PriorityScatter({
  data,
}: {
  data: { id: string; name: string; impact: number; effort: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <ScatterChart margin={{ top: 16, right: 24, left: 0, bottom: 16 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" />
        <XAxis
          type="number"
          dataKey="effort"
          name="Effort"
          domain={[0, 100]}
          tickLine={false}
          axisLine={false}
          tick={axis}
          label={{ value: "Effort →", position: "insideBottomRight", offset: -8, fontSize: 12, fill: "#94a3b8" }}
        />
        <YAxis
          type="number"
          dataKey="impact"
          name="Impact"
          domain={[0, 100]}
          tickLine={false}
          axisLine={false}
          tick={axis}
          label={{ value: "Impact →", angle: -90, position: "insideTopLeft", fontSize: 12, fill: "#94a3b8" }}
        />
        <ReferenceLine x={50} stroke="#e2e8f0" />
        <ReferenceLine y={50} stroke="#e2e8f0" />
        <Tooltip
          contentStyle={tooltipStyle}
          cursor={{ strokeDasharray: "3 3" }}
          formatter={(value: number, name: string) => [value, name]}
        />
        <Scatter data={data} fill={ACCENT}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.impact >= 50 && d.effort < 50 ? "#635bff" : "#94a3b8"} />
          ))}
          <LabelList dataKey="name" position="top" style={{ fontSize: 11, fill: "#475569" }} />
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}

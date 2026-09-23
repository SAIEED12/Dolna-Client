"use client";

import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const SLICE_COLORS = {
  pending: "#78716c",
  confirmed: "#f59e0b",
  shipped: "#0ea5e9",
  delivered: "#10b981",
  cancelled: "#ef4444",
};

const FALLBACK_COLOR = "#e5e5e5";

export function OrdersStatusChart({ data }) {
  const rows = Array.isArray(data) ? data : [];
  const total = rows.reduce((sum, d) => sum + (Number(d.count) || 0), 0);

  return (
    <section
      aria-label="Orders by status"
      className="w-full overflow-hidden rounded-2xl border border-line bg-white shadow-sm shadow-black/5"
    >
      <div className="flex items-center justify-between border-b border-line px-5 py-4">
        <h3 className="font-serif text-lg text-ink">Orders by status (Last 30 days)</h3>
        <span className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-smoke">
          {total} total
        </span>
      </div>
      <div className="px-2 py-4">
        {total === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-smoke">
            No orders yet.
          </p>
        ) : (
          <div className="relative">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Tooltip
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e5e5e5",
                    fontSize: 12,
                  }}
                  formatter={(value, name) => {
                    const pct =
                      total > 0
                        ? Math.round((Number(value) / total) * 100)
                        : 0;
                    return [`${value} (${pct}%)`, name];
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: 12, color: "#8a8a8a" }}
                  formatter={(value, entry) =>
                    `${value} · ${entry?.payload?.count ?? 0}`
                  }
                />
                <Pie
                  data={rows}
                  dataKey="count"
                  nameKey="status"
                  innerRadius="62%"
                  outerRadius="85%"
                  paddingAngle={3}
                  stroke="#ffffff"
                  strokeWidth={2}
                >
                  {rows.map((entry) => (
                    <Cell
                      key={entry.status}
                      fill={SLICE_COLORS[entry.status] ?? FALLBACK_COLOR}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pb-10"
            >
              <span className="font-serif text-3xl text-ink tabular-nums">
                {total}
              </span>
              <span className="text-xs text-fog">orders</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

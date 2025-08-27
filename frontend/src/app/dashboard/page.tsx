import React from "react";
import DashboardLayout from "@/components/DashboardLayout";

// Simple bar chart using SVG (no external dependencies)
const BarChart = () => {
    const data = [
        { label: "Mon", value: 8 },
        { label: "Tue", value: 12 },
        { label: "Wed", value: 6 },
        { label: "Thu", value: 15 },
        { label: "Fri", value: 10 },
        { label: "Sat", value: 5 },
        { label: "Sun", value: 9 },
    ];
    const maxValue = Math.max(...data.map((d) => d.value));

    return (
        <div className="bg-white shadow rounded-lg p-6 w-full">
            <h2 className="text-xl font-semibold mb-4">Logs This Week</h2>
            <svg width="100%" height="120" viewBox="0 0 280 120">
                {data.map((d, i) => (
                    <g key={d.label}>
                        <rect
                            x={i * 40 + 20}
                            y={120 - (d.value / maxValue) * 90 - 20}
                            width={24}
                            height={(d.value / maxValue) * 90}
                            fill="#2563eb"
                            rx={4}
                        />
                        <text
                            x={i * 40 + 32}
                            y={110}
                            textAnchor="middle"
                            fontSize="12"
                            fill="#64748b"
                        >
                            {d.label}
                        </text>
                        <text
                            x={i * 40 + 32}
                            y={120 - (d.value / maxValue) * 90 - 26}
                            textAnchor="middle"
                            fontSize="12"
                            fill="#2563eb"
                            fontWeight="bold"
                        >
                            {d.value}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
};

// Simple line chart using SVG (no external dependencies)
const LineChart = () => {
    const data = [
        { label: "Week 1", value: 30 },
        { label: "Week 2", value: 45 },
        { label: "Week 3", value: 28 },
        { label: "Week 4", value: 60 },
    ];
    const maxValue = Math.max(...data.map((d) => d.value));

    // Calculate points for the polyline
    const points = data
        .map((d, i) => {
            const x = 40 + i * 60;
            const y = 100 - (d.value / maxValue) * 80;
            return `${x},${y}`;
        })
        .join(" ");

    return (
        <div className="bg-white shadow rounded-lg p-6 w-full">
            <h2 className="text-xl font-semibold mb-4">Weekly Error Trend</h2>
            <svg width="100%" height="120" viewBox="0 0 300 120">
                {/* Polyline for the line chart */}
                <polyline
                    fill="none"
                    stroke="#eab308"
                    strokeWidth="3"
                    points={points}
                />
                {/* Dots and labels */}
                {data.map((d, i) => {
                    const x = 40 + i * 60;
                    const y = 100 - (d.value / maxValue) * 80;
                    return (
                        <g key={d.label}>
                            <circle cx={x} cy={y} r={6} fill="#eab308" />
                            <text
                                x={x}
                                y={y - 12}
                                textAnchor="middle"
                                fontSize="12"
                                fill="#eab308"
                                fontWeight="bold"
                            >
                                {d.value}
                            </text>
                            <text
                                x={x}
                                y={112}
                                textAnchor="middle"
                                fontSize="12"
                                fill="#64748b"
                            >
                                {d.label}
                            </text>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

export default function DashboardPage() {
    return (
        <DashboardLayout>
            <main className="p-1">
                <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
                {/* Graphs in the first row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <BarChart />
                    <LineChart />
                </div>
                {/* Info cards in the next row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-2">Total Logs</h2>
                        <p className="text-3xl font-bold text-blue-600">12,345</p>
                    </div>
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-2">Errors Today</h2>
                        <p className="text-3xl font-bold text-red-600">23</p>
                    </div>
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-2">Warnings</h2>
                        <p className="text-3xl font-bold text-yellow-500">87</p>
                    </div>
                </div>
                <section className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Recent Log Entries</h2>
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr>
                                <th className="text-left py-2 px-4">Timestamp</th>
                                <th className="text-left py-2 px-4">Level</th>
                                <th className="text-left py-2 px-4">Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="py-2 px-4">2024-06-01 10:23:45</td>
                                <td className="py-2 px-4 text-red-600">ERROR</td>
                                <td className="py-2 px-4">Database connection failed</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4">2024-06-01 10:20:12</td>
                                <td className="py-2 px-4 text-yellow-500">WARNING</td>
                                <td className="py-2 px-4">High memory usage detected</td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4">2024-06-01 10:18:09</td>
                                <td className="py-2 px-4 text-blue-600">INFO</td>
                                <td className="py-2 px-4">User admin logged in</td>
                            </tr>
                        </tbody>
                    </table>
                </section>
            </main>
        </DashboardLayout>
    );
}
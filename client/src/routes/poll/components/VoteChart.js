import React from "react";
import "./index.css";
import { PieChart, Pie, ResponsiveContainer, Cell } from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#e317a2",
  "#051287",
  "#015e26"
];

export const getColor = index => {
  return COLORS[index % COLORS.length];
};

export const VoteChart = ({ data, colors }) => {
  return (
    <div className="chart">
      <ResponsiveContainer width="100%">
        <PieChart>
          <Pie data={data} dataKey="count">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(index)} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

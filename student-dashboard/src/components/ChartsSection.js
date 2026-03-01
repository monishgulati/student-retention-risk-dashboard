import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";

function ChartsSection({ students }) {

  if (!students || students.length === 0) return null;

  const highRisk = students.filter(s => Number(s.dropout_thought) === 1).length;
  const lowRisk = students.length - highRisk;

  const data = [
    { name: "Low Risk", value: lowRisk },
    { name: "High Risk", value: highRisk }
  ];

  const COLORS = ["#4CAF50", "#F44336"];

  return (
    <Card elevation={4} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Dropout Intention Distribution
        </Typography>

        <Box sx={{ width: "100%", maxWidth: 400, aspectRatio: "1 / 1", margin: "0 auto" }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius="80%"
                label
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ChartsSection;
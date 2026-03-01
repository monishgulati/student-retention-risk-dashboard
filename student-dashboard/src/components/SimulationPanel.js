import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent, Typography, Button, Select, MenuItem } from "@mui/material";
import GaugeChart from "react-gauge-chart";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

function SimulationPanel({ students }) {

  const [selectedStudent, setSelectedStudent] = useState("");
  const [result, setResult] = useState(null);

  const handlePredict = async () => {
    if (!selectedStudent) return;

    const response = await axios.post(
      "http://127.0.0.1:5000/predict",
      { name: selectedStudent.name }
    );

    setResult(response.data);
  };

  return (
    <div style={{ display: "flex", gap: "40px", marginTop: "20px" }}>

      {/* LEFT CARD */}
      <Card style={{ width: "300px", padding: "20px" }}>
        <CardContent>
          <Typography variant="h6">Select Student</Typography>

          <Select
            fullWidth
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            style={{ marginTop: "15px" }}
          >
            {students.map((student) => (
              <MenuItem key={student.name} value={student}>
                {student.name}
              </MenuItem>
            ))}
          </Select>

          <Button
            variant="contained"
            fullWidth
            style={{ marginTop: "20px" }}
            onClick={handlePredict}
          >
            Predict Risk
          </Button>
        </CardContent>
      </Card>

      {/* RIGHT SECTION */}
      {result && (
        <div style={{ display: "flex", gap: "40px" }}>

          {/* Probability Meter */}
          <Card style={{ width: "350px", padding: "20px" }}>
            <CardContent>
              <Typography variant="h6">Risk Probability</Typography>

              <GaugeChart
                id="risk-gauge"
                percent={result.probability}
                colors={["#4CAF50", "#FFC107", "#F44336"]}
                arcWidth={0.3}
                formatTextValue={() =>
                  `${(result.probability * 100).toFixed(2)}%`
                }
              />
            </CardContent>
          </Card>

          {/* Bar Comparison */}
          <Card style={{ width: "400px", padding: "20px" }}>
            <CardContent>
              <Typography variant="h6">Risk Comparison</Typography>

              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={[
                    { name: "Low", value: (1 - result.probability) * 100 },
                    { name: "High", value: result.probability * 100 }
                  ]}
                >
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#1976D2" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

        </div>
      )}
    </div>
  );
}

export default SimulationPanel;

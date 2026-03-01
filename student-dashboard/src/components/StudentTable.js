import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip
} from "@mui/material";

function StudentTable({ students }) {

  if (!students || students.length === 0) return null;

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>

        <Typography variant="h6" gutterBottom>
          Complete Student Dataset (Actual vs Predicted)
        </Typography>

        <div
          style={{
            maxHeight: "500px",
            overflowY: "auto",
            overflowX: "auto",
            border: "1px solid #ddd"
          }}
        >
          <Table sx={{ minWidth: 1600 }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Year</TableCell>
                <TableCell>Attendance</TableCell>
                <TableCell>Avg GPA</TableCell>
                <TableCell>Backlog Count</TableCell>
                <TableCell>Event Score</TableCell>

                <TableCell>Actual</TableCell>
                <TableCell>Predicted</TableCell>
                <TableCell>Probability</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {students.map((student, index) => {

                const actual = Number(student.dropout_thought);
                const predicted = Number(student.predicted_dropout);

                const isWrong = actual !== predicted;

                return (
                  <TableRow
                    key={index}
                    sx={{
                      backgroundColor: isWrong ? "#ffe6e6" : "inherit"
                    }}
                  >
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.age}</TableCell>
                    <TableCell>{student.gender}</TableCell>
                    <TableCell>{student.course}</TableCell>
                    <TableCell>{student.year}</TableCell>
                    <TableCell>{student.attendance}</TableCell>
                    <TableCell>{student.avg_gpa}</TableCell>
                    <TableCell>{student.backlog_count}</TableCell>
                    <TableCell>{student.event_score}</TableCell>

                    {/* Actual */}
                    <TableCell>
                      {actual === 1 ? (
                        <Chip label="High" color="error" />
                      ) : (
                        <Chip label="Low" color="success" />
                      )}
                    </TableCell>

                    {/* Predicted */}
                    <TableCell>
                      {predicted === 1 ? (
                        <Chip label="High" color="warning" />
                      ) : (
                        <Chip label="Low" color="info" />
                      )}
                    </TableCell>

                    {/* Probability */}
                    <TableCell>
                      {(Number(student.predicted_probability) * 100).toFixed(2)}%
                    </TableCell>

                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

      </CardContent>
    </Card>
  );
}

export default StudentTable;
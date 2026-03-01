from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ===============================
# LOAD MODEL + DATA
# ===============================

model = joblib.load(os.path.join(BASE_DIR, "student_retention_model.pkl"))

# IMPORTANT: Use processed file (contains predictions)
df_data = pd.read_csv(os.path.join(BASE_DIR, "processed_student_data.csv"))

features = [
    "attendance",
    "avg_gpa",
    "has_backlog",
    "backlog_count",
    "event_score",
    "gender",
    "course",
    "year",
    "age"
]

# ===============================
# GET ALL STUDENTS (WITH PREDICTIONS)
# ===============================
@app.route("/students", methods=["GET"])
def get_students():
    return df_data.to_json(orient="records")

# ===============================
# PREDICT SINGLE STUDENT
# ===============================
@app.route("/predict", methods=["POST"])
def predict():

    data = request.json
    name = data["name"]

    student = df_data[df_data["name"] == name]

    if student.empty:
        return jsonify({"error": "Student not found"})

    X_input = student[features]

    probability = model.predict_proba(X_input)[0][1]
    predicted_label = 1 if probability >= 0.5 else 0

    return jsonify({
        "probability": float(probability),
        "predicted_dropout": int(predicted_label)
    })

# ===============================
# RUN APP
# ===============================
if __name__ == "__main__":
    app.run(debug=True)
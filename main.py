import pandas as pd
import numpy as np
from sklearn.preprocessing import LabelEncoder
from train_model import train_model

# ===============================
# LOAD DATA
# ===============================

df = pd.read_csv("student_retention_realistic_names_5236.csv")

print("Initial Shape:", df.shape)

# Clean column names
df.columns = df.columns.str.strip().str.lower()

# ===============================
# HANDLE TARGET (SAFE)
# ===============================

if "dropout_thought" not in df.columns:
    raise ValueError("Target column 'dropout_thought' not found in dataset!")

df["dropout_thought"] = pd.to_numeric(df["dropout_thought"], errors="coerce")

# Drop rows where target is missing
df = df.dropna(subset=["dropout_thought"])

df["dropout_thought"] = df["dropout_thought"].astype(int)

print("After dropping missing target:", df.shape)
print("Target Distribution:\n", df["dropout_thought"].value_counts())

# ===============================
# HANDLE NUMERIC COLUMNS
# ===============================

numeric_cols = [
    "age", "attendance",
    "gpa_sem1", "gpa_sem2", "gpa_sem3",
    "gpa_sem4", "gpa_sem5",
    "backlog_count"
]

for col in numeric_cols:
    df[col] = pd.to_numeric(df[col], errors="coerce")

# Fill numeric nulls with median
df[numeric_cols] = df[numeric_cols].fillna(df[numeric_cols].median())

# ===============================
# FEATURE ENGINEERING
# ===============================

gpa_cols = ["gpa_sem1", "gpa_sem2", "gpa_sem3", "gpa_sem4", "gpa_sem5"]

df["avg_gpa"] = df[gpa_cols].mean(axis=1)

event_map = {
    "regularly": 3,
    "occasionally": 2,
    "rarely": 1,
    "never": 0
}

df["event_participation"] = df["event_participation"].astype(str).str.lower()
df["event_score"] = df["event_participation"].map(event_map).fillna(0)

df["has_backlog"] = np.where(df["backlog_count"] > 0, 1, 0)

# ===============================
# ENCODING CATEGORICAL VARIABLES
# ===============================

df_encoded = df.copy()

categorical_cols = ["gender", "course", "year"]

for col in categorical_cols:
    df_encoded[col] = LabelEncoder().fit_transform(df_encoded[col].astype(str))

# ===============================
# SELECT FEATURES
# ===============================

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

X = df_encoded[features]
y = df_encoded["dropout_thought"]

print("Final Dataset Shape:", X.shape)
print("Class Distribution:\n", y.value_counts())

# ===============================
# SAVE CLEAN FILES
# ===============================

df.to_csv("display_student_data.csv", index=False)
df_encoded.to_csv("processed_student_data.csv", index=False)

# ===============================
# TRAIN MODEL
# ===============================

model = train_model(X, y)

print("Model trained successfully!")
print("after cleaning:",df.shape)

# ===============================
# GENERATE PREDICTIONS FOR FULL DATASET
# ===============================

df_encoded["predicted_dropout"] = model.predict(X)
df_encoded["predicted_probability"] = model.predict_proba(X)[:, 1]

# Save updated files
df_encoded.to_csv("processed_student_data.csv", index=False)
df.to_csv("display_student_data.csv", index=False)

print("Predictions saved successfully!")
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix, roc_auc_score
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from xgboost import XGBClassifier
import joblib
import numpy as np


def evaluate_model(name, model, X_train, X_test, y_train, y_test):

    y_prob = model.predict_proba(X_test)[:, 1]

    # 🔥 Threshold tuning (Improves accuracy)
    threshold = 0.6
    y_pred = (y_prob >= threshold).astype(int)

    print(f"\n🔍 {name} Results (Threshold={threshold})")
    print("Accuracy:", accuracy_score(y_test, y_pred))
    print("Precision:", precision_score(y_test, y_pred))
    print("Recall:", recall_score(y_test, y_pred))
    print("F1 Score:", f1_score(y_test, y_pred))
    print("ROC-AUC:", roc_auc_score(y_test, y_prob))
    print("Confusion Matrix:\n", confusion_matrix(y_test, y_pred))

    return roc_auc_score(y_test, y_prob)


def train_model(X, y):

    X_train, X_test, y_train, y_test = train_test_split(
        X, y,
        test_size=0.25,
        random_state=42,
        stratify=y
    )

    neg = np.sum(y_train == 0)
    pos = np.sum(y_train == 1)
    scale_pos_weight = neg / pos if pos != 0 else 1

    # =============================
    # 1️⃣ Logistic Regression
    # =============================
    lr = Pipeline([
        ("scaler", StandardScaler()),
        ("model", LogisticRegression(
            max_iter=3000,
            class_weight="balanced",
            solver="liblinear"
        ))
    ])

    lr.fit(X_train, y_train)
    lr_auc = evaluate_model("Logistic Regression", lr, X_train, X_test, y_train, y_test)

    # =============================
    # 2️⃣ Random Forest
    # =============================
    rf = RandomForestClassifier(
        n_estimators=300,
        max_depth=10,
        min_samples_split=5,
        class_weight="balanced",
        random_state=42
    )

    rf.fit(X_train, y_train)
    rf_auc = evaluate_model("Random Forest", rf, X_train, X_test, y_train, y_test)

    # =============================
    # 3️⃣ XGBoost
    # =============================
    xgb = XGBClassifier(
        n_estimators=300,
        max_depth=6,
        learning_rate=0.05,
        subsample=0.9,
        colsample_bytree=0.8,
        scale_pos_weight=scale_pos_weight,
        eval_metric="logloss",
        use_label_encoder=False,
        random_state=42
    )

    xgb.fit(X_train, y_train)
    xgb_auc = evaluate_model("XGBoost", xgb, X_train, X_test, y_train, y_test)

    # =============================
    # Select Best Model (AUC Based)
    # =============================
    auc_scores = {
        "Logistic Regression": lr_auc,
        "Random Forest": rf_auc,
        "XGBoost": xgb_auc
    }

    best_model_name = max(auc_scores, key=auc_scores.get)

    if best_model_name == "Logistic Regression":
        best_model = lr
    elif best_model_name == "Random Forest":
        best_model = rf
    else:
        best_model = xgb

    print(f"\n🏆 Final Selected Model: {best_model_name}")

    joblib.dump(best_model, "student_retention_model.pkl")
    print("✅ Best Model Saved Successfully!")

    return best_model
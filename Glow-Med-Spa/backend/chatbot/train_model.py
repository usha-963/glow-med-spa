
import pandas as pd
import pickle
from pathlib import Path

from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.svm import LinearSVC
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix
)

# Project paths
BASE_DIR = Path(__file__).resolve().parent
DATASET_PATH = BASE_DIR / "dataset.csv"
MODEL_PATH = BASE_DIR / "trained_model.pkl"

# Load dataset
data = pd.read_csv(DATASET_PATH)

# Basic validation
data = data.dropna(subset=["text", "intent"])
data["text"] = data["text"].astype(str).str.strip()
data["intent"] = data["intent"].astype(str).str.strip()
data = data.drop_duplicates(subset=["text"])

if data["intent"].nunique() < 2:
    raise ValueError("Dataset must contain at least two intent categories.")

counts = data["intent"].value_counts()

if counts.min() < 3:
    raise ValueError(
        "Each intent needs at least 3 examples for this training setup."
    )

X = data["text"]
y = data["intent"]

# Keep examples from every intent in both sets
X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)

# TF-IDF + classifier pipeline
pipeline = Pipeline([
    ("tfidf", TfidfVectorizer(
        lowercase=True,
        ngram_range=(1, 2),
        strip_accents="unicode"
    )),
    ("classifier", LogisticRegression(
        max_iter=2000,
        class_weight="balanced"
    ))
])

# Tune parameters
parameter_grid = [
    {
        "tfidf__ngram_range": [(1, 1), (1, 2)],
        "tfidf__min_df": [1, 2],
        "classifier": [LogisticRegression(
            max_iter=2000,
            class_weight="balanced"
        )],
        "classifier__C": [0.5, 1, 2, 5]
    },
    {
        "tfidf__ngram_range": [(1, 1), (1, 2)],
        "tfidf__min_df": [1, 2],
        "classifier": [LinearSVC(
            class_weight="balanced"
        )],
        "classifier__C": [0.5, 1, 2, 5]
    }
]

# Use a stratified cross-validation setup
search = GridSearchCV(
    estimator=pipeline,
    param_grid=parameter_grid,
    cv=3,
    scoring="f1_macro",
    n_jobs=-1,
    verbose=1
)

print("\nTraining and tuning chatbot model...\n")

search.fit(X_train, y_train)

best_model = search.best_estimator_

# Evaluate on held-out test data
predictions = best_model.predict(X_test)

print("\nBest parameters:")
print(search.best_params_)

print("\nCross-validation macro F1:")
print(round(search.best_score_, 4))

print("\nTest accuracy:")
print(round(accuracy_score(y_test, predictions), 4))

print("\nClassification report:")
print(classification_report(
    y_test,
    predictions,
    zero_division=0
))

print("\nConfusion matrix:")
print(confusion_matrix(
    y_test,
    predictions,
    labels=sorted(y.unique())
))

# Save trained model and intent labels
with open(MODEL_PATH, "wb") as file:
    pickle.dump({
        "model": best_model,
        "intents": sorted(y.unique())
    }, file)

print(f"\nModel saved successfully: {MODEL_PATH}")

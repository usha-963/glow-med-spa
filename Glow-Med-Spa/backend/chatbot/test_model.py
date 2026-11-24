
import pickle
from pathlib import Path

MODEL_PATH = Path(__file__).parent / "trained_model.pkl"

with open(MODEL_PATH, "rb") as file:
    saved_data = pickle.load(file)

# Extract the actual trained model
if isinstance(saved_data, dict):
    print("Saved model keys:", list(saved_data.keys()))

    model = next(
        (value for value in saved_data.values()
         if hasattr(value, "predict")),
        None
    )
else:
    model = saved_data

if model is None:
    raise ValueError("Could not find the trained model inside the pickle file.")

print("\nGlow Med Spa Chatbot - Model Testing")
print("Type 'exit' to stop.\n")

while True:
    question = input("You: ").strip()

    if question.lower() == "exit":
        print("Testing completed!")
        break

    if not question:
        continue

    prediction = model.predict([question])[0]

    print("Predicted intent:", prediction)
    print()

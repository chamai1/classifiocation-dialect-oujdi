from pathlib import Path
import joblib


BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "models" / "baseline_model.pkl"
VECTORIZER_PATH = BASE_DIR / "models" / "tfidf_vectorizer.pkl"


def predict_text(text):
    model = joblib.load(MODEL_PATH)
    vectorizer = joblib.load(VECTORIZER_PATH)

    text_vectorized = vectorizer.transform([text])
    prediction = model.predict(text_vectorized)[0]
    probabilities = model.predict_proba(text_vectorized)[0]

    classes = model.classes_
    max_prob = max(probabilities)

    print("\nText:", text)

    if max_prob < 0.60:
        print("Prediction: uncertain")
        print("Closest label:", prediction)
    else:
        print("Prediction:", prediction)

    print("\nProbabilities:")
    for label, prob in zip(classes, probabilities):
        print(f"{label}: {prob:.4f}")


if __name__ == "__main__":
    while True:
        text = input("\nEnter a Darija phrase, or type exit: ")

        if text.lower() == "exit":
            break

        predict_text(text)
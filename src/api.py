from flask import Flask, request, jsonify
from flask_cors import CORS

import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from peft import PeftModel

app = Flask(__name__)
CORS(app)

BASE_MODEL = "distilbert-base-multilingual-cased"
LORA_PATH = "models/transformer_lora/checkpoint-20000"

print("Loading tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL, use_fast=False)

print("Loading base model...")
base_model = AutoModelForSequenceClassification.from_pretrained(
    BASE_MODEL,
    num_labels=2
)

print("Loading LoRA adapter...")
model = PeftModel.from_pretrained(base_model, LORA_PATH)
model.eval()

id2label = {
    0: "moroccan",
    1: "oujdi"
}

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "model": "distilbert_lora_checkpoint_20000"
    })

@app.route("/classify", methods=["POST"])
def classify():
    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({"error": "Text is required"}), 400

    text = data["text"].strip()

    if not text:
        return jsonify({"error": "Text is empty"}), 400

    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=128
    )

    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.softmax(outputs.logits, dim=-1)[0]

    pred_id = int(torch.argmax(probs).item())
    pred_label = id2label[pred_id]
    confidence = float(probs[pred_id].item())

    probabilities = {
        id2label[i]: float(probs[i].item())
        for i in range(len(probs))
    }

    return jsonify({
        "text": text,
        "label": pred_label,
        "confidence": confidence,
        "probabilities": probabilities
    })

if __name__ == "__main__":
    print("Starting Flask API on port 5001...")
    app.run(host="127.0.0.1", port=5001, debug=True)
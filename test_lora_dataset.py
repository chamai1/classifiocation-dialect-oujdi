import pandas as pd
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
from peft import PeftModel

BASE_MODEL = "distilbert-base-multilingual-cased"
LORA_PATH = "models/transformer_lora/checkpoint-20000"

id2label = {0: "moroccan", 1: "oujdi"}

tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL, use_fast=False)

base_model = AutoModelForSequenceClassification.from_pretrained(
    BASE_MODEL,
    num_labels=2
)

model = PeftModel.from_pretrained(base_model, LORA_PATH)
model.eval()

df = pd.read_csv("data/dataset.csv")

samples = pd.concat([
    df[df["label"] == "oujdi"].head(10),
    df[df["label"] == "moroccan"].head(10)
])

for _, row in samples.iterrows():
    text = str(row["text"])
    true_label = row["label"]

    inputs = tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=128
    )

    with torch.no_grad():
        logits = model(**inputs).logits
        probs = torch.softmax(logits, dim=-1)[0]

    pred_id = int(torch.argmax(probs))
    pred_label = id2label[pred_id]

    print("TEXT:", text)
    print("TRUE:", true_label, "| PRED:", pred_label, "| PROBS:", probs.tolist())
    print("-" * 80)

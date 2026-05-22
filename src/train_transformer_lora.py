import numpy as np
import pandas as pd
from pathlib import Path

import torch
from datasets import Dataset
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_recall_fscore_support, classification_report, confusion_matrix

from transformers import (
    AutoTokenizer,
    AutoModelForSequenceClassification,
    TrainingArguments,
    Trainer,
)

from peft import LoraConfig, get_peft_model, TaskType


BASE_DIR = Path(__file__).resolve().parent.parent
DATASET_PATH = BASE_DIR / "data" / "dataset.csv"
MODEL_DIR = BASE_DIR / "models" / "transformer_lora"

MODEL_NAME = "distilbert-base-multilingual-cased"

# 50k + 50k = 100k
SAMPLE_PER_CLASS = 50000

MAX_LENGTH = 128
EPOCHS = 2
BATCH_SIZE = 8
LEARNING_RATE = 2e-4


def compute_metrics(eval_pred):
    logits, labels = eval_pred
    preds = np.argmax(logits, axis=1)

    precision, recall, f1, _ = precision_recall_fscore_support(
        labels,
        preds,
        average="weighted",
        zero_division=0
    )

    acc = accuracy_score(labels, preds)

    return {
        "accuracy": acc,
        "precision": precision,
        "recall": recall,
        "f1": f1
    }


def main():
    MODEL_DIR.mkdir(parents=True, exist_ok=True)

    df = pd.read_csv(DATASET_PATH)

    print("Original dataset shape:", df.shape)
    print(df["label"].value_counts())

    # Balance and sample
    df_moroccan = df[df["label"] == "moroccan"].sample(
        n=SAMPLE_PER_CLASS,
        random_state=42
    )

    df_oujdi = df[df["label"] == "oujdi"].sample(
        n=SAMPLE_PER_CLASS,
        random_state=42
    )

    df = pd.concat([df_moroccan, df_oujdi], ignore_index=True)
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)

    df["label_id"] = df["label"].map({
        "moroccan": 0,
        "oujdi": 1
    })

    print("\nUsed dataset shape:", df.shape)
    print(df["label"].value_counts())

    # Train / validation / test
    train_df, temp_df = train_test_split(
        df,
        test_size=0.2,
        random_state=42,
        stratify=df["label_id"]
    )

    val_df, test_df = train_test_split(
        temp_df,
        test_size=0.5,
        random_state=42,
        stratify=temp_df["label_id"]
    )

    print("\nTrain:", train_df.shape)
    print("Validation:", val_df.shape)
    print("Test:", test_df.shape)

    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)

    def tokenize_function(batch):
        return tokenizer(
            batch["text"],
            truncation=True,
            padding="max_length",
            max_length=MAX_LENGTH
        )

    train_dataset = Dataset.from_pandas(train_df[["text", "label_id"]])
    val_dataset = Dataset.from_pandas(val_df[["text", "label_id"]])
    test_dataset = Dataset.from_pandas(test_df[["text", "label_id"]])

    train_dataset = train_dataset.rename_column("label_id", "labels")
    val_dataset = val_dataset.rename_column("label_id", "labels")
    test_dataset = test_dataset.rename_column("label_id", "labels")

    train_dataset = train_dataset.map(tokenize_function, batched=True)
    val_dataset = val_dataset.map(tokenize_function, batched=True)
    test_dataset = test_dataset.map(tokenize_function, batched=True)

    train_dataset.set_format(
        type="torch",
        columns=["input_ids", "attention_mask", "labels"]
    )

    val_dataset.set_format(
        type="torch",
        columns=["input_ids", "attention_mask", "labels"]
    )

    test_dataset.set_format(
        type="torch",
        columns=["input_ids", "attention_mask", "labels"]
    )

    model = AutoModelForSequenceClassification.from_pretrained(
        MODEL_NAME,
        num_labels=2
    )

    # LoRA configuration for DistilBERT attention layers
    lora_config = LoraConfig(
        task_type=TaskType.SEQ_CLS,
        r=8,
        lora_alpha=16,
        lora_dropout=0.1,
        bias="none",
        target_modules=["q_lin", "v_lin"]
    )

    model = get_peft_model(model, lora_config)

    print("\nTrainable parameters:")
    model.print_trainable_parameters()

    training_args = TrainingArguments(
        output_dir=str(MODEL_DIR),
        num_train_epochs=EPOCHS,
        per_device_train_batch_size=BATCH_SIZE,
        per_device_eval_batch_size=BATCH_SIZE,
        learning_rate=LEARNING_RATE,
        weight_decay=0.01,
        eval_strategy="epoch",
        save_strategy="epoch",
        logging_steps=100,
        load_best_model_at_end=True,
        metric_for_best_model="f1",
        greater_is_better=True,
        report_to="none",
        fp16=torch.cuda.is_available()
    )

    trainer = Trainer(
        model=model,
        args=training_args,
        train_dataset=train_dataset,
        eval_dataset=val_dataset,
        compute_metrics=compute_metrics
    )

    trainer.train(resume_from_checkpoint="models/transformer_lora/checkpoint-10000")

    print("\nValidation evaluation:")
    print(trainer.evaluate(val_dataset))

    print("\nTest evaluation:")
    test_results = trainer.predict(test_dataset)

    logits = test_results.predictions
    y_true = test_results.label_ids
    y_pred = np.argmax(logits, axis=1)

    print("\nClassification report:")
    print(classification_report(
        y_true,
        y_pred,
        target_names=["moroccan", "oujdi"]
    ))

    print("\nConfusion matrix:")
    print(confusion_matrix(y_true, y_pred))

    trainer.save_model(str(MODEL_DIR))
    tokenizer.save_pretrained(str(MODEL_DIR))

    print("\nTransformer LoRA model saved to:", MODEL_DIR)


if __name__ == "__main__":
    main()
import pandas as pd
from pathlib import Path

import tensorflow as tf
from tensorflow.keras import layers
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix


BASE_DIR = Path(__file__).resolve().parent.parent
DATASET_PATH = BASE_DIR / "data" / "dataset.csv"
MODEL_DIR = BASE_DIR / "models"

WEIGHTS_PATH = MODEL_DIR / "deep_learning_model.weights.h5"
VOCAB_PATH = MODEL_DIR / "dl_vectorizer_vocab.txt"

MAX_TOKENS = 20000
SEQUENCE_LENGTH = 80
BATCH_SIZE = 32
EPOCHS = 3


def main():
    MODEL_DIR.mkdir(exist_ok=True)

    df = pd.read_csv(DATASET_PATH)

    print("Dataset shape:", df.shape)
    print(df["label"].value_counts())

    # Texts as Python strings
    X = df["text"].astype(str).tolist()

    # Labels: moroccan = 0, oujdi = 1
    y = df["label"].map({
        "moroccan": 0,
        "oujdi": 1
    }).astype("int32").tolist()

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y
    )

    # Convert to TensorFlow datasets
    train_ds = tf.data.Dataset.from_tensor_slices((X_train, y_train))
    test_ds = tf.data.Dataset.from_tensor_slices((X_test, y_test))

    train_ds = train_ds.shuffle(10000).batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)
    test_ds = test_ds.batch(BATCH_SIZE).prefetch(tf.data.AUTOTUNE)

    # Vectorization layer
    vectorizer = layers.TextVectorization(
        max_tokens=MAX_TOKENS,
        output_mode="int",
        output_sequence_length=SEQUENCE_LENGTH
    )

    # Adapt only on training texts
    text_only_ds = tf.data.Dataset.from_tensor_slices(X_train).batch(BATCH_SIZE)
    vectorizer.adapt(text_only_ds)

    # Deep Learning model: Embedding + BiLSTM
    model = tf.keras.Sequential([
        vectorizer,

        layers.Embedding(
            input_dim=MAX_TOKENS,
            output_dim=128,
            mask_zero=True
        ),

        layers.Bidirectional(layers.LSTM(64)),

        layers.Dropout(0.4),

        layers.Dense(64, activation="relu"),

        layers.Dropout(0.3),

        layers.Dense(1, activation="sigmoid")
    ])

    model.compile(
        optimizer="adam",
        loss="binary_crossentropy",
        metrics=["accuracy"]
    )

    history = model.fit(
        train_ds,
        epochs=EPOCHS,
        validation_data=test_ds
    )

    loss, accuracy = model.evaluate(test_ds)

    print("\nTest accuracy:")
    print(accuracy)

    y_prob = model.predict(test_ds)
    y_pred = (y_prob >= 0.5).astype(int).reshape(-1)

    print("\nClassification report:")
    print(classification_report(
        y_test,
        y_pred,
        target_names=["moroccan", "oujdi"]
    ))

    print("\nConfusion matrix:")
    print(confusion_matrix(y_test, y_pred))

    # Save model weights
    model.save_weights(WEIGHTS_PATH)

    # Save vectorizer vocabulary with UTF-8 to avoid Arabic encoding problem
    vocab = vectorizer.get_vocabulary()
    with open(VOCAB_PATH, "w", encoding="utf-8") as f:
        for token in vocab:
            f.write(token + "\n")

    print("\nDeep learning weights saved to:", WEIGHTS_PATH)
    print("Vectorizer vocabulary saved to:", VOCAB_PATH)


if __name__ == "__main__":
    main()
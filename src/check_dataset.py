import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATASET_PATH = BASE_DIR / "data" / "dataset.csv"

df = pd.read_csv(DATASET_PATH)

print("Shape:", df.shape)
print("\nLabels:")
print(df["label"].value_counts())

print("\nMissing values:")
print(df.isnull().sum())

print("\nDuplicated texts:")
print(df["text"].duplicated().sum())

print("\nText length statistics:")
df["length"] = df["text"].astype(str).apply(len)
print(df.groupby("label")["length"].describe())

print("\nSample Moroccan:")
print(df[df["label"] == "moroccan"].sample(10, random_state=1)["text"].to_string(index=False))

print("\nSample Oujdi:")
print(df[df["label"] == "oujdi"].sample(10, random_state=1)["text"].to_string(index=False))
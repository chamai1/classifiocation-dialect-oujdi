import zipfile
import pandas as pd
import json
import re
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

DODA_ZIP = BASE_DIR / "dataset-main.zip"
OUJDI_ZIP = BASE_DIR / "oujdi_dz_220k.zip"

OUTPUT_FILE = DATA_DIR / "dataset.csv"

# 50k moroccan + 50k oujdi = 100k total
FINAL_PER_CLASS = 50000


def clean_text(text):
    if pd.isna(text):
        return ""

    text = str(text).strip()
    text = " ".join(text.split())

    return text


def is_valid_darija_text(text):
    if not text:
        return False

    # نخليو الجمل قصيرة ومتوسطة
    if len(text) < 3 or len(text) > 150:
        return False

    has_arabic = re.search(r"[\u0600-\u06FF]", text) is not None
    has_latin = re.search(r"[A-Za-z]", text) is not None

    # نقبلو Arabic أو Latin
    if not has_arabic and not has_latin:
        return False

    return True


def detect_script(text):
    has_arabic = re.search(r"[\u0600-\u06FF]", str(text)) is not None
    has_latin = re.search(r"[A-Za-z]", str(text)) is not None

    if has_arabic and has_latin:
        return "mixed"
    elif has_arabic:
        return "arabic"
    elif has_latin:
        return "latin"
    else:
        return "other"


def load_moroccan_from_doda():
    rows = []

    with zipfile.ZipFile(DODA_ZIP, "r") as z:
        csv_path = None

        for name in z.namelist():
            if name.endswith("sentences/sentences.csv"):
                csv_path = name
                break

        if csv_path is None:
            raise FileNotFoundError("sentences/sentences.csv not found in DODa zip")

        with z.open(csv_path) as f:
            df = pd.read_csv(f)

    print("DODa columns:", df.columns.tolist())

    # ناخدو بجوج: Arabic + Latin
    text_columns = []

    if "darija_ar" in df.columns:
        text_columns.append("darija_ar")

    if "darija" in df.columns:
        text_columns.append("darija")

    if not text_columns:
        raise ValueError("No Darija columns found in DODa")

    for col in text_columns:
        for text in df[col].dropna():
            text = clean_text(text)

            if is_valid_darija_text(text):
                rows.append({
                    "text": text,
                    "label": "moroccan"
                })

    return rows


def load_oujdi():
    rows = []

    with zipfile.ZipFile(OUJDI_ZIP, "r") as z:
        jsonl_path = None

        for name in z.namelist():
            if name.endswith(".jsonl"):
                jsonl_path = name
                break

        if jsonl_path is None:
            raise FileNotFoundError("No .jsonl file found in Oujdi zip")

        with z.open(jsonl_path) as f:
            for line in f:
                item = json.loads(line.decode("utf-8"))

                # output = Oujdi Arabic
                # wjdi_lat = Oujdi Latin
                for field in ["output", "wjdi_lat"]:
                    text = item.get(field, "")
                    text = clean_text(text)

                    if is_valid_darija_text(text):
                        rows.append({
                            "text": text,
                            "label": "oujdi"
                        })

    return rows


def main():
    DATA_DIR.mkdir(exist_ok=True)

    moroccan_rows = load_moroccan_from_doda()
    oujdi_rows = load_oujdi()

    df_moroccan = pd.DataFrame(moroccan_rows).drop_duplicates(subset=["text"])
    df_oujdi = pd.DataFrame(oujdi_rows).drop_duplicates(subset=["text"])

    print("Moroccan unique rows:", len(df_moroccan))
    print("Oujdi unique rows:", len(df_oujdi))

    if len(df_moroccan) < FINAL_PER_CLASS:
        raise ValueError(
            f"Not enough Moroccan data. Found only {len(df_moroccan)}, needed {FINAL_PER_CLASS}"
        )

    if len(df_oujdi) < FINAL_PER_CLASS:
        raise ValueError(
            f"Not enough Oujdi data. Found only {len(df_oujdi)}, needed {FINAL_PER_CLASS}"
        )

    df_moroccan = df_moroccan.sample(n=FINAL_PER_CLASS, random_state=42)
    df_oujdi = df_oujdi.sample(n=FINAL_PER_CLASS, random_state=42)

    df = pd.concat([df_moroccan, df_oujdi], ignore_index=True)
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)

    df["script"] = df["text"].apply(detect_script)

    df.to_csv(OUTPUT_FILE, index=False, encoding="utf-8-sig")

    print("\nDataset saved to:", OUTPUT_FILE)

    print("\nShape:")
    print(df.shape)

    print("\nLabels:")
    print(df["label"].value_counts())

    print("\nScripts:")
    print(df["script"].value_counts())

    print("\nScripts by label:")
    print(pd.crosstab(df["label"], df["script"]))


if __name__ == "__main__":
    main()
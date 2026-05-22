from sklearn.metrics import ConfusionMatrixDisplay
import matplotlib.pyplot as plt
import numpy as np

cm = np.array([
    [4897, 103],
    [130, 4870]
])

labels = ["Moroccan", "Oujdi"]

disp = ConfusionMatrixDisplay(
    confusion_matrix=cm,
    display_labels=labels
)

fig, ax = plt.subplots(figsize=(7, 7))
disp.plot(ax=ax, cmap="Purples", values_format="d", colorbar=True)

plt.title("Confusion Matrix - DistilBERT + LoRA", fontsize=16)
plt.xlabel("Predicted label")
plt.ylabel("True label")

plt.savefig("confusion_matrix_real.png", dpi=300, bbox_inches="tight")
plt.show()
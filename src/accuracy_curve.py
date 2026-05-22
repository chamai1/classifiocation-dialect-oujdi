import matplotlib.pyplot as plt

epochs = [1, 2]

train_acc = [0.92, 0.98]
val_acc = [0.9722, 0.9759]

plt.figure(figsize=(8,5))

plt.plot(epochs, train_acc, marker='o', linewidth=3, label='Train Accuracy')
plt.plot(epochs, val_acc, marker='o', linewidth=3, label='Validation Accuracy')

plt.title("Accuracy Curve - DistilBERT + LoRA", fontsize=16)
plt.xlabel("Epoch")
plt.ylabel("Accuracy")

plt.xticks(epochs)

plt.legend()
plt.grid(True, linestyle='--', alpha=0.5)

plt.savefig("accuracy_curve.png", dpi=300, bbox_inches='tight')

plt.show()
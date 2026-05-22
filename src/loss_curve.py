import matplotlib.pyplot as plt

epochs = [1, 2]

train_loss = [0.5565, 0.0401]
val_loss = [0.0888, 0.0806]

plt.figure(figsize=(8,5))

plt.plot(epochs, train_loss, marker='o', linewidth=3, label='Train Loss')
plt.plot(epochs, val_loss, marker='o', linewidth=3, label='Validation Loss')

plt.title("Loss Curve - DistilBERT + LoRA", fontsize=16)
plt.xlabel("Epoch", fontsize=13)
plt.ylabel("Loss", fontsize=13)

plt.xticks(epochs)

plt.legend()
plt.grid(True, linestyle='--', alpha=0.5)

plt.savefig("loss_curve.png", dpi=300, bbox_inches='tight')

plt.show()
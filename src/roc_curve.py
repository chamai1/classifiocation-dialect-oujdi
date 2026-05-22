from sklearn.metrics import roc_curve, auc
import matplotlib.pyplot as plt
import numpy as np

y_true = np.random.randint(0,2,1000)
y_scores = np.random.rand(1000)

fpr, tpr, _ = roc_curve(y_true, y_scores)
roc_auc = auc(fpr, tpr)

plt.figure(figsize=(7,7))

plt.plot(fpr, tpr, linewidth=3, label=f'AUC = {roc_auc:.2f}')
plt.plot([0,1],[0,1],'--')

plt.xlabel("False Positive Rate")
plt.ylabel("True Positive Rate")

plt.title("ROC Curve")

plt.legend(loc="lower right")

plt.grid(alpha=.3)

plt.savefig("roc_curve.png", dpi=300, bbox_inches='tight')

plt.show()
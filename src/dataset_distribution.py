import matplotlib.pyplot as plt

labels = ['Oujdi', 'Moroccan']
sizes = [50000, 50000]

plt.figure(figsize=(6,6))

plt.pie(
    sizes,
    labels=labels,
    autopct='%1.1f%%',
    startangle=90
)

plt.title("Dataset Distribution")

plt.savefig("dataset_distribution.png", dpi=300, bbox_inches='tight')

plt.show()
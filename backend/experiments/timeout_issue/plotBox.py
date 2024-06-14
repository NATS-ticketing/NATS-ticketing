# 只是用來畫圖的
import matplotlib.pyplot as plt

# Original data
original_duration = {
    'avg': 1.48,
    'min': 0.48,
    'med': 1.40,
    'max': 4.23,
    'p(90)': 2.20,
    'p(95)': 2.46
}

# After data
after_duration = {
    'avg': 0.77,
    'min': 0.57,
    'med': 0.71,
    'max': 1.62,
    'p(90)': 0.94,
    'p(95)': 1.38
}

# Prepare data for box plot
data_before = [original_duration['min'], original_duration['med'], original_duration['avg'], original_duration['p(90)'], original_duration['p(95)'], original_duration['max']]
data_after = [after_duration['min'], after_duration['med'], after_duration['avg'], after_duration['p(90)'], after_duration['p(95)'], after_duration['max']]

# Combine data into a list of lists
data = [data_before, data_after]

# Create box plot
fig, ax = plt.subplots()
ax.boxplot(data, patch_artist=True, labels=['Before', 'After'])
ax.set_title('Request-Reply Duration Comparison')
ax.set_ylabel('Duration (s)')

# Show plot
plt.show()
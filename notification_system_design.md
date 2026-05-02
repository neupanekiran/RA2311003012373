# Stage 1: Priority Inbox Notification System Design

## Overview
As the campus notifications application grows in usage, users face a high volume of notifications, making it difficult to keep track of important updates. To solve this, we are introducing a **Priority Inbox** feature that efficiently displays the top `n` most important unread notifications based on a predefined weighting strategy and recency.

## Priority Logic
The priority of a notification is determined by two main factors, evaluated in the following order:
1. **Weight (Type):** Notifications are categorized and weighted as follows:
   - `Placement` (Highest Priority)
   - `Result` (Medium Priority)
   - `Event` (Lowest Priority)
2. **Recency (Timestamp):** If two notifications share the same weight, the more recent notification (latest timestamp) takes precedence.

## Efficiently Maintaining the Top 10
Since new notifications will continually stream into the system, sorting the entire dataset of notifications every time a new one arrives would be inefficient (`O(N log N)` time complexity). 

To efficiently maintain the top 10 (or top `n`) priority notifications, the most optimal data structure is a **Min-Heap (Priority Queue)** of size `n`.

### Approach:
1. Initialize an empty Min-Heap.
2. Iterate through the incoming stream of unread notifications.
3. For each notification, calculate its priority score based on its Type weight and Timestamp.
4. If the heap has fewer than `n` elements, insert the notification.
5. If the heap already has `n` elements, compare the current notification with the root of the Min-Heap (which represents the *lowest* priority notification currently in the top `n`):
   - If the new notification has a **higher** priority than the root, remove the root and insert the new notification.
   - If the new notification has a **lower** priority, discard it.
6. Once all notifications are processed (or continuously as they stream in), the heap will contain exactly the top `n` most important notifications.

### Complexity:
- **Time Complexity:** Inserting or replacing an element in a Min-Heap of size `n` takes `O(log n)`. For `N` total notifications, the overall time complexity is `O(N log n)`. For `n = 10`, `log 10` is a small constant, effectively making the time complexity **`O(N)`**. This is highly scalable for large volumes of incoming notifications.
- **Space Complexity:** The heap only ever stores exactly `n` elements, resulting in a space complexity of **`O(n)`**, ensuring minimal memory overhead.

## Frontend Implementation Details
For the frontend logic (TypeScript/JavaScript), since standard JS lacks a built-in Heap data structure, maintaining a constantly sorted array of size `n` (`O(n)` per insertion) is often acceptable given that `n` is small (e.g., 10). However, the conceptual design outlined above models the optimal theoretical approach for a backend streaming service or heavy data load.

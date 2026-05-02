export interface Notification {
  ID: string;
  Type: "Event" | "Result" | "Placement";
  Message: string;
  Timestamp: string;
}

const TYPE_WEIGHTS: Record<Notification["Type"], number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

/**
 * Returns the top N priority notifications based on weight (Placement > Result > Event)
 * and recency (most recent first if weights are equal).
 */
export function getTopPriorityNotifications(notifications: Notification[], limit: number = 10): Notification[] {
  const sorted = [...notifications].sort((a, b) => {
    const weightA = TYPE_WEIGHTS[a.Type] || 0;
    const weightB = TYPE_WEIGHTS[b.Type] || 0;

    if (weightA !== weightB) {
      return weightB - weightA; // Higher weight comes first
    }

    // If weights are equal, sort by Timestamp descending
    const timeA = new Date(a.Timestamp).getTime();
    const timeB = new Date(b.Timestamp).getTime();

    return timeB - timeA; 
  });

  return sorted.slice(0, limit);
}

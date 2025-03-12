export default function getDate () {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = today.getFullYear();
    return `${day}-${month}-${year}`;
  }

  export function formatKronosDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear().toString();
  
    return `${day}-${month}-${year}`;
  }

  export function formatTimestamp(timestamp: string): string {
    const date = new Date(timestamp);
    const now = new Date();
  
    const isSameYear = date.getFullYear() === now.getFullYear();
    const isSameDay = date.toDateString() === now.toDateString();
  
    // Check if it is yesterday
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();
  
    const day = date.getDate().toString().padStart(2, "0"); // Day of the month with leading zero
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = monthNames[date.getMonth()]; // Short month name
    const year = date.getFullYear(); // Year
  
    const hours = date.getHours().toString().padStart(2, "0"); // 24-hour format with leading zero
    const minutes = date.getMinutes().toString().padStart(2, "0"); // Add leading zero to minutes
  
    // Handle "Today" and "Yesterday"
    if (isSameDay) {
      return `Today • ${hours}:${minutes}`;
    } else if (isYesterday) {
      return `Yesterday • ${hours}:${minutes}`;
    }
  
    // Format without year if it's the same year
    if (isSameYear) {
      return `${day} ${month} • ${hours}:${minutes}`;
    }
  
    // Default format with year
    return `${day} ${month} ${year} • ${hours}:${minutes}`;
  }
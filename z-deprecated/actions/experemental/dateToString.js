"use server"
export async function dateToString(dateFromClient) {
    const date = new Date(dateFromClient);
  
    const daysOfWeek = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday',
      'Thursday', 'Friday', 'Saturday'
    ];
  
    const months = [
      'January', 'February', 'March', 'April',
      'May', 'June', 'July', 'August',
      'September', 'October', 'November', 'December'
    ];
  
    const dayName = daysOfWeek[date.getUTCDay()];
    const day = date.getUTCDate();
    const monthName = months[date.getUTCMonth()];
    const year = date.getUTCFullYear().toString().slice(-2);
  
    return `${dayName}, ${day} ${monthName}, ${year}`;
  }
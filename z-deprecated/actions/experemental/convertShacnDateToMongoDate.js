const convertStringDateToShadcnFormat = (dateStr) => {
  const date = new Date(dateStr);
  const dayOfWeek = date.toLocaleString('en-US', { weekday: 'short' });
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();

  const formattedDate = `${dayOfWeek} ${month} ${day} ${year} 00:00:00 GMT+0300 (Eastern European Summer Time)`;
  return formattedDate;
};

export default convertStringDateToShadcnFormat;
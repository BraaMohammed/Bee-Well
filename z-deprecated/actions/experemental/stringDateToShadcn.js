const convertStringDateToShadcnFormat = (dateStr) => {
    const [dayOfWeek, day, month, year] = dateStr.split(/,?\s+/);

    const dayMap = {
      Monday: "Mon",
      Tuesday: "Tue",
      Wednesday: "Wed",
      Thursday: "Thu",
      Friday: "Fri",
      Saturday: "Sat",
      Sunday: "Sun"
    };

    const monthMap = {
      January: "Jan",
      February: "Feb",
      March: "Mar",
      April: "Apr",
      May: "May",
      June: "Jun",
      July: "Jul",
      August: "Aug",
      September: "Sep",
      October: "Oct",
      November: "Nov",
      December: "Dec"
    };

    const shortDay = dayMap[dayOfWeek];
    const shortMonth = monthMap[month];
    const paddedDay = day.padStart(2, '0');
    const fullYear = `20${year}`;

    const formattedDate = `${shortDay} ${shortMonth} ${paddedDay} ${fullYear} 00:00:00 GMT+0300 (Eastern European Summer Time)`;
    return formattedDate;
  };
export default convertStringDateToShadcnFormat
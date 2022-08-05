const dateToCron = (date: Date): string => {
  try {
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const days = date.getDate();
    const months = date.getMonth() + 1;
    const dayOfWeek = date.getDay();

    return `${minutes} ${hours} ${days} ${months} ${dayOfWeek}`;
  } catch (err) {
    console.error(err);
    return '';
  }
};

export default dateToCron;

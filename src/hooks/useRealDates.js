const useRealDates = () => {
  const formattedDate = (date, divider = '-') => {
    const day = `${date.getDate()}`.padStart(2, '0');
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const year = date.getFullYear();

    return `${day}${divider}${month}${divider}${year}`;
  };

  const localeDateString = async (date) => {
    if (!date) return;
    const [year, month, day] = date.split('-');
    const formattedDate = new Date(day, month - 1, year).toLocaleDateString(
      'en-US',
      {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }
    );

    return formattedDate.replace(',', '');
  };

  return {
    formattedDate,
    localeDateString,
  };
};

export default useRealDates;

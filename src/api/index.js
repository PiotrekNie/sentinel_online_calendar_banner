// const pageURL = document.location.origin;
const pageURL = 'https://soe.devel.esaportal.eu';

const getCalendarData = async (date) => {
  try {
    const url = new URL(`${pageURL}/o/news/calendar/items`);
    const urlSearchParams = url.searchParams;
    console.log(date);
    if (date) {
      if (date.month > 0) {
        urlSearchParams.set('month', date.month);
      }

      if (date.year > 0) {
        urlSearchParams.set('year', date.year);
      }
    }

    const response = await fetch(url.toString());
    return await response.json();
  } catch (error) {
    console.error('An error occurred:', error);
    return null;
  }
};

const CalendarService = {
  getCalendarData,
};

export default CalendarService;

// const pageURL = document.location.origin;\
const pageURL = 'https://soe.devel.esaportal.eu';

const getCalendarData = async (page, date) => {
  try {
    const url = new URL(`${pageURL}/o/news/calendar`);
    const urlSearchParams = url.searchParams;

    if (date) {
      if (date.month > 0) {
        urlSearchParams.set('month', date.month);
      }

      if (date.year > 0) {
        urlSearchParams.set('year', date.year);
      }
    }

    urlSearchParams.set('page', page);
    urlSearchParams.set('size', 99);

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

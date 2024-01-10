import React, { useEffect, useState, useCallback } from 'react';
import CalendarService from '../../api';
import CalendarSection from '../Calendar';

function CalendarContainer() {
  const [init, setInit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const [searchValue, setSearchValue] = useState({
    date: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    },
  });
  const [highlightedArticles, setHighlightedArticles] = useState([]);
  const combObjectDate = async (array) => {
    const resultMap = new Map();
    const objectToArray = Array.from(array);

    objectToArray.forEach((item) => {
      const { articleDate, calendarDateFrom, calendarDateTo, type } = item;
      const [fromDay, fromMonth, fromYear] = calendarDateFrom.split('-');
      const formattedDateStringFrom = `${fromYear}-${fromMonth}-${fromDay}`;
      const [toDay, toMonth, toYear] = calendarDateTo.split('-');
      const formattedDateStringTo = `${toYear}-${toMonth}-${toDay}`;
      const fromDate = new Date(formattedDateStringFrom);
      const toDate = new Date(formattedDateStringTo);
      for (
        let date = fromDate;
        date <= toDate;
        date.setDate(date.getDate() + 1)
      ) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;
        const existingEntry = resultMap.get(formattedDate);

        if (existingEntry) {
          if (existingEntry.type !== 'mixed' && existingEntry.type !== type) {
            existingEntry.type = 'mixed';
          }
        } else {
          resultMap.set(formattedDate, {
            date: formattedDate,
            articleDate,
            type,
          });
        }
      }
    });

    const resultArray = Array.from(resultMap.values());

    resultArray.sort((a, b) => new Date(a.date) - new Date(b.date));

    return resultArray;
  };
  const newsItems = useCallback(async (pageNo, date) => {
    setIsLoading(true);

    try {
      const data = await CalendarService.getCalendarData(pageNo, date);

      if (data.items) {
        const combItems = await combObjectDate(data.items);

        setHighlightedArticles(combItems);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchCallback = useCallback(
    (date) => {
      setSearchValue(date);
      setPageNo(0);

      if (!init) setInit(true);
    },
    [init]
  );

  useEffect(() => {
    if (init) {
      newsItems(pageNo, searchValue.date);
    }
  }, [pageNo, searchValue, newsItems, init]);

  return (
    <div className="calendar">
      <CalendarSection
        isLoading={isLoading}
        searchCallback={searchCallback}
        highlights={highlightedArticles}
      />
    </div>
  );
}

export default CalendarContainer;

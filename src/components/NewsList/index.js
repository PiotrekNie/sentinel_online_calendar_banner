import React, { useEffect, useState, useCallback, useRef } from 'react';
import CalendarService from '../../api';
import CalendarSection from '../Calendar';
import useMonthStore from '../../store/useMonthStore';

const CalendarContainer = ({ news }) => {
  const calendarRef = useRef(null);
  const { setMonthData } = useMonthStore();
  const [init, setInit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedArticles, setHighlightedArticles] = useState([]);
  const combObjectDate = useCallback(async (array) => {
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
        let colorScheme = [type];
        let events = [item];

        if (existingEntry) {
          if (existingEntry.type !== 'mixed' && existingEntry.type !== type) {
            existingEntry.type = 'mixed';
          }

          if (existingEntry.type !== type) {
            if (existingEntry.colorScheme.indexOf(type) === -1) {
              existingEntry.colorScheme.push(type);
              existingEntry.events.push(...events);
            }
          }
        } else {
          resultMap.set(formattedDate, {
            date: formattedDate,
            articleDate,
            type,
            colorScheme,
            events: events,
          });
        }
      }
    });

    const resultArray = Array.from(resultMap.values());

    resultArray.sort((a, b) => new Date(a.date) - new Date(b.date));

    return resultArray;
  }, []);

  const newsItems = useCallback(
    async (date) => {
      setIsLoading(true);

      try {
        const data = await CalendarService.getCalendarData(date);

        if (data === null) {
          setMonthData([]);
          setHighlightedArticles([]);
          return;
        }

        if (data) {
          const combItems = await combObjectDate(data);

          setMonthData(combItems);

          setHighlightedArticles(combItems);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [setMonthData, combObjectDate]
  );

  useEffect(() => {
    const date = {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    };

    if (init) {
      newsItems(date);
    } else {
      setInit(true);
    }
  }, [newsItems, init]);

  return (
    <div
      className="calendar"
      ref={calendarRef}
      onClick={() => {
        if (news.length > 0) window.location.href = news;
      }}
    >
      <CalendarSection isLoading={isLoading} highlights={highlightedArticles} />
    </div>
  );
};

export default CalendarContainer;

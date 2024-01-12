import React, { useEffect, useState, useCallback, useRef } from 'react';
import CalendarService from '../../api';
import CalendarSection from '../Calendar';
import breakpoints from '../../utils/breakpointss';
import { useMediaQuery } from '../../hooks/useMediaQuery';

const CalendarContainer = () => {
  const calendarRef = useRef(null);
  const isDesktop = useMediaQuery(`(min-width: ${breakpoints.md})`);
  const [init, setInit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const [desktop, setDesktop] = useState(isDesktop);
  const [timer, setTimer] = useState(null);
  const [highlightedArticles, setHighlightedArticles] = useState([]);

  const combObjectDate = async (array) => {
    const resultMap = new Map();

    array.forEach((item) => {
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

            const itemObject = {
              title: item.title,
              dateFrom: item.calendarDateFrom,
              dateTo: item.calendarDateTo,
              type: item.type,
            };
            existingEntry.items.push(itemObject);
          }
        } else {
          resultMap.set(formattedDate, {
            date: formattedDate,
            eventType: item.type,
            articleDate,
            type,
            items: [
              {
                title: item.title,
                image: item.previewImage,
                dateFrom: item.calendarDateFrom,
                dateTo: item.calendarDateTo,
                type: item.type,
              },
            ],
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

  const handleMouseOver = useCallback(
    (event) => {
      const { target } = event;
      const allHighlightedDays = Array.from(
        calendarRef?.current.querySelectorAll(
          '.react-calendar__month-view__days__day'
        )
      );

      if (allHighlightedDays.length === 0 || !desktop) {
        if (
          (event.type === 'click' &&
            target.parentElement.classList.contains('highlighted')) ||
          (event.type === 'mouseover' &&
            target.classList.contains('highlighted'))
        ) {
          allHighlightedDays.forEach((day) => {
            if (day.parentElement !== target.parentElement) {
              day.firstElementChild.classList.add('fade');
              day.firstElementChild.classList.remove('active');
            }
          });

          target.classList.add('active');
          target.classList.remove('fade');
        }
      } else {
        if (
          event.type === 'mouseover' &&
          target.classList.contains('highlighted')
        ) {
          if (target.classList.contains('fade')) {
            target.classList.remove('fade');
          }
          allHighlightedDays.forEach((day) => {
            if (day !== target) day.classList.add('fade');
          });
        } else {
          allHighlightedDays.forEach((day) => {
            day.classList.remove('fade');
          });
        }
      }
    },
    [calendarRef, desktop]
  );
  const resetAfterTimeout = useCallback(() => {
    if (desktop) return;

    const allHighlightedDays = Array.from(
      calendarRef?.current.querySelectorAll(
        '.react-calendar__month-view__days__day'
      )
    );

    allHighlightedDays.forEach((day) => {
      day.firstElementChild.classList.remove('fade');
      day.firstElementChild.classList.remove('active');
    });
  }, [calendarRef, desktop]);

  useEffect(() => {
    setDesktop(isDesktop);
  }, [isDesktop]);

  useEffect(() => {
    setPageNo(0);

    const date = {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    };

    if (init) {
      newsItems(pageNo, date);
    } else {
      setInit(true);
    }
  }, [pageNo, newsItems, init]);

  return (
    <div
      className="calendar"
      ref={calendarRef}
      onBlur={() => {
        clearTimeout(timer);
        resetAfterTimeout();
      }}
      onClick={(event) => {
        clearTimeout(timer);

        const newTimer = setTimeout(resetAfterTimeout, 5000);

        setTimer(newTimer);

        handleMouseOver(event);
      }}
      onMouseOver={handleMouseOver}
    >
      <CalendarSection isLoading={isLoading} highlights={highlightedArticles} />
    </div>
  );
};

export default CalendarContainer;

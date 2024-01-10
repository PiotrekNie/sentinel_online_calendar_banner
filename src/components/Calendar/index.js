import React, { useState, useEffect, useCallback } from 'react';
import Calendar from 'react-calendar';
import Loader from '../Loader';

function CalendarSection(props) {
  const { isLoading, searchCallback, highlights } = props;
  const [value, setValue] = useState(new Date());
  const [lastDay, setLastDay] = useState();
  const [firstDay, setFirstDay] = useState();
  const [currentMonthName, setCurrentMonthName] = useState('');
  const [currentMonth, setCurrentMonth] = useState({
    date: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    },
  });
  const [dates, setDates] = useState([]);
  const onChange = (nextValue) => {
    setValue(nextValue);
  };
  const onMonthChange = (nextValue) => {
    if (nextValue?.activeStartDate) {
      const getMonth = new Date(nextValue.activeStartDate).getMonth();
      const getYear = new Date(nextValue.activeStartDate).getFullYear();
      const date = {
        date: {
          month: getMonth + 1,
          year: getYear,
        },
      };
      setCurrentMonth(date);
    }
  };
  const scrollToEvent = useCallback((ev) => {
    const { target } = ev;
    const targetClassList = target.classList;
    const targetClassPattern = /\bdate\-(.*)\b/;
    const targetDateClass = targetClassList.value.match(targetClassPattern);

    if (targetDateClass instanceof Array) {
      const targetDate = document.querySelector(
        `[data-date="${targetDateClass[0]}"]`
      );

      if (!targetDate) return;

      targetDate.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  useEffect(() => {
    searchCallback(currentMonth);
  }, [currentMonth, searchCallback]);

  useEffect(() => {
    setDates(highlights);
  }, [highlights]);

  useEffect(() => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const firstDay = new Date(
      currentMonth.date.year,
      currentMonth.date.month - 1
    );
    const lastDay = new Date(
      currentMonth.date.year,
      currentMonth.date.month,
      0
    );

    setFirstDay(firstDay);
    setLastDay(lastDay);
    setCurrentMonthName(months[currentMonth.date.month - 1]);
  }, []);

  return (
    <div className="calendar__heading">
      <div
        className={`calendar__heading--component ${isLoading ? 'loading' : ''}`}
      >
        {isLoading && <Loader loading={isLoading} />}
        <div className="react-calendar__navigation">
          <div className="react-calendar__navigation--container">
            <div
              aria-label=""
              className="react-calendar__navigation__label"
              type="button"
            >
              <span className="react-calendar__navigation__label__labelText react-calendar__navigation__label__labelText--from">
                {currentMonthName} {new Date().getFullYear()}
              </span>
            </div>
          </div>
        </div>
        <Calendar
          onChange={onChange}
          onClickDay={(value, event) => {
            scrollToEvent(event);
          }}
          minDate={firstDay}
          maxDate={lastDay}
          showNavigation={false}
          onActiveStartDateChange={onMonthChange}
          tileClassName={({ date }) => {
            let day = date.getDate();
            let month = date.getMonth() + 1;
            const year = date.getFullYear();

            if (day < 10) {
              day = `0${day}`;
            }

            if (month < 10) {
              month = `0${month}`;
            }

            const realDate = `${day}-${month}-${year}`;
            const matchingDate = dates.find((val) => val.date === realDate);

            if (matchingDate) {
              switch (matchingDate.type) {
                case 'maintenance':
                  return `highlighted-maintenance date-${matchingDate.articleDate}`;
                case 'event':
                  return `highlighted-event date-${matchingDate.articleDate}`;
                case 'mixed':
                  return `highlighted-mixed date-${matchingDate.articleDate}`;
                default:
                  break;
              }
            }
          }}
          formatLongWeekday={({ date }) => {
            const days = [
              'Sunday',
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
            ];
            return days[date.getDay()];
          }}
          locale={'en-GB'}
          value={value}
        />
      </div>
    </div>
  );
}

export default CalendarSection;

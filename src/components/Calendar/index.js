import React, { useState, useEffect, useCallback, useRef } from 'react';
import Calendar from 'react-calendar';
import Loader from '../Loader';

function CalendarSection(props) {
  const { isLoading, highlights } = props;
  const calendarRef = useRef(null);
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
  const matchDate = useCallback(
    (date) => {
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
      const matchedDate = dates.find((val) => val.date === realDate);

      return {
        matchDate: matchedDate,
        date: {
          day,
          month,
          year,
        },
      };
    },
    [dates]
  );
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
  }, [currentMonth]);

  return (
    <div className="calendar__heading" ref={calendarRef}>
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
          minDate={firstDay}
          maxDate={lastDay}
          showNavigation={false}
          onActiveStartDateChange={onMonthChange}
          tileContent={({ date }) => {
            const matchingDate = matchDate(date);

            if (!matchingDate.matchDate) return;

            return (
              matchingDate.matchDate && (
                <div className="tooltip">
                  {matchingDate.matchDate.items.map((item, index) => (
                    <div className={`tooltip-item ${item.type}`} key={index}>
                      <time>
                        <span>{item.dateFrom}</span> -{' '}
                        <span>{item.dateTo}</span>
                      </time>
                      <h4>{item.title}</h4>
                    </div>
                  ))}
                </div>
              )
            );
          }}
          tileClassName={({ date }) => {
            const matchingDate = matchDate(date);

            if (matchingDate.matchDate) {
              switch (matchingDate.matchDate.type) {
                case 'maintenance':
                  return `highlighted highlighted-maintenance date-${matchingDate.matchDate.articleDate}`;
                case 'event':
                  return `highlighted highlighted-event date-${matchingDate.matchDate.articleDate}`;
                case 'mixed':
                  return `highlighted highlighted-mixed date-${matchingDate.matchDate.articleDate}`;
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

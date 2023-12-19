import React, { useState, useEffect, useCallback } from 'react';
import Calendar from 'react-calendar';
import { useMediaQuery } from 'react-responsive';
import Info from '../Info';
import Loader from '../Loader';
import { SCREENS } from '../../utils/screens';

function CalendarSection(props) {
  const { isLoading, searchCallback, highlights } = props;
  const isMobile = useMediaQuery({ maxWidth: SCREENS.lg });
  const [value, setValue] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState({
    date: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
    },
  });
  const [dates, setDates] = useState([]);
  const [mobile, setMobile] = useState();
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
    const target = ev.target;
    const targetClassList = target.classList;
    const targetClassPattern = /\bdate\-(.*)\b/;
    const targetDateClass = targetClassList.value.match(targetClassPattern)[0];

    if (targetDateClass) {
      const targetDate = document.querySelector(
        `[data-date="${targetDateClass}"]`
      );

      targetDate.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, []);

  useEffect(() => {
    setMobile(isMobile);
  }, [isMobile]);

  useEffect(() => {
    searchCallback(currentMonth);
  }, [currentMonth, searchCallback]);

  useEffect(() => {
    setDates(highlights);
  }, [highlights]);

  return (
    <div className="calendar__heading">
      <div
        className={`calendar__heading--component ${isLoading ? 'loading' : ''}`}
      >
        {isLoading && <Loader loading={isLoading} />}
        <Calendar
          onChange={onChange}
          onClickDay={(value, event) => {
            scrollToEvent(event);
          }}
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
                  return `highlighted-maintenance date-${realDate}`;
                case 'event':
                  return `highlighted-event date-${realDate}`;
                case 'mixed':
                  return `highlighted-mixed date-${realDate}`;
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
      <div className="col-span-4 calendar__heading--legend">
        <h5>Calendar labels</h5>
        <ul>
          <li>
            <span className="color color-events"></span>
            <span>Events</span>
          </li>
          <li>
            <span className="color color-maintenance"></span>
            <span>Maintenance News</span>
          </li>
          <li>
            <span className="color color-mixed"></span>
            <span>Event and Maintenance News</span>
          </li>
        </ul>
        {!mobile && <Info />}
      </div>
    </div>
  );
}

export default CalendarSection;

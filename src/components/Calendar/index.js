import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { useMediaQuery } from 'react-responsive';
import Info from '../Info';
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
    console.log(nextValue);
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

  useEffect(() => {
    setMobile(isMobile);
  }, [isMobile]);

  useEffect(() => {
    searchCallback(currentMonth);
  }, [currentMonth, searchCallback]);

  useEffect(() => {
    console.log(highlights);
    setDates(highlights);
  }, [highlights]);

  return (
    <div className="calendar__heading">
      <div className={`calendar__heading--component ${isLoading && 'loading'}`}>
        <Calendar
          onChange={onChange}
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
                  return 'highlighted-maintenance';
                case 'event':
                  return 'highlighted-event';
                case 'mixed':
                  return 'highlighted-mixed';
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

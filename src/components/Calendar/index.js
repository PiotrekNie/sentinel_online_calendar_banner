import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import Calendar from 'react-calendar';
import Loader from '../Loader';
import useRealDates from '../../hooks/useRealDates';

function CalendarSection(props) {
  const { isLoading, highlights } = props;
  const calendarRef = useRef(null);
  const [value, setValue] = useState(new Date());
  const { formattedDate } = useRealDates();
  const [currentMonthName, setCurrentMonthName] = useState('');
  const currentMonth = useMemo(
    () => ({
      date: {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      },
    }),
    []
  );
  const [dates, setDates] = useState([]);
  const onChange = (nextValue) => {
    setValue(nextValue);
  };
  const matchDates = useCallback(
    (date) => {
      const realDate = formattedDate(date);

      return dates.find((val) => val.date === realDate);
    },
    [dates, formattedDate]
  );

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
            <div aria-label="" className="react-calendar__navigation__label">
              <span className="react-calendar__navigation__label__labelText react-calendar__navigation__label__labelText--from">
                {currentMonthName} {new Date().getFullYear()}
              </span>
            </div>
          </div>
        </div>
        <Calendar
          onChange={onChange}
          showNavigation={false}
          tileClassName={({ date }) => {
            const matchingDate = matchDates(date);

            if (matchingDate) {
              return 'highlighted';
            }
          }}
          tileContent={({ date, view }) => {
            const matchingDate = matchDates(date);

            if (matchingDate) {
              return (
                <span className="colors">
                  {view === 'month' &&
                    matchingDate.colorScheme.map((color, index) => (
                      <span className={color} key={index}></span>
                    ))}
                </span>
              );
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

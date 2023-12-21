import React, { useState, useEffect } from 'react';
import Button from '../Button/index';

const MaintenanceArticle = (props) => {
  const {
    title,
    description,
    articleDate,
    calendarDateFrom,
    calendarDateTo,
    url,
  } = props;
  const [trimmedDescription, setTrimmedDescription] = useState('');
  const [createDate, setCreateDate] = useState('');
  const [rangeDate, setRangeDate] = useState('');

  useEffect(() => {
    if (articleDate.length > 0) {
      const [day, month, year] = articleDate.split('-');
      const dateObject = new Date(year, month - 1, day);
      const formattedDate = dateObject.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });

      setCreateDate(formattedDate.replace(',', ''));
    }
  }, [articleDate]);

  useEffect(() => {
    if (description.length > 0) {
      let trimmedText = '';

      if (description.length <= 255) {
        setTrimmedDescription(description);
        return;
      }

      const words = description.split(' ');

      for (const word of words) {
        if (trimmedText.length + word.length + 1 > 255) {
          break;
        }

        trimmedText += word + ' ';
      }

      if (trimmedText) {
        trimmedText = trimmedText.slice(0, -1) + '...';
      }

      setTrimmedDescription(trimmedText);
    }
  }, [description]);

  useEffect(() => {
    const createDateString = async () => {
      const dateString = async (date) => {
        const [year, month, day] = date.split('-');
        const formattedDate = new Date(year, month - 1, day).toLocaleDateString(
          'en-US',
          {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
          }
        );

        return formattedDate.replace(',', '');
      };

      const dateFrom = await dateString(calendarDateFrom);
      const dateTo = await dateString(calendarDateTo);

      setRangeDate(dateFrom === dateTo ? dateFrom : `${dateFrom} - ${dateTo}`);
    };

    createDateString();
  }, [calendarDateFrom, calendarDateTo]);

  return (
    <article
      className="news-item article-maintenance"
      itemScope
      itemType="https://schema.org/Article"
      data-date={`date-${articleDate}`}
    >
      <div className="news-item__cont">
        <div className="news-item__cont--text">
          <div>
            {createDate && (
              <time dateTime={rangeDate} itemProp="datePublished">
                {rangeDate}
              </time>
            )}
            <h2 itemProp="name">{title}</h2>
            {trimmedDescription && (
              <p itemProp="description">{trimmedDescription}</p>
            )}
          </div>
          <div className="news-item__cont--button">
            <Button url={url} title={title} itemProp="url" />
          </div>
        </div>
      </div>
    </article>
  );
};

export default MaintenanceArticle;

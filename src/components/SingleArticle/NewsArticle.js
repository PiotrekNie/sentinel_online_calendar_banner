import React, { useState, useEffect } from 'react';
import ImagePlaceholder from '../ImagePlaceholder/index';
import Button from '../Button/index';

const NewsArticle = (props) => {
  const { title, description, previewImage, articleDate, url } = props;
  const [trimmedDescription, setTrimmedDescription] = useState('');
  const [createDate, setCreateDate] = useState('');

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

  return (
    <article
      className="news-item article-news"
      itemProp="itemListElement"
      itemScope
      itemType="https://schema.org/Article"
      data-date={`date-${articleDate}`}
    >
      <div className="news-item__cont">
        <div
          className="news-item__cont--image"
          itemScope
          itemType="https://schema.org/ImageObject"
        >
          {previewImage ? (
            <img src={previewImage} alt={title} itemProp="contentUrl" />
          ) : (
            <ImagePlaceholder />
          )}
        </div>
        <div className="news-item__cont--text">
          <div>
            {createDate && (
              <time dateTime={createDate} itemProp="datePublished">
                {createDate}
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

export default NewsArticle;

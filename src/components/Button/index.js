import React from 'react';
import { ASSETS_URL } from '../../utils/constans';

const Button = (props) => {
  const { title, url } = props;

  return (
    <a href={url}>
      <span>Read more</span>
      <img
        src={`${ASSETS_URL}/images/button-arrow-right-green.svg`}
        alt={`Go to: ${title}`}
      />
    </a>
  );
};

export default Button;

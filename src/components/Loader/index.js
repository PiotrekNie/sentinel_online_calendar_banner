import React from 'react';
import { BarLoader } from 'react-spinners';

const Loader = ({ loading }) => {
  return (
    <div className="loader-container">
      <BarLoader
        width={50}
        color="#00AE9D"
        loading={loading}
        aria-label="Loading Calendar Data"
      />
    </div>
  );
};

export default Loader;

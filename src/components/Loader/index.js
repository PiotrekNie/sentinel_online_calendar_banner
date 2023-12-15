import React from 'react';
import { ImpulseSpinner } from 'react-spinners-kit';

const Loader = (props) => {
  const { loading } = props;

  return (
    <div className="loader-container">
      <ImpulseSpinner size={30} color="#00AE9D" loading={loading} />
    </div>
  );
};

export default Loader;

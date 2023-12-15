import React, { useState, useEffect } from 'react';
import DropDown from '@clayui/drop-down';
import ClayButton from '@clayui/button';
import { ImpulseSpinner } from 'react-spinners-kit';

const DropDownNavigation = (props) => {
  const { pageNo, totalPageNo, isLoading, pageNoCallback } = props;
  const [pageArray, setPageArray] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [no, setNo] = useState(pageNo);

  useEffect(() => {
    setPageArray(Array.from({ length: totalPageNo }, (_, index) => index + 1));
  }, [totalPageNo]);

  useEffect(() => {
    pageNoCallback(no);
  }, [no]);

  useEffect(() => {
    setNo(pageNo);

    if (pageNo === 1) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [pageNo]);

  useEffect(() => {
    if ((!isLoading && totalPageNo === 1) || (isLoading && totalPageNo > 1)) {
      setDisabled(true);
    } else {
      setDisabled(false);
    }
  }, [isLoading, totalPageNo]);

  return (
    <DropDown
      closeOnClick={true}
      trigger={
        <ClayButton
          displayType="primary"
          className={isLoading && 'loading'}
          disabled={disabled}
        >
          Page {pageNo + 1} of {totalPageNo}
          {isLoading && (
            <ImpulseSpinner size={16} color="#00AE9D" loading={isLoading} />
          )}
        </ClayButton>
      }
    >
      <DropDown.ItemList>
        {pageArray &&
          pageArray.map((item, index) => (
            <DropDown.Item key={index} onClick={() => setNo(index)}>
              {item}
            </DropDown.Item>
          ))}
      </DropDown.ItemList>
    </DropDown>
  );
};

export default DropDownNavigation;

import React, { useEffect, useState } from "react";
import ClayButton from "@clayui/button";

const PaginationButtons = (props) => {
  const { pageNo, totalPageNo, pageCallback } = props;
  const [currentPageNo, setCurrentPageNo] = useState(pageNo);

  useEffect(() => {
    pageCallback(currentPageNo);
  }, [currentPageNo]);

  return (
    <div className="pagination-buttons">
      <>
        <div className="pagination-col">
          <ClayButton
            displayType="primary"
            onClick={() => setCurrentPageNo(0)}
            disabled={currentPageNo === 0}
            itemProp="pageStart"
          >
            First
          </ClayButton>
          <ClayButton
            displayType="primary"
            onClick={() => setCurrentPageNo(pageNo - 1)}
            disabled={currentPageNo === 0}
          >
            Previous
          </ClayButton>
        </div>
        <div className="pagination-col">
          <ClayButton
            displayType="primary"
            onClick={() => setCurrentPageNo(pageNo + 1)}
            disabled={totalPageNo - 1 === pageNo}
          >
            Next
          </ClayButton>
          <ClayButton
            displayType="primary"
            onClick={() => setCurrentPageNo(totalPageNo - 1)}
            disabled={totalPageNo - 1 === pageNo}
            itemProp="pageEnd"
          >
            Last
          </ClayButton>
        </div>
      </>
    </div>
  );
};

export default PaginationButtons;

import React, { useCallback } from "react";
import DropDownNavigation from "./Dropdown";
import PaginationButtons from "./PaginationButtons";

const PaginationContainer = (props) => {
  const { pageNo, totalPageNo, isLoading, pageCallback } = props;
  const pageNoCallback = useCallback((no) => {
    pageCallback(no);
  }, []);

  return (
    <div
      className="pagination-container"
      itemScope
      itemType="http://schema.org/SiteNavigationElement/Pagination"
    >
      <DropDownNavigation
        pageNo={pageNo}
        totalPageNo={totalPageNo}
        pageNoCallback={pageNoCallback}
        isLoading={isLoading}
      />
      <PaginationButtons
        pageNo={pageNo}
        totalPageNo={totalPageNo}
        pageCallback={pageCallback}
      />
    </div>
  );
};

export default PaginationContainer;

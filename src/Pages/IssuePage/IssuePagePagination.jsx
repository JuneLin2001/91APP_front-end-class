import { Pagination } from "@primer/react";
import { useContext } from "react";
import { IssueContext } from "../../context/issueContext";

const IssuePagePagination = () => {
  const { currentPage, setCurrentPage, pageCount } = useContext(IssueContext);

  const handlePageChange = (event, page) => {
    event.preventDefault();
    setCurrentPage(page);
  };

  return (
    // <Pagination
    //   pageCount={pageCount}
    //   currentPage={currentPage}
    //   onPageChange={handlePageChange}
    //   showPages={{
    //     narrow: false,
    //   }}
    // />
    <Pagination
      pageCount={pageCount}
      currentPage={currentPage}
      onPageChange={handlePageChange}
      showPages={{
        narrow: false,
      }}
    />
  );
};

export default IssuePagePagination;

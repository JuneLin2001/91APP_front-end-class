import { Pagination } from "@primer/react";

const IssuePagePagination = () => {
  return (
    <Pagination
      pageCount={15}
      currentPage={2}
      onPageChange={(e) => e.preventDefault()}
      showPages={{
        narrow: false,
      }}
    />
  );
};

export default IssuePagePagination;

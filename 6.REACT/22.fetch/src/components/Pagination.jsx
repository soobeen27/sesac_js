import { useState } from 'react';
export default function Pagination({ itemPerPage, totalItemCount, onPrev, onNext }) {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPage = parseInt(totalItemCount) / parseInt(itemPerPage);
  return (
    <div style={{ display: 'flex' }}>
      <button
        onClick={() => {
          if (currentPage <= 1) {
            setCurrentPage(1);
            return;
          }
          setCurrentPage((p) => p - 1);
          onPrev(currentPage - 1);
        }}
      >
        &lt;
      </button>
      <p>
        {currentPage}/{totalPage}
      </p>
      <button
        onClick={() => {
          if (currentPage >= totalPage) {
            setCurrentPage(totalPage);
            return;
          }
          setCurrentPage((p) => p + 1);
          onNext(currentPage + 1);
        }}
      >
        &gt;
      </button>
    </div>
  );
}

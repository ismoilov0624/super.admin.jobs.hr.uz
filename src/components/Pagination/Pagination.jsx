"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import "./Pagination.scss";

const Pagination = ({
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  onItemsPerPageChange,
  showItemsPerPage = true,
  itemsPerPageOptions = [5, 10, 20, 50],
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to show (similar to the image)
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 4) {
        // Show first few pages
        for (let i = 2; i <= Math.min(5, totalPages - 1); i++) {
          pages.push(i);
        }
        if (totalPages > 5) {
          pages.push("...");
          pages.push(totalPages);
        }
      } else if (currentPage >= totalPages - 3) {
        // Show last few pages
        if (totalPages > 5) {
          pages.push("...");
        }
        for (let i = Math.max(totalPages - 4, 2); i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show middle pages
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    const newTotalPages = Math.ceil(totalItems / newItemsPerPage);
    const newCurrentPage = Math.min(currentPage, newTotalPages);
    onItemsPerPageChange(newItemsPerPage, newCurrentPage);
  };

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="pagination">
      <div className="pagination-info">
        <span>
          {startItem}-{endItem} / {totalItems} ta natija
        </span>
      </div>

      <div className="pagination-main">
        {/* Previous button */}
        <button
          className="pagination-nav-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          title="Oldingi sahifa"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page numbers */}
        <div className="pagination-pages">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              className={`pagination-page ${
                page === currentPage ? "active" : ""
              } ${page === "..." ? "ellipsis" : ""}`}
              onClick={() => page !== "..." && handlePageChange(page)}
              disabled={page === "..."}
            >
              {page}
            </button>
          ))}
        </div>

        {/* Next button */}
        <button
          className="pagination-nav-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          title="Keyingi sahifa"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {showItemsPerPage && (
        <div className="pagination-per-page">
          <select
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="per-page-select"
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <span className="per-page-label">/ sahifa</span>
        </div>
      )}
    </div>
  );
};

export default Pagination;

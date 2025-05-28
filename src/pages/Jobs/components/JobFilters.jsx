"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  X,
  Calendar,
  Building2,
  SortAsc,
  SortDesc,
  MapPin,
  DollarSign,
} from "lucide-react";
import "./JobFilters.scss";

const JobFilters = ({ onFiltersChange, totalCount, filteredCount }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    salaryFrom: "",
    salaryTo: "",
    dateFrom: "",
    dateTo: "",
    jobType: "all", // all, full-time, part-time, contract, remote
    sortBy: "createdAt", // createdAt, title, salary, location
    sortOrder: "desc", // asc, desc
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters = {
      search: "",
      location: "",
      salaryFrom: "",
      salaryTo: "",
      dateFrom: "",
      dateTo: "",
      jobType: "all",
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const hasActiveFilters =
    filters.search ||
    filters.location ||
    filters.salaryFrom ||
    filters.salaryTo ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.jobType !== "all";

  return (
    <div className="job-filters">
      {/* Search and Filter Toggle */}
      <div className="job-filters-header">
        <div className="job-search-box">
          <Search size={20} className="job-search-icon" />
          <input
            type="text"
            placeholder="Ish nomi yoki kompaniya bo'yicha qidirish..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
          {filters.search && (
            <button
              className="job-clear-search"
              onClick={() => handleFilterChange("search", "")}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="job-filter-controls">
          <button
            className={`job-filter-toggle ${isFilterOpen ? "active" : ""}`}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter size={18} />
            Filtrlar
            {hasActiveFilters && <span className="job-filter-badge"></span>}
          </button>

          {hasActiveFilters && (
            <button className="job-clear-filters" onClick={clearFilters}>
              <X size={16} />
              Tozalash
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="job-results-info">
        <span>
          {filteredCount} ta natija{" "}
          {totalCount !== filteredCount && `(${totalCount} tadan)`}
        </span>
      </div>

      {/* Advanced Filters */}
      {isFilterOpen && (
        <div className="job-advanced-filters">
          <div className="job-filters-grid">
            {/* Location Filter */}
            <div className="job-filter-group">
              <label>
                <MapPin size={16} />
                Joylashuv
              </label>
              <input
                type="text"
                placeholder="Shahar yoki viloyat"
                value={filters.location}
                onChange={(e) => handleFilterChange("location", e.target.value)}
              />
            </div>

            {/* Salary Range Filter */}
            <div className="job-filter-group">
              <label>
                <DollarSign size={16} />
                Maosh diapazoni
              </label>
              <div className="job-salary-range">
                <input
                  type="number"
                  placeholder="Dan"
                  value={filters.salaryFrom}
                  onChange={(e) =>
                    handleFilterChange("salaryFrom", e.target.value)
                  }
                />
                <span className="job-salary-separator">—</span>
                <input
                  type="number"
                  placeholder="Gacha"
                  value={filters.salaryTo}
                  onChange={(e) =>
                    handleFilterChange("salaryTo", e.target.value)
                  }
                />
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="job-filter-group">
              <label>
                <Calendar size={16} />
                E'lon qilingan sana
              </label>
              <div className="job-date-range">
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) =>
                    handleFilterChange("dateFrom", e.target.value)
                  }
                />
                <span className="job-date-separator">—</span>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                />
              </div>
            </div>

            {/* Job Type Filter */}
            <div className="job-filter-group">
              <label>
                <Building2 size={16} />
                Ish turi
              </label>
              <select
                value={filters.jobType}
                onChange={(e) => handleFilterChange("jobType", e.target.value)}
              >
                <option value="all">Barcha turlar</option>
                <option value="full-time">To'liq vaqtli</option>
                <option value="part-time">Qisman vaqtli</option>
                <option value="contract">Shartnoma asosida</option>
                <option value="remote">Masofaviy</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="job-filter-group">
              <label>
                {filters.sortOrder === "asc" ? (
                  <SortAsc size={16} />
                ) : (
                  <SortDesc size={16} />
                )}
                Saralash
              </label>
              <div className="job-sort-controls">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                >
                  <option value="createdAt">E'lon qilingan sana</option>
                  <option value="title">Ish nomi</option>
                  <option value="salary">Maosh</option>
                  <option value="location">Joylashuv</option>
                </select>
                <button
                  className="job-sort-order"
                  onClick={() =>
                    handleFilterChange(
                      "sortOrder",
                      filters.sortOrder === "asc" ? "desc" : "asc"
                    )
                  }
                >
                  {filters.sortOrder === "asc" ? (
                    <SortAsc size={16} />
                  ) : (
                    <SortDesc size={16} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="job-quick-filters">
            <span className="job-quick-filters-label">Tezkor filtrlar:</span>
            <div className="job-quick-filter-buttons">
              <button
                className={`job-quick-filter ${
                  filters.dateFrom === getDateString(-7) ? "active" : ""
                }`}
                onClick={() => {
                  handleFilterChange("dateFrom", getDateString(-7));
                  handleFilterChange("dateTo", getDateString(0));
                }}
              >
                Oxirgi 7 kun
              </button>
              <button
                className={`job-quick-filter ${
                  filters.dateFrom === getDateString(-30) ? "active" : ""
                }`}
                onClick={() => {
                  handleFilterChange("dateFrom", getDateString(-30));
                  handleFilterChange("dateTo", getDateString(0));
                }}
              >
                Oxirgi 30 kun
              </button>
              <button
                className={`job-quick-filter ${
                  filters.jobType === "remote" ? "active" : ""
                }`}
                onClick={() => handleFilterChange("jobType", "remote")}
              >
                Masofaviy ishlar
              </button>
              <button
                className={`job-quick-filter ${
                  filters.jobType === "full-time" ? "active" : ""
                }`}
                onClick={() => handleFilterChange("jobType", "full-time")}
              >
                To'liq vaqtli
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to get date string
const getDateString = (daysOffset) => {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split("T")[0];
};

export default JobFilters;

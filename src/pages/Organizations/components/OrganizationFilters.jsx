"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  X,
  Calendar,
  MapPin,
  SortAsc,
  SortDesc,
} from "lucide-react";
import "./OrganizationFilters.scss";

const OrganizationFilters = ({
  onFiltersChange,
  totalCount,
  filteredCount,
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    dateFrom: "",
    dateTo: "",
    hasCoordinates: "all", // all, yes, no
    sortBy: "createdAt", // createdAt, title, address
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
      dateFrom: "",
      dateTo: "",
      hasCoordinates: "all",
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const hasActiveFilters =
    filters.search ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.hasCoordinates !== "all";

  return (
    <div className="organization-filters">
      {/* Search and Filter Toggle */}
      <div className="filters-header">
        <div className="search-box">
          <Search size={20} className="search-icon" />
          <input
            type="text"
            placeholder="Tashkilot nomi bo'yicha qidirish..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
          {filters.search && (
            <button
              className="clear-search"
              onClick={() => handleFilterChange("search", "")}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="filter-controls">
          <button
            className={`filter-toggle ${isFilterOpen ? "active" : ""}`}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter size={18} />
            Filtrlar
            {hasActiveFilters && <span className="filter-badge"></span>}
          </button>

          {hasActiveFilters && (
            <button className="clear-filters" onClick={clearFilters}>
              <X size={16} />
              Tozalash
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="results-info">
        <span>
          {filteredCount} ta natija{" "}
          {totalCount !== filteredCount && `(${totalCount} tadan)`}
        </span>
      </div>

      {/* Advanced Filters */}
      {isFilterOpen && (
        <div className="advanced-filters">
          <div className="filters-grid">
            {/* Date Range Filter */}
            <div className="filter-group">
              <label>
                <Calendar size={16} />
                Yaratilgan sana
              </label>
              <div className="date-range">
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) =>
                    handleFilterChange("dateFrom", e.target.value)
                  }
                  placeholder="Dan"
                />
                <span className="date-separator">—</span>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                  placeholder="Gacha"
                />
              </div>
            </div>

            {/* Location Filter */}
            <div className="filter-group">
              <label>
                <MapPin size={16} />
                Joylashuv
              </label>
              <select
                value={filters.hasCoordinates}
                onChange={(e) =>
                  handleFilterChange("hasCoordinates", e.target.value)
                }
              >
                <option value="all">Barchasi</option>
                <option value="yes">Koordinatalari bor</option>
                <option value="no">Koordinatalari yo'q</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="filter-group">
              <label>
                {filters.sortOrder === "asc" ? (
                  <SortAsc size={16} />
                ) : (
                  <SortDesc size={16} />
                )}
                Saralash
              </label>
              <div className="sort-controls">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                >
                  <option value="createdAt">Yaratilgan sana</option>
                  <option value="title">Nomi</option>
                  <option value="address">Manzil</option>
                </select>
                <button
                  className="sort-order"
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
          <div className="quick-filters">
            <span className="quick-filters-label">Tezkor filtrlar:</span>
            <div className="quick-filter-buttons">
              <button
                className={`quick-filter ${
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
                className={`quick-filter ${
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
                className={`quick-filter ${
                  filters.hasCoordinates === "yes" ? "active" : ""
                }`}
                onClick={() => handleFilterChange("hasCoordinates", "yes")}
              >
                Koordinatalari bor
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

export default OrganizationFilters;

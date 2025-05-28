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
  User,
} from "lucide-react";
import "./AdminFilters.scss";

const AdminFilters = ({
  onFiltersChange,
  totalCount,
  filteredCount,
  organizations = [],
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    organizationId: "",
    dateFrom: "",
    dateTo: "",
    hasLastLogin: "all", // all, yes, no
    sortBy: "createdAt", // createdAt, username, lastLoginAt
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
      organizationId: "",
      dateFrom: "",
      dateTo: "",
      hasLastLogin: "all",
      sortBy: "createdAt",
      sortOrder: "desc",
    };
    setFilters(defaultFilters);
    onFiltersChange(defaultFilters);
  };

  const hasActiveFilters =
    filters.search ||
    filters.organizationId ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.hasLastLogin !== "all";

  return (
    <div className="admin-filters">
      {/* Search and Filter Toggle */}
      <div className="admin-filters-header">
        <div className="admin-search-box">
          <Search size={20} className="admin-search-icon" />
          <input
            type="text"
            placeholder="Admin nomi yoki tashkilot bo'yicha qidirish..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
          />
          {filters.search && (
            <button
              className="admin-clear-search"
              onClick={() => handleFilterChange("search", "")}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="admin-filter-controls">
          <button
            className={`admin-filter-toggle ${isFilterOpen ? "active" : ""}`}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter size={18} />
            Filtrlar
            {hasActiveFilters && <span className="admin-filter-badge"></span>}
          </button>

          {hasActiveFilters && (
            <button className="admin-clear-filters" onClick={clearFilters}>
              <X size={16} />
              Tozalash
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="admin-results-info">
        <span>
          {filteredCount} ta natija{" "}
          {totalCount !== filteredCount && `(${totalCount} tadan)`}
        </span>
      </div>

      {/* Advanced Filters */}
      {isFilterOpen && (
        <div className="admin-advanced-filters">
          <div className="admin-filters-grid">
            {/* Organization Filter */}
            <div className="admin-filter-group">
              <label>
                <Building2 size={16} />
                Tashkilot
              </label>
              <select
                value={filters.organizationId}
                onChange={(e) =>
                  handleFilterChange("organizationId", e.target.value)
                }
              >
                <option value="">Barcha tashkilotlar</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div className="admin-filter-group">
              <label>
                <Calendar size={16} />
                Yaratilgan sana
              </label>
              <div className="admin-date-range">
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) =>
                    handleFilterChange("dateFrom", e.target.value)
                  }
                  placeholder="Dan"
                />
                <span className="admin-date-separator">—</span>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                  placeholder="Gacha"
                />
              </div>
            </div>

            {/* Activity Filter */}
            <div className="admin-filter-group">
              <label>
                <User size={16} />
                Faollik
              </label>
              <select
                value={filters.hasLastLogin}
                onChange={(e) =>
                  handleFilterChange("hasLastLogin", e.target.value)
                }
              >
                <option value="all">Barchasi</option>
                <option value="yes">Faol adminlar</option>
                <option value="no">Hech qachon kirmagan</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="admin-filter-group">
              <label>
                {filters.sortOrder === "asc" ? (
                  <SortAsc size={16} />
                ) : (
                  <SortDesc size={16} />
                )}
                Saralash
              </label>
              <div className="admin-sort-controls">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                >
                  <option value="createdAt">Yaratilgan sana</option>
                  <option value="username">Admin nomi</option>
                  <option value="lastLoginAt">Oxirgi faollik</option>
                </select>
                <button
                  className="admin-sort-order"
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
          <div className="admin-quick-filters">
            <span className="admin-quick-filters-label">Tezkor filtrlar:</span>
            <div className="admin-quick-filter-buttons">
              <button
                className={`admin-quick-filter ${
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
                className={`admin-quick-filter ${
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
                className={`admin-quick-filter ${
                  filters.hasLastLogin === "yes" ? "active" : ""
                }`}
                onClick={() => handleFilterChange("hasLastLogin", "yes")}
              >
                Faol adminlar
              </button>
              <button
                className={`admin-quick-filter ${
                  filters.hasLastLogin === "no" ? "active" : ""
                }`}
                onClick={() => handleFilterChange("hasLastLogin", "no")}
              >
                Hech qachon kirmagan
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

export default AdminFilters;

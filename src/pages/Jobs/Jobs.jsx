"use client";

import { useState, useMemo } from "react";
import { Briefcase, MapPin, Eye } from "lucide-react";
import { useJobs } from "./hooks/useJobs";
import JobFilters from "./components/JobFilters";
import ViewJobModal from "./components/ViewJobModal";
import Pagination from "../../components/Pagination/Pagination";
import "./Jobs.scss";

const Jobs = () => {
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    salaryFrom: "",
    salaryTo: "",
    dateFrom: "",
    dateTo: "",
    jobType: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // View modal state
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const { data: jobsResponse, isLoading, error } = useJobs();

  // API javob strukturasiga mos ravishda ma'lumotlarni olish
  const allJobs = jobsResponse?.data?.jobs || jobsResponse?.data || [];
  const totalJobsFromAPI = jobsResponse?.data?.total || allJobs.length;

  // Filtrlangan va saralangan ishlar
  const filteredAndSortedJobs = useMemo(() => {
    if (!Array.isArray(allJobs)) return [];

    const filtered = allJobs.filter((job) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = job.title?.toLowerCase().includes(searchLower);
        const matchesCompany = job.companyName
          ?.toLowerCase()
          .includes(searchLower);
        if (!matchesTitle && !matchesCompany) return false;
      }

      // Location filter
      if (
        filters.location &&
        !job.location?.toLowerCase().includes(filters.location.toLowerCase())
      ) {
        return false;
      }

      // Salary range filter
      if (
        filters.salaryFrom &&
        job.salary &&
        job.salary < Number(filters.salaryFrom)
      ) {
        return false;
      }
      if (
        filters.salaryTo &&
        job.salary &&
        job.salary > Number(filters.salaryTo)
      ) {
        return false;
      }

      // Date range filter
      if (filters.dateFrom || filters.dateTo) {
        const jobDate = new Date(job.createdAt);
        const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : null;
        const toDate = filters.dateTo
          ? new Date(filters.dateTo + "T23:59:59")
          : null;

        if (fromDate && jobDate < fromDate) return false;
        if (toDate && jobDate > toDate) return false;
      }

      // Job type filter
      if (filters.jobType !== "all" && job.type !== filters.jobType) {
        return false;
      }

      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (filters.sortBy) {
        case "title":
          aValue = a.title?.toLowerCase() || "";
          bValue = b.title?.toLowerCase() || "";
          break;
        case "salary":
          aValue = a.salary || 0;
          bValue = b.salary || 0;
          break;
        case "location":
          aValue = a.location?.toLowerCase() || "";
          bValue = b.location?.toLowerCase() || "";
          break;
        case "createdAt":
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
      }

      if (filters.sortOrder === "asc") {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    return filtered;
  }, [allJobs, filters]);

  // Pagination logic - boshqa sahifalar kabi
  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedJobs.slice(startIndex, endIndex);
  }, [filteredAndSortedJobs, currentPage, itemsPerPage]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage, newCurrentPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(newCurrentPage);
  };

  const handleView = (job) => {
    setSelectedJob(job);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedJob(null);
  };

  // Job type badge class
  const getJobTypeBadgeClass = (type) => {
    switch (type) {
      case "full-time":
        return "full-time";
      case "part-time":
        return "part-time";
      case "contract":
        return "contract";
      case "remote":
        return "remote";
      default:
        return "default";
    }
  };

  // Job type label
  const getJobTypeLabel = (type) => {
    switch (type) {
      case "full-time":
        return "To'liq vaqtli";
      case "part-time":
        return "Qisman vaqtli";
      case "contract":
        return "Shartnoma";
      case "remote":
        return "Masofaviy";
      default:
        return type || "Noma'lum";
    }
  };

  // Job status badge class
  const getJobStatusBadgeClass = (status) => {
    switch (status) {
      case "active":
        return "active";
      case "inactive":
        return "inactive";
      case "pending":
        return "pending";
      default:
        return "active";
    }
  };

  // Job status label
  const getJobStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "Faol";
      case "inactive":
        return "Nofaol";
      case "pending":
        return "Kutilmoqda";
      default:
        return "Faol";
    }
  };

  if (isLoading) {
    return (
      <div className="jobs">
        <div className="jobs-loading-container">
          <div className="loading"></div>
          <p>Bo'sh ish o'rinlari yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="jobs">
        <div className="jobs-error-container">
          <p>Xatolik yuz berdi: {error.message}</p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Qayta yuklash
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="jobs">
      <div className="jobs-header">
        <div className="jobs-header-left">
          <h2>Bo'sh ish o'rinlari</h2>
          <p>Barcha e'lon qilingan ish o'rinlarini ko'ring</p>
        </div>
        <div className="jobs-info-badge">
          <Eye size={16} />
          Faqat ko'rish rejimi
        </div>
      </div>

      {/* Filters */}
      <JobFilters
        onFiltersChange={handleFiltersChange}
        totalCount={allJobs.length}
        filteredCount={filteredAndSortedJobs.length}
      />

      <div className="jobs-content">
        {!Array.isArray(allJobs) || allJobs.length === 0 ? (
          <div className="jobs-empty-state">
            <Briefcase size={64} className="jobs-empty-icon" />
            <h3>Bo'sh ish o'rinlari topilmadi</h3>
            <p>Hozircha hech qanday ish o'rni e'lon qilinmagan</p>
          </div>
        ) : filteredAndSortedJobs.length === 0 ? (
          <div className="jobs-empty-state">
            <Briefcase size={64} className="jobs-empty-icon" />
            <h3>Filtr bo'yicha natija topilmadi</h3>
            <p>Filtr shartlariga mos ish o'rni mavjud emas</p>
            <button
              className="btn btn-secondary"
              onClick={() =>
                setFilters({
                  search: "",
                  location: "",
                  salaryFrom: "",
                  salaryTo: "",
                  dateFrom: "",
                  dateTo: "",
                  jobType: "all",
                  sortBy: "createdAt",
                  sortOrder: "desc",
                })
              }
            >
              Filtrlarni tozalash
            </button>
          </div>
        ) : (
          <div className="jobs-table-container">
            <table className="jobs-table">
              <thead>
                <tr>
                  <th>Ish o'rni</th>
                  <th>Joylashuv</th>
                  <th>Maosh</th>
                  <th>Ish turi</th>
                  <th>E'lon qilingan</th>
                  <th>Holat</th>
                  <th>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {paginatedJobs.map((job) => (
                  <tr key={job.id}>
                    <td>
                      <div className="jobs-job-info">
                        <div className="jobs-job-icon">
                          <Briefcase size={20} />
                        </div>
                        <div className="jobs-job-details">
                          <span className="jobs-job-title">{job.title}</span>
                          <span className="jobs-company-name">
                            {job.companyName || "Kompaniya nomi ko'rsatilmagan"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="jobs-location-cell">
                        <MapPin size={16} className="jobs-location-icon" />
                        <span>{job.location || "Ko'rsatilmagan"}</span>
                      </div>
                    </td>
                    <td>
                      <div className="jobs-salary-cell">
                        {job.salary ? (
                          <span>{job.salary.toLocaleString()} so'm</span>
                        ) : (
                          <span className="jobs-no-salary">Kelishiladi</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="jobs-type-cell">
                        <span
                          className={`jobs-type-badge ${getJobTypeBadgeClass(
                            job.type
                          )}`}
                        >
                          {getJobTypeLabel(job.type)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="jobs-date-cell">
                        <span>
                          {new Date(job.createdAt).toLocaleDateString("uz-UZ")}
                        </span>
                        <span className="jobs-time">
                          {new Date(job.createdAt).toLocaleTimeString("uz-UZ", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="jobs-status-cell">
                        <span
                          className={`jobs-status-badge ${getJobStatusBadgeClass(
                            job.status
                          )}`}
                        >
                          {getJobStatusLabel(job.status)}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="jobs-actions-cell">
                        <button
                          className="jobs-action-btn jobs-view-btn"
                          onClick={() => handleView(job)}
                          title="Batafsil ko'rish"
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination - boshqa sahifalar kabi */}
            <Pagination
              currentPage={currentPage}
              totalItems={filteredAndSortedJobs.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              itemsPerPageOptions={[5, 10, 20, 50]}
            />
          </div>
        )}
      </div>

      {/* View Modal */}
      {isViewModalOpen && (
        <ViewJobModal
          isOpen={isViewModalOpen}
          onClose={handleCloseViewModal}
          job={selectedJob}
        />
      )}
    </div>
  );
};

export default Jobs;

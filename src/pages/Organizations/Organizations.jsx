"use client";

import { useState, useMemo } from "react";
import { Plus, Edit, Trash2, MapPin, Building2, Eye } from "lucide-react";
import {
  useOrganizations,
  useDeleteOrganization,
} from "./hooks/useOrganizations";
import CreateOrganizationModal from "./components/CreateOrganizationModal";
import ViewOrganizationModal from "./components/ViewOrganizationModal";
import OrganizationFilters from "./components/OrganizationFilters";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import Pagination from "../../components/Pagination/Pagination";
import "./Organizations.scss";

const Organizations = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    dateFrom: "",
    dateTo: "",
    hasCoordinates: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [organizationToDelete, setOrganizationToDelete] = useState(null);

  const { data: organizationsResponse, isLoading, error } = useOrganizations();
  const { mutate: deleteOrganization, isPending: isDeleting } =
    useDeleteOrganization();

  // API javob strukturasiga mos ravishda ma'lumotlarni olish
  const organizations = organizationsResponse?.data?.organizations || [];

  // Filtrlangan va saralangan ma'lumotlar
  const filteredAndSortedOrganizations = useMemo(() => {
    if (!Array.isArray(organizations)) return [];

    const filtered = organizations.filter((org) => {
      // Search filter
      if (
        filters.search &&
        !org.title?.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      // Date range filter
      if (filters.dateFrom || filters.dateTo) {
        const orgDate = new Date(org.createdAt);
        const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : null;
        const toDate = filters.dateTo
          ? new Date(filters.dateTo + "T23:59:59")
          : null;

        if (fromDate && orgDate < fromDate) return false;
        if (toDate && orgDate > toDate) return false;
      }

      // Coordinates filter
      if (filters.hasCoordinates !== "all") {
        const hasCoords = org.latitude && org.longitude;
        if (filters.hasCoordinates === "yes" && !hasCoords) return false;
        if (filters.hasCoordinates === "no" && hasCoords) return false;
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
        case "address":
          aValue = a.address?.toLowerCase() || "";
          bValue = b.address?.toLowerCase() || "";
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
  }, [organizations, filters]);

  // Pagination logic
  const paginatedOrganizations = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedOrganizations.slice(startIndex, endIndex);
  }, [filteredAndSortedOrganizations, currentPage, itemsPerPage]);

  const handleDelete = (organization) => {
    setOrganizationToDelete(organization);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (organizationToDelete) {
      deleteOrganization(organizationToDelete.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setOrganizationToDelete(null);
          // Reset to first page if current page becomes empty
          const newTotalPages = Math.ceil(
            (filteredAndSortedOrganizations.length - 1) / itemsPerPage
          );
          if (currentPage > newTotalPages && newTotalPages > 0) {
            setCurrentPage(newTotalPages);
          }
        },
        onError: () => {
          // Modal will stay open on error so user can try again
        },
      });
    }
  };

  const handleCloseDeleteModal = () => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false);
      setOrganizationToDelete(null);
    }
  };

  const handleEdit = (organization) => {
    setSelectedOrganization(organization);
    setIsCreateModalOpen(true);
  };

  const handleView = (organization) => {
    setSelectedOrganization(organization);
    setIsViewModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    setSelectedOrganization(null);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedOrganization(null);
  };

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

  if (isLoading) {
    return (
      <div className="organizations">
        <div className="loading-container">
          <div className="loading"></div>
          <p>Tashkilotlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="organizations">
        <div className="error-container">
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
    <div className="organizations">
      <div className="organizations-header">
        <div className="header-left">
          <h2>Tashkilotlar</h2>
          <p>Barcha tashkilotlarni boshqaring</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus size={20} />
          Yangi tashkilot
        </button>
      </div>

      {/* Filters */}
      <OrganizationFilters
        onFiltersChange={handleFiltersChange}
        totalCount={organizations.length}
        filteredCount={filteredAndSortedOrganizations.length}
      />

      <div className="organizations-content">
        {!Array.isArray(organizations) || organizations.length === 0 ? (
          <div className="empty-state">
            <Building2 size={64} className="empty-icon" />
            <h3>Tashkilotlar topilmadi</h3>
            <p>Hozircha hech qanday tashkilot mavjud emas</p>
            <button
              className="btn btn-primary"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus size={20} />
              Birinchi tashkilotni yarating
            </button>
          </div>
        ) : filteredAndSortedOrganizations.length === 0 ? (
          <div className="empty-state">
            <Building2 size={64} className="empty-icon" />
            <h3>Filtr bo'yicha natija topilmadi</h3>
            <p>Filtr shartlariga mos tashkilot mavjud emas</p>
            <button
              className="btn btn-secondary"
              onClick={() =>
                setFilters({
                  search: "",
                  dateFrom: "",
                  dateTo: "",
                  hasCoordinates: "all",
                  sortBy: "createdAt",
                  sortOrder: "desc",
                })
              }
            >
              Filtrlarni tozalash
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="organizations-table">
              <thead>
                <tr>
                  <th>Tashkilot</th>
                  <th>Tavsif</th>
                  <th>Manzil</th>
                  <th>Koordinatalar</th>
                  <th>Yaratilgan</th>
                  <th>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrganizations.map((organization) => (
                  <tr key={organization.id}>
                    <td>
                      <div className="organization-info">
                        <div className="organization-avatar">
                          {organization.avatar &&
                          organization.avatar.startsWith("http") ? (
                            <img
                              src={organization.avatar || "/placeholder.svg"}
                              alt={organization.title}
                            />
                          ) : (
                            <Building2 size={24} />
                          )}
                        </div>
                        <div className="organization-details">
                          <span className="organization-name">
                            {organization.title}
                          </span>
                          <span className="organization-id">
                            ID: {organization.id.slice(0, 8)}...
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="description-cell">
                        <span className="description-text">
                          {organization.description}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="address-cell">
                        <MapPin size={16} className="address-icon" />
                        <span>{organization.address}</span>
                      </div>
                    </td>
                    <td>
                      <div className="coordinates-cell">
                        {organization.longitude && organization.latitude ? (
                          <span>
                            {organization.latitude}, {organization.longitude}
                          </span>
                        ) : (
                          <span className="no-data">—</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="date-cell">
                        <span>
                          {new Date(organization.createdAt).toLocaleDateString(
                            "uz-UZ"
                          )}
                        </span>
                        <span className="time">
                          {new Date(organization.createdAt).toLocaleTimeString(
                            "uz-UZ",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button
                          className="action-btn view-btn"
                          onClick={() => handleView(organization)}
                          title="Ko'rish"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          className="action-btn edit-btn"
                          onClick={() => handleEdit(organization)}
                          title="Tahrirlash"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(organization)}
                          disabled={isDeleting}
                          title="O'chirish"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalItems={filteredAndSortedOrganizations.length}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={handleItemsPerPageChange}
              itemsPerPageOptions={[5, 10, 20, 50]}
            />
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {isCreateModalOpen && (
        <CreateOrganizationModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseCreateModal}
          organization={selectedOrganization}
        />
      )}

      {/* View Modal */}
      {isViewModalOpen && (
        <ViewOrganizationModal
          isOpen={isViewModalOpen}
          onClose={handleCloseViewModal}
          organization={selectedOrganization}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <DeleteConfirmationModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          organization={organizationToDelete}
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default Organizations;

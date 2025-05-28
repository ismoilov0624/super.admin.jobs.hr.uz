"use client";

import { useState, useMemo } from "react";
import { Plus, Edit, Trash2, User, Building2, Shield } from "lucide-react";
import { useAdmins, useDeleteAdmin } from "./hooks/useAdmins";
import CreateAdminModal from "./components/CreateAdminModal";
import DeleteAdminModal from "./components/DeleteAdminModal";
import AdminFilters from "./components/AdminFilters";
import Pagination from "../../components/Pagination/Pagination";
import { useOrganizations } from "../Organizations/hooks/useOrganizations";
import "./Admins.scss";

const Admins = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
    organizationId: "",
    dateFrom: "",
    dateTo: "",
    hasLastLogin: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);

  const { data: adminsResponse, isLoading, error } = useAdmins();
  const { data: organizationsResponse } = useOrganizations();
  const { mutate: deleteAdmin, isPending: isDeleting } = useDeleteAdmin();

  // API javob strukturasiga mos ravishda ma'lumotlarni olish
  const admins = adminsResponse?.data?.admins || [];
  const organizations = organizationsResponse?.data?.organizations || [];

  // Tashkilotlar ro'yxatini object'ga aylantirish (tez qidirish uchun)
  const organizationsMap = useMemo(() => {
    return organizations.reduce((acc, org) => {
      acc[org.id] = org;
      return acc;
    }, {});
  }, [organizations]);

  // Filtrlangan va saralangan adminlar
  const filteredAndSortedAdmins = useMemo(() => {
    if (!Array.isArray(admins)) return [];

    const filtered = admins.filter((admin) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesUsername = admin.username
          ?.toLowerCase()
          .includes(searchLower);
        const organization = organizationsMap[admin.organizationId];
        const matchesOrganization = organization?.title
          ?.toLowerCase()
          .includes(searchLower);

        if (!matchesUsername && !matchesOrganization) return false;
      }

      // Organization filter
      if (
        filters.organizationId &&
        admin.organizationId !== filters.organizationId
      ) {
        return false;
      }

      // Date range filter
      if (filters.dateFrom || filters.dateTo) {
        const adminDate = new Date(admin.createdAt);
        const fromDate = filters.dateFrom ? new Date(filters.dateFrom) : null;
        const toDate = filters.dateTo
          ? new Date(filters.dateTo + "T23:59:59")
          : null;

        if (fromDate && adminDate < fromDate) return false;
        if (toDate && adminDate > toDate) return false;
      }

      // Activity filter
      if (filters.hasLastLogin !== "all") {
        const hasLogin = !!admin.lastLoginAt;
        if (filters.hasLastLogin === "yes" && !hasLogin) return false;
        if (filters.hasLastLogin === "no" && hasLogin) return false;
      }

      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (filters.sortBy) {
        case "username":
          aValue = a.username?.toLowerCase() || "";
          bValue = b.username?.toLowerCase() || "";
          break;
        case "lastLoginAt":
          aValue = a.lastLoginAt ? new Date(a.lastLoginAt) : new Date(0);
          bValue = b.lastLoginAt ? new Date(b.lastLoginAt) : new Date(0);
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
  }, [admins, filters, organizationsMap]);

  // Pagination logic
  const paginatedAdmins = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredAndSortedAdmins.slice(startIndex, endIndex);
  }, [filteredAndSortedAdmins, currentPage, itemsPerPage]);

  const handleDelete = (admin) => {
    setAdminToDelete(admin);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (adminToDelete) {
      deleteAdmin(adminToDelete.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setAdminToDelete(null);
          // Reset to first page if current page becomes empty
          const newTotalPages = Math.ceil(
            (filteredAndSortedAdmins.length - 1) / itemsPerPage
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
      setAdminToDelete(null);
    }
  };

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setIsCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setSelectedAdmin(null);
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
      <div className="admins">
        <div className="admins-loading-container">
          <div className="loading"></div>
          <p>Adminlar yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admins">
        <div className="admins-error-container">
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
    <div className="admins">
      <div className="admins-header">
        <div className="admins-header-left">
          <h2>Adminlar</h2>
          <p>Tizim adminlarini boshqaring</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus size={20} />
          Yangi admin
        </button>
      </div>

      {/* Filters */}
      <AdminFilters
        onFiltersChange={handleFiltersChange}
        totalCount={admins.length}
        filteredCount={filteredAndSortedAdmins.length}
        organizations={organizations}
      />

      <div className="admins-content">
        {!Array.isArray(admins) || admins.length === 0 ? (
          <div className="admins-empty-state">
            <Shield size={64} className="admins-empty-icon" />
            <h3>Adminlar topilmadi</h3>
            <p>Hozircha hech qanday admin mavjud emas</p>
            <button
              className="btn btn-primary"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus size={20} />
              Birinchi adminni yarating
            </button>
          </div>
        ) : filteredAndSortedAdmins.length === 0 ? (
          <div className="admins-empty-state">
            <Shield size={64} className="admins-empty-icon" />
            <h3>Filtr bo'yicha natija topilmadi</h3>
            <p>Filtr shartlariga mos admin mavjud emas</p>
            <button
              className="btn btn-secondary"
              onClick={() =>
                setFilters({
                  search: "",
                  organizationId: "",
                  dateFrom: "",
                  dateTo: "",
                  hasLastLogin: "all",
                  sortBy: "createdAt",
                  sortOrder: "desc",
                })
              }
            >
              Filtrlarni tozalash
            </button>
          </div>
        ) : (
          <div className="admins-table-container">
            <table className="admins-table">
              <thead>
                <tr>
                  <th>Admin</th>
                  <th>Tashkilot</th>
                  <th>Yaratilgan</th>
                  <th>Oxirgi faollik</th>
                  <th>Amallar</th>
                </tr>
              </thead>
              <tbody>
                {paginatedAdmins.map((admin) => {
                  const organization = organizationsMap[admin.organizationId];
                  return (
                    <tr key={admin.id}>
                      <td>
                        <div className="admins-admin-info">
                          <div className="admins-admin-avatar">
                            <User size={20} />
                          </div>
                          <div className="admins-admin-details">
                            <span className="admins-admin-username">
                              {admin.username}
                            </span>
                            <span className="admins-admin-id">
                              ID: {admin.id.slice(0, 8)}...
                            </span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="admins-organization-cell">
                          {organization ? (
                            <>
                              <Building2
                                size={16}
                                className="admins-org-icon"
                              />
                              <div className="admins-org-details">
                                <span className="admins-org-name">
                                  {organization.title}
                                </span>
                                <span className="admins-org-address">
                                  {organization.address}
                                </span>
                              </div>
                            </>
                          ) : (
                            <span className="admins-no-org">
                              Tashkilot topilmadi
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="admins-date-cell">
                          <span>
                            {new Date(admin.createdAt).toLocaleDateString(
                              "uz-UZ"
                            )}
                          </span>
                          <span className="admins-time">
                            {new Date(admin.createdAt).toLocaleTimeString(
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
                        <div className="admins-activity-cell">
                          {admin.lastLoginAt ? (
                            <>
                              <span>
                                {new Date(admin.lastLoginAt).toLocaleDateString(
                                  "uz-UZ"
                                )}
                              </span>
                              <span className="admins-time">
                                {new Date(admin.lastLoginAt).toLocaleTimeString(
                                  "uz-UZ",
                                  {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </span>
                            </>
                          ) : (
                            <span className="admins-no-activity">
                              Hech qachon
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="admins-actions-cell">
                          <button
                            className="admins-action-btn admins-edit-btn"
                            onClick={() => handleEdit(admin)}
                            title="Tahrirlash"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="admins-action-btn admins-delete-btn"
                            onClick={() => handleDelete(admin)}
                            disabled={isDeleting}
                            title="O'chirish"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalItems={filteredAndSortedAdmins.length}
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
        <CreateAdminModal
          isOpen={isCreateModalOpen}
          onClose={handleCloseModal}
          admin={selectedAdmin}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <DeleteAdminModal
          isOpen={isDeleteModalOpen}
          onClose={handleCloseDeleteModal}
          onConfirm={handleConfirmDelete}
          admin={adminToDelete}
          organization={
            adminToDelete
              ? organizationsMap[adminToDelete.organizationId]
              : null
          }
          isLoading={isDeleting}
        />
      )}
    </div>
  );
};

export default Admins;

"use client";

import { useState, useEffect } from "react";
import { X, User, Lock, Building2 } from "lucide-react";
import { useCreateAdmin, useUpdateAdmin } from "../hooks/useAdmins";
import { useOrganizations } from "../../Organizations/hooks/useOrganizations";
import "./CreateAdminModal.scss";

const CreateAdminModal = ({ isOpen, onClose, admin = null }) => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    organizationId: "",
  });

  const { mutate: createAdmin, isPending: isCreating } = useCreateAdmin();
  const { mutate: updateAdmin, isPending: isUpdating } = useUpdateAdmin();
  const { data: organizationsResponse, isLoading: isLoadingOrgs } =
    useOrganizations();

  const organizations = organizationsResponse?.data?.organizations || [];
  const isEditing = !!admin;
  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (admin) {
      setFormData({
        username: admin.username || "",
        password: "", // Parolni bo'sh qoldirish (xavfsizlik uchun)
        organizationId: admin.organizationId || "",
      });
    } else {
      setFormData({
        username: "",
        password: "",
        organizationId: "",
      });
    }
  }, [admin]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Tahrirlash vaqtida parol bo'sh bo'lsa, uni o'tkazib yuborish
    const submitData = { ...formData };
    if (isEditing && !submitData.password) {
      delete submitData.password;
    }

    if (isEditing) {
      updateAdmin(
        { id: admin.id, data: submitData },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      createAdmin(submitData, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-modal-overlay" onClick={handleOverlayClick}>
      <div className="admin-modal-content">
        <div className="admin-modal-header">
          <h3>{isEditing ? "Adminni tahrirlash" : "Yangi admin yaratish"}</h3>
          <button className="admin-modal-close" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-modal-form">
          <div className="admin-form-group">
            <label htmlFor="username">
              <User size={16} />
              Foydalanuvchi nomi *
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Foydalanuvchi nomini kiriting"
              required
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="password">
              <Lock size={16} />
              Parol {isEditing ? "(o'zgartirish uchun)" : "*"}
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={
                isEditing ? "Yangi parol (ixtiyoriy)" : "Parolni kiriting"
              }
              required={!isEditing}
            />
            {isEditing && (
              <small className="admin-password-hint">
                Parolni o'zgartirmaslik uchun bo'sh qoldiring
              </small>
            )}
          </div>

          <div className="admin-form-group">
            <label htmlFor="organizationId">
              <Building2 size={16} />
              Tashkilot *
            </label>
            {isLoadingOrgs ? (
              <div className="admin-loading-select">
                <div className="loading"></div>
                <span>Tashkilotlar yuklanmoqda...</span>
              </div>
            ) : (
              <select
                id="organizationId"
                name="organizationId"
                value={formData.organizationId}
                onChange={handleInputChange}
                required
              >
                <option value="">Tashkilotni tanlang</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.title}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="admin-modal-actions">
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={onClose}
              disabled={isPending}
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={isPending || isLoadingOrgs}
            >
              {isPending
                ? "Saqlanmoqda..."
                : isEditing
                ? "Yangilash"
                : "Yaratish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAdminModal;

"use client";

import { AlertTriangle, X, User, Building2 } from "lucide-react";
import "./DeleteAdminModal.scss";

const DeleteAdminModal = ({
  isOpen,
  onClose,
  onConfirm,
  admin,
  organization,
  isLoading = false,
}) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  if (!isOpen || !admin) return null;

  return (
    <div className="delete-admin-modal-overlay" onClick={handleOverlayClick}>
      <div className="delete-admin-modal-content">
        <div className="delete-admin-modal-header">
          <div className="delete-admin-warning-icon">
            <AlertTriangle size={24} />
          </div>
          <h3 className="delete-admin-modal-title">Adminni o'chirish</h3>
          <button
            className="delete-admin-modal-close"
            onClick={onClose}
            disabled={isLoading}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <div className="delete-admin-modal-body">
          <div className="delete-admin-info">
            <div className="delete-admin-avatar">
              <User size={24} />
            </div>
            <div className="delete-admin-details">
              <h4 className="delete-admin-username">{admin.username}</h4>
              {organization && (
                <div className="delete-admin-organization">
                  <Building2 size={16} />
                  <span>{organization.title}</span>
                </div>
              )}
              <span className="delete-admin-id">
                ID: {admin.id.slice(0, 8)}...
              </span>
            </div>
          </div>

          <div className="delete-admin-warning-message">
            <p className="delete-admin-warning-text">
              <strong>Diqqat!</strong> Bu amalni bekor qilib bo'lmaydi. Admin va
              unga bog'liq barcha ma'lumotlar butunlay o'chiriladi.
            </p>
            <ul className="delete-admin-consequences-list">
              <li>Admin hisobi va kirish huquqlari</li>
              <li>Admin tomonidan yaratilgan ma'lumotlar</li>
              <li>Tizimga kirish tarixi</li>
              <li>Bog'liq sessiyalar va tokenlar</li>
            </ul>
          </div>

          <div className="delete-admin-confirmation-input">
            <p className="delete-admin-confirmation-label">
              Davom etish uchun admin nomini kiriting:
            </p>
            <div className="delete-admin-input-group">
              <input
                type="text"
                placeholder={admin.username}
                className="delete-admin-confirmation-field"
                id="deleteAdminConfirmationInput"
                disabled={isLoading}
              />
              <span className="delete-admin-expected-text">
                Kutilayotgan: "{admin.username}"
              </span>
            </div>
          </div>
        </div>

        <div className="delete-admin-modal-footer">
          <button
            type="button"
            className="delete-admin-btn delete-admin-btn-secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Bekor qilish
          </button>
          <button
            type="button"
            className="delete-admin-btn delete-admin-btn-danger"
            onClick={() => {
              const input = document.getElementById(
                "deleteAdminConfirmationInput"
              );
              if (input?.value === admin.username) {
                onConfirm();
              } else {
                input?.focus();
                input?.classList.add("delete-admin-input-error");
                setTimeout(
                  () => input?.classList.remove("delete-admin-input-error"),
                  2000
                );
              }
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="delete-admin-loading-spinner"></div>
                O'chirilmoqda...
              </>
            ) : (
              <>
                <AlertTriangle size={16} />
                O'chirish
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAdminModal;

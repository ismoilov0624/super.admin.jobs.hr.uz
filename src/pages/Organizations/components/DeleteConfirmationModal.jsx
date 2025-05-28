"use client";

import { AlertTriangle, X } from "lucide-react";
import "./DeleteConfirmationModal.scss";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  organization,
  isLoading = false,
}) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  if (!isOpen || !organization) return null;

  return (
    <div className="delete-modal-overlay" onClick={handleOverlayClick}>
      <div className="delete-modal-content">
        <div className="delete-modal-header">
          <div className="delete-warning-icon">
            <AlertTriangle size={24} />
          </div>
          <h3 className="delete-modal-title">Tashkilotni o'chirish</h3>
          <button
            className="delete-modal-close"
            onClick={onClose}
            disabled={isLoading}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <div className="delete-modal-body">
          <div className="delete-organization-info">
            <div className="delete-organization-avatar">
              {organization.avatar && organization.avatar.startsWith("http") ? (
                <img
                  src={organization.avatar || "/placeholder.svg"}
                  alt={organization.title}
                />
              ) : (
                <div className="delete-avatar-placeholder">
                  {organization.title?.charAt(0)?.toUpperCase() || "T"}
                </div>
              )}
            </div>
            <div className="delete-organization-details">
              <h4 className="delete-organization-title">
                {organization.title}
              </h4>
              <p className="delete-organization-address">
                {organization.address}
              </p>
              <span className="delete-organization-id">
                ID: {organization.id.slice(0, 8)}...
              </span>
            </div>
          </div>

          <div className="delete-warning-message">
            <p className="delete-warning-text">
              <strong>Diqqat!</strong> Bu amalni bekor qilib bo'lmaydi.
              Tashkilot va unga bog'liq barcha ma'lumotlar butunlay o'chiriladi.
            </p>
            <ul className="delete-consequences-list">
              <li>Tashkilot ma'lumotlari</li>
              <li>Bog'liq adminlar</li>
              <li>Vakansiyalar va ishlar</li>
              <li>Arizalar va nomzodlar</li>
            </ul>
          </div>

          <div className="delete-confirmation-input">
            <p className="delete-confirmation-label">
              Davom etish uchun tashkilot nomini kiriting:
            </p>
            <div className="delete-input-group">
              <input
                type="text"
                placeholder={organization.title}
                className="delete-confirmation-field"
                id="deleteConfirmationInput"
                disabled={isLoading}
              />
              <span className="delete-expected-text">
                Kutilayotgan: "{organization.title}"
              </span>
            </div>
          </div>
        </div>

        <div className="delete-modal-footer">
          <button
            type="button"
            className="delete-btn delete-btn-secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            Bekor qilish
          </button>
          <button
            type="button"
            className="delete-btn delete-btn-danger"
            onClick={() => {
              const input = document.getElementById("deleteConfirmationInput");
              if (input?.value === organization.title) {
                onConfirm();
              } else {
                input?.focus();
                input?.classList.add("delete-input-error");
                setTimeout(
                  () => input?.classList.remove("delete-input-error"),
                  2000
                );
              }
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="delete-loading-spinner"></div>
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

export default DeleteConfirmationModal;

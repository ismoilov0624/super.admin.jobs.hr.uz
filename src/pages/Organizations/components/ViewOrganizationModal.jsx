"use client";

import { X, Building2, MapPin, Calendar, Globe } from "lucide-react";
import "./ViewOrganizationModal.scss";

const ViewOrganizationModal = ({ isOpen, onClose, organization }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen || !organization) return null;

  return (
    <div className="view-modal-overlay" onClick={handleOverlayClick}>
      <div className="view-modal-content">
        <div className="view-modal-header">
          <h3>Tashkilot ma'lumotlari</h3>
          <button className="modal-close" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        <div className="view-modal-body">
          {/* Organization Header */}
          <div className="organization-header">
            <div className="organization-avatar-large">
              {organization.avatar && organization.avatar.startsWith("http") ? (
                <img
                  src={organization.avatar || "/placeholder.svg"}
                  alt={organization.title}
                />
              ) : (
                <Building2 size={48} />
              )}
            </div>
            <div className="organization-main-info">
              <h2 className="organization-title">{organization.title}</h2>
              <p className="organization-id">ID: {organization.id}</p>
            </div>
          </div>

          {/* Organization Details */}
          <div className="organization-details">
            <div className="detail-section">
              <h4>
                <Building2 size={18} />
                Asosiy ma'lumotlar
              </h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Tashkilot nomi:</label>
                  <span>{organization.title}</span>
                </div>
                <div className="detail-item">
                  <label>Tavsif:</label>
                  <span>{organization.description}</span>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h4>
                <MapPin size={18} />
                Joylashuv ma'lumotlari
              </h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Manzil:</label>
                  <span>{organization.address}</span>
                </div>
                {organization.latitude && organization.longitude && (
                  <>
                    <div className="detail-item">
                      <label>Kenglik (Latitude):</label>
                      <span>{organization.latitude}</span>
                    </div>
                    <div className="detail-item">
                      <label>Uzunlik (Longitude):</label>
                      <span>{organization.longitude}</span>
                    </div>
                    <div className="detail-item full-width">
                      <label>Xarita havolasi:</label>
                      <a
                        href={`https://www.google.com/maps?q=${organization.latitude},${organization.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="map-link"
                      >
                        Google Maps'da ko'rish
                      </a>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="detail-section">
              <h4>
                <Calendar size={18} />
                Vaqt ma'lumotlari
              </h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Yaratilgan sana:</label>
                  <span>
                    {new Date(organization.createdAt).toLocaleDateString(
                      "uz-UZ",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  </span>
                </div>
                <div className="detail-item">
                  <label>Yaratilgan vaqt:</label>
                  <span>
                    {new Date(organization.createdAt).toLocaleTimeString(
                      "uz-UZ",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </span>
                </div>
                {organization.updatedAt &&
                  organization.updatedAt !== organization.createdAt && (
                    <>
                      <div className="detail-item">
                        <label>Yangilangan sana:</label>
                        <span>
                          {new Date(organization.updatedAt).toLocaleDateString(
                            "uz-UZ",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                      <div className="detail-item">
                        <label>Yangilangan vaqt:</label>
                        <span>
                          {new Date(organization.updatedAt).toLocaleTimeString(
                            "uz-UZ",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </div>
                    </>
                  )}
              </div>
            </div>

            {organization.avatar && (
              <div className="detail-section">
                <h4>
                  <Globe size={18} />
                  Qo'shimcha ma'lumotlar
                </h4>
                <div className="detail-grid">
                  <div className="detail-item full-width">
                    <label>Avatar URL:</label>
                    <a
                      href={organization.avatar}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="avatar-link"
                    >
                      {organization.avatar}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="view-modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewOrganizationModal;

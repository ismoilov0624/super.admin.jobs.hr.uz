"use client";

import {
  X,
  Briefcase,
  MapPin,
  Calendar,
  Building2,
  Clock,
  User,
  FileText,
} from "lucide-react";
import "./ViewJobModal.scss";

const ViewJobModal = ({ isOpen, onClose, job }) => {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
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
        return "Shartnoma asosida";
      case "remote":
        return "Masofaviy";
      default:
        return type || "Noma'lum";
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

  if (!isOpen || !job) return null;

  return (
    <div className="view-job-modal-overlay" onClick={handleOverlayClick}>
      <div className="view-job-modal-content">
        <div className="view-job-modal-header">
          <h3>Ish o'rni tafsilotlari</h3>
          <button className="job-modal-close" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        <div className="view-job-modal-body">
          {/* Job Header */}
          <div className="job-header">
            <div className="job-icon-large">
              <Briefcase size={48} />
            </div>
            <div className="job-main-info">
              <h2 className="job-title">{job.title}</h2>
              <p className="job-company">
                {job.companyName || "Kompaniya nomi ko'rsatilmagan"}
              </p>
              <div className="job-status-container">
                <span
                  className={`job-status-badge ${getJobStatusBadgeClass(
                    job.status
                  )}`}
                >
                  {getJobStatusLabel(job.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="job-details">
            <div className="detail-section">
              <h4>
                <Briefcase size={18} />
                Asosiy ma'lumotlar
              </h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Ish nomi:</label>
                  <span>{job.title}</span>
                </div>
                <div className="detail-item">
                  <label>Kompaniya:</label>
                  <span>{job.companyName || "Ko'rsatilmagan"}</span>
                </div>
                <div className="detail-item">
                  <label>Ish turi:</label>
                  <span>{getJobTypeLabel(job.type)}</span>
                </div>
                <div className="detail-item">
                  <label>Holat:</label>
                  <span
                    className={`status-text ${getJobStatusBadgeClass(
                      job.status
                    )}`}
                  >
                    {getJobStatusLabel(job.status)}
                  </span>
                </div>
              </div>
            </div>

            {job.description && (
              <div className="detail-section">
                <h4>
                  <FileText size={18} />
                  Ish tavsifi
                </h4>
                <div className="job-description">
                  <p>{job.description}</p>
                </div>
              </div>
            )}

            <div className="detail-section">
              <h4>
                <MapPin size={18} />
                Joylashuv va maosh
              </h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Joylashuv:</label>
                  <span>{job.location || "Ko'rsatilmagan"}</span>
                </div>
                <div className="detail-item">
                  <label>Maosh:</label>
                  <span className="salary-amount">
                    {job.salary
                      ? `${job.salary.toLocaleString()} so'm`
                      : "Kelishiladi"}
                  </span>
                </div>
                {job.salaryType && (
                  <div className="detail-item">
                    <label>Maosh turi:</label>
                    <span>{job.salaryType}</span>
                  </div>
                )}
              </div>
            </div>

            {(job.requirements || job.responsibilities) && (
              <div className="detail-section">
                <h4>
                  <User size={18} />
                  Talablar va mas'uliyatlar
                </h4>
                <div className="requirements-responsibilities">
                  {job.requirements && (
                    <div className="requirements">
                      <h5>Talablar:</h5>
                      <div className="content">
                        {Array.isArray(job.requirements) ? (
                          <ul>
                            {job.requirements.map((req, index) => (
                              <li key={index}>{req}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>{job.requirements}</p>
                        )}
                      </div>
                    </div>
                  )}
                  {job.responsibilities && (
                    <div className="responsibilities">
                      <h5>Mas'uliyatlar:</h5>
                      <div className="content">
                        {Array.isArray(job.responsibilities) ? (
                          <ul>
                            {job.responsibilities.map((resp, index) => (
                              <li key={index}>{resp}</li>
                            ))}
                          </ul>
                        ) : (
                          <p>{job.responsibilities}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="detail-section">
              <h4>
                <Calendar size={18} />
                Vaqt ma'lumotlari
              </h4>
              <div className="detail-grid">
                <div className="detail-item">
                  <label>E'lon qilingan sana:</label>
                  <span>
                    {new Date(job.createdAt).toLocaleDateString("uz-UZ", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <div className="detail-item">
                  <label>E'lon qilingan vaqt:</label>
                  <span>
                    {new Date(job.createdAt).toLocaleTimeString("uz-UZ", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {job.deadline && (
                  <>
                    <div className="detail-item">
                      <label>Muddati:</label>
                      <span>
                        {new Date(job.deadline).toLocaleDateString("uz-UZ", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </>
                )}
                {job.updatedAt && job.updatedAt !== job.createdAt && (
                  <>
                    <div className="detail-item">
                      <label>Yangilangan sana:</label>
                      <span>
                        {new Date(job.updatedAt).toLocaleDateString("uz-UZ", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Yangilangan vaqt:</label>
                      <span>
                        {new Date(job.updatedAt).toLocaleTimeString("uz-UZ", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {(job.benefits || job.workingHours || job.experience) && (
              <div className="detail-section">
                <h4>
                  <Clock size={18} />
                  Qo'shimcha ma'lumotlar
                </h4>
                <div className="detail-grid">
                  {job.experience && (
                    <div className="detail-item">
                      <label>Tajriba:</label>
                      <span>{job.experience}</span>
                    </div>
                  )}
                  {job.workingHours && (
                    <div className="detail-item">
                      <label>Ish vaqti:</label>
                      <span>{job.workingHours}</span>
                    </div>
                  )}
                  {job.benefits && (
                    <div className="detail-item full-width">
                      <label>Imtiyozlar:</label>
                      <span>{job.benefits}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {job.id && (
              <div className="detail-section">
                <h4>
                  <Building2 size={18} />
                  Texnik ma'lumotlar
                </h4>
                <div className="detail-grid">
                  <div className="detail-item full-width">
                    <label>ID:</label>
                    <span className="job-id">{job.id}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="view-job-modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewJobModal;

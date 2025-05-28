"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { useCreateOrganization, useUpdateOrganization } from "../hooks/useOrganizations"
import "./CreateOrganizationModal.scss"

const CreateOrganizationModal = ({ isOpen, onClose, organization = null }) => {
  const [formData, setFormData] = useState({
    title: "",
    address: "",
    description: "",
    avatar: "",
    longitude: "",
    latitude: "",
  })

  const { mutate: createOrganization, isPending: isCreating } = useCreateOrganization()
  const { mutate: updateOrganization, isPending: isUpdating } = useUpdateOrganization()

  const isEditing = !!organization
  const isPending = isCreating || isUpdating

  useEffect(() => {
    if (organization) {
      setFormData({
        title: organization.title || "",
        address: organization.address || "",
        description: organization.description || "",
        avatar: organization.avatar || "",
        longitude: organization.longitude || "",
        latitude: organization.latitude || "",
      })
    } else {
      setFormData({
        title: "",
        address: "",
        description: "",
        avatar: "",
        longitude: "",
        latitude: "",
      })
    }
  }, [organization])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const submitData = {
      ...formData,
      longitude: formData.longitude ? Number.parseFloat(formData.longitude) : null,
      latitude: formData.latitude ? Number.parseFloat(formData.latitude) : null,
    }

    if (isEditing) {
      updateOrganization(
        { id: organization.id, data: submitData },
        {
          onSuccess: () => {
            onClose()
          },
        },
      )
    } else {
      createOrganization(submitData, {
        onSuccess: () => {
          onClose()
        },
      })
    }
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>{isEditing ? "Tashkilotni tahrirlash" : "Yangi tashkilot yaratish"}</h3>
          <button className="modal-close" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label htmlFor="title">Tashkilot nomi *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Tashkilot nomini kiriting"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Tavsif *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Tashkilot haqida qisqacha ma'lumot"
              rows={4}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Manzil *</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="To'liq manzilni kiriting"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="latitude">Kenglik (Latitude)</label>
              <input
                type="number"
                id="latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                placeholder="65.4321"
                step="any"
              />
            </div>
            <div className="form-group">
              <label htmlFor="longitude">Uzunlik (Longitude)</label>
              <input
                type="number"
                id="longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                placeholder="12.3456"
                step="any"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="avatar">Avatar URL</label>
            <input
              type="url"
              id="avatar"
              name="avatar"
              value={formData.avatar}
              onChange={handleInputChange}
              placeholder="https://example.com/avatar.png"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isPending}>
              Bekor qilish
            </button>
            <button type="submit" className="btn btn-primary" disabled={isPending}>
              {isPending ? "Saqlanmoqda..." : isEditing ? "Yangilash" : "Yaratish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateOrganizationModal

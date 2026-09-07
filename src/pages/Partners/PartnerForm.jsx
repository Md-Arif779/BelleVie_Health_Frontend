import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Handshake,
  ArrowLeft,
  Save,
  RefreshCw,
} from "lucide-react";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { hasPermission } from "../../utils/permission";

const PARTNER_TYPES = [
  {
    value: "CAREGIVER_AGENCY",
    label: "Caregiver Agency",
  },
  {
    value: "INSURANCE_COMPANY",
    label: "Insurance Company",
  },
  {
    value: "CORPORATE",
    label: "Corporate",
  },
  {
    value: "NGO",
    label: "NGO",
  },
  {
    value: "OTHER",
    label: "Other",
  },
];

const STATUS_OPTIONS = [
  {
    value: "ACTIVE",
    label: "Active",
  },
  {
    value: "INACTIVE",
    label: "Inactive",
  },
  {
    value: "SUSPENDED",
    label: "Suspended",
  },
];

const emptyForm = {
  name: "",
  partner_type: "CAREGIVER_AGENCY",
  contact_person: "",
  phone: "",
  email: "",
  address: "",
  website: "",
  services: "",
  status: "ACTIVE",
  notes: "",
};

const PartnerForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const {
    permissions,
    user,
    loading: authLoading,
  } = useAuth();

  const [formData, setFormData] =
    useState(emptyForm);

  const [loading, setLoading] =
    useState(isEditMode);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const canAdd =
    user?.role === "SUPER_ADMIN" ||
    hasPermission(
      permissions,
      "partners",
      "can_add"
    );

  const canEdit =
    user?.role === "SUPER_ADMIN" ||
    hasPermission(
      permissions,
      "partners",
      "can_edit"
    );

  useEffect(() => {
    if (!isEditMode) {
      setLoading(false);
      return;
    }

    const fetchPartner = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/partners/${id}/`
        );

        const data = response.data;

        setFormData({
          name: data.name || "",
          partner_type:
            data.partner_type ||
            "CAREGIVER_AGENCY",
          contact_person:
            data.contact_person || "",
          phone: data.phone || "",
          email: data.email || "",
          address: data.address || "",
          website: data.website || "",
          services: data.services || "",
          status: data.status || "ACTIVE",
          notes: data.notes || "",
        });
      } catch (err) {
        console.error(
          "Partner Details Error:",
          err
        );

        setError(
          err.response?.data?.detail ||
            "Failed to load partner."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPartner();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.name.trim()) {
      setError("Partner name is required.");
      return;
    }

    if (!formData.partner_type) {
      setError("Partner type is required.");
      return;
    }

    try {
      setSaving(true);

      if (isEditMode) {
        await api.patch(
          `/partners/${id}/`,
          formData
        );
      } else {
        await api.post(
          "/partners/",
          formData
        );
      }

      navigate(
        isEditMode
          ? `/partners/${id}`
          : "/partners"
      );
    } catch (err) {
      console.error(
        "Save Partner Error:",
        err
      );

      const backendErrors =
        err.response?.data;

      if (
        typeof backendErrors ===
        "object" &&
        backendErrors !== null
      ) {
        const firstError =
          Object.values(
            backendErrors
          ).flat()[0];

        setError(
          firstError ||
            "Failed to save partner."
        );
      } else {
        setError(
          "Failed to save partner."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-10 text-center">

          <RefreshCw
            size={25}
            className="mx-auto animate-spin text-[#2F6FED]"
          />

          <p className="mt-4 text-sm text-[#7A7A7A]">
            Loading partner...
          </p>

        </div>
      </div>
    );
  }

  if (
    (!isEditMode && !canAdd) ||
    (isEditMode && !canEdit)
  ) {
    return (
      <div className="p-6">

        <div className="bg-white border border-red-100 rounded-2xl p-10 text-center">

          <Handshake
            size={42}
            className="mx-auto text-red-500 mb-4"
          />

          <h2 className="text-xl font-bold text-[#212121]">
            Access Denied
          </h2>

          <p className="text-sm text-[#7A7A7A] mt-2">
            You do not have permission to{" "}
            {isEditMode ? "edit" : "add"} partners.
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">

      {/* HEADER */}

      <div className="mb-6">

        <button
          type="button"
          onClick={() =>
            navigate(
              isEditMode
                ? `/partners/${id}`
                : "/partners"
            )
          }
          className="flex items-center gap-2 text-sm font-semibold text-[#7A7A7A] hover:text-[#2F6FED] transition mb-4"
        >
          <ArrowLeft size={17} />
          Back to Partners
        </button>

        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-xl bg-[#D9F7E8] flex items-center justify-center">
            <Handshake
              size={24}
              className="text-[#2F6FED]"
            />
          </div>

          <div>

            <h1 className="text-2xl font-bold text-[#212121]">
              {isEditMode
                ? "Edit Partner"
                : "New Partner"}
            </h1>

            <p className="text-sm text-[#7A7A7A] mt-1">
              {isEditMode
                ? "Update partner information"
                : "Create a new partner record"}
            </p>

          </div>

        </div>

      </div>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* BASIC INFORMATION */}

        <div className="bg-white border border-[#E5E7EB] rounded-2xl">

          <div className="px-6 py-4 border-b border-[#E5E7EB]">

            <h2 className="text-sm font-bold text-[#212121]">
              Basic Information
            </h2>

          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

            <FormField
              label="Partner Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter partner name"
            />

            <FormSelect
              label="Partner Type"
              name="partner_type"
              value={formData.partner_type}
              onChange={handleChange}
              options={PARTNER_TYPES}
              required
            />

            <FormField
              label="Contact Person"
              name="contact_person"
              value={formData.contact_person}
              onChange={handleChange}
              placeholder="Enter contact person"
            />

            <FormField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />

            <FormField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />

            <FormField
              label="Website"
              name="website"
              type="url"
              value={formData.website}
              onChange={handleChange}
              placeholder="https://example.com"
            />

            <div className="md:col-span-2">

              <FormTextarea
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter partner address"
              />

            </div>

          </div>

        </div>

        {/* SERVICES */}

        <div className="bg-white border border-[#E5E7EB] rounded-2xl">

          <div className="px-6 py-4 border-b border-[#E5E7EB]">

            <h2 className="text-sm font-bold text-[#212121]">
              Services
            </h2>

          </div>

          <div className="p-6">

            <FormTextarea
              label="Services Offered"
              name="services"
              value={formData.services}
              onChange={handleChange}
              placeholder="Describe the services provided by this partner..."
              rows={5}
            />

          </div>

        </div>

        {/* STATUS & NOTES */}

        <div className="bg-white border border-[#E5E7EB] rounded-2xl">

          <div className="px-6 py-4 border-b border-[#E5E7EB]">

            <h2 className="text-sm font-bold text-[#212121]">
              Status & Notes
            </h2>

          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

            <FormSelect
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={STATUS_OPTIONS}
              required
            />

            <div />

            <div className="md:col-span-2">

              <FormTextarea
                label="Notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Additional notes..."
                rows={5}
              />

            </div>

          </div>

        </div>

        {/* ERROR */}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 text-sm">
            {error}
          </div>
        )}

        {/* ACTIONS */}

        <div className="flex items-center justify-end gap-3">

          <button
            type="button"
            onClick={() =>
              navigate(
                isEditMode
                  ? `/partners/${id}`
                  : "/partners"
              )
            }
            className="px-5 py-2.5 rounded-xl border border-[#E5E7EB] bg-white text-sm font-semibold text-[#6B7280] hover:bg-[#F8FAFC] transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2F6FED] text-white text-sm font-semibold hover:bg-[#2459C7] transition disabled:opacity-60 disabled:cursor-not-allowed"
          >

            {saving ? (
              <RefreshCw
                size={17}
                className="animate-spin"
              />
            ) : (
              <Save size={17} />
            )}

            {saving
              ? "Saving..."
              : isEditMode
              ? "Update Partner"
              : "Create Partner"}

          </button>

        </div>

      </form>

    </div>
  );
};

const FormField = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
}) => {
  return (
    <div>

      <label className="block text-sm font-semibold text-[#374151] mb-2">
        {label}
        {required && (
          <span className="text-red-500 ml-1">
            *
          </span>
        )}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#212121] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
      />

    </div>
  );
};

const FormSelect = ({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}) => {
  return (
    <div>

      <label className="block text-sm font-semibold text-[#374151] mb-2">
        {label}
        {required && (
          <span className="text-red-500 ml-1">
            *
          </span>
        )}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-sm text-[#212121] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

    </div>
  );
};

const FormTextarea = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
}) => {
  return (
    <div>

      <label className="block text-sm font-semibold text-[#374151] mb-2">
        {label}
      </label>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-4 py-3 rounded-lg border border-[#E5E7EB] text-sm text-[#212121] outline-none resize-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
      />

    </div>
  );
};

export default PartnerForm;
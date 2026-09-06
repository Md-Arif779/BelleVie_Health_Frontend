import { useEffect, useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  getDiagnosticCenter,
  createDiagnosticCenter,
  updateDiagnosticCenter,
} from "../../services/diagnosticService";

import { useAuth } from "../../context/AuthContext";
import {
  canAdd,
  canEdit,
} from "../../utils/permission";

const DiagnosticCenterForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { permissions } = useAuth();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    tests: "",
    prices: "",
    packages: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    status: "ACTIVE",
  });

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditMode) return;

    const loadCenter = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getDiagnosticCenter(id);

        setFormData({
          name: data.name || "",
          location: data.location || "",
          tests: data.tests || "",
          prices: data.prices || "",
          packages: data.packages || "",
          phone: data.phone || "",
          email: data.email || "",
          website: data.website || "",
          address: data.address || "",
          status: data.status || "ACTIVE",
        });
      } catch (err) {
        console.error(
          "Diagnostic Center Details Error:",
          err
        );

        setError(
          err?.response?.data?.detail ||
            "Failed to load diagnostic center."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCenter();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getApiError = (err) => {
    const data = err?.response?.data;

    if (!data) {
      return "Something went wrong. Please try again.";
    }

    if (typeof data.detail === "string") {
      return data.detail;
    }

    if (typeof data === "object") {
      return Object.entries(data)
        .map(([field, messages]) => {
          const message = Array.isArray(messages)
            ? messages.join(", ")
            : String(messages);

          return `${field}: ${message}`;
        })
        .join(" | ");
    }

    return "Failed to save diagnostic center.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.name.trim()) {
      setError("Diagnostic center name is required.");
      return;
    }

    if (!formData.location.trim()) {
      setError("Location is required.");
      return;
    }

    try {
      setSaving(true);

      if (isEditMode) {
        await updateDiagnosticCenter(id, formData);
      } else {
        await createDiagnosticCenter(formData);
      }

      navigate("/diagnostics");
    } catch (err) {
      console.error(
        "Save Diagnostic Center Error:",
        err
      );

      setError(getApiError(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">
        <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-[#E5E7EB] bg-white">
          <p className="text-sm text-[#7A7A7A]">
            Loading diagnostic center...
          </p>
        </div>
      </div>
    );
  }

  if (
    (!isEditMode && !canAdd(permissions, "diagnostic_centers")) ||
    (isEditMode && !canEdit(permissions, "diagnostic_centers"))
  ) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-[#DC2626]">
          You do not have permission to access this page.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link
          to="/diagnostics"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#7A7A7A] transition hover:text-[#2F6FED]"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-[#212121]">
            {isEditMode
              ? "Edit Diagnostic Center"
              : "Add Diagnostic Center"}
          </h1>

          <p className="mt-1 text-sm text-[#7A7A7A]">
            {isEditMode
              ? "Update diagnostic center information"
              : "Add a new diagnostic center"}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-[#DC2626]">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
          {/* Basic Information */}
          <div className="border-b border-[#E5E7EB] p-6">
            <h2 className="text-lg font-semibold text-[#212121]">
              Basic Information
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#212121]">
                  Diagnostic Center Name{" "}
                  <span className="text-[#DC2626]">*</span>
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter diagnostic center name"
                  className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
                />
              </div>

              {/* Location */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#212121]">
                  Location{" "}
                  <span className="text-[#DC2626]">*</span>
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter location"
                  className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#212121]">
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
                />
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#212121]">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
                />
              </div>

              {/* Website */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#212121]">
                  Website
                </label>

                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
                />
              </div>

              {/* Status */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#212121]">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-[#212121]">
                  Address
                </label>

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter full address"
                  className="w-full resize-none rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
                />
              </div>
            </div>
          </div>

          {/* Tests & Services */}
          <div className="border-b border-[#E5E7EB] p-6">
            <h2 className="text-lg font-semibold text-[#212121]">
              Tests & Services
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-5">
              {/* Tests */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#212121]">
                  Tests
                </label>

                <textarea
                  name="tests"
                  value={formData.tests}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Enter available tests"
                  className="w-full resize-none rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
                />

                <p className="mt-1 text-xs text-[#7A7A7A]">
                  You can enter multiple tests separated by commas.
                </p>
              </div>

              {/* Prices */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#212121]">
                  Prices
                </label>

                <textarea
                  name="prices"
                  value={formData.prices}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Enter test prices"
                  className="w-full resize-none rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
                />

                <p className="mt-1 text-xs text-[#7A7A7A]">
                  Example: CBC - 500, X-Ray - 800, MRI - 5000
                </p>
              </div>

              {/* Packages */}
              <div>
                <label className="mb-2 block text-sm font-medium text-[#212121]">
                  Packages
                </label>

                <textarea
                  name="packages"
                  value={formData.packages}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Enter available packages"
                  className="w-full resize-none rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
                />

                <p className="mt-1 text-xs text-[#7A7A7A]">
                  Enter package names and details.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 p-6 sm:flex-row sm:justify-end">
            <Link
              to="/diagnostics"
              className="rounded-lg border border-[#E5E7EB] bg-white px-5 py-3 text-center text-sm font-semibold text-[#212121] transition hover:bg-[#F9FAFB]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#2F6FED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2459C7] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save className="h-4 w-4" />

              {saving
                ? "Saving..."
                : isEditMode
                ? "Update Diagnostic Center"
                : "Save Diagnostic Center"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DiagnosticCenterForm;
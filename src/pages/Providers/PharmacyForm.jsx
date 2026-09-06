import { useEffect, useState } from "react";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  getPharmacy,
  createPharmacy,
  updatePharmacy,
} from "../../services/pharmacyService";

import { useAuth } from "../../context/AuthContext";
import {
  canAdd,
  canEdit,
} from "../../utils/permission";

const PharmacyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { permissions } = useAuth();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    location: "",
    medicines: "",
    availability: "",
    prices: "",
    delivery_available: false,
    phone: "",
    email: "",
    website: "",
    address: "",
    status: "ACTIVE",
  });

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const loadPharmacy = async () => {
      try {
        setInitialLoading(true);
        setError("");

        const data = await getPharmacy(id);

        setFormData({
          name: data.name || "",
          location: data.location || "",
          medicines: data.medicines || "",
          availability: data.availability || "",
          prices: data.prices || "",
          delivery_available:
            Boolean(data.delivery_available),
          phone: data.phone || "",
          email: data.email || "",
          website: data.website || "",
          address: data.address || "",
          status: data.status || "ACTIVE",
        });
      } catch (err) {
        console.error("Pharmacy Details Error:", err);

        setError(
          err?.response?.data?.detail ||
            "Failed to load pharmacy."
        );
      } finally {
        setInitialLoading(false);
      }
    };

    loadPharmacy();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.name.trim()) {
      setError("Pharmacy name is required.");
      return;
    }

    if (!formData.location.trim()) {
      setError("Location is required.");
      return;
    }

    try {
      setLoading(true);

      if (isEditMode) {
        await updatePharmacy(id, formData);
      } else {
        await createPharmacy(formData);
      }

      navigate("/pharmacies");
    } catch (err) {
      console.error("Pharmacy Save Error:", err);

      const apiError = err?.response?.data;

      if (typeof apiError === "string") {
        setError(apiError);
      } else if (apiError?.detail) {
        setError(apiError.detail);
      } else if (apiError && typeof apiError === "object") {
        const messages = Object.entries(apiError)
          .map(([field, value]) => {
            const message = Array.isArray(value)
              ? value.join(", ")
              : String(value);

            return `${field}: ${message}`;
          })
          .join(" | ");

        setError(
          messages || "Failed to save pharmacy."
        );
      } else {
        setError("Failed to save pharmacy.");
      }
    } finally {
      setLoading(false);
    }
  };

  const hasFormPermission = isEditMode
    ? canEdit(permissions, "pharmacies")
    : canAdd(permissions, "pharmacies");

  if (!hasFormPermission) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">
        <div className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-[#212121]">
            Permission Denied
          </h2>

          <p className="mt-2 text-sm text-[#7A7A7A]">
            You do not have permission to{" "}
            {isEditMode ? "edit" : "add"} pharmacies.
          </p>

          <Link
            to="/pharmacies"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#2F6FED] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2459C7]"
          >
            <ArrowLeft size={17} />
            Back to Pharmacies
          </Link>
        </div>
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F2F2F2]">
        <div className="flex items-center gap-2 text-[#7A7A7A]">
          <Loader2
            size={20}
            className="animate-spin"
          />
          Loading pharmacy...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link
          to="/pharmacies"
          className="rounded-lg border border-[#E5E7EB] bg-white p-2.5 text-[#212121] transition hover:bg-[#F8FAFC]"
        >
          <ArrowLeft size={19} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold text-[#212121]">
            {isEditMode
              ? "Edit Pharmacy"
              : "Add Pharmacy"}
          </h1>

          <p className="mt-1 text-sm text-[#7A7A7A]">
            {isEditMode
              ? "Update pharmacy provider information."
              : "Add a new pharmacy provider."}
          </p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm"
      >
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Name */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#212121]">
              Pharmacy Name <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter pharmacy name"
              className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
            />
          </div>

          {/* Location */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#212121]">
              Location <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter location"
              className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
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
              className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
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
              placeholder="Enter email"
              className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
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
              className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
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
              className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {/* Medicines */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-[#212121]">
              Medicines
            </label>

            <textarea
              name="medicines"
              value={formData.medicines}
              onChange={handleChange}
              rows={4}
              placeholder="Enter available medicines..."
              className="w-full resize-none rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
            />
          </div>

          {/* Availability */}
          <div>
            <label className="mb-2 block text-sm font-medium text-[#212121]">
              Availability
            </label>

            <textarea
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              rows={4}
              placeholder="Enter medicine/service availability..."
              className="w-full resize-none rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
            />
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
              placeholder="Enter medicine prices..."
              className="w-full resize-none rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
            />
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
              placeholder="Enter full address..."
              className="w-full resize-none rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
            />
          </div>

          {/* Delivery */}
          <div className="md:col-span-2">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                name="delivery_available"
                checked={formData.delivery_available}
                onChange={handleChange}
                className="h-4 w-4 rounded border-gray-300 text-[#2F6FED] focus:ring-[#2F6FED]"
              />

              <span className="text-sm font-medium text-[#212121]">
                Delivery Available
              </span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#E5E7EB] pt-6 sm:flex-row sm:justify-end">
          <Link
            to="/pharmacies"
            className="inline-flex items-center justify-center rounded-lg border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-semibold text-[#212121] hover:bg-[#F8FAFC]"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2F6FED] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2459C7] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : (
              <>
                <Save size={17} />
                {isEditMode
                  ? "Update Pharmacy"
                  : "Save Pharmacy"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PharmacyForm;
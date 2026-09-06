import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  UserRound,
  Stethoscope,
  Building2,
  Phone,
  Clock,
} from "lucide-react";

import {
  getDoctor,
  createDoctor,
  updateDoctor,
} from "../../services/doctorService";

import { useAuth } from "../../context/AuthContext";
import {
  canAdd,
  canEdit,
} from "../../utils/permission";

const DoctorForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const { permissions } = useAuth();

  const [formData, setFormData] = useState({
    full_name: "",
    specialty: "",
    qualifications: "",
    years_of_experience: 0,
    hospital_name: "",
    chamber: "",
    consultation_fee: "",
    phone: "",
    email: "",
    availability: "",
    status: "ACTIVE",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditMode) return;

    const loadDoctor = async () => {
      try {
        setFetching(true);
        setError("");

        const data = await getDoctor(id);

        setFormData({
          full_name: data.full_name || "",
          specialty: data.specialty || "",
          qualifications: data.qualifications || "",
          years_of_experience:
            data.years_of_experience ?? 0,
          hospital_name: data.hospital_name || "",
          chamber: data.chamber || "",
          consultation_fee:
            data.consultation_fee ?? "",
          phone: data.phone || "",
          email: data.email || "",
          availability: data.availability || "",
          status: data.status || "ACTIVE",
        });
      } catch (err) {
        console.error("Doctor Load Error:", err);

        setError(
          err.response?.data?.detail ||
            "Failed to load doctor."
        );
      } finally {
        setFetching(false);
      }
    };

    loadDoctor();
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

    if (!formData.full_name.trim()) {
      setError("Doctor name is required.");
      return;
    }

    if (!formData.specialty.trim()) {
      setError("Specialty is required.");
      return;
    }

    if (isEditMode && !canEdit(permissions, "doctors")) {
      setError(
        "You do not have permission to edit doctors."
      );
      return;
    }

    if (!isEditMode && !canAdd(permissions, "doctors")) {
      setError(
        "You do not have permission to add doctors."
      );
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...formData,
        years_of_experience: Number(
          formData.years_of_experience || 0
        ),
        consultation_fee:
          formData.consultation_fee === ""
            ? 0
            : Number(formData.consultation_fee),
      };

      if (isEditMode) {
        await updateDoctor(id, payload);
      } else {
        await createDoctor(payload);
      }

      navigate("/doctors");
    } catch (err) {
      console.error("Doctor Save Error:", err);

      const data = err.response?.data;

      if (typeof data === "object" && data !== null) {
        const messages = Object.entries(data)
          .map(([field, message]) => {
            const text = Array.isArray(message)
              ? message.join(", ")
              : message;

            return `${field}: ${text}`;
          })
          .join(" | ");

        setError(
          messages || "Failed to save doctor."
        );
      } else {
        setError("Failed to save doctor.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-[#F2F2F2]">
        <p className="text-sm text-[#7A7A7A]">
          Loading doctor...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <button
            type="button"
            onClick={() => navigate("/doctors")}
            className="mb-3 flex items-center gap-2 text-sm font-medium text-[#2F6FED] hover:text-[#2459C7]"
          >
            <ArrowLeft size={18} />
            Back to Doctors
          </button>

          <h1 className="text-2xl font-bold text-[#212121]">
            {isEditMode
              ? "Edit Doctor"
              : "Add Doctor"}
          </h1>

          <p className="mt-1 text-sm text-[#7A7A7A]">
            {isEditMode
              ? "Update doctor information"
              : "Add a new healthcare provider"}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* Basic Information */}
        <div className="mb-5 rounded-xl border border-[#E5E7EB] bg-white p-6">

          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-[#EEF4FF] p-2">
              <UserRound
                size={20}
                className="text-[#2F6FED]"
              />
            </div>

            <div>
              <h2 className="font-semibold text-[#212121]">
                Basic Information
              </h2>

              <p className="text-xs text-[#7A7A7A]">
                Doctor's personal and professional details
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <InputField
              label="Full Name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              required
              placeholder="Enter doctor name"
            />

            <InputField
              label="Specialty"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              required
              placeholder="e.g. Cardiologist"
            />

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Qualifications
              </label>

              <textarea
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                rows={3}
                placeholder="e.g. MBBS, FCPS, MD"
                className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED]"
              />
            </div>

            <InputField
              label="Years of Experience"
              name="years_of_experience"
              type="number"
              min="0"
              value={formData.years_of_experience}
              onChange={handleChange}
              placeholder="0"
            />

            <InputField
              label="Consultation Fee"
              name="consultation_fee"
              type="number"
              min="0"
              step="0.01"
              value={formData.consultation_fee}
              onChange={handleChange}
              placeholder="0"
            />

          </div>
        </div>

        {/* Practice Information */}
        <div className="mb-5 rounded-xl border border-[#E5E7EB] bg-white p-6">

          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-[#D9F7E8] p-2">
              <Building2
                size={20}
                className="text-[#16A34A]"
              />
            </div>

            <div>
              <h2 className="font-semibold text-[#212121]">
                Practice Information
              </h2>

              <p className="text-xs text-[#7A7A7A]">
                Hospital and chamber information
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5">

            <InputField
              label="Hospital Name"
              name="hospital_name"
              value={formData.hospital_name}
              onChange={handleChange}
              placeholder="Enter hospital name"
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Chamber
              </label>

              <textarea
                name="chamber"
                value={formData.chamber}
                onChange={handleChange}
                rows={2}
                placeholder="Enter chamber address/details"
                className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED]"
              />
            </div>

          </div>
        </div>

        {/* Contact Information */}
        <div className="mb-5 rounded-xl border border-[#E5E7EB] bg-white p-6">

          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-[#EEF4FF] p-2">
              <Phone
                size={20}
                className="text-[#2F6FED]"
              />
            </div>

            <div>
              <h2 className="font-semibold text-[#212121]">
                Contact Information
              </h2>

              <p className="text-xs text-[#7A7A7A]">
                Doctor's contact details
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <InputField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />

            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />

          </div>
        </div>

        {/* Availability */}
        <div className="mb-5 rounded-xl border border-[#E5E7EB] bg-white p-6">

          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-[#FFF7ED] p-2">
              <Clock
                size={20}
                className="text-[#F59E0B]"
              />
            </div>

            <div>
              <h2 className="font-semibold text-[#212121]">
                Availability
              </h2>

              <p className="text-xs text-[#7A7A7A]">
                Doctor's consultation schedule
              </p>
            </div>
          </div>

          <textarea
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            rows={4}
            placeholder="e.g. Saturday - Thursday, 5:00 PM - 9:00 PM"
            className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED]"
          />
        </div>

        {/* Status */}
        <div className="mb-5 rounded-xl border border-[#E5E7EB] bg-white p-6">

          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-lg bg-[#EEF4FF] p-2">
              <Stethoscope
                size={20}
                className="text-[#2F6FED]"
              />
            </div>

            <h2 className="font-semibold text-[#212121]">
              Status
            </h2>
          </div>

          <div className="max-w-md">
            <label className="mb-2 block text-sm font-medium text-[#212121]">
              Doctor Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED]"
            >
              <option value="ACTIVE">
                Active
              </option>

              <option value="INACTIVE">
                Inactive
              </option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={() => navigate("/doctors")}
            className="rounded-lg border border-[#E5E7EB] bg-white px-6 py-3 text-sm font-semibold text-[#212121] transition hover:bg-[#F9FAFB]"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#2F6FED] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2459C7] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />

            {loading
              ? "Saving..."
              : isEditMode
              ? "Update Doctor"
              : "Save Doctor"}
          </button>

        </div>

      </form>
    </div>
  );
};

const InputField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required = false,
  placeholder = "",
  min,
  step,
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#212121]">
        {label}

        {required && (
          <span className="ml-1 text-[#DC2626]">
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
        min={min}
        step={step}
        placeholder={placeholder}
        className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#212121] outline-none transition placeholder:text-[#A0A0A0] focus:border-[#2F6FED]"
      />
    </div>
  );
};

export default DoctorForm;
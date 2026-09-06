import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  UserRound,
  Stethoscope,
  Pill,
  FileText,
} from "lucide-react";

import {
  getPrescription,
  createPrescription,
  updatePrescription,
} from "../../services/prescriptionService";

import { getMembers } from "../../services/memberService";
import { getDoctors } from "../../services/doctorService";

import { useAuth } from "../../context/AuthContext";
import { canAdd, canEdit } from "../../utils/permission";

const PrescriptionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const { permissions } = useAuth();

  const [members, setMembers] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    member: "",
    doctor: "",
    prescription_date: new Date()
      .toISOString()
      .split("T")[0],
    diagnosis: "",
    medicine: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: "",
    status: "ACTIVE",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [error, setError] = useState("");

  // Load members and doctors
  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoadingOptions(true);

        const [membersResponse, doctorsResponse] =
          await Promise.all([
            getMembers(),
            getDoctors(),
          ]);

        const memberData = Array.isArray(membersResponse)
          ? membersResponse
          : membersResponse?.results || [];

        const doctorData = Array.isArray(doctorsResponse)
          ? doctorsResponse
          : doctorsResponse?.results || [];

        setMembers(memberData);
        setDoctors(doctorData);
      } catch (err) {
        console.error(
          "Prescription dropdown error:",
          err
        );

        setError(
          err.response?.data?.detail ||
            "Failed to load members or doctors."
        );
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  // Load prescription for edit
  useEffect(() => {
    if (!isEditMode) return;

    const loadPrescription = async () => {
      try {
        setFetching(true);
        setError("");

        const data = await getPrescription(id);

        setFormData({
          member:
            data.member?.id ||
            data.member ||
            "",

          doctor:
            data.doctor?.id ||
            data.doctor ||
            "",

          prescription_date:
            data.prescription_date || "",

          diagnosis: data.diagnosis || "",

          medicine: data.medicine || "",

          dosage: data.dosage || "",

          frequency: data.frequency || "",

          duration: data.duration || "",

          instructions: data.instructions || "",

          status: data.status || "ACTIVE",

          notes: data.notes || "",
        });
      } catch (err) {
        console.error(
          "Prescription load error:",
          err
        );

        setError(
          err.response?.data?.detail ||
            "Failed to load prescription."
        );
      } finally {
        setFetching(false);
      }
    };

    loadPrescription();
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

    if (!formData.member) {
      setError("Please select a member.");
      return;
    }

    if (!formData.doctor) {
      setError("Please select a doctor.");
      return;
    }

    if (!formData.prescription_date) {
      setError("Prescription date is required.");
      return;
    }

    if (!formData.medicine.trim()) {
      setError("Medicine is required.");
      return;
    }

    if (!formData.dosage.trim()) {
      setError("Dosage is required.");
      return;
    }

    if (!formData.frequency.trim()) {
      setError("Frequency is required.");
      return;
    }

    if (!formData.duration.trim()) {
      setError("Duration is required.");
      return;
    }

    if (
      isEditMode &&
      !canEdit(permissions, "prescriptions")
    ) {
      setError(
        "You do not have permission to edit prescriptions."
      );
      return;
    }

    if (
      !isEditMode &&
      !canAdd(permissions, "prescriptions")
    ) {
      setError(
        "You do not have permission to add prescriptions."
      );
      return;
    }

    try {
      setLoading(true);

      const payload = {
        member: Number(formData.member),
        doctor: Number(formData.doctor),
        prescription_date:
          formData.prescription_date,
        diagnosis:
          formData.diagnosis.trim() || null,
        medicine:
          formData.medicine.trim(),
        dosage:
          formData.dosage.trim(),
        frequency:
          formData.frequency.trim(),
        duration:
          formData.duration.trim(),
        instructions:
          formData.instructions.trim() || null,
        status: formData.status,
        notes:
          formData.notes.trim() || null,
      };

      if (isEditMode) {
        await updatePrescription(id, payload);
      } else {
        await createPrescription(payload);
      }

      navigate("/prescriptions");
    } catch (err) {
      console.error(
        "Prescription save error:",
        err
      );

      const data = err.response?.data;

      if (
        typeof data === "object" &&
        data !== null
      ) {
        const messages = Object.entries(data)
          .map(([field, message]) => {
            const text = Array.isArray(message)
              ? message.join(", ")
              : message;

            return `${field}: ${text}`;
          })
          .join(" | ");

        setError(
          messages || "Failed to save prescription."
        );
      } else {
        setError(
          "Failed to save prescription."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-[#F2F2F2]">
        <p className="text-sm text-[#7A7A7A]">
          Loading prescription...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() =>
            navigate("/prescriptions")
          }
          className="mb-3 flex items-center gap-2 text-sm font-medium text-[#2F6FED] hover:text-[#2459C7]"
        >
          <ArrowLeft size={18} />
          Back to Prescriptions
        </button>

        <h1 className="text-2xl font-bold text-[#212121]">
          {isEditMode
            ? "Edit Prescription"
            : "Add Prescription"}
        </h1>

        <p className="mt-1 text-sm text-[#7A7A7A]">
          {isEditMode
            ? "Update prescription information"
            : "Create a new member prescription"}
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Patient & Doctor */}
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
                Patient & Doctor
              </h2>

              <p className="text-xs text-[#7A7A7A]">
                Select the member and prescribing doctor
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Member */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Member
                <span className="ml-1 text-red-600">
                  *
                </span>
              </label>

              <select
                name="member"
                value={formData.member}
                onChange={handleChange}
                required
                disabled={loadingOptions}
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED]"
              >
                <option value="">
                  {loadingOptions
                    ? "Loading members..."
                    : "Select member"}
                </option>

                {members.map((member) => (
                  <option
                    key={member.id}
                    value={member.id}
                  >
                    {member.member_id
                      ? `${member.member_id} - `
                      : ""}
                    {member.full_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Doctor
                <span className="ml-1 text-red-600">
                  *
                </span>
              </label>

              <select
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                required
                disabled={loadingOptions}
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED]"
              >
                <option value="">
                  {loadingOptions
                    ? "Loading doctors..."
                    : "Select doctor"}
                </option>

                {doctors.map((doctor) => (
                  <option
                    key={doctor.id}
                    value={doctor.id}
                  >
                    {doctor.full_name}
                    {doctor.specialty
                      ? ` - ${doctor.specialty}`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <InputField
              label="Prescription Date"
              name="prescription_date"
              type="date"
              value={formData.prescription_date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Medical Information */}
        <div className="mb-5 rounded-xl border border-[#E5E7EB] bg-white p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-[#D9F7E8] p-2">
              <Stethoscope
                size={20}
                className="text-[#16A34A]"
              />
            </div>

            <div>
              <h2 className="font-semibold text-[#212121]">
                Medical Information
              </h2>

              <p className="text-xs text-[#7A7A7A]">
                Diagnosis and prescribed medication
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <InputField
              label="Diagnosis"
              name="diagnosis"
              value={formData.diagnosis}
              onChange={handleChange}
              placeholder="e.g. Hypertension"
            />

            <InputField
              label="Medicine"
              name="medicine"
              value={formData.medicine}
              onChange={handleChange}
              required
              placeholder="e.g. Napa 500mg"
            />

            <InputField
              label="Dosage"
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
              required
              placeholder="e.g. 1 tablet"
            />

            <InputField
              label="Frequency"
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              required
              placeholder="e.g. Twice daily"
            />

            <InputField
              label="Duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              placeholder="e.g. 7 days"
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-5 rounded-xl border border-[#E5E7EB] bg-white p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-[#FFF7ED] p-2">
              <Pill
                size={20}
                className="text-[#F59E0B]"
              />
            </div>

            <div>
              <h2 className="font-semibold text-[#212121]">
                Medication Instructions
              </h2>

              <p className="text-xs text-[#7A7A7A]">
                Additional instructions for the patient
              </p>
            </div>
          </div>

          <textarea
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            rows={4}
            placeholder="e.g. Take after meals with plenty of water."
            className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED]"
          />
        </div>

        {/* Status & Notes */}
        <div className="mb-5 rounded-xl border border-[#E5E7EB] bg-white p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-[#EEF4FF] p-2">
              <FileText
                size={20}
                className="text-[#2F6FED]"
              />
            </div>

            <div>
              <h2 className="font-semibold text-[#212121]">
                Status & Notes
              </h2>

              <p className="text-xs text-[#7A7A7A]">
                Prescription status and internal notes
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5">
            <div className="max-w-md">
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Status
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

                <option value="COMPLETED">
                  Completed
                </option>

                <option value="CANCELLED">
                  Cancelled
                </option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Notes
              </label>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Enter internal notes..."
                className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED]"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() =>
              navigate("/prescriptions")
            }
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
              ? "Update Prescription"
              : "Save Prescription"}
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
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#212121]">
        {label}

        {required && (
          <span className="ml-1 text-red-600">
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
        className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#212121] outline-none transition placeholder:text-[#A0A0A0] focus:border-[#2F6FED]"
      />
    </div>
  );
};

export default PrescriptionForm;
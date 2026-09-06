import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Video,
  UserRound,
  Stethoscope,
  CalendarDays,
  Clock,
  FileText,
} from "lucide-react";

import {
  getTelemedicine,
  createTelemedicine,
  updateTelemedicine,
} from "../../services/telemedicineService";

import { getMembers } from "../../services/memberService";
import { getDoctors } from "../../services/doctorService";
import { getAppointments } from "../../services/appointmentService";

import { useAuth } from "../../context/AuthContext";
import { canAdd, canEdit } from "../../utils/permission";

const TelemedicineForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const { permissions } = useAuth();

  const [formData, setFormData] = useState({
    member: "",
    doctor: "",
    appointment: "",
    consultation_date: "",
    consultation_time: "",
    consultation_type: "VIDEO",
    meeting_link: "",
    diagnosis: "",
    prescription: "",
    status: "SCHEDULED",
    notes: "",
  });

  const [members, setMembers] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  const [membersLoading, setMembersLoading] = useState(true);
  const [doctorsLoading, setDoctorsLoading] = useState(true);
  const [appointmentsLoading, setAppointmentsLoading] = useState(true);

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  // =========================================================
  // Load Members
  // =========================================================
  useEffect(() => {
    const loadMembers = async () => {
      try {
        setMembersLoading(true);

        const data = await getMembers();

        if (Array.isArray(data)) {
          setMembers(data);
        } else if (Array.isArray(data?.results)) {
          setMembers(data.results);
        } else {
          setMembers([]);
        }
      } catch (err) {
        console.error("Members Load Error:", err);

        setError(
          err?.response?.data?.detail ||
            "Failed to load members."
        );
      } finally {
        setMembersLoading(false);
      }
    };

    loadMembers();
  }, []);

  // =========================================================
  // Load Doctors
  // =========================================================
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        setDoctorsLoading(true);

        const data = await getDoctors();

        console.log("DOCTORS API DATA:", data);

        if (Array.isArray(data)) {
          setDoctors(data);
        } else if (Array.isArray(data?.results)) {
          setDoctors(data.results);
        } else {
          setDoctors([]);
        }
      } catch (err) {
        console.error("Doctors Load Error:", err);

        setError(
          err?.response?.data?.detail ||
            "Failed to load doctors."
        );
      } finally {
        setDoctorsLoading(false);
      }
    };

    loadDoctors();
  }, []);

  // =========================================================
  // Load Appointments
  // =========================================================
  useEffect(() => {
    const loadAppointments = async () => {
      try {
        setAppointmentsLoading(true);

        const data = await getAppointments();

        if (Array.isArray(data)) {
          setAppointments(data);
        } else if (Array.isArray(data?.results)) {
          setAppointments(data.results);
        } else {
          setAppointments([]);
        }
      } catch (err) {
        console.error("Appointments Load Error:", err);

        setError(
          err?.response?.data?.detail ||
            "Failed to load appointments."
        );
      } finally {
        setAppointmentsLoading(false);
      }
    };

    loadAppointments();
  }, []);

  // =========================================================
  // Load Telemedicine Details - Edit Mode
  // =========================================================
  useEffect(() => {
    if (!isEditMode) {
      setLoading(false);
      return;
    }

    const loadTelemedicine = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getTelemedicine(id);

        console.log(
          "TELEMEDICINE DETAILS:",
          data
        );

        setFormData({
          member: data?.member ?? "",
          doctor: data?.doctor ?? "",
          appointment: data?.appointment ?? "",
          consultation_date:
            data?.consultation_date ?? "",
          consultation_time:
            data?.consultation_time ?? "",
          consultation_type:
            data?.consultation_type ?? "VIDEO",
          meeting_link:
            data?.meeting_link ?? "",
          diagnosis:
            data?.diagnosis ?? "",
          prescription:
            data?.prescription ?? "",
          status:
            data?.status ?? "SCHEDULED",
          notes:
            data?.notes ?? "",
        });
      } catch (err) {
        console.error(
          "Telemedicine Load Error:",
          err
        );

        setError(
          err?.response?.data?.detail ||
            "Failed to load telemedicine consultation."
        );
      } finally {
        setLoading(false);
      }
    };

    loadTelemedicine();
  }, [id, isEditMode]);

  // =========================================================
  // Handle Input Change
  // =========================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // Submit
  // =========================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Permission
    if (
      isEditMode &&
      !canEdit(permissions, "telemedicine")
    ) {
      setError(
        "You do not have permission to edit telemedicine consultations."
      );
      return;
    }

    if (
      !isEditMode &&
      !canAdd(permissions, "telemedicine")
    ) {
      setError(
        "You do not have permission to add telemedicine consultations."
      );
      return;
    }

    // Validation
    if (!formData.member) {
      setError("Member is required.");
      return;
    }

    if (!formData.doctor) {
      setError("Doctor is required.");
      return;
    }

    if (!formData.consultation_date) {
      setError(
        "Consultation date is required."
      );
      return;
    }

    if (!formData.consultation_time) {
      setError(
        "Consultation time is required."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        member: Number(formData.member),

        doctor: Number(formData.doctor),

        appointment: formData.appointment
          ? Number(formData.appointment)
          : null,

        consultation_date:
          formData.consultation_date,

        consultation_time:
          formData.consultation_time,

        consultation_type:
          formData.consultation_type,

        meeting_link:
          formData.meeting_link || "",

        diagnosis:
          formData.diagnosis || "",

        prescription:
          formData.prescription || "",

        status:
          formData.status,

        notes:
          formData.notes || "",
      };

      console.log(
        "TELEMEDICINE PAYLOAD:",
        payload
      );

      if (isEditMode) {
        await updateTelemedicine(
          id,
          payload
        );
      } else {
        await createTelemedicine(
          payload
        );
      }

      navigate("/telemedicine");
    } catch (err) {
      console.error(
        "Telemedicine Save Error:",
        err
      );

      const data = err?.response?.data;

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
          messages ||
            "Failed to save telemedicine consultation."
        );
      } else {
        setError(
          "Failed to save telemedicine consultation."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // =========================================================
  // Loading
  // =========================================================
  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-[#F2F2F2]">
        <div className="flex items-center gap-3 text-sm text-[#7A7A7A]">
          <Video
            size={20}
            className="animate-pulse"
          />
          Loading telemedicine consultation...
        </div>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================
  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">

      {/* Header */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() =>
            navigate("/telemedicine")
          }
          className="mb-3 flex items-center gap-2 text-sm font-medium text-[#2F6FED] transition hover:text-[#2459C7]"
        >
          <ArrowLeft size={18} />
          Back to Telemedicine
        </button>

        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#EEF4FF] p-3">
            <Video
              size={24}
              className="text-[#2F6FED]"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#212121]">
              {isEditMode
                ? "Edit Telemedicine Consultation"
                : "New Telemedicine Consultation"}
            </h1>

            <p className="mt-1 text-sm text-[#7A7A7A]">
              {isEditMode
                ? "Update consultation information"
                : "Create a new telemedicine consultation"}
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* =================================================
            Patient & Doctor
        ================================================= */}
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
                Select member and doctor for the consultation
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Member */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Member
                <span className="ml-1 text-[#DC2626]">
                  *
                </span>
              </label>

              <select
                name="member"
                value={formData.member}
                onChange={handleChange}
                disabled={membersLoading}
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED]"
              >
                <option value="">
                  {membersLoading
                    ? "Loading members..."
                    : "Select Member"}
                </option>

                {members.map((member) => (
                  <option
                    key={member.id}
                    value={member.id}
                  >
                    {member.member_id
                      ? `${member.member_id} - `
                      : ""}
                    {member.full_name ||
                      `Member #${member.id}`}
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Doctor
                <span className="ml-1 text-[#DC2626]">
                  *
                </span>
              </label>

              <select
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                disabled={doctorsLoading}
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED]"
              >
                <option value="">
                  {doctorsLoading
                    ? "Loading doctors..."
                    : "Select Doctor"}
                </option>

                {doctors.map((doctor) => (
                  <option
                    key={doctor.id}
                    value={doctor.id}
                  >
                    {doctor.full_name ||
                      `Doctor #${doctor.id}`}
                    {doctor.specialty
                      ? ` - ${doctor.specialty}`
                      : ""}
                  </option>
                ))}
              </select>

              {!doctorsLoading &&
                doctors.length === 0 && (
                  <p className="mt-2 text-xs text-red-500">
                    No doctors available.
                  </p>
                )}
            </div>

          </div>
        </div>

        {/* =================================================
            Appointment
        ================================================= */}
        <div className="mb-5 rounded-xl border border-[#E5E7EB] bg-white p-6">

          <div className="mb-6 flex items-center gap-3">

            <div className="rounded-lg bg-[#D9F7E8] p-2">
              <CalendarDays
                size={20}
                className="text-[#16A34A]"
              />
            </div>

            <div>
              <h2 className="font-semibold text-[#212121]">
                Appointment
              </h2>

              <p className="text-xs text-[#7A7A7A]">
                Link this consultation with an appointment
              </p>
            </div>

          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#212121]">
              Appointment
            </label>

            <select
              name="appointment"
              value={formData.appointment}
              onChange={handleChange}
              disabled={appointmentsLoading}
              className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED]"
            >
              <option value="">
                {appointmentsLoading
                  ? "Loading appointments..."
                  : "Select Appointment (Optional)"}
              </option>

              {appointments.map(
                (appointment) => (
                  <option
                    key={appointment.id}
                    value={appointment.id}
                  >
                    {appointment.appointment_id ||
                      `Appointment #${appointment.id}`}
                    {" - "}
                    {appointment.appointment_date ||
                      ""}
                    {" "}
                    {appointment.appointment_time ||
                      ""}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        {/* =================================================
            Consultation Schedule
        ================================================= */}
        <div className="mb-5 rounded-xl border border-[#E5E7EB] bg-white p-6">

          <div className="mb-6 flex items-center gap-3">

            <div className="rounded-lg bg-[#EEF4FF] p-2">
              <Clock
                size={20}
                className="text-[#2F6FED]"
              />
            </div>

            <div>
              <h2 className="font-semibold text-[#212121]">
                Consultation Schedule
              </h2>

              <p className="text-xs text-[#7A7A7A]">
                Set date, time and consultation type
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Date */}
            <InputField
              label="Consultation Date"
              name="consultation_date"
              type="date"
              value={
                formData.consultation_date
              }
              onChange={handleChange}
              required
            />

            {/* Time */}
            <InputField
              label="Consultation Time"
              name="consultation_time"
              type="time"
              value={
                formData.consultation_time
              }
              onChange={handleChange}
              required
            />

            {/* Type */}
            <SelectField
              label="Consultation Type"
              name="consultation_type"
              value={
                formData.consultation_type
              }
              onChange={handleChange}
              options={[
                {
                  value: "VIDEO",
                  label: "Video",
                },
                {
                  value: "AUDIO",
                  label: "Audio",
                },
                {
                  value: "CHAT",
                  label: "Chat",
                },
              ]}
            />

            {/* Status */}
            <SelectField
              label="Status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              options={[
                {
                  value: "SCHEDULED",
                  label: "Scheduled",
                },
                {
                  value: "IN_PROGRESS",
                  label: "In Progress",
                },
                {
                  value: "COMPLETED",
                  label: "Completed",
                },
                {
                  value: "CANCELLED",
                  label: "Cancelled",
                },
                {
                  value: "NO_SHOW",
                  label: "No Show",
                },
              ]}
            />

          </div>
        </div>

        {/* =================================================
            Meeting Information
        ================================================= */}
        <div className="mb-5 rounded-xl border border-[#E5E7EB] bg-white p-6">

          <div className="mb-6 flex items-center gap-3">

            <div className="rounded-lg bg-[#EEF4FF] p-2">
              <Video
                size={20}
                className="text-[#2F6FED]"
              />
            </div>

            <div>
              <h2 className="font-semibold text-[#212121]">
                Meeting Information
              </h2>

              <p className="text-xs text-[#7A7A7A]">
                Add online consultation meeting details
              </p>
            </div>

          </div>

          <InputField
            label="Meeting Link"
            name="meeting_link"
            type="url"
            value={formData.meeting_link}
            onChange={handleChange}
            placeholder="https://meet.google.com/..."
          />
        </div>

        {/* =================================================
            Medical Information
        ================================================= */}
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
                Diagnosis and prescription information
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 gap-5">

            {/* Diagnosis */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Diagnosis
              </label>

              <textarea
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                rows={4}
                placeholder="Enter diagnosis"
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED]"
              />
            </div>

            {/* Prescription */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Prescription
              </label>

              <textarea
                name="prescription"
                value={
                  formData.prescription
                }
                onChange={handleChange}
                rows={4}
                placeholder="Enter prescription"
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED]"
              />
            </div>

          </div>
        </div>

        {/* =================================================
            Notes
        ================================================= */}
        <div className="mb-5 rounded-xl border border-[#E5E7EB] bg-white p-6">

          <div className="mb-6 flex items-center gap-3">

            <div className="rounded-lg bg-[#FFF7ED] p-2">
              <FileText
                size={20}
                className="text-[#F59E0B]"
              />
            </div>

            <div>
              <h2 className="font-semibold text-[#212121]">
                Additional Notes
              </h2>

              <p className="text-xs text-[#7A7A7A]">
                Add any additional information
              </p>
            </div>

          </div>

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            placeholder="Enter additional notes..."
            className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED]"
          />
        </div>

        {/* =================================================
            Buttons
        ================================================= */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={() =>
              navigate("/telemedicine")
            }
            className="rounded-lg border border-[#E5E7EB] bg-white px-6 py-3 text-sm font-semibold text-[#212121] transition hover:bg-[#F9FAFB]"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#2F6FED] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2459C7] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />

            {saving
              ? "Saving..."
              : isEditMode
              ? "Update Consultation"
              : "Save Consultation"}
          </button>

        </div>

      </form>
    </div>
  );
};

// =========================================================
// Input Field
// =========================================================
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

// =========================================================
// Select Field
// =========================================================
const SelectField = ({
  label,
  name,
  value,
  onChange,
  options = [],
}) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-[#212121]">
        {label}
      </label>

      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED]"
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

export default TelemedicineForm;
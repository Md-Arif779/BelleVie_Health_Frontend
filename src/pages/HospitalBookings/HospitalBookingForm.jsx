
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Building2,
  UserRound,
  CalendarDays,
  FileText,
} from "lucide-react";

import {
  getHospitalBooking,
  createHospitalBooking,
  updateHospitalBooking,
} from "../../services/hospitalBookingService";

import { getMembers } from "../../services/memberService";
import { getHospitals } from "../../services/hospitalService";

import { useAuth } from "../../context/AuthContext";
import {
  canAdd,
  canEdit,
} from "../../utils/permission";

const HospitalBookingForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { permissions, user } = useAuth();

  const isEditMode = Boolean(id);
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const hasPermission = isEditMode
    ? isSuperAdmin || canEdit(permissions, "hospital_bookings")
    : isSuperAdmin || canAdd(permissions, "hospital_bookings");

  const [formData, setFormData] = useState({
    member: "",
    hospital: "",
    booking_date: "",
    admission_date: "",
    procedure: "",
    package: "",
    estimated_cost: "",
    status: "PENDING",
    notes: "",
  });

  const [members, setMembers] = useState([]);
  const [hospitals, setHospitals] = useState([]);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [error, setError] = useState("");

  // --------------------------------------------------
  // Load Members + Hospitals
  // --------------------------------------------------

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoadingOptions(true);

        const [memberData, hospitalData] = await Promise.all([
          getMembers(),
          getHospitals(),
        ]);

        setMembers(
          Array.isArray(memberData)
            ? memberData
            : memberData?.results || []
        );

        setHospitals(
          Array.isArray(hospitalData)
            ? hospitalData
            : hospitalData?.results || []
        );
      } catch (err) {
        console.error(
          "Hospital Booking Options Error:",
          err
        );

        setError(
          err.response?.data?.detail ||
            "Failed to load members or hospitals."
        );
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  // --------------------------------------------------
  // Load Existing Booking
  // --------------------------------------------------

  useEffect(() => {
    if (!isEditMode) return;

    const loadBooking = async () => {
      try {
        setFetching(true);
        setError("");

        const data = await getHospitalBooking(id);

        setFormData({
          member: data.member || "",
          hospital: data.hospital || "",
          booking_date: data.booking_date || "",
          admission_date: data.admission_date || "",
          procedure: data.procedure || "",
          package: data.package || "",
          estimated_cost: data.estimated_cost ?? "",
          status: data.status || "PENDING",
          notes: data.notes || "",
        });
      } catch (err) {
        console.error(
          "Hospital Booking Details Error:",
          err
        );

        setError(
          err.response?.data?.detail ||
            "Failed to load hospital booking."
        );
      } finally {
        setFetching(false);
      }
    };

    loadBooking();
  }, [id, isEditMode]);

  // --------------------------------------------------
  // Change
  // --------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!hasPermission) {
      setError(
        `You do not have permission to ${
          isEditMode ? "edit" : "add"
        } hospital bookings.`
      );
      return;
    }

    if (!formData.member) {
      setError("Member is required.");
      return;
    }

    if (!formData.hospital) {
      setError("Hospital is required.");
      return;
    }

    if (!formData.booking_date) {
      setError("Booking date is required.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...formData,

        member: Number(formData.member),
        hospital: Number(formData.hospital),

        estimated_cost:
          formData.estimated_cost === ""
            ? null
            : Number(formData.estimated_cost),

        admission_date:
          formData.admission_date || null,

        procedure:
          formData.procedure.trim() || null,

        package:
          formData.package.trim() || null,

        notes:
          formData.notes.trim() || null,
      };

      if (isEditMode) {
        await updateHospitalBooking(id, payload);
      } else {
        await createHospitalBooking(payload);
      }

      navigate("/hospital-bookings");
    } catch (err) {
      console.error(
        "Hospital Booking Save Error:",
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
              : String(message);

            return `${field}: ${text}`;
          })
          .join(" | ");

        setError(
          messages ||
            "Failed to save hospital booking."
        );
      } else {
        setError(
          "Failed to save hospital booking."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (fetching || loadingOptions) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-[#F2F2F2]">
        <p className="text-sm text-[#7A7A7A]">
          Loading hospital booking...
        </p>
      </div>
    );
  }

  // --------------------------------------------------
  // Permission
  // --------------------------------------------------

  if (!hasPermission) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">

        <button
          type="button"
          onClick={() =>
            navigate("/hospital-bookings")
          }
          className="mb-5 flex items-center gap-2 text-sm font-medium text-[#2F6FED]"
        >
          <ArrowLeft size={18} />
          Back to Hospital Bookings
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm font-semibold text-red-600">
            You do not have permission to access this page.
          </p>
        </div>

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
            navigate("/hospital-bookings")
          }
          className="mb-3 flex items-center gap-2 text-sm font-medium text-[#2F6FED] hover:text-[#2459C7]"
        >
          <ArrowLeft size={18} />
          Back to Hospital Bookings
        </button>

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-[#EEF4FF] p-3">
            <Building2
              size={22}
              className="text-[#2F6FED]"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#212121]">
              {isEditMode
                ? "Edit Hospital Booking"
                : "New Hospital Booking"}
            </h1>

            <p className="mt-1 text-sm text-[#7A7A7A]">
              {isEditMode
                ? "Update hospital booking information"
                : "Create a new hospital booking"}
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

        {/* ------------------------------------------ */}
        {/* Booking Information */}
        {/* ------------------------------------------ */}

        <div className="mb-5 rounded-xl border border-[#E5E7EB] bg-white p-6">

          <div className="mb-6 flex items-center gap-3">

            <div className="rounded-lg bg-[#EEF4FF] p-2">
              <Building2
                size={20}
                className="text-[#2F6FED]"
              />
            </div>

            <div>
              <h2 className="font-semibold text-[#212121]">
                Booking Information
              </h2>

              <p className="text-xs text-[#7A7A7A]">
                Select member and hospital
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
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none focus:border-[#2F6FED]"
              >
                <option value="">
                  Select Member
                </option>

                {members.map((member) => (
                  <option
                    key={member.id}
                    value={member.id}
                  >
                    {member.member_id
                      ? `${member.member_id} - ${member.full_name}`
                      : member.full_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Hospital */}

            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Hospital
                <span className="ml-1 text-red-600">
                  *
                </span>
              </label>

              <select
                name="hospital"
                value={formData.hospital}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none focus:border-[#2F6FED]"
              >
                <option value="">
                  Select Hospital
                </option>

                {hospitals.map((hospital) => (
                  <option
                    key={hospital.id}
                    value={hospital.id}
                  >
                    {hospital.name}
                  </option>
                ))}
              </select>
            </div>

          </div>

        </div>

        {/* ------------------------------------------ */}
        {/* Date Information */}
        {/* ------------------------------------------ */}

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
                Date Information
              </h2>

              <p className="text-xs text-[#7A7A7A]">
                Booking and admission dates
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Booking Date
                <span className="ml-1 text-red-600">
                  *
                </span>
              </label>

              <input
                type="date"
                name="booking_date"
                value={formData.booking_date}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:border-[#2F6FED]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Admission Date
              </label>

              <input
                type="date"
                name="admission_date"
                value={formData.admission_date}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:border-[#2F6FED]"
              />
            </div>

          </div>

        </div>

        {/* ------------------------------------------ */}
        {/* Treatment Information */}
        {/* ------------------------------------------ */}

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
                Treatment Information
              </h2>

              <p className="text-xs text-[#7A7A7A]">
                Procedure and package details
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Procedure */}

            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Procedure
              </label>

              <input
                type="text"
                name="procedure"
                value={formData.procedure}
                onChange={handleChange}
                placeholder="Enter procedure"
                className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:border-[#2F6FED]"
              />
            </div>

            {/* Package */}

            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Package
              </label>

              <input
                type="text"
                name="package"
                value={formData.package}
                onChange={handleChange}
                placeholder="Enter package"
                className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:border-[#2F6FED]"
              />
            </div>

            {/* Estimated Cost */}

            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Estimated Cost
              </label>

              <input
                type="number"
                name="estimated_cost"
                value={formData.estimated_cost}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:border-[#2F6FED]"
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
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none focus:border-[#2F6FED]"
              >
                <option value="PENDING">
                  Pending
                </option>

                <option value="CONFIRMED">
                  Confirmed
                </option>

                <option value="CANCELLED">
                  Cancelled
                </option>

                <option value="COMPLETED">
                  Completed
                </option>
              </select>
            </div>

          </div>

        </div>

        {/* ------------------------------------------ */}
        {/* Notes */}
        {/* ------------------------------------------ */}

        <div className="mb-5 rounded-xl border border-[#E5E7EB] bg-white p-6">

          <div className="mb-5 flex items-center gap-3">

            <div className="rounded-lg bg-[#EEF4FF] p-2">
              <FileText
                size={20}
                className="text-[#2F6FED]"
              />
            </div>

            <h2 className="font-semibold text-[#212121]">
              Notes
            </h2>

          </div>

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={4}
            placeholder="Additional notes..."
            className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none resize-none focus:border-[#2F6FED]"
          />

        </div>

        {/* Buttons */}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={() =>
              navigate("/hospital-bookings")
            }
            className="rounded-lg border border-[#E5E7EB] bg-white px-6 py-3 text-sm font-semibold text-[#212121] hover:bg-[#F9FAFB]"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#2F6FED] px-6 py-3 text-sm font-semibold text-white hover:bg-[#2459C7] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={17} />

            {loading
              ? "Saving..."
              : isEditMode
              ? "Update Booking"
              : "Create Booking"}
          </button>

        </div>

      </form>
    </div>
  );
};

export default HospitalBookingForm;


import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  FlaskConical,
  Loader2,
} from "lucide-react";

import {
  getLabTestBooking,
  createLabTestBooking,
  updateLabTestBooking,
} from "../../services/labTestBookingService";

import { getMembers } from "../../services/memberService";
import { getDiagnosticCenters } from "../../services/diagnosticService";

import { useAuth } from "../../context/AuthContext";
import {
  canAdd,
  canEdit,
} from "../../utils/permission";

const initialFormData = {
  member: "",
  diagnostic_center: "",
  test_name: "",
  sample_type: "BLOOD",
  booking_date: "",
  collection_time: "",
  price: "",
  status: "PENDING",
  result_date: "",
  notes: "",
};

const sampleTypeOptions = [
  { value: "BLOOD", label: "Blood" },
  { value: "URINE", label: "Urine" },
  { value: "STOOL", label: "Stool" },
  { value: "SWAB", label: "Swab" },
  { value: "OTHER", label: "Other" },
];

const statusOptions = [
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  {
    value: "SAMPLE_COLLECTED",
    label: "Sample Collected",
  },
  { value: "PROCESSING", label: "Processing" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

const getErrorMessage = (error) => {
  const data = error?.response?.data;

  if (!data) {
    return "Something went wrong. Please try again.";
  }

  if (typeof data === "string") {
    return data;
  }

  if (data.detail) {
    return data.detail;
  }

  if (data.message) {
    return data.message;
  }

  const firstField = Object.keys(data)[0];

  if (firstField) {
    const value = data[firstField];

    if (Array.isArray(value)) {
      return `${firstField}: ${value[0]}`;
    }

    return `${firstField}: ${value}`;
  }

  return "Failed to save lab test booking.";
};

function LabTestBookingForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const { permissions } = useAuth();

  const [formData, setFormData] = useState(initialFormData);

  const [members, setMembers] = useState([]);
  const [diagnosticCenters, setDiagnosticCenters] =
    useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const [error, setError] = useState("");

  const hasPermission = isEditMode
    ? canEdit(permissions, "lab_tests")
    : canAdd(permissions, "lab_tests");

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const [membersData, centersData] =
          await Promise.all([
            getMembers(),
            getDiagnosticCenters(),
          ]);

        const memberList = Array.isArray(membersData)
          ? membersData
          : Array.isArray(membersData?.results)
          ? membersData.results
          : [];

        const centerList = Array.isArray(centersData)
          ? centersData
          : Array.isArray(centersData?.results)
          ? centersData.results
          : [];

        setMembers(memberList);
        setDiagnosticCenters(centerList);
      } catch (err) {
        console.error(
          "Dropdown Data Error:",
          err
        );

        setError(
          "Failed to load members or diagnostic centers."
        );
      }
    };

    loadDropdownData();
  }, []);

  useEffect(() => {
    if (!isEditMode) return;

    const loadBooking = async () => {
      try {
        setLoadingData(true);
        setError("");

        const data = await getLabTestBooking(id);

        setFormData({
          member:
            data.member?.id ??
            data.member ??
            "",
          diagnostic_center:
            data.diagnostic_center?.id ??
            data.diagnostic_center ??
            "",
          test_name: data.test_name || "",
          sample_type:
            data.sample_type || "BLOOD",
          booking_date:
            data.booking_date || "",
          collection_time:
            data.collection_time || "",
          price:
            data.price !== null &&
            data.price !== undefined
              ? data.price
              : "",
          status:
            data.status || "PENDING",
          result_date:
            data.result_date || "",
          notes: data.notes || "",
        });
      } catch (err) {
        console.error(
          "Lab Test Booking Details Error:",
          err
        );

        setError(
          getErrorMessage(err)
        );
      } finally {
        setLoadingData(false);
      }
    };

    loadBooking();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasPermission) {
      setError(
        isEditMode
          ? "You do not have permission to edit lab test bookings."
          : "You do not have permission to add lab test bookings."
      );
      return;
    }

    if (!formData.member) {
      setError("Please select a member.");
      return;
    }

    if (!formData.diagnostic_center) {
      setError(
        "Please select a diagnostic center."
      );
      return;
    }

    if (!formData.test_name.trim()) {
      setError("Please enter the test name.");
      return;
    }

    if (!formData.booking_date) {
      setError("Please select the booking date.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const payload = {
        member: Number(formData.member),
        diagnostic_center: Number(
          formData.diagnostic_center
        ),
        test_name: formData.test_name.trim(),
        sample_type: formData.sample_type,
        booking_date: formData.booking_date,
        collection_time:
          formData.collection_time || null,
        price:
          formData.price === ""
            ? null
            : Number(formData.price),
        status: formData.status,
        result_date:
          formData.result_date || null,
        notes: formData.notes.trim(),
      };

      if (isEditMode) {
        await updateLabTestBooking(id, payload);
      } else {
        await createLabTestBooking(payload);
      }

      navigate("/lab-test-bookings");
    } catch (err) {
      console.error(
        "Save Lab Test Booking Error:",
        err
      );

      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!hasPermission) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">
        <div className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-[#212121]">
            Access Denied
          </h2>

          <p className="mt-2 text-sm text-[#7A7A7A]">
            You do not have permission to{" "}
            {isEditMode ? "edit" : "add"} lab test
            bookings.
          </p>

          <Link
            to="/lab-test-bookings"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#2F6FED] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2459C7]"
          >
            <ArrowLeft size={17} />
            Back to Lab Test Bookings
          </Link>
        </div>
      </div>
    );
  }

  if (loadingData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F2F2F2]">
        <div className="flex items-center gap-2 text-sm text-[#7A7A7A]">
          <Loader2
            size={20}
            className="animate-spin"
          />
          Loading booking...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link
          to="/lab-test-bookings"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#212121] transition hover:bg-[#F9FAFB]"
        >
          <ArrowLeft size={19} />
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D9F7E8]">
            <FlaskConical
              size={23}
              className="text-[#2F6FED]"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#212121]">
              {isEditMode
                ? "Edit Lab Test Booking"
                : "Add Lab Test Booking"}
            </h1>

            <p className="text-sm text-[#7A7A7A]">
              {isEditMode
                ? "Update lab test booking information"
                : "Create a new lab test booking"}
            </p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm"
      >
        <div className="border-b border-[#E5E7EB] px-6 py-5">
          <h2 className="text-lg font-semibold text-[#212121]">
            Booking Information
          </h2>

          <p className="mt-1 text-sm text-[#7A7A7A]">
            Enter the details of the diagnostic test booking.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">
          {/* Member */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#212121]">
              Member <span className="text-red-500">*</span>
            </label>

            <select
              name="member"
              value={formData.member}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#212121] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
            >
              <option value="">
                Select Member
              </option>

              {members.map((member) => (
                <option
                  key={member.id}
                  value={member.id}
                >
                  {member.full_name}{" "}
                  {member.member_id
                    ? `(${member.member_id})`
                    : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Diagnostic Center */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#212121]">
              Diagnostic Center{" "}
              <span className="text-red-500">*</span>
            </label>

            <select
              name="diagnostic_center"
              value={formData.diagnostic_center}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#212121] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
            >
              <option value="">
                Select Diagnostic Center
              </option>

              {diagnosticCenters.map((center) => (
                <option
                  key={center.id}
                  value={center.id}
                >
                  {center.name ||
                    center.center_name ||
                    center.full_name ||
                    `Center #${center.id}`}
                </option>
              ))}
            </select>
          </div>

          {/* Test Name */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#212121]">
              Test Name{" "}
              <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="test_name"
              value={formData.test_name}
              onChange={handleChange}
              required
              placeholder="e.g. CBC, Blood Sugar, Lipid Profile"
              className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm text-[#212121] outline-none placeholder:text-[#A0A0A0] focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
            />
          </div>

          {/* Sample Type */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#212121]">
              Sample Type
            </label>

            <select
              name="sample_type"
              value={formData.sample_type}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#212121] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
            >
              {sampleTypeOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Booking Date */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#212121]">
              Booking Date{" "}
              <span className="text-red-500">*</span>
            </label>

            <input
              type="date"
              name="booking_date"
              value={formData.booking_date}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm text-[#212121] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
            />
          </div>

          {/* Collection Time */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#212121]">
              Collection Time
            </label>

            <input
              type="time"
              name="collection_time"
              value={formData.collection_time}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm text-[#212121] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
            />
          </div>

          {/* Price */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#212121]">
              Price
            </label>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#7A7A7A]">
                ৳
              </span>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full rounded-lg border border-[#E5E7EB] py-2.5 pl-8 pr-3 text-sm text-[#212121] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#212121]">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#212121] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
            >
              {statusOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Result Date */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#212121]">
              Result Date
            </label>

            <input
              type="date"
              name="result_date"
              value={formData.result_date}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm text-[#212121] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
            />
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-[#212121]">
              Notes
            </label>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Additional notes..."
              className="w-full resize-none rounded-lg border border-[#E5E7EB] px-3 py-2.5 text-sm text-[#212121] outline-none placeholder:text-[#A0A0A0] focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-[#E5E7EB] px-6 py-4 sm:flex-row sm:justify-end">
          <Link
            to="/lab-test-bookings"
            className="inline-flex items-center justify-center rounded-lg border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-medium text-[#212121] transition hover:bg-[#F9FAFB]"
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
                  ? "Update Booking"
                  : "Create Booking"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default LabTestBookingForm;
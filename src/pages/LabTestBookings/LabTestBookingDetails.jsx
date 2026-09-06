import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  FlaskConical,
  Loader2,
  CalendarDays,
  Clock,
  User,
  Building2,
  FileText,
  CircleDollarSign,
} from "lucide-react";

import { getLabTestBooking } from "../../services/labTestBookingService";
import { useAuth } from "../../context/AuthContext";
import { canEdit } from "../../utils/permission";

const sampleTypeLabels = {
  BLOOD: "Blood",
  URINE: "Urine",
  STOOL: "Stool",
  SWAB: "Swab",
  OTHER: "Other",
};

const statusLabels = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  SAMPLE_COLLECTED: "Sample Collected",
  PROCESSING: "Processing",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const getStatusClass = (status) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-700";
    case "CONFIRMED":
      return "bg-blue-100 text-blue-700";
    case "SAMPLE_COLLECTED":
      return "bg-purple-100 text-purple-700";
    case "PROCESSING":
      return "bg-yellow-100 text-yellow-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    case "PENDING":
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getMemberName = (booking) => {
  return (
    booking?.member_name ||
    booking?.member?.full_name ||
    booking?.member?.name ||
    "-"
  );
};

const getMemberId = (booking) => {
  return (
    booking?.member_id ||
    booking?.member?.member_id ||
    "-"
  );
};

const getDiagnosticCenterName = (booking) => {
  return (
    booking?.diagnostic_center_name ||
    booking?.diagnostic_center?.name ||
    booking?.diagnostic_center?.center_name ||
    "-"
  );
};

const formatDate = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString();
};

const formatDateTime = (dateTime) => {
  if (!dateTime) return "-";

  const parsedDate = new Date(dateTime);

  if (Number.isNaN(parsedDate.getTime())) {
    return dateTime;
  }

  return parsedDate.toLocaleString();
};

function LabTestBookingDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { permissions } = useAuth();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBooking = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getLabTestBooking(id);

        setBooking(data);
      } catch (err) {
        console.error(
          "Lab Test Booking Details Error:",
          err
        );

        setError(
          err?.response?.data?.detail ||
            err?.response?.data?.message ||
            "Failed to load lab test booking."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [id]);

  if (loading) {
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

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">
        <div className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-[#212121]">
            Unable to Load Booking
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error || "Lab test booking not found."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/lab-test-bookings")}
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#2F6FED] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2459C7]"
          >
            <ArrowLeft size={17} />
            Back to Lab Test Bookings
          </button>
        </div>
      </div>
    );
  }

  const bookingId =
    booking.booking_id || `#${booking.id}`;

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
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
                Lab Test Booking Details
              </h1>

              <p className="text-sm text-[#7A7A7A]">
                {bookingId}
              </p>
            </div>
          </div>
        </div>

        {canEdit(permissions, "lab_tests") && (
          <Link
            to={`/lab-test-bookings/${booking.id}/edit`}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2F6FED] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2459C7]"
          >
            <Pencil size={17} />
            Edit Booking
          </Link>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Booking Summary */}
        <div className="xl:col-span-2">
          <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-[#212121]">
                  Booking Information
                </h2>

                <p className="mt-1 text-sm text-[#7A7A7A]">
                  Diagnostic test booking information
                </p>
              </div>

              <span
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                  booking.status
                )}`}
              >
                {statusLabels[booking.status] ||
                  booking.status ||
                  "-"}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
              {/* Test Name */}
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EEF4FF]">
                  <FlaskConical
                    size={19}
                    className="text-[#2F6FED]"
                  />
                </div>

                <div>
                  <p className="text-xs text-[#7A7A7A]">
                    Test Name
                  </p>

                  <p className="mt-1 font-semibold text-[#212121]">
                    {booking.test_name || "-"}
                  </p>
                </div>
              </div>

              {/* Sample Type */}
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#D9F7E8]">
                  <FileText
                    size={19}
                    className="text-[#2F6FED]"
                  />
                </div>

                <div>
                  <p className="text-xs text-[#7A7A7A]">
                    Sample Type
                  </p>

                  <p className="mt-1 font-semibold text-[#212121]">
                    {sampleTypeLabels[
                      booking.sample_type
                    ] ||
                      booking.sample_type ||
                      "-"}
                  </p>
                </div>
              </div>

              {/* Booking Date */}
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EEF4FF]">
                  <CalendarDays
                    size={19}
                    className="text-[#2F6FED]"
                  />
                </div>

                <div>
                  <p className="text-xs text-[#7A7A7A]">
                    Booking Date
                  </p>

                  <p className="mt-1 font-semibold text-[#212121]">
                    {formatDate(
                      booking.booking_date
                    )}
                  </p>
                </div>
              </div>

              {/* Collection Time */}
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#D9F7E8]">
                  <Clock
                    size={19}
                    className="text-[#2F6FED]"
                  />
                </div>

                <div>
                  <p className="text-xs text-[#7A7A7A]">
                    Collection Time
                  </p>

                  <p className="mt-1 font-semibold text-[#212121]">
                    {booking.collection_time ||
                      "-"}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EEF4FF]">
                  <CircleDollarSign
                    size={19}
                    className="text-[#2F6FED]"
                  />
                </div>

                <div>
                  <p className="text-xs text-[#7A7A7A]">
                    Price
                  </p>

                  <p className="mt-1 font-semibold text-[#212121]">
                    {booking.price !== null &&
                    booking.price !== undefined
                      ? `৳${booking.price}`
                      : "-"}
                  </p>
                </div>
              </div>

              {/* Result Date */}
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#D9F7E8]">
                  <CalendarDays
                    size={19}
                    className="text-[#2F6FED]"
                  />
                </div>

                <div>
                  <p className="text-xs text-[#7A7A7A]">
                    Result Date
                  </p>

                  <p className="mt-1 font-semibold text-[#212121]">
                    {formatDate(
                      booking.result_date
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-6 rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
            <div className="border-b border-[#E5E7EB] px-6 py-5">
              <h2 className="text-lg font-semibold text-[#212121]">
                Notes
              </h2>
            </div>

            <div className="p-6">
              <p className="whitespace-pre-wrap text-sm leading-6 text-[#7A7A7A]">
                {booking.notes || "No notes available."}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Member */}
          <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
            <div className="border-b border-[#E5E7EB] px-5 py-4">
              <h2 className="font-semibold text-[#212121]">
                Member
              </h2>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D9F7E8]">
                  <User
                    size={20}
                    className="text-[#2F6FED]"
                  />
                </div>

                <div>
                  <p className="font-semibold text-[#212121]">
                    {getMemberName(booking)}
                  </p>

                  <p className="text-xs text-[#7A7A7A]">
                    {getMemberId(booking)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Diagnostic Center */}
          <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
            <div className="border-b border-[#E5E7EB] px-5 py-4">
              <h2 className="font-semibold text-[#212121]">
                Diagnostic Center
              </h2>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EEF4FF]">
                  <Building2
                    size={20}
                    className="text-[#2F6FED]"
                  />
                </div>

                <p className="font-semibold text-[#212121]">
                  {getDiagnosticCenterName(
                    booking
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Record Information */}
          <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
            <div className="border-b border-[#E5E7EB] px-5 py-4">
              <h2 className="font-semibold text-[#212121]">
                Record Information
              </h2>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <p className="text-xs text-[#7A7A7A]">
                  Booking ID
                </p>

                <p className="mt-1 text-sm font-semibold text-[#2F6FED]">
                  {bookingId}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#7A7A7A]">
                  Created At
                </p>

                <p className="mt-1 text-sm text-[#212121]">
                  {formatDateTime(
                    booking.created_at
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#7A7A7A]">
                  Updated At
                </p>

                <p className="mt-1 text-sm text-[#212121]">
                  {formatDateTime(
                    booking.updated_at
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Back Button */}
      <div className="mt-6">
        <Link
          to="/lab-test-bookings"
          className="inline-flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-medium text-[#212121] transition hover:bg-[#F9FAFB]"
        >
          <ArrowLeft size={17} />
          Back to Lab Test Bookings
        </Link>
      </div>
    </div>
  );
}

export default LabTestBookingDetails;
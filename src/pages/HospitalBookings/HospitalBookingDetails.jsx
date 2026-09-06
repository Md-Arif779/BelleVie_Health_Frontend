
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  Building2,
  UserRound,
  CalendarDays,
  FileText,
  BadgeDollarSign,
} from "lucide-react";

import { getHospitalBooking } from "../../services/hospitalBookingService";

import { useAuth } from "../../context/AuthContext";
import { canEdit } from "../../utils/permission";

const HospitalBookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { permissions, user } = useAuth();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isSuperAdmin =
    user?.role === "SUPER_ADMIN";

  useEffect(() => {
    const loadBooking = async () => {
      try {
        setLoading(true);
        setError("");

        const data =
          await getHospitalBooking(id);

        setBooking(data);
      } catch (err) {
        console.error(
          "Hospital Booking Details Error:",
          err
        );

        setError(
          err.response?.data?.detail ||
            "Failed to load hospital booking details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [id]);

  const formatCost = (cost) => {
    if (
      cost === null ||
      cost === undefined ||
      cost === ""
    ) {
      return "৳0";
    }

    return `৳${Number(cost).toLocaleString()}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-50 text-[#16A34A]";

      case "COMPLETED":
        return "bg-blue-50 text-[#2F6FED]";

      case "CANCELLED":
        return "bg-red-50 text-[#DC2626]";

      default:
        return "bg-yellow-50 text-[#CA8A04]";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "Confirmed";

      case "COMPLETED":
        return "Completed";

      case "CANCELLED":
        return "Cancelled";

      case "PENDING":
        return "Pending";

      default:
        return status || "-";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-[#F2F2F2]">
        <p className="text-sm text-[#7A7A7A]">
          Loading hospital booking details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">

        <button
          onClick={() =>
            navigate("/hospital-bookings")
          }
          className="mb-5 flex items-center gap-2 text-sm font-medium text-[#2F6FED]"
        >
          <ArrowLeft size={18} />
          Back to Hospital Bookings
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
          {error}
        </div>

      </div>
    );
  }

  if (!booking) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">

      {/* Header */}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>

          <button
            onClick={() =>
              navigate("/hospital-bookings")
            }
            className="mb-3 flex items-center gap-2 text-sm font-medium text-[#2F6FED] hover:text-[#2459C7]"
          >
            <ArrowLeft size={18} />
            Back to Hospital Bookings
          </button>

          <h1 className="text-2xl font-bold text-[#212121]">
            Hospital Booking Details
          </h1>

          <p className="mt-1 text-sm text-[#7A7A7A]">
            View complete hospital booking information
          </p>

        </div>

        {(isSuperAdmin ||
          canEdit(
            permissions,
            "hospital_bookings"
          )) && (
          <button
            onClick={() =>
              navigate(
                `/hospital-bookings/${booking.id}/edit`
              )
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-[#2F6FED] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2459C7]"
          >
            <Pencil size={17} />
            Edit Booking
          </button>
        )}

      </div>

      {/* Main Profile */}

      <div className="mb-5 rounded-xl border border-[#E5E7EB] bg-white p-6">

        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#EEF4FF]">
            <Building2
              size={38}
              className="text-[#2F6FED]"
            />
          </div>

          <div className="flex-1">

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="text-xl font-bold text-[#212121]">
                  {booking.booking_id ||
                    "Hospital Booking"}
                </h2>

                <p className="mt-1 text-sm text-[#7A7A7A]">
                  {booking.hospital_name ||
                    booking.hospital?.name ||
                    "Hospital"}
                </p>

              </div>

              <span
                className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                  booking.status
                )}`}
              >
                {getStatusLabel(
                  booking.status
                )}
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* Member & Hospital */}

      <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2">

        {/* Member */}

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">

          <div className="mb-5 flex items-center gap-3">

            <div className="rounded-lg bg-[#EEF4FF] p-2">
              <UserRound
                size={20}
                className="text-[#2F6FED]"
              />
            </div>

            <h3 className="font-semibold text-[#212121]">
              Member Information
            </h3>

          </div>

          <div className="space-y-4">

            <InfoRow
              label="Member ID"
              value={
                booking.member_code ||
                booking.member_id ||
                booking.member?.member_id
              }
            />

            <InfoRow
              label="Member Name"
              value={
                booking.member_name ||
                booking.member?.full_name
              }
            />

          </div>

        </div>

        {/* Hospital */}

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">

          <div className="mb-5 flex items-center gap-3">

            <div className="rounded-lg bg-[#D9F7E8] p-2">
              <Building2
                size={20}
                className="text-[#16A34A]"
              />
            </div>

            <h3 className="font-semibold text-[#212121]">
              Hospital Information
            </h3>

          </div>

          <div className="space-y-4">

            <InfoRow
              label="Hospital"
              value={
                booking.hospital_name ||
                booking.hospital?.name
              }
            />

            <InfoRow
              label="Hospital ID"
              value={
                booking.hospital_id ||
                booking.hospital?.id
              }
            />

          </div>

        </div>

      </div>

      {/* Booking Dates */}

      <div className="mb-5 rounded-xl border border-[#E5E7EB] bg-white p-6">

        <div className="mb-5 flex items-center gap-3">

          <div className="rounded-lg bg-[#EEF4FF] p-2">
            <CalendarDays
              size={20}
              className="text-[#2F6FED]"
            />
          </div>

          <h3 className="font-semibold text-[#212121]">
            Booking Information
          </h3>

        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          <InfoRow
            label="Booking Date"
            value={formatDate(
              booking.booking_date
            )}
          />

          <InfoRow
            label="Admission Date"
            value={formatDate(
              booking.admission_date
            )}
          />

          <InfoRow
            label="Booking Status"
            value={getStatusLabel(
              booking.status
            )}
          />

          <InfoRow
            label="Booking ID"
            value={booking.booking_id}
          />

        </div>

      </div>

      {/* Treatment */}

      <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2">

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">

          <div className="mb-5 flex items-center gap-3">

            <div className="rounded-lg bg-[#FFF7ED] p-2">
              <FileText
                size={20}
                className="text-[#F59E0B]"
              />
            </div>

            <h3 className="font-semibold text-[#212121]">
              Treatment Information
            </h3>

          </div>

          <div className="space-y-4">

            <InfoRow
              label="Procedure"
              value={booking.procedure}
            />

            <InfoRow
              label="Package"
              value={booking.package}
            />

          </div>

        </div>

        {/* Cost */}

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">

          <div className="mb-5 flex items-center gap-3">

            <div className="rounded-lg bg-[#EEF4FF] p-2">
              <BadgeDollarSign
                size={20}
                className="text-[#2F6FED]"
              />
            </div>

            <h3 className="font-semibold text-[#212121]">
              Financial Information
            </h3>

          </div>

          <InfoRow
            label="Estimated Cost"
            value={formatCost(
              booking.estimated_cost
            )}
          />

        </div>

      </div>

      {/* Notes */}

      <div className="mb-5 rounded-xl border border-[#E5E7EB] bg-white p-6">

        <div className="mb-5 flex items-center gap-3">

          <div className="rounded-lg bg-[#EEF4FF] p-2">
            <FileText
              size={20}
              className="text-[#2F6FED]"
            />
          </div>

          <h3 className="font-semibold text-[#212121]">
            Notes
          </h3>

        </div>

        <div className="rounded-lg bg-[#F9FAFB] p-4">

          <p className="whitespace-pre-line text-sm leading-6 text-[#212121]">
            {booking.notes ||
              "No additional notes."}
          </p>

        </div>

      </div>

      {/* Record Information */}

      <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">

        <h3 className="mb-5 font-semibold text-[#212121]">
          Record Information
        </h3>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          <InfoRow
            label="Created At"
            value={
              booking.created_at
                ? new Date(
                    booking.created_at
                  ).toLocaleString()
                : "-"
            }
          />

          <InfoRow
            label="Last Updated"
            value={
              booking.updated_at
                ? new Date(
                    booking.updated_at
                  ).toLocaleString()
                : "-"
            }
          />

        </div>

      </div>

    </div>
  );
};

const InfoRow = ({
  label,
  value,
}) => {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-[#7A7A7A]">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-medium text-[#212121]">
        {value || "-"}
      </p>
    </div>
  );
};

export default HospitalBookingDetails;


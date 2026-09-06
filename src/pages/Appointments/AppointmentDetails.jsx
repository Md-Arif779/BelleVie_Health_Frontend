import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  CalendarDays,
  Clock,
  User,
  Stethoscope,
  FileText,
} from "lucide-react";

import { getAppointment } from "../../services/appointmentService";

import { useAuth } from "../../context/AuthContext";
import { canEdit } from "../../utils/permission";

const AppointmentDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { permissions, user } = useAuth();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isSuperAdmin =
    user?.role === "SUPER_ADMIN";

  const hasEditPermission =
    isSuperAdmin ||
    canEdit(permissions, "appointments");

  useEffect(() => {
    const loadAppointment = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAppointment(id);

        setAppointment(data);
      } catch (err) {
        console.error(
          "Appointment Details Error:",
          err
        );

        setError(
          err?.response?.data?.detail ||
            "Failed to load appointment details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadAppointment();
  }, [id]);

  const getStatusClass = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-[#FFF7ED] text-[#EA580C]";

      case "CONFIRMED":
        return "bg-[#EEF4FF] text-[#2F6FED]";

      case "COMPLETED":
        return "bg-[#D9F7E8] text-[#15803D]";

      case "CANCELLED":
        return "bg-[#FEF2F2] text-[#DC2626]";

      case "NO_SHOW":
        return "bg-[#F3F4F6] text-[#374151]";

      default:
        return "bg-[#F3F4F6] text-[#6B7280]";
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatAppointmentType = (type) => {
    switch (type) {
      case "IN_PERSON":
        return "In Person";

      case "TELEMEDICINE":
        return "Telemedicine";

      default:
        return type || "-";
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-[#7A7A7A]">
        Loading appointment details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-5">

        <button
          type="button"
          onClick={() =>
            navigate("/appointments")
          }
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            font-medium
            text-[#2F6FED]
          "
        >
          <ArrowLeft size={17} />
          Back to Appointments
        </button>

        <div
          className="
            bg-white
            border
            border-[#E5E7EB]
            rounded-2xl
            p-8
            text-center
            text-sm
            text-[#DC2626]
          "
        >
          {error}
        </div>

      </div>
    );
  }

  if (!appointment) {
    return null;
  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div className="flex items-center gap-4">

          <button
            type="button"
            onClick={() =>
              navigate("/appointments")
            }
            className="
              w-10
              h-10
              rounded-xl
              border
              border-[#E5E7EB]
              flex
              items-center
              justify-center
              text-[#6B7280]
              hover:bg-[#F8FAFC]
            "
          >
            <ArrowLeft size={18} />
          </button>

          <div
            className="
              w-11
              h-11
              rounded-xl
              bg-[#EEF4FF]
              text-[#2F6FED]
              flex
              items-center
              justify-center
            "
          >
            <CalendarDays size={21} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#212121]">
              Appointment Details
            </h1>

            <p className="text-sm text-[#7A7A7A] mt-1">
              {appointment.appointment_id ||
                `Appointment #${appointment.id}`}
            </p>
          </div>

        </div>

        {hasEditPermission && (
          <button
            type="button"
            onClick={() =>
              navigate(
                `/appointments/${id}/edit`
              )
            }
            className="
              inline-flex
              items-center
              gap-2
              px-4
              py-2.5
              rounded-xl
              bg-[#2F6FED]
              text-white
              text-sm
              font-semibold
              hover:bg-[#2459C7]
            "
          >
            <Pencil size={16} />
            Edit
          </button>
        )}

      </div>

      {/* Appointment ID / Status */}

      <div
        className="
          bg-white
          border
          border-[#E5E7EB]
          rounded-2xl
          p-6
        "
      >
        <div className="flex items-center justify-between">

          <div>
            <p className="text-xs text-[#7A7A7A] mb-1">
              Appointment ID
            </p>

            <p className="text-lg font-bold text-[#212121]">
              {appointment.appointment_id ||
                "-"}
            </p>
          </div>

          <span
            className={`
              px-3
              py-1.5
              rounded-full
              text-xs
              font-semibold
              ${getStatusClass(
                appointment.status
              )}
            `}
          >
            {appointment.status || "-"}
          </span>

        </div>
      </div>

      {/* Appointment Information */}

      <div
        className="
          bg-white
          border
          border-[#E5E7EB]
          rounded-2xl
          p-6
        "
      >

        <h2 className="text-base font-bold text-[#212121] mb-5">
          Appointment Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <InfoItem
            icon={<User size={17} />}
            label="Member"
            value={
              appointment.member_name ||
              appointment.member_id ||
              appointment.member ||
              "-"
            }
          />

          <InfoItem
            icon={<Stethoscope size={17} />}
            label="Doctor"
            value={
              appointment.doctor_name ||
              appointment.doctor_id ||
              appointment.doctor ||
              "-"
            }
          />

          <InfoItem
            icon={<CalendarDays size={17} />}
            label="Appointment Date"
            value={formatDate(
              appointment.appointment_date
            )}
          />

          <InfoItem
            icon={<Clock size={17} />}
            label="Appointment Time"
            value={
              appointment.appointment_time ||
              "-"
            }
          />

          <InfoItem
            icon={<CalendarDays size={17} />}
            label="Appointment Type"
            value={formatAppointmentType(
              appointment.appointment_type
            )}
          />

        </div>

      </div>

      {/* Reason & Notes */}

      <div
        className="
          bg-white
          border
          border-[#E5E7EB]
          rounded-2xl
          p-6
        "
      >

        <h2 className="text-base font-bold text-[#212121] mb-5">
          Additional Information
        </h2>

        <div className="space-y-5">

          <DetailBox
            icon={<FileText size={17} />}
            label="Reason"
            value={
              appointment.reason || "-"
            }
          />

          <DetailBox
            icon={<FileText size={17} />}
            label="Notes"
            value={
              appointment.notes || "-"
            }
          />

        </div>

      </div>

    </div>
  );
};

const InfoItem = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="flex items-start gap-3">

      <div
        className="
          w-9
          h-9
          rounded-lg
          bg-[#F8FAFC]
          text-[#2F6FED]
          flex
          items-center
          justify-center
          shrink-0
        "
      >
        {icon}
      </div>

      <div>
        <p className="text-xs text-[#7A7A7A] mb-1">
          {label}
        </p>

        <p className="text-sm font-semibold text-[#212121]">
          {value}
        </p>
      </div>

    </div>
  );
};

const DetailBox = ({
  icon,
  label,
  value,
}) => {
  return (
    <div>

      <div className="flex items-center gap-2 mb-2">

        <span className="text-[#2F6FED]">
          {icon}
        </span>

        <p className="text-sm font-semibold text-[#374151]">
          {label}
        </p>

      </div>

      <div
        className="
          bg-[#F8FAFC]
          border
          border-[#E5E7EB]
          rounded-xl
          p-4
          text-sm
          text-[#4B5563]
          whitespace-pre-wrap
        "
      >
        {value}
      </div>

    </div>
  );
};

export default AppointmentDetails;
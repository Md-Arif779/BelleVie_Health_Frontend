import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  Video,
  CalendarDays,
  Clock,
  User,
  Stethoscope,
  Link as LinkIcon,
  FileText,
} from "lucide-react";

import { getTelemedicine } from "../../services/telemedicineService";

import { useAuth } from "../../context/AuthContext";
import { canEdit } from "../../utils/permission";

const TelemedicineDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { permissions, user } = useAuth();

  const [telemedicine, setTelemedicine] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isSuperAdmin =
    user?.role === "SUPER_ADMIN";

  const hasEditPermission =
    isSuperAdmin ||
    canEdit(permissions, "telemedicine");

  useEffect(() => {
    const loadTelemedicine = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getTelemedicine(id);

        setTelemedicine(data);
      } catch (err) {
        console.error(
          "Telemedicine Details Error:",
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
  }, [id]);

  const getStatusClass = (status) => {
    switch (status) {
      case "SCHEDULED":
        return "bg-[#EEF4FF] text-[#2F6FED]";

      case "IN_PROGRESS":
        return "bg-[#D9F7E8] text-[#15803D]";

      case "COMPLETED":
        return "bg-[#F3F4F6] text-[#374151]";

      case "CANCELLED":
        return "bg-[#FEF2F2] text-[#DC2626]";

      case "NO_SHOW":
        return "bg-[#FFF7ED] text-[#EA580C]";

      default:
        return "bg-[#F3F4F6] text-[#6B7280]";
    }
  };

  const getConsultationType = (type) => {
    switch (type) {
      case "VIDEO":
        return "Video";

      case "AUDIO":
        return "Audio";

      case "CHAT":
        return "Chat";

      default:
        return type || "-";
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

  if (loading) {
    return (
      <div className="p-8 text-center text-sm text-[#7A7A7A]">
        Loading consultation details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-5">

        <button
          type="button"
          onClick={() =>
            navigate("/telemedicine")
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
          Back to Telemedicine
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

  if (!telemedicine) {
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
              navigate("/telemedicine")
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
            <Video size={21} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#212121]">
              Telemedicine Details
            </h1>

            <p className="text-sm text-[#7A7A7A] mt-1">
              {telemedicine.telemedicine_id ||
                `Consultation #${telemedicine.id}`}
            </p>
          </div>

        </div>

        {hasEditPermission && (
          <button
            type="button"
            onClick={() =>
              navigate(
                `/telemedicine/${id}/edit`
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

      {/* Status Card */}

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
              Consultation ID
            </p>

            <p className="text-lg font-bold text-[#212121]">
              {telemedicine.telemedicine_id ||
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
                telemedicine.status
              )}
            `}
          >
            {telemedicine.status || "-"}
          </span>

        </div>
      </div>

      {/* Consultation Information */}

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
          Consultation Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <InfoItem
            icon={<User size={17} />}
            label="Member"
            value={
              telemedicine.member_name ||
              telemedicine.member_id ||
              telemedicine.member ||
              "-"
            }
          />

          <InfoItem
            icon={<Stethoscope size={17} />}
            label="Doctor"
            value={
              telemedicine.doctor_name ||
              telemedicine.doctor_id ||
              telemedicine.doctor ||
              "-"
            }
          />

          <InfoItem
            icon={<CalendarDays size={17} />}
            label="Consultation Date"
            value={formatDate(
              telemedicine.consultation_date
            )}
          />

          <InfoItem
            icon={<Clock size={17} />}
            label="Consultation Time"
            value={
              telemedicine.consultation_time ||
              "-"
            }
          />

          <InfoItem
            icon={<Video size={17} />}
            label="Consultation Type"
            value={getConsultationType(
              telemedicine.consultation_type
            )}
          />

          <InfoItem
            icon={<LinkIcon size={17} />}
            label="Meeting Link"
            value={
              telemedicine.meeting_link ? (
                <a
                  href={
                    telemedicine.meeting_link
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#2F6FED] hover:underline break-all"
                >
                  {telemedicine.meeting_link}
                </a>
              ) : (
                "-"
              )
            }
          />

        </div>
      </div>

      {/* Medical Information */}

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
          Medical Information
        </h2>

        <div className="space-y-5">

          <DetailBox
            icon={<FileText size={17} />}
            label="Diagnosis"
            value={
              telemedicine.diagnosis ||
              "-"
            }
          />

          <DetailBox
            icon={<FileText size={17} />}
            label="Prescription"
            value={
              telemedicine.prescription ||
              "-"
            }
          />

          <DetailBox
            icon={<FileText size={17} />}
            label="Notes"
            value={
              telemedicine.notes ||
              "-"
            }
          />

        </div>

      </div>

      {/* Appointment */}

      {telemedicine.appointment && (
        <div
          className="
            bg-white
            border
            border-[#E5E7EB]
            rounded-2xl
            p-6
          "
        >
          <h2 className="text-base font-bold text-[#212121] mb-4">
            Related Appointment
          </h2>

          <p className="text-sm text-[#374151]">
            Appointment ID:{" "}
            <span className="font-semibold">
              {telemedicine.appointment}
            </span>
          </p>
        </div>
      )}

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

      <div className="min-w-0">

        <p className="text-xs text-[#7A7A7A] mb-1">
          {label}
        </p>

        <div className="text-sm font-semibold text-[#212121] break-words">
          {value}
        </div>

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

export default TelemedicineDetails;
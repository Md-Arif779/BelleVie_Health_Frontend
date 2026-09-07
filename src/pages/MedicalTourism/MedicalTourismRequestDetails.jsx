
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Plane,
  MapPin,
  UserRound,
  User,
  Hospital,
  IdCard,
  CalendarDays,
  FileText,
  Globe2,
  Languages,
  Hotel,
  PlaneTakeoff,
  Stethoscope,
  BadgeCheck,
  Pencil,
  Edit,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  Building2,
  DollarSign,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";

import api from "../../services/api";

const MedicalTourismRequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/medical-tourism/requests/${id}/`
        );

        setRequest(response.data);
      } catch (err) {
        console.error(
          "Medical Tourism Details Error:",
          err
        );

        setError(
          err.response?.data?.detail ||
            "Failed to load medical tourism request."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRequest();
    }
  }, [id]);

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-10 text-center">
          <div className="mx-auto w-10 h-10 border-4 border-[#EEF4FF] border-t-[#2F6FED] rounded-full animate-spin" />

          <p className="mt-4 text-sm text-[#7A7A7A]">
            Loading medical tourism request...
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (error || !request) {
    return (
      <div className="p-6">
        <button
          onClick={() =>
            navigate("/medical-tourism")
          }
          className="
            flex
            items-center
            gap-2
            text-sm
            font-semibold
            text-[#2F6FED]
            mb-5
          "
        >
          <ArrowLeft size={18} />
          Back to Medical Tourism
        </button>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-10 text-center">
          <AlertCircle
            size={40}
            className="mx-auto text-red-500"
          />

          <h2 className="mt-4 text-lg font-bold text-[#212121]">
            Request Not Found
          </h2>

          <p className="mt-2 text-sm text-[#7A7A7A]">
            {error ||
              "The requested medical tourism record could not be found."}
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "REQUESTED":
        return "bg-blue-50 text-blue-600";

      case "QUOTATION":
        return "bg-purple-50 text-purple-600";

      case "VISA_PROCESSING":
        return "bg-yellow-50 text-yellow-700";

      case "TRAVEL_PLANNED":
        return "bg-indigo-50 text-indigo-600";

      case "TRAVELING":
        return "bg-orange-50 text-orange-600";

      case "TREATMENT":
        return "bg-green-50 text-green-600";

      case "COMPLETED":
        return "bg-emerald-50 text-emerald-600";

      case "CANCELLED":
        return "bg-red-50 text-red-600";

      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const getStatusLabel = (status) => {
    if (!status) return "N/A";

    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  const InfoItem = ({
    icon: Icon,
    label,
    value,
  }) => (
    <div className="flex gap-3">
      <div
        className="
          w-9
          h-9
          shrink-0
          rounded-lg
          bg-[#F8FAFC]
          flex
          items-center
          justify-center
          text-[#2F6FED]
        "
      >
        <Icon size={17} />
      </div>

      <div className="min-w-0">
        <p className="text-[11px] text-[#9CA3AF] font-medium">
          {label}
        </p>

        <p className="mt-1 text-sm font-semibold text-[#212121] break-words">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="p-6">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

        <div>
          <button
            onClick={() =>
              navigate("/medical-tourism")
            }
            className="
              flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-[#7A7A7A]
              hover:text-[#2F6FED]
              transition
              mb-3
            "
          >
            <ArrowLeft size={17} />
            Back to Medical Tourism
          </button>

          <div className="flex items-center gap-3">

            <div
              className="
                w-12
                h-12
                rounded-xl
                bg-[#EEF4FF]
                flex
                items-center
                justify-center
                text-[#2F6FED]
              "
            >
              <Plane size={23} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-[#212121]">
                Medical Tourism Request
              </h1>

              <p className="text-sm text-[#7A7A7A] mt-1">
                {request.request_id}
              </p>
            </div>

          </div>
        </div>

        <div className="flex items-center gap-3">

          <span
            className={`
              px-4
              py-2
              rounded-xl
              text-xs
              font-bold
              ${getStatusStyle(request.status)}
            `}
          >
            {getStatusLabel(request.status)}
          </span>

          <button
            onClick={() =>
              navigate(
                `/medical-tourism/${request.id}/edit`
              )
            }
            className="
              flex
              items-center
              gap-2
              px-4
              py-2.5
              rounded-xl
              bg-[#2F6FED]
              text-white
              text-sm
              font-semibold
              hover:bg-[#255ED0]
              transition
            "
          >
            <Edit size={16} />
            Edit
          </button>

        </div>
      </div>

      {/* ================================================= */}
      {/* REQUEST SUMMARY */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-[#D9F7E8] flex items-center justify-center text-[#2F6FED]">
              <User size={19} />
            </div>

            <div>
              <p className="text-[11px] text-[#9CA3AF]">
                Member
              </p>

              <p className="text-sm font-bold text-[#212121]">
                {request.member_name || "N/A"}
              </p>

              <p className="text-[11px] text-[#7A7A7A]">
                {request.member_id || "N/A"}
              </p>
            </div>

          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] flex items-center justify-center text-[#2F6FED]">
              <MapPin size={19} />
            </div>

            <div>
              <p className="text-[11px] text-[#9CA3AF]">
                Destination
              </p>

              <p className="text-sm font-bold text-[#212121]">
                {request.destination_country ||
                  "N/A"}
              </p>
            </div>

          </div>
        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">
          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-[#F3E8FF] flex items-center justify-center text-purple-600">
              <Stethoscope size={19} />
            </div>

            <div>
              <p className="text-[11px] text-[#9CA3AF]">
                Treatment
              </p>

              <p className="text-sm font-bold text-[#212121]">
                {request.treatment_name || "N/A"}
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* ================================================= */}
      {/* PATIENT & TREATMENT */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">

        {/* Patient Information */}

        <div className="bg-white border border-[#E5E7EB] rounded-2xl">

          <div className="px-5 py-4 border-b border-[#E5E7EB]">
            <h2 className="text-sm font-bold text-[#212121]">
              Member Information
            </h2>
          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">

            <InfoItem
              icon={User}
              label="Member Name"
              value={request.member_name}
            />

            <InfoItem
              icon={IdCard}
              label="Member ID"
              value={request.member_id}
            />

          </div>
        </div>

        {/* Treatment Information */}

        <div className="bg-white border border-[#E5E7EB] rounded-2xl">

          <div className="px-5 py-4 border-b border-[#E5E7EB]">
            <h2 className="text-sm font-bold text-[#212121]">
              Treatment Information
            </h2>
          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">

            <InfoItem
              icon={MapPin}
              label="Destination Country"
              value={request.destination_country}
            />

            <InfoItem
              icon={Building2}
              label="International Hospital"
              value={request.international_hospital}
            />

            <InfoItem
              icon={Stethoscope}
              label="Treatment"
              value={request.treatment_name}
            />

            <InfoItem
              icon={DollarSign}
              label="Quotation Amount"
              value={
                request.quotation_amount
                  ? `৳ ${request.quotation_amount}`
                  : "Not Provided"
              }
            />

          </div>
        </div>

      </div>

      {/* ================================================= */}
      {/* TRAVEL & VISA */}
      {/* ================================================= */}

      <div className="bg-white border border-[#E5E7EB] rounded-2xl mb-6">

        <div className="px-5 py-4 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <Plane
              size={18}
              className="text-[#2F6FED]"
            />

            <h2 className="text-sm font-bold text-[#212121]">
              Travel & Visa Information
            </h2>
          </div>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <InfoItem
            icon={FileText}
            label="Visa Status"
            value={request.visa_status}
          />

          <InfoItem
            icon={Plane}
            label="Travel Status"
            value={request.travel_status}
          />

          <InfoItem
            icon={Languages}
            label="Translator Required"
            value={
              request.translator_required
                ? "Yes"
                : "No"
            }
          />

          <InfoItem
            icon={CalendarDays}
            label="Request Date"
            value={formatDateTime(
              request.request_date
            )}
          />

        </div>

      </div>

      {/* ================================================= */}
      {/* ACCOMMODATION & TRANSLATOR */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">

        <div className="bg-white border border-[#E5E7EB] rounded-2xl">

          <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center gap-2">
            <Hotel
              size={18}
              className="text-[#2F6FED]"
            />

            <h2 className="text-sm font-bold text-[#212121]">
              Accommodation
            </h2>
          </div>

          <div className="p-5">
            <p className="text-sm leading-6 text-[#6B7280] whitespace-pre-line">
              {request.accommodation_details ||
                "No accommodation details provided."}
            </p>
          </div>

        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl">

          <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center gap-2">
            <Languages
              size={18}
              className="text-[#2F6FED]"
            />

            <h2 className="text-sm font-bold text-[#212121]">
              Translator
            </h2>
          </div>

          <div className="p-5">

            <div className="flex items-center gap-2 mb-3">

              {request.translator_required ? (
                <>
                  <CheckCircle2
                    size={18}
                    className="text-green-500"
                  />

                  <span className="text-sm font-semibold text-green-600">
                    Translator Required
                  </span>
                </>
              ) : (
                <>
                  <XCircle
                    size={18}
                    className="text-[#9CA3AF]"
                  />

                  <span className="text-sm font-semibold text-[#7A7A7A]">
                    Translator Not Required
                  </span>
                </>
              )}

            </div>

            {request.translator_required && (
              <p className="text-sm text-[#6B7280] leading-6">
                {request.translator_details ||
                  "No translator details provided."}
              </p>
            )}

          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* NOTES */}
      {/* ================================================= */}

      <div className="bg-white border border-[#E5E7EB] rounded-2xl mb-6">

        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center gap-2">

          <FileText
            size={18}
            className="text-[#2F6FED]"
          />

          <h2 className="text-sm font-bold text-[#212121]">
            Notes
          </h2>

        </div>

        <div className="p-5">

          <p className="text-sm text-[#6B7280] leading-7 whitespace-pre-line">
            {request.notes ||
              "No additional notes available."}
          </p>

        </div>

      </div>

      {/* ================================================= */}
      {/* SYSTEM INFORMATION */}
      {/* ================================================= */}

      <div className="bg-white border border-[#E5E7EB] rounded-2xl">

        <div className="px-5 py-4 border-b border-[#E5E7EB]">
          <h2 className="text-sm font-bold text-[#212121]">
            System Information
          </h2>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">

          <InfoItem
            icon={Clock}
            label="Created At"
            value={formatDateTime(
              request.created_at
            )}
          />

          <InfoItem
            icon={Clock}
            label="Last Updated"
            value={formatDateTime(
              request.updated_at
            )}
          />

          <InfoItem
            icon={CheckCircle2}
            label="Request ID"
            value={request.request_id}
          />

        </div>

      </div>

    </div>
  );
};

export default MedicalTourismRequestDetails;

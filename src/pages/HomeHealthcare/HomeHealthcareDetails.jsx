import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  RefreshCw,
  Home,
  User,
  CalendarDays,
  Clock,
  MapPin,
  UserRound,
  Banknote,
  FileText,
} from "lucide-react";

import { getHomeHealthcareService } from "../../services/homeHealthcareService";
import { useAuth } from "../../context/AuthContext";
import { canEdit } from "../../utils/permission";

const HomeHealthcareDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { permissions } = useAuth();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadService = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getHomeHealthcareService(id);

      setService(data);
    } catch (err) {
      console.error(
        "Home Healthcare Details Error:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Failed to load home healthcare service."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadService();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString();
  };

  const formatTime = (time) => {
    if (!time) return "-";

    return time.slice(0, 5);
  };

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

  const formatServiceType = (type) => {
    if (!type) return "-";

    return type
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  const formatStatus = (status) => {
    if (!status) return "Pending";

    return status
      .replaceAll("_", " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-50 text-[#16A34A]";

      case "ASSIGNED":
        return "bg-blue-50 text-[#2F6FED]";

      case "IN_PROGRESS":
        return "bg-purple-50 text-purple-600";

      case "COMPLETED":
        return "bg-emerald-50 text-emerald-600";

      case "CANCELLED":
        return "bg-red-50 text-[#DC2626]";

      case "PENDING":
      default:
        return "bg-yellow-50 text-[#CA8A04]";
    }
  };

  const getMemberName = () => {
    return (
      service?.member_name ||
      service?.member?.full_name ||
      "-"
    );
  };

  const getMemberId = () => {
    return (
      service?.member_id ||
      service?.member?.member_id ||
      "-"
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-[#7A7A7A]">
            <RefreshCw
              size={20}
              className="animate-spin"
            />
            Loading home healthcare service...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">
        <button
          onClick={() =>
            navigate("/home-healthcare")
          }
          className="mb-5 flex items-center gap-2 text-sm font-medium text-[#2F6FED] hover:underline"
        >
          <ArrowLeft size={17} />
          Back to Home Healthcare
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!service) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <button
            onClick={() =>
              navigate("/home-healthcare")
            }
            className="mb-3 flex items-center gap-2 text-sm font-medium text-[#2F6FED] hover:underline"
          >
            <ArrowLeft size={17} />
            Back to Home Healthcare
          </button>

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-[#EEF4FF] p-3">
              <Home
                size={24}
                className="text-[#2F6FED]"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#212121]">
                Home Healthcare Details
              </h1>

              <p className="mt-1 text-sm text-[#7A7A7A]">
                {service.service_id || "-"}
              </p>
            </div>
          </div>
        </div>

        {canEdit(
          permissions,
          "home_healthcare"
        ) && (
          <button
            onClick={() =>
              navigate(
                `/home-healthcare/${service.id}/edit`
              )
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-[#2F6FED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2459C7]"
          >
            <Pencil size={17} />
            Edit Service
          </button>
        )}
      </div>

      {/* Main Card */}
      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">

        {/* Service Header */}
        <div className="border-b border-[#E5E7EB] px-6 py-5">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-sm text-[#7A7A7A]">
                Service ID
              </p>

              <p className="mt-1 text-lg font-bold text-[#2F6FED]">
                {service.service_id || "-"}
              </p>
            </div>

            <span
              className={`inline-flex w-fit rounded-full px-4 py-2 text-xs font-semibold ${getStatusClass(
                service.status
              )}`}
            >
              {formatStatus(service.status)}
            </span>

          </div>
        </div>

        {/* Information */}
        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">

          {/* Member */}
          <div className="rounded-xl border border-[#E5E7EB] p-5">
            <div className="mb-4 flex items-center gap-2">
              <User
                size={19}
                className="text-[#2F6FED]"
              />

              <h2 className="font-semibold text-[#212121]">
                Member Information
              </h2>
            </div>

            <div className="space-y-3">

              <div>
                <p className="text-xs text-[#7A7A7A]">
                  Member Name
                </p>

                <p className="mt-1 text-sm font-semibold text-[#212121]">
                  {getMemberName()}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#7A7A7A]">
                  Member ID
                </p>

                <p className="mt-1 text-sm font-medium text-[#2F6FED]">
                  {getMemberId()}
                </p>
              </div>

            </div>
          </div>

          {/* Service Information */}
          <div className="rounded-xl border border-[#E5E7EB] p-5">
            <div className="mb-4 flex items-center gap-2">
              <Home
                size={19}
                className="text-[#2F6FED]"
              />

              <h2 className="font-semibold text-[#212121]">
                Service Information
              </h2>
            </div>

            <div className="space-y-3">

              <div>
                <p className="text-xs text-[#7A7A7A]">
                  Service Type
                </p>

                <p className="mt-1 text-sm font-semibold text-[#212121]">
                  {formatServiceType(
                    service.service_type
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#7A7A7A]">
                  Status
                </p>

                <span
                  className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                    service.status
                  )}`}
                >
                  {formatStatus(service.status)}
                </span>
              </div>

            </div>
          </div>

          {/* Schedule */}
          <div className="rounded-xl border border-[#E5E7EB] p-5">
            <div className="mb-4 flex items-center gap-2">
              <CalendarDays
                size={19}
                className="text-[#2F6FED]"
              />

              <h2 className="font-semibold text-[#212121]">
                Schedule
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">

              <div>
                <p className="text-xs text-[#7A7A7A]">
                  Service Date
                </p>

                <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-[#212121]">
                  <CalendarDays size={15} />
                  {formatDate(
                    service.service_date
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#7A7A7A]">
                  Service Time
                </p>

                <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-[#212121]">
                  <Clock size={15} />
                  {formatTime(
                    service.service_time
                  )}
                </p>
              </div>

            </div>
          </div>

          {/* Staff & Cost */}
          <div className="rounded-xl border border-[#E5E7EB] p-5">
            <div className="mb-4 flex items-center gap-2">
              <UserRound
                size={19}
                className="text-[#2F6FED]"
              />

              <h2 className="font-semibold text-[#212121]">
                Staff & Cost
              </h2>
            </div>

            <div className="space-y-4">

              <div>
                <p className="text-xs text-[#7A7A7A]">
                  Assigned Staff
                </p>

                <p className="mt-1 text-sm font-semibold text-[#212121]">
                  {service.assigned_staff || "-"}
                </p>
              </div>

              <div>
                <p className="text-xs text-[#7A7A7A]">
                  Estimated Cost
                </p>

                <p className="mt-1 flex items-center gap-2 text-lg font-bold text-[#16A34A]">
                  <Banknote size={18} />
                  {formatCost(
                    service.estimated_cost
                  )}
                </p>
              </div>

            </div>
          </div>

          {/* Address */}
          <div className="rounded-xl border border-[#E5E7EB] p-5 md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <MapPin
                size={19}
                className="text-[#2F6FED]"
              />

              <h2 className="font-semibold text-[#212121]">
                Service Address
              </h2>
            </div>

            <p className="text-sm leading-6 text-[#212121]">
              {service.address || "-"}
            </p>
          </div>

          {/* Notes */}
          <div className="rounded-xl border border-[#E5E7EB] p-5 md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <FileText
                size={19}
                className="text-[#2F6FED]"
              />

              <h2 className="font-semibold text-[#212121]">
                Notes
              </h2>
            </div>

            <p className="whitespace-pre-wrap text-sm leading-6 text-[#212121]">
              {service.notes || "No notes available."}
            </p>
          </div>

        </div>

        {/* Footer Information */}
        <div className="border-t border-[#E5E7EB] bg-[#F9FAFB] px-6 py-4">
          <div className="flex flex-col gap-2 text-xs text-[#7A7A7A] sm:flex-row sm:justify-between">

            <span>
              Created:{" "}
              {service.created_at
                ? new Date(
                    service.created_at
                  ).toLocaleString()
                : "-"}
            </span>

            <span>
              Updated:{" "}
              {service.updated_at
                ? new Date(
                    service.updated_at
                  ).toLocaleString()
                : "-"}
            </span>

          </div>
        </div>

      </div>
    </div>
  );
};

export default HomeHealthcareDetails;
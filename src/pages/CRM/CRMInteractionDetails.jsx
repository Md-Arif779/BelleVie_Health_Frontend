import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  MessageSquare,
  UserRound,
  Building2,
  BriefcaseBusiness,
  CalendarDays,
  Clock,
  FileText,
  AlertCircle,
} from "lucide-react";

import api from "../../services/api";

const CRMInteractionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interaction, setInteraction] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadInteraction = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/crm/${id}/`
        );

        setInteraction(response.data);
      } catch (err) {
        console.error(
          "CRM Details Error:",
          err
        );

        setError(
          err.response?.data?.detail ||
            "Failed to load CRM interaction."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadInteraction();
    }
  }, [id]);

  const formatValue = (value) => {
    if (!value) return "N/A";

    return value
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  const formatDateTime = (value) => {
    if (!value) return "N/A";

    return new Date(value).toLocaleString(
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
      case "OPEN":
        return "bg-blue-50 text-blue-600";

      case "IN_PROGRESS":
        return "bg-yellow-50 text-yellow-700";

      case "COMPLETED":
        return "bg-green-50 text-green-600";

      case "CANCELLED":
        return "bg-red-50 text-red-600";

      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "LOW":
        return "bg-gray-50 text-gray-600";

      case "MEDIUM":
        return "bg-blue-50 text-blue-600";

      case "HIGH":
        return "bg-orange-50 text-orange-600";

      case "URGENT":
        return "bg-red-50 text-red-600";

      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const InfoItem = ({
    icon: Icon,
    label,
    value,
  }) => (
    <div className="flex gap-3">

      <div className="w-9 h-9 shrink-0 rounded-lg bg-[#F8FAFC] flex items-center justify-center text-[#2F6FED]">
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

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this CRM interaction?"
    );

    if (!confirmed) return;

    try {
      await api.delete(
        `/crm/${id}/`
      );

      navigate("/crm");
    } catch (err) {
      console.error(
        "CRM Delete Error:",
        err
      );

      alert(
        err.response?.data?.detail ||
          "Failed to delete interaction."
      );
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-10 text-center">
          <div className="mx-auto w-10 h-10 border-4 border-[#EEF4FF] border-t-[#2F6FED] rounded-full animate-spin" />

          <p className="mt-4 text-sm text-[#7A7A7A]">
            Loading CRM interaction...
          </p>
        </div>
      </div>
    );
  }

  if (error || !interaction) {
    return (
      <div className="p-6">

        <button
          onClick={() =>
            navigate("/crm")
          }
          className="flex items-center gap-2 text-sm font-semibold text-[#7A7A7A] hover:text-[#2F6FED] mb-5"
        >
          <ArrowLeft size={17} />
          Back to CRM
        </button>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-10 text-center">

          <AlertCircle
            size={40}
            className="mx-auto text-red-500"
          />

          <h2 className="mt-4 text-lg font-bold text-[#212121]">
            CRM Interaction Not Found
          </h2>

          <p className="mt-2 text-sm text-[#7A7A7A]">
            {error ||
              "The requested CRM interaction could not be found."}
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

        <div>

          <button
            onClick={() =>
              navigate("/crm")
            }
            className="flex items-center gap-2 text-sm font-semibold text-[#7A7A7A] hover:text-[#2F6FED] mb-3"
          >
            <ArrowLeft size={17} />
            Back to CRM
          </button>

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-xl bg-[#EEF4FF] flex items-center justify-center text-[#2F6FED]">
              <MessageSquare size={23} />
            </div>

            <div>

              <h1 className="text-xl font-bold text-[#212121]">
                {interaction.subject}
              </h1>

              <p className="text-sm text-[#7A7A7A] mt-1">
                {interaction.interaction_id}
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
              ${getStatusStyle(
                interaction.status
              )}
            `}
          >
            {formatValue(
              interaction.status
            )}
          </span>

          <button
            onClick={() =>
              navigate(
                `/crm/${id}/edit`
              )
            }
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2F6FED] text-white text-sm font-semibold hover:bg-[#255ED0]"
          >
            <Pencil size={16} />
            Edit
          </button>

          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100"
          >
            <Trash2 size={16} />
            Delete
          </button>

        </div>

      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] flex items-center justify-center text-[#2F6FED]">
              <UserRound size={19} />
            </div>

            <div>

              <p className="text-[11px] text-[#9CA3AF]">
                Member
              </p>

              <p className="text-sm font-bold text-[#212121]">
                {interaction.member_name ||
                  "N/A"}
              </p>

              <p className="text-[11px] text-[#7A7A7A]">
                {interaction.member_id ||
                  "N/A"}
              </p>

            </div>

          </div>

        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-[#D9F7E8] flex items-center justify-center text-[#2F6FED]">
              <BriefcaseBusiness size={19} />
            </div>

            <div>

              <p className="text-[11px] text-[#9CA3AF]">
                Partner
              </p>

              <p className="text-sm font-bold text-[#212121]">
                {interaction.partner_name ||
                  "N/A"}
              </p>

              <p className="text-[11px] text-[#7A7A7A]">
                {interaction.partner_id ||
                  "N/A"}
              </p>

            </div>

          </div>

        </div>

        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">

          <div className="flex items-center gap-3">

            <div className="w-10 h-10 rounded-xl bg-[#F3E8FF] flex items-center justify-center text-purple-600">
              <Building2 size={19} />
            </div>

            <div>

              <p className="text-[11px] text-[#9CA3AF]">
                Organization
              </p>

              <p className="text-sm font-bold text-[#212121]">
                {interaction.organization_name ||
                  "N/A"}
              </p>

              <p className="text-[11px] text-[#7A7A7A]">
                {interaction.organization_id ||
                  "N/A"}
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Interaction Details */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl mb-6">

        <div className="px-5 py-4 border-b border-[#E5E7EB]">
          <h2 className="text-sm font-bold text-[#212121]">
            Interaction Information
          </h2>
        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <InfoItem
            icon={MessageSquare}
            label="Interaction Type"
            value={formatValue(
              interaction.interaction_type
            )}
          />

          <InfoItem
            icon={CalendarDays}
            label="Interaction Date"
            value={formatDateTime(
              interaction.interaction_date
            )}
          />

          <InfoItem
            icon={CalendarDays}
            label="Follow-up Date"
            value={formatDateTime(
              interaction.follow_up_date
            )}
          />

          <InfoItem
            icon={UserRound}
            label="Assigned To"
            value={
              interaction.assigned_to_name
            }
          />

          <InfoItem
            icon={AlertCircle}
            label="Priority"
            value={formatValue(
              interaction.priority
            )}
          />

        </div>

      </div>

      {/* Description */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl mb-6">

        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center gap-2">

          <FileText
            size={18}
            className="text-[#2F6FED]"
          />

          <h2 className="text-sm font-bold text-[#212121]">
            Description
          </h2>

        </div>

        <div className="p-5">

          <p className="text-sm text-[#6B7280] leading-7 whitespace-pre-line">
            {interaction.description ||
              "No description available."}
          </p>

        </div>

      </div>

      {/* Notes */}
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
            {interaction.notes ||
              "No additional notes available."}
          </p>

        </div>

      </div>

      {/* System Information */}
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
              interaction.created_at
            )}
          />

          <InfoItem
            icon={Clock}
            label="Last Updated"
            value={formatDateTime(
              interaction.updated_at
            )}
          />

          <InfoItem
            icon={MessageSquare}
            label="Interaction ID"
            value={
              interaction.interaction_id
            }
          />

        </div>

      </div>

    </div>
  );
};

export default CRMInteractionDetails;
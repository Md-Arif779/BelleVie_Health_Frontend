import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Handshake,
  UserRound,
  Phone,
  Mail,
  MapPin,
  Globe,
  BriefcaseBusiness,
  FileText,
  CalendarDays,
  ArrowLeft,
  Pencil,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Clock,
  Building2,
} from "lucide-react";

import api from "../../services/api";

const TYPE_LABELS = {
  CAREGIVER_AGENCY: "Caregiver Agency",
  INSURANCE_COMPANY: "Insurance Company",
  CORPORATE: "Corporate",
  NGO: "NGO",
  OTHER: "Other",
};

const STATUS_STYLES = {
  ACTIVE: "bg-green-50 text-green-700",
  INACTIVE: "bg-gray-100 text-gray-600",
  SUSPENDED: "bg-red-50 text-red-700",
};

const STATUS_LABELS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  SUSPENDED: "Suspended",
};

const PartnerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [partner, setPartner] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    const fetchPartner = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/partners/${id}/`
        );

        setPartner(response.data);
      } catch (err) {
        console.error(
          "Partner Details Error:",
          err
        );

        setError(
          err.response?.data?.detail ||
            "Failed to load partner details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPartner();
    }
  }, [id]);

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

  if (loading) {
    return (
      <div className="p-6">

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-10 text-center">

          <RefreshCw
            size={25}
            className="mx-auto animate-spin text-[#2F6FED]"
          />

          <p className="mt-4 text-sm text-[#7A7A7A]">
            Loading partner details...
          </p>

        </div>

      </div>
    );
  }

  if (error || !partner) {
    return (
      <div className="p-6">

        <button
          type="button"
          onClick={() =>
            navigate("/partners")
          }
          className="flex items-center gap-2 text-sm font-semibold text-[#2F6FED] mb-5"
        >
          <ArrowLeft size={18} />
          Back to Partners
        </button>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-10 text-center">

          <AlertCircle
            size={40}
            className="mx-auto text-red-500"
          />

          <h2 className="mt-4 text-lg font-bold text-[#212121]">
            Partner Not Found
          </h2>

          <p className="mt-2 text-sm text-[#7A7A7A]">
            {error ||
              "The requested partner could not be found."}
          </p>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

        <div>

          <button
            type="button"
            onClick={() =>
              navigate("/partners")
            }
            className="flex items-center gap-2 text-sm font-semibold text-[#7A7A7A] hover:text-[#2F6FED] transition mb-3"
          >
            <ArrowLeft size={17} />
            Back to Partners
          </button>

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-xl bg-[#D9F7E8] flex items-center justify-center text-[#2F6FED]">
              <Handshake size={24} />
            </div>

            <div>

              <h1 className="text-xl font-bold text-[#212121]">
                {partner.name}
              </h1>

              <p className="text-sm text-[#7A7A7A] mt-1">
                {partner.partner_id}
              </p>

            </div>

          </div>

        </div>

        <div className="flex items-center gap-3">

          <span
            className={`px-4 py-2 rounded-xl text-xs font-bold ${
              STATUS_STYLES[
                partner.status
              ] ||
              "bg-gray-100 text-gray-700"
            }`}
          >
            {STATUS_LABELS[
              partner.status
            ] ||
              partner.status ||
              "N/A"}
          </span>

          <button
            type="button"
            onClick={() =>
              navigate(
                `/partners/${partner.id}/edit`
              )
            }
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2F6FED] text-white text-sm font-semibold hover:bg-[#255ED0] transition"
          >
            <Pencil size={16} />
            Edit
          </button>

        </div>

      </div>

      {/* SUMMARY */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

        <SummaryCard
          icon={Handshake}
          label="Partner ID"
          value={partner.partner_id}
        />

        <SummaryCard
          icon={Building2}
          label="Partner Type"
          value={
            TYPE_LABELS[
              partner.partner_type
            ] ||
            partner.partner_type
          }
        />

        <SummaryCard
          icon={CheckCircle2}
          label="Status"
          value={
            STATUS_LABELS[
              partner.status
            ] ||
            partner.status
          }
        />

      </div>

      {/* CONTACT + BUSINESS */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">

        {/* CONTACT */}

        <div className="bg-white border border-[#E5E7EB] rounded-2xl">

          <div className="px-5 py-4 border-b border-[#E5E7EB]">

            <h2 className="text-sm font-bold text-[#212121]">
              Contact Information
            </h2>

          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">

            <InfoItem
              icon={UserRound}
              label="Contact Person"
              value={
                partner.contact_person
              }
            />

            <InfoItem
              icon={Phone}
              label="Phone"
              value={partner.phone}
            />

            <InfoItem
              icon={Mail}
              label="Email"
              value={partner.email}
            />

            <InfoItem
              icon={Globe}
              label="Website"
              value={partner.website}
            />

          </div>

        </div>

        {/* BUSINESS */}

        <div className="bg-white border border-[#E5E7EB] rounded-2xl">

          <div className="px-5 py-4 border-b border-[#E5E7EB]">

            <h2 className="text-sm font-bold text-[#212121]">
              Partner Information
            </h2>

          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">

            <InfoItem
              icon={Building2}
              label="Partner Name"
              value={partner.name}
            />

            <InfoItem
              icon={BriefcaseBusiness}
              label="Partner Type"
              value={
                TYPE_LABELS[
                  partner.partner_type
                ] ||
                partner.partner_type
              }
            />

            <InfoItem
              icon={MapPin}
              label="Address"
              value={partner.address}
            />

          </div>

        </div>

      </div>

      {/* SERVICES */}

      <div className="bg-white border border-[#E5E7EB] rounded-2xl mb-6">

        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center gap-2">

          <BriefcaseBusiness
            size={18}
            className="text-[#2F6FED]"
          />

          <h2 className="text-sm font-bold text-[#212121]">
            Services
          </h2>

        </div>

        <div className="p-5">

          <p className="text-sm text-[#6B7280] leading-7 whitespace-pre-line">
            {partner.services ||
              "No services information provided."}
          </p>

        </div>

      </div>

      {/* ADDRESS */}

      <div className="bg-white border border-[#E5E7EB] rounded-2xl mb-6">

        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center gap-2">

          <MapPin
            size={18}
            className="text-[#2F6FED]"
          />

          <h2 className="text-sm font-bold text-[#212121]">
            Address
          </h2>

        </div>

        <div className="p-5">

          <p className="text-sm text-[#6B7280] leading-7 whitespace-pre-line">
            {partner.address ||
              "No address provided."}
          </p>

        </div>

      </div>

      {/* NOTES */}

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
            {partner.notes ||
              "No additional notes available."}
          </p>

        </div>

      </div>

      {/* SYSTEM INFORMATION */}

      <div className="bg-white border border-[#E5E7EB] rounded-2xl">

        <div className="px-5 py-4 border-b border-[#E5E7EB]">

          <h2 className="text-sm font-bold text-[#212121]">
            System Information
          </h2>

        </div>

        <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">

          <InfoItem
            icon={CalendarDays}
            label="Created At"
            value={formatDateTime(
              partner.created_at
            )}
          />

          <InfoItem
            icon={Clock}
            label="Last Updated"
            value={formatDateTime(
              partner.updated_at
            )}
          />

          <InfoItem
            icon={CheckCircle2}
            label="Partner ID"
            value={partner.partner_id}
          />

        </div>

      </div>

    </div>
  );
};

const SummaryCard = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="bg-white border border-[#E5E7EB] rounded-2xl p-5">

      <div className="flex items-center gap-3">

        <div className="w-10 h-10 rounded-xl bg-[#EEF4FF] flex items-center justify-center text-[#2F6FED]">
          <Icon size={19} />
        </div>

        <div>

          <p className="text-[11px] text-[#9CA3AF]">
            {label}
          </p>

          <p className="text-sm font-bold text-[#212121] mt-1">
            {value || "N/A"}
          </p>

        </div>

      </div>

    </div>
  );
};

export default PartnerDetails;
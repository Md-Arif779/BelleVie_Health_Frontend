import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Edit,
  Loader2,
  Mail,
  MapPin,
  Phone,
  User,
  CalendarDays,
  FileText,
} from "lucide-react";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { canEdit } from "../../utils/permission";

const OrganizationDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { permissions } = useAuth();

  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const hasEditPermission = canEdit(
    permissions,
    "organization"
  );

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get(
          `/organizations/${id}/`
        );

        setOrganization(response.data);
      } catch (err) {
        console.error(
          "Organization details error:",
          err
        );

        setError(
          err.response?.data?.detail ||
            "Failed to load organization details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrganization();
    }
  }, [id]);

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

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#7A7A7A]">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading organization...</span>
        </div>
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-8 text-center max-w-md">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#FEF2F2] flex items-center justify-center">
            <Building2 className="w-7 h-7 text-[#DC2626]" />
          </div>

          <h2 className="text-xl font-semibold text-[#212121] mb-2">
            Organization Not Found
          </h2>

          <p className="text-[#7A7A7A] mb-6">
            {error ||
              "The requested organization could not be found."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/organizations")
            }
            className="px-5 py-2.5 rounded-lg bg-[#2F6FED] text-white font-medium hover:bg-[#2459C7] transition"
          >
            Back to Organizations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() =>
              navigate("/organizations")
            }
            className="w-10 h-10 rounded-lg border border-[#E5E7EB] bg-white flex items-center justify-center text-[#7A7A7A] hover:bg-[#F2F2F2] transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-[#212121]">
              Organization Details
            </h1>

            <p className="text-sm text-[#7A7A7A] mt-1">
              View organization information
            </p>
          </div>
        </div>

        {hasEditPermission && (
          <button
            type="button"
            onClick={() =>
              navigate(
                `/organizations/${organization.id}/edit`
              )
            }
            className="px-5 py-2.5 rounded-lg bg-[#2F6FED] text-white font-medium hover:bg-[#2459C7] transition flex items-center justify-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Edit Organization
          </button>
        )}
      </div>

      {/* Organization Header Card */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        <div className="p-6 bg-[#EEF4FF] border-b border-[#E5E7EB]">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <Building2 className="w-8 h-8 text-[#2F6FED]" />
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <h2 className="text-2xl font-bold text-[#212121]">
                  {organization.name}
                </h2>

                <span
                  className={`w-fit px-3 py-1 rounded-full text-xs font-semibold ${
                    organization.status === "ACTIVE"
                      ? "bg-[#DCFCE7] text-[#16A34A]"
                      : "bg-[#F3F4F6] text-[#7A7A7A]"
                  }`}
                >
                  {organization.status === "ACTIVE"
                    ? "Active"
                    : "Inactive"}
                </span>
              </div>

              <p className="text-sm text-[#7A7A7A] mt-1">
                {organization.organization_type ||
                  "Organization"}
              </p>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-[#212121] mb-5">
            Basic Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem
              icon={<Building2 />}
              label="Organization ID"
              value={
                organization.organization_id ||
                "N/A"
              }
            />

            <InfoItem
              icon={<Building2 />}
              label="Organization Type"
              value={
                organization.organization_type ||
                "N/A"
              }
            />

            <InfoItem
              icon={<User />}
              label="Contact Person"
              value={
                organization.contact_person ||
                "N/A"
              }
            />

            <InfoItem
              icon={<Phone />}
              label="Phone"
              value={organization.phone || "N/A"}
            />

            <InfoItem
              icon={<Mail />}
              label="Email"
              value={organization.email || "N/A"}
            />

            <InfoItem
              icon={<MapPin />}
              label="Address"
              value={organization.address || "N/A"}
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#D9F7E8] flex items-center justify-center">
            <FileText className="w-5 h-5 text-[#16A34A]" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-[#212121]">
              Notes
            </h3>

            <p className="text-sm text-[#7A7A7A]">
              Additional organization information
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] p-4">
          <p className="text-sm text-[#7A7A7A] whitespace-pre-wrap">
            {organization.notes ||
              "No notes available."}
          </p>
        </div>
      </div>

      {/* Record Information */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-6">
        <h3 className="text-lg font-semibold text-[#212121] mb-5">
          Record Information
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem
            icon={<CalendarDays />}
            label="Created At"
            value={formatDate(
              organization.created_at
            )}
          />

          <InfoItem
            icon={<CalendarDays />}
            label="Last Updated"
            value={formatDate(
              organization.updated_at
            )}
          />
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 shrink-0 rounded-lg bg-[#F2F2F2] flex items-center justify-center text-[#2F6FED]">
        <span className="w-4 h-4 flex items-center justify-center">
          {icon}
        </span>
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-[#7A7A7A] mb-1">
          {label}
        </p>

        <p className="text-sm font-medium text-[#212121] break-words">
          {value}
        </p>
      </div>
    </div>
  );
};

export default OrganizationDetails;
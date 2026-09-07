import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Handshake,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
  UserRound,
  Phone,
  Mail,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { hasPermission } from "../../utils/permission";

const PARTNER_TYPE_OPTIONS = [
  { value: "", label: "All Types" },
  { value: "CAREGIVER_AGENCY", label: "Caregiver Agency" },
  { value: "INSURANCE_COMPANY", label: "Insurance Company" },
  { value: "CORPORATE", label: "Corporate" },
  { value: "NGO", label: "NGO" },
  { value: "OTHER", label: "Other" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "ACTIVE", label: "Active" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "SUSPENDED", label: "Suspended" },
];

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

const TYPE_LABELS = {
  CAREGIVER_AGENCY: "Caregiver Agency",
  INSURANCE_COMPANY: "Insurance Company",
  CORPORATE: "Corporate",
  NGO: "NGO",
  OTHER: "Other",
};

const PartnerList = () => {
  const navigate = useNavigate();

  const {
    permissions,
    user,
    loading: authLoading,
  } = useAuth();

  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const canView = () => {
    if (user?.role === "SUPER_ADMIN") return true;

    return hasPermission(
      permissions,
      "partners",
      "can_view"
    );
  };

  const canAdd = () => {
    if (user?.role === "SUPER_ADMIN") return true;

    return hasPermission(
      permissions,
      "partners",
      "can_add"
    );
  };

  const canEdit = () => {
    if (user?.role === "SUPER_ADMIN") return true;

    return hasPermission(
      permissions,
      "partners",
      "can_edit"
    );
  };

  const canDelete = () => {
    if (user?.role === "SUPER_ADMIN") return true;

    return hasPermission(
      permissions,
      "partners",
      "can_delete"
    );
  };

  const fetchPartners = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/partners/");

      const data = response.data;

      if (Array.isArray(data)) {
        setPartners(data);
      } else if (Array.isArray(data.results)) {
        setPartners(data.results);
      } else {
        setPartners([]);
      }
    } catch (err) {
      console.error("Partners Error:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to load partners."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading || !canView()) return;

    fetchPartners();
  }, [authLoading, permissions, user]);

  const filteredPartners = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return partners.filter((partner) => {
      const matchesSearch =
        !keyword ||
        partner.partner_id
          ?.toLowerCase()
          .includes(keyword) ||
        partner.name
          ?.toLowerCase()
          .includes(keyword) ||
        partner.contact_person
          ?.toLowerCase()
          .includes(keyword) ||
        partner.phone
          ?.toLowerCase()
          .includes(keyword) ||
        partner.email
          ?.toLowerCase()
          .includes(keyword);

      const matchesType =
        !typeFilter ||
        partner.partner_type === typeFilter;

      const matchesStatus =
        !statusFilter ||
        partner.status === statusFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus
      );
    });
  }, [
    partners,
    search,
    typeFilter,
    statusFilter,
  ]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this partner?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await api.delete(`/partners/${id}/`);

      setPartners((prev) =>
        prev.filter(
          (partner) => partner.id !== id
        )
      );
    } catch (err) {
      console.error("Delete Partner Error:", err);

      alert(
        err.response?.data?.detail ||
          "Failed to delete partner."
      );
    } finally {
      setDeletingId(null);
    }
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

  if (
    !authLoading &&
    !canView()
  ) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="bg-white border border-red-100 rounded-xl p-8 text-center shadow-sm">
          <Handshake
            size={42}
            className="mx-auto text-red-500 mb-4"
          />

          <h2 className="text-xl font-semibold text-[#212121]">
            Access Denied
          </h2>

          <p className="text-[#7A7A7A] mt-2">
            You do not have permission to view
            partners.
          </p>
        </div>
      </div>
    );
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#7A7A7A]">
          <RefreshCw
            size={20}
            className="animate-spin"
          />
          Loading partners...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

        <div className="flex items-center gap-4">

          <div className="w-12 h-12 rounded-xl bg-[#D9F7E8] flex items-center justify-center">
            <Handshake
              size={25}
              className="text-[#2F6FED]"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#212121]">
              Partners
            </h1>

            <p className="text-sm text-[#7A7A7A] mt-1">
              Manage healthcare and business partners
            </p>
          </div>

        </div>

        {canAdd() && (
          <button
            type="button"
            onClick={() =>
              navigate("/partners/new")
            }
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#2F6FED] text-white font-medium hover:bg-[#2459C7] transition"
          >
            <Plus size={19} />
            New Partner
          </button>
        )}

      </div>

      {/* STATISTICS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        <StatCard
          label="Total Partners"
          value={partners.length}
          icon={Handshake}
        />

        <StatCard
          label="Active"
          value={
            partners.filter(
              (item) =>
                item.status === "ACTIVE"
            ).length
          }
          icon={Building2}
        />

        <StatCard
          label="Insurance"
          value={
            partners.filter(
              (item) =>
                item.partner_type ===
                "INSURANCE_COMPANY"
            ).length
          }
          icon={Building2}
        />

        <StatCard
          label="Corporate"
          value={
            partners.filter(
              (item) =>
                item.partner_type ===
                "CORPORATE"
            ).length
          }
          icon={Handshake}
        />

      </div>

      {/* FILTERS */}

      <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 mb-5">

        <div className="flex flex-col lg:flex-row gap-3">

          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search partner, ID, contact, phone or email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E5E7EB] text-sm text-[#212121] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
            />

          </div>

          <select
            value={typeFilter}
            onChange={(e) =>
              setTypeFilter(e.target.value)
            }
            className="lg:w-56 px-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-sm text-[#212121] outline-none focus:border-[#2F6FED]"
          >
            {PARTNER_TYPE_OPTIONS.map(
              (type) => (
                <option
                  key={type.value}
                  value={type.value}
                >
                  {type.label}
                </option>
              )
            )}
          </select>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="lg:w-44 px-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-sm text-[#212121] outline-none focus:border-[#2F6FED]"
          >
            {STATUS_OPTIONS.map(
              (status) => (
                <option
                  key={status.value}
                  value={status.value}
                >
                  {status.label}
                </option>
              )
            )}
          </select>

          <button
            type="button"
            onClick={fetchPartners}
            className="px-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#7A7A7A] hover:text-[#2F6FED] hover:bg-[#F8FAFC] transition"
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>

        </div>

      </div>

      {/* ERROR */}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 mb-5">
          {error}
        </div>
      )}

      {/* TABLE */}

      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px]">

            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB]">

                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#7A7A7A]">
                  Partner
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#7A7A7A]">
                  Type
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#7A7A7A]">
                  Contact
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#7A7A7A]">
                  Phone
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#7A7A7A]">
                  Email
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#7A7A7A]">
                  Status
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#7A7A7A]">
                  Created
                </th>

                <th className="text-right px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#7A7A7A]">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

              {filteredPartners.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-14 text-center"
                  >
                    <Handshake
                      size={38}
                      className="mx-auto text-[#D1D5DB] mb-3"
                    />

                    <p className="text-sm font-medium text-[#6B7280]">
                      No partners found.
                    </p>

                    <p className="text-xs text-[#9CA3AF] mt-1">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredPartners.map(
                  (partner) => (
                    <tr
                      key={partner.id}
                      className="border-b border-[#F0F1F3] last:border-b-0 hover:bg-[#FAFBFC] transition"
                    >

                      {/* PARTNER */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-lg bg-[#D9F7E8] flex items-center justify-center shrink-0">
                            <Handshake
                              size={18}
                              className="text-[#2F6FED]"
                            />
                          </div>

                          <div className="min-w-0">

                            <p className="text-sm font-bold text-[#212121] truncate max-w-[190px]">
                              {partner.name || "-"}
                            </p>

                            <p className="text-xs text-[#7A7A7A] mt-0.5">
                              {partner.partner_id || "-"}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* TYPE */}

                      <td className="px-5 py-4">

                        <span className="text-sm text-[#212121]">
                          {TYPE_LABELS[
                            partner.partner_type
                          ] ||
                            partner.partner_type ||
                            "-"}
                        </span>

                      </td>

                      {/* CONTACT */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <UserRound
                            size={15}
                            className="text-[#7A7A7A]"
                          />

                          <span className="text-sm text-[#212121]">
                            {partner.contact_person ||
                              "-"}
                          </span>

                        </div>

                      </td>

                      {/* PHONE */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <Phone
                            size={15}
                            className="text-[#2F6FED]"
                          />

                          <span className="text-sm text-[#212121]">
                            {partner.phone || "-"}
                          </span>

                        </div>

                      </td>

                      {/* EMAIL */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <Mail
                            size={15}
                            className="text-[#7A7A7A]"
                          />

                          <span className="text-sm text-[#212121] max-w-[210px] truncate">
                            {partner.email || "-"}
                          </span>

                        </div>

                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
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
                            "-"}
                        </span>

                      </td>

                      {/* CREATED */}

                      <td className="px-5 py-4">

                        <span className="text-sm text-[#6B7280]">
                          {formatDate(
                            partner.created_at
                          )}
                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td className="px-5 py-4">

                        <div className="flex items-center justify-end gap-2">

                          {canView() && (
                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/partners/${partner.id}`
                                )
                              }
                              className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#F8FAFC] text-[#7A7A7A] hover:bg-[#EEF4FF] hover:text-[#2F6FED] transition"
                              title="View"
                            >
                              <Eye size={17} />
                            </button>
                          )}

                          {canEdit() && (
                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/partners/${partner.id}/edit`
                                )
                              }
                              className="w-9 h-9 rounded-lg flex items-center justify-center bg-[#F8FAFC] text-[#7A7A7A] hover:bg-[#EEF4FF] hover:text-[#2F6FED] transition"
                              title="Edit"
                            >
                              <Pencil size={17} />
                            </button>
                          )}

                          {canDelete() && (
                            <button
                              type="button"
                              disabled={
                                deletingId ===
                                partner.id
                              }
                              onClick={() =>
                                handleDelete(
                                  partner.id
                                )
                              }
                              className="w-9 h-9 rounded-lg flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 transition disabled:opacity-50"
                              title="Delete"
                            >
                              {deletingId ===
                              partner.id ? (
                                <RefreshCw
                                  size={17}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2 size={17} />
                              )}
                            </button>
                          )}

                        </div>

                      </td>

                    </tr>
                  )
                )
              )}

            </tbody>

          </table>

        </div>

        {/* FOOTER */}

        <div className="px-5 py-4 border-t border-[#E5E7EB] flex items-center justify-between">

          <p className="text-xs text-[#7A7A7A]">
            Showing{" "}
            <span className="font-semibold text-[#212121]">
              {filteredPartners.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[#212121]">
              {partners.length}
            </span>{" "}
            partners
          </p>

          <div className="flex items-center gap-2">

            <button
              type="button"
              disabled
              className="w-8 h-8 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#D1D5DB]"
            >
              <ChevronLeft size={16} />
            </button>

            <span className="text-xs font-medium text-[#7A7A7A]">
              1
            </span>

            <button
              type="button"
              disabled
              className="w-8 h-8 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#D1D5DB]"
            >
              <ChevronRight size={16} />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

const StatCard = ({
  label,
  value,
  icon: Icon,
}) => {
  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">

      <div className="flex items-center justify-between">

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-[#9CA3AF]">
            {label}
          </p>

          <p className="text-2xl font-bold text-[#212121] mt-2">
            {value}
          </p>
        </div>

        <div className="w-10 h-10 rounded-lg bg-[#D9F7E8] flex items-center justify-center">
          <Icon
            size={20}
            className="text-[#2F6FED]"
          />
        </div>

      </div>

    </div>
  );
};

export default PartnerList;
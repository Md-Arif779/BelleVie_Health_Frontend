import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plane,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
  MapPin,
  UserRound,
  Hospital,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { hasPermission } from "../../utils/permission";

const STATUS_OPTIONS = [
  { value: "", label: "All Status" },
  { value: "REQUESTED", label: "Requested" },
  { value: "QUOTATION", label: "Quotation" },
  { value: "VISA_PROCESSING", label: "Visa Processing" },
  { value: "TRAVEL_PLANNED", label: "Travel Planned" },
  { value: "TRAVELING", label: "Traveling" },
  { value: "TREATMENT", label: "Treatment" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

const STATUS_STYLES = {
  REQUESTED: "bg-blue-50 text-blue-700",
  QUOTATION: "bg-purple-50 text-purple-700",
  VISA_PROCESSING: "bg-yellow-50 text-yellow-700",
  TRAVEL_PLANNED: "bg-indigo-50 text-indigo-700",
  TRAVELING: "bg-cyan-50 text-cyan-700",
  TREATMENT: "bg-orange-50 text-orange-700",
  COMPLETED: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-700",
};

const STATUS_LABELS = {
  REQUESTED: "Requested",
  QUOTATION: "Quotation",
  VISA_PROCESSING: "Visa Processing",
  TRAVEL_PLANNED: "Travel Planned",
  TRAVELING: "Traveling",
  TREATMENT: "Treatment",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const MedicalTourismRequestList = () => {
  const navigate = useNavigate();

  const { permissions, user, loading: authLoading } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const canView = (module) => {
    if (user?.role === "SUPER_ADMIN") {
      return true;
    }

    return hasPermission(
      permissions,
      module,
      "can_view"
    );
  };

  const canAdd = (module) => {
    if (user?.role === "SUPER_ADMIN") {
      return true;
    }

    return hasPermission(
      permissions,
      module,
      "can_add"
    );
  };

  const canEdit = (module) => {
    if (user?.role === "SUPER_ADMIN") {
      return true;
    }

    return hasPermission(
      permissions,
      module,
      "can_edit"
    );
  };

  const canDelete = (module) => {
    if (user?.role === "SUPER_ADMIN") {
      return true;
    }

    return hasPermission(
      permissions,
      module,
      "can_delete"
    );
  };

  const canViewMedicalTourism =
    canView("medical_tourism");

  const canAddMedicalTourism =
    canAdd("medical_tourism");

  const canEditMedicalTourism =
    canEdit("medical_tourism");

  const canDeleteMedicalTourism =
    canDelete("medical_tourism");

  // --------------------------------------------------
  // Fetch Requests
  // --------------------------------------------------

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        "/medical-tourism/requests/"
      );

      const data = response.data;

      if (Array.isArray(data)) {
        setRequests(data);
      } else if (Array.isArray(data.results)) {
        setRequests(data.results);
      } else {
        setRequests([]);
      }
    } catch (err) {
      console.error(
        "Medical Tourism Requests Error:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Failed to load medical tourism requests."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      authLoading ||
      !canViewMedicalTourism
    ) {
      return;
    }

    fetchRequests();
  }, [
    authLoading,
    canViewMedicalTourism,
  ]);

  // --------------------------------------------------
  // Filter
  // --------------------------------------------------

  const filteredRequests = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    return requests.filter((request) => {
      const matchesSearch =
        !keyword ||
        request.request_id
          ?.toLowerCase()
          .includes(keyword) ||
        request.member_id
          ?.toLowerCase()
          .includes(keyword) ||
        request.member_name
          ?.toLowerCase()
          .includes(keyword) ||
        request.destination_country
          ?.toLowerCase()
          .includes(keyword) ||
        request.international_hospital
          ?.toLowerCase()
          .includes(keyword) ||
        request.treatment_name
          ?.toLowerCase()
          .includes(keyword);

      const matchesStatus =
        !statusFilter ||
        request.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    requests,
    search,
    statusFilter,
  ]);

  // --------------------------------------------------
  // Delete
  // --------------------------------------------------

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this medical tourism request?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      await api.delete(
        `/medical-tourism/requests/${id}/`
      );

      setRequests((prev) =>
        prev.filter(
          (request) =>
            request.id !== id
        )
      );
    } catch (err) {
      console.error(
        "Delete Medical Tourism Request Error:",
        err
      );

      alert(
        err.response?.data?.detail ||
          "Failed to delete medical tourism request."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // --------------------------------------------------
  // Date
  // --------------------------------------------------

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-BD",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      }
    );
  };

  // --------------------------------------------------
  // Currency
  // --------------------------------------------------

  const formatAmount = (amount) => {
    if (
      amount === null ||
      amount === undefined ||
      amount === ""
    ) {
      return "-";
    }

    return Number(amount).toLocaleString(
      "en-BD",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    );
  };

  // --------------------------------------------------
  // Access Denied
  // --------------------------------------------------

  if (
    !authLoading &&
    !canViewMedicalTourism
  ) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="bg-white border border-red-100 rounded-xl p-8 text-center shadow-sm">
          <Plane
            size={42}
            className="mx-auto text-red-500 mb-4"
          />

          <h2 className="text-xl font-semibold text-[#212121]">
            Access Denied
          </h2>

          <p className="text-[#7A7A7A] mt-2">
            You do not have permission to view
            medical tourism requests.
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (authLoading || loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#7A7A7A]">
          <RefreshCw
            size={20}
            className="animate-spin"
          />
          Loading medical tourism requests...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">
      {/* ================================================= */}
      {/* Header */}
      {/* ================================================= */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#D9F7E8] flex items-center justify-center">
            <Plane
              size={25}
              className="text-[#2F6FED]"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#212121]">
              Medical Tourism
            </h1>

            <p className="text-sm text-[#7A7A7A] mt-1">
              Manage international treatment and
              medical travel requests
            </p>
          </div>
        </div>

        {canAddMedicalTourism && (
          <button
            type="button"
            onClick={() =>
              navigate(
                "/medical-tourism/new"
              )
            }
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#2F6FED] text-white font-medium hover:bg-[#2459C7] transition"
          >
            <Plus size={19} />
            New Request
          </button>
        )}
      </div>

      {/* ================================================= */}
      {/* Statistics */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          label="Total Requests"
          value={requests.length}
          icon={Plane}
        />

        <StatCard
          label="Requested"
          value={
            requests.filter(
              (item) =>
                item.status === "REQUESTED"
            ).length
          }
          icon={MapPin}
        />

        <StatCard
          label="Traveling"
          value={
            requests.filter(
              (item) =>
                item.status === "TRAVELING"
            ).length
          }
          icon={Plane}
        />

        <StatCard
          label="Completed"
          value={
            requests.filter(
              (item) =>
                item.status === "COMPLETED"
            ).length
          }
          icon={Hospital}
        />
      </div>

      {/* ================================================= */}
      {/* Filters */}
      {/* ================================================= */}

      <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 mb-5">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
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
              placeholder="Search request ID, member, country, hospital or treatment..."
              className="
                w-full
                pl-10
                pr-4
                py-2.5
                rounded-lg
                border
                border-[#E5E7EB]
                text-sm
                text-[#212121]
                outline-none
                focus:border-[#2F6FED]
                focus:ring-2
                focus:ring-[#2F6FED]/10
              "
            />
          </div>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="
              md:w-52
              px-4
              py-2.5
              rounded-lg
              border
              border-[#E5E7EB]
              bg-white
              text-sm
              text-[#212121]
              outline-none
              focus:border-[#2F6FED]
            "
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

          {/* Refresh */}
          <button
            type="button"
            onClick={fetchRequests}
            className="
              px-4
              py-2.5
              rounded-lg
              border
              border-[#E5E7EB]
              bg-white
              text-[#7A7A7A]
              hover:text-[#2F6FED]
              hover:bg-[#F8FAFC]
              transition
            "
            title="Refresh"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* ================================================= */}
      {/* Error */}
      {/* ================================================= */}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4 mb-5">
          {error}
        </div>
      )}

      {/* ================================================= */}
      {/* Table */}
      {/* ================================================= */}

      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1150px]">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB]">
                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#7A7A7A]">
                  Request
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#7A7A7A]">
                  Member
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#7A7A7A]">
                  Destination
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#7A7A7A]">
                  Hospital
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#7A7A7A]">
                  Treatment
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#7A7A7A]">
                  Quotation
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#7A7A7A]">
                  Status
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#7A7A7A]">
                  Request Date
                </th>

                <th className="text-right px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#7A7A7A]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="px-5 py-14 text-center"
                  >
                    <Plane
                      size={38}
                      className="mx-auto text-[#D1D5DB] mb-3"
                    />

                    <p className="text-sm font-medium text-[#6B7280]">
                      No medical tourism requests
                      found.
                    </p>

                    <p className="text-xs text-[#9CA3AF] mt-1">
                      Try changing your search or
                      status filter.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredRequests.map(
                  (request) => (
                    <tr
                      key={request.id}
                      className="border-b border-[#F0F1F3] last:border-b-0 hover:bg-[#FAFBFC] transition"
                    >
                      {/* Request */}
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-bold text-[#212121]">
                            {request.request_id ||
                              "-"}
                          </p>

                          <p className="text-xs text-[#9CA3AF] mt-1">
                            #{request.id}
                          </p>
                        </div>
                      </td>

                      {/* Member */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#D9F7E8] flex items-center justify-center shrink-0">
                            <UserRound
                              size={17}
                              className="text-[#2F6FED]"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#212121] truncate max-w-[160px]">
                              {request.member_name ||
                                "-"}
                            </p>

                            <p className="text-xs text-[#7A7A7A] mt-0.5">
                              {request.member_id ||
                                "-"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Destination */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <MapPin
                            size={16}
                            className="text-[#2F6FED] shrink-0"
                          />

                          <span className="text-sm text-[#212121]">
                            {request.destination_country ||
                              "-"}
                          </span>
                        </div>
                      </td>

                      {/* Hospital */}
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-2 max-w-[190px]">
                          <Hospital
                            size={16}
                            className="text-[#7A7A7A] mt-0.5 shrink-0"
                          />

                          <span className="text-sm text-[#212121]">
                            {request.international_hospital ||
                              "-"}
                          </span>
                        </div>
                      </td>

                      {/* Treatment */}
                      <td className="px-5 py-4">
                        <p className="text-sm text-[#212121] max-w-[170px] truncate">
                          {request.treatment_name ||
                            "-"}
                        </p>
                      </td>

                      {/* Quotation */}
                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-[#212121]">
                          {formatAmount(
                            request.quotation_amount
                          )}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                            STATUS_STYLES[
                              request.status
                            ] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {STATUS_LABELS[
                            request.status
                          ] ||
                            request.status ||
                            "-"}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4">
                        <span className="text-sm text-[#6B7280]">
                          {formatDate(
                            request.request_date
                          )}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {/* View */}
                          {canViewMedicalTourism && (
                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/medical-tourism/${request.id}`
                                )
                              }
                              className="
                                w-9
                                h-9
                                rounded-lg
                                flex
                                items-center
                                justify-center
                                bg-[#F8FAFC]
                                text-[#7A7A7A]
                                hover:bg-[#EEF4FF]
                                hover:text-[#2F6FED]
                                transition
                              "
                              title="View"
                            >
                              <Eye size={17} />
                            </button>
                          )}

                          {/* Edit */}
                          {canEditMedicalTourism && (
                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/medical-tourism/${request.id}/edit`
                                )
                              }
                              className="
                                w-9
                                h-9
                                rounded-lg
                                flex
                                items-center
                                justify-center
                                bg-[#F8FAFC]
                                text-[#7A7A7A]
                                hover:bg-[#EEF4FF]
                                hover:text-[#2F6FED]
                                transition
                              "
                              title="Edit"
                            >
                              <Pencil size={17} />
                            </button>
                          )}

                          {/* Delete */}
                          {canDeleteMedicalTourism && (
                            <button
                              type="button"
                              disabled={
                                deletingId ===
                                request.id
                              }
                              onClick={() =>
                                handleDelete(
                                  request.id
                                )
                              }
                              className="
                                w-9
                                h-9
                                rounded-lg
                                flex
                                items-center
                                justify-center
                                bg-red-50
                                text-red-500
                                hover:bg-red-100
                                transition
                                disabled:opacity-50
                                disabled:cursor-not-allowed
                              "
                              title="Delete"
                            >
                              {deletingId ===
                              request.id ? (
                                <RefreshCw
                                  size={17}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2
                                  size={17}
                                />
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

        {/* ================================================= */}
        {/* Footer */}
        {/* ================================================= */}

        <div className="px-5 py-4 border-t border-[#E5E7EB] flex items-center justify-between">
          <p className="text-xs text-[#7A7A7A]">
            Showing{" "}
            <span className="font-semibold text-[#212121]">
              {filteredRequests.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-[#212121]">
              {requests.length}
            </span>{" "}
            requests
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

// =====================================================
// Stat Card
// =====================================================

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

export default MedicalTourismRequestList;
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Ambulance,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
  MapPin,
  UserRound,
  Phone,
  Car,
  Clock3,
} from "lucide-react";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import {
  canView,
  canAdd,
  canEdit,
  canDelete,
} from "../../utils/permission";

const STATUS_LABELS = {
  REQUESTED: "Requested",
  ASSIGNED: "Assigned",
  ON_THE_WAY: "On The Way",
  PICKED_UP: "Picked Up",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const STATUS_STYLES = {
  REQUESTED: "bg-blue-50 text-blue-700",
  ASSIGNED: "bg-purple-50 text-purple-700",
  ON_THE_WAY: "bg-yellow-50 text-yellow-700",
  PICKED_UP: "bg-indigo-50 text-indigo-700",
  COMPLETED: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-700",
};

function AmbulanceRequestList() {
  const navigate = useNavigate();

  const { permissions, loading } = useAuth();

  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [error, setError] = useState("");

  const ambulancePermission = "ambulance";

  const canViewAmbulance = canView(
    permissions,
    ambulancePermission
  );

  const canAddAmbulance = canAdd(
    permissions,
    ambulancePermission
  );

  const canEditAmbulance = canEdit(
    permissions,
    ambulancePermission
  );

  const canDeleteAmbulance = canDelete(
    permissions,
    ambulancePermission
  );

  const fetchRequests = async () => {
    try {
      setLoadingRequests(true);
      setError("");

      const response = await api.get("/ambulance/requests/");

      const data = response.data;

      if (Array.isArray(data)) {
        setRequests(data);
      } else {
        setRequests(data?.results || []);
      }
    } catch (err) {
      console.error("Ambulance requests error:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to load ambulance requests."
      );
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!canViewAmbulance) {
      return;
    }

    fetchRequests();
  }, [loading, canViewAmbulance]);

  const filteredRequests = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return requests.filter((request) => {
      const matchesSearch =
        !searchValue ||
        request.request_id?.toLowerCase().includes(searchValue) ||
        request.patient_name?.toLowerCase().includes(searchValue) ||
        request.patient_phone?.toLowerCase().includes(searchValue) ||
        request.member_id?.toLowerCase().includes(searchValue) ||
        request.member_name?.toLowerCase().includes(searchValue) ||
        request.pickup_location?.toLowerCase().includes(searchValue) ||
        request.destination?.toLowerCase().includes(searchValue) ||
        request.ambulance_number
          ?.toLowerCase()
          .includes(searchValue) ||
        request.driver_name?.toLowerCase().includes(searchValue);

      const matchesStatus =
        !statusFilter || request.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [requests, search, statusFilter]);

  const stats = useMemo(() => {
    const total = requests.length;

    const requested = requests.filter(
      (item) => item.status === "REQUESTED"
    ).length;

    const active = requests.filter((item) =>
      ["ASSIGNED", "ON_THE_WAY", "PICKED_UP"].includes(
        item.status
      )
    ).length;

    const completed = requests.filter(
      (item) => item.status === "COMPLETED"
    ).length;

    return {
      total,
      requested,
      active,
      completed,
    };
  }, [requests]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this ambulance request?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(`/ambulance/requests/${id}/`);

      setRequests((previous) =>
        previous.filter((item) => item.id !== id)
      );
    } catch (err) {
      console.error("Delete ambulance request error:", err);

      alert(
        err.response?.data?.detail ||
          "Failed to delete ambulance request."
      );
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString("en-BD", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-gray-500">
          Loading permissions...
        </div>
      </div>
    );
  }

  if (!canViewAmbulance) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="bg-white border border-red-100 rounded-xl p-8 text-center shadow-sm">
          <Ambulance
            size={42}
            className="mx-auto text-red-500 mb-4"
          />

          <h2 className="text-xl font-semibold text-[#212121]">
            Access Denied
          </h2>

          <p className="text-[#7A7A7A] mt-2">
            You do not have permission to view ambulance requests.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#D9F7E8] flex items-center justify-center">
              <Ambulance
                size={24}
                className="text-[#2F6FED]"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#212121]">
                Ambulance Requests
              </h1>

              <p className="text-sm text-[#7A7A7A]">
                Manage ambulance emergency requests
              </p>
            </div>
          </div>
        </div>

        {canAddAmbulance && (
          <button
            type="button"
            onClick={() =>
              navigate("/ambulance-requests/add")
            }
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#2F6FED] text-white font-medium hover:bg-[#2459C7] transition"
          >
            <Plus size={18} />
            New Ambulance Request
          </button>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#7A7A7A]">
                Total Requests
              </p>

              <h3 className="text-2xl font-bold text-[#212121] mt-1">
                {stats.total}
              </h3>
            </div>

            <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
              <Ambulance
                size={22}
                className="text-[#2F6FED]"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#7A7A7A]">
                Requested
              </p>

              <h3 className="text-2xl font-bold text-[#212121] mt-1">
                {stats.requested}
              </h3>
            </div>

            <div className="w-11 h-11 rounded-lg bg-yellow-50 flex items-center justify-center">
              <Clock3
                size={22}
                className="text-yellow-600"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#7A7A7A]">
                Active
              </p>

              <h3 className="text-2xl font-bold text-[#212121] mt-1">
                {stats.active}
              </h3>
            </div>

            <div className="w-11 h-11 rounded-lg bg-purple-50 flex items-center justify-center">
              <Car
                size={22}
                className="text-purple-600"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#7A7A7A]">
                Completed
              </p>

              <h3 className="text-2xl font-bold text-[#212121] mt-1">
                {stats.completed}
              </h3>
            </div>

            <div className="w-11 h-11 rounded-lg bg-green-50 flex items-center justify-center">
              <Clock3
                size={22}
                className="text-green-600"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search request, patient, member, location..."
              className="w-full h-11 pl-10 pr-4 rounded-lg border border-[#E5E7EB] outline-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="h-11 px-4 rounded-lg border border-[#E5E7EB] bg-white outline-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
          >
            <option value="">All Status</option>

            <option value="REQUESTED">Requested</option>
            <option value="ASSIGNED">Assigned</option>
            <option value="ON_THE_WAY">On The Way</option>
            <option value="PICKED_UP">Picked Up</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <button
            type="button"
            onClick={fetchRequests}
            disabled={loadingRequests}
            className="h-11 px-4 rounded-lg border border-[#E5E7EB] bg-white hover:bg-gray-50 flex items-center justify-center gap-2 text-[#212121]"
          >
            <RefreshCw
              size={17}
              className={
                loadingRequests ? "animate-spin" : ""
              }
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-[#212121]">
              Ambulance Requests
            </h2>

            <p className="text-sm text-[#7A7A7A] mt-1">
              {filteredRequests.length} request
              {filteredRequests.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {loadingRequests ? (
          <div className="py-16 text-center text-[#7A7A7A]">
            Loading ambulance requests...
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="py-16 text-center">
            <Ambulance
              size={42}
              className="mx-auto text-gray-300 mb-3"
            />

            <h3 className="font-medium text-[#212121]">
              No ambulance requests found
            </h3>

            <p className="text-sm text-[#7A7A7A] mt-1">
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs uppercase tracking-wide text-[#7A7A7A]">
                  <th className="px-5 py-4">
                    Request
                  </th>

                  <th className="px-5 py-4">
                    Patient
                  </th>

                  <th className="px-5 py-4">
                    Route
                  </th>

                  <th className="px-5 py-4">
                    Ambulance / Driver
                  </th>

                  <th className="px-5 py-4">
                    Status
                  </th>

                  <th className="px-5 py-4">
                    Date
                  </th>

                  <th className="px-5 py-4 text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#EEEEEE]">
                {filteredRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-gray-50 transition"
                  >
                    {/* Request */}
                    <td className="px-5 py-4">
                      <div className="font-semibold text-[#212121]">
                        {request.request_id || "-"}
                      </div>

                      {request.member_id && (
                        <div className="text-xs text-[#7A7A7A] mt-1">
                          Member: {request.member_id}
                        </div>
                      )}
                    </td>

                    {/* Patient */}
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-2">
                        <UserRound
                          size={17}
                          className="text-[#7A7A7A] mt-0.5"
                        />

                        <div>
                          <div className="font-medium text-[#212121]">
                            {request.patient_name || "-"}
                          </div>

                          {request.patient_phone && (
                            <div className="flex items-center gap-1 text-xs text-[#7A7A7A] mt-1">
                              <Phone size={12} />
                              {request.patient_phone}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Route */}
                    <td className="px-5 py-4 max-w-[280px]">
                      <div className="flex items-start gap-2">
                        <MapPin
                          size={17}
                          className="text-[#2F6FED] mt-0.5 shrink-0"
                        />

                        <div className="text-sm">
                          <div
                            className="text-[#212121] truncate"
                            title={request.pickup_location}
                          >
                            From:{" "}
                            {request.pickup_location || "-"}
                          </div>

                          <div
                            className="text-[#7A7A7A] truncate mt-1"
                            title={request.destination}
                          >
                            To:{" "}
                            {request.destination || "-"}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Ambulance / Driver */}
                    <td className="px-5 py-4">
                      <div className="text-sm">
                        <div className="font-medium text-[#212121]">
                          {request.ambulance_number || "-"}
                        </div>

                        <div className="text-[#7A7A7A] mt-1">
                          {request.driver_name || "No driver assigned"}
                        </div>

                        {request.driver_phone && (
                          <div className="text-xs text-[#7A7A7A] mt-1">
                            {request.driver_phone}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                          STATUS_STYLES[request.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {STATUS_LABELS[request.status] ||
                          request.status ||
                          "-"}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4">
                      <div className="text-sm text-[#212121]">
                        {formatDate(
                          request.request_date ||
                            request.created_at
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/ambulance-requests/${request.id}`
                            )
                          }
                          title="View"
                          className="w-9 h-9 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#7A7A7A] hover:text-[#2F6FED] hover:border-[#2F6FED] transition"
                        >
                          <Eye size={17} />
                        </button>

                        {canEditAmbulance && (
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/ambulance-requests/${request.id}/edit`
                              )
                            }
                            title="Edit"
                            className="w-9 h-9 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#7A7A7A] hover:text-[#2F6FED] hover:border-[#2F6FED] transition"
                          >
                            <Pencil size={17} />
                          </button>
                        )}

                        {canDeleteAmbulance && (
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(request.id)
                            }
                            title="Delete"
                            className="w-9 h-9 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#7A7A7A] hover:text-red-600 hover:border-red-300 transition"
                          >
                            <Trash2 size={17} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AmbulanceRequestList;
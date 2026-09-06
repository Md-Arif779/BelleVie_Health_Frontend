
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
  Home,
} from "lucide-react";

import {
  getHomeHealthcareServices,
  deleteHomeHealthcareService,
} from "../../services/homeHealthcareService";

import { useAuth } from "../../context/AuthContext";
import {
  canAdd,
  canEdit,
  canDelete,
} from "../../utils/permission";

const HomeHealthcareList = () => {
  const navigate = useNavigate();
  const { permissions } = useAuth();

  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadServices = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getHomeHealthcareServices();

      if (Array.isArray(data)) {
        setServices(data);
      } else if (Array.isArray(data?.results)) {
        setServices(data.results);
      } else {
        setServices([]);
      }
    } catch (err) {
      console.error("Home Healthcare Error:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to load home healthcare services."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleDelete = async (id, serviceId) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${
        serviceId || "this service"
      }?`
    );

    if (!confirmed) return;

    try {
      await deleteHomeHealthcareService(id);

      setServices((prev) =>
        prev.filter((service) => service.id !== id)
      );
    } catch (err) {
      console.error(
        "Delete Home Healthcare Error:",
        err
      );

      alert(
        err.response?.data?.detail ||
          "Failed to delete home healthcare service."
      );
    }
  };

  const getMemberName = (service) => {
    return (
      service.member_name ||
      service.member?.full_name ||
      "-"
    );
  };

  const getMemberId = (service) => {
    return (
      service.member_id ||
      service.member?.member_id ||
      "-"
    );
  };

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

  const filteredServices = services.filter((service) => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return true;

    return (
      service.service_id
        ?.toLowerCase()
        .includes(keyword) ||
      getMemberName(service)
        .toLowerCase()
        .includes(keyword) ||
      getMemberId(service)
        .toLowerCase()
        .includes(keyword) ||
      service.service_type
        ?.toLowerCase()
        .includes(keyword) ||
      service.assigned_staff
        ?.toLowerCase()
        .includes(keyword) ||
      service.address
        ?.toLowerCase()
        .includes(keyword) ||
      service.status
        ?.toLowerCase()
        .includes(keyword)
    );
  });

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-[#212121]">
            Home Healthcare
          </h1>

          <p className="mt-1 text-sm text-[#7A7A7A]">
            Manage home healthcare services and patient care
          </p>
        </div>

        {canAdd(
          permissions,
          "home_healthcare"
        ) && (
          <button
            onClick={() =>
              navigate("/home-healthcare/add")
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-[#2F6FED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2459C7]"
          >
            <Plus size={18} />
            Add Home Healthcare
          </button>
        )}
      </div>

      {/* Search + Refresh */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">

        <div className="relative flex-1">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search service ID, member, service type, staff..."
            className="w-full rounded-lg border border-[#E5E7EB] bg-white py-3 pl-10 pr-4 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED]"
          />
        </div>

        <button
          onClick={loadServices}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-medium text-[#212121] transition hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={
              loading ? "animate-spin" : ""
            }
          />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
          <p className="text-sm text-[#7A7A7A]">
            Total Services
          </p>

          <p className="mt-2 text-2xl font-bold text-[#212121]">
            {services.length}
          </p>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
          <p className="text-sm text-[#7A7A7A]">
            Pending
          </p>

          <p className="mt-2 text-2xl font-bold text-[#CA8A04]">
            {
              services.filter(
                (service) =>
                  service.status === "PENDING"
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
          <p className="text-sm text-[#7A7A7A]">
            Assigned
          </p>

          <p className="mt-2 text-2xl font-bold text-[#2F6FED]">
            {
              services.filter(
                (service) =>
                  service.status === "ASSIGNED"
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
          <p className="text-sm text-[#7A7A7A]">
            Completed
          </p>

          <p className="mt-2 text-2xl font-bold text-[#16A34A]">
            {
              services.filter(
                (service) =>
                  service.status === "COMPLETED"
              ).length
            }
          </p>
        </div>

      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">

            <div className="flex items-center gap-3 text-sm text-[#7A7A7A]">

              <RefreshCw
                size={20}
                className="animate-spin"
              />

              Loading home healthcare services...

            </div>

          </div>
        ) : filteredServices.length === 0 ? (

          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">

            <div className="mb-3 rounded-full bg-[#EEF4FF] p-4">

              <Home
                size={24}
                className="text-[#2F6FED]"
              />

            </div>

            <h3 className="text-base font-semibold text-[#212121]">
              No home healthcare services found
            </h3>

            <p className="mt-1 text-sm text-[#7A7A7A]">
              {search
                ? "Try changing your search keyword."
                : "No home healthcare services have been added yet."}
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1200px]">

              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Service ID
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Member
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Service Type
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Date & Time
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Assigned Staff
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Cost
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredServices.map((service) => (

                  <tr
                    key={service.id}
                    className="border-b border-[#EEEEEE] last:border-b-0 hover:bg-[#FAFAFA]"
                  >

                    {/* Service ID */}
                    <td className="px-5 py-4">

                      <span className="font-medium text-[#2F6FED]">
                        {service.service_id || "-"}
                      </span>

                    </td>

                    {/* Member */}
                    <td className="px-5 py-4">

                      <div>
                        <p className="font-semibold text-[#212121]">
                          {getMemberName(service)}
                        </p>

                        <p className="mt-1 text-xs text-[#7A7A7A]">
                          {getMemberId(service)}
                        </p>
                      </div>

                    </td>

                    {/* Service Type */}
                    <td className="px-5 py-4">

                      <span className="text-sm font-medium text-[#212121]">
                        {formatServiceType(
                          service.service_type
                        )}
                      </span>

                    </td>

                    {/* Date & Time */}
                    <td className="px-5 py-4">

                      <p className="text-sm font-medium text-[#212121]">
                        {formatDate(
                          service.service_date
                        )}
                      </p>

                      <p className="mt-1 text-xs text-[#7A7A7A]">
                        {formatTime(
                          service.service_time
                        )}
                      </p>

                    </td>

                    {/* Assigned Staff */}
                    <td className="px-5 py-4 text-sm text-[#212121]">
                      {service.assigned_staff || "-"}
                    </td>

                    {/* Cost */}
                    <td className="px-5 py-4 text-sm font-medium text-[#212121]">
                      {formatCost(
                        service.estimated_cost
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                          service.status
                        )}`}
                      >
                        {formatStatus(
                          service.status
                        )}
                      </span>

                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">

                      <div className="flex items-center justify-end gap-2">

                        {/* View */}
                        <button
                          onClick={() =>
                            navigate(
                              `/home-healthcare/${service.id}`
                            )
                          }
                          title="View"
                          className="rounded-lg p-2 text-[#7A7A7A] transition hover:bg-[#EEF4FF] hover:text-[#2F6FED]"
                        >
                          <Eye size={17} />
                        </button>

                        {/* Edit */}
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
                            title="Edit"
                            className="rounded-lg p-2 text-[#7A7A7A] transition hover:bg-blue-50 hover:text-[#2F6FED]"
                          >
                            <Pencil size={17} />
                          </button>
                        )}

                        {/* Delete */}
                        {canDelete(
                          permissions,
                          "home_healthcare"
                        ) && (
                          <button
                            onClick={() =>
                              handleDelete(
                                service.id,
                                service.service_id
                              )
                            }
                            title="Delete"
                            className="rounded-lg p-2 text-[#7A7A7A] transition hover:bg-red-50 hover:text-[#DC2626]"
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
};

export default HomeHealthcareList;


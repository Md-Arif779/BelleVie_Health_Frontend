import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Video,
  RefreshCw,
} from "lucide-react";

import {
  getTelemedicines,
  deleteTelemedicine,
} from "../../services/telemedicineService";

import { useAuth } from "../../context/AuthContext";
import {
  canAdd,
  canEdit,
  canDelete,
} from "../../utils/permission";

const Telemedicine = () => {
  const navigate = useNavigate();

  const { permissions, user } = useAuth();

  const [telemedicines, setTelemedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const moduleName = "telemedicine";

  const isSuperAdmin =
    user?.role === "SUPER_ADMIN";

  const hasAddPermission =
    isSuperAdmin || canAdd(permissions, moduleName);

  const hasEditPermission =
    isSuperAdmin || canEdit(permissions, moduleName);

  const hasDeletePermission =
    isSuperAdmin || canDelete(permissions, moduleName);

  // --------------------------------------------------
  // Load Telemedicine
  // --------------------------------------------------

  const loadTelemedicines = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getTelemedicines();

      setTelemedicines(
        Array.isArray(data)
          ? data
          : data?.results || []
      );
    } catch (err) {
      console.error(
        "Telemedicine Error:",
        err
      );

      setError(
        err?.response?.data?.detail ||
          "Failed to load telemedicine consultations."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTelemedicines();
  }, []);

  // --------------------------------------------------
  // Delete
  // --------------------------------------------------

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this telemedicine consultation?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteTelemedicine(id);

      setTelemedicines((prev) =>
        prev.filter(
          (item) => item.id !== id
        )
      );
    } catch (err) {
      console.error(
        "Delete Telemedicine Error:",
        err
      );

      alert(
        err?.response?.data?.detail ||
          "Failed to delete telemedicine consultation."
      );
    }
  };

  // --------------------------------------------------
  // Search
  // --------------------------------------------------

  const filteredTelemedicines =
    telemedicines.filter((item) => {
      const searchValue =
        search.toLowerCase().trim();

      return (
        item.telemedicine_id
          ?.toLowerCase()
          .includes(searchValue) ||

        item.member_name
          ?.toLowerCase()
          .includes(searchValue) ||

        item.doctor_name
          ?.toLowerCase()
          .includes(searchValue) ||

        item.consultation_type
          ?.toLowerCase()
          .includes(searchValue) ||

        item.status
          ?.toLowerCase()
          .includes(searchValue)
      );
    });

  // --------------------------------------------------
  // Status Style
  // --------------------------------------------------

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

  // --------------------------------------------------
  // Consultation Type
  // --------------------------------------------------

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

  return (
    <div className="space-y-6">

      {/* ------------------------------------------------ */}
      {/* Header */}
      {/* ------------------------------------------------ */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <div className="flex items-center gap-3">

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
              <Video
                size={21}
                strokeWidth={2}
              />
            </div>

            <div>
              <h1 className="text-xl font-bold text-[#212121]">
                Telemedicine
              </h1>

              <p className="text-sm text-[#7A7A7A] mt-1">
                Manage online doctor consultations
              </p>
            </div>

          </div>
        </div>

        {hasAddPermission && (
          <button
            type="button"
            onClick={() =>
              navigate("/telemedicine/new")
            }
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              px-4
              py-2.5
              rounded-xl
              bg-[#2F6FED]
              text-white
              text-sm
              font-semibold
              hover:bg-[#2459C7]
              transition
            "
          >
            <Plus size={17} />
            New Consultation
          </button>
        )}
      </div>

      {/* ------------------------------------------------ */}
      {/* Search */}
      {/* ------------------------------------------------ */}

      <div
        className="
          bg-white
          border
          border-[#E5E7EB]
          rounded-2xl
          p-4
          flex
          flex-col
          sm:flex-row
          gap-3
        "
      >

        <div className="relative flex-1">

          <Search
            size={17}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-[#9CA3AF]
            "
          />

          <input
            type="text"
            placeholder="Search consultation..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
              w-full
              pl-10
              pr-4
              py-2.5
              rounded-xl
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

        <button
          type="button"
          onClick={loadTelemedicines}
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            px-4
            py-2.5
            rounded-xl
            border
            border-[#E5E7EB]
            text-sm
            font-medium
            text-[#6B7280]
            hover:bg-[#F8FAFC]
            transition
          "
        >
          <RefreshCw size={16} />
          Refresh
        </button>

      </div>

      {/* ------------------------------------------------ */}
      {/* Error */}
      {/* ------------------------------------------------ */}

      {error && (
        <div
          className="
            bg-[#FEF2F2]
            border
            border-[#FECACA]
            text-[#B91C1C]
            px-4
            py-3
            rounded-xl
            text-sm
          "
        >
          {error}
        </div>
      )}

      {/* ------------------------------------------------ */}
      {/* Table */}
      {/* ------------------------------------------------ */}

      <div
        className="
          bg-white
          border
          border-[#E5E7EB]
          rounded-2xl
          overflow-hidden
        "
      >

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px]">

            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB]">

                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#9CA3AF]">
                  Consultation ID
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#9CA3AF]">
                  Member
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#9CA3AF]">
                  Doctor
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#9CA3AF]">
                  Date & Time
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#9CA3AF]">
                  Type
                </th>

                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wide text-[#9CA3AF]">
                  Status
                </th>

                <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wide text-[#9CA3AF]">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-[#E5E7EB]">

              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="
                      px-5
                      py-12
                      text-center
                      text-sm
                      text-[#7A7A7A]
                    "
                  >
                    Loading telemedicine consultations...
                  </td>
                </tr>
              ) : filteredTelemedicines.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="
                      px-5
                      py-12
                      text-center
                      text-sm
                      text-[#7A7A7A]
                    "
                  >
                    No telemedicine consultations found.
                  </td>
                </tr>
              ) : (
                filteredTelemedicines.map(
                  (item) => (
                    <tr
                      key={item.id}
                      className="
                        hover:bg-[#FAFAFA]
                        transition
                      "
                    >

                      {/* ID */}
                      <td className="px-5 py-4">

                        <span className="text-sm font-semibold text-[#212121]">
                          {item.telemedicine_id || "-"}
                        </span>

                      </td>

                      {/* Member */}
                      <td className="px-5 py-4">

                        <div>
                          <p className="text-sm font-semibold text-[#212121]">
                            {item.member_name ||
                              item.member ||
                              "-"}
                          </p>

                          {item.member_id && (
                            <p className="text-xs text-[#9CA3AF] mt-0.5">
                              {item.member_id}
                            </p>
                          )}
                        </div>

                      </td>

                      {/* Doctor */}
                      <td className="px-5 py-4">

                        <div>
                          <p className="text-sm font-semibold text-[#212121]">
                            {item.doctor_name ||
                              item.doctor ||
                              "-"}
                          </p>

                          {item.doctor_id && (
                            <p className="text-xs text-[#9CA3AF] mt-0.5">
                              {item.doctor_id}
                            </p>
                          )}
                        </div>

                      </td>

                      {/* Date */}
                      <td className="px-5 py-4">

                        <p className="text-sm text-[#212121]">
                          {item.consultation_date ||
                            "-"}
                        </p>

                        <p className="text-xs text-[#7A7A7A] mt-0.5">
                          {item.consultation_time ||
                            "-"}
                        </p>

                      </td>

                      {/* Type */}
                      <td className="px-5 py-4">

                        <span className="
                          inline-flex
                          px-2.5
                          py-1
                          rounded-lg
                          bg-[#F8FAFC]
                          border
                          border-[#E5E7EB]
                          text-xs
                          font-semibold
                          text-[#6B7280]
                        ">
                          {getConsultationType(
                            item.consultation_type
                          )}
                        </span>

                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">

                        <span
                          className={`
                            inline-flex
                            px-2.5
                            py-1
                            rounded-lg
                            text-xs
                            font-semibold
                            ${getStatusClass(
                              item.status
                            )}
                          `}
                        >
                          {item.status || "-"}
                        </span>

                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">

                        <div className="flex items-center justify-end gap-2">

                          {/* View */}
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/telemedicine/${item.id}`
                              )
                            }
                            title="View"
                            className="
                              w-9
                              h-9
                              rounded-lg
                              flex
                              items-center
                              justify-center
                              text-[#6B7280]
                              hover:bg-[#EEF4FF]
                              hover:text-[#2F6FED]
                              transition
                            "
                          >
                            <Eye size={16} />
                          </button>

                          {/* Edit */}
                          {hasEditPermission && (
                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/telemedicine/${item.id}/edit`
                                )
                              }
                              title="Edit"
                              className="
                                w-9
                                h-9
                                rounded-lg
                                flex
                                items-center
                                justify-center
                                text-[#6B7280]
                                hover:bg-[#FFF7ED]
                                hover:text-[#EA580C]
                                transition
                              "
                            >
                              <Pencil size={16} />
                            </button>
                          )}

                          {/* Delete */}
                          {hasDeletePermission && (
                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  item.id
                                )
                              }
                              title="Delete"
                              className="
                                w-9
                                h-9
                                rounded-lg
                                flex
                                items-center
                                justify-center
                                text-[#6B7280]
                                hover:bg-[#FEF2F2]
                                hover:text-[#DC2626]
                                transition
                              "
                            >
                              <Trash2 size={16} />
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

      </div>

    </div>
  );
};

export default Telemedicine;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  RefreshCw,
  Eye,
  Pencil,
  Trash2,
  Phone,
  Mail,
  CalendarDays,
  MessageSquare,
  UserRound,
  Building2,
  AlertCircle,
} from "lucide-react";

import api from "../../services/api";

const CRMInteractionList = () => {
  const navigate = useNavigate();

  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const loadInteractions = async () => {
    try {
      setError("");

      const response = await api.get("/crm/");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.results || [];

      setInteractions(data);
    } catch (err) {
      console.error("CRM List Error:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to load CRM interactions."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadInteractions();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadInteractions();
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this CRM interaction?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/crm/${id}/`);

      setInteractions((prev) =>
        prev.filter((item) => item.id !== id)
      );
    } catch (err) {
      console.error("CRM Delete Error:", err);

      alert(
        err.response?.data?.detail ||
          "Failed to delete CRM interaction."
      );
    }
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

  const getTypeIcon = (type) => {
    switch (type) {
      case "CALL":
        return <Phone size={15} />;

      case "EMAIL":
        return <Mail size={15} />;

      case "MEETING":
        return <CalendarDays size={15} />;

      default:
        return <MessageSquare size={15} />;
    }
  };

  const formatType = (value) => {
    if (!value) return "N/A";

    return value
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

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

  const filteredInteractions = interactions.filter(
    (item) => {
      const keyword = search.toLowerCase();

      return (
        item.interaction_id
          ?.toLowerCase()
          .includes(keyword) ||
        item.subject
          ?.toLowerCase()
          .includes(keyword) ||
        item.member_name
          ?.toLowerCase()
          .includes(keyword) ||
        item.member_id
          ?.toLowerCase()
          .includes(keyword) ||
        item.partner_name
          ?.toLowerCase()
          .includes(keyword) ||
        item.organization_name
          ?.toLowerCase()
          .includes(keyword)
      );
    }
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-10 text-center">
          <div className="mx-auto w-10 h-10 border-4 border-[#EEF4FF] border-t-[#2F6FED] rounded-full animate-spin" />

          <p className="mt-4 text-sm text-[#7A7A7A]">
            Loading CRM interactions...
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
          <h1 className="text-xl font-bold text-[#212121]">
            CRM Interactions
          </h1>

          <p className="text-sm text-[#7A7A7A] mt-1">
            Manage member, partner and organization interactions.
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/crm/new")
          }
          className="
            flex
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
            hover:bg-[#255ED0]
            transition
          "
        >
          <Plus size={17} />
          Add Interaction
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl p-4 mb-6">

        <div className="flex flex-col md:flex-row gap-3">

          <div className="relative flex-1">

            <Search
              size={18}
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
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search interaction, member, partner..."
              className="
                w-full
                pl-10
                pr-4
                py-2.5
                rounded-xl
                border
                border-[#E5E7EB]
                text-sm
                outline-none
                focus:border-[#2F6FED]
              "
            />
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="
              flex
              items-center
              justify-center
              gap-2
              px-4
              py-2.5
              rounded-xl
              border
              border-[#E5E7EB]
              text-sm
              font-semibold
              text-[#212121]
              hover:bg-[#F8FAFC]
              transition
            "
          >
            <RefreshCw
              size={16}
              className={
                refreshing
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh
          </button>

        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6 flex items-center gap-3 text-red-600">
          <AlertCircle size={18} />
          <p className="text-sm font-medium">
            {error}
          </p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px]">

            <thead className="bg-[#F8FAFC] border-b border-[#E5E7EB]">

              <tr>

                <th className="text-left px-5 py-4 text-xs font-bold text-[#7A7A7A]">
                  Interaction
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold text-[#7A7A7A]">
                  Member
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold text-[#7A7A7A]">
                  Type
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold text-[#7A7A7A]">
                  Date
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold text-[#7A7A7A]">
                  Priority
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold text-[#7A7A7A]">
                  Status
                </th>

                <th className="text-right px-5 py-4 text-xs font-bold text-[#7A7A7A]">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredInteractions.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-12 text-center"
                  >
                    <MessageSquare
                      size={35}
                      className="mx-auto text-[#CBD5E1]"
                    />

                    <p className="mt-3 text-sm font-semibold text-[#7A7A7A]">
                      No CRM interactions found.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredInteractions.map(
                  (item) => (
                    <tr
                      key={item.id}
                      className="border-b border-[#F1F5F9] hover:bg-[#FAFCFF] transition"
                    >

                      <td className="px-5 py-4">

                        <p className="text-xs font-bold text-[#2F6FED]">
                          {item.interaction_id}
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#212121]">
                          {item.subject}
                        </p>

                      </td>

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <div className="w-8 h-8 rounded-lg bg-[#EEF4FF] flex items-center justify-center text-[#2F6FED]">
                            <UserRound size={15} />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-[#212121]">
                              {item.member_name ||
                                "N/A"}
                            </p>

                            <p className="text-[11px] text-[#7A7A7A]">
                              {item.member_id ||
                                "N/A"}
                            </p>
                          </div>

                        </div>

                      </td>

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2 text-sm text-[#4B5563]">
                          {getTypeIcon(
                            item.interaction_type
                          )}

                          {formatType(
                            item.interaction_type
                          )}
                        </div>

                      </td>

                      <td className="px-5 py-4 text-sm text-[#4B5563]">
                        {formatDate(
                          item.interaction_date
                        )}
                      </td>

                      <td className="px-5 py-4">

                        <span
                          className={`
                            inline-flex
                            px-3
                            py-1.5
                            rounded-lg
                            text-[11px]
                            font-bold
                            ${getPriorityStyle(
                              item.priority
                            )}
                          `}
                        >
                          {formatType(
                            item.priority
                          )}
                        </span>

                      </td>

                      <td className="px-5 py-4">

                        <span
                          className={`
                            inline-flex
                            px-3
                            py-1.5
                            rounded-lg
                            text-[11px]
                            font-bold
                            ${getStatusStyle(
                              item.status
                            )}
                          `}
                        >
                          {formatType(
                            item.status
                          )}
                        </span>

                      </td>

                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() =>
                              navigate(
                                `/crm/${item.id}`
                              )
                            }
                            className="w-9 h-9 rounded-lg bg-[#F8FAFC] text-[#2F6FED] flex items-center justify-center hover:bg-[#EEF4FF]"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            onClick={() =>
                              navigate(
                                `/crm/${item.id}/edit`
                              )
                            }
                            className="w-9 h-9 rounded-lg bg-[#F8FAFC] text-[#7A7A7A] flex items-center justify-center hover:bg-[#F1F5F9]"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            onClick={() =>
                              handleDelete(
                                item.id
                              )
                            }
                            className="w-9 h-9 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>

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

export default CRMInteractionList;
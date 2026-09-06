import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
  FlaskConical,
} from "lucide-react";

import {
  getLabTestBookings,
  deleteLabTestBooking,
} from "../../services/labTestBookingService";

import { useAuth } from "../../context/AuthContext";
import {
  canAdd,
  canEdit,
  canDelete,
} from "../../utils/permission";

const sampleTypeLabels = {
  BLOOD: "Blood",
  URINE: "Urine",
  STOOL: "Stool",
  SWAB: "Swab",
  OTHER: "Other",
};

const statusLabels = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  SAMPLE_COLLECTED: "Sample Collected",
  PROCESSING: "Processing",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const getStatusClass = (status) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-700";
    case "CONFIRMED":
      return "bg-blue-100 text-blue-700";
    case "SAMPLE_COLLECTED":
      return "bg-purple-100 text-purple-700";
    case "PROCESSING":
      return "bg-yellow-100 text-yellow-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    case "PENDING":
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getMemberName = (booking) => {
  return (
    booking.member_name ||
    booking.member?.full_name ||
    booking.member?.name ||
    "-"
  );
};

const getMemberId = (booking) => {
  return (
    booking.member_id ||
    booking.member?.member_id ||
    "-"
  );
};

const getDiagnosticCenterName = (booking) => {
  return (
    booking.diagnostic_center_name ||
    booking.diagnostic_center?.name ||
    booking.diagnostic_center?.center_name ||
    "-"
  );
};

const getBookingId = (booking) => {
  return booking.booking_id || `#${booking.id}`;
};

function LabTestBookingList() {
  const { permissions } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getLabTestBookings();

      const bookingList = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
        ? data.results
        : [];

      setBookings(bookingList);
    } catch (err) {
      console.error("Lab Test Bookings Error:", err);

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Failed to load lab test bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return bookings.filter((booking) => {
      const matchesSearch =
        !search ||
        getBookingId(booking).toLowerCase().includes(search) ||
        getMemberName(booking).toLowerCase().includes(search) ||
        getMemberId(booking).toLowerCase().includes(search) ||
        getDiagnosticCenterName(booking)
          .toLowerCase()
          .includes(search) ||
        String(booking.test_name || "")
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === "ALL" ||
        booking.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: bookings.length,
      pending: bookings.filter(
        (item) => item.status === "PENDING"
      ).length,
      processing: bookings.filter(
        (item) => item.status === "PROCESSING"
      ).length,
      completed: bookings.filter(
        (item) => item.status === "COMPLETED"
      ).length,
    };
  }, [bookings]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lab test booking?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await deleteLabTestBooking(id);

      setBookings((previous) =>
        previous.filter((booking) => booking.id !== id)
      );
    } catch (err) {
      console.error("Delete Lab Test Booking Error:", err);

      alert(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Failed to delete lab test booking."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D9F7E8]">
              <FlaskConical
                size={23}
                className="text-[#2F6FED]"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#212121]">
                Lab Test Bookings
              </h1>

              <p className="text-sm text-[#7A7A7A]">
                Manage diagnostic test bookings
              </p>
            </div>
          </div>
        </div>

        {canAdd(permissions, "lab_tests") && (
          <Link
            to="/lab-test-bookings/add"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2F6FED] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2459C7]"
          >
            <Plus size={18} />
            Add Lab Test Booking
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#7A7A7A]">Total Bookings</p>
          <p className="mt-2 text-2xl font-bold text-[#212121]">
            {stats.total}
          </p>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#7A7A7A]">Pending</p>
          <p className="mt-2 text-2xl font-bold text-yellow-600">
            {stats.pending}
          </p>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#7A7A7A]">Processing</p>
          <p className="mt-2 text-2xl font-bold text-[#2F6FED]">
            {stats.processing}
          </p>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#7A7A7A]">Completed</p>
          <p className="mt-2 text-2xl font-bold text-green-600">
            {stats.completed}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-5 rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search booking ID, member, test or diagnostic center..."
              className="w-full rounded-lg border border-[#E5E7EB] py-2.5 pl-10 pr-4 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#212121] outline-none focus:border-[#2F6FED]"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="SAMPLE_COLLECTED">
              Sample Collected
            </option>
            <option value="PROCESSING">Processing</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <button
            type="button"
            onClick={loadBookings}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-medium text-[#212121] transition hover:bg-[#F2F2F2] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-sm text-[#7A7A7A]">
              Loading lab test bookings...
            </div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
            <FlaskConical
              size={42}
              className="mb-3 text-[#7A7A7A]"
            />

            <h3 className="text-lg font-semibold text-[#212121]">
              No lab test bookings found
            </h3>

            <p className="mt-1 text-sm text-[#7A7A7A]">
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Booking ID
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Member
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Test
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Diagnostic Center
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Date
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Sample
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Price
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E5E7EB]">
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking.id}
                    className="transition hover:bg-[#F9FAFB]"
                  >
                    <td className="px-5 py-4">
                      <span className="font-semibold text-[#2F6FED]">
                        {getBookingId(booking)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-[#212121]">
                          {getMemberName(booking)}
                        </p>

                        <p className="text-xs text-[#7A7A7A]">
                          {getMemberId(booking)}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="text-sm font-medium text-[#212121]">
                        {booking.test_name || "-"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-[#212121]">
                      {getDiagnosticCenterName(booking)}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#212121]">
                      {formatDate(booking.booking_date)}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#212121]">
                      {sampleTypeLabels[booking.sample_type] ||
                        booking.sample_type ||
                        "-"}
                    </td>

                    <td className="px-5 py-4 text-sm font-medium text-[#212121]">
                      {booking.price !== null &&
                      booking.price !== undefined
                        ? `৳${booking.price}`
                        : "-"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusClass(
                          booking.status
                        )}`}
                      >
                        {statusLabels[booking.status] ||
                          booking.status ||
                          "-"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/lab-test-bookings/${booking.id}`}
                          title="View"
                          className="rounded-lg p-2 text-[#2F6FED] transition hover:bg-[#EEF4FF]"
                        >
                          <Eye size={17} />
                        </Link>

                        {canEdit(
                          permissions,
                          "lab_tests"
                        ) && (
                          <Link
                            to={`/lab-test-bookings/${booking.id}/edit`}
                            title="Edit"
                            className="rounded-lg p-2 text-yellow-600 transition hover:bg-yellow-50"
                          >
                            <Pencil size={17} />
                          </Link>
                        )}

                        {canDelete(
                          permissions,
                          "lab_tests"
                        ) && (
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(booking.id)
                            }
                            disabled={
                              deletingId === booking.id
                            }
                            title="Delete"
                            className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2
                              size={17}
                              className={
                                deletingId === booking.id
                                  ? "animate-pulse"
                                  : ""
                              }
                            />
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

      {/* Result count */}
      {!loading && filteredBookings.length > 0 && (
        <div className="mt-3 text-sm text-[#7A7A7A]">
          Showing {filteredBookings.length} of{" "}
          {bookings.length} bookings
        </div>
      )}
    </div>
  );
}

export default LabTestBookingList;
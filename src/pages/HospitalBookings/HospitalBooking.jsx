import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
} from "lucide-react";

import {
  getHospitalBookings,
  deleteHospitalBooking,
} from "../../services/hospitalBookingService";

import { useAuth } from "../../context/AuthContext";
import {
  canAdd,
  canEdit,
  canDelete,
} from "../../utils/permission";

const HospitalBooking = () => {
  const navigate = useNavigate();
  const { permissions } = useAuth();

  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getHospitalBookings();

      if (Array.isArray(data)) {
        setBookings(data);
      } else if (Array.isArray(data?.results)) {
        setBookings(data.results);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error("Hospital Bookings Error:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to load hospital bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleDelete = async (id, bookingId) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${bookingId || "this booking"}?`
    );

    if (!confirmed) return;

    try {
      await deleteHospitalBooking(id);

      setBookings((prev) =>
        prev.filter((booking) => booking.id !== id)
      );
    } catch (err) {
      console.error("Delete Hospital Booking Error:", err);

      alert(
        err.response?.data?.detail ||
          "Failed to delete hospital booking."
      );
    }
  };

  const getMemberName = (booking) => {
    return (
      booking.member_name ||
      booking.member?.full_name ||
      "-"
    );
  };

  const getHospitalName = (booking) => {
    return (
      booking.hospital_name ||
      booking.hospital?.name ||
      "-"
    );
  };

  const filteredBookings = bookings.filter((booking) => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return true;

    return (
      booking.booking_id
        ?.toLowerCase()
        .includes(keyword) ||
      getMemberName(booking)
        .toLowerCase()
        .includes(keyword) ||
      getHospitalName(booking)
        .toLowerCase()
        .includes(keyword) ||
      booking.procedure
        ?.toLowerCase()
        .includes(keyword) ||
      booking.package
        ?.toLowerCase()
        .includes(keyword) ||
      booking.status
        ?.toLowerCase()
        .includes(keyword)
    );
  });

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString();
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

  const getStatusClass = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-green-50 text-[#16A34A]";

      case "COMPLETED":
        return "bg-blue-50 text-[#2F6FED]";

      case "CANCELLED":
        return "bg-red-50 text-[#DC2626]";

      case "PENDING":
      default:
        return "bg-yellow-50 text-[#CA8A04]";
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-[#212121]">
            Hospital Bookings
          </h1>

          <p className="mt-1 text-sm text-[#7A7A7A]">
            Manage hospital booking and admission records
          </p>
        </div>

        {canAdd(
          permissions,
          "hospital_bookings"
        ) && (
          <button
            onClick={() =>
              navigate("/hospital-bookings/add")
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-[#2F6FED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2459C7]"
          >
            <Plus size={18} />
            Add Hospital Booking
          </button>
        )}
      </div>

      {/* Search */}
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
            placeholder="Search booking ID, member, hospital, procedure..."
            className="w-full rounded-lg border border-[#E5E7EB] bg-white py-3 pl-10 pr-4 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED]"
          />
        </div>

        <button
          onClick={loadBookings}
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

      {/* Stats */}
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-4">

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
          <p className="text-sm text-[#7A7A7A]">
            Total Bookings
          </p>

          <p className="mt-2 text-2xl font-bold text-[#212121]">
            {bookings.length}
          </p>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
          <p className="text-sm text-[#7A7A7A]">
            Pending
          </p>

          <p className="mt-2 text-2xl font-bold text-[#CA8A04]">
            {
              bookings.filter(
                (booking) =>
                  booking.status === "PENDING"
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
          <p className="text-sm text-[#7A7A7A]">
            Confirmed
          </p>

          <p className="mt-2 text-2xl font-bold text-[#16A34A]">
            {
              bookings.filter(
                (booking) =>
                  booking.status === "CONFIRMED"
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
          <p className="text-sm text-[#7A7A7A]">
            Completed
          </p>

          <p className="mt-2 text-2xl font-bold text-[#2F6FED]">
            {
              bookings.filter(
                (booking) =>
                  booking.status === "COMPLETED"
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

              Loading hospital bookings...

            </div>

          </div>
        ) : filteredBookings.length === 0 ? (

          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">

            <div className="mb-3 rounded-full bg-[#EEF4FF] p-4">

              <Search
                size={24}
                className="text-[#2F6FED]"
              />

            </div>

            <h3 className="text-base font-semibold text-[#212121]">
              No hospital bookings found
            </h3>

            <p className="mt-1 text-sm text-[#7A7A7A]">
              {search
                ? "Try changing your search keyword."
                : "No hospital bookings have been added yet."}
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1200px]">

              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Booking ID
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Member
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Hospital
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Booking Date
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Admission Date
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Procedure
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

                {filteredBookings.map((booking) => (

                  <tr
                    key={booking.id}
                    className="border-b border-[#EEEEEE] last:border-b-0 hover:bg-[#FAFAFA]"
                  >

                    {/* Booking ID */}
                    <td className="px-5 py-4">

                      <span className="font-medium text-[#2F6FED]">
                        {booking.booking_id || "-"}
                      </span>

                    </td>

                    {/* Member */}
                    <td className="px-5 py-4">

                      <div>
                        <p className="font-semibold text-[#212121]">
                          {getMemberName(booking)}
                        </p>

                        <p className="mt-1 text-xs text-[#7A7A7A]">
                          {booking.member_id ||
                            booking.member?.member_id ||
                            "-"}
                        </p>
                      </div>

                    </td>

                    {/* Hospital */}
                    <td className="px-5 py-4">

                      <span className="text-sm font-medium text-[#212121]">
                        {getHospitalName(booking)}
                      </span>

                    </td>

                    {/* Booking Date */}
                    <td className="px-5 py-4 text-sm text-[#212121]">
                      {formatDate(
                        booking.booking_date
                      )}
                    </td>

                    {/* Admission Date */}
                    <td className="px-5 py-4 text-sm text-[#212121]">
                      {formatDate(
                        booking.admission_date
                      )}
                    </td>

                    {/* Procedure */}
                    <td className="px-5 py-4">

                      <div>
                        <p className="text-sm font-medium text-[#212121]">
                          {booking.procedure || "-"}
                        </p>

                        {booking.package && (
                          <p className="mt-1 text-xs text-[#7A7A7A]">
                            Package: {booking.package}
                          </p>
                        )}
                      </div>

                    </td>

                    {/* Cost */}
                    <td className="px-5 py-4 text-sm font-medium text-[#212121]">
                      {formatCost(
                        booking.estimated_cost
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                          booking.status
                        )}`}
                      >
                        {booking.status
                          ? booking.status
                              .replaceAll("_", " ")
                              .replace(
                                /\b\w/g,
                                (char) =>
                                  char.toUpperCase()
                              )
                          : "Pending"}
                      </span>

                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">

                      <div className="flex items-center justify-end gap-2">

                        {/* View */}
                        <button
                          onClick={() =>
                            navigate(
                              `/hospital-bookings/${booking.id}`
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
                          "hospital_bookings"
                        ) && (
                          <button
                            onClick={() =>
                              navigate(
                                `/hospital-bookings/${booking.id}/edit`
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
                          "hospital_bookings"
                        ) && (
                          <button
                            onClick={() =>
                              handleDelete(
                                booking.id,
                                booking.booking_id
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

export default HospitalBooking;
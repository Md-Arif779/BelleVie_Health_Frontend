
import { useEffect, useState } from "react";
import {
  CalendarDays,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  X,
  Clock,
  UserRound,
  Stethoscope,
} from "lucide-react";

import {
  getAppointments,
  deleteAppointment,
} from "../../services/appointmentService";

import AppointmentForm from "./AppointmentForm";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  // View modal
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  // Create/Edit form
  const [showForm, setShowForm] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);

  // --------------------------------------------------
  // Load appointments
  // --------------------------------------------------
  const loadAppointments = async () => {
    try {
      setLoading(true);

      const data = await getAppointments();

      if (Array.isArray(data)) {
        setAppointments(data);
      } else if (Array.isArray(data?.results)) {
        setAppointments(data.results);
      } else {
        setAppointments([]);
      }
    } catch (error) {
      console.error("Appointments Error:", error);
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  // --------------------------------------------------
  // Search
  // --------------------------------------------------
  const filteredAppointments = appointments.filter((appointment) => {
    const query = search.toLowerCase();

    return (
      appointment.appointment_id?.toLowerCase().includes(query) ||
      appointment.member_name?.toLowerCase().includes(query) ||
      appointment.doctor_name?.toLowerCase().includes(query) ||
      appointment.status?.toLowerCase().includes(query)
    );
  });

  // --------------------------------------------------
  // New Appointment
  // --------------------------------------------------
  const handleNewAppointment = () => {
    setEditingAppointment(null);
    setShowForm(true);
  };

  // --------------------------------------------------
  // Edit Appointment
  // --------------------------------------------------
  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setShowForm(true);
  };

  // --------------------------------------------------
  // Close Form
  // --------------------------------------------------
  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAppointment(null);
  };

  // --------------------------------------------------
  // Form Success
  // --------------------------------------------------
  const handleFormSuccess = async () => {
    setShowForm(false);
    setEditingAppointment(null);

    await loadAppointments();
  };

  // --------------------------------------------------
  // View
  // --------------------------------------------------
  const handleView = (appointment) => {
    setSelectedAppointment(appointment);
    setShowViewModal(true);
  };

  // --------------------------------------------------
  // Delete
  // --------------------------------------------------
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this appointment?"
    );

    if (!confirmed) return;

    try {
      await deleteAppointment(id);
      await loadAppointments();
    } catch (error) {
      console.error("Delete Appointment Error:", error);

      alert(
        error?.response?.data?.detail ||
          "Failed to delete appointment."
      );
    }
  };

  // --------------------------------------------------
  // Status Style
  // --------------------------------------------------
  const getStatusStyle = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-blue-50 text-blue-700";

      case "COMPLETED":
        return "bg-green-50 text-green-700";

      case "CANCELLED":
        return "bg-red-50 text-red-700";

      case "NO_SHOW":
        return "bg-orange-50 text-orange-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // --------------------------------------------------
  // Format Date
  // --------------------------------------------------
  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // --------------------------------------------------
  // Format Time
  // --------------------------------------------------
  const formatTime = (time) => {
    if (!time) return "-";

    const [hours, minutes] = time.split(":");

    const date = new Date();

    date.setHours(Number(hours));
    date.setMinutes(Number(minutes));

    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">

      {/* ==================================================
          HEADER
      ================================================== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
              <CalendarDays
                size={22}
                className="text-[#2F6FED]"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#212121]">
                Appointments
              </h1>

              <p className="text-sm text-[#7A7A7A] mt-1">
                Manage member appointments and schedules
              </p>
            </div>
          </div>
        </div>

        {/* NEW APPOINTMENT BUTTON */}
        <button
          type="button"
          onClick={handleNewAppointment}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2F6FED] text-white text-sm font-semibold hover:bg-[#2459C7] transition"
        >
          <Plus size={17} />
          New Appointment
        </button>
      </div>

      {/* ==================================================
          SEARCH
      ================================================== */}
      <div className="bg-white rounded-2xl border border-[#EEEEEE] shadow-sm p-4">

        <div className="relative max-w-md">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search appointment, member, doctor..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#EEEEEE] text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-[#2F6FED]"
          />

        </div>
      </div>

      {/* ==================================================
          TABLE
      ================================================== */}
      <div className="bg-white rounded-2xl border border-[#EEEEEE] shadow-sm overflow-hidden">

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-4 border-blue-100 border-t-[#2F6FED] rounded-full animate-spin" />
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">

            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <CalendarDays
                size={25}
                className="text-[#2F6FED]"
              />
            </div>

            <h3 className="text-base font-semibold text-[#212121]">
              No appointments found
            </h3>

            <p className="text-sm text-[#7A7A7A] mt-1">
              Try changing your search or create a new appointment.
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full text-sm">

              <thead>
                <tr className="border-b border-[#EEEEEE] bg-gray-50">

                  <th className="text-left px-5 py-4 font-semibold text-[#212121]">
                    Appointment
                  </th>

                  <th className="text-left px-5 py-4 font-semibold text-[#212121]">
                    Member
                  </th>

                  <th className="text-left px-5 py-4 font-semibold text-[#212121]">
                    Doctor
                  </th>

                  <th className="text-left px-5 py-4 font-semibold text-[#212121]">
                    Date & Time
                  </th>

                  <th className="text-left px-5 py-4 font-semibold text-[#212121]">
                    Status
                  </th>

                  <th className="text-right px-5 py-4 font-semibold text-[#212121]">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredAppointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="border-b border-[#EEEEEE] last:border-b-0 hover:bg-gray-50 transition"
                  >

                    {/* Appointment ID */}
                    <td className="px-5 py-4">

                      <div className="font-semibold text-[#212121]">
                        {appointment.appointment_id || "-"}
                      </div>

                      <div className="text-xs text-[#7A7A7A] mt-1">
                        {appointment.appointment_type || "-"}
                      </div>

                    </td>

                    {/* Member */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                          <UserRound
                            size={15}
                            className="text-[#2F6FED]"
                          />
                        </div>

                        <div>
                          <div className="font-medium text-[#212121]">
                            {appointment.member_name || "-"}
                          </div>
                        </div>

                      </div>

                    </td>

                    {/* Doctor */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                          <Stethoscope
                            size={15}
                            className="text-green-600"
                          />
                        </div>

                        <span className="font-medium text-[#212121]">
                          {appointment.doctor_name || "-"}
                        </span>

                      </div>

                    </td>

                    {/* Date / Time */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2 text-[#212121]">

                        <CalendarDays
                          size={15}
                          className="text-[#7A7A7A]"
                        />

                        {formatDate(
                          appointment.appointment_date
                        )}

                      </div>

                      <div className="flex items-center gap-2 text-xs text-[#7A7A7A] mt-1">

                        <Clock size={14} />

                        {formatTime(
                          appointment.appointment_time
                        )}

                      </div>

                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">

                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                          appointment.status
                        )}`}
                      >
                        {appointment.status || "-"}
                      </span>

                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">

                      <div className="flex items-center justify-end gap-2">

                        {/* View */}
                        <button
                          type="button"
                          onClick={() =>
                            handleView(appointment)
                          }
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-[#7A7A7A] hover:text-[#2F6FED] hover:bg-blue-50 transition"
                          title="View"
                        >
                          <Eye size={17} />
                        </button>

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(appointment)
                          }
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-[#7A7A7A] hover:text-blue-600 hover:bg-blue-50 transition"
                          title="Edit"
                        >
                          <Pencil size={17} />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(appointment.id)
                          }
                          className="w-9 h-9 rounded-lg flex items-center justify-center text-[#7A7A7A] hover:text-red-600 hover:bg-red-50 transition"
                          title="Delete"
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* ==================================================
          VIEW APPOINTMENT MODAL
      ================================================== */}
      {showViewModal && selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">

            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#EEEEEE]">

              <div>
                <h2 className="text-lg font-bold text-[#212121]">
                  Appointment Details
                </h2>

                <p className="text-xs text-[#7A7A7A] mt-1">
                  {selectedAppointment.appointment_id || "-"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedAppointment(null);
                }}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-[#7A7A7A] hover:bg-gray-100 transition"
              >
                <X size={19} />
              </button>

            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                {/* Member */}
                <div className="p-4 rounded-xl bg-gray-50">

                  <p className="text-xs text-[#7A7A7A] mb-1">
                    Member
                  </p>

                  <p className="font-semibold text-[#212121]">
                    {selectedAppointment.member_name || "-"}
                  </p>

                </div>

                {/* Doctor */}
                <div className="p-4 rounded-xl bg-gray-50">

                  <p className="text-xs text-[#7A7A7A] mb-1">
                    Doctor
                  </p>

                  <p className="font-semibold text-[#212121]">
                    {selectedAppointment.doctor_name || "-"}
                  </p>

                </div>

                {/* Date */}
                <div className="p-4 rounded-xl bg-gray-50">

                  <p className="text-xs text-[#7A7A7A] mb-1">
                    Date
                  </p>

                  <p className="font-semibold text-[#212121]">
                    {formatDate(
                      selectedAppointment.appointment_date
                    )}
                  </p>

                </div>

                {/* Time */}
                <div className="p-4 rounded-xl bg-gray-50">

                  <p className="text-xs text-[#7A7A7A] mb-1">
                    Time
                  </p>

                  <p className="font-semibold text-[#212121]">
                    {formatTime(
                      selectedAppointment.appointment_time
                    )}
                  </p>

                </div>

                {/* Type */}
                <div className="p-4 rounded-xl bg-gray-50">

                  <p className="text-xs text-[#7A7A7A] mb-1">
                    Appointment Type
                  </p>

                  <p className="font-semibold text-[#212121]">
                    {selectedAppointment.appointment_type || "-"}
                  </p>

                </div>

                {/* Status */}
                <div className="p-4 rounded-xl bg-gray-50">

                  <p className="text-xs text-[#7A7A7A] mb-1">
                    Status
                  </p>

                  <span
                    className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                      selectedAppointment.status
                    )}`}
                  >
                    {selectedAppointment.status || "-"}
                  </span>

                </div>

              </div>

              {/* Reason */}
              <div>

                <p className="text-xs font-medium text-[#7A7A7A] mb-2">
                  Reason
                </p>

                <div className="p-4 rounded-xl bg-gray-50 text-sm text-[#212121]">
                  {selectedAppointment.reason || "-"}
                </div>

              </div>

              {/* Notes */}
              <div>

                <p className="text-xs font-medium text-[#7A7A7A] mb-2">
                  Notes
                </p>

                <div className="p-4 rounded-xl bg-gray-50 text-sm text-[#212121]">
                  {selectedAppointment.notes || "-"}
                </div>

              </div>

            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#EEEEEE]">

              <button
                type="button"
                onClick={() => {
                  setShowViewModal(false);
                  setSelectedAppointment(null);
                }}
                className="px-4 py-2.5 rounded-xl border border-[#EEEEEE] text-sm font-semibold text-[#212121] hover:bg-gray-50 transition"
              >
                Close
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowViewModal(false);
                  handleEdit(selectedAppointment);
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#2F6FED] text-white text-sm font-semibold hover:bg-[#2459C7] transition"
              >
                <Pencil size={16} />
                Edit Appointment
              </button>

            </div>

          </div>

        </div>
      )}

      {/* ==================================================
          CREATE / EDIT APPOINTMENT FORM
      ================================================== */}
      {showForm && (
        <AppointmentForm
          appointment={editingAppointment}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}

    </div>
  );
};

export default Appointments;
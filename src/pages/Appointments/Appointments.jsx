
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

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedAppointment, setSelectedAppointment] =
    useState(null);

  const [showViewModal, setShowViewModal] = useState(false);

  // --------------------------------------------------
  // Load appointments
  // --------------------------------------------------

  const loadAppointments = async () => {
    try {
      setLoading(true);

      const data = await getAppointments();

      setAppointments(
        Array.isArray(data)
          ? data
          : data?.results || []
      );
    } catch (error) {
      console.error(
        "Appointments Error:",
        error
      );
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

  const filteredAppointments =
    appointments.filter((appointment) => {
      const searchText =
        search.toLowerCase();

      return (
        appointment.appointment_id
          ?.toLowerCase()
          .includes(searchText) ||
        appointment.member_name
          ?.toLowerCase()
          .includes(searchText) ||
        appointment.doctor_name
          ?.toLowerCase()
          .includes(searchText) ||
        appointment.status
          ?.toLowerCase()
          .includes(searchText)
      );
    });

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

    if (!confirmed) {
      return;
    }

    try {
      await deleteAppointment(id);

      await loadAppointments();
    } catch (error) {
      console.error(
        "Delete Appointment Error:",
        error
      );

      alert(
        "Failed to delete appointment."
      );
    }
  };

  // --------------------------------------------------
  // Status badge
  // --------------------------------------------------

  const getStatusStyle = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-[#ECFDF5] text-[#059669]";

      case "COMPLETED":
        return "bg-[#EEF4FF] text-[#2F6FED]";

      case "CANCELLED":
        return "bg-[#FEF2F2] text-[#DC2626]";

      case "NO_SHOW":
        return "bg-[#FFF7ED] text-[#EA580C]";

      default:
        return "bg-[#F8FAFC] text-[#6B7280]";
    }
  };

  // --------------------------------------------------
  // Format date
  // --------------------------------------------------

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

  // --------------------------------------------------
  // Format time
  // --------------------------------------------------

  const formatTime = (time) => {
    if (!time) return "-";

    const [hours, minutes] =
      time.split(":");

    const date = new Date();

    date.setHours(
      Number(hours),
      Number(minutes)
    );

    return date.toLocaleTimeString(
      "en-US",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  return (
    <div className="space-y-6">

      {/* ================================================= */}
      {/* Header */}
      {/* ================================================= */}

      <div className="flex items-center justify-between">

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
              <CalendarDays
                size={21}
              />
            </div>

            <div>
              <h1
                className="
                  text-xl
                  font-bold
                  text-[#212121]
                "
              >
                Appointments
              </h1>

              <p
                className="
                  text-sm
                  text-[#7A7A7A]
                  mt-0.5
                "
              >
                Manage member appointments
              </p>
            </div>

          </div>
        </div>

        <button
          type="button"
          className="
            flex
            items-center
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

          New Appointment
        </button>

      </div>


      {/* ================================================= */}
      {/* Search */}
      {/* ================================================= */}

      <div
        className="
          bg-white
          border
          border-[#E5E7EB]
          rounded-2xl
          p-4
        "
      >

        <div className="relative">

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
            placeholder="
              Search appointment, member, doctor...
            "
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
            "
          />

        </div>

      </div>


      {/* ================================================= */}
      {/* Table */}
      {/* ================================================= */}

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

          <table className="w-full">

            <thead>
              <tr
                className="
                  border-b
                  border-[#E5E7EB]
                  bg-[#F8FAFC]
                "
              >

                <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                  Appointment
                </th>

                <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                  Member
                </th>

                <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                  Doctor
                </th>

                <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                  Date & Time
                </th>

                <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                  Type
                </th>

                <th className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                  Status
                </th>

                <th className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                  Actions
                </th>

              </tr>
            </thead>


            <tbody>

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
                    Loading appointments...
                  </td>
                </tr>

              ) : filteredAppointments.length === 0 ? (

                <tr>
                  <td
                    colSpan="7"
                    className="
                      px-5
                      py-12
                      text-center
                    "
                  >

                    <CalendarDays
                      size={35}
                      className="
                        mx-auto
                        text-[#D1D5DB]
                        mb-3
                      "
                    />

                    <p
                      className="
                        text-sm
                        font-semibold
                        text-[#6B7280]
                      "
                    >
                      No appointments found
                    </p>

                  </td>
                </tr>

              ) : (

                filteredAppointments.map(
                  (appointment) => (

                    <tr
                      key={appointment.id}
                      className="
                        border-b
                        border-[#F0F1F3]
                        hover:bg-[#FAFBFC]
                        transition
                      "
                    >

                      {/* Appointment */}

                      <td className="px-5 py-4">

                        <p
                          className="
                            text-sm
                            font-bold
                            text-[#212121]
                          "
                        >
                          {appointment.appointment_id ||
                            `#${appointment.id}`}
                        </p>

                        <p
                          className="
                            text-xs
                            text-[#9CA3AF]
                            mt-1
                          "
                        >
                          {appointment.reason ||
                            "General appointment"}
                        </p>

                      </td>


                      {/* Member */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2.5">

                          <div
                            className="
                              w-8
                              h-8
                              rounded-lg
                              bg-[#D9F7E8]
                              text-[#2F6FED]
                              flex
                              items-center
                              justify-center
                            "
                          >
                            <UserRound
                              size={15}
                            />
                          </div>

                          <div>

                            <p
                              className="
                                text-sm
                                font-semibold
                                text-[#212121]
                              "
                            >
                              {appointment.member_name ||
                                appointment.member?.full_name ||
                                "-"}
                            </p>

                            {appointment.member_id && (
                              <p
                                className="
                                  text-[11px]
                                  text-[#9CA3AF]
                                "
                              >
                                {appointment.member_id}
                              </p>
                            )}

                          </div>

                        </div>

                      </td>


                      {/* Doctor */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2.5">

                          <div
                            className="
                              w-8
                              h-8
                              rounded-lg
                              bg-[#EEF4FF]
                              text-[#2F6FED]
                              flex
                              items-center
                              justify-center
                            "
                          >
                            <Stethoscope
                              size={15}
                            />
                          </div>

                          <p
                            className="
                              text-sm
                              font-semibold
                              text-[#212121]
                            "
                          >
                            {appointment.doctor_name ||
                              appointment.doctor?.full_name ||
                              "-"}
                          </p>

                        </div>

                      </td>


                      {/* Date */}

                      <td className="px-5 py-4">

                        <div>

                          <p
                            className="
                              text-sm
                              font-semibold
                              text-[#212121]
                            "
                          >
                            {formatDate(
                              appointment.appointment_date
                            )}
                          </p>

                          <div
                            className="
                              flex
                              items-center
                              gap-1
                              mt-1
                              text-xs
                              text-[#7A7A7A]
                            "
                          >
                            <Clock size={12} />

                            {formatTime(
                              appointment.appointment_time
                            )}
                          </div>

                        </div>

                      </td>


                      {/* Type */}

                      <td className="px-5 py-4">

                        <span
                          className="
                            inline-flex
                            px-2.5
                            py-1
                            rounded-lg
                            bg-[#F8FAFC]
                            text-[#6B7280]
                            text-xs
                            font-semibold
                          "
                        >
                          {appointment.appointment_type ===
                          "TELEMEDICINE"
                            ? "Telemedicine"
                            : "In Person"}
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
                            ${getStatusStyle(
                              appointment.status
                            )}
                          `}
                        >
                          {appointment.status ||
                            "PENDING"}
                        </span>

                      </td>


                      {/* Actions */}

                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-1">

                          {/* View */}

                          <button
                            type="button"
                            onClick={() =>
                              handleView(
                                appointment
                              )
                            }
                            className="
                              w-8
                              h-8
                              rounded-lg
                              flex
                              items-center
                              justify-center
                              text-[#7A7A7A]
                              hover:bg-[#EEF4FF]
                              hover:text-[#2F6FED]
                              transition
                            "
                            title="View"
                          >
                            <Eye size={16} />
                          </button>


                          {/* Edit */}

                          <button
                            type="button"
                            className="
                              w-8
                              h-8
                              rounded-lg
                              flex
                              items-center
                              justify-center
                              text-[#7A7A7A]
                              hover:bg-[#F8FAFC]
                              hover:text-[#212121]
                              transition
                            "
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>


                          {/* Delete */}

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                appointment.id
                              )
                            }
                            className="
                              w-8
                              h-8
                              rounded-lg
                              flex
                              items-center
                              justify-center
                              text-[#9CA3AF]
                              hover:bg-[#FEF2F2]
                              hover:text-[#DC2626]
                              transition
                            "
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


      {/* ================================================= */}
      {/* View Modal */}
      {/* ================================================= */}

      {showViewModal &&
        selectedAppointment && (

          <div
            className="
              fixed
              inset-0
              z-50
              bg-black/40
              flex
              items-center
              justify-center
              p-4
            "
          >

            <div
              className="
                w-full
                max-w-2xl
                bg-white
                rounded-2xl
                shadow-xl
                overflow-hidden
              "
            >

              {/* Modal Header */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  px-6
                  py-5
                  border-b
                  border-[#E5E7EB]
                "
              >

                <div>

                  <h2
                    className="
                      text-lg
                      font-bold
                      text-[#212121]
                    "
                  >
                    Appointment Details
                  </h2>

                  <p
                    className="
                      text-xs
                      text-[#9CA3AF]
                      mt-1
                    "
                  >
                    {selectedAppointment.appointment_id ||
                      `Appointment #${selectedAppointment.id}`}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowViewModal(false)
                  }
                  className="
                    w-9
                    h-9
                    rounded-lg
                    flex
                    items-center
                    justify-center
                    text-[#7A7A7A]
                    hover:bg-[#F8FAFC]
                  "
                >
                  <X size={18} />
                </button>

              </div>


              {/* Modal Body */}

              <div className="p-6 space-y-5">

                <div className="grid grid-cols-2 gap-4">

                  <div
                    className="
                      p-4
                      rounded-xl
                      bg-[#F8FAFC]
                    "
                  >
                    <p className="text-xs text-[#9CA3AF]">
                      Member
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#212121]">
                      {selectedAppointment.member_name ||
                        selectedAppointment.member?.full_name ||
                        "-"}
                    </p>
                  </div>


                  <div
                    className="
                      p-4
                      rounded-xl
                      bg-[#F8FAFC]
                    "
                  >
                    <p className="text-xs text-[#9CA3AF]">
                      Doctor
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#212121]">
                      {selectedAppointment.doctor_name ||
                        selectedAppointment.doctor?.full_name ||
                        "-"}
                    </p>
                  </div>


                  <div
                    className="
                      p-4
                      rounded-xl
                      bg-[#F8FAFC]
                    "
                  >
                    <p className="text-xs text-[#9CA3AF]">
                      Date
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#212121]">
                      {formatDate(
                        selectedAppointment.appointment_date
                      )}
                    </p>
                  </div>


                  <div
                    className="
                      p-4
                      rounded-xl
                      bg-[#F8FAFC]
                    "
                  >
                    <p className="text-xs text-[#9CA3AF]">
                      Time
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#212121]">
                      {formatTime(
                        selectedAppointment.appointment_time
                      )}
                    </p>
                  </div>


                  <div
                    className="
                      p-4
                      rounded-xl
                      bg-[#F8FAFC]
                    "
                  >
                    <p className="text-xs text-[#9CA3AF]">
                      Appointment Type
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#212121]">
                      {selectedAppointment.appointment_type ===
                      "TELEMEDICINE"
                        ? "Telemedicine"
                        : "In Person"}
                    </p>
                  </div>


                  <div
                    className="
                      p-4
                      rounded-xl
                      bg-[#F8FAFC]
                    "
                  >
                    <p className="text-xs text-[#9CA3AF]">
                      Status
                    </p>

                    <span
                      className={`
                        inline-flex
                        mt-1
                        px-2.5
                        py-1
                        rounded-lg
                        text-xs
                        font-semibold
                        ${getStatusStyle(
                          selectedAppointment.status
                        )}
                      `}
                    >
                      {selectedAppointment.status ||
                        "PENDING"}
                    </span>
                  </div>

                </div>


                {/* Reason */}

                <div>

                  <p
                    className="
                      text-xs
                      font-semibold
                      text-[#9CA3AF]
                      mb-2
                    "
                  >
                    Reason
                  </p>

                  <div
                    className="
                      p-4
                      rounded-xl
                      border
                      border-[#E5E7EB]
                      text-sm
                      text-[#6B7280]
                    "
                  >
                    {selectedAppointment.reason ||
                      "No reason provided."}
                  </div>

                </div>


                {/* Notes */}

                <div>

                  <p
                    className="
                      text-xs
                      font-semibold
                      text-[#9CA3AF]
                      mb-2
                    "
                  >
                    Notes
                  </p>

                  <div
                    className="
                      p-4
                      rounded-xl
                      border
                      border-[#E5E7EB]
                      text-sm
                      text-[#6B7280]
                    "
                  >
                    {selectedAppointment.notes ||
                      "No notes available."}
                  </div>

                </div>

              </div>

            </div>

          </div>

        )}

    </div>
  );
};

export default Appointments;


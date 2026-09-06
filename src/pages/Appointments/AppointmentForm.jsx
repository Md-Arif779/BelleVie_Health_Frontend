import { useEffect, useState } from "react";
import { X, CalendarDays } from "lucide-react";

import {
  createAppointment,
  updateAppointment,
} from "../../services/appointmentService";

import { getMembers } from "../../services/memberService";
import { getDoctors } from "../../services/doctorService";

const AppointmentForm = ({
  appointment,
  onClose,
  onSuccess,
}) => {
  const isEdit = Boolean(appointment);

  const [members, setMembers] = useState([]);
  const [doctors, setDoctors] = useState([]);

  const [loadingOptions, setLoadingOptions] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    member: "",
    doctor: "",
    appointment_date: "",
    appointment_time: "",
    appointment_type: "IN_PERSON",
    reason: "",
    status: "PENDING",
    notes: "",
  });

  // =====================================================
  // LOAD MEMBERS + DOCTORS
  // =====================================================

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoadingOptions(true);

        const [membersData, doctorsData] =
          await Promise.all([
            getMembers(),
            getDoctors(),
          ]);

        setMembers(
          Array.isArray(membersData)
            ? membersData
            : membersData.results || []
        );

        setDoctors(
          Array.isArray(doctorsData)
            ? doctorsData
            : doctorsData.results || []
        );
      } catch (error) {
        console.error(
          "Appointment Options Error:",
          error
        );
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  // =====================================================
  // EDIT DATA
  // =====================================================

  useEffect(() => {
    if (appointment) {
      setFormData({
        member: appointment.member || "",
        doctor: appointment.doctor || "",
        appointment_date:
          appointment.appointment_date || "",
        appointment_time:
          appointment.appointment_time || "",
        appointment_type:
          appointment.appointment_type ||
          "IN_PERSON",
        reason: appointment.reason || "",
        status:
          appointment.status || "PENDING",
        notes: appointment.notes || "",
      });
    }
  }, [appointment]);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.member) {
      alert("Please select a member.");
      return;
    }

    if (!formData.doctor) {
      alert("Please select a doctor.");
      return;
    }

    if (!formData.appointment_date) {
      alert("Please select appointment date.");
      return;
    }

    if (!formData.appointment_time) {
      alert("Please select appointment time.");
      return;
    }

    try {
      setSaving(true);

      if (isEdit) {
        await updateAppointment(
          appointment.id,
          formData
        );
      } else {
        await createAppointment(formData);
      }

      onSuccess();
    } catch (error) {
      console.error(
        "Appointment Save Error:",
        error
      );

      console.error(
        "Backend Response:",
        error?.response?.data
      );

      alert(
        error?.response?.data?.detail ||
          "Failed to save appointment."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
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
          max-h-[90vh]
          overflow-y-auto
          bg-white
          rounded-2xl
          shadow-xl
        "
      >

        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div
          className="
            sticky
            top-0
            z-10
            bg-white
            flex
            items-center
            justify-between
            px-6
            py-5
            border-b
            border-[#E5E7EB]
          "
        >

          <div className="flex items-center gap-3">

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-[#EEF4FF]
                text-[#2F6FED]
                flex
                items-center
                justify-center
              "
            >
              <CalendarDays size={19} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#212121]">
                {isEdit
                  ? "Edit Appointment"
                  : "Add Appointment"}
              </h2>

              <p className="text-xs text-[#7A7A7A] mt-0.5">
                {isEdit
                  ? "Update appointment information"
                  : "Create a new member appointment"}
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              p-2
              rounded-lg
              text-[#7A7A7A]
              hover:bg-[#F3F4F6]
              hover:text-[#212121]
            "
          >
            <X size={19} />
          </button>

        </div>

        {/* ================================================= */}
        {/* FORM */}
        {/* ================================================= */}

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-5"
        >

          {/* Member + Doctor */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Member */}

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-2">
                Member *
              </label>

              <select
                name="member"
                value={formData.member}
                onChange={handleChange}
                disabled={loadingOptions}
                className="
                  w-full
                  h-11
                  px-3
                  rounded-xl
                  border
                  border-[#E5E7EB]
                  bg-white
                  text-sm
                  text-[#212121]
                  outline-none
                  focus:border-[#2F6FED]
                "
              >
                <option value="">
                  {loadingOptions
                    ? "Loading members..."
                    : "Select Member"}
                </option>

                {members.map((member) => (
                  <option
                    key={member.id}
                    value={member.id}
                  >
                    {member.member_id
                      ? `${member.member_id} - `
                      : ""}
                    {member.full_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Doctor */}

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-2">
                Doctor *
              </label>

              <select
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                disabled={loadingOptions}
                className="
                  w-full
                  h-11
                  px-3
                  rounded-xl
                  border
                  border-[#E5E7EB]
                  bg-white
                  text-sm
                  text-[#212121]
                  outline-none
                  focus:border-[#2F6FED]
                "
              >
                <option value="">
                  {loadingOptions
                    ? "Loading doctors..."
                    : "Select Doctor"}
                </option>

                {doctors.map((doctor) => (
                  <option
                    key={doctor.id}
                    value={doctor.id}
                  >
                    {doctor.doctor_id
                      ? `${doctor.doctor_id} - `
                      : ""}
                    {doctor.full_name}
                    {doctor.specialty
                      ? ` (${doctor.specialty})`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Date + Time */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Date */}

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-2">
                Appointment Date *
              </label>

              <input
                type="date"
                name="appointment_date"
                value={formData.appointment_date}
                onChange={handleChange}
                className="
                  w-full
                  h-11
                  px-3
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

            {/* Time */}

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-2">
                Appointment Time *
              </label>

              <input
                type="time"
                name="appointment_time"
                value={formData.appointment_time}
                onChange={handleChange}
                className="
                  w-full
                  h-11
                  px-3
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

          {/* Type + Status */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Appointment Type */}

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-2">
                Appointment Type
              </label>

              <select
                name="appointment_type"
                value={formData.appointment_type}
                onChange={handleChange}
                className="
                  w-full
                  h-11
                  px-3
                  rounded-xl
                  border
                  border-[#E5E7EB]
                  bg-white
                  text-sm
                  outline-none
                  focus:border-[#2F6FED]
                "
              >
                <option value="IN_PERSON">
                  In Person
                </option>

                <option value="TELEMEDICINE">
                  Telemedicine
                </option>
              </select>
            </div>

            {/* Status */}

            <div>
              <label className="block text-xs font-semibold text-[#374151] mb-2">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="
                  w-full
                  h-11
                  px-3
                  rounded-xl
                  border
                  border-[#E5E7EB]
                  bg-white
                  text-sm
                  outline-none
                  focus:border-[#2F6FED]
                "
              >
                <option value="PENDING">
                  Pending
                </option>

                <option value="CONFIRMED">
                  Confirmed
                </option>

                <option value="COMPLETED">
                  Completed
                </option>

                <option value="CANCELLED">
                  Cancelled
                </option>

                <option value="NO_SHOW">
                  No Show
                </option>
              </select>
            </div>

          </div>

          {/* Reason */}

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-2">
              Reason
            </label>

            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows={3}
              placeholder="Enter appointment reason..."
              className="
                w-full
                px-3
                py-3
                rounded-xl
                border
                border-[#E5E7EB]
                text-sm
                text-[#212121]
                outline-none
                resize-none
                focus:border-[#2F6FED]
              "
            />
          </div>

          {/* Notes */}

          <div>
            <label className="block text-xs font-semibold text-[#374151] mb-2">
              Notes
            </label>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Additional notes..."
              className="
                w-full
                px-3
                py-3
                rounded-xl
                border
                border-[#E5E7EB]
                text-sm
                text-[#212121]
                outline-none
                resize-none
                focus:border-[#2F6FED]
              "
            />
          </div>

          {/* ================================================= */}
          {/* ACTIONS */}
          {/* ================================================= */}

          <div
            className="
              flex
              items-center
              justify-end
              gap-3
              pt-3
              border-t
              border-[#E5E7EB]
            "
          >

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="
                px-5
                py-2.5
                rounded-xl
                border
                border-[#E5E7EB]
                text-sm
                font-semibold
                text-[#6B7280]
                hover:bg-[#F8FAFC]
              "
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving || loadingOptions}
              className="
                px-5
                py-2.5
                rounded-xl
                bg-[#2F6FED]
                text-white
                text-sm
                font-semibold
                hover:bg-[#255ED0]
                disabled:opacity-60
                disabled:cursor-not-allowed
                transition
              "
            >
              {saving
                ? "Saving..."
                : isEdit
                ? "Update Appointment"
                : "Create Appointment"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
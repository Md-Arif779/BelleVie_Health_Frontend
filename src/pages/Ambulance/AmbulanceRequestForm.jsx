import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Ambulance,
  ArrowLeft,
  Save,
  UserRound,
  Phone,
  MapPin,
  Car,
  UserCog,
  FileText,
  AlertTriangle,
} from "lucide-react";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import {
  canAdd,
  canEdit,
  canView,
} from "../../utils/permission";

const initialFormData = {
  member: "",
  patient_name: "",
  patient_phone: "",
  pickup_location: "",
  destination: "",
  ambulance_number: "",
  driver_name: "",
  driver_phone: "",
  status: "REQUESTED",
  emergency_note: "",
  notes: "",
};

function AmbulanceRequestForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const { permissions, loading } = useAuth();

  const [formData, setFormData] = useState(initialFormData);
  const [members, setMembers] = useState([]);

  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loadingRequest, setLoadingRequest] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

  useEffect(() => {
    if (loading || !canViewAmbulance) {
      return;
    }

    fetchMembers();

    if (isEditMode) {
      fetchRequest();
    }
  }, [loading, canViewAmbulance, id]);

  const fetchMembers = async () => {
    try {
      setLoadingMembers(true);
      setError("");

      const response = await api.get("/members/");

      const data = response.data;

      if (Array.isArray(data)) {
        setMembers(data);
      } else {
        setMembers(data?.results || []);
      }
    } catch (err) {
      console.error("Members loading error:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to load members."
      );
    } finally {
      setLoadingMembers(false);
    }
  };

  const fetchRequest = async () => {
    try {
      setLoadingRequest(true);
      setError("");

      const response = await api.get(
        `/ambulance/requests/${id}/`
      );

      const data = response.data;

      setFormData({
        member: data.member ?? "",
        patient_name: data.patient_name ?? "",
        patient_phone: data.patient_phone ?? "",
        pickup_location: data.pickup_location ?? "",
        destination: data.destination ?? "",
        ambulance_number: data.ambulance_number ?? "",
        driver_name: data.driver_name ?? "",
        driver_phone: data.driver_phone ?? "",
        status: data.status ?? "REQUESTED",
        emergency_note: data.emergency_note ?? "",
        notes: data.notes ?? "",
      });
    } catch (err) {
      console.error("Ambulance request loading error:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to load ambulance request."
      );
    } finally {
      setLoadingRequest(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleMemberChange = (event) => {
    const memberId = event.target.value;

    setFormData((previous) => ({
      ...previous,
      member: memberId,
    }));

    if (!memberId) {
      return;
    }

    const selectedMember = members.find(
      (member) => String(member.id) === String(memberId)
    );

    if (!selectedMember) {
      return;
    }

    setFormData((previous) => ({
      ...previous,
      member: memberId,
      patient_name:
        selectedMember.full_name ||
        previous.patient_name ||
        "",
      patient_phone:
        selectedMember.phone ||
        previous.patient_phone ||
        "",
    }));
  };

  const validateForm = () => {
    if (!formData.member) {
      return "Please select a member.";
    }

    if (!formData.patient_name.trim()) {
      return "Patient name is required.";
    }

    if (!formData.patient_phone.trim()) {
      return "Patient phone is required.";
    }

    if (!formData.pickup_location.trim()) {
      return "Pickup location is required.";
    }

    if (!formData.destination.trim()) {
      return "Destination is required.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);

      const payload = {
        member: Number(formData.member),
        patient_name: formData.patient_name.trim(),
        patient_phone: formData.patient_phone.trim(),
        pickup_location: formData.pickup_location.trim(),
        destination: formData.destination.trim(),
        ambulance_number:
          formData.ambulance_number.trim() || null,
        driver_name:
          formData.driver_name.trim() || null,
        driver_phone:
          formData.driver_phone.trim() || null,
        status: formData.status,
        emergency_note:
          formData.emergency_note.trim() || null,
        notes: formData.notes.trim() || null,
      };

      if (isEditMode) {
        if (!canEditAmbulance) {
          setError(
            "You do not have permission to edit ambulance requests."
          );
          return;
        }

        await api.put(
          `/ambulance/requests/${id}/`,
          payload
        );

        setSuccess(
          "Ambulance request updated successfully."
        );
      } else {
        if (!canAddAmbulance) {
          setError(
            "You do not have permission to create ambulance requests."
          );
          return;
        }

        const response = await api.post(
          "/ambulance/requests/",
          payload
        );

        setSuccess(
          `Ambulance request ${
            response.data?.request_id || ""
          } created successfully.`
        );

        setFormData(initialFormData);
      }

      setTimeout(() => {
        navigate("/ambulance-requests");
      }, 1000);
    } catch (err) {
      console.error(
        "Ambulance request save error:",
        err
      );

      const responseData = err.response?.data;

      if (typeof responseData === "object") {
        const messages = Object.entries(responseData)
          .map(([field, value]) => {
            const message = Array.isArray(value)
              ? value.join(", ")
              : String(value);

            return `${field}: ${message}`;
          })
          .join(" | ");

        setError(
          messages || "Failed to save ambulance request."
        );
      } else {
        setError(
          responseData ||
            "Failed to save ambulance request."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-[#7A7A7A]">
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
            You do not have permission to access ambulance
            requests.
          </p>
        </div>
      </div>
    );
  }

  if (
    !isEditMode &&
    !canAddAmbulance
  ) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="bg-white border border-red-100 rounded-xl p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-[#212121]">
            Access Denied
          </h2>

          <p className="text-[#7A7A7A] mt-2">
            You do not have permission to create ambulance
            requests.
          </p>
        </div>
      </div>
    );
  }

  if (
    isEditMode &&
    !canEditAmbulance
  ) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="bg-white border border-red-100 rounded-xl p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-[#212121]">
            Access Denied
          </h2>

          <p className="text-[#7A7A7A] mt-2">
            You do not have permission to edit ambulance
            requests.
          </p>
        </div>
      </div>
    );
  }

  if (loadingRequest) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-[#7A7A7A]">
          Loading ambulance request...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={() =>
            navigate("/ambulance-requests")
          }
          className="w-10 h-10 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center text-[#7A7A7A] hover:text-[#2F6FED] transition"
        >
          <ArrowLeft size={19} />
        </button>

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
                {isEditMode
                  ? "Edit Ambulance Request"
                  : "New Ambulance Request"}
              </h1>

              <p className="text-sm text-[#7A7A7A]">
                {isEditMode
                  ? "Update ambulance request information"
                  : "Create a new ambulance emergency request"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="mb-5 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Patient Information */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                <UserRound
                  size={19}
                  className="text-[#2F6FED]"
                />
              </div>

              <div>
                <h2 className="font-semibold text-[#212121]">
                  Patient Information
                </h2>

                <p className="text-xs text-[#7A7A7A]">
                  Select the BelleVie member and patient details
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Member */}
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-2">
                  Member <span className="text-red-500">*</span>
                </label>

                <select
                  name="member"
                  value={formData.member}
                  onChange={handleMemberChange}
                  disabled={loadingMembers}
                  className="w-full h-11 px-3 rounded-lg border border-[#E5E7EB] bg-white outline-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
                >
                  <option value="">
                    {loadingMembers
                      ? "Loading members..."
                      : "Select member"}
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

              {/* Patient Name */}
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-2">
                  Patient Name{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="patient_name"
                  value={formData.patient_name}
                  onChange={handleChange}
                  placeholder="Enter patient name"
                  className="w-full h-11 px-3 rounded-lg border border-[#E5E7EB] outline-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
                />
              </div>

              {/* Patient Phone */}
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-2">
                  Patient Phone{" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <Phone
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]"
                  />

                  <input
                    type="text"
                    name="patient_phone"
                    value={formData.patient_phone}
                    onChange={handleChange}
                    placeholder="01XXXXXXXXX"
                    className="w-full h-11 pl-10 pr-3 rounded-lg border border-[#E5E7EB] outline-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-2">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full h-11 px-3 rounded-lg border border-[#E5E7EB] bg-white outline-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
                >
                  <option value="REQUESTED">
                    Requested
                  </option>

                  <option value="ASSIGNED">
                    Assigned
                  </option>

                  <option value="ON_THE_WAY">
                    On The Way
                  </option>

                  <option value="PICKED_UP">
                    Picked Up
                  </option>

                  <option value="COMPLETED">
                    Completed
                  </option>

                  <option value="CANCELLED">
                    Cancelled
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
                <MapPin
                  size={19}
                  className="text-green-600"
                />
              </div>

              <div>
                <h2 className="font-semibold text-[#212121]">
                  Journey Information
                </h2>

                <p className="text-xs text-[#7A7A7A]">
                  Pickup and destination details
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Pickup */}
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-2">
                  Pickup Location{" "}
                  <span className="text-red-500">*</span>
                </label>

                <textarea
                  name="pickup_location"
                  value={formData.pickup_location}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter pickup location"
                  className="w-full px-3 py-3 rounded-lg border border-[#E5E7EB] outline-none resize-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
                />
              </div>

              {/* Destination */}
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-2">
                  Destination{" "}
                  <span className="text-red-500">*</span>
                </label>

                <textarea
                  name="destination"
                  value={formData.destination}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Enter destination"
                  className="w-full px-3 py-3 rounded-lg border border-[#E5E7EB] outline-none resize-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
                />
              </div>
            </div>
          </div>

          {/* Ambulance & Driver */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
                <Car
                  size={19}
                  className="text-purple-600"
                />
              </div>

              <div>
                <h2 className="font-semibold text-[#212121]">
                  Ambulance & Driver
                </h2>

                <p className="text-xs text-[#7A7A7A]">
                  Ambulance and assigned driver information
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Ambulance Number */}
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-2">
                  Ambulance Number
                </label>

                <div className="relative">
                  <Car
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]"
                  />

                  <input
                    type="text"
                    name="ambulance_number"
                    value={formData.ambulance_number}
                    onChange={handleChange}
                    placeholder="e.g. DHAKA-METRO-1234"
                    className="w-full h-11 pl-10 pr-3 rounded-lg border border-[#E5E7EB] outline-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
                  />
                </div>
              </div>

              {/* Driver Name */}
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-2">
                  Driver Name
                </label>

                <div className="relative">
                  <UserCog
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]"
                  />

                  <input
                    type="text"
                    name="driver_name"
                    value={formData.driver_name}
                    onChange={handleChange}
                    placeholder="Enter driver name"
                    className="w-full h-11 pl-10 pr-3 rounded-lg border border-[#E5E7EB] outline-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
                  />
                </div>
              </div>

              {/* Driver Phone */}
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-2">
                  Driver Phone
                </label>

                <div className="relative">
                  <Phone
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]"
                  />

                  <input
                    type="text"
                    name="driver_phone"
                    value={formData.driver_phone}
                    onChange={handleChange}
                    placeholder="01XXXXXXXXX"
                    className="w-full h-11 pl-10 pr-3 rounded-lg border border-[#E5E7EB] outline-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Emergency & Notes */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
                <AlertTriangle
                  size={19}
                  className="text-red-600"
                />
              </div>

              <div>
                <h2 className="font-semibold text-[#212121]">
                  Emergency Information
                </h2>

                <p className="text-xs text-[#7A7A7A]">
                  Additional emergency information and notes
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {/* Emergency Note */}
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-2">
                  Emergency Note
                </label>

                <textarea
                  name="emergency_note"
                  value={formData.emergency_note}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe emergency condition or special instructions..."
                  className="w-full px-3 py-3 rounded-lg border border-[#E5E7EB] outline-none resize-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-2">
                  Notes
                </label>

                <div className="relative">
                  <FileText
                    size={17}
                    className="absolute left-3 top-3 text-[#7A7A7A]"
                  />

                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Additional notes..."
                    className="w-full pl-10 pr-3 py-3 rounded-lg border border-[#E5E7EB] outline-none resize-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              type="button"
              onClick={() =>
                navigate("/ambulance-requests")
              }
              className="px-5 py-3 rounded-xl border border-[#E5E7EB] bg-white text-[#212121] font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl bg-[#2F6FED] text-white font-medium hover:bg-[#2459C7] transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Save size={18} />

              {saving
                ? "Saving..."
                : isEditMode
                ? "Update Request"
                : "Create Request"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default AmbulanceRequestForm;
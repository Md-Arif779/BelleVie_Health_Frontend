import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Plane,
  User,
  MapPin,
  Building2,
  Stethoscope,
  DollarSign,
  FileText,
  Languages,
} from "lucide-react";

import api from "../../services/api";

const MedicalTourismRequestForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const [formData, setFormData] = useState({
    member: "",
    destination_country: "",
    international_hospital: "",
    treatment_name: "",
    quotation_amount: "",
    visa_status: "",
    accommodation_details: "",
    translator_required: false,
    translator_details: "",
    travel_status: "",
    status: "REQUESTED",
    notes: "",
  });

  // =====================================================
  // Load Members
  // =====================================================

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await api.get("/members/");

        const data = response.data;

        if (Array.isArray(data)) {
          setMembers(data);
        } else if (Array.isArray(data.results)) {
          setMembers(data.results);
        } else {
          setMembers([]);
        }
      } catch (error) {
        console.error("Members Error:", error);
      }
    };

    fetchMembers();
  }, []);

  // =====================================================
  // Load Existing Request
  // =====================================================

  useEffect(() => {
    if (!isEditMode) return;

    const fetchRequest = async () => {
      setLoadingData(true);

      try {
        const response = await api.get(
          `/medical-tourism/requests/${id}/`
        );

        const data = response.data;

        setFormData({
          member: data.member || "",
          destination_country:
            data.destination_country || "",
          international_hospital:
            data.international_hospital || "",
          treatment_name:
            data.treatment_name || "",
          quotation_amount:
            data.quotation_amount || "",
          visa_status:
            data.visa_status || "",
          accommodation_details:
            data.accommodation_details || "",
          translator_required:
            data.translator_required || false,
          translator_details:
            data.translator_details || "",
          travel_status:
            data.travel_status || "",
          status:
            data.status || "REQUESTED",
          notes:
            data.notes || "",
        });
      } catch (error) {
        console.error(
          "Medical Tourism Request Error:",
          error
        );
      } finally {
        setLoadingData(false);
      }
    };

    fetchRequest();
  }, [id, isEditMode]);

  // =====================================================
  // Handle Change
  // =====================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =====================================================
  // Submit
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const payload = {
        member: Number(formData.member),
        destination_country:
          formData.destination_country,
        international_hospital:
          formData.international_hospital,
        treatment_name:
          formData.treatment_name,
        quotation_amount:
          formData.quotation_amount || null,
        visa_status:
          formData.visa_status || null,
        accommodation_details:
          formData.accommodation_details || null,
        translator_required:
          formData.translator_required,
        translator_details:
          formData.translator_required
            ? formData.translator_details || null
            : null,
        travel_status:
          formData.travel_status || null,
        status: formData.status,
        notes: formData.notes || null,
      };

      if (isEditMode) {
        await api.put(
          `/medical-tourism/requests/${id}/`,
          payload
        );
      } else {
        await api.post(
          "/medical-tourism/requests/",
          payload
        );
      }

      navigate("/medical-tourism");
    } catch (error) {
      console.error(
        "Medical Tourism Save Error:",
        error
      );

      console.error(
        "Backend Response:",
        error.response?.data
      );

      alert(
        error.response?.data
          ? JSON.stringify(error.response.data)
          : "Failed to save medical tourism request."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // Loading
  // =====================================================

  if (loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-sm text-[#7A7A7A]">
          Loading request...
        </p>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="p-6 bg-[#F2F2F2] min-h-[calc(100vh-72px)]">

      {/* Header */}

      <div className="flex items-center justify-between mb-6">

        <div className="flex items-center gap-4">

          <button
            type="button"
            onClick={() => navigate("/medical-tourism")}
            className="
              w-10
              h-10
              rounded-xl
              bg-white
              border
              border-[#E5E7EB]
              flex
              items-center
              justify-center
              text-[#6B7280]
              hover:text-[#2F6FED]
              hover:bg-[#EEF4FF]
              transition
            "
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <div className="flex items-center gap-2">

              <div
                className="
                  w-9
                  h-9
                  rounded-xl
                  bg-[#EEF4FF]
                  flex
                  items-center
                  justify-center
                  text-[#2F6FED]
                "
              >
                <Plane size={18} />
              </div>

              <h1 className="text-xl font-bold text-[#212121]">
                {isEditMode
                  ? "Edit Medical Tourism Request"
                  : "New Medical Tourism Request"}
              </h1>

            </div>

            <p className="text-sm text-[#7A7A7A] mt-1">
              Manage international healthcare and
              treatment arrangements
            </p>
          </div>

        </div>

      </div>

      {/* Form */}

      <form onSubmit={handleSubmit}>

        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm">

          {/* Section 1 */}

          <div className="p-6 border-b border-[#E5E7EB]">

            <div className="flex items-center gap-3 mb-5">

              <div
                className="
                  w-9
                  h-9
                  rounded-xl
                  bg-[#D9F7E8]
                  text-[#2F6FED]
                  flex
                  items-center
                  justify-center
                "
              >
                <User size={18} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-[#212121]">
                  Member Information
                </h2>

                <p className="text-xs text-[#7A7A7A]">
                  Select the BelleVie member
                </p>
              </div>

            </div>

            <div className="max-w-xl">

              <label className="block text-xs font-semibold text-[#374151] mb-2">
                Member <span className="text-red-500">*</span>
              </label>

              <select
                name="member"
                value={formData.member}
                onChange={handleChange}
                required
                className="
                  w-full
                  px-4
                  py-3
                  rounded-xl
                  border
                  border-[#E5E7EB]
                  bg-white
                  text-sm
                  text-[#212121]
                  outline-none
                  focus:border-[#2F6FED]
                  focus:ring-2
                  focus:ring-[#2F6FED]/10
                "
              >
                <option value="">
                  Select Member
                </option>

                {members.map((member) => (
                  <option
                    key={member.id}
                    value={member.id}
                  >
                    {member.member_id} -{" "}
                    {member.full_name}
                  </option>
                ))}
              </select>

            </div>

          </div>

          {/* Section 2 */}

          <div className="p-6 border-b border-[#E5E7EB]">

            <div className="flex items-center gap-3 mb-5">

              <div
                className="
                  w-9
                  h-9
                  rounded-xl
                  bg-[#EEF4FF]
                  text-[#2F6FED]
                  flex
                  items-center
                  justify-center
                "
              >
                <MapPin size={18} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-[#212121]">
                  Treatment & Destination
                </h2>

                <p className="text-xs text-[#7A7A7A]">
                  International treatment information
                </p>
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Country */}

              <div>

                <label className="block text-xs font-semibold text-[#374151] mb-2">
                  Destination Country{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  name="destination_country"
                  value={formData.destination_country}
                  onChange={handleChange}
                  required
                  placeholder="e.g. India"
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-[#E5E7EB]
                    text-sm
                    outline-none
                    focus:border-[#2F6FED]
                    focus:ring-2
                    focus:ring-[#2F6FED]/10
                  "
                />

              </div>

              {/* Hospital */}

              <div>

                <label className="block text-xs font-semibold text-[#374151] mb-2">
                  International Hospital{" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">

                  <Building2
                    size={16}
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
                    name="international_hospital"
                    value={
                      formData.international_hospital
                    }
                    onChange={handleChange}
                    required
                    placeholder="Hospital name"
                    className="
                      w-full
                      pl-10
                      pr-4
                      py-3
                      rounded-xl
                      border
                      border-[#E5E7EB]
                      text-sm
                      outline-none
                      focus:border-[#2F6FED]
                    "
                  />

                </div>

              </div>

              {/* Treatment */}

              <div className="md:col-span-2">

                <label className="block text-xs font-semibold text-[#374151] mb-2">
                  Treatment Name{" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">

                  <Stethoscope
                    size={16}
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
                    name="treatment_name"
                    value={formData.treatment_name}
                    onChange={handleChange}
                    required
                    placeholder="e.g. Cardiac Surgery"
                    className="
                      w-full
                      pl-10
                      pr-4
                      py-3
                      rounded-xl
                      border
                      border-[#E5E7EB]
                      text-sm
                      outline-none
                      focus:border-[#2F6FED]
                    "
                  />

                </div>

              </div>

              {/* Quotation */}

              <div>

                <label className="block text-xs font-semibold text-[#374151] mb-2">
                  Quotation Amount
                </label>

                <div className="relative">

                  <DollarSign
                    size={16}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-[#9CA3AF]
                    "
                  />

                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    name="quotation_amount"
                    value={formData.quotation_amount}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="
                      w-full
                      pl-10
                      pr-4
                      py-3
                      rounded-xl
                      border
                      border-[#E5E7EB]
                      text-sm
                      outline-none
                      focus:border-[#2F6FED]
                    "
                  />

                </div>

              </div>

            </div>

          </div>

          {/* Section 3 */}

          <div className="p-6 border-b border-[#E5E7EB]">

            <div className="flex items-center gap-3 mb-5">

              <div
                className="
                  w-9
                  h-9
                  rounded-xl
                  bg-[#FFF7ED]
                  text-[#F97316]
                  flex
                  items-center
                  justify-center
                "
              >
                <Plane size={18} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-[#212121]">
                  Visa & Travel
                </h2>

                <p className="text-xs text-[#7A7A7A]">
                  Travel preparation and visa information
                </p>
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Visa */}

              <div>

                <label className="block text-xs font-semibold text-[#374151] mb-2">
                  Visa Status
                </label>

                <input
                  type="text"
                  name="visa_status"
                  value={formData.visa_status}
                  onChange={handleChange}
                  placeholder="e.g. Applied / Approved / Pending"
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-[#E5E7EB]
                    text-sm
                    outline-none
                    focus:border-[#2F6FED]
                  "
                />

              </div>

              {/* Travel */}

              <div>

                <label className="block text-xs font-semibold text-[#374151] mb-2">
                  Travel Status
                </label>

                <input
                  type="text"
                  name="travel_status"
                  value={formData.travel_status}
                  onChange={handleChange}
                  placeholder="e.g. Not Planned / Planned"
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-[#E5E7EB]
                    text-sm
                    outline-none
                    focus:border-[#2F6FED]
                  "
                />

              </div>

              {/* Accommodation */}

              <div className="md:col-span-2">

                <label className="block text-xs font-semibold text-[#374151] mb-2">
                  Accommodation Details
                </label>

                <textarea
                  name="accommodation_details"
                  value={
                    formData.accommodation_details
                  }
                  onChange={handleChange}
                  rows={3}
                  placeholder="Hotel, location, duration, room type, etc."
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-[#E5E7EB]
                    text-sm
                    outline-none
                    resize-none
                    focus:border-[#2F6FED]
                  "
                />

              </div>

            </div>

          </div>

          {/* Section 4 */}

          <div className="p-6 border-b border-[#E5E7EB]">

            <div className="flex items-center gap-3 mb-5">

              <div
                className="
                  w-9
                  h-9
                  rounded-xl
                  bg-[#F3E8FF]
                  text-[#9333EA]
                  flex
                  items-center
                  justify-center
                "
              >
                <Languages size={18} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-[#212121]">
                  Translator
                </h2>

                <p className="text-xs text-[#7A7A7A]">
                  Language assistance requirements
                </p>
              </div>

            </div>

            <label className="flex items-center gap-3 cursor-pointer">

              <input
                type="checkbox"
                name="translator_required"
                checked={
                  formData.translator_required
                }
                onChange={handleChange}
                className="
                  w-4
                  h-4
                  accent-[#2F6FED]
                "
              />

              <span className="text-sm font-medium text-[#374151]">
                Translator Required
              </span>

            </label>

            {formData.translator_required && (
              <div className="mt-4">

                <label className="block text-xs font-semibold text-[#374151] mb-2">
                  Translator Details
                </label>

                <input
                  type="text"
                  name="translator_details"
                  value={formData.translator_details}
                  onChange={handleChange}
                  placeholder="Language / translator information"
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-[#E5E7EB]
                    text-sm
                    outline-none
                    focus:border-[#2F6FED]
                  "
                />

              </div>
            )}

          </div>

          {/* Section 5 */}

          <div className="p-6">

            <div className="flex items-center gap-3 mb-5">

              <div
                className="
                  w-9
                  h-9
                  rounded-xl
                  bg-[#EEF4FF]
                  text-[#2F6FED]
                  flex
                  items-center
                  justify-center
                "
              >
                <FileText size={18} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-[#212121]">
                  Request Status & Notes
                </h2>

                <p className="text-xs text-[#7A7A7A]">
                  Track the current stage of the request
                </p>
              </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

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
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-[#E5E7EB]
                    bg-white
                    text-sm
                    outline-none
                    focus:border-[#2F6FED]
                  "
                >
                  <option value="REQUESTED">
                    Requested
                  </option>

                  <option value="QUOTATION">
                    Quotation
                  </option>

                  <option value="VISA_PROCESSING">
                    Visa Processing
                  </option>

                  <option value="TRAVEL_PLANNED">
                    Travel Planned
                  </option>

                  <option value="TRAVELING">
                    Traveling
                  </option>

                  <option value="TREATMENT">
                    Treatment
                  </option>

                  <option value="COMPLETED">
                    Completed
                  </option>

                  <option value="CANCELLED">
                    Cancelled
                  </option>
                </select>

              </div>

              {/* Notes */}

              <div className="md:col-span-2">

                <label className="block text-xs font-semibold text-[#374151] mb-2">
                  Notes
                </label>

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Additional information..."
                  className="
                    w-full
                    px-4
                    py-3
                    rounded-xl
                    border
                    border-[#E5E7EB]
                    text-sm
                    outline-none
                    resize-none
                    focus:border-[#2F6FED]
                  "
                />

              </div>

            </div>

          </div>

        </div>

        {/* Actions */}

        <div className="flex justify-end gap-3 mt-6">

          <button
            type="button"
            onClick={() => navigate("/medical-tourism")}
            className="
              px-5
              py-3
              rounded-xl
              bg-white
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
            disabled={loading}
            className="
              px-6
              py-3
              rounded-xl
              bg-[#2F6FED]
              text-white
              text-sm
              font-semibold
              flex
              items-center
              gap-2
              hover:bg-[#255ED0]
              disabled:opacity-60
              disabled:cursor-not-allowed
              transition
            "
          >
            <Save size={17} />

            {loading
              ? "Saving..."
              : isEditMode
              ? "Update Request"
              : "Create Request"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default MedicalTourismRequestForm;
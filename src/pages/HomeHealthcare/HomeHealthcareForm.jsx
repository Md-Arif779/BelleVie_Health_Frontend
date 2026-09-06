import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  RefreshCw,
  Home,
} from "lucide-react";

import {
  getHomeHealthcareService,
  createHomeHealthcareService,
  updateHomeHealthcareService,
} from "../../services/homeHealthcareService";

import { getMembers } from "../../services/memberService";

import { useAuth } from "../../context/AuthContext";
import {
  canAdd,
  canEdit,
} from "../../utils/permission";

const HomeHealthcareForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { permissions } = useAuth();

  const isEditMode = Boolean(id);

  const [members, setMembers] = useState([]);

  const [formData, setFormData] = useState({
    member: "",
    service_type: "NURSING",
    service_date: "",
    service_time: "",
    address: "",
    assigned_staff: "",
    estimated_cost: "",
    status: "PENDING",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  // Load members
  const loadMembers = async () => {
    try {
      const data = await getMembers();

      if (Array.isArray(data)) {
        setMembers(data);
      } else if (Array.isArray(data?.results)) {
        setMembers(data.results);
      } else {
        setMembers([]);
      }
    } catch (err) {
      console.error("Members Loading Error:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to load members."
      );
    }
  };

  // Load existing service in edit mode
  const loadService = async () => {
    if (!id) {
      setPageLoading(false);
      return;
    }

    try {
      const data =
        await getHomeHealthcareService(id);

      setFormData({
        member:
          data.member?.id ||
          data.member ||
          "",

        service_type:
          data.service_type || "NURSING",

        service_date:
          data.service_date || "",

        service_time:
          data.service_time
            ? data.service_time.slice(0, 5)
            : "",

        address:
          data.address || "",

        assigned_staff:
          data.assigned_staff || "",

        estimated_cost:
          data.estimated_cost ?? "",

        status:
          data.status || "PENDING",

        notes:
          data.notes || "",
      });
    } catch (err) {
      console.error(
        "Home Healthcare Loading Error:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Failed to load home healthcare service."
      );
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      setPageLoading(true);

      await Promise.all([
        loadMembers(),
        loadService(),
      ]);

      if (!id) {
        setPageLoading(false);
      }
    };

    initialize();
  }, [id]);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.member) {
      setError("Please select a member.");
      return;
    }

    if (!formData.service_date) {
      setError("Please select service date.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        member: Number(formData.member),

        service_type:
          formData.service_type,

        service_date:
          formData.service_date,

        service_time:
          formData.service_time || null,

        address:
          formData.address.trim(),

        assigned_staff:
          formData.assigned_staff.trim(),

        estimated_cost:
          formData.estimated_cost === ""
            ? null
            : Number(formData.estimated_cost),

        status:
          formData.status,

        notes:
          formData.notes.trim(),
      };

      if (isEditMode) {
        await updateHomeHealthcareService(
          id,
          payload
        );
      } else {
        await createHomeHealthcareService(
          payload
        );
      }

      navigate("/home-healthcare");
    } catch (err) {
      console.error(
        "Home Healthcare Submit Error:",
        err
      );

      const responseData =
        err.response?.data;

      if (
        typeof responseData === "object" &&
        responseData !== null
      ) {
        const firstError = Object.values(
          responseData
        )[0];

        if (Array.isArray(firstError)) {
          setError(firstError[0]);
        } else if (typeof firstError === "string") {
          setError(firstError);
        } else {
          setError(
            "Failed to save home healthcare service."
          );
        }
      } else {
        setError(
          "Failed to save home healthcare service."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">
        <div className="flex min-h-[500px] items-center justify-center">
          <div className="flex items-center gap-3 text-sm text-[#7A7A7A]">
            <RefreshCw
              size={20}
              className="animate-spin"
            />
            Loading...
          </div>
        </div>
      </div>
    );
  }

  // Permission check
  if (
    (!isEditMode &&
      !canAdd(
        permissions,
        "home_healthcare"
      )) ||
    (isEditMode &&
      !canEdit(
        permissions,
        "home_healthcare"
      ))
  ) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">

        <button
          onClick={() =>
            navigate("/home-healthcare")
          }
          className="mb-5 flex items-center gap-2 text-sm font-medium text-[#2F6FED] hover:underline"
        >
          <ArrowLeft size={17} />
          Back to Home Healthcare
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
          You do not have permission to{" "}
          {isEditMode ? "edit" : "add"} home
          healthcare services.
        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">

      {/* Header */}
      <div className="mb-6">

        <button
          onClick={() =>
            navigate("/home-healthcare")
          }
          className="mb-4 flex items-center gap-2 text-sm font-medium text-[#2F6FED] hover:underline"
        >
          <ArrowLeft size={17} />
          Back to Home Healthcare
        </button>

        <div className="flex items-center gap-3">

          <div className="rounded-xl bg-[#EEF4FF] p-3">
            <Home
              size={24}
              className="text-[#2F6FED]"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#212121]">
              {isEditMode
                ? "Edit Home Healthcare"
                : "Add Home Healthcare"}
            </h1>

            <p className="mt-1 text-sm text-[#7A7A7A]">
              {isEditMode
                ? "Update home healthcare service information"
                : "Create a new home healthcare service"}
            </p>
          </div>

        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-[#E5E7EB] bg-white"
      >

        {/* Basic Information */}
        <div className="border-b border-[#E5E7EB] p-6">

          <h2 className="mb-5 text-lg font-semibold text-[#212121]">
            Service Information
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Member */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Member <span className="text-red-500">*</span>
              </label>

              <select
                name="member"
                value={formData.member}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#212121] outline-none focus:border-[#2F6FED]"
              >
                <option value="">
                  Select Member
                </option>

                {members.map((member) => (
                  <option
                    key={member.id}
                    value={member.id}
                  >
                    {member.full_name}
                    {member.member_id
                      ? ` (${member.member_id})`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Type */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Service Type{" "}
                <span className="text-red-500">*</span>
              </label>

              <select
                name="service_type"
                value={formData.service_type}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#212121] outline-none focus:border-[#2F6FED]"
              >
                <option value="NURSING">
                  Nursing Care
                </option>

                <option value="PHYSIOTHERAPY">
                  Physiotherapy
                </option>

                <option value="DOCTOR_VISIT">
                  Doctor Visit
                </option>

                <option value="ATTENDANT">
                  Attendant Care
                </option>

                <option value="LAB_SAMPLE">
                  Lab Sample Collection
                </option>

                <option value="OTHER">
                  Other
                </option>
              </select>
            </div>

          </div>
        </div>

        {/* Schedule */}
        <div className="border-b border-[#E5E7EB] p-6">

          <h2 className="mb-5 text-lg font-semibold text-[#212121]">
            Schedule
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Date */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Service Date{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                type="date"
                name="service_date"
                value={formData.service_date}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#212121] outline-none focus:border-[#2F6FED]"
              />
            </div>

            {/* Time */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Service Time
              </label>

              <input
                type="time"
                name="service_time"
                value={formData.service_time}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#212121] outline-none focus:border-[#2F6FED]"
              />
            </div>

          </div>
        </div>

        {/* Location & Staff */}
        <div className="border-b border-[#E5E7EB] p-6">

          <h2 className="mb-5 text-lg font-semibold text-[#212121]">
            Service Assignment
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Address */}
            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Service Address
              </label>

              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                placeholder="Enter service address"
                className="w-full resize-none rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#212121] outline-none focus:border-[#2F6FED]"
              />

            </div>

            {/* Assigned Staff */}
            <div>

              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Assigned Staff
              </label>

              <input
                type="text"
                name="assigned_staff"
                value={formData.assigned_staff}
                onChange={handleChange}
                placeholder="Enter assigned staff name"
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#212121] outline-none focus:border-[#2F6FED]"
              />

            </div>

            {/* Estimated Cost */}
            <div>

              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Estimated Cost
              </label>

              <input
                type="number"
                name="estimated_cost"
                value={formData.estimated_cost}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Enter estimated cost"
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#212121] outline-none focus:border-[#2F6FED]"
              />

            </div>

          </div>
        </div>

        {/* Status & Notes */}
        <div className="p-6">

          <h2 className="mb-5 text-lg font-semibold text-[#212121]">
            Status & Notes
          </h2>

          <div className="grid grid-cols-1 gap-5">

            {/* Status */}
            <div>

              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#212121] outline-none focus:border-[#2F6FED]"
              >
                <option value="PENDING">
                  Pending
                </option>

                <option value="CONFIRMED">
                  Confirmed
                </option>

                <option value="ASSIGNED">
                  Assigned
                </option>

                <option value="IN_PROGRESS">
                  In Progress
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
            <div>

              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Notes
              </label>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Enter additional notes"
                className="w-full resize-none rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#212121] outline-none focus:border-[#2F6FED]"
              />

            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-[#E5E7EB] bg-[#F9FAFB] px-6 py-4 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={() =>
              navigate("/home-healthcare")
            }
            disabled={loading}
            className="rounded-lg border border-[#E5E7EB] bg-white px-5 py-3 text-sm font-medium text-[#212121] transition hover:bg-[#F3F4F6] disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#2F6FED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2459C7] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <RefreshCw
                  size={17}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : (
              <>
                <Save size={17} />
                {isEditMode
                  ? "Update Service"
                  : "Create Service"}
              </>
            )}
          </button>

        </div>

      </form>
    </div>
  );
};

export default HomeHealthcareForm;
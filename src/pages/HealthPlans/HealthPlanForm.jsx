import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import {
  createHealthPlan,
  getHealthPlan,
  updateHealthPlan,
} from "../../services/healthPlanService";

import { getMembers } from "../../services/memberService";
import { useAuth } from "../../context/AuthContext";
import { canAdd, canEdit } from "../../utils/permission";

const HealthPlanForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { permissions } = useAuth();

  const isEditMode = Boolean(id);

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  const [formData, setFormData] = useState({
    member: "",
    plan_name: "",
    plan_type: "",
    provider_name: "",
    coverage_amount: "",
    premium: "",
    start_date: "",
    expiry_date: "",
    status: "ACTIVE",
    coverage_details: "",
    notes: "",
  });

  // =========================
  // Permission Check
  // =========================

  useEffect(() => {
    if (isEditMode && !canEdit(permissions, "health_plans")) {
      alert("You do not have permission to edit Health Plans.");
      navigate("/health-plans");
      return;
    }

    if (!isEditMode && !canAdd(permissions, "health_plans")) {
      alert("You do not have permission to add Health Plans.");
      navigate("/health-plans");
    }
  }, [permissions, isEditMode, navigate]);

  // =========================
  // Load Members
  // =========================

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const response = await getMembers();

        const memberList = Array.isArray(response)
          ? response
          : response?.results || response?.members || [];

        setMembers(memberList);
      } catch (error) {
        console.error("Failed to load members:", error);
      }
    };

    loadMembers();
  }, []);

  // =========================
  // Load Health Plan
  // =========================

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const loadPlan = async () => {
      try {
        const response = await getHealthPlan(id);

        setFormData({
          member:
            typeof response.member === "object"
              ? response.member.id
              : response.member || "",

          plan_name: response.plan_name || "",
          plan_type: response.plan_type || "",
          provider_name: response.provider_name || "",
          coverage_amount: response.coverage_amount ?? "",
          premium: response.premium ?? "",
          start_date: response.start_date || "",
          expiry_date: response.expiry_date || "",
          status: response.status || "ACTIVE",
          coverage_details: response.coverage_details || "",
          notes: response.notes || "",
        });
      } catch (error) {
        console.error("Failed to load health plan:", error);
        alert("Failed to load Health Plan.");
        navigate("/health-plans");
      } finally {
        setInitialLoading(false);
      }
    };

    loadPlan();
  }, [id, isEditMode, navigate]);

  // =========================
  // Input Change
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // Submit
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.member) {
      alert("Please select a member.");
      return;
    }

    if (!formData.plan_name.trim()) {
      alert("Please enter Plan Name.");
      return;
    }

    if (!formData.start_date) {
      alert("Please select Start Date.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        member: formData.member,
        plan_name: formData.plan_name,
        plan_type: formData.plan_type || null,
        provider_name: formData.provider_name || null,
        coverage_amount: formData.coverage_amount || 0,
        premium: formData.premium || 0,
        start_date: formData.start_date,
        expiry_date: formData.expiry_date || null,
        status: formData.status,
        coverage_details: formData.coverage_details || null,
        notes: formData.notes || null,
      };

      if (isEditMode) {
        await updateHealthPlan(id, payload);
        alert("Health Plan updated successfully.");
      } else {
        await createHealthPlan(payload);
        alert("Health Plan created successfully.");
      }

      navigate("/health-plans");
    } catch (error) {
      console.error("Health Plan save error:", error);

      const errorData = error?.response?.data;

      console.error("Backend Error Response:", errorData);

      if (errorData && typeof errorData === "object") {
        const messages = Object.entries(errorData)
          .map(([field, message]) => {
            const text = Array.isArray(message)
              ? message.join(", ")
              : String(message);

            return `${field}: ${text}`;
          })
          .join("\n");

        alert(messages || "Failed to save Health Plan.");
      } else {
        alert("Failed to save Health Plan.");
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Loading
  // =========================

  if (initialLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-[#7A7A7A]">
          Loading Health Plan...
        </p>
      </div>
    );
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-2xl font-semibold text-[#212121]">
            {isEditMode
              ? "Edit Health Plan"
              : "Add Health Plan"}
          </h1>

          <p className="mt-1 text-sm text-[#7A7A7A]">
            {isEditMode
              ? "Update health plan information"
              : "Create a new health plan"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/health-plans")}
          className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-medium text-[#212121] hover:bg-[#F2F2F2]"
        >
          <ArrowLeft size={17} />
          Back
        </button>

      </div>

      {/* Form Card */}

      <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

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
              className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#2F6FED]"
            >
              <option value="">
                Select Member
              </option>

              {members.map((member) => (
                <option
                  key={member.id}
                  value={member.id}
                >
                  {member.member_id} - {member.full_name}
                </option>
              ))}
            </select>
          </div>

          {/* Plan Name */}

          <div>
            <label className="mb-2 block text-sm font-medium text-[#212121]">
              Plan Name <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="plan_name"
              value={formData.plan_name}
              onChange={handleChange}
              placeholder="Enter plan name"
              required
              className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#2F6FED]"
            />
          </div>

          {/* Plan Type + Provider */}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Plan Type
              </label>

              <input
                type="text"
                name="plan_type"
                value={formData.plan_type}
                onChange={handleChange}
                placeholder="e.g. Individual, Family"
                className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#2F6FED]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Provider Name
              </label>

              <input
                type="text"
                name="provider_name"
                value={formData.provider_name}
                onChange={handleChange}
                placeholder="Enter provider name"
                className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#2F6FED]"
              />
            </div>

          </div>

          {/* Coverage + Premium */}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Coverage Amount
              </label>

              <input
                type="number"
                name="coverage_amount"
                value={formData.coverage_amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#2F6FED]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Premium
              </label>

              <input
                type="number"
                name="premium"
                value={formData.premium}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#2F6FED]"
              />
            </div>

          </div>

          {/* Dates */}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Start Date <span className="text-red-500">*</span>
              </label>

              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#2F6FED]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Expiry Date
              </label>

              <input
                type="date"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#2F6FED]"
              />
            </div>

          </div>

          {/* Status */}

          <div>
            <label className="mb-2 block text-sm font-medium text-[#212121]">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#2F6FED]"
            >
              <option value="ACTIVE">
                Active
              </option>

              <option value="INACTIVE">
                Inactive
              </option>

              <option value="EXPIRED">
                Expired
              </option>
            </select>
          </div>

          {/* Coverage Details */}

          <div>
            <label className="mb-2 block text-sm font-medium text-[#212121]">
              Coverage Details
            </label>

            <textarea
              name="coverage_details"
              value={formData.coverage_details}
              onChange={handleChange}
              rows={4}
              placeholder="Enter coverage details..."
              className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:border-[#2F6FED]"
            />
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
              placeholder="Enter additional notes..."
              className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:border-[#2F6FED]"
            />
          </div>

          {/* Buttons */}

          <div className="flex justify-end gap-3 border-t border-[#E5E7EB] pt-5">

            <button
              type="button"
              onClick={() => navigate("/health-plans")}
              className="rounded-lg border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-medium text-[#212121] hover:bg-[#F2F2F2]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-[#2F6FED] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#2459C7] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={17} />

              {loading
                ? "Saving..."
                : isEditMode
                ? "Update Plan"
                : "Create Plan"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default HealthPlanForm;
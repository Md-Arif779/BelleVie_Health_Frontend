import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import {
  getInsurancePolicy,
  createInsurancePolicy,
  updateInsurancePolicy,
} from "../../services/insurancePolicyService";

import { getMembers } from "../../services/memberService";

import { useAuth } from "../../context/AuthContext";
import {
  canAdd,
  canEdit,
} from "../../utils/permission";

const InsurancePolicyForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const { permissions } = useAuth();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    member: "",
    provider_name: "",
    policy_number: "",
    plan_name: "",
    coverage_amount: "",
    premium: "",
    start_date: "",
    expiry_date: "",
    status: "ACTIVE",
    coverage_details: "",
    notes: "",
  });

  useEffect(() => {
    loadMembers();

    if (isEditMode) {
      loadPolicy();
    }
  }, [id]);

  const loadMembers = async () => {
    try {
      const data = await getMembers();

      setMembers(
        Array.isArray(data)
          ? data
          : data.results || []
      );
    } catch (err) {
      console.error("Members Error:", err);

      setError(
        "Failed to load members."
      );
    }
  };

  const loadPolicy = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getInsurancePolicy(id);

      setFormData({
        member:
          data.member?.id ||
          data.member ||
          "",

        provider_name:
          data.provider_name || "",

        policy_number:
          data.policy_number || "",

        plan_name:
          data.plan_name || "",

        coverage_amount:
          data.coverage_amount || "",

        premium:
          data.premium || "",

        start_date:
          data.start_date || "",

        expiry_date:
          data.expiry_date || "",

        status:
          data.status || "ACTIVE",

        coverage_details:
          data.coverage_details || "",

        notes:
          data.notes || "",
      });
    } catch (err) {
      console.error(
        "Insurance Policy Error:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Failed to load insurance policy."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSaving(true);
    setError("");

    try {
      const payload = {
        member: Number(formData.member),
        provider_name: formData.provider_name,
        policy_number: formData.policy_number,
        plan_name: formData.plan_name,
        coverage_amount: formData.coverage_amount,
        premium: formData.premium,
        start_date: formData.start_date,
        expiry_date: formData.expiry_date,
        status: formData.status,
        coverage_details:
          formData.coverage_details || null,
        notes: formData.notes || null,
      };

      if (isEditMode) {
        await updateInsurancePolicy(
          id,
          payload
        );
      } else {
        await createInsurancePolicy(payload);
      }

      navigate("/insurance-policies");
    } catch (err) {
      console.error(
        "Save Insurance Policy Error:",
        err
      );

      const responseData =
        err.response?.data;

      if (
        responseData &&
        typeof responseData === "object"
      ) {
        const messages = Object.entries(
          responseData
        )
          .map(([field, message]) => {
            const text = Array.isArray(message)
              ? message.join(", ")
              : message;

            return `${field}: ${text}`;
          })
          .join(" | ");

        setError(
          messages ||
            "Failed to save insurance policy."
        );
      } else {
        setError(
          "Failed to save insurance policy."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const allowed =
    isEditMode
      ? canEdit(
          permissions,
          "insurance_policies"
        )
      : canAdd(
          permissions,
          "insurance_policies"
        );

  if (!allowed) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="text-lg font-semibold text-red-700">
            Access Denied
          </h2>

          <p className="mt-2 text-sm text-red-600">
            You do not have permission to{" "}
            {isEditMode ? "edit" : "add"} insurance
            policies.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">
        <div className="rounded-xl bg-white p-8 text-center text-sm text-[#7A7A7A] shadow-sm">
          Loading insurance policy...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={() =>
            navigate("/insurance-policies")
          }
          className="rounded-lg bg-white p-2.5 text-[#7A7A7A] shadow-sm hover:bg-[#EEF4FF] hover:text-[#2F6FED]"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-[#212121]">
            {isEditMode
              ? "Edit Insurance Policy"
              : "Add Insurance Policy"}
          </h1>

          <p className="text-sm text-[#7A7A7A]">
            {isEditMode
              ? "Update insurance policy information"
              : "Create a new insurance policy"}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Policy Information */}
        <div className="mb-6 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-[#212121]">
            Policy Information
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
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#2F6FED]"
              >
                <option value="">
                  Select Member
                </option>

                {members.map((member) => (
                  <option
                    key={member.id}
                    value={member.id}
                  >
                    {member.member_id
                      ? `${member.member_id} - ${member.full_name}`
                      : member.full_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Provider */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Provider Name{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="provider_name"
                value={formData.provider_name}
                onChange={handleChange}
                required
                placeholder="Enter insurance provider"
                className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#2F6FED]"
              />
            </div>

            {/* Policy Number */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Policy Number{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="policy_number"
                value={formData.policy_number}
                onChange={handleChange}
                required
                placeholder="Enter policy number"
                className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#2F6FED]"
              />
            </div>

            {/* Plan Name */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Plan Name{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="plan_name"
                value={formData.plan_name}
                onChange={handleChange}
                required
                placeholder="Enter plan name"
                className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#2F6FED]"
              />
            </div>

            {/* Coverage Amount */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Coverage Amount{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                type="number"
                name="coverage_amount"
                value={formData.coverage_amount}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#2F6FED]"
              />
            </div>

            {/* Premium */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Premium{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                type="number"
                name="premium"
                value={formData.premium}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#2F6FED]"
              />
            </div>

            {/* Start Date */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Start Date{" "}
                <span className="text-red-500">*</span>
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

            {/* Expiry Date */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Expiry Date{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                type="date"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#2F6FED]"
              />
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
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#2F6FED]"
              >
                <option value="ACTIVE">
                  Active
                </option>

                <option value="EXPIRED">
                  Expired
                </option>

                <option value="CANCELLED">
                  Cancelled
                </option>
              </select>
            </div>
          </div>
        </div>

        {/* Coverage Details */}
        <div className="mb-6 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-[#212121]">
            Coverage Details
          </h2>

          <textarea
            name="coverage_details"
            value={formData.coverage_details}
            onChange={handleChange}
            rows="5"
            placeholder="Enter coverage details..."
            className="w-full resize-none rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:border-[#2F6FED]"
          />
        </div>

        {/* Notes */}
        <div className="mb-6 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-[#212121]">
            Notes
          </h2>

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            placeholder="Enter additional notes..."
            className="w-full resize-none rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none focus:border-[#2F6FED]"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() =>
              navigate("/insurance-policies")
            }
            className="rounded-lg border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-medium text-[#212121] hover:bg-[#F8F9FA]"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-[#2F6FED] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#2459C7] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={18} />

            {saving
              ? "Saving..."
              : isEditMode
              ? "Update Policy"
              : "Save Policy"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InsurancePolicyForm;
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import {
  getInsuranceClaim,
  createInsuranceClaim,
  updateInsuranceClaim,
} from "../../services/insuranceClaimService";

import { getMembers } from "../../services/memberService";
import { getInsurancePolicies } from "../../services/insurancePolicyService";

import { useAuth } from "../../context/AuthContext";
import {
  canAdd,
  canEdit,
} from "../../utils/permission";

const CLAIM_TYPES = [
  {
    value: "HOSPITALIZATION",
    label: "Hospitalization",
  },
  {
    value: "CONSULTATION",
    label: "Consultation",
  },
  {
    value: "DIAGNOSTIC",
    label: "Diagnostic",
  },
  {
    value: "MEDICINE",
    label: "Medicine",
  },
  {
    value: "SURGERY",
    label: "Surgery",
  },
  {
    value: "OTHER",
    label: "Other",
  },
];

const CLAIM_STATUSES = [
  {
    value: "PENDING",
    label: "Pending",
  },
  {
    value: "UNDER_REVIEW",
    label: "Under Review",
  },
  {
    value: "APPROVED",
    label: "Approved",
  },
  {
    value: "REJECTED",
    label: "Rejected",
  },
  {
    value: "PAID",
    label: "Paid",
  },
];

const initialForm = {
  member: "",
  policy: "",
  claim_date: "",
  claim_type: "",
  service_date: "",
  service_description: "",
  claim_amount: "",
  approved_amount: "0",
  status: "PENDING",
  rejection_reason: "",
  notes: "",
};

function InsuranceClaimForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { permissions, loading: authLoading } = useAuth();

  const isEdit = Boolean(id);
  const module = "insurance_claims";

  const [form, setForm] = useState(initialForm);

  const [members, setMembers] = useState([]);
  const [policies, setPolicies] = useState([]);

  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoadingData(true);
      setError("");

      const [membersResponse, policiesResponse] =
        await Promise.all([
          getMembers(),
          getInsurancePolicies(),
        ]);

      const membersData = Array.isArray(membersResponse)
        ? membersResponse
        : membersResponse?.results || [];

      const policiesData = Array.isArray(policiesResponse)
        ? policiesResponse
        : policiesResponse?.results || [];

      setMembers(membersData);
      setPolicies(policiesData);

      if (isEdit) {
        const claim = await getInsuranceClaim(id);

        setForm({
          member: claim.member ?? "",
          policy: claim.policy ?? "",
          claim_date: claim.claim_date || "",
          claim_type: claim.claim_type || "",
          service_date: claim.service_date || "",
          service_description:
            claim.service_description || "",
          claim_amount: claim.claim_amount ?? "",
          approved_amount: claim.approved_amount ?? "0",
          status: claim.status || "PENDING",
          rejection_reason:
            claim.rejection_reason || "",
          notes: claim.notes || "",
        });
      }
    } catch (err) {
      console.error(
        "Insurance Claim Form Error:",
        err
      );

      setError(
        err?.response?.data?.detail ||
          "Failed to load insurance claim data."
      );
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      loadData();
    }
  }, [authLoading, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.member) {
      setError("Please select a member.");
      return;
    }

    if (!form.policy) {
      setError("Please select an insurance policy.");
      return;
    }

    if (!form.claim_date) {
      setError("Please select claim date.");
      return;
    }

    if (!form.claim_type) {
      setError("Please select claim type.");
      return;
    }

    if (!form.service_date) {
      setError("Please select service date.");
      return;
    }

    if (!form.service_description.trim()) {
      setError("Please enter service description.");
      return;
    }

    if (!form.claim_amount) {
      setError("Please enter claim amount.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        member: Number(form.member),
        policy: Number(form.policy),
        claim_date: form.claim_date,
        claim_type: form.claim_type,
        service_date: form.service_date,
        service_description:
          form.service_description.trim(),
        claim_amount: Number(form.claim_amount),
        approved_amount: Number(
          form.approved_amount || 0
        ),
        status: form.status,
        rejection_reason:
          form.rejection_reason.trim() || null,
        notes: form.notes.trim() || null,
      };

      if (isEdit) {
        await updateInsuranceClaim(id, payload);
      } else {
        await createInsuranceClaim(payload);
      }

      navigate("/insurance-claims");
    } catch (err) {
      console.error(
        "Save Insurance Claim Error:",
        err
      );

      const data = err?.response?.data;

      if (data && typeof data === "object") {
        const messages = Object.entries(data)
          .map(([field, message]) => {
            const text = Array.isArray(message)
              ? message.join(", ")
              : String(message);

            return `${field}: ${text}`;
          })
          .join(" | ");

        setError(
          messages || "Failed to save insurance claim."
        );
      } else {
        setError(
          "Failed to save insurance claim."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loadingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[#7A7A7A]">
          Loading...
        </div>
      </div>
    );
  }

  const allowed = isEdit
    ? canEdit(permissions, module)
    : canAdd(permissions, module);

  if (!allowed) {
    return (
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-8 text-center">
        <h2 className="text-xl font-semibold text-[#212121]">
          Access Denied
        </h2>

        <p className="mt-2 text-[#7A7A7A]">
          You do not have permission to{" "}
          {isEdit ? "edit" : "add"} insurance claims.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate("/insurance-claims")}
          className="p-2 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#F2F2F2]"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-[#212121]">
            {isEdit
              ? "Edit Insurance Claim"
              : "Add Insurance Claim"}
          </h1>

          <p className="text-sm text-[#7A7A7A] mt-1">
            {isEdit
              ? "Update insurance claim information."
              : "Create a new insurance claim."}
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-8"
      >

        {/* Member & Policy */}
        <div>
          <h2 className="text-lg font-semibold text-[#212121] mb-4">
            Insurance Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Member */}
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-2">
                Member <span className="text-red-500">*</span>
              </label>

              <select
                name="member"
                value={form.member}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg bg-white outline-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
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

            {/* Policy */}
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-2">
                Insurance Policy{" "}
                <span className="text-red-500">*</span>
              </label>

              <select
                name="policy"
                value={form.policy}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg bg-white outline-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
              >
                <option value="">
                  Select Policy
                </option>

                {policies.map((policy) => (
                  <option
                    key={policy.id}
                    value={policy.id}
                  >
                    {policy.policy_id
                      ? `${policy.policy_id} - ${
                          policy.policy_number || ""
                        }`
                      : policy.policy_number}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Claim Information */}
        <div>
          <h2 className="text-lg font-semibold text-[#212121] mb-4">
            Claim Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Claim Date */}
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-2">
                Claim Date{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                type="date"
                name="claim_date"
                value={form.claim_date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg outline-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
              />
            </div>

            {/* Claim Type */}
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-2">
                Claim Type{" "}
                <span className="text-red-500">*</span>
              </label>

              <select
                name="claim_type"
                value={form.claim_type}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg bg-white outline-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
              >
                <option value="">
                  Select Claim Type
                </option>

                {CLAIM_TYPES.map((type) => (
                  <option
                    key={type.value}
                    value={type.value}
                  >
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Date */}
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-2">
                Service Date{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                type="date"
                name="service_date"
                value={form.service_date}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg outline-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
              />
            </div>

            {/* Claim Amount */}
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-2">
                Claim Amount{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                type="number"
                name="claim_amount"
                value={form.claim_amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
                placeholder="Enter claim amount"
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg outline-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
              />
            </div>

            {/* Approved Amount */}
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-2">
                Approved Amount
              </label>

              <input
                type="number"
                name="approved_amount"
                value={form.approved_amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Enter approved amount"
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg outline-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-2">
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[#E5E7EB] rounded-lg bg-white outline-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
              >
                {CLAIM_STATUSES.map((status) => (
                  <option
                    key={status.value}
                    value={status.value}
                  >
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Service Description */}
        <div>
          <label className="block text-sm font-medium text-[#212121] mb-2">
            Service Description{" "}
            <span className="text-red-500">*</span>
          </label>

          <textarea
            name="service_description"
            value={form.service_description}
            onChange={handleChange}
            required
            rows={4}
            placeholder="Describe the medical service..."
            className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg outline-none resize-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
          />
        </div>

        {/* Rejection Reason */}
        <div>
          <label className="block text-sm font-medium text-[#212121] mb-2">
            Rejection Reason
          </label>

          <textarea
            name="rejection_reason"
            value={form.rejection_reason}
            onChange={handleChange}
            rows={3}
            placeholder="Enter rejection reason if applicable..."
            className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg outline-none resize-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-[#212121] mb-2">
            Notes
          </label>

          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Additional notes..."
            className="w-full px-4 py-3 border border-[#E5E7EB] rounded-lg outline-none resize-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">

          <button
            type="button"
            onClick={() => navigate("/insurance-claims")}
            disabled={saving}
            className="px-5 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#212121] font-medium hover:bg-[#F2F2F2] disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2F6FED] text-white font-medium hover:bg-[#2459C7] disabled:opacity-50"
          >
            <Save size={18} />

            {saving
              ? "Saving..."
              : isEdit
              ? "Update Claim"
              : "Save Claim"}
          </button>

        </div>

      </form>
    </div>
  );
}

export default InsuranceClaimForm;
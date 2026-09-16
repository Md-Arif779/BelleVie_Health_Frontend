
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  ShieldCheck,
  Loader2,
} from "lucide-react";

import {
  createInsurancePolicy,
  getInsurancePolicy,
  updateInsurancePolicy,
} from "../../services/insurancePolicyService";

import { getMembers } from "../../services/memberService";
import { getPartners } from "../../services/partnerService";

const INITIAL_FORM_DATA = {
  member: "",
  provider: "",
  policy_number: "",
  plan_name: "",
  coverage_amount: "",
  premium: "",
  start_date: "",
  expiry_date: "",
  status: "ACTIVE",
  coverage_details: "",
  notes: "",
};

const STATUS_OPTIONS = [
  {
    value: "ACTIVE",
    label: "Active",
  },
  {
    value: "EXPIRED",
    label: "Expired",
  },
  {
    value: "CANCELLED",
    label: "Cancelled",
  },
];

export default function InsurancePolicyForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  const [members, setMembers] = useState([]);
  const [providers, setProviders] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // --------------------------------------------------
  // Load Members + Providers
  // --------------------------------------------------

  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        setLoading(true);
        setError("");

        const [memberResponse, partnerResponse] =
          await Promise.all([
            getMembers(),
            getPartners(),
          ]);

        // -----------------------------
        // Members
        // -----------------------------

        const memberList =
          Array.isArray(memberResponse)
            ? memberResponse
            : memberResponse?.results || [];

        setMembers(memberList);

        // -----------------------------
        // Providers
        // -----------------------------

        const partnerList =
          Array.isArray(partnerResponse)
            ? partnerResponse
            : partnerResponse?.results || [];

        /*
         * Insurance provider should come from Partner.
         *
         * If partner_type is available, prefer:
         * INSURANCE
         * INSURANCE_COMPANY
         *
         * If no such filtering value exists in the database,
         * show all partners instead of showing an empty dropdown.
         */

        const insuranceProviders = partnerList.filter(
          (partner) =>
            !partner.partner_type ||
            partner.partner_type === "INSURANCE" ||
            partner.partner_type === "INSURANCE_COMPANY"
        );

        setProviders(
          insuranceProviders.length > 0
            ? insuranceProviders
            : partnerList
        );
      } catch (err) {
        console.error(
          "Failed to load insurance policy form data:",
          err
        );

        setError(
          "Failed to load members or insurance providers."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDropdownData();
  }, []);

  // --------------------------------------------------
  // Load existing policy in edit mode
  // --------------------------------------------------

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const loadPolicy = async () => {
      try {
        setLoading(true);
        setError("");

        const policy = await getInsurancePolicy(id);

        setFormData({
          member: policy.member || "",
          provider: policy.provider || "",
          policy_number: policy.policy_number || "",
          plan_name: policy.plan_name || "",
          coverage_amount:
            policy.coverage_amount ?? "",
          premium: policy.premium ?? "",
          start_date: policy.start_date || "",
          expiry_date: policy.expiry_date || "",
          status: policy.status || "ACTIVE",
          coverage_details:
            policy.coverage_details || "",
          notes: policy.notes || "",
        });
      } catch (err) {
        console.error(
          "Failed to load insurance policy:",
          err
        );

        setError(
          "Failed to load insurance policy."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPolicy();
  }, [id, isEditMode]);

  // --------------------------------------------------
  // Handle input change
  // --------------------------------------------------

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    // Remove field error after user changes it
    if (fieldErrors[name]) {
      setFieldErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }

    if (error) {
      setError("");
    }
  };

  // --------------------------------------------------
  // Validate form
  // --------------------------------------------------

  const validateForm = () => {
    const errors = {};

    if (!formData.member) {
      errors.member = "Please select a member.";
    }

    if (!formData.provider) {
      errors.provider =
        "Please select an insurance provider.";
    }

    if (!formData.policy_number.trim()) {
      errors.policy_number =
        "Policy number is required.";
    }

    if (!formData.plan_name.trim()) {
      errors.plan_name =
        "Plan name is required.";
    }

    if (!formData.start_date) {
      errors.start_date =
        "Start date is required.";
    }

    if (!formData.expiry_date) {
      errors.expiry_date =
        "Expiry date is required.";
    }

    if (
      formData.start_date &&
      formData.expiry_date &&
      formData.expiry_date < formData.start_date
    ) {
      errors.expiry_date =
        "Expiry date cannot be before start date.";
    }

    if (
      formData.coverage_amount !== "" &&
      Number(formData.coverage_amount) < 0
    ) {
      errors.coverage_amount =
        "Coverage amount cannot be negative.";
    }

    if (
      formData.premium !== "" &&
      Number(formData.premium) < 0
    ) {
      errors.premium =
        "Premium cannot be negative.";
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setFieldErrors({});

      /*
       * IMPORTANT:
       *
       * Backend model:
       *
       * provider = ForeignKey(Partner)
       *
       * Therefore we send provider ID,
       * NOT provider_name.
       */

      const payload = {
        member: Number(formData.member),

        provider: formData.provider
          ? Number(formData.provider)
          : null,

        policy_number:
          formData.policy_number.trim(),

        plan_name:
          formData.plan_name.trim(),

        coverage_amount:
          formData.coverage_amount === ""
            ? 0
            : Number(formData.coverage_amount),

        premium:
          formData.premium === ""
            ? 0
            : Number(formData.premium),

        start_date: formData.start_date,

        expiry_date: formData.expiry_date,

        status: formData.status,

        coverage_details:
          formData.coverage_details.trim() || null,

        notes:
          formData.notes.trim() || null,
      };

      console.log(
        "Insurance Policy Payload:",
        payload
      );

      if (isEditMode) {
        await updateInsurancePolicy(
          id,
          payload
        );
      } else {
        await createInsurancePolicy(
          payload
        );
      }

      navigate("/insurance-policies");
    } catch (err) {
      console.error(
        "Failed to save insurance policy:",
        err
      );

      const backendErrors =
        err.response?.data;

      console.error(
        "Backend response:",
        backendErrors
      );

      // ----------------------------------------
      // Display DRF validation errors
      // ----------------------------------------

      if (
        backendErrors &&
        typeof backendErrors === "object"
      ) {
        const formattedErrors = {};

        Object.entries(
          backendErrors
        ).forEach(([field, messages]) => {
          if (Array.isArray(messages)) {
            formattedErrors[field] =
              messages.join(" ");
          } else {
            formattedErrors[field] =
              String(messages);
          }
        });

        setFieldErrors(formattedErrors);

        // General error
        const firstError =
          Object.values(formattedErrors)[0];

        if (firstError) {
          setError(firstError);
        }
      } else {
        setError(
          "Failed to save insurance policy. Please try again."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // Loading screen
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-3 text-bv-gray">
          <Loader2
            size={22}
            className="animate-spin"
          />

          <span>
            Loading insurance policy...
          </span>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="min-h-full bg-bv-bg p-6">
      {/* Header */}

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() =>
              navigate("/insurance-policies")
            }
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-bv-card bg-white text-bv-gray transition hover:bg-bv-mint hover:text-bv-blue"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck
                size={24}
                className="text-bv-blue"
              />

              <h1 className="text-2xl font-semibold text-bv-dark">
                {isEditMode
                  ? "Edit Insurance Policy"
                  : "Add Insurance Policy"}
              </h1>
            </div>

            <p className="mt-1 text-sm text-bv-gray">
              {isEditMode
                ? "Update insurance policy information."
                : "Create a new insurance policy for a member."}
            </p>
          </div>
        </div>
      </div>

      {/* General Error */}

      {error && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Form Card */}

      <form
        onSubmit={handleSubmit}
        className="rounded-xl border border-bv-card bg-white shadow-bv"
      >
        {/* Basic Information */}

        <div className="border-b border-bv-card px-6 py-5">
          <h2 className="text-lg font-semibold text-bv-dark">
            Basic Information
          </h2>

          <p className="mt-1 text-sm text-bv-gray">
            Select the member and insurance provider.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
          {/* Member */}

          <div>
            <label className="mb-2 block text-sm font-medium text-bv-dark">
              Member
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <select
              name="member"
              value={formData.member}
              onChange={handleChange}
              className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-bv-dark outline-none transition focus:border-bv-blue ${
                fieldErrors.member
                  ? "border-red-400"
                  : "border-bv-card"
              }`}
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
                    ? ` — ${member.member_id}`
                    : ""}
                </option>
              ))}
            </select>

            {fieldErrors.member && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.member}
              </p>
            )}
          </div>

          {/* Provider */}

          <div>
            <label className="mb-2 block text-sm font-medium text-bv-dark">
              Provider
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <select
              name="provider"
              value={formData.provider}
              onChange={handleChange}
              className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-bv-dark outline-none transition focus:border-bv-blue ${
                fieldErrors.provider
                  ? "border-red-400"
                  : "border-bv-card"
              }`}
            >
              <option value="">
                Select Insurance Provider
              </option>

              {providers.map((provider) => (
                <option
                  key={provider.id}
                  value={provider.id}
                >
                  {provider.name}
                </option>
              ))}
            </select>

            {fieldErrors.provider && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.provider}
              </p>
            )}
          </div>

          {/* Policy Number */}

          <div>
            <label className="mb-2 block text-sm font-medium text-bv-dark">
              Policy Number
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <input
              type="text"
              name="policy_number"
              value={formData.policy_number}
              onChange={handleChange}
              placeholder="e.g. POL-2026-0001"
              className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-bv-dark outline-none transition focus:border-bv-blue ${
                fieldErrors.policy_number
                  ? "border-red-400"
                  : "border-bv-card"
              }`}
            />

            {fieldErrors.policy_number && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.policy_number}
              </p>
            )}

            <p className="mt-1 text-xs text-bv-gray">
              Policy number must be unique.
            </p>
          </div>

          {/* Plan Name */}

          <div>
            <label className="mb-2 block text-sm font-medium text-bv-dark">
              Plan Name
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <input
              type="text"
              name="plan_name"
              value={formData.plan_name}
              onChange={handleChange}
              placeholder="e.g. Premium Health Plan"
              className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-bv-dark outline-none transition focus:border-bv-blue ${
                fieldErrors.plan_name
                  ? "border-red-400"
                  : "border-bv-card"
              }`}
            />

            {fieldErrors.plan_name && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.plan_name}
              </p>
            )}
          </div>
        </div>

        {/* Financial Information */}

        <div className="border-y border-bv-card px-6 py-5">
          <h2 className="text-lg font-semibold text-bv-dark">
            Financial Information
          </h2>

          <p className="mt-1 text-sm text-bv-gray">
            Enter the policy coverage and premium amounts.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
          {/* Coverage Amount */}

          <div>
            <label className="mb-2 block text-sm font-medium text-bv-dark">
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
              className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-bv-dark outline-none transition focus:border-bv-blue ${
                fieldErrors.coverage_amount
                  ? "border-red-400"
                  : "border-bv-card"
              }`}
            />

            {fieldErrors.coverage_amount && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.coverage_amount}
              </p>
            )}
          </div>

          {/* Premium */}

          <div>
            <label className="mb-2 block text-sm font-medium text-bv-dark">
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
              className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-bv-dark outline-none transition focus:border-bv-blue ${
                fieldErrors.premium
                  ? "border-red-400"
                  : "border-bv-card"
              }`}
            />

            {fieldErrors.premium && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.premium}
              </p>
            )}
          </div>
        </div>

        {/* Dates & Status */}

        <div className="border-y border-bv-card px-6 py-5">
          <h2 className="text-lg font-semibold text-bv-dark">
            Policy Period
          </h2>

          <p className="mt-1 text-sm text-bv-gray">
            Set the policy validity period and current status.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 px-6 py-6 md:grid-cols-3">
          {/* Start Date */}

          <div>
            <label className="mb-2 block text-sm font-medium text-bv-dark">
              Start Date
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-bv-dark outline-none transition focus:border-bv-blue ${
                fieldErrors.start_date
                  ? "border-red-400"
                  : "border-bv-card"
              }`}
            />

            {fieldErrors.start_date && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.start_date}
              </p>
            )}
          </div>

          {/* Expiry Date */}

          <div>
            <label className="mb-2 block text-sm font-medium text-bv-dark">
              Expiry Date
              <span className="ml-1 text-red-500">
                *
              </span>
            </label>

            <input
              type="date"
              name="expiry_date"
              value={formData.expiry_date}
              onChange={handleChange}
              className={`w-full rounded-lg border bg-white px-4 py-3 text-sm text-bv-dark outline-none transition focus:border-bv-blue ${
                fieldErrors.expiry_date
                  ? "border-red-400"
                  : "border-bv-card"
              }`}
            />

            {fieldErrors.expiry_date && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.expiry_date}
              </p>
            )}
          </div>

          {/* Status */}

          <div>
            <label className="mb-2 block text-sm font-medium text-bv-dark">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`w-full rounded-lg border border-bv-card bg-white px-4 py-3 text-sm text-bv-dark outline-none transition focus:border-bv-blue ${
                fieldErrors.status
                  ? "border-red-400"
                  : ""
              }`}
            >
              {STATUS_OPTIONS.map((status) => (
                <option
                  key={status.value}
                  value={status.value}
                >
                  {status.label}
                </option>
              ))}
            </select>

            {fieldErrors.status && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.status}
              </p>
            )}
          </div>
        </div>

        {/* Additional Information */}

        <div className="border-y border-bv-card px-6 py-5">
          <h2 className="text-lg font-semibold text-bv-dark">
            Additional Information
          </h2>

          <p className="mt-1 text-sm text-bv-gray">
            Add coverage details and internal notes.
          </p>
        </div>

        <div className="space-y-6 px-6 py-6">
          {/* Coverage Details */}

          <div>
            <label className="mb-2 block text-sm font-medium text-bv-dark">
              Coverage Details
            </label>

            <textarea
              name="coverage_details"
              value={formData.coverage_details}
              onChange={handleChange}
              rows={4}
              placeholder="Describe what this insurance policy covers..."
              className={`w-full resize-none rounded-lg border border-bv-card bg-white px-4 py-3 text-sm text-bv-dark outline-none transition focus:border-bv-blue ${
                fieldErrors.coverage_details
                  ? "border-red-400"
                  : ""
              }`}
            />

            {fieldErrors.coverage_details && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.coverage_details}
              </p>
            )}
          </div>

          {/* Notes */}

          <div>
            <label className="mb-2 block text-sm font-medium text-bv-dark">
              Notes
            </label>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Add internal notes..."
              className={`w-full resize-none rounded-lg border border-bv-card bg-white px-4 py-3 text-sm text-bv-dark outline-none transition focus:border-bv-blue ${
                fieldErrors.notes
                  ? "border-red-400"
                  : ""
              }`}
            />

            {fieldErrors.notes && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.notes}
              </p>
            )}
          </div>
        </div>

        {/* Footer */}

        <div className="flex items-center justify-end gap-3 border-t border-bv-card px-6 py-5">
          <button
            type="button"
            onClick={() =>
              navigate("/insurance-policies")
            }
            disabled={saving}
            className="rounded-lg border border-bv-card bg-white px-5 py-2.5 text-sm font-medium text-bv-dark transition hover:bg-bv-bg disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-bv-blue px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                Saving...
              </>
            ) : (
              <>
                <Save size={18} />

                {isEditMode
                  ? "Update Policy"
                  : "Save Policy"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}


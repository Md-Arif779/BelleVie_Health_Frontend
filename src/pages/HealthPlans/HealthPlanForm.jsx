
import { useEffect, useState } from "react";
import { Save, X } from "lucide-react";

import {
  createHealthPlan,
  getHealthPlan,
  updateHealthPlan,
} from "../../services/healthPlanService";

import { getPartners } from "../../services/partnerService";
import { getMembers } from "../../services/memberService";


const INITIAL_FORM_DATA = {
  member: "",
  plan_name: "",
  plan_type: "",
  provider: "",
  coverage_amount: "",
  premium: "",
  start_date: "",
  expiry_date: "",
  status: "ACTIVE",
  coverage_details: "",
  notes: "",
};


const HealthPlanForm = ({
  memberId,
  healthPlanId,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    ...INITIAL_FORM_DATA,
    member: memberId || "",
  });

  const [members, setMembers] = useState([]);
  const [providers, setProviders] = useState([]);

  const [loading, setLoading] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [loadingProviders, setLoadingProviders] = useState(false);

  const [error, setError] = useState("");
  const [memberError, setMemberError] = useState("");
  const [providerError, setProviderError] = useState("");


  /*
   * =========================================================
   * LOAD MEMBERS
   * =========================================================
   *
   * If memberId is already provided, the member dropdown
   * will still load the member list so the selected member
   * can be displayed correctly.
   */
  useEffect(() => {
    const loadMembers = async () => {
      setLoadingMembers(true);
      setMemberError("");

      try {
        const response = await getMembers();

        const memberList = Array.isArray(response)
          ? response
          : response?.results || [];

        setMembers(memberList);
      } catch (error) {
        console.error(
          "Failed to load members:",
          error
        );

        setMemberError(
          "Failed to load members."
        );
      } finally {
        setLoadingMembers(false);
      }
    };

    loadMembers();
  }, []);


  /*
   * =========================================================
   * LOAD INSURANCE PROVIDERS
   * =========================================================
   *
   * Only Partner records with:
   *
   * partner_type = INSURANCE_COMPANY
   *
   * will appear in the Provider dropdown.
   */
  useEffect(() => {
    const loadProviders = async () => {
      setLoadingProviders(true);
      setProviderError("");

      try {
        const response = await getPartners({
          partner_type: "INSURANCE_COMPANY",
        });

        const providerList = Array.isArray(response)
          ? response
          : response?.results || [];

        setProviders(providerList);
      } catch (error) {
        console.error(
          "Failed to load insurance providers:",
          error
        );

        setProviderError(
          "Failed to load insurance providers."
        );
      } finally {
        setLoadingProviders(false);
      }
    };

    loadProviders();
  }, []);


  /*
   * =========================================================
   * LOAD EXISTING HEALTH PLAN
   * =========================================================
   *
   * Used only when editing an existing Health Plan.
   */
  useEffect(() => {
    if (!healthPlanId) {
      return;
    }

    const loadHealthPlan = async () => {
      setLoadingPlan(true);
      setError("");

      try {
        const response = await getHealthPlan(
          healthPlanId
        );

        /*
         * Provider can be returned by the backend as:
         *
         * provider: 2
         *
         * OR:
         *
         * provider: {
         *   id: 2,
         *   name: "..."
         * }
         */
        let providerId = "";

        if (
          response.provider &&
          typeof response.provider === "object"
        ) {
          providerId =
            response.provider.id ||
            response.provider.pk ||
            "";
        } else {
          providerId =
            response.provider || "";
        }


        /*
         * Member can similarly be returned as:
         *
         * member: 1
         *
         * OR:
         *
         * member: {
         *   id: 1,
         *   full_name: "..."
         * }
         */
        let selectedMemberId = "";

        if (
          response.member &&
          typeof response.member === "object"
        ) {
          selectedMemberId =
            response.member.id ||
            response.member.pk ||
            "";
        } else {
          selectedMemberId =
            response.member ||
            memberId ||
            "";
        }


        setFormData({
          member: selectedMemberId,

          plan_name:
            response.plan_name || "",

          plan_type:
            response.plan_type || "",

          provider:
            providerId,

          coverage_amount:
            response.coverage_amount ?? "",

          premium:
            response.premium ?? "",

          start_date:
            response.start_date || "",

          expiry_date:
            response.expiry_date || "",

          status:
            response.status || "ACTIVE",

          coverage_details:
            response.coverage_details || "",

          notes:
            response.notes || "",
        });
      } catch (error) {
        console.error(
          "Failed to load Health Plan:",
          error
        );

        setError(
          error.response?.data?.detail ||
            "Failed to load Health Plan."
        );
      } finally {
        setLoadingPlan(false);
      }
    };

    loadHealthPlan();
  }, [healthPlanId, memberId]);


  /*
   * =========================================================
   * HANDLE INPUT CHANGE
   * =========================================================
   */
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");

    if (name === "member") {
      setMemberError("");
    }

    if (name === "provider") {
      setProviderError("");
    }
  };


  /*
   * =========================================================
   * VALIDATE FORM
   * =========================================================
   */
  const validateForm = () => {
    if (!formData.member) {
      setError("Member is required.");
      return false;
    }

    if (!formData.plan_name.trim()) {
      setError("Plan name is required.");
      return false;
    }

    if (!formData.start_date) {
      setError("Start date is required.");
      return false;
    }

    if (
      formData.expiry_date &&
      formData.expiry_date <
        formData.start_date
    ) {
      setError(
        "Expiry date cannot be earlier than start date."
      );
      return false;
    }

    if (
      formData.coverage_amount !== "" &&
      Number(formData.coverage_amount) < 0
    ) {
      setError(
        "Coverage amount cannot be negative."
      );
      return false;
    }

    if (
      formData.premium !== "" &&
      Number(formData.premium) < 0
    ) {
      setError(
        "Premium cannot be negative."
      );
      return false;
    }

    return true;
  };


  /*
   * =========================================================
   * SUBMIT HEALTH PLAN
   * =========================================================
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!validateForm()) {
      return;
    }


    /*
     * Backend payload
     */
    const payload = {
      member: Number(formData.member),

      plan_name:
        formData.plan_name.trim(),

      plan_type:
        formData.plan_type.trim() || null,

      provider:
        formData.provider
          ? Number(formData.provider)
          : null,

      coverage_amount:
        formData.coverage_amount === ""
          ? 0
          : Number(formData.coverage_amount),

      premium:
        formData.premium === ""
          ? 0
          : Number(formData.premium),

      start_date:
        formData.start_date,

      expiry_date:
        formData.expiry_date || null,

      status:
        formData.status,

      coverage_details:
        formData.coverage_details.trim() ||
        null,

      notes:
        formData.notes.trim() || null,
    };


    console.log(
      "Health Plan Payload:",
      payload
    );


    setLoading(true);

    try {
      let response;

      if (healthPlanId) {
        response = await updateHealthPlan(
          healthPlanId,
          payload
        );
      } else {
        response = await createHealthPlan(
          payload
        );
      }

      console.log(
        "Health Plan saved successfully:",
        response
      );

      if (onSuccess) {
        onSuccess(response);
      }
    } catch (error) {
      console.error(
        "Health Plan save error:",
        error
      );

      console.error(
        "Backend Error Response:",
        error.response?.data
      );

      const backendError =
        error.response?.data;

      if (
        backendError &&
        typeof backendError === "object"
      ) {
        if (backendError.detail) {
          setError(
            backendError.detail
          );
        } else if (backendError.message) {
          setError(
            backendError.message
          );
        } else {
          const fieldErrors =
            Object.entries(
              backendError
            )
              .map(
                ([field, messages]) => {
                  const message =
                    Array.isArray(messages)
                      ? messages.join(" ")
                      : String(messages);

                  return `${field}: ${message}`;
                }
              )
              .join(" | ");

          setError(
            fieldErrors ||
              "Failed to save Health Plan."
          );
        }
      } else {
        setError(
          "Failed to save Health Plan."
        );
      }
    } finally {
      setLoading(false);
    }
  };


  /*
   * =========================================================
   * LOADING EXISTING PLAN
   * =========================================================
   */
  if (loadingPlan) {
    return (
      <div className="flex items-center justify-center py-10">
        <p className="text-sm text-[#7A7A7A]">
          Loading Health Plan...
        </p>
      </div>
    );
  }


  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >

      {/* ================================================= */}
      {/* ERROR */}
      {/* ================================================= */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-600">
            {error}
          </p>
        </div>
      )}


      {/* ================================================= */}
      {/* PLAN INFORMATION */}
      {/* ================================================= */}

      <div>
        <h3 className="mb-4 text-base font-semibold text-[#212121]">
          Plan Information
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

          {/* ================================================= */}
          {/* MEMBER */}
          {/* ================================================= */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#212121]">
              Member
              <span className="text-red-500">
                {" "}*
              </span>
            </label>

            <select
              name="member"
              value={formData.member}
              onChange={handleChange}
              disabled={
                loadingMembers ||
                Boolean(memberId)
              }
              className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#2F6FED] focus:ring-1 focus:ring-[#2F6FED] disabled:cursor-not-allowed disabled:bg-[#F5F5F5]"
            >
              <option value="">
                {loadingMembers
                  ? "Loading Members..."
                  : "Select Member"}
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

            {memberError && (
              <p className="mt-1 text-xs text-red-500">
                {memberError}
              </p>
            )}

            {!loadingMembers &&
              !memberError &&
              members.length === 0 && (
                <p className="mt-1 text-xs text-[#7A7A7A]">
                  No members available.
                </p>
              )}

            {memberId && (
              <p className="mt-1 text-xs text-[#7A7A7A]">
                Member is fixed for this Health Plan.
              </p>
            )}
          </div>


          {/* ================================================= */}
          {/* PLAN NAME */}
          {/* ================================================= */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#212121]">
              Plan Name
              <span className="text-red-500">
                {" "}*
              </span>
            </label>

            <input
              type="text"
              name="plan_name"
              value={formData.plan_name}
              onChange={handleChange}
              placeholder="Enter plan name"
              className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none transition focus:border-[#2F6FED] focus:ring-1 focus:ring-[#2F6FED]"
            />
          </div>


          {/* ================================================= */}
          {/* PLAN TYPE */}
          {/* ================================================= */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#212121]">
              Plan Type
            </label>

            <input
              type="text"
              name="plan_type"
              value={formData.plan_type}
              onChange={handleChange}
              placeholder="e.g. Family, Individual"
              className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none transition focus:border-[#2F6FED] focus:ring-1 focus:ring-[#2F6FED]"
            />
          </div>


          {/* ================================================= */}
          {/* PROVIDER */}
          {/* ================================================= */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#212121]">
              Provider
            </label>

            <select
              name="provider"
              value={formData.provider}
              onChange={handleChange}
              disabled={loadingProviders}
              className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#2F6FED] focus:ring-1 focus:ring-[#2F6FED] disabled:cursor-not-allowed disabled:bg-[#F5F5F5]"
            >
              <option value="">
                {loadingProviders
                  ? "Loading Providers..."
                  : "Select Provider"}
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

            {providerError && (
              <p className="mt-1 text-xs text-red-500">
                {providerError}
              </p>
            )}

            {!loadingProviders &&
              !providerError &&
              providers.length === 0 && (
                <p className="mt-1 text-xs text-[#7A7A7A]">
                  No insurance providers available.
                </p>
              )}
          </div>


          {/* ================================================= */}
          {/* STATUS */}
          {/* ================================================= */}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#212121]">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#2F6FED] focus:ring-1 focus:ring-[#2F6FED]"
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

        </div>
      </div>


      {/* ================================================= */}
      {/* FINANCIAL INFORMATION */}
      {/* ================================================= */}

      <div>
        <h3 className="mb-4 text-base font-semibold text-[#212121]">
          Financial Information
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

          {/* Coverage Amount */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#212121]">
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
              className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none transition focus:border-[#2F6FED] focus:ring-1 focus:ring-[#2F6FED]"
            />
          </div>


          {/* Premium */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#212121]">
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
              className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none transition focus:border-[#2F6FED] focus:ring-1 focus:ring-[#2F6FED]"
            />
          </div>

        </div>
      </div>


      {/* ================================================= */}
      {/* PLAN DATES */}
      {/* ================================================= */}

      <div>
        <h3 className="mb-4 text-base font-semibold text-[#212121]">
          Plan Dates
        </h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

          {/* Start Date */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#212121]">
              Start Date
              <span className="text-red-500">
                {" "}*
              </span>
            </label>

            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none transition focus:border-[#2F6FED] focus:ring-1 focus:ring-[#2F6FED]"
            />
          </div>


          {/* Expiry Date */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[#212121]">
              Expiry Date
            </label>

            <input
              type="date"
              name="expiry_date"
              value={formData.expiry_date}
              onChange={handleChange}
              min={
                formData.start_date ||
                undefined
              }
              className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none transition focus:border-[#2F6FED] focus:ring-1 focus:ring-[#2F6FED]"
            />
          </div>

        </div>
      </div>


      {/* ================================================= */}
      {/* COVERAGE DETAILS */}
      {/* ================================================= */}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#212121]">
          Coverage Details
        </label>

        <textarea
          name="coverage_details"
          value={formData.coverage_details}
          onChange={handleChange}
          rows={4}
          placeholder="Enter coverage details..."
          className="w-full resize-none rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none transition focus:border-[#2F6FED] focus:ring-1 focus:ring-[#2F6FED]"
        />
      </div>


      {/* ================================================= */}
      {/* NOTES */}
      {/* ================================================= */}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-[#212121]">
          Notes
        </label>

        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Enter notes..."
          className="w-full resize-none rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none transition focus:border-[#2F6FED] focus:ring-1 focus:ring-[#2F6FED]"
        />
      </div>


      {/* ================================================= */}
      {/* ACTIONS */}
      {/* ================================================= */}

      <div className="flex items-center justify-end gap-3 border-t border-[#EEEEEE] pt-5">

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm font-medium text-[#212121] transition hover:bg-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={17} />
            Cancel
          </button>
        )}


        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg bg-[#2F6FED] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#255ED0] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save size={17} />

          {loading
            ? "Saving..."
            : healthPlanId
            ? "Update Health Plan"
            : "Save Health Plan"}
        </button>

      </div>

    </form>
  );
};


export default HealthPlanForm;

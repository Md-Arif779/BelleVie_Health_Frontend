import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import {
  createHealthCard,
  getHealthCard,
  updateHealthCard,
} from "../../services/healthCardService";

import { getMembers } from "../../services/memberService";

const HealthCardForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    member: "",
    plan_name: "",
    issue_date: "",
    expiry_date: "",
    premium: "0",
    status: "ACTIVE",
    renewal_date: "",
  });

  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditMode);
  const [membersLoading, setMembersLoading] = useState(true);

  const [error, setError] = useState("");

  // ============================================
  // LOAD MEMBERS
  // ============================================
  useEffect(() => {
    const loadMembers = async () => {
      try {
        setMembersLoading(true);

        const data = await getMembers();

        const results = Array.isArray(data)
          ? data
          : data?.results || [];

        setMembers(results);
      } catch (err) {
        console.error("Members Load Error:", err);
        setError("Failed to load members.");
      } finally {
        setMembersLoading(false);
      }
    };

    loadMembers();
  }, []);

  // ============================================
  // LOAD HEALTH CARD FOR EDIT
  // ============================================
  useEffect(() => {
    if (!isEditMode) {
      setPageLoading(false);
      return;
    }

    const loadHealthCard = async () => {
      try {
        setPageLoading(true);
        setError("");

        const data = await getHealthCard(id);

        setFormData({
          member:
            typeof data.member === "object"
              ? data.member?.id || ""
              : data.member || "",

          plan_name: data.plan_name || "",

          issue_date: data.issue_date || "",

          expiry_date: data.expiry_date || "",

          premium:
            data.premium !== undefined && data.premium !== null
              ? String(data.premium)
              : "0",

          status: data.status || "ACTIVE",

          renewal_date: data.renewal_date || "",
        });
      } catch (err) {
        console.error("Health Card Load Error:", err);

        setError("Failed to load health card.");
      } finally {
        setPageLoading(false);
      }
    };

    loadHealthCard();
  }, [id, isEditMode]);

  // ============================================
  // HANDLE INPUT CHANGE
  // ============================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ============================================
  // HANDLE SUBMIT
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Member validation
    if (!formData.member) {
      setError("Member is required.");
      return;
    }

    // Plan name validation
    if (!formData.plan_name.trim()) {
      setError("Plan name is required.");
      return;
    }

    // Issue date validation
    if (!formData.issue_date) {
      setError("Issue date is required.");
      return;
    }

    // Expiry date validation
    if (!formData.expiry_date) {
      setError("Expiry date is required.");
      return;
    }

    // Date validation
    if (formData.expiry_date < formData.issue_date) {
      setError("Expiry date cannot be earlier than issue date.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        member: formData.member,
        plan_name: formData.plan_name.trim(),
        issue_date: formData.issue_date,
        expiry_date: formData.expiry_date,
        premium: formData.premium || "0",
        status: formData.status,
        renewal_date: formData.renewal_date || null,
      };

      console.log("Health Card Payload:", payload);

      if (isEditMode) {
        await updateHealthCard(id, payload);
      } else {
        await createHealthCard(payload);
      }

      navigate("/health-cards");
    } catch (err) {
      console.error("Health Card Save Error:", err);

      const responseData = err.response?.data;

      if (responseData && typeof responseData === "object") {
        const messages = Object.entries(responseData)
          .map(([field, message]) => {
            const text = Array.isArray(message)
              ? message.join(", ")
              : String(message);

            return `${field}: ${text}`;
          })
          .join("\n");

        setError(
          messages || "Failed to save health card."
        );
      } else {
        setError("Failed to save health card.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // PAGE LOADING
  // ============================================
  if (pageLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-[#7A7A7A]">
          Loading health card...
        </p>
      </div>
    );
  }

  // ============================================
  // UI
  // ============================================
  return (
    <div className="p-6">
      {/* ========================================
          HEADER
      ======================================== */}
      <div className="flex items-center gap-4 mb-6">
        <button
          type="button"
          onClick={() => navigate("/health-cards")}
          className="
            w-10
            h-10
            rounded-lg
            border
            border-[#E5E7EB]
            bg-white
            flex
            items-center
            justify-center
            text-[#7A7A7A]
            hover:bg-[#F2F2F2]
            transition
          "
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-[#212121]">
            {isEditMode
              ? "Edit Health Card"
              : "Add Health Card"}
          </h1>

          <p className="text-sm text-[#7A7A7A] mt-1">
            {isEditMode
              ? "Update health card information"
              : "Create a new health card"}
          </p>
        </div>
      </div>

      {/* ========================================
          FORM CARD
      ======================================== */}
      <div className="max-w-3xl bg-white rounded-2xl border border-[#E5E7EB] p-6">
        {/* ERROR MESSAGE */}
        {error && (
          <div
            className="
              mb-5
              rounded-lg
              bg-red-50
              border
              border-red-200
              px-4
              py-3
              text-sm
              text-red-600
              whitespace-pre-line
            "
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* ======================================
              MEMBER DROPDOWN
          ====================================== */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-[#212121] mb-2">
              Member
              <span className="text-red-500 ml-1">
                *
              </span>
            </label>

            <select
              name="member"
              value={formData.member}
              onChange={handleChange}
              disabled={membersLoading}
              className="
                w-full
                h-11
                rounded-lg
                border
                border-[#E5E7EB]
                bg-white
                px-4
                text-sm
                text-[#212121]
                outline-none
                focus:border-[#2F6FED]
                focus:ring-2
                focus:ring-[#2F6FED]/10
                disabled:bg-[#F2F2F2]
                disabled:cursor-not-allowed
              "
            >
              <option value="">
                {membersLoading
                  ? "Loading members..."
                  : members.length === 0
                  ? "No members available"
                  : "Select Member"}
              </option>

              {members.map((member) => (
                <option
                  key={member.id}
                  value={member.id}
                >
                  {member.member_id} — {member.full_name}
                </option>
              ))}
            </select>

            <p className="text-xs text-[#7A7A7A] mt-2">
              Select the member who will receive this
              health card.
            </p>
          </div>

          {/* ======================================
              PLAN NAME
          ====================================== */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-[#212121] mb-2">
              Plan Name
              <span className="text-red-500 ml-1">
                *
              </span>
            </label>

            <input
              type="text"
              name="plan_name"
              value={formData.plan_name}
              onChange={handleChange}
              placeholder="Enter health plan name"
              className="
                w-full
                h-11
                rounded-lg
                border
                border-[#E5E7EB]
                px-4
                text-sm
                text-[#212121]
                outline-none
                focus:border-[#2F6FED]
                focus:ring-2
                focus:ring-[#2F6FED]/10
              "
            />
          </div>

          {/* ======================================
              ISSUE + EXPIRY DATE
          ====================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* ISSUE DATE */}
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-2">
                Issue Date
                <span className="text-red-500 ml-1">
                  *
                </span>
              </label>

              <input
                type="date"
                name="issue_date"
                value={formData.issue_date}
                onChange={handleChange}
                className="
                  w-full
                  h-11
                  rounded-lg
                  border
                  border-[#E5E7EB]
                  px-4
                  text-sm
                  text-[#212121]
                  outline-none
                  focus:border-[#2F6FED]
                  focus:ring-2
                  focus:ring-[#2F6FED]/10
                "
              />
            </div>

            {/* EXPIRY DATE */}
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-2">
                Expiry Date
                <span className="text-red-500 ml-1">
                  *
                </span>
              </label>

              <input
                type="date"
                name="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
                className="
                  w-full
                  h-11
                  rounded-lg
                  border
                  border-[#E5E7EB]
                  px-4
                  text-sm
                  text-[#212121]
                  outline-none
                  focus:border-[#2F6FED]
                  focus:ring-2
                  focus:ring-[#2F6FED]/10
                "
              />
            </div>
          </div>

          {/* ======================================
              PREMIUM + RENEWAL DATE
          ====================================== */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
            {/* PREMIUM */}
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-2">
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
                className="
                  w-full
                  h-11
                  rounded-lg
                  border
                  border-[#E5E7EB]
                  px-4
                  text-sm
                  text-[#212121]
                  outline-none
                  focus:border-[#2F6FED]
                  focus:ring-2
                  focus:ring-[#2F6FED]/10
                "
              />
            </div>

            {/* RENEWAL DATE */}
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-2">
                Renewal Date
              </label>

              <input
                type="date"
                name="renewal_date"
                value={formData.renewal_date}
                onChange={handleChange}
                className="
                  w-full
                  h-11
                  rounded-lg
                  border
                  border-[#E5E7EB]
                  px-4
                  text-sm
                  text-[#212121]
                  outline-none
                  focus:border-[#2F6FED]
                  focus:ring-2
                  focus:ring-[#2F6FED]/10
                "
              />
            </div>
          </div>

          {/* ======================================
              STATUS
          ====================================== */}
          <div className="mt-5">
            <label className="block text-sm font-medium text-[#212121] mb-2">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="
                w-full
                h-11
                rounded-lg
                border
                border-[#E5E7EB]
                px-4
                text-sm
                text-[#212121]
                bg-white
                outline-none
                focus:border-[#2F6FED]
                focus:ring-2
                focus:ring-[#2F6FED]/10
              "
            >
              <option value="ACTIVE">
                Active
              </option>

              <option value="EXPIRED">
                Expired
              </option>

              <option value="SUSPENDED">
                Suspended
              </option>

              <option value="CANCELLED">
                Cancelled
              </option>
            </select>
          </div>

          {/* ======================================
              BUTTONS
          ====================================== */}
          <div className="flex justify-end gap-3 mt-8">
            {/* CANCEL */}
            <button
              type="button"
              onClick={() => navigate("/health-cards")}
              className="
                px-5
                h-11
                rounded-lg
                border
                border-[#E5E7EB]
                bg-white
                text-sm
                font-medium
                text-[#212121]
                hover:bg-[#F2F2F2]
                transition
              "
            >
              Cancel
            </button>

            {/* SAVE / UPDATE */}
            <button
              type="submit"
              disabled={loading || membersLoading}
              className="
                px-5
                h-11
                rounded-lg
                bg-[#2F6FED]
                text-white
                text-sm
                font-medium
                flex
                items-center
                gap-2
                hover:bg-[#2459C7]
                disabled:opacity-60
                disabled:cursor-not-allowed
                transition
              "
            >
              <Save size={18} />

              {loading
                ? "Saving..."
                : isEditMode
                ? "Update Health Card"
                : "Save Health Card"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HealthCardForm;
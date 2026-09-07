import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  RefreshCw,
  MessageSquare,
  UserRound,
  Building2,
  BriefcaseBusiness,
  CalendarDays,
  Clock,
  AlertCircle,
} from "lucide-react";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const CRMInteractionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const isEdit = Boolean(id);

  const [members, setMembers] = useState([]);
  const [partners, setPartners] = useState([]);
  const [organizations, setOrganizations] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    member: "",
    partner: "",
    organization: "",
    interaction_type: "CALL",
    subject: "",
    description: "",
    interaction_date: "",
    follow_up_date: "",
    assigned_to: "",
    status: "OPEN",
    priority: "MEDIUM",
    notes: "",
  });

  const normalizeList = (response) => {
    if (Array.isArray(response.data)) {
      return response.data;
    }

    return response.data?.results || [];
  };

  const loadDropdownData = async () => {
    try {
      setError("");

      const requests = [
        api.get("/members/"),
        api.get("/partners/"),
        api.get("/organizations/"),
      ];

      const [
        membersResponse,
        partnersResponse,
        organizationsResponse,
      ] = await Promise.all(requests);

      setMembers(
        normalizeList(membersResponse)
      );

      setPartners(
        normalizeList(partnersResponse)
      );

      setOrganizations(
        normalizeList(
          organizationsResponse
        )
      );
    } catch (err) {
      console.error(
        "CRM Dropdown Data Error:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Failed to load CRM dropdown data."
      );
    }
  };

  const loadInteraction = async () => {
    if (!id) return;

    try {
      const response = await api.get(
        `/crm/${id}/`
      );

      const data = response.data;

      setForm({
        member: data.member || "",
        partner: data.partner || "",
        organization:
          data.organization || "",
        interaction_type:
          data.interaction_type || "CALL",
        subject: data.subject || "",
        description:
          data.description || "",
        interaction_date:
          data.interaction_date
            ? data.interaction_date.slice(
                0,
                16
              )
            : "",
        follow_up_date:
          data.follow_up_date
            ? data.follow_up_date.slice(
                0,
                16
              )
            : "",
        assigned_to:
          data.assigned_to || "",
        status:
          data.status || "OPEN",
        priority:
          data.priority || "MEDIUM",
        notes: data.notes || "",
      });
    } catch (err) {
      console.error(
        "CRM Details Load Error:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Failed to load CRM interaction."
      );
    }
  };

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);

      await loadDropdownData();

      if (isEdit) {
        await loadInteraction();
      } else {
        // Default assigned user = logged-in user
        if (user?.id) {
          setForm((prev) => ({
            ...prev,
            assigned_to: user.id,
          }));
        }
      }

      setLoading(false);
    };

    initialize();
  }, [id, isEdit, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const payload = {
        member: Number(form.member),
        partner: form.partner
          ? Number(form.partner)
          : null,
        organization: form.organization
          ? Number(form.organization)
          : null,
        interaction_type:
          form.interaction_type,
        subject: form.subject,
        description:
          form.description,
        interaction_date:
          form.interaction_date,
        follow_up_date:
          form.follow_up_date || null,
        assigned_to:
          form.assigned_to
            ? Number(form.assigned_to)
            : null,
        status: form.status,
        priority: form.priority,
        notes: form.notes,
      };

      if (isEdit) {
        await api.put(
          `/crm/${id}/`,
          payload
        );
      } else {
        await api.post(
          "/crm/",
          payload
        );
      }

      navigate("/crm");
    } catch (err) {
      console.error(
        "CRM Save Error:",
        err
      );

      const data = err.response?.data;

      if (data && typeof data === "object") {
        const messages = Object.entries(
          data
        )
          .map(
            ([field, message]) =>
              `${field}: ${
                Array.isArray(message)
                  ? message.join(", ")
                  : message
              }`
          )
          .join("\n");

        setError(
          messages ||
            "Failed to save CRM interaction."
        );
      } else {
        setError(
          "Failed to save CRM interaction."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  const formatName = (item) => {
    return (
      item.full_name ||
      item.name ||
      item.username ||
      "Unnamed"
    );
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white border border-[#E5E7EB] rounded-2xl p-10 text-center">
          <div className="mx-auto w-10 h-10 border-4 border-[#EEF4FF] border-t-[#2F6FED] rounded-full animate-spin" />

          <p className="mt-4 text-sm text-[#7A7A7A]">
            Loading CRM form...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* Header */}
      <div className="mb-6">

        <button
          onClick={() =>
            navigate("/crm")
          }
          className="
            flex
            items-center
            gap-2
            text-sm
            font-semibold
            text-[#7A7A7A]
            hover:text-[#2F6FED]
            mb-3
          "
        >
          <ArrowLeft size={17} />
          Back to CRM
        </button>

        <div className="flex items-center gap-3">

          <div className="w-12 h-12 rounded-xl bg-[#EEF4FF] flex items-center justify-center text-[#2F6FED]">
            <MessageSquare size={23} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#212121]">
              {isEdit
                ? "Edit CRM Interaction"
                : "Add CRM Interaction"}
            </h1>

            <p className="text-sm text-[#7A7A7A] mt-1">
              Record and manage CRM communication.
            </p>
          </div>

        </div>

      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-100 rounded-xl p-4 flex gap-3">
          <AlertCircle
            size={18}
            className="text-red-500 shrink-0 mt-0.5"
          />

          <pre className="text-sm text-red-600 whitespace-pre-wrap font-sans">
            {error}
          </pre>
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* Related Information */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl mb-6">

          <div className="px-5 py-4 border-b border-[#E5E7EB]">
            <h2 className="text-sm font-bold text-[#212121]">
              Related Information
            </h2>
          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* Member */}
            <div>
              <label className="block text-xs font-semibold text-[#4B5563] mb-2">
                Member *
              </label>

              <div className="relative">

                <UserRound
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                />

                <select
                  name="member"
                  value={form.member}
                  onChange={handleChange}
                  required
                  className="
                    w-full
                    pl-10
                    pr-4
                    py-2.5
                    rounded-xl
                    border
                    border-[#E5E7EB]
                    text-sm
                    bg-white
                    outline-none
                    focus:border-[#2F6FED]
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
                      {formatName(member)}
                    </option>
                  ))}
                </select>

              </div>
            </div>

            {/* Partner */}
            <div>
              <label className="block text-xs font-semibold text-[#4B5563] mb-2">
                Partner
              </label>

              <div className="relative">

                <BriefcaseBusiness
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                />

                <select
                  name="partner"
                  value={form.partner}
                  onChange={handleChange}
                  className="
                    w-full
                    pl-10
                    pr-4
                    py-2.5
                    rounded-xl
                    border
                    border-[#E5E7EB]
                    text-sm
                    bg-white
                    outline-none
                    focus:border-[#2F6FED]
                  "
                >
                  <option value="">
                    Select Partner
                  </option>

                  {partners.map((partner) => (
                    <option
                      key={partner.id}
                      value={partner.id}
                    >
                      {partner.partner_id} -{" "}
                      {partner.name}
                    </option>
                  ))}
                </select>

              </div>
            </div>

            {/* Organization */}
            <div>
              <label className="block text-xs font-semibold text-[#4B5563] mb-2">
                Organization
              </label>

              <div className="relative">

                <Building2
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                />

                <select
                  name="organization"
                  value={form.organization}
                  onChange={handleChange}
                  className="
                    w-full
                    pl-10
                    pr-4
                    py-2.5
                    rounded-xl
                    border
                    border-[#E5E7EB]
                    text-sm
                    bg-white
                    outline-none
                    focus:border-[#2F6FED]
                  "
                >
                  <option value="">
                    Select Organization
                  </option>

                  {organizations.map(
                    (organization) => (
                      <option
                        key={organization.id}
                        value={organization.id}
                      >
                        {organization.organization_id
                          ? `${organization.organization_id} - `
                          : ""}
                        {formatName(
                          organization
                        )}
                      </option>
                    )
                  )}
                </select>

              </div>
            </div>

          </div>
        </div>

        {/* Interaction Information */}
        <div className="bg-white border border-[#E5E7EB] rounded-2xl mb-6">

          <div className="px-5 py-4 border-b border-[#E5E7EB]">
            <h2 className="text-sm font-bold text-[#212121]">
              Interaction Information
            </h2>
          </div>

          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Type */}
            <div>
              <label className="block text-xs font-semibold text-[#4B5563] mb-2">
                Interaction Type *
              </label>

              <select
                name="interaction_type"
                value={
                  form.interaction_type
                }
                onChange={handleChange}
                required
                className="
                  w-full
                  px-4
                  py-2.5
                  rounded-xl
                  border
                  border-[#E5E7EB]
                  text-sm
                  bg-white
                  outline-none
                  focus:border-[#2F6FED]
                "
              >
                <option value="CALL">
                  Call
                </option>
                <option value="EMAIL">
                  Email
                </option>
                <option value="MEETING">
                  Meeting
                </option>
                <option value="FOLLOW_UP">
                  Follow Up
                </option>
                <option value="COMPLAINT">
                  Complaint
                </option>
                <option value="INQUIRY">
                  Inquiry
                </option>
                <option value="SUPPORT">
                  Support
                </option>
                <option value="OTHER">
                  Other
                </option>
              </select>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-semibold text-[#4B5563] mb-2">
                Subject *
              </label>

              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                required
                maxLength={200}
                placeholder="Enter interaction subject"
                className="
                  w-full
                  px-4
                  py-2.5
                  rounded-xl
                  border
                  border-[#E5E7EB]
                  text-sm
                  outline-none
                  focus:border-[#2F6FED]
                "
              />
            </div>

            {/* Interaction Date */}
            <div>
              <label className="block text-xs font-semibold text-[#4B5563] mb-2">
                Interaction Date *
              </label>

              <div className="relative">

                <CalendarDays
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                />

                <input
                  type="datetime-local"
                  name="interaction_date"
                  value={
                    form.interaction_date
                  }
                  onChange={handleChange}
                  required
                  className="
                    w-full
                    pl-10
                    pr-4
                    py-2.5
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

            {/* Follow Up */}
            <div>
              <label className="block text-xs font-semibold text-[#4B5563] mb-2">
                Follow-up Date
              </label>

              <div className="relative">

                <Clock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                />

                <input
                  type="datetime-local"
                  name="follow_up_date"
                  value={
                    form.follow_up_date
                  }
                  onChange={handleChange}
                  className="
                    w-full
                    pl-10
                    pr-4
                    py-2.5
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

            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-[#4B5563] mb-2">
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="
                  w-full
                  px-4
                  py-2.5
                  rounded-xl
                  border
                  border-[#E5E7EB]
                  text-sm
                  bg-white
                  outline-none
                  focus:border-[#2F6FED]
                "
              >
                <option value="OPEN">
                  Open
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

            {/* Priority */}
            <div>
              <label className="block text-xs font-semibold text-[#4B5563] mb-2">
                Priority
              </label>

              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="
                  w-full
                  px-4
                  py-2.5
                  rounded-xl
                  border
                  border-[#E5E7EB]
                  text-sm
                  bg-white
                  outline-none
                  focus:border-[#2F6FED]
                "
              >
                <option value="LOW">
                  Low
                </option>

                <option value="MEDIUM">
                  Medium
                </option>

                <option value="HIGH">
                  High
                </option>

                <option value="URGENT">
                  Urgent
                </option>
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#4B5563] mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="4"
                placeholder="Enter interaction details..."
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

            {/* Notes */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-[#4B5563] mb-2">
                Notes
              </label>

              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows="4"
                placeholder="Additional notes..."
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

        {/* Actions */}
        <div className="flex justify-end gap-3">

          <button
            type="button"
            onClick={() =>
              navigate("/crm")
            }
            className="
              px-5
              py-2.5
              rounded-xl
              border
              border-[#E5E7EB]
              text-sm
              font-semibold
              text-[#4B5563]
              hover:bg-[#F8FAFC]
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="
              flex
              items-center
              gap-2
              px-5
              py-2.5
              rounded-xl
              bg-[#2F6FED]
              text-white
              text-sm
              font-semibold
              hover:bg-[#255ED0]
              disabled:opacity-60
            "
          >
            {saving ? (
              <RefreshCw
                size={16}
                className="animate-spin"
              />
            ) : (
              <Save size={16} />
            )}

            {saving
              ? "Saving..."
              : isEdit
              ? "Update Interaction"
              : "Create Interaction"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default CRMInteractionForm;
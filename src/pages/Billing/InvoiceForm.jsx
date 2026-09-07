import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  RefreshCw,
  FileText,
  Calculator,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import {
  getInvoice,
  createInvoice,
  updateInvoice,
} from "../../services/billingService";
import api from "../../services/api";
import { canAdd, canEdit } from "../../utils/permission";

const InvoiceForm = () => {
  const { permissions } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [members, setMembers] = useState([]);

  const [formData, setFormData] = useState({
    member: "",
    service_name: "",
    service_reference: "",
    amount: "",
    discount: "0",
    commission: "0",
    due_date: "",
    status: "PENDING",
    description: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [membersLoading, setMembersLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD MEMBERS
  ========================================================= */

  useEffect(() => {
    const loadMembers = async () => {
      try {
        setMembersLoading(true);

        const response = await api.get("/members/");

        const memberData = Array.isArray(response.data)
          ? response.data
          : response.data?.results || [];

        setMembers(memberData);
      } catch (err) {
        console.error("Member List Error:", err);

        setError(
          err?.response?.data?.detail ||
            "Failed to load members."
        );
      } finally {
        setMembersLoading(false);
      }
    };

    loadMembers();
  }, []);

  /* =========================================================
     LOAD INVOICE FOR EDIT
  ========================================================= */

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const loadInvoice = async () => {
      try {
        setInitialLoading(true);
        setError("");

        const data = await getInvoice(id);

        setFormData({
          member: data.member ?? "",
          service_name: data.service_name ?? "",
          service_reference: data.service_reference ?? "",
          amount: data.amount ?? "",
          discount: data.discount ?? "0",
          commission: data.commission ?? "0",
          due_date: data.due_date ?? "",
          status: data.status ?? "PENDING",
          description: data.description ?? "",
          notes: data.notes ?? "",
        });
      } catch (err) {
        console.error("Invoice Load Error:", err);

        setError(
          err?.response?.data?.detail ||
            "Failed to load invoice."
        );
      } finally {
        setInitialLoading(false);
      }
    };

    loadInvoice();
  }, [id, isEditMode]);

  /* =========================================================
     HANDLE CHANGE
  ========================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================================================
     AMOUNT CALCULATION
  ========================================================= */

  const amount = Number(formData.amount || 0);
  const discount = Number(formData.discount || 0);
  const commission = Number(formData.commission || 0);

  const calculatedTotal =
    amount - discount + commission;

  const formatAmount = (value) => {
    return `৳${Number(value || 0).toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.member) {
      setError("Member is required.");
      return;
    }

    if (!formData.service_name.trim()) {
      setError("Service name is required.");
      return;
    }

    if (
      !formData.amount ||
      Number(formData.amount) <= 0
    ) {
      setError("Amount must be greater than 0.");
      return;
    }

    const payload = {
      member: Number(formData.member),

      service_name:
        formData.service_name.trim(),

      service_reference:
        formData.service_reference.trim() || null,

      amount: Number(formData.amount),

      discount:
        Number(formData.discount || 0),

      commission:
        Number(formData.commission || 0),

      due_date:
        formData.due_date || null,

      status: formData.status,

      description:
        formData.description.trim() || null,

      notes:
        formData.notes.trim() || null,
    };

    try {
      setLoading(true);

      if (isEditMode) {
        await updateInvoice(id, payload);
      } else {
        await createInvoice(payload);
      }

      navigate("/invoices");
    } catch (err) {
      console.error("Invoice Save Error:", err);

      const responseData = err?.response?.data;

      if (typeof responseData === "object") {
        const messages = Object.entries(responseData)
          .map(([field, value]) => {
            const message = Array.isArray(value)
              ? value.join(", ")
              : String(value);

            return `${field}: ${message}`;
          })
          .join("\n");

        setError(
          messages || "Failed to save invoice."
        );
      } else {
        setError("Failed to save invoice.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     PERMISSION
  ========================================================= */

  if (
    !isEditMode &&
    !canAdd(permissions, "services")
  ) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-xl border border-[#E5E7EB] p-8 text-center">
          <h2 className="text-xl font-bold text-[#212121]">
            Permission Denied
          </h2>

          <p className="text-sm text-[#7A7A7A] mt-2">
            You do not have permission to create invoices.
          </p>

          <Link
            to="/invoices"
            className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 rounded-lg bg-[#2F6FED] text-white"
          >
            <ArrowLeft size={17} />
            Back to Invoices
          </Link>
        </div>
      </div>
    );
  }

  if (
    isEditMode &&
    !canEdit(permissions, "services")
  ) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-xl border border-[#E5E7EB] p-8 text-center">
          <h2 className="text-xl font-bold text-[#212121]">
            Permission Denied
          </h2>

          <p className="text-sm text-[#7A7A7A] mt-2">
            You do not have permission to edit invoices.
          </p>

          <Link
            to="/invoices"
            className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 rounded-lg bg-[#2F6FED] text-white"
          >
            <ArrowLeft size={17} />
            Back to Invoices
          </Link>
        </div>
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">
        <div className="flex justify-center items-center py-20">
          <RefreshCw
            size={28}
            className="animate-spin text-[#2F6FED]"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">

      {/* Header */}

      <div className="max-w-5xl mx-auto mb-6">

        <Link
          to="/invoices"
          className="inline-flex items-center gap-2 text-sm text-[#7A7A7A] hover:text-[#2F6FED] mb-4"
        >
          <ArrowLeft size={17} />
          Back to Invoices
        </Link>

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-[#EEF4FF] flex items-center justify-center">
            <FileText
              size={23}
              className="text-[#2F6FED]"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#212121]">
              {isEditMode
                ? "Edit Invoice"
                : "Create Invoice"}
            </h1>

            <p className="text-sm text-[#7A7A7A]">
              {isEditMode
                ? "Update invoice information"
                : "Create a new member invoice"}
            </p>
          </div>

        </div>
      </div>

      {/* Error */}

      {error && (
        <div className="max-w-5xl mx-auto mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 whitespace-pre-line">
          {error}
        </div>
      )}

      {/* Form */}

      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto"
      >

        {/* Invoice Information */}

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mb-5">

          <div className="flex items-center gap-2 mb-5">

            <FileText
              size={19}
              className="text-[#2F6FED]"
            />

            <h2 className="text-lg font-semibold text-[#212121]">
              Invoice Information
            </h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Member Dropdown */}

            <div>

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
                required
                disabled={membersLoading}
                className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-white outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#EEF4FF] disabled:bg-[#F9FAFB] disabled:text-[#7A7A7A]"
              >

                <option value="">
                  {membersLoading
                    ? "Loading members..."
                    : "Select Member"}
                </option>

                {members.map((member) => (
                  <option
                    key={member.id}
                    value={member.id}
                  >
                    {member.member_id
                      ? `${member.member_id} — ${member.full_name}`
                      : `${member.full_name} — ID: ${member.id}`}
                  </option>
                ))}

              </select>

              <p className="text-xs text-[#7A7A7A] mt-1.5">
                Select the member for this invoice.
              </p>

            </div>

            {/* Service Name */}

            <div>

              <label className="block text-sm font-medium text-[#212121] mb-2">
                Service Name
                <span className="text-red-500 ml-1">
                  *
                </span>
              </label>

              <input
                type="text"
                name="service_name"
                value={formData.service_name}
                onChange={handleChange}
                placeholder="e.g. Doctor Consultation"
                required
                maxLength={200}
                className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#EEF4FF]"
              />

            </div>

            {/* Service Reference */}

            <div>

              <label className="block text-sm font-medium text-[#212121] mb-2">
                Service Reference
              </label>

              <input
                type="text"
                name="service_reference"
                value={formData.service_reference}
                onChange={handleChange}
                placeholder="e.g. Appointment #123"
                maxLength={100}
                className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#EEF4FF]"
              />

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
                className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-white outline-none focus:border-[#2F6FED]"
              >
                <option value="PENDING">
                  Pending
                </option>

                <option value="PARTIAL">
                  Partial
                </option>

                <option value="PAID">
                  Paid
                </option>

                <option value="CANCELLED">
                  Cancelled
                </option>

                <option value="REFUNDED">
                  Refunded
                </option>
              </select>

            </div>

          </div>

        </div>

        {/* Amount Section */}

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mb-5">

          <div className="flex items-center gap-2 mb-5">

            <Calculator
              size={19}
              className="text-[#2F6FED]"
            />

            <h2 className="text-lg font-semibold text-[#212121]">
              Amount Details
            </h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

            {/* Amount */}

            <div>

              <label className="block text-sm font-medium text-[#212121] mb-2">
                Amount
                <span className="text-red-500 ml-1">
                  *
                </span>
              </label>

              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] outline-none focus:border-[#2F6FED]"
              />

            </div>

            {/* Discount */}

            <div>

              <label className="block text-sm font-medium text-[#212121] mb-2">
                Discount
              </label>

              <input
                type="number"
                name="discount"
                value={formData.discount}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] outline-none focus:border-[#2F6FED]"
              />

            </div>

            {/* Commission */}

            <div>

              <label className="block text-sm font-medium text-[#212121] mb-2">
                Commission
              </label>

              <input
                type="number"
                name="commission"
                value={formData.commission}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] outline-none focus:border-[#2F6FED]"
              />

            </div>

            {/* Total */}

            <div>

              <label className="block text-sm font-medium text-[#212121] mb-2">
                Total Amount
              </label>

              <div className="w-full px-4 py-2.5 rounded-lg bg-[#EEF4FF] border border-[#D9E5FF] text-[#2F6FED] font-bold">
                {formatAmount(calculatedTotal)}
              </div>

              <p className="text-xs text-[#7A7A7A] mt-1.5">
                Amount − Discount + Commission
              </p>

            </div>

          </div>

        </div>

        {/* Due Date & Description */}

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mb-5">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Due Date */}

            <div>

              <label className="block text-sm font-medium text-[#212121] mb-2">
                Due Date
              </label>

              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] outline-none focus:border-[#2F6FED]"
              />

            </div>

            {/* Description */}

            <div>

              <label className="block text-sm font-medium text-[#212121] mb-2">
                Description
              </label>

              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Short description"
                maxLength={255}
                className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] outline-none focus:border-[#2F6FED]"
              />

            </div>

            {/* Notes */}

            <div className="md:col-span-2">

              <label className="block text-sm font-medium text-[#212121] mb-2">
                Notes
              </label>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Additional notes..."
                className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] outline-none focus:border-[#2F6FED] resize-none"
              />

            </div>

          </div>

        </div>

        {/* Actions */}

        <div className="flex justify-end gap-3">

          <Link
            to="/invoices"
            className="px-5 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#212121] hover:bg-[#F9FAFB] transition"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2F6FED] text-white hover:bg-[#2459C7] transition disabled:opacity-60"
          >

            {loading ? (
              <>
                <RefreshCw
                  size={18}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />

                {isEditMode
                  ? "Update Invoice"
                  : "Create Invoice"}
              </>
            )}

          </button>

        </div>

      </form>

    </div>
  );
};

export default InvoiceForm;
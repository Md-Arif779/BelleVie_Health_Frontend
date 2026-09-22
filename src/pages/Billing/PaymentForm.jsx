
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  RefreshCw,
  CreditCard,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import {
  getPayment,
  createPayment,
  updatePayment,
} from "../../services/billingService";
import api from "../../services/api";
import { canAdd, canEdit } from "../../utils/permission";

const PaymentForm = () => {
  const { permissions } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [members, setMembers] = useState([]);
  const [invoices, setInvoices] = useState([]);

  const [membersLoading, setMembersLoading] = useState(true);
  const [invoicesLoading, setInvoicesLoading] = useState(true);

  const [formData, setFormData] = useState({
    member: "",
    invoice: "",
    amount: "",
    payment_method: "CASH",
    transaction_id: "",
    status: "PENDING",
    description: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
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
     LOAD INVOICES
  ========================================================= */

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        setInvoicesLoading(true);

        const response = await api.get(
          "/services/invoices/"
        );

        const invoiceData = Array.isArray(response.data)
          ? response.data
          : response.data?.results || [];

        setInvoices(invoiceData);
      } catch (err) {
        console.error("Invoice List Error:", err);

        setError(
          err?.response?.data?.detail ||
            "Failed to load invoices."
        );
      } finally {
        setInvoicesLoading(false);
      }
    };

    loadInvoices();
  }, []);

  /* =========================================================
     LOAD PAYMENT FOR EDIT
  ========================================================= */

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const loadPayment = async () => {
      try {
        setInitialLoading(true);
        setError("");

        const data = await getPayment(id);

        setFormData({
          member: data.member ?? "",
          invoice: data.invoice ?? "",
          amount: data.amount ?? "",
          payment_method:
            data.payment_method ?? "CASH",
          transaction_id:
            data.transaction_id ?? "",
          status:
            data.status ?? "PENDING",
          description:
            data.description ?? "",
          notes:
            data.notes ?? "",
        });
      } catch (err) {
        console.error(
          "Payment Load Error:",
          err
        );

        setError(
          err?.response?.data?.detail ||
            "Failed to load payment."
        );
      } finally {
        setInitialLoading(false);
      }
    };

    loadPayment();
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
     SELECTED MEMBER
  ========================================================= */

  const selectedMember = members.find(
    (member) =>
      String(member.id) ===
      String(formData.member)
  );

  /* =========================================================
     FILTER INVOICES BY SELECTED MEMBER
  ========================================================= */

  const memberInvoices = invoices.filter(
    (invoice) => {
      if (!formData.member) {
        return true;
      }

      return (
        String(invoice.member) ===
        String(formData.member)
      );
    }
  );

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

    if (
      !formData.amount ||
      Number(formData.amount) <= 0
    ) {
      setError(
        "Amount must be greater than 0."
      );
      return;
    }

    if (!formData.payment_method) {
      setError(
        "Payment method is required."
      );
      return;
    }

    const payload = {
      member: Number(formData.member),

      invoice: formData.invoice
        ? Number(formData.invoice)
        : null,

      amount: Number(formData.amount),

      payment_method:
        formData.payment_method,

      transaction_id:
        formData.transaction_id.trim() ||
        null,

      status: formData.status,

      description:
        formData.description.trim() ||
        null,

      notes:
        formData.notes.trim() || null,
    };

    try {
      setLoading(true);

      if (isEditMode) {
        await updatePayment(id, payload);
      } else {
        await createPayment(payload);
      }

      navigate("/payments");
    } catch (err) {
      console.error(
        "Payment Save Error:",
        err
      );

      const responseData =
        err?.response?.data;

      if (
        responseData &&
        typeof responseData === "object"
      ) {
        const messages = Object.entries(
          responseData
        )
          .map(([field, value]) => {
            const message = Array.isArray(value)
              ? value.join(", ")
              : String(value);

            return `${field}: ${message}`;
          })
          .join("\n");

        setError(
          messages ||
            "Failed to save payment."
        );
      } else {
        setError(
          "Failed to save payment."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     PERMISSION - CREATE
  ========================================================= */

  if (
    !isEditMode &&
    !canAdd(
      permissions,
      "payments"
    )
  ) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">

        <div className="max-w-2xl mx-auto bg-white rounded-xl border border-[#E5E7EB] p-8 text-center">

          <h2 className="text-xl font-bold text-[#212121]">
            Permission Denied
          </h2>

          <p className="text-sm text-[#7A7A7A] mt-2">
            You do not have permission
            to create payments.
          </p>

          <Link
            to="/payments"
            className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 rounded-lg bg-[#2F6FED] text-white"
          >
            <ArrowLeft size={17} />
            Back to Payments
          </Link>

        </div>

      </div>
    );
  }

  /* =========================================================
     PERMISSION - EDIT
  ========================================================= */

  if (
    isEditMode &&
    !canEdit(
      permissions,
      "payments"
    )
  ) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">

        <div className="max-w-2xl mx-auto bg-white rounded-xl border border-[#E5E7EB] p-8 text-center">

          <h2 className="text-xl font-bold text-[#212121]">
            Permission Denied
          </h2>

          <p className="text-sm text-[#7A7A7A] mt-2">
            You do not have permission
            to edit payments.
          </p>

          <Link
            to="/payments"
            className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 rounded-lg bg-[#2F6FED] text-white"
          >
            <ArrowLeft size={17} />
            Back to Payments
          </Link>

        </div>

      </div>
    );
  }

  /* =========================================================
     INITIAL LOADING
  ========================================================= */

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

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="max-w-5xl mx-auto mb-6">

        <Link
          to="/payments"
          className="inline-flex items-center gap-2 text-sm text-[#7A7A7A] hover:text-[#2F6FED] mb-4"
        >
          <ArrowLeft size={17} />
          Back to Payments
        </Link>

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-[#EEF4FF] flex items-center justify-center">

            <CreditCard
              size={23}
              className="text-[#2F6FED]"
            />

          </div>

          <div>

            <h1 className="text-2xl font-bold text-[#212121]">
              {isEditMode
                ? "Edit Payment"
                : "Add Payment"}
            </h1>

            <p className="text-sm text-[#7A7A7A]">
              {isEditMode
                ? "Update payment information"
                : "Create a new member payment record"}
            </p>

          </div>

        </div>

      </div>

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="max-w-5xl mx-auto mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 whitespace-pre-line">
          {error}
        </div>
      )}

      {/* =====================================================
          FORM
      ====================================================== */}

      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto"
      >

        {/* ===================================================
            PAYMENT INFORMATION
        ==================================================== */}

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mb-5">

          <div className="flex items-center gap-2 mb-5">

            <CreditCard
              size={19}
              className="text-[#2F6FED]"
            />

            <h2 className="text-lg font-semibold text-[#212121]">
              Payment Information
            </h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Member */}

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
                onChange={(event) => {
                  handleChange(event);

                  setFormData(
                    (previous) => ({
                      ...previous,
                      invoice: "",
                    })
                  );
                }}
                required
                disabled={membersLoading}
                className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-white outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#EEF4FF] disabled:bg-[#F9FAFB]"
              >

                <option value="">
                  {membersLoading
                    ? "Loading members..."
                    : "Select Member"}
                </option>

                {members.map(
                  (member) => (
                    <option
                      key={member.id}
                      value={member.id}
                    >
                      {member.member_id
                        ? `${member.member_id} — ${member.full_name}`
                        : `${member.full_name} — ID: ${member.id}`}
                    </option>
                  )
                )}

              </select>

              {selectedMember && (
                <p className="text-xs text-[#7A7A7A] mt-1.5">
                  Selected:{" "}
                  {selectedMember.full_name}
                </p>
              )}

            </div>

            {/* Invoice */}

            <div>

              <label className="block text-sm font-medium text-[#212121] mb-2">
                Invoice
              </label>

              <select
                name="invoice"
                value={formData.invoice}
                onChange={handleChange}
                disabled={
                  invoicesLoading ||
                  !formData.member
                }
                className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-white outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#EEF4FF] disabled:bg-[#F9FAFB] disabled:text-[#7A7A7A]"
              >

                <option value="">
                  {!formData.member
                    ? "Select member first"
                    : invoicesLoading
                    ? "Loading invoices..."
                    : memberInvoices.length ===
                      0
                    ? "No invoices found"
                    : "Select Invoice"}
                </option>

                {memberInvoices.map(
                  (invoice) => (
                    <option
                      key={invoice.id}
                      value={invoice.id}
                    >
                      {invoice.invoice_id}
                      {" — "}
                      {invoice.service_name}
                      {" — "}
                      ৳
                      {Number(
                        invoice.total_amount ||
                          0
                      ).toLocaleString(
                        "en-BD"
                      )}
                    </option>
                  )
                )}

              </select>

              <p className="text-xs text-[#7A7A7A] mt-1.5">
                Optional. Only invoices
                belonging to the selected
                member are shown.
              </p>

            </div>

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
                className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#EEF4FF]"
              />

            </div>

            {/* Payment Method */}

            <div>

              <label className="block text-sm font-medium text-[#212121] mb-2">
                Payment Method
                <span className="text-red-500 ml-1">
                  *
                </span>
              </label>

              <select
                name="payment_method"
                value={
                  formData.payment_method
                }
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-white outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#EEF4FF]"
              >

                <option value="CASH">
                  Cash
                </option>

                <option value="BKASH">
                  bKash
                </option>

                <option value="NAGAD">
                  Nagad
                </option>

                <option value="CARD">
                  Card
                </option>

                <option value="BANK">
                  Bank Transfer
                </option>

              </select>

            </div>

            {/* Transaction ID */}

            <div>

              <label className="block text-sm font-medium text-[#212121] mb-2">
                Transaction ID
              </label>

              <input
                type="text"
                name="transaction_id"
                value={
                  formData.transaction_id
                }
                onChange={handleChange}
                placeholder="e.g. TXN123456789"
                maxLength={100}
                className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#EEF4FF]"
              />

              <p className="text-xs text-[#7A7A7A] mt-1.5">
                Required only when
                applicable to the payment
                method.
              </p>

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

                <option value="PAID">
                  Paid
                </option>

                <option value="FAILED">
                  Failed
                </option>

                <option value="REFUNDED">
                  Refunded
                </option>

              </select>

            </div>

          </div>

        </div>

        {/* ===================================================
            DESCRIPTION & NOTES
        ==================================================== */}

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mb-5">

          <h2 className="text-lg font-semibold text-[#212121] mb-5">
            Additional Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Description */}

            <div>

              <label className="block text-sm font-medium text-[#212121] mb-2">
                Description
              </label>

              <input
                type="text"
                name="description"
                value={
                  formData.description
                }
                onChange={handleChange}
                placeholder="Short payment description"
                maxLength={255}
                className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#EEF4FF]"
              />

            </div>

            {/* Notes */}

            <div>

              <label className="block text-sm font-medium text-[#212121] mb-2">
                Notes
              </label>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Additional notes..."
                className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#EEF4FF] resize-none"
              />

            </div>

          </div>

        </div>

        {/* ===================================================
            ACTIONS
        ==================================================== */}

        <div className="flex justify-end gap-3">

          <Link
            to="/payments"
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
                  ? "Update Payment"
                  : "Create Payment"}
              </>
            )}

          </button>

        </div>

      </form>

    </div>
  );
};

export default PaymentForm;

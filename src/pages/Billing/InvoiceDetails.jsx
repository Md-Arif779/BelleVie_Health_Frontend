import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  RefreshCw,
  FileText,
  User,
  Calendar,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import {
  getInvoice,
  deleteInvoice,
} from "../../services/billingService";
import {
  canEdit,
  canDelete,
} from "../../utils/permission";

const InvoiceDetails = () => {
  const { permissions } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const loadInvoice = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getInvoice(id);
      setInvoice(data);
    } catch (err) {
      console.error("Invoice Details Error:", err);

      setError(
        err?.response?.data?.detail ||
          "Failed to load invoice details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoice();
  }, [id]);

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this invoice?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      await deleteInvoice(id);

      navigate("/invoices");
    } catch (err) {
      console.error("Delete Invoice Error:", err);

      alert(
        err?.response?.data?.detail ||
          "Failed to delete invoice."
      );
    } finally {
      setDeleting(false);
    }
  };

  const formatAmount = (amount) => {
    return `৳${Number(amount || 0).toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-700";

      case "PARTIAL":
        return "bg-yellow-100 text-yellow-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      case "REFUNDED":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PAID":
        return <CheckCircle2 size={16} />;

      case "CANCELLED":
        return <AlertCircle size={16} />;

      case "PARTIAL":
      case "PENDING":
        return <Clock size={16} />;

      default:
        return <FileText size={16} />;
    }
  };

  if (loading) {
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

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-xl border border-[#E5E7EB] p-8 text-center">

          <AlertCircle
            size={42}
            className="mx-auto text-red-500 mb-3"
          />

          <h2 className="text-xl font-bold text-[#212121]">
            Unable to Load Invoice
          </h2>

          <p className="text-sm text-red-600 mt-2">
            {error || "Invoice not found."}
          </p>

          <Link
            to="/invoices"
            className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 rounded-lg bg-[#2F6FED] text-white hover:bg-[#2459C7]"
          >
            <ArrowLeft size={17} />
            Back to Invoices
          </Link>

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

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-xl bg-[#EEF4FF] flex items-center justify-center">
              <FileText
                size={24}
                className="text-[#2F6FED]"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#212121]">
                {invoice.invoice_id}
              </h1>

              <p className="text-sm text-[#7A7A7A]">
                Invoice Details
              </p>
            </div>

          </div>

          <div className="flex gap-2">

            {canEdit(permissions, "services") && (
              <Link
                to={`/invoices/${invoice.id}/edit`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#212121] hover:bg-[#F9FAFB]"
              >
                <Pencil size={17} />
                Edit
              </Link>
            )}

            {canDelete(permissions, "services") && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? (
                  <RefreshCw
                    size={17}
                    className="animate-spin"
                  />
                ) : (
                  <Trash2 size={17} />
                )}

                Delete
              </button>
            )}

          </div>

        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto space-y-5">

        {/* Status + Total */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>
              <p className="text-sm text-[#7A7A7A]">
                Invoice Status
              </p>

              <span
                className={`inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusClass(
                  invoice.status
                )}`}
              >
                {getStatusIcon(invoice.status)}
                {invoice.status || "PENDING"}
              </span>
            </div>

            <div className="md:text-right">

              <p className="text-sm text-[#7A7A7A]">
                Total Amount
              </p>

              <h2 className="text-3xl font-bold text-[#2F6FED] mt-1">
                {formatAmount(invoice.total_amount)}
              </h2>

            </div>

          </div>
        </div>

        {/* Member Information */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">

          <div className="flex items-center gap-2 mb-5">

            <User
              size={19}
              className="text-[#2F6FED]"
            />

            <h2 className="text-lg font-semibold text-[#212121]">
              Member Information
            </h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <p className="text-xs text-[#7A7A7A] mb-1">
                Member Name
              </p>

              <p className="font-semibold text-[#212121]">
                {invoice.member_name || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#7A7A7A] mb-1">
                Member ID
              </p>

              <p className="font-semibold text-[#212121]">
                {invoice.member_id || "—"}
              </p>
            </div>

          </div>
        </div>

        {/* Service Information */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">

          <div className="flex items-center gap-2 mb-5">

            <CreditCard
              size={19}
              className="text-[#2F6FED]"
            />

            <h2 className="text-lg font-semibold text-[#212121]">
              Service Information
            </h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <p className="text-xs text-[#7A7A7A] mb-1">
                Service Name
              </p>

              <p className="font-semibold text-[#212121]">
                {invoice.service_name || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#7A7A7A] mb-1">
                Service Reference
              </p>

              <p className="font-semibold text-[#212121]">
                {invoice.service_reference || "—"}
              </p>
            </div>

          </div>
        </div>

        {/* Amount Breakdown */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">

          <h2 className="text-lg font-semibold text-[#212121] mb-5">
            Amount Breakdown
          </h2>

          <div className="space-y-3">

            <div className="flex justify-between items-center text-sm">
              <span className="text-[#7A7A7A]">
                Base Amount
              </span>

              <span className="font-medium text-[#212121]">
                {formatAmount(invoice.amount)}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-[#7A7A7A]">
                Discount
              </span>

              <span className="font-medium text-green-600">
                - {formatAmount(invoice.discount)}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-[#7A7A7A]">
                Commission
              </span>

              <span className="font-medium text-[#212121]">
                + {formatAmount(invoice.commission)}
              </span>
            </div>

            <div className="border-t border-[#E5E7EB] pt-4 mt-4 flex justify-between items-center">

              <span className="font-semibold text-[#212121]">
                Total Amount
              </span>

              <span className="text-xl font-bold text-[#2F6FED]">
                {formatAmount(invoice.total_amount)}
              </span>

            </div>

          </div>
        </div>

        {/* Dates */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">

          <div className="flex items-center gap-2 mb-5">

            <Calendar
              size={19}
              className="text-[#2F6FED]"
            />

            <h2 className="text-lg font-semibold text-[#212121]">
              Dates
            </h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            <div>
              <p className="text-xs text-[#7A7A7A] mb-1">
                Due Date
              </p>

              <p className="font-medium text-[#212121]">
                {formatDate(invoice.due_date)}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#7A7A7A] mb-1">
                Created
              </p>

              <p className="font-medium text-[#212121]">
                {formatDate(invoice.created_at)}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#7A7A7A] mb-1">
                Last Updated
              </p>

              <p className="font-medium text-[#212121]">
                {formatDate(invoice.updated_at)}
              </p>
            </div>

          </div>
        </div>

        {/* Description & Notes */}
        {(invoice.description || invoice.notes) && (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">

            <h2 className="text-lg font-semibold text-[#212121] mb-5">
              Additional Information
            </h2>

            {invoice.description && (
              <div className="mb-5">
                <p className="text-xs text-[#7A7A7A] mb-1">
                  Description
                </p>

                <p className="text-sm text-[#212121]">
                  {invoice.description}
                </p>
              </div>
            )}

            {invoice.notes && (
              <div>
                <p className="text-xs text-[#7A7A7A] mb-1">
                  Notes
                </p>

                <p className="text-sm text-[#212121] whitespace-pre-line">
                  {invoice.notes}
                </p>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};

export default InvoiceDetails;
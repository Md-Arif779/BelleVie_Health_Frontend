import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  RefreshCw,
  CreditCard,
  User,
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
  AlertCircle,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import {
  getPayment,
  deletePayment,
} from "../../services/billingService";
import {
  canEdit,
  canDelete,
} from "../../utils/permission";

const PaymentDetails = () => {
  const { permissions } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);

  /* =========================================================
     LOAD PAYMENT
  ========================================================= */

  const loadPayment = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPayment(id);

      setPayment(data);
    } catch (err) {
      console.error("Payment Details Error:", err);

      setError(
        err?.response?.data?.detail ||
          "Failed to load payment details."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayment();
  }, [id]);

  /* =========================================================
     DELETE PAYMENT
  ========================================================= */

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this payment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      await deletePayment(id);

      navigate("/payments");
    } catch (err) {
      console.error(
        "Delete Payment Error:",
        err
      );

      alert(
        err?.response?.data?.detail ||
          "Failed to delete payment."
      );
    } finally {
      setDeleting(false);
    }
  };

  /* =========================================================
     FORMAT
  ========================================================= */

  const formatAmount = (amount) => {
    return `৳${Number(amount || 0).toLocaleString(
      "en-BD",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  const formatDateTime = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  /* =========================================================
     STATUS
  ========================================================= */

  const getStatusClass = (status) => {
    switch (status) {
      case "PAID":
        return "bg-green-100 text-green-700";

      case "FAILED":
        return "bg-red-100 text-red-700";

      case "REFUNDED":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "PAID":
        return <CheckCircle2 size={17} />;

      case "FAILED":
        return <XCircle size={17} />;

      case "REFUNDED":
        return <RotateCcw size={17} />;

      default:
        return <Clock size={17} />;
    }
  };

  /* =========================================================
     PAYMENT METHOD
  ========================================================= */

  const getPaymentMethodLabel = (method) => {
    switch (method) {
      case "BKASH":
        return "bKash";

      case "NAGAD":
        return "Nagad";

      case "CARD":
        return "Card";

      case "BANK":
        return "Bank Transfer";

      case "CASH":
        return "Cash";

      default:
        return method || "—";
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

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

  /* =========================================================
     ERROR
  ========================================================= */

  if (error || !payment) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">

        <div className="max-w-3xl mx-auto bg-white rounded-xl border border-[#E5E7EB] p-8 text-center">

          <AlertCircle
            size={42}
            className="mx-auto text-red-500 mb-3"
          />

          <h2 className="text-xl font-bold text-[#212121]">
            Unable to Load Payment
          </h2>

          <p className="text-sm text-red-600 mt-2">
            {error || "Payment not found."}
          </p>

          <Link
            to="/payments"
            className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 rounded-lg bg-[#2F6FED] text-white hover:bg-[#2459C7]"
          >
            <ArrowLeft size={17} />
            Back to Payments
          </Link>

        </div>

      </div>
    );
  }

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

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="w-12 h-12 rounded-xl bg-[#EEF4FF] flex items-center justify-center">

              <CreditCard
                size={24}
                className="text-[#2F6FED]"
              />

            </div>

            <div>

              <h1 className="text-2xl font-bold text-[#212121]">
                {payment.payment_id}
              </h1>

              <p className="text-sm text-[#7A7A7A]">
                Payment Details
              </p>

            </div>

          </div>

          <div className="flex gap-2">

            {canEdit(
              permissions,
              "services"
            ) && (
              <Link
                to={`/payments/${payment.id}/edit`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#212121] hover:bg-[#F9FAFB]"
              >
                <Pencil size={17} />
                Edit
              </Link>
            )}

            {canDelete(
              permissions,
              "services"
            ) && (
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

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <div className="max-w-5xl mx-auto space-y-5">

        {/* ===================================================
            STATUS + AMOUNT
        ==================================================== */}

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

            <div>

              <p className="text-sm text-[#7A7A7A]">
                Payment Status
              </p>

              <span
                className={`inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusClass(
                  payment.status
                )}`}
              >
                {getStatusIcon(
                  payment.status
                )}

                {payment.status ||
                  "PENDING"}
              </span>

            </div>

            <div className="md:text-right">

              <p className="text-sm text-[#7A7A7A]">
                Payment Amount
              </p>

              <h2 className="text-3xl font-bold text-[#2F6FED] mt-1">
                {formatAmount(
                  payment.amount
                )}
              </h2>

            </div>

          </div>

        </div>

        {/* ===================================================
            MEMBER INFORMATION
        ==================================================== */}

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
                {payment.member_name ||
                  "—"}
              </p>

            </div>

            <div>

              <p className="text-xs text-[#7A7A7A] mb-1">
                Member ID
              </p>

              <p className="font-semibold text-[#212121]">
                {payment.member_id ||
                  "—"}
              </p>

            </div>

          </div>

        </div>

        {/* ===================================================
            INVOICE INFORMATION
        ==================================================== */}

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">

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

            <div>

              <p className="text-xs text-[#7A7A7A] mb-1">
                Invoice
              </p>

              <p className="font-semibold text-[#212121]">
                {payment.invoice_id ||
                  "No invoice linked"}
              </p>

            </div>

            <div>

              <p className="text-xs text-[#7A7A7A] mb-1">
                Invoice Database ID
              </p>

              <p className="font-semibold text-[#212121]">
                {payment.invoice ||
                  "—"}
              </p>

            </div>

          </div>

        </div>

        {/* ===================================================
            PAYMENT INFORMATION
        ==================================================== */}

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">

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

            <div>

              <p className="text-xs text-[#7A7A7A] mb-1">
                Payment Method
              </p>

              <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#EEF4FF] text-[#2F6FED] text-sm font-medium">
                {getPaymentMethodLabel(
                  payment.payment_method
                )}
              </span>

            </div>

            <div>

              <p className="text-xs text-[#7A7A7A] mb-1">
                Transaction ID
              </p>

              <p className="font-semibold text-[#212121] break-all">
                {payment.transaction_id ||
                  "—"}
              </p>

            </div>

            <div>

              <p className="text-xs text-[#7A7A7A] mb-1">
                Amount
              </p>

              <p className="text-xl font-bold text-[#2F6FED]">
                {formatAmount(
                  payment.amount
                )}
              </p>

            </div>

            <div>

              <p className="text-xs text-[#7A7A7A] mb-1">
                Payment Date
              </p>

              <p className="font-medium text-[#212121]">
                {formatDateTime(
                  payment.payment_date
                )}
              </p>

            </div>

          </div>

        </div>

        {/* ===================================================
            DATES
        ==================================================== */}

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">

          <div className="flex items-center gap-2 mb-5">

            <Calendar
              size={19}
              className="text-[#2F6FED]"
            />

            <h2 className="text-lg font-semibold text-[#212121]">
              Record Dates
            </h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>

              <p className="text-xs text-[#7A7A7A] mb-1">
                Created
              </p>

              <p className="font-medium text-[#212121]">
                {formatDateTime(
                  payment.created_at
                )}
              </p>

            </div>

            <div>

              <p className="text-xs text-[#7A7A7A] mb-1">
                Last Updated
              </p>

              <p className="font-medium text-[#212121]">
                {formatDateTime(
                  payment.updated_at
                )}
              </p>

            </div>

          </div>

        </div>

        {/* ===================================================
            DESCRIPTION & NOTES
        ==================================================== */}

        {(payment.description ||
          payment.notes) && (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">

            <h2 className="text-lg font-semibold text-[#212121] mb-5">
              Additional Information
            </h2>

            {payment.description && (
              <div className="mb-5">

                <p className="text-xs text-[#7A7A7A] mb-1">
                  Description
                </p>

                <p className="text-sm text-[#212121]">
                  {payment.description}
                </p>

              </div>
            )}

            {payment.notes && (
              <div>

                <p className="text-xs text-[#7A7A7A] mb-1">
                  Notes
                </p>

                <p className="text-sm text-[#212121] whitespace-pre-line">
                  {payment.notes}
                </p>

              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
};

export default PaymentDetails;
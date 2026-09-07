import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
  CheckCircle2,
  Clock,
  XCircle,
  RotateCcw,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import {
  getPayments,
  deletePayment,
} from "../../services/billingService";
import {
  canAdd,
  canEdit,
  canDelete,
} from "../../utils/permission";

const PaymentList = () => {
  const { permissions } = useAuth();

  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [methodFilter, setMethodFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  /* =========================================================
     LOAD PAYMENTS
  ========================================================= */

  const loadPayments = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPayments();

      const paymentData = Array.isArray(data)
        ? data
        : data?.results || [];

      setPayments(paymentData);
    } catch (err) {
      console.error("Payment List Error:", err);

      setError(
        err?.response?.data?.detail ||
          "Failed to load payments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  /* =========================================================
     FILTER PAYMENTS
  ========================================================= */

  useEffect(() => {
    let result = [...payments];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();

      result = result.filter((payment) =>
        [
          payment.payment_id,
          payment.member_id,
          payment.member_name,
          payment.invoice_id,
          payment.transaction_id,
          payment.description,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value)
              .toLowerCase()
              .includes(search)
          )
      );
    }

    if (statusFilter !== "ALL") {
      result = result.filter(
        (payment) =>
          payment.status === statusFilter
      );
    }

    if (methodFilter !== "ALL") {
      result = result.filter(
        (payment) =>
          payment.payment_method === methodFilter
      );
    }

    setFilteredPayments(result);
  }, [
    payments,
    searchTerm,
    statusFilter,
    methodFilter,
  ]);

  /* =========================================================
     DELETE PAYMENT
  ========================================================= */

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this payment?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      await deletePayment(id);

      setPayments((previous) =>
        previous.filter(
          (payment) => payment.id !== id
        )
      );
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
      setDeletingId(null);
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
        return <CheckCircle2 size={14} />;

      case "FAILED":
        return <XCircle size={14} />;

      case "REFUNDED":
        return <RotateCcw size={14} />;

      default:
        return <Clock size={14} />;
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
     STATISTICS
  ========================================================= */

  const totalPayments = payments.length;

  const paidPayments = payments.filter(
    (payment) =>
      payment.status === "PAID"
  ).length;

  const pendingPayments = payments.filter(
    (payment) =>
      payment.status === "PENDING"
  ).length;

  const refundedPayments = payments.filter(
    (payment) =>
      payment.status === "REFUNDED"
  ).length;

  const totalPaidAmount = payments
    .filter(
      (payment) =>
        payment.status === "PAID"
    )
    .reduce(
      (total, payment) =>
        total + Number(payment.amount || 0),
      0
    );

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-[#EEF4FF] flex items-center justify-center">
            <CreditCard
              size={23}
              className="text-[#2F6FED]"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#212121]">
              Payments
            </h1>

            <p className="text-sm text-[#7A7A7A]">
              Manage member payment records
            </p>
          </div>

        </div>

        <div className="flex gap-2">

          <button
            type="button"
            onClick={loadPayments}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#212121] hover:bg-[#F9FAFB] transition"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          {canAdd(permissions, "services") && (
            <Link
              to="/payments/add"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#2F6FED] text-white hover:bg-[#2459C7] transition"
            >
              <Plus size={18} />
              Add Payment
            </Link>
          )}

        </div>

      </div>

      {/* =====================================================
          ERROR
      ====================================================== */}

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* =====================================================
          STATISTICS
      ====================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <p className="text-sm text-[#7A7A7A]">
            Total Payments
          </p>

          <h2 className="text-2xl font-bold text-[#212121] mt-2">
            {totalPayments}
          </h2>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <p className="text-sm text-[#7A7A7A]">
            Paid
          </p>

          <h2 className="text-2xl font-bold text-[#16A34A] mt-2">
            {paidPayments}
          </h2>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <p className="text-sm text-[#7A7A7A]">
            Pending
          </p>

          <h2 className="text-2xl font-bold text-[#F59E0B] mt-2">
            {pendingPayments}
          </h2>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <p className="text-sm text-[#7A7A7A]">
            Refunded
          </p>

          <h2 className="text-2xl font-bold text-purple-600 mt-2">
            {refundedPayments}
          </h2>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <p className="text-sm text-[#7A7A7A]">
            Paid Amount
          </p>

          <h2 className="text-2xl font-bold text-[#2F6FED] mt-2">
            {formatAmount(totalPaidAmount)}
          </h2>
        </div>

      </div>

      {/* =====================================================
          FILTERS
      ====================================================== */}

      <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 mb-5">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

          {/* Search */}

          <div className="relative">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value
                )
              }
              placeholder="Search payment, member, invoice..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E5E7EB] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#EEF4FF]"
            />

          </div>

          {/* Status */}

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
            className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-white outline-none focus:border-[#2F6FED]"
          >
            <option value="ALL">
              All Status
            </option>

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

          {/* Payment Method */}

          <select
            value={methodFilter}
            onChange={(event) =>
              setMethodFilter(
                event.target.value
              )
            }
            className="w-full px-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-white outline-none focus:border-[#2F6FED]"
          >
            <option value="ALL">
              All Payment Methods
            </option>

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

      </div>

      {/* =====================================================
          TABLE
      ====================================================== */}

      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">

        {loading ? (

          <div className="flex items-center justify-center py-16">

            <RefreshCw
              size={25}
              className="animate-spin text-[#2F6FED]"
            />

          </div>

        ) : filteredPayments.length === 0 ? (

          <div className="py-16 text-center">

            <CreditCard
              size={42}
              className="mx-auto text-[#7A7A7A] mb-3"
            />

            <h3 className="text-lg font-semibold text-[#212121]">
              No payments found
            </h3>

            <p className="text-sm text-[#7A7A7A] mt-1">
              There are no payments matching your search.
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">

                <tr className="text-left text-sm text-[#7A7A7A]">

                  <th className="px-5 py-4 font-medium">
                    Payment
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Member
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Invoice
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Amount
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Method
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Date
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Status
                  </th>

                  <th className="px-5 py-4 font-medium text-right">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-[#E5E7EB]">

                {filteredPayments.map(
                  (payment) => (

                    <tr
                      key={payment.id}
                      className="hover:bg-[#F9FAFB] transition"
                    >

                      {/* Payment */}

                      <td className="px-5 py-4">

                        <p className="font-semibold text-[#212121]">
                          {payment.payment_id ||
                            "—"}
                        </p>

                        {payment.transaction_id && (
                          <p className="text-xs text-[#7A7A7A] mt-1">
                            TXN:{" "}
                            {payment.transaction_id}
                          </p>
                        )}

                      </td>

                      {/* Member */}

                      <td className="px-5 py-4">

                        <p className="font-medium text-[#212121]">
                          {payment.member_name ||
                            "—"}
                        </p>

                        <p className="text-xs text-[#7A7A7A] mt-1">
                          {payment.member_id ||
                            "—"}
                        </p>

                      </td>

                      {/* Invoice */}

                      <td className="px-5 py-4">

                        <p className="font-medium text-[#212121]">
                          {payment.invoice_id ||
                            "—"}
                        </p>

                      </td>

                      {/* Amount */}

                      <td className="px-5 py-4">

                        <p className="font-semibold text-[#212121]">
                          {formatAmount(
                            payment.amount
                          )}
                        </p>

                      </td>

                      {/* Method */}

                      <td className="px-5 py-4">

                        <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#EEF4FF] text-[#2F6FED] text-xs font-medium">
                          {getPaymentMethodLabel(
                            payment.payment_method
                          )}
                        </span>

                      </td>

                      {/* Date */}

                      <td className="px-5 py-4 text-sm text-[#212121]">
                        {formatDateTime(
                          payment.payment_date
                        )}
                      </td>

                      {/* Status */}

                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClass(
                            payment.status
                          )}`}
                        >
                          {getStatusIcon(
                            payment.status
                          )}

                          {payment.status ||
                            "PENDING"}
                        </span>

                      </td>

                      {/* Actions */}

                      <td className="px-5 py-4">

                        <div className="flex justify-end items-center gap-1">

                          <Link
                            to={`/payments/${payment.id}`}
                            className="p-2 rounded-lg text-[#7A7A7A] hover:text-[#2F6FED] hover:bg-[#EEF4FF] transition"
                            title="View"
                          >
                            <Eye size={17} />
                          </Link>

                          {canEdit(
                            permissions,
                            "services"
                          ) && (
                            <Link
                              to={`/payments/${payment.id}/edit`}
                              className="p-2 rounded-lg text-[#7A7A7A] hover:text-[#2F6FED] hover:bg-[#EEF4FF] transition"
                              title="Edit"
                            >
                              <Pencil size={17} />
                            </Link>
                          )}

                          {canDelete(
                            permissions,
                            "services"
                          ) && (
                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  payment.id
                                )
                              }
                              disabled={
                                deletingId ===
                                payment.id
                              }
                              className="p-2 rounded-lg text-[#7A7A7A] hover:text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                              title="Delete"
                            >
                              {deletingId ===
                              payment.id ? (
                                <RefreshCw
                                  size={17}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2
                                  size={17}
                                />
                              )}
                            </button>
                          )}

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
};

export default PaymentList;
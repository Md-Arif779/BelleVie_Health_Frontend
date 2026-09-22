
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import {
  getInvoices,
  deleteInvoice,
} from "../../services/billingService";
import {
  canAdd,
  canEdit,
  canDelete,
} from "../../utils/permission";

const InvoiceList = () => {
  const { permissions } = useAuth();

  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const loadInvoices = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getInvoices();

      const invoiceData = Array.isArray(data)
        ? data
        : data?.results || [];

      setInvoices(invoiceData);
    } catch (err) {
      console.error("Invoice List Error:", err);

      setError(
        err?.response?.data?.detail ||
          "Failed to load invoices."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  useEffect(() => {
    let result = [...invoices];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();

      result = result.filter((invoice) =>
        [
          invoice.invoice_id,
          invoice.member_id,
          invoice.member_name,
          invoice.service_name,
          invoice.service_reference,
        ]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(search)
          )
      );
    }

    if (statusFilter !== "ALL") {
      result = result.filter(
        (invoice) => invoice.status === statusFilter
      );
    }

    setFilteredInvoices(result);
  }, [invoices, searchTerm, statusFilter]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this invoice?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      await deleteInvoice(id);

      setInvoices((previous) =>
        previous.filter((invoice) => invoice.id !== id)
      );
    } catch (err) {
      console.error("Delete Invoice Error:", err);

      alert(
        err?.response?.data?.detail ||
          "Failed to delete invoice."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const formatAmount = (amount) => {
    const value = Number(amount || 0);

    return `৳${value.toLocaleString("en-BD", {
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
        return <CheckCircle2 size={14} />;

      case "CANCELLED":
        return <AlertCircle size={14} />;

      case "PARTIAL":
      case "PENDING":
        return <Clock size={14} />;

      default:
        return <FileText size={14} />;
    }
  };

  const totalInvoices = invoices.length;

  const pendingInvoices = invoices.filter(
    (invoice) => invoice.status === "PENDING"
  ).length;

  const paidInvoices = invoices.filter(
    (invoice) => invoice.status === "PAID"
  ).length;

  const totalRevenue = invoices
    .filter((invoice) => invoice.status === "PAID")
    .reduce(
      (total, invoice) =>
        total + Number(invoice.total_amount || 0),
      0
    );

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">

      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">

        <div>
          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-[#EEF4FF] flex items-center justify-center">
              <FileText
                size={23}
                className="text-[#2F6FED]"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#212121]">
                Invoices
              </h1>

              <p className="text-sm text-[#7A7A7A]">
                Manage member invoices and billing records
              </p>
            </div>

          </div>
        </div>

        <div className="flex gap-2">

          <button
            type="button"
            onClick={loadInvoices}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#212121] hover:bg-[#F9FAFB] transition"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          {/* INVOICE ADD PERMISSION */}
          {canAdd(permissions, "invoices") && (
            <Link
              to="/invoices/add"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#2F6FED] text-white hover:bg-[#2459C7] transition"
            >
              <Plus size={18} />
              Create Invoice
            </Link>
          )}

        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <p className="text-sm text-[#7A7A7A]">
            Total Invoices
          </p>

          <h2 className="text-2xl font-bold text-[#212121] mt-2">
            {totalInvoices}
          </h2>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <p className="text-sm text-[#7A7A7A]">
            Pending
          </p>

          <h2 className="text-2xl font-bold text-[#F59E0B] mt-2">
            {pendingInvoices}
          </h2>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <p className="text-sm text-[#7A7A7A]">
            Paid
          </p>

          <h2 className="text-2xl font-bold text-[#16A34A] mt-2">
            {paidInvoices}
          </h2>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <p className="text-sm text-[#7A7A7A]">
            Paid Revenue
          </p>

          <h2 className="text-2xl font-bold text-[#2F6FED] mt-2">
            {formatAmount(totalRevenue)}
          </h2>
        </div>

      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 mb-5">

        <div className="flex flex-col md:flex-row gap-3">

          <div className="relative flex-1">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]"
            />

            <input
              type="text"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="Search invoice, member, service..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-[#E5E7EB] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#EEF4FF]"
            />

          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="w-full md:w-48 px-4 py-2.5 rounded-lg border border-[#E5E7EB] bg-white outline-none focus:border-[#2F6FED]"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="PARTIAL">Partial</option>
            <option value="PAID">Paid</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="REFUNDED">Refunded</option>
          </select>

        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">

        {loading ? (
          <div className="flex items-center justify-center py-16">

            <RefreshCw
              size={25}
              className="animate-spin text-[#2F6FED]"
            />

          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="py-16 text-center">

            <FileText
              size={42}
              className="mx-auto text-[#7A7A7A] mb-3"
            />

            <h3 className="text-lg font-semibold text-[#212121]">
              No invoices found
            </h3>

            <p className="text-sm text-[#7A7A7A] mt-1">
              There are no invoices matching your search.
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">

                <tr className="text-left text-sm text-[#7A7A7A]">

                  <th className="px-5 py-4 font-medium">
                    Invoice
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Member
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Service
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Amount
                  </th>

                  <th className="px-5 py-4 font-medium">
                    Due Date
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

                {filteredInvoices.map((invoice) => (

                  <tr
                    key={invoice.id}
                    className="hover:bg-[#F9FAFB] transition"
                  >

                    <td className="px-5 py-4">

                      <p className="font-semibold text-[#212121]">
                        {invoice.invoice_id || "—"}
                      </p>

                      <p className="text-xs text-[#7A7A7A] mt-1">
                        Created {formatDate(invoice.created_at)}
                      </p>

                    </td>

                    <td className="px-5 py-4">

                      <p className="font-medium text-[#212121]">
                        {invoice.member_name || "—"}
                      </p>

                      <p className="text-xs text-[#7A7A7A] mt-1">
                        {invoice.member_id || "—"}
                      </p>

                    </td>

                    <td className="px-5 py-4">

                      <p className="font-medium text-[#212121]">
                        {invoice.service_name || "—"}
                      </p>

                      {invoice.service_reference && (
                        <p className="text-xs text-[#7A7A7A] mt-1">
                          Ref: {invoice.service_reference}
                        </p>
                      )}

                    </td>

                    <td className="px-5 py-4">

                      <p className="font-semibold text-[#212121]">
                        {formatAmount(invoice.total_amount)}
                      </p>

                      {Number(invoice.discount || 0) > 0 && (
                        <p className="text-xs text-green-600 mt-1">
                          Discount:{" "}
                          {formatAmount(invoice.discount)}
                        </p>
                      )}

                    </td>

                    <td className="px-5 py-4 text-sm text-[#212121]">
                      {formatDate(invoice.due_date)}
                    </td>

                    <td className="px-5 py-4">

                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusClass(
                          invoice.status
                        )}`}
                      >
                        {getStatusIcon(invoice.status)}
                        {invoice.status || "PENDING"}
                      </span>

                    </td>

                    <td className="px-5 py-4">

                      <div className="flex justify-end items-center gap-1">

                        <Link
                          to={`/invoices/${invoice.id}`}
                          className="p-2 rounded-lg text-[#7A7A7A] hover:text-[#2F6FED] hover:bg-[#EEF4FF] transition"
                          title="View"
                        >
                          <Eye size={17} />
                        </Link>

                        {/* INVOICE EDIT PERMISSION */}
                        {canEdit(permissions, "invoices") && (
                          <Link
                            to={`/invoices/${invoice.id}/edit`}
                            className="p-2 rounded-lg text-[#7A7A7A] hover:text-[#2F6FED] hover:bg-[#EEF4FF] transition"
                            title="Edit"
                          >
                            <Pencil size={17} />
                          </Link>
                        )}

                        {/* INVOICE DELETE PERMISSION */}
                        {canDelete(permissions, "invoices") && (
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(invoice.id)
                            }
                            disabled={deletingId === invoice.id}
                            className="p-2 rounded-lg text-[#7A7A7A] hover:text-red-600 hover:bg-red-50 transition disabled:opacity-50"
                            title="Delete"
                          >
                            {deletingId === invoice.id ? (
                              <RefreshCw
                                size={17}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2 size={17} />
                            )}
                          </button>
                        )}

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  );
};

export default InvoiceList;


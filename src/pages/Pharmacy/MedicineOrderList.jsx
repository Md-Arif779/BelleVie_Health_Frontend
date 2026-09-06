
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  RefreshCw,
} from "lucide-react";

import {
  getMedicineOrders,
  deleteMedicineOrder,
} from "../../services/medicineOrderService";

function MedicineOrderList() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  // =====================================================
  // LOAD MEDICINE ORDERS
  // =====================================================

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMedicineOrders();

      // DRF pagination support
      if (Array.isArray(data)) {
        setOrders(data);
      } else if (Array.isArray(data.results)) {
        setOrders(data.results);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Medicine Orders Error:", err);

      setError(
        err?.response?.data?.detail ||
          "Failed to load medicine orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // =====================================================
  // DELETE
  // =====================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this medicine order?"
    );

    if (!confirmed) return;

    try {
      setDeleting(true);

      await deleteMedicineOrder(id);

      setOrders((prev) =>
        prev.filter((order) => order.id !== id)
      );
    } catch (err) {
      console.error("Delete Medicine Order Error:", err);

      alert(
        err?.response?.data?.detail ||
          "Failed to delete medicine order."
      );
    } finally {
      setDeleting(false);
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredOrders = orders.filter((order) => {
    const keyword = search.toLowerCase();

    return (
      order.order_id?.toLowerCase().includes(keyword) ||
      order.member_id?.toLowerCase().includes(keyword) ||
      order.member_name?.toLowerCase().includes(keyword) ||
      order.medicine_name?.toLowerCase().includes(keyword) ||
      order.pharmacy_name?.toLowerCase().includes(keyword) ||
      order.status?.toLowerCase().includes(keyword)
    );
  });

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";

      case "CONFIRMED":
        return "bg-blue-100 text-blue-700";

      case "PROCESSING":
        return "bg-purple-100 text-purple-700";

      case "READY":
        return "bg-green-100 text-green-700";

      case "DELIVERED":
        return "bg-emerald-100 text-emerald-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex items-center gap-3 text-[#7A7A7A]">
          <RefreshCw className="w-5 h-5 animate-spin" />
          <span>Loading medicine orders...</span>
        </div>
      </div>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <div className="space-y-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div>
          <h1 className="text-2xl font-semibold text-[#212121]">
            Medicine Orders
          </h1>

          <p className="text-sm text-[#7A7A7A] mt-1">
            Manage and monitor medicine orders
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/medicine-orders/add")
          }
          className="
            flex items-center justify-center gap-2
            px-4 py-2.5
            rounded-lg
            bg-[#2F6FED]
            text-white
            text-sm font-medium
            hover:bg-[#245ed0]
            transition
          "
        >
          <Plus className="w-4 h-4" />
          Add Medicine Order
        </button>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* =================================================
          SEARCH + REFRESH
      ================================================= */}

      <div className="bg-white rounded-xl border border-[#EEEEEE] p-4">

        <div className="flex flex-col md:flex-row gap-3">

          <div className="relative flex-1">

            <Search
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                w-4
                h-4
                text-[#7A7A7A]
              "
            />

            <input
              type="text"
              placeholder="
                Search order, member, medicine, pharmacy...
              "
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="
                w-full
                pl-10
                pr-4
                py-2.5
                border
                border-[#EEEEEE]
                rounded-lg
                text-sm
                outline-none
                focus:border-[#2F6FED]
                focus:ring-1
                focus:ring-[#2F6FED]
              "
            />

          </div>

          <button
            onClick={loadOrders}
            className="
              flex items-center justify-center gap-2
              px-4 py-2.5
              border border-[#EEEEEE]
              rounded-lg
              text-sm
              text-[#212121]
              hover:bg-[#F2F2F2]
              transition
            "
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>

        </div>

      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="bg-white rounded-xl border border-[#EEEEEE] overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            <thead className="bg-[#F2F2F2] border-b border-[#EEEEEE]">

              <tr>

                <th className="px-5 py-4 text-left font-medium text-[#212121]">
                  Order ID
                </th>

                <th className="px-5 py-4 text-left font-medium text-[#212121]">
                  Member
                </th>

                <th className="px-5 py-4 text-left font-medium text-[#212121]">
                  Medicine
                </th>

                <th className="px-5 py-4 text-left font-medium text-[#212121]">
                  Pharmacy
                </th>

                <th className="px-5 py-4 text-left font-medium text-[#212121]">
                  Quantity
                </th>

                <th className="px-5 py-4 text-left font-medium text-[#212121]">
                  Total
                </th>

                <th className="px-5 py-4 text-left font-medium text-[#212121]">
                  Order Date
                </th>

                <th className="px-5 py-4 text-left font-medium text-[#212121]">
                  Status
                </th>

                <th className="px-5 py-4 text-center font-medium text-[#212121]">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-[#EEEEEE]">

              {filteredOrders.length === 0 ? (

                <tr>

                  <td
                    colSpan="9"
                    className="
                      px-5
                      py-12
                      text-center
                      text-[#7A7A7A]
                    "
                  >
                    No medicine orders found.
                  </td>

                </tr>

              ) : (

                filteredOrders.map((order) => (

                  <tr
                    key={order.id}
                    className="hover:bg-[#F9FAFB] transition"
                  >

                    {/* ORDER ID */}

                    <td className="px-5 py-4">

                      <span className="font-medium text-[#2F6FED]">
                        {order.order_id || "-"}
                      </span>

                    </td>

                    {/* MEMBER */}

                    <td className="px-5 py-4">

                      <div>
                        <p className="font-medium text-[#212121]">
                          {order.member_name || "-"}
                        </p>

                        <p className="text-xs text-[#7A7A7A] mt-0.5">
                          {order.member_id || "-"}
                        </p>
                      </div>

                    </td>

                    {/* MEDICINE */}

                    <td className="px-5 py-4">

                      <span className="text-[#212121]">
                        {order.medicine_name || "-"}
                      </span>

                    </td>

                    {/* PHARMACY */}

                    <td className="px-5 py-4">

                      <div>
                        <p className="font-medium text-[#212121]">
                          {order.pharmacy_name || "-"}
                        </p>

                        <p className="text-xs text-[#7A7A7A] mt-0.5">
                          {order.pharmacy_id || "-"}
                        </p>
                      </div>

                    </td>

                    {/* QUANTITY */}

                    <td className="px-5 py-4">
                      {order.quantity ?? 0}
                    </td>

                    {/* TOTAL */}

                    <td className="px-5 py-4">

                      <span className="font-medium text-[#212121]">
                        ৳ {order.total_amount || "0.00"}
                      </span>

                    </td>

                    {/* DATE */}

                    <td className="px-5 py-4 text-[#7A7A7A]">
                      {formatDate(order.order_date)}
                    </td>

                    {/* STATUS */}

                    <td className="px-5 py-4">

                      <span
                        className={`
                          inline-flex
                          px-2.5
                          py-1
                          rounded-full
                          text-xs
                          font-medium
                          ${getStatusStyle(order.status)}
                        `}
                      >
                        {order.status || "-"}
                      </span>

                    </td>

                    {/* ACTIONS */}

                    <td className="px-5 py-4">

                      <div className="flex items-center justify-center gap-2">

                        {/* VIEW */}

                        <button
                          title="View"
                          onClick={() =>
                            navigate(
                              `/medicine-orders/${order.id}`
                            )
                          }
                          className="
                            p-2
                            rounded-lg
                            text-[#2F6FED]
                            hover:bg-blue-50
                            transition
                          "
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* EDIT */}

                        <button
                          title="Edit"
                          onClick={() =>
                            navigate(
                              `/medicine-orders/${order.id}/edit`
                            )
                          }
                          className="
                            p-2
                            rounded-lg
                            text-[#7A7A7A]
                            hover:bg-gray-100
                            transition
                          "
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* DELETE */}

                        <button
                          title="Delete"
                          disabled={deleting}
                          onClick={() =>
                            handleDelete(order.id)
                          }
                          className="
                            p-2
                            rounded-lg
                            text-red-500
                            hover:bg-red-50
                            transition
                            disabled:opacity-50
                          "
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =================================================
          FOOTER COUNT
      ================================================= */}

      <div className="text-sm text-[#7A7A7A]">
        Showing{" "}
        <span className="font-medium text-[#212121]">
          {filteredOrders.length}
        </span>{" "}
        of{" "}
        <span className="font-medium text-[#212121]">
          {orders.length}
        </span>{" "}
        medicine orders
      </div>

    </div>
  );
}

export default MedicineOrderList;


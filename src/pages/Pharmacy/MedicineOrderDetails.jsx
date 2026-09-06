
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Package,
  User,
  FileText,
  Building2,
  MapPin,
  Calendar,
  Clock,
  Pill,
  Truck,
} from "lucide-react";

import { getMedicineOrder } from "../../services/medicineOrderService";

function MedicineOrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD ORDER
  // =====================================================

  useEffect(() => {
    if (!id) return;

    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMedicineOrder(id);

      console.log("Medicine Order Details:", data);

      setOrder(data);
    } catch (err) {
      console.error(
        "Medicine Order Details Error:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Failed to load medicine order details."
      );
    } finally {
      setLoading(false);
    }
  };

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
        return "bg-indigo-100 text-indigo-700";

      case "DELIVERED":
        return "bg-green-100 text-green-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString(
      "en-US",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6 flex items-center justify-center">
        <p className="text-[#7A7A7A]">
          Loading medicine order...
        </p>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">

        <button
          onClick={() =>
            navigate("/medicine-orders")
          }
          className="flex items-center gap-2 text-[#2F6FED] mb-6"
        >
          <ArrowLeft size={18} />
          Back to Medicine Orders
        </button>

        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-6">
          {error}
        </div>

      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">

        <button
          onClick={() =>
            navigate("/medicine-orders")
          }
          className="flex items-center gap-2 text-[#2F6FED]"
        >
          <ArrowLeft size={18} />
          Back to Medicine Orders
        </button>

        <div className="mt-6 bg-white rounded-xl p-8 text-center border border-[#EEEEEE]">
          <p className="text-[#7A7A7A]">
            Medicine order not found.
          </p>
        </div>

      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div className="flex items-center gap-4">

          <button
            onClick={() =>
              navigate("/medicine-orders")
            }
            className="w-10 h-10 flex items-center justify-center bg-white border border-[#EEEEEE] rounded-lg hover:bg-[#EEEEEE] transition"
          >
            <ArrowLeft size={19} />
          </button>

          <div>

            <h1 className="text-2xl font-bold text-[#212121]">
              Medicine Order Details
            </h1>

            <p className="text-sm text-[#7A7A7A] mt-1">
              View complete medicine order information
            </p>

          </div>

        </div>

        <button
          onClick={() =>
            navigate(
              `/medicine-orders/${order.id}/edit`
            )
          }
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#2F6FED] text-white rounded-lg hover:opacity-90 transition"
        >
          <Edit size={18} />
          Edit Order
        </button>

      </div>

      {/* =================================================
          ORDER HEADER CARD
      ================================================= */}

      <div className="bg-white rounded-xl border border-[#EEEEEE] shadow-sm p-6 mb-6">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-xl bg-[#D9F7E8] flex items-center justify-center">
              <Package
                size={28}
                className="text-[#2F6FED]"
              />
            </div>

            <div>

              <p className="text-sm text-[#7A7A7A]">
                Order ID
              </p>

              <h2 className="text-xl font-bold text-[#212121]">
                {order.order_id || "N/A"}
              </h2>

            </div>

          </div>

          <div>

            <span
              className={`inline-flex px-4 py-2 rounded-full text-sm font-semibold ${getStatusStyle(
                order.status
              )}`}
            >
              {order.status || "N/A"}
            </span>

          </div>

        </div>

      </div>

      {/* =================================================
          MEMBER & PRESCRIPTION
      ================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* MEMBER */}

        <div className="bg-white rounded-xl border border-[#EEEEEE] shadow-sm p-6">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-10 h-10 rounded-lg bg-[#D9F7E8] flex items-center justify-center">
              <User
                size={20}
                className="text-[#2F6FED]"
              />
            </div>

            <h2 className="text-lg font-semibold text-[#212121]">
              Member Information
            </h2>

          </div>

          <div className="space-y-4">

            <InfoRow
              label="Member ID"
              value={order.member_id}
            />

            <InfoRow
              label="Member Name"
              value={order.member_name}
            />

            <InfoRow
              label="Member Reference"
              value={order.member}
            />

          </div>

        </div>

        {/* PRESCRIPTION */}

        <div className="bg-white rounded-xl border border-[#EEEEEE] shadow-sm p-6">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-10 h-10 rounded-lg bg-[#D9F7E8] flex items-center justify-center">
              <FileText
                size={20}
                className="text-[#2F6FED]"
              />
            </div>

            <h2 className="text-lg font-semibold text-[#212121]">
              Prescription Information
            </h2>

          </div>

          <div className="space-y-4">

            <InfoRow
              label="Prescription ID"
              value={order.prescription_id}
            />

            <InfoRow
              label="Prescription Reference"
              value={order.prescription}
            />

          </div>

        </div>

      </div>

      {/* =================================================
          PHARMACY
      ================================================= */}

      <div className="bg-white rounded-xl border border-[#EEEEEE] shadow-sm p-6 mb-6">

        <div className="flex items-center gap-3 mb-5">

          <div className="w-10 h-10 rounded-lg bg-[#D9F7E8] flex items-center justify-center">
            <Building2
              size={20}
              className="text-[#2F6FED]"
            />
          </div>

          <h2 className="text-lg font-semibold text-[#212121]">
            Pharmacy Information
          </h2>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

          <InfoBox
            label="Pharmacy ID"
            value={order.pharmacy_id}
          />

          <InfoBox
            label="Pharmacy Name"
            value={order.pharmacy_name}
          />

          <InfoBox
            label="Pharmacy Reference"
            value={order.pharmacy}
          />

        </div>

      </div>

      {/* =================================================
          MEDICINE INFORMATION
      ================================================= */}

      <div className="bg-white rounded-xl border border-[#EEEEEE] shadow-sm p-6 mb-6">

        <div className="flex items-center gap-3 mb-5">

          <div className="w-10 h-10 rounded-lg bg-[#D9F7E8] flex items-center justify-center">
            <Pill
              size={20}
              className="text-[#2F6FED]"
            />
          </div>

          <h2 className="text-lg font-semibold text-[#212121]">
            Medicine Information
          </h2>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">

          <InfoBox
            label="Medicine Name"
            value={order.medicine_name}
          />

          <InfoBox
            label="Quantity"
            value={order.quantity}
          />

          <InfoBox
            label="Unit Price"
            value={
              order.unit_price
                ? `৳ ${order.unit_price}`
                : "N/A"
            }
          />

          <div className="rounded-lg bg-[#D9F7E8] p-4">

            <p className="text-sm text-[#7A7A7A] mb-1">
              Total Amount
            </p>

            <p className="text-xl font-bold text-[#2F6FED]">
              ৳ {order.total_amount || "0.00"}
            </p>

          </div>

        </div>

      </div>

      {/* =================================================
          DELIVERY INFORMATION
      ================================================= */}

      <div className="bg-white rounded-xl border border-[#EEEEEE] shadow-sm p-6 mb-6">

        <div className="flex items-center gap-3 mb-5">

          <div className="w-10 h-10 rounded-lg bg-[#D9F7E8] flex items-center justify-center">
            <Truck
              size={20}
              className="text-[#2F6FED]"
            />
          </div>

          <h2 className="text-lg font-semibold text-[#212121]">
            Delivery Information
          </h2>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <InfoBox
            label="Delivery Type"
            value={
              order.delivery_type ===
              "HOME_DELIVERY"
                ? "Home Delivery"
                : "Pharmacy Pickup"
            }
          />

          <div className="rounded-lg border border-[#EEEEEE] p-4">

            <div className="flex items-center gap-2 mb-2">

              <MapPin
                size={16}
                className="text-[#7A7A7A]"
              />

              <p className="text-sm text-[#7A7A7A]">
                Delivery Address
              </p>

            </div>

            <p className="font-medium text-[#212121]">
              {order.delivery_address ||
                "N/A"}
            </p>

          </div>

        </div>

      </div>

      {/* =================================================
          NOTES
      ================================================= */}

      <div className="bg-white rounded-xl border border-[#EEEEEE] shadow-sm p-6 mb-6">

        <h2 className="text-lg font-semibold text-[#212121] mb-4">
          Notes
        </h2>

        <div className="bg-[#F9F9F9] rounded-lg p-4">

          <p className="text-[#212121] whitespace-pre-wrap">
            {order.notes || "No notes available."}
          </p>

        </div>

      </div>

      {/* =================================================
          ORDER TIMELINE
      ================================================= */}

      <div className="bg-white rounded-xl border border-[#EEEEEE] shadow-sm p-6">

        <h2 className="text-lg font-semibold text-[#212121] mb-5">
          Order Timeline
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div className="flex items-start gap-3">

            <div className="w-10 h-10 rounded-lg bg-[#EEEEEE] flex items-center justify-center">
              <Calendar size={18} />
            </div>

            <div>

              <p className="text-sm text-[#7A7A7A]">
                Order Date
              </p>

              <p className="font-medium text-[#212121]">
                {formatDate(order.order_date)}
              </p>

            </div>

          </div>

          <div className="flex items-start gap-3">

            <div className="w-10 h-10 rounded-lg bg-[#EEEEEE] flex items-center justify-center">
              <Clock size={18} />
            </div>

            <div>

              <p className="text-sm text-[#7A7A7A]">
                Last Updated
              </p>

              <p className="font-medium text-[#212121]">
                {formatDate(order.updated_at)}
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

// =====================================================
// INFO ROW
// =====================================================

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#EEEEEE] pb-3 last:border-0">

      <span className="text-sm text-[#7A7A7A]">
        {label}
      </span>

      <span className="text-sm font-medium text-[#212121] text-right">
        {value || "N/A"}
      </span>

    </div>
  );
}

// =====================================================
// INFO BOX
// =====================================================

function InfoBox({ label, value }) {
  return (
    <div className="rounded-lg border border-[#EEEEEE] p-4">

      <p className="text-sm text-[#7A7A7A] mb-1">
        {label}
      </p>

      <p className="font-medium text-[#212121]">
        {value || "N/A"}
      </p>

    </div>
  );
}

export default MedicineOrderDetails;


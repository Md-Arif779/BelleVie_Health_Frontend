
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import {
  createMedicineOrder,
  getMedicineOrder,
  updateMedicineOrder,
} from "../../services/medicineOrderService";

import api from "../../services/api";

function MedicineOrderForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [members, setMembers] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [pharmacies, setPharmacies] = useState([]);

  const [formData, setFormData] = useState({
    member: "",
    prescription: "",
    pharmacy: "",
    medicine_name: "",
    quantity: 1,
    unit_price: "",
    delivery_type: "HOME_DELIVERY",
    delivery_address: "",
    status: "PENDING",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    loadFormData();
  }, [id]);

  const loadFormData = async () => {
    try {
      setPageLoading(true);
      setError("");

      const [
        membersResponse,
        prescriptionsResponse,
        pharmaciesResponse,
      ] = await Promise.all([
        api.get("/members/"),
        api.get("/services/prescriptions/"),
        api.get("/providers/pharmacies/"),
      ]);

      setMembers(
        membersResponse.data.results ||
          membersResponse.data ||
          []
      );

      setPrescriptions(
        prescriptionsResponse.data.results ||
          prescriptionsResponse.data ||
          []
      );

      setPharmacies(
        pharmaciesResponse.data.results ||
          pharmaciesResponse.data ||
          []
      );

      // Edit mode
      if (isEdit) {
        const order = await getMedicineOrder(id);

        setFormData({
          member: order.member || "",
          prescription: order.prescription || "",
          pharmacy: order.pharmacy || "",
          medicine_name: order.medicine_name || "",
          quantity: order.quantity || 1,
          unit_price: order.unit_price || "",
          delivery_type:
            order.delivery_type || "HOME_DELIVERY",
          delivery_address:
            order.delivery_address || "",
          status: order.status || "PENDING",
          notes: order.notes || "",
        });
      }
    } catch (err) {
      console.error(
        "Medicine Order Form Error:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Failed to load medicine order form."
      );
    } finally {
      setPageLoading(false);
    }
  };

  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "quantity"
          ? Number(value)
          : value,
    }));
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const payload = {
        member: Number(formData.member),
        prescription: Number(
          formData.prescription
        ),
        pharmacy: Number(formData.pharmacy),

        medicine_name:
          formData.medicine_name.trim(),

        quantity: Number(formData.quantity),

        unit_price:
          formData.unit_price,

        delivery_type:
          formData.delivery_type,

        delivery_address:
          formData.delivery_address.trim(),

        status: formData.status,

        notes: formData.notes.trim(),
      };

      if (isEdit) {
        await updateMedicineOrder(id, payload);
      } else {
        await createMedicineOrder(payload);
      }

      navigate("/medicine-orders");
    } catch (err) {
      console.error(
        "Save Medicine Order Error:",
        err
      );

      const backendError =
        err.response?.data;

      if (
        typeof backendError === "object"
      ) {
        const messages = Object.entries(
          backendError
        )
          .map(([field, message]) => {
            const text = Array.isArray(message)
              ? message.join(", ")
              : message;

            return `${field}: ${text}`;
          })
          .join(" | ");

        setError(
          messages || "Failed to save medicine order."
        );
      } else {
        setError(
          "Failed to save medicine order."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-[#7A7A7A]">
          Loading...
        </p>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <h1 className="text-2xl font-bold text-[#212121]">
            {isEdit
              ? "Edit Medicine Order"
              : "Create Medicine Order"}
          </h1>

          <p className="text-sm text-[#7A7A7A] mt-1">
            {isEdit
              ? "Update medicine order information"
              : "Create a new medicine order"}
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/medicine-orders")
          }
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#EEEEEE] rounded-lg text-[#212121] hover:bg-[#EEEEEE] transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>

      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-5 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-[#EEEEEE] shadow-sm"
      >

        {/* BASIC INFORMATION */}
        <div className="p-6 border-b border-[#EEEEEE]">

          <h2 className="text-lg font-semibold text-[#212121] mb-5">
            Order Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* MEMBER */}
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-2">
                Member
              </label>

              <select
                name="member"
                value={formData.member}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6FED]"
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
                    {member.full_name}
                  </option>
                ))}
              </select>
            </div>

            {/* PRESCRIPTION */}
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-2">
                Prescription
              </label>

              <select
                name="prescription"
                value={formData.prescription}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6FED]"
              >
                <option value="">
                  Select Prescription
                </option>

                {prescriptions.map(
                  (prescription) => (
                    <option
                      key={prescription.id}
                      value={prescription.id}
                    >
                      {prescription.prescription_id}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* PHARMACY */}
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-2">
                Pharmacy
              </label>

              <select
                name="pharmacy"
                value={formData.pharmacy}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6FED]"
              >
                <option value="">
                  Select Pharmacy
                </option>

                {pharmacies.map((pharmacy) => (
                  <option
                    key={pharmacy.id}
                    value={pharmacy.id}
                  >
                    {pharmacy.pharmacy_id} -{" "}
                    {pharmacy.name}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* MEDICINE INFORMATION */}
        <div className="p-6 border-b border-[#EEEEEE]">

          <h2 className="text-lg font-semibold text-[#212121] mb-5">
            Medicine Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* MEDICINE NAME */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-[#212121] mb-2">
                Medicine Name
              </label>

              <input
                type="text"
                name="medicine_name"
                value={formData.medicine_name}
                onChange={handleChange}
                placeholder="Enter medicine name"
                required
                className="w-full px-4 py-2.5 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6FED]"
              />
            </div>

            {/* QUANTITY */}
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-2">
                Quantity
              </label>

              <input
                type="number"
                name="quantity"
                min="1"
                value={formData.quantity}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6FED]"
              />
            </div>

            {/* UNIT PRICE */}
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-2">
                Unit Price
              </label>

              <input
                type="number"
                name="unit_price"
                min="0"
                step="0.01"
                value={formData.unit_price}
                onChange={handleChange}
                placeholder="0.00"
                required
                className="w-full px-4 py-2.5 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6FED]"
              />
            </div>

          </div>

          {/* TOTAL */}
          <div className="mt-5 bg-[#D9F7E8] rounded-lg p-4 flex justify-between items-center">

            <span className="font-medium text-[#212121]">
              Estimated Total
            </span>

            <span className="text-xl font-bold text-[#2F6FED]">
              ৳{" "}
              {(
                Number(formData.unit_price || 0) *
                Number(formData.quantity || 0)
              ).toFixed(2)}
            </span>

          </div>

        </div>

        {/* DELIVERY */}
        <div className="p-6 border-b border-[#EEEEEE]">

          <h2 className="text-lg font-semibold text-[#212121] mb-5">
            Delivery Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* DELIVERY TYPE */}
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-2">
                Delivery Type
              </label>

              <select
                name="delivery_type"
                value={formData.delivery_type}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6FED]"
              >
                <option value="HOME_DELIVERY">
                  Home Delivery
                </option>

                <option value="PHARMACY_PICKUP">
                  Pharmacy Pickup
                </option>
              </select>
            </div>

            {/* STATUS */}
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-2">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6FED]"
              >
                <option value="PENDING">
                  Pending
                </option>

                <option value="CONFIRMED">
                  Confirmed
                </option>

                <option value="PROCESSING">
                  Processing
                </option>

                <option value="READY">
                  Ready
                </option>

                <option value="DELIVERED">
                  Delivered
                </option>

                <option value="CANCELLED">
                  Cancelled
                </option>
              </select>
            </div>

          </div>

          {/* ADDRESS */}
          {formData.delivery_type ===
            "HOME_DELIVERY" && (
            <div className="mt-5">

              <label className="block text-sm font-medium text-[#212121] mb-2">
                Delivery Address
              </label>

              <textarea
                name="delivery_address"
                value={
                  formData.delivery_address
                }
                onChange={handleChange}
                rows="3"
                placeholder="Enter delivery address"
                required
                className="w-full px-4 py-2.5 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6FED] resize-none"
              />

            </div>
          )}

        </div>

        {/* NOTES */}
        <div className="p-6">

          <label className="block text-sm font-medium text-[#212121] mb-2">
            Notes
          </label>

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="4"
            placeholder="Additional notes..."
            className="w-full px-4 py-2.5 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F6FED] resize-none"
          />

        </div>

        {/* ACTIONS */}
        <div className="px-6 py-4 bg-[#F9F9F9] border-t border-[#EEEEEE] flex justify-end gap-3 rounded-b-xl">

          <button
            type="button"
            onClick={() =>
              navigate("/medicine-orders")
            }
            className="px-5 py-2.5 bg-white border border-[#DDDDDD] rounded-lg text-[#212121] hover:bg-[#EEEEEE] transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#2F6FED] text-white rounded-lg hover:opacity-90 transition disabled:opacity-50"
          >
            <Save size={18} />

            {loading
              ? "Saving..."
              : isEdit
              ? "Update Order"
              : "Create Order"}
          </button>

        </div>

      </form>
    </div>
  );
}

export default MedicineOrderForm;


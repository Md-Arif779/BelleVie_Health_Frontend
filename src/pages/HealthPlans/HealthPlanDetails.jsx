import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import { getHealthPlan } from "../../services/healthPlanService";
import { useAuth } from "../../context/AuthContext";
import { canEdit } from "../../utils/permission";

const HealthPlanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { permissions } = useAuth();

  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPlan = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getHealthPlan(id);

        setPlan(response);
      } catch (err) {
        console.error("Health Plan Details Error:", err);

        setError(
          err?.response?.data?.detail ||
            "Failed to load health plan details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPlan();
    }
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount) => {
    if (amount === null || amount === undefined || amount === "") {
      return "0.00";
    }

    return Number(amount).toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";

      case "INACTIVE":
        return "bg-gray-100 text-gray-700";

      case "EXPIRED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#7A7A7A]">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading health plan...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate("/health-plans")}
          className="flex items-center gap-2 text-[#2F6FED] hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Health Plans
        </button>

        <div className="bg-white border border-red-200 rounded-xl p-6 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate("/health-plans")}
          className="flex items-center gap-2 text-[#2F6FED] hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Health Plans
        </button>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 text-[#7A7A7A]">
          Health plan not found.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#F2F2F2] min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <button
            onClick={() => navigate("/health-plans")}
            className="flex items-center gap-2 text-[#7A7A7A] hover:text-[#2F6FED] mb-3 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Health Plans
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#D9F7E8] flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#2F6FED]" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-[#212121]">
                Health Plan Details
              </h1>

              <p className="text-sm text-[#7A7A7A]">
                {plan.plan_id}
              </p>
            </div>
          </div>
        </div>

        {canEdit(permissions, "health_plans") && (
          <button
            onClick={() =>
              navigate(`/health-plans/${plan.id}/edit`)
            }
            className="flex items-center gap-2 px-4 py-2.5 bg-[#2F6FED] text-white rounded-lg hover:bg-[#2459C7] transition"
          >
            <Edit className="w-4 h-4" />
            Edit Plan
          </button>
        )}
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        {/* Plan Header */}
        <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#212121]">
              {plan.plan_name || "N/A"}
            </h2>

            <p className="text-sm text-[#7A7A7A] mt-1">
              Plan ID: {plan.plan_id || "N/A"}
            </p>
          </div>

          <span
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${getStatusStyle(
              plan.status
            )}`}
          >
            {plan.status || "N/A"}
          </span>
        </div>

        {/* Plan Information */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-[#212121] mb-4">
            Plan Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <InfoItem
              label="Plan ID"
              value={plan.plan_id}
            />

            <InfoItem
              label="Plan Name"
              value={plan.plan_name}
            />

            <InfoItem
              label="Plan Type"
              value={plan.plan_type}
            />

            <InfoItem
              label="Provider Name"
              value={plan.provider_name}
            />

            <InfoItem
              label="Coverage Amount"
              value={`৳ ${formatAmount(plan.coverage_amount)}`}
            />

            <InfoItem
              label="Premium"
              value={`৳ ${formatAmount(plan.premium)}`}
            />

            <InfoItem
              label="Start Date"
              value={formatDate(plan.start_date)}
            />

            <InfoItem
              label="Expiry Date"
              value={formatDate(plan.expiry_date)}
            />

            <InfoItem
              label="Status"
              value={plan.status}
            />
          </div>
        </div>

        {/* Member Information */}
        <div className="px-6 py-6 border-t border-[#E5E7EB]">
          <h3 className="text-lg font-semibold text-[#212121] mb-4">
            Member Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InfoItem
              label="Member ID"
              value={plan.member_id}
            />

            <InfoItem
              label="Member Name"
              value={plan.member_name}
            />
          </div>
        </div>

        {/* Coverage Details */}
        <div className="px-6 py-6 border-t border-[#E5E7EB]">
          <h3 className="text-lg font-semibold text-[#212121] mb-4">
            Coverage Details
          </h3>

          <div className="bg-[#F2F2F2] rounded-lg p-4 min-h-[100px]">
            <p className="text-sm text-[#212121] whitespace-pre-wrap">
              {plan.coverage_details || "No coverage details available."}
            </p>
          </div>
        </div>

        {/* Notes */}
        <div className="px-6 py-6 border-t border-[#E5E7EB]">
          <h3 className="text-lg font-semibold text-[#212121] mb-4">
            Notes
          </h3>

          <div className="bg-[#F2F2F2] rounded-lg p-4 min-h-[80px]">
            <p className="text-sm text-[#212121] whitespace-pre-wrap">
              {plan.notes || "No notes available."}
            </p>
          </div>
        </div>

        {/* Metadata */}
        <div className="px-6 py-6 border-t border-[#E5E7EB]">
          <h3 className="text-lg font-semibold text-[#212121] mb-4">
            Record Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InfoItem
              label="Created At"
              value={formatDateTime(plan.created_at)}
            />

            <InfoItem
              label="Updated At"
              value={formatDateTime(plan.updated_at)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => {
  return (
    <div>
      <p className="text-xs font-medium text-[#7A7A7A] mb-1">
        {label}
      </p>

      <p className="text-sm font-medium text-[#212121]">
        {value || "N/A"}
      </p>
    </div>
  );
};

export default HealthPlanDetails;
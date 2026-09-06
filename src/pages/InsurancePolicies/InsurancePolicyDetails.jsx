import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  ShieldCheck,
  User,
} from "lucide-react";

import {
  getInsurancePolicy,
} from "../../services/insurancePolicyService";

import { useAuth } from "../../context/AuthContext";
import { canEdit } from "../../utils/permission";

const InsurancePolicyDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { permissions } = useAuth();

  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPolicy();
  }, [id]);

  const loadPolicy = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getInsurancePolicy(id);

      setPolicy(data);
    } catch (err) {
      console.error(
        "Insurance Policy Details Error:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Failed to load insurance policy."
      );
    } finally {
      setLoading(false);
    }
  };

  const getMemberName = (member) => {
    if (!member) return "-";

    if (typeof member === "string") {
      return member;
    }

    return (
      member.full_name ||
      member.name ||
      member.member_id ||
      "-"
    );
  };

  const getMemberId = (member) => {
    if (!member || typeof member === "string") {
      return "-";
    }

    return member.member_id || member.id || "-";
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";

      case "EXPIRED":
        return "bg-gray-100 text-gray-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatAmount = (amount) => {
    if (
      amount === null ||
      amount === undefined ||
      amount === ""
    ) {
      return "-";
    }

    return `৳${amount}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">
        <div className="rounded-xl bg-white p-8 text-center text-sm text-[#7A7A7A] shadow-sm">
          Loading insurance policy...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">
        <button
          onClick={() =>
            navigate("/insurance-policies")
          }
          className="mb-5 flex items-center gap-2 text-sm font-medium text-[#2F6FED]"
        >
          <ArrowLeft size={18} />
          Back to Insurance Policies
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!policy) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              navigate("/insurance-policies")
            }
            className="rounded-lg bg-white p-2.5 text-[#7A7A7A] shadow-sm hover:bg-[#EEF4FF] hover:text-[#2F6FED]"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D9F7E8]">
                <ShieldCheck
                  size={24}
                  className="text-[#2F6FED]"
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-[#212121]">
                  Insurance Policy
                </h1>

                <p className="text-sm text-[#7A7A7A]">
                  {policy.policy_id || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {canEdit(
          permissions,
          "insurance_policies"
        ) && (
          <button
            onClick={() =>
              navigate(
                `/insurance-policies/${policy.id}/edit`
              )
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-[#2F6FED] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#2459C7]"
          >
            <Pencil size={18} />
            Edit Policy
          </button>
        )}
      </div>

      {/* Status */}
      <div className="mb-6 rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-[#7A7A7A]">
              Policy ID
            </p>

            <p className="mt-1 text-lg font-semibold text-[#2F6FED]">
              {policy.policy_id || "-"}
            </p>
          </div>

          <span
            className={`rounded-full px-4 py-2 text-sm font-medium ${getStatusClass(
              policy.status
            )}`}
          >
            {policy.status || "-"}
          </span>
        </div>
      </div>

      {/* Member Information */}
      <div className="mb-6 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF4FF]">
            <User
              size={20}
              className="text-[#2F6FED]"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-[#212121]">
              Member Information
            </h2>

            <p className="text-sm text-[#7A7A7A]">
              Policy holder details
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <p className="text-sm text-[#7A7A7A]">
              Member Name
            </p>

            <p className="mt-1 font-medium text-[#212121]">
              {getMemberName(policy.member)}
            </p>
          </div>

          <div>
            <p className="text-sm text-[#7A7A7A]">
              Member ID
            </p>

            <p className="mt-1 font-medium text-[#212121]">
              {getMemberId(policy.member)}
            </p>
          </div>
        </div>
      </div>

      {/* Policy Information */}
      <div className="mb-6 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold text-[#212121]">
          Policy Information
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm text-[#7A7A7A]">
              Provider Name
            </p>

            <p className="mt-1 font-medium text-[#212121]">
              {policy.provider_name || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-[#7A7A7A]">
              Policy Number
            </p>

            <p className="mt-1 font-medium text-[#212121]">
              {policy.policy_number || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-[#7A7A7A]">
              Plan Name
            </p>

            <p className="mt-1 font-medium text-[#212121]">
              {policy.plan_name || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-[#7A7A7A]">
              Coverage Amount
            </p>

            <p className="mt-1 font-medium text-[#212121]">
              {formatAmount(
                policy.coverage_amount
              )}
            </p>
          </div>

          <div>
            <p className="text-sm text-[#7A7A7A]">
              Premium
            </p>

            <p className="mt-1 font-medium text-[#212121]">
              {formatAmount(policy.premium)}
            </p>
          </div>

          <div>
            <p className="text-sm text-[#7A7A7A]">
              Status
            </p>

            <p className="mt-1">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                  policy.status
                )}`}
              >
                {policy.status || "-"}
              </span>
            </p>
          </div>

          <div>
            <p className="text-sm text-[#7A7A7A]">
              Start Date
            </p>

            <p className="mt-1 font-medium text-[#212121]">
              {policy.start_date || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-[#7A7A7A]">
              Expiry Date
            </p>

            <p className="mt-1 font-medium text-[#212121]">
              {policy.expiry_date || "-"}
            </p>
          </div>
        </div>
      </div>

      {/* Coverage Details */}
      <div className="mb-6 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-[#212121]">
          Coverage Details
        </h2>

        <div className="rounded-lg bg-[#F8F9FA] p-4">
          <p className="whitespace-pre-wrap text-sm leading-6 text-[#212121]">
            {policy.coverage_details ||
              "No coverage details available."}
          </p>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-6 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-[#212121]">
          Notes
        </h2>

        <div className="rounded-lg bg-[#F8F9FA] p-4">
          <p className="whitespace-pre-wrap text-sm leading-6 text-[#212121]">
            {policy.notes ||
              "No additional notes available."}
          </p>
        </div>
      </div>

      {/* Record Information */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-lg font-semibold text-[#212121]">
          Record Information
        </h2>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div>
            <p className="text-sm text-[#7A7A7A]">
              Created At
            </p>

            <p className="mt-1 text-sm font-medium text-[#212121]">
              {policy.created_at || "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-[#7A7A7A]">
              Updated At
            </p>

            <p className="mt-1 text-sm font-medium text-[#212121]">
              {policy.updated_at || "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsurancePolicyDetails;
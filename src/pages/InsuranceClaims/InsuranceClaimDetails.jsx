import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  ShieldAlert,
  User,
  FileText,
  CalendarDays,
  CreditCard,
  Clock,
} from "lucide-react";

import { getInsuranceClaim } from "../../services/insuranceClaimService";
import { useAuth } from "../../context/AuthContext";
import { canEdit } from "../../utils/permission";

const claimTypeLabels = {
  HOSPITALIZATION: "Hospitalization",
  CONSULTATION: "Consultation",
  DIAGNOSTIC: "Diagnostic",
  MEDICINE: "Medicine",
  SURGERY: "Surgery",
  OTHER: "Other",
};

const statusConfig = {
  PENDING: {
    label: "Pending",
    className: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  APPROVED: {
    label: "Approved",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  PAID: {
    label: "Paid",
    className: "bg-purple-50 text-purple-700 border-purple-200",
  },
};

function InsuranceClaimDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { permissions } = useAuth();

  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadClaim = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getInsuranceClaim(id);

        setClaim(response);
      } catch (err) {
        console.error(
          "Insurance Claim Details Error:",
          err
        );

        setError(
          err?.response?.data?.detail ||
            "Failed to load insurance claim."
        );
      } finally {
        setLoading(false);
      }
    };

    loadClaim();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const formatAmount = (amount) => {
    if (
      amount === null ||
      amount === undefined ||
      amount === ""
    ) {
      return "—";
    }

    return `৳ ${Number(amount).toLocaleString(
      "en-BD",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[#7A7A7A]">
          Loading insurance claim...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => navigate("/insurance-claims")}
          className="inline-flex items-center gap-2 text-[#2F6FED] font-medium"
        >
          <ArrowLeft size={18} />
          Back to Claims
        </button>

        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-5">
          {error}
        </div>
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-8 text-center">
        <p className="text-[#7A7A7A]">
          Insurance claim not found.
        </p>
      </div>
    );
  }

  const status =
    statusConfig[claim.status] || {
      label: claim.status || "Unknown",
      className:
        "bg-gray-50 text-gray-700 border-gray-200",
    };

  const memberName =
    claim.member_name ||
    claim.member?.full_name ||
    claim.member ||
    "—";

  const memberId =
    claim.member_id ||
    claim.member?.member_id ||
    "—";

  const policyId =
    claim.policy_id ||
    claim.policy?.policy_id ||
    "—";

  const policyNumber =
    claim.policy_number ||
    claim.policy?.policy_number ||
    "—";

  const canEditClaim = canEdit(
    permissions,
    "insurance_claims"
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() =>
              navigate("/insurance-claims")
            }
            className="p-2 rounded-lg border border-[#E5E7EB] bg-white hover:bg-[#F2F2F2]"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#212121]">
                {claim.claim_id || "Insurance Claim"}
              </h1>

              <span
                className={`px-3 py-1 rounded-full border text-xs font-medium ${status.className}`}
              >
                {status.label}
              </span>
            </div>

            <p className="text-sm text-[#7A7A7A] mt-1">
              Insurance claim details
            </p>
          </div>
        </div>

        {canEditClaim && (
          <button
            type="button"
            onClick={() =>
              navigate(
                `/insurance-claims/${claim.id}/edit`
              )
            }
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#2F6FED] text-white font-medium hover:bg-[#2459C7]"
          >
            <Pencil size={18} />
            Edit Claim
          </button>
        )}
      </div>

      {/* Claim Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Claim Amount */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-[#EEF4FF] text-[#2F6FED]">
              <CreditCard size={22} />
            </div>

            <div>
              <p className="text-sm text-[#7A7A7A]">
                Claim Amount
              </p>

              <p className="text-xl font-bold text-[#212121] mt-1">
                {formatAmount(claim.claim_amount)}
              </p>
            </div>
          </div>
        </div>

        {/* Approved Amount */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-[#D9F7E8] text-green-600">
              <CreditCard size={22} />
            </div>

            <div>
              <p className="text-sm text-[#7A7A7A]">
                Approved Amount
              </p>

              <p className="text-xl font-bold text-[#212121] mt-1">
                {formatAmount(
                  claim.approved_amount
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Claim Type */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-[#F2F2F2] text-[#7A7A7A]">
              <ShieldAlert size={22} />
            </div>

            <div>
              <p className="text-sm text-[#7A7A7A]">
                Claim Type
              </p>

              <p className="text-lg font-semibold text-[#212121] mt-1">
                {claimTypeLabels[
                  claim.claim_type
                ] ||
                  claim.claim_type ||
                  "—"}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Member & Policy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Member */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <div className="flex items-center gap-2 mb-5">
            <User
              size={20}
              className="text-[#2F6FED]"
            />

            <h2 className="text-lg font-semibold text-[#212121]">
              Member Information
            </h2>
          </div>

          <div className="space-y-4">

            <div>
              <p className="text-sm text-[#7A7A7A]">
                Member Name
              </p>

              <p className="font-medium text-[#212121] mt-1">
                {memberName}
              </p>
            </div>

            <div>
              <p className="text-sm text-[#7A7A7A]">
                Member ID
              </p>

              <p className="font-medium text-[#212121] mt-1">
                {memberId}
              </p>
            </div>

          </div>
        </div>

        {/* Policy */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <div className="flex items-center gap-2 mb-5">
            <ShieldAlert
              size={20}
              className="text-[#2F6FED]"
            />

            <h2 className="text-lg font-semibold text-[#212121]">
              Insurance Policy
            </h2>
          </div>

          <div className="space-y-4">

            <div>
              <p className="text-sm text-[#7A7A7A]">
                Policy ID
              </p>

              <p className="font-medium text-[#212121] mt-1">
                {policyId}
              </p>
            </div>

            <div>
              <p className="text-sm text-[#7A7A7A]">
                Policy Number
              </p>

              <p className="font-medium text-[#212121] mt-1">
                {policyNumber}
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Claim Details */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">

        <div className="flex items-center gap-2 mb-6">
          <FileText
            size={20}
            className="text-[#2F6FED]"
          />

          <h2 className="text-lg font-semibold text-[#212121]">
            Claim Details
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <p className="text-sm text-[#7A7A7A]">
              Claim Date
            </p>

            <p className="font-medium text-[#212121] mt-1">
              {formatDate(claim.claim_date)}
            </p>
          </div>

          <div>
            <p className="text-sm text-[#7A7A7A]">
              Service Date
            </p>

            <p className="font-medium text-[#212121] mt-1">
              {formatDate(claim.service_date)}
            </p>
          </div>

          <div>
            <p className="text-sm text-[#7A7A7A]">
              Claim Type
            </p>

            <p className="font-medium text-[#212121] mt-1">
              {claimTypeLabels[
                claim.claim_type
              ] ||
                claim.claim_type ||
                "—"}
            </p>
          </div>

          <div>
            <p className="text-sm text-[#7A7A7A]">
              Status
            </p>

            <span
              className={`inline-flex mt-1 px-3 py-1 rounded-full border text-xs font-medium ${status.className}`}
            >
              {status.label}
            </span>
          </div>

        </div>

      </div>

      {/* Service Description */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">

        <h2 className="text-lg font-semibold text-[#212121] mb-4">
          Service Description
        </h2>

        <div className="bg-[#F2F2F2] rounded-lg p-4">
          <p className="text-[#212121] whitespace-pre-wrap leading-7">
            {claim.service_description || "—"}
          </p>
        </div>

      </div>

      {/* Rejection Reason */}
      {claim.rejection_reason && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">

          <h2 className="text-lg font-semibold text-red-700 mb-3">
            Rejection Reason
          </h2>

          <p className="text-red-700 whitespace-pre-wrap leading-7">
            {claim.rejection_reason}
          </p>

        </div>
      )}

      {/* Notes */}
      {claim.notes && (
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">

          <h2 className="text-lg font-semibold text-[#212121] mb-3">
            Notes
          </h2>

          <p className="text-[#7A7A7A] whitespace-pre-wrap leading-7">
            {claim.notes}
          </p>

        </div>
      )}

      {/* Audit Information */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">

        <div className="flex items-center gap-2 mb-5">
          <Clock
            size={20}
            className="text-[#2F6FED]"
          />

          <h2 className="text-lg font-semibold text-[#212121]">
            Record Information
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="flex items-start gap-3">
            <CalendarDays
              size={18}
              className="text-[#7A7A7A] mt-0.5"
            />

            <div>
              <p className="text-sm text-[#7A7A7A]">
                Created At
              </p>

              <p className="font-medium text-[#212121] mt-1">
                {claim.created_at
                  ? new Date(
                      claim.created_at
                    ).toLocaleString()
                  : "—"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock
              size={18}
              className="text-[#7A7A7A] mt-0.5"
            />

            <div>
              <p className="text-sm text-[#7A7A7A]">
                Last Updated
              </p>

              <p className="font-medium text-[#212121] mt-1">
                {claim.updated_at
                  ? new Date(
                      claim.updated_at
                    ).toLocaleString()
                  : "—"}
              </p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default InsuranceClaimDetails;
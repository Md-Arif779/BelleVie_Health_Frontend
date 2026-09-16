
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  ShieldCheck,
  User,
  Building2,
  CalendarDays,
  FileText,
  CircleDollarSign,
  Loader2,
  Hash,
  ClipboardList,
  StickyNote,
} from "lucide-react";

import { getInsurancePolicy } from "../../services/insurancePolicyService";

const STATUS_STYLES = {
  ACTIVE: "bg-[#DCFCE7] text-[#166534]",
  EXPIRED: "bg-[#FEE2E2] text-[#991B1B]",
  CANCELLED: "bg-[#F3F4F6] text-[#4B5563]",
};

const STATUS_LABELS = {
  ACTIVE: "Active",
  EXPIRED: "Expired",
  CANCELLED: "Cancelled",
};

const formatDate = (date) => {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatAmount = (amount) => {
  if (
    amount === null ||
    amount === undefined ||
    amount === ""
  ) {
    return "0.00";
  }

  const number = Number(amount);

  if (Number.isNaN(number)) {
    return amount;
  }

  return number.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

function InfoItem({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-lg border border-bv-card bg-white p-4">
      <div className="mb-2 flex items-center gap-2 text-bv-gray">
        <Icon size={17} />

        <span className="text-xs font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>

      <p className="break-words text-sm font-medium text-bv-dark">
        {value || "—"}
      </p>
    </div>
  );
}

export default function InsurancePolicyDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [policy, setPolicy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --------------------------------------------------
  // Load Policy
  // --------------------------------------------------

  useEffect(() => {
    const loadPolicy = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getInsurancePolicy(id);

        setPolicy(data);
      } catch (err) {
        console.error(
          "Failed to load insurance policy:",
          err
        );

        setError(
          "Failed to load insurance policy."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPolicy();
  }, [id]);

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-bv-bg">
        <div className="flex items-center gap-3 text-bv-gray">
          <Loader2
            size={22}
            className="animate-spin"
          />

          <span>
            Loading insurance policy...
          </span>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (error || !policy) {
    return (
      <div className="min-h-full bg-bv-bg p-6">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm text-red-700">
            {error ||
              "Insurance policy not found."}
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/insurance-policies")
            }
            className="mt-4 rounded-lg bg-bv-blue px-4 py-2 text-sm font-medium text-white"
          >
            Back to Insurance Policies
          </button>
        </div>
      </div>
    );
  }

  const status =
    STATUS_LABELS[policy.status] ||
    policy.status ||
    "Unknown";

  const statusStyle =
    STATUS_STYLES[policy.status] ||
    "bg-gray-100 text-gray-600";

  return (
    <div className="min-h-full bg-bv-bg p-6">
      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          {/* Back */}

          <button
            type="button"
            onClick={() =>
              navigate("/insurance-policies")
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-bv-card bg-white text-bv-gray transition hover:bg-bv-mint hover:text-bv-blue"
          >
            <ArrowLeft size={20} />
          </button>

          {/* Title */}

          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck
                size={24}
                className="text-bv-blue"
              />

              <h1 className="text-2xl font-semibold text-bv-dark">
                Insurance Policy
              </h1>
            </div>

            <p className="mt-1 text-sm text-bv-gray">
              View complete insurance policy information.
            </p>
          </div>
        </div>

        {/* Actions */}

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() =>
              navigate(
                `/insurance-policies/${id}/edit`
              )
            }
            className="flex items-center gap-2 rounded-lg bg-bv-blue px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
          >
            <Edit size={17} />

            Edit Policy
          </button>
        </div>
      </div>

      {/* ==================================================
          POLICY HEADER CARD
      ================================================== */}

      <div className="mb-6 rounded-xl border border-bv-card bg-white shadow-bv">
        <div className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-bv-mint">
                <ShieldCheck
                  size={23}
                  className="text-bv-blue"
                />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-bv-gray">
                  Policy ID
                </p>

                <h2 className="text-lg font-semibold text-bv-dark">
                  {policy.policy_id || "—"}
                </h2>
              </div>
            </div>

            <p className="mt-3 text-sm text-bv-gray">
              Policy Number:{" "}
              <span className="font-medium text-bv-dark">
                {policy.policy_number || "—"}
              </span>
            </p>
          </div>

          <span
            className={`inline-flex w-fit items-center rounded-full px-4 py-2 text-sm font-medium ${statusStyle}`}
          >
            {status}
          </span>
        </div>
      </div>

      {/* ==================================================
          MEMBER & PROVIDER
      ================================================== */}

      <div className="mb-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-bv-dark">
            Member & Provider
          </h2>

          <p className="mt-1 text-sm text-bv-gray">
            Member and insurance provider information.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <InfoItem
            icon={User}
            label="Member"
            value={policy.member_name}
          />

          <InfoItem
            icon={Hash}
            label="Member ID"
            value={policy.member_id}
          />

          <InfoItem
            icon={Building2}
            label="Insurance Provider"
            value={policy.provider_name}
          />

          <InfoItem
            icon={FileText}
            label="Plan Name"
            value={policy.plan_name}
          />
        </div>
      </div>

      {/* ==================================================
          POLICY & FINANCIAL INFORMATION
      ================================================== */}

      <div className="mb-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-bv-dark">
            Policy Information
          </h2>

          <p className="mt-1 text-sm text-bv-gray">
            Coverage, premium and policy period.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <InfoItem
            icon={CircleDollarSign}
            label="Coverage Amount"
            value={formatAmount(
              policy.coverage_amount
            )}
          />

          <InfoItem
            icon={CircleDollarSign}
            label="Premium"
            value={formatAmount(
              policy.premium
            )}
          />

          <InfoItem
            icon={CalendarDays}
            label="Start Date"
            value={formatDate(
              policy.start_date
            )}
          />

          <InfoItem
            icon={CalendarDays}
            label="Expiry Date"
            value={formatDate(
              policy.expiry_date
            )}
          />
        </div>
      </div>

      {/* ==================================================
          COVERAGE DETAILS
      ================================================== */}

      <div className="mb-6 rounded-xl border border-bv-card bg-white shadow-bv">
        <div className="border-b border-bv-card px-6 py-5">
          <div className="flex items-center gap-2">
            <ClipboardList
              size={20}
              className="text-bv-blue"
            />

            <h2 className="text-lg font-semibold text-bv-dark">
              Coverage Details
            </h2>
          </div>
        </div>

        <div className="p-6">
          {policy.coverage_details ? (
            <p className="whitespace-pre-wrap text-sm leading-6 text-bv-dark">
              {policy.coverage_details}
            </p>
          ) : (
            <p className="text-sm text-bv-gray">
              No coverage details available.
            </p>
          )}
        </div>
      </div>

      {/* ==================================================
          NOTES
      ================================================== */}

      <div className="mb-6 rounded-xl border border-bv-card bg-white shadow-bv">
        <div className="border-b border-bv-card px-6 py-5">
          <div className="flex items-center gap-2">
            <StickyNote
              size={20}
              className="text-bv-blue"
            />

            <h2 className="text-lg font-semibold text-bv-dark">
              Notes
            </h2>
          </div>
        </div>

        <div className="p-6">
          {policy.notes ? (
            <p className="whitespace-pre-wrap text-sm leading-6 text-bv-dark">
              {policy.notes}
            </p>
          ) : (
            <p className="text-sm text-bv-gray">
              No notes available.
            </p>
          )}
        </div>
      </div>

      {/* ==================================================
          SYSTEM INFORMATION
      ================================================== */}

      <div className="rounded-xl border border-bv-card bg-white shadow-bv">
        <div className="border-b border-bv-card px-6 py-5">
          <h2 className="text-lg font-semibold text-bv-dark">
            System Information
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-2">
          <InfoItem
            icon={CalendarDays}
            label="Created At"
            value={
              policy.created_at
                ? new Date(
                    policy.created_at
                  ).toLocaleString("en-GB")
                : "—"
            }
          />

          <InfoItem
            icon={CalendarDays}
            label="Last Updated"
            value={
              policy.updated_at
                ? new Date(
                    policy.updated_at
                  ).toLocaleString("en-GB")
                : "—"
            }
          />
        </div>
      </div>
    </div>
  );
}


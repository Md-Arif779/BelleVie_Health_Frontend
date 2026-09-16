
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Calendar,
  CreditCard,
  FileText,
  HeartPulse,
  ShieldCheck,
  User,
  Building2,
  Pencil,
  Loader2,
} from "lucide-react";

import { getHealthPlan } from "../../services/healthPlanService";
import { getPartner } from "../../services/partnerService";

import { useAuth } from "../../context/AuthContext";
import { hasPermission } from "../../utils/permission";


const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-GB", {
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
    return "-";
  }

  return `৳ ${Number(amount).toLocaleString("en-BD", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
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


const getMemberName = (member) => {
  if (!member) return "-";

  if (typeof member === "string") {
    return member;
  }

  return (
    member.full_name ||
    member.name ||
    member.member_name ||
    member.member_id ||
    "-"
  );
};


const getMemberId = (member) => {
  if (!member) return null;

  if (typeof member === "object") {
    return member.member_id || member.id || null;
  }

  return member;
};


const getProviderName = (provider) => {
  if (!provider) return "-";

  if (typeof provider === "object") {
    return (
      provider.name ||
      provider.partner_name ||
      provider.partner_id ||
      "-"
    );
  }

  return "-";
};


const getProviderId = (provider) => {
  if (!provider) return null;

  if (typeof provider === "object") {
    return provider.partner_id || provider.id || null;
  }

  return provider;
};


export default function HealthPlanDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { permissions } = useAuth();

  const [plan, setPlan] = useState(null);
  const [provider, setProvider] = useState(null);

  const [loading, setLoading] = useState(true);
  const [loadingProvider, setLoadingProvider] = useState(false);

  const [error, setError] = useState("");

  const canEditPlan = hasPermission(
    permissions,
    "health_plans"
  );


  useEffect(() => {
    const loadPlan = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getHealthPlan(id);

        setPlan(data);

        /*
         * Provider can come as:
         *
         * provider: 2
         *
         * OR:
         *
         * provider: {
         *   id: 2,
         *   name: "Insurance Company"
         * }
         */

        let providerId = null;

        if (
          data.provider &&
          typeof data.provider === "object"
        ) {
          providerId =
            data.provider.id ||
            data.provider.pk ||
            null;

          setProvider(data.provider);
        } else {
          providerId = data.provider;
        }

        /*
         * If provider is only an ID,
         * load the actual Partner.
         */

        if (providerId) {
          try {
            setLoadingProvider(true);

            const providerData =
              await getPartner(providerId);

            setProvider(providerData);
          } catch (providerError) {
            console.error(
              "Failed to load provider:",
              providerError
            );

            setProvider(null);
          } finally {
            setLoadingProvider(false);
          }
        }
      } catch (err) {
        console.error(
          "Failed to load health plan:",
          err
        );

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


  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-bv-gray">
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
          onClick={() =>
            navigate("/health-plans")
          }
          className="flex items-center gap-2 text-bv-blue hover:text-bv-blueDark mb-6"
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
          onClick={() =>
            navigate("/health-plans")
          }
          className="flex items-center gap-2 text-bv-blue hover:text-bv-blueDark mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Health Plans
        </button>

        <div className="bg-white border border-bv-card rounded-xl p-6 text-bv-gray">
          Health plan not found.
        </div>
      </div>
    );
  }


  const memberName =
    plan.member_name ||
    getMemberName(plan.member);

  const memberId =
    plan.member_id ||
    getMemberId(plan.member);


  const providerName =
    provider?.name ||
    provider?.partner_name ||
    provider?.partner_id ||
    getProviderName(plan.provider);

  const providerId =
    provider?.partner_id ||
    provider?.id ||
    getProviderId(plan.provider);


  return (
    <div className="p-6 space-y-6">

      {/* Header */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>

          <button
            onClick={() =>
              navigate("/health-plans")
            }
            className="flex items-center gap-2 text-bv-gray hover:text-bv-blue mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Health Plans
          </button>


          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-bv-mint flex items-center justify-center">
              <HeartPulse className="w-6 h-6 text-bv-blue" />
            </div>

            <div>

              <h1 className="text-2xl font-semibold text-bv-dark">
                Health Plan Details
              </h1>

              <p className="text-sm text-bv-gray mt-1">
                {plan.plan_id ||
                  `Plan #${plan.id}`}
              </p>

            </div>

          </div>

        </div>


        {canEditPlan && (
          <button
            onClick={() =>
              navigate(
                `/health-plans/${plan.id}/edit`
              )
            }
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-bv-blue text-white hover:bg-bv-blueDark transition"
          >
            <Pencil className="w-4 h-4" />
            Edit Plan
          </button>
        )}

      </div>


      {/* Main Summary */}

      <div className="bg-white border border-bv-card rounded-2xl shadow-bv overflow-hidden">

        <div className="p-6 border-b border-bv-card">

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

            <div>

              <p className="text-sm text-bv-gray mb-1">
                Plan Name
              </p>

              <h2 className="text-xl font-semibold text-bv-dark">
                {plan.plan_name || "-"}
              </h2>

              {plan.plan_type && (
                <p className="text-sm text-bv-gray mt-1">
                  {plan.plan_type}
                </p>
              )}

            </div>


            <span
              className={`inline-flex items-center gap-2 w-fit px-3 py-1.5 rounded-full text-sm font-medium ${getStatusStyle(
                plan.status
              )}`}
            >
              <span className="w-2 h-2 rounded-full bg-current" />

              {plan.status || "UNKNOWN"}
            </span>

          </div>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-bv-card">

          <div className="p-6">

            <div className="flex items-center gap-3 mb-3">

              <div className="w-9 h-9 rounded-lg bg-bv-blueLight flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-bv-blue" />
              </div>

              <span className="text-sm text-bv-gray">
                Coverage Amount
              </span>

            </div>

            <p className="text-lg font-semibold text-bv-dark">
              {formatAmount(
                plan.coverage_amount
              )}
            </p>

          </div>


          <div className="p-6">

            <div className="flex items-center gap-3 mb-3">

              <div className="w-9 h-9 rounded-lg bg-bv-blueLight flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-bv-blue" />
              </div>

              <span className="text-sm text-bv-gray">
                Premium
              </span>

            </div>

            <p className="text-lg font-semibold text-bv-dark">
              {formatAmount(plan.premium)}
            </p>

          </div>


          <div className="p-6">

            <div className="flex items-center gap-3 mb-3">

              <div className="w-9 h-9 rounded-lg bg-bv-mint flex items-center justify-center">
                <Calendar className="w-5 h-5 text-bv-blue" />
              </div>

              <span className="text-sm text-bv-gray">
                Start Date
              </span>

            </div>

            <p className="text-lg font-semibold text-bv-dark">
              {formatDate(
                plan.start_date
              )}
            </p>

          </div>


          <div className="p-6">

            <div className="flex items-center gap-3 mb-3">

              <div className="w-9 h-9 rounded-lg bg-bv-mint flex items-center justify-center">
                <Calendar className="w-5 h-5 text-bv-blue" />
              </div>

              <span className="text-sm text-bv-gray">
                Expiry Date
              </span>

            </div>

            <p className="text-lg font-semibold text-bv-dark">
              {formatDate(
                plan.expiry_date
              )}
            </p>

          </div>

        </div>

      </div>


      {/* Member + Provider */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Member */}

        <div className="bg-white border border-bv-card rounded-2xl shadow-bv p-6">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-10 h-10 rounded-xl bg-bv-mint flex items-center justify-center">
              <User className="w-5 h-5 text-bv-blue" />
            </div>

            <div>

              <h3 className="font-semibold text-bv-dark">
                Member Information
              </h3>

              <p className="text-sm text-bv-gray">
                Plan owner
              </p>

            </div>

          </div>


          <div className="space-y-4">

            <div>

              <p className="text-xs text-bv-gray mb-1">
                Member Name
              </p>

              <p className="font-medium text-bv-dark">
                {memberName}
              </p>

            </div>


            {memberId && (
              <div>

                <p className="text-xs text-bv-gray mb-1">
                  Member ID
                </p>

                <p className="font-medium text-bv-dark">
                  {memberId}
                </p>

              </div>
            )}

          </div>

        </div>


        {/* Provider */}

        <div className="bg-white border border-bv-card rounded-2xl shadow-bv p-6">

          <div className="flex items-center gap-3 mb-5">

            <div className="w-10 h-10 rounded-xl bg-bv-blueLight flex items-center justify-center">
              <Building2 className="w-5 h-5 text-bv-blue" />
            </div>

            <div>

              <h3 className="font-semibold text-bv-dark">
                Provider Information
              </h3>

              <p className="text-sm text-bv-gray">
                Insurance / health plan provider
              </p>

            </div>

          </div>


          <div className="space-y-4">

            <div>

              <p className="text-xs text-bv-gray mb-1">
                Provider Name
              </p>

              <p className="font-medium text-bv-dark">
                {loadingProvider
                  ? "Loading provider..."
                  : providerName}
              </p>

            </div>


            {providerId && (
              <div>

                <p className="text-xs text-bv-gray mb-1">
                  Provider ID
                </p>

                <p className="font-medium text-bv-dark">
                  {providerId}
                </p>

              </div>
            )}

          </div>

        </div>

      </div>


      {/* Coverage Details */}

      <div className="bg-white border border-bv-card rounded-2xl shadow-bv p-6">

        <div className="flex items-center gap-3 mb-5">

          <div className="w-10 h-10 rounded-xl bg-bv-blueLight flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-bv-blue" />
          </div>

          <div>

            <h3 className="font-semibold text-bv-dark">
              Coverage Details
            </h3>

            <p className="text-sm text-bv-gray">
              Information about plan coverage
            </p>

          </div>

        </div>


        <div className="bg-bv-bg rounded-xl p-5 min-h-[100px]">

          <p className="text-sm text-bv-dark whitespace-pre-wrap leading-6">
            {plan.coverage_details ||
              "No coverage details provided."}
          </p>

        </div>

      </div>


      {/* Notes */}

      <div className="bg-white border border-bv-card rounded-2xl shadow-bv p-6">

        <div className="flex items-center gap-3 mb-5">

          <div className="w-10 h-10 rounded-xl bg-bv-mint flex items-center justify-center">
            <FileText className="w-5 h-5 text-bv-blue" />
          </div>

          <div>

            <h3 className="font-semibold text-bv-dark">
              Notes
            </h3>

            <p className="text-sm text-bv-gray">
              Additional information
            </p>

          </div>

        </div>


        <div className="bg-bv-bg rounded-xl p-5 min-h-[80px]">

          <p className="text-sm text-bv-dark whitespace-pre-wrap leading-6">
            {plan.notes ||
              "No notes available."}
          </p>

        </div>

      </div>


      {/* Metadata */}

      <div className="bg-white border border-bv-card rounded-2xl shadow-bv p-6">

        <h3 className="font-semibold text-bv-dark mb-4">
          Record Information
        </h3>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>

            <p className="text-xs text-bv-gray mb-1">
              Created At
            </p>

            <p className="text-sm text-bv-dark">
              {plan.created_at
                ? new Date(
                    plan.created_at
                  ).toLocaleString()
                : "-"}
            </p>

          </div>


          <div>

            <p className="text-xs text-bv-gray mb-1">
              Last Updated
            </p>

            <p className="text-sm text-bv-dark">
              {plan.updated_at
                ? new Date(
                    plan.updated_at
                  ).toLocaleString()
                : "-"}
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}




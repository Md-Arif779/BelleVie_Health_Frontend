import { useEffect, useState } from "react";
import {
  Users,
  Stethoscope,
  Building2,
  FlaskConical,
  Pill,
  CalendarCheck,
  Ambulance,
  Plane,
  ShieldCheck,
  FileText,
  CreditCard,
  Headphones,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { getReportOverview } from "../../services/reportService";
import { canView } from "../../utils/permission";

const ReportOverview = () => {
  const { permissions } = useAuth();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReport = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getReportOverview();

      setReport(data);
    } catch (err) {
      console.error("Report Overview Error:", err);

      setError(
        err?.response?.data?.detail ||
          "Failed to load report overview."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  /* =========================================================
     HELPERS
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

  const StatCard = ({
    title,
    value,
    icon: Icon,
    description,
  }) => (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 hover:shadow-sm transition">

      <div className="flex items-start justify-between gap-4">

        <div>

          <p className="text-sm text-[#7A7A7A]">
            {title}
          </p>

          <h3 className="text-2xl font-bold text-[#212121] mt-2">
            {value ?? 0}
          </h3>

          {description && (
            <p className="text-xs text-[#7A7A7A] mt-1">
              {description}
            </p>
          )}

        </div>

        <div className="w-11 h-11 rounded-xl bg-[#EEF4FF] flex items-center justify-center shrink-0">

          <Icon
            size={22}
            className="text-[#2F6FED]"
          />

        </div>

      </div>

    </div>
  );

  const SectionTitle = ({
    title,
    description,
  }) => (
    <div className="mb-4">

      <h2 className="text-lg font-semibold text-[#212121]">
        {title}
      </h2>

      {description && (
        <p className="text-sm text-[#7A7A7A] mt-1">
          {description}
        </p>
      )}

    </div>
  );

  /* =========================================================
     PERMISSION
  ========================================================= */

  if (!canView(permissions, "reports")) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">

        <div className="max-w-3xl mx-auto bg-white rounded-xl border border-[#E5E7EB] p-8 text-center">

          <AlertCircle
            size={42}
            className="mx-auto text-red-500 mb-3"
          />

          <h2 className="text-xl font-bold text-[#212121]">
            Permission Denied
          </h2>

          <p className="text-sm text-[#7A7A7A] mt-2">
            You do not have permission to view reports.
          </p>

        </div>

      </div>
    );
  }

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">

        <div className="flex justify-center items-center py-20">

          <RefreshCw
            size={30}
            className="animate-spin text-[#2F6FED]"
          />

        </div>

      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">

        <div className="max-w-3xl mx-auto bg-white rounded-xl border border-[#E5E7EB] p-8 text-center">

          <AlertCircle
            size={42}
            className="mx-auto text-red-500 mb-3"
          />

          <h2 className="text-xl font-bold text-[#212121]">
            Unable to Load Reports
          </h2>

          <p className="text-sm text-red-600 mt-2">
            {error}
          </p>

          <button
            type="button"
            onClick={loadReport}
            className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 rounded-lg bg-[#2F6FED] text-white hover:bg-[#2459C7]"
          >
            <RefreshCw size={17} />
            Try Again
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="max-w-7xl mx-auto mb-7">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <h1 className="text-2xl font-bold text-[#212121]">
              Reports Overview
            </h1>

            <p className="text-sm text-[#7A7A7A] mt-1">
              Centralized summary of BelleVie Health operations
            </p>

          </div>

          <button
            type="button"
            onClick={loadReport}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-[#E5E7EB] text-[#212121] hover:bg-[#F9FAFB]"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

        </div>

      </div>

      <div className="max-w-7xl mx-auto space-y-7">

        {/* ===================================================
            TOP SUMMARY
        ==================================================== */}

        <section>

          <SectionTitle
            title="Overall Summary"
            description="Key statistics across the healthcare management system"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <StatCard
              title="Total Members"
              value={report?.members?.total}
              icon={Users}
              description={`${report?.members?.active || 0} active members`}
            />

            <StatCard
              title="Total Doctors"
              value={report?.providers?.doctors?.total}
              icon={Stethoscope}
              description={`${report?.providers?.doctors?.active || 0} active doctors`}
            />

            <StatCard
              title="Appointments"
              value={report?.appointments?.total}
              icon={CalendarCheck}
              description={`${report?.appointments?.completed || 0} completed`}
            />

            <StatCard
              title="Total Payments"
              value={report?.billing?.total_payments}
              icon={CreditCard}
              description={formatAmount(
                report?.billing?.total_payment_amount
              )}
            />

          </div>

        </section>

        {/* ===================================================
            MEMBERS
        ==================================================== */}

        <section>

          <SectionTitle
            title="Member Statistics"
            description="Current member status distribution"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <StatCard
              title="Total Members"
              value={report?.members?.total}
              icon={Users}
            />

            <StatCard
              title="Active Members"
              value={report?.members?.active}
              icon={Users}
            />

            <StatCard
              title="Inactive Members"
              value={report?.members?.inactive}
              icon={Users}
            />

            <StatCard
              title="Suspended Members"
              value={report?.members?.suspended}
              icon={Users}
            />

          </div>

        </section>

        {/* ===================================================
            PROVIDERS
        ==================================================== */}

        <section>

          <SectionTitle
            title="Healthcare Providers"
            description="Doctors, hospitals, diagnostic centers and pharmacies"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <StatCard
              title="Doctors"
              value={report?.providers?.doctors?.total}
              icon={Stethoscope}
              description={`${report?.providers?.doctors?.active || 0} active`}
            />

            <StatCard
              title="Hospitals"
              value={report?.providers?.hospitals?.total}
              icon={Building2}
              description={`${report?.providers?.hospitals?.active || 0} active`}
            />

            <StatCard
              title="Diagnostic Centers"
              value={
                report?.providers?.diagnostic_centers?.total
              }
              icon={FlaskConical}
              description={`${report?.providers?.diagnostic_centers?.active || 0} active`}
            />

            <StatCard
              title="Pharmacies"
              value={report?.providers?.pharmacies?.total}
              icon={Pill}
              description={`${report?.providers?.pharmacies?.active || 0} active`}
            />

          </div>

        </section>

        {/* ===================================================
            APPOINTMENTS
        ==================================================== */}

        <section>

          <SectionTitle
            title="Appointment Statistics"
            description="Current appointment status"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <StatCard
              title="Total"
              value={report?.appointments?.total}
              icon={CalendarCheck}
            />

            <StatCard
              title="Pending"
              value={report?.appointments?.pending}
              icon={CalendarCheck}
            />

            <StatCard
              title="Confirmed"
              value={report?.appointments?.confirmed}
              icon={CalendarCheck}
            />

            <StatCard
              title="Completed"
              value={report?.appointments?.completed}
              icon={CalendarCheck}
            />

          </div>

        </section>

        {/* ===================================================
            SERVICES
        ==================================================== */}

        <section>

          <SectionTitle
            title="Healthcare Services"
            description="Activity across major service modules"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">

            <StatCard
              title="Hospital Bookings"
              value={
                report?.services?.hospital_bookings
              }
              icon={Building2}
            />

            <StatCard
              title="Lab Tests"
              value={
                report?.services?.lab_tests
              }
              icon={FlaskConical}
            />

            <StatCard
              title="Medicine Orders"
              value={
                report?.services?.medicine_orders
              }
              icon={Pill}
            />

            <StatCard
              title="Ambulance Requests"
              value={
                report?.services?.ambulance_requests
              }
              icon={Ambulance}
            />

            <StatCard
              title="Medical Tourism"
              value={
                report?.services?.medical_tourism_requests
              }
              icon={Plane}
            />

          </div>

        </section>

        {/* ===================================================
            INSURANCE
        ==================================================== */}

        <section>

          <SectionTitle
            title="Insurance"
            description="Policy and claim overview"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            <StatCard
              title="Total Policies"
              value={
                report?.insurance?.total_policies
              }
              icon={ShieldCheck}
              description={`${report?.insurance?.active_policies || 0} active`}
            />

            <StatCard
              title="Total Claims"
              value={
                report?.insurance?.total_claims
              }
              icon={FileText}
            />

            <StatCard
              title="Pending Claims"
              value={
                report?.insurance?.pending_claims
              }
              icon={FileText}
            />

            <StatCard
              title="Paid Claims"
              value={
                report?.insurance?.paid_claims
              }
              icon={FileText}
            />

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">

              <p className="text-sm text-[#7A7A7A]">
                Total Claim Amount
              </p>

              <p className="text-2xl font-bold text-[#212121] mt-2">
                {formatAmount(
                  report?.insurance?.total_claim_amount
                )}
              </p>

            </div>

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">

              <p className="text-sm text-[#7A7A7A]">
                Total Approved Amount
              </p>

              <p className="text-2xl font-bold text-[#16A34A] mt-2">
                {formatAmount(
                  report?.insurance?.total_approved_amount
                )}
              </p>

            </div>

          </div>

        </section>

        {/* ===================================================
            BILLING
        ==================================================== */}

        <section>

          <SectionTitle
            title="Billing"
            description="Invoice and payment summary"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

            <StatCard
              title="Total Invoices"
              value={
                report?.billing?.total_invoices
              }
              icon={FileText}
            />

            <StatCard
              title="Total Payments"
              value={
                report?.billing?.total_payments
              }
              icon={CreditCard}
            />

            <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <p className="text-sm text-[#7A7A7A]">
                    Total Payment Amount
                  </p>

                  <h3 className="text-2xl font-bold text-[#16A34A] mt-2">
                    {formatAmount(
                      report?.billing?.total_payment_amount
                    )}
                  </h3>

                </div>

                <div className="w-11 h-11 rounded-xl bg-[#D9F7E8] flex items-center justify-center">

                  <CreditCard
                    size={22}
                    className="text-[#16A34A]"
                  />

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* ===================================================
            CRM
        ==================================================== */}

        <section>

          <SectionTitle
            title="CRM"
            description="Customer relationship and interaction status"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            <StatCard
              title="Open"
              value={report?.crm?.open}
              icon={Headphones}
            />

            <StatCard
              title="In Progress"
              value={report?.crm?.in_progress}
              icon={Headphones}
            />

            <StatCard
              title="Completed"
              value={report?.crm?.completed}
              icon={Headphones}
            />

          </div>

        </section>

      </div>

    </div>
  );
};

export default ReportOverview;
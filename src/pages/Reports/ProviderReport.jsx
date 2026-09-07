import { useEffect, useState } from "react";
import {
  Stethoscope,
  Building2,
  FlaskConical,
  Pill,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { canView } from "../../utils/permission";
import { getProviderReport } from "../../services/reportService";

const ProviderReport = () => {
  const { permissions } = useAuth();

  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadReport = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getProviderReport();

      setReport(data);
    } catch (err) {
      console.error("Provider Report Error:", err);

      setError(
        err?.response?.data?.detail ||
          "Failed to load provider report."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  const ProviderCard = ({
    title,
    icon: Icon,
    data,
  }) => {
    const total = data?.total || 0;
    const active = data?.active || 0;
    const inactive = data?.inactive || 0;

    return (
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-5">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <p className="text-sm text-[#7A7A7A]">
              {title}
            </p>

            <h3 className="text-3xl font-bold text-[#212121] mt-2">
              {total}
            </h3>

            <p className="text-xs text-[#7A7A7A] mt-1">
              Total registered
            </p>
          </div>

          <div className="w-11 h-11 rounded-xl bg-[#EEF4FF] flex items-center justify-center">
            <Icon
              size={22}
              className="text-[#2F6FED]"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">

          <div className="rounded-lg bg-[#D9F7E8] p-3">
            <div className="flex items-center gap-2">
              <CheckCircle2
                size={16}
                className="text-[#15803D]"
              />

              <span className="text-xs text-[#15803D]">
                Active
              </span>
            </div>

            <p className="text-xl font-bold text-[#15803D] mt-1">
              {active}
            </p>
          </div>

          <div className="rounded-lg bg-gray-100 p-3">
            <div className="flex items-center gap-2">
              <XCircle
                size={16}
                className="text-[#7A7A7A]"
              />

              <span className="text-xs text-[#7A7A7A]">
                Inactive
              </span>
            </div>

            <p className="text-xl font-bold text-[#212121] mt-1">
              {inactive}
            </p>
          </div>

        </div>
      </div>
    );
  };

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

  if (error) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-xl border border-[#E5E7EB] p-8 text-center">

          <AlertCircle
            size={42}
            className="mx-auto text-red-500 mb-3"
          />

          <h2 className="text-xl font-bold text-[#212121]">
            Unable to Load Provider Report
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

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-7">

          <div>
            <h1 className="text-2xl font-bold text-[#212121]">
              Provider Report
            </h1>

            <p className="text-sm text-[#7A7A7A] mt-1">
              Overview of healthcare providers registered in BelleVie Health
            </p>
          </div>

          <button
            type="button"
            onClick={loadReport}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-[#E5E7EB] text-[#212121] hover:bg-gray-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

        </div>

        {/* PROVIDER CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <ProviderCard
            title="Doctors"
            icon={Stethoscope}
            data={report?.doctors}
          />

          <ProviderCard
            title="Hospitals"
            icon={Building2}
            data={report?.hospitals}
          />

          <ProviderCard
            title="Diagnostic Centers"
            icon={FlaskConical}
            data={report?.diagnostic_centers}
          />

          <ProviderCard
            title="Pharmacies"
            icon={Pill}
            data={report?.pharmacies}
          />

        </div>

        {/* SUMMARY TABLE */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden mt-7">

          <div className="px-5 py-4 border-b border-[#E5E7EB]">
            <h2 className="font-semibold text-[#212121]">
              Provider Summary
            </h2>

            <p className="text-sm text-[#7A7A7A] mt-1">
              Active and inactive provider distribution
            </p>
          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[650px]">

              <thead>
                <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">

                  <th className="px-5 py-3 text-left text-xs font-semibold text-[#7A7A7A] uppercase">
                    Provider Type
                  </th>

                  <th className="px-5 py-3 text-center text-xs font-semibold text-[#7A7A7A] uppercase">
                    Total
                  </th>

                  <th className="px-5 py-3 text-center text-xs font-semibold text-[#7A7A7A] uppercase">
                    Active
                  </th>

                  <th className="px-5 py-3 text-center text-xs font-semibold text-[#7A7A7A] uppercase">
                    Inactive
                  </th>

                </tr>
              </thead>

              <tbody>

                {[
                  {
                    name: "Doctors",
                    data: report?.doctors,
                  },
                  {
                    name: "Hospitals",
                    data: report?.hospitals,
                  },
                  {
                    name: "Diagnostic Centers",
                    data: report?.diagnostic_centers,
                  },
                  {
                    name: "Pharmacies",
                    data: report?.pharmacies,
                  },
                ].map((provider) => (
                  <tr
                    key={provider.name}
                    className="border-b border-[#E5E7EB] last:border-b-0"
                  >

                    <td className="px-5 py-4 text-sm font-medium text-[#212121]">
                      {provider.name}
                    </td>

                    <td className="px-5 py-4 text-sm text-center font-semibold text-[#212121]">
                      {provider.data?.total || 0}
                    </td>

                    <td className="px-5 py-4 text-sm text-center font-semibold text-[#15803D]">
                      {provider.data?.active || 0}
                    </td>

                    <td className="px-5 py-4 text-sm text-center font-semibold text-[#7A7A7A]">
                      {provider.data?.inactive || 0}
                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ProviderReport;
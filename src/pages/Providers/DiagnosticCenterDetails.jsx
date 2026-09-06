import { useEffect, useState } from "react";
import {
  Activity,
  ArrowLeft,
  Calendar,
  Edit,
  Globe,
  Mail,
  MapPin,
  Package,
  Phone,
  TestTube,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { getDiagnosticCenter } from "../../services/diagnosticService";

import { useAuth } from "../../context/AuthContext";
import { canEdit } from "../../utils/permission";

const DiagnosticCenterDetails = () => {
  const { id } = useParams();
  const { permissions } = useAuth();

  const [center, setCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCenter = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getDiagnosticCenter(id);

        setCenter(data);
      } catch (err) {
        console.error(
          "Diagnostic Center Details Error:",
          err
        );

        setError(
          err?.response?.data?.detail ||
            "Failed to load diagnostic center."
        );
      } finally {
        setLoading(false);
      }
    };

    loadCenter();
  }, [id]);

  const formatDate = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">
        <div className="flex min-h-[400px] items-center justify-center rounded-xl border border-[#E5E7EB] bg-white">
          <p className="text-sm text-[#7A7A7A]">
            Loading diagnostic center...
          </p>
        </div>
      </div>
    );
  }

  if (error || !center) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">
        <Link
          to="/diagnostics"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#2F6FED] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Diagnostic Centers
        </Link>

        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-[#DC2626]">
          {error || "Diagnostic center not found."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/diagnostics"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#7A7A7A] transition hover:text-[#2F6FED]"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF4FF]">
                <Activity className="h-6 w-6 text-[#2F6FED]" />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-[#212121]">
                  {center.name || "Diagnostic Center"}
                </h1>

                <p className="mt-1 text-sm text-[#7A7A7A]">
                  {center.diagnostic_id || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {canEdit(
          permissions,
          "diagnostic_centers"
        ) && (
          <Link
            to={`/diagnostics/${center.id}/edit`}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#2F6FED] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2459C7]"
          >
            <Edit className="h-4 w-4" />
            Edit Diagnostic Center
          </Link>
        )}
      </div>

      {/* Main */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Contact Information */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm lg:col-span-1">
          <h2 className="text-lg font-semibold text-[#212121]">
            Contact Information
          </h2>

          <div className="mt-5 space-y-5">
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#2F6FED]" />

              <div>
                <p className="text-xs text-[#7A7A7A]">
                  Location
                </p>

                <p className="mt-1 text-sm font-medium text-[#212121]">
                  {center.location || "-"}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#2F6FED]" />

              <div>
                <p className="text-xs text-[#7A7A7A]">
                  Address
                </p>

                <p className="mt-1 whitespace-pre-line text-sm font-medium text-[#212121]">
                  {center.address || "-"}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Phone className="mt-0.5 h-5 w-5 shrink-0 text-[#2F6FED]" />

              <div>
                <p className="text-xs text-[#7A7A7A]">
                  Phone
                </p>

                <p className="mt-1 text-sm font-medium text-[#212121]">
                  {center.phone || "-"}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#2F6FED]" />

              <div>
                <p className="text-xs text-[#7A7A7A]">
                  Email
                </p>

                <p className="mt-1 break-all text-sm font-medium text-[#212121]">
                  {center.email || "-"}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Globe className="mt-0.5 h-5 w-5 shrink-0 text-[#2F6FED]" />

              <div>
                <p className="text-xs text-[#7A7A7A]">
                  Website
                </p>

                {center.website ? (
                  <a
                    href={center.website}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block break-all text-sm font-medium text-[#2F6FED] hover:underline"
                  >
                    {center.website}
                  </a>
                ) : (
                  <p className="mt-1 text-sm font-medium text-[#212121]">
                    -
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-[#E5E7EB] pt-5">
              <p className="text-xs text-[#7A7A7A]">
                Status
              </p>

              <span
                className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  center.status === "ACTIVE"
                    ? "bg-green-100 text-[#16A34A]"
                    : "bg-red-100 text-[#DC2626]"
                }`}
              >
                {center.status || "UNKNOWN"}
              </span>
            </div>
          </div>
        </div>

        {/* Services */}
        <div className="space-y-6 lg:col-span-2">
          {/* Tests */}
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF4FF]">
                <TestTube className="h-5 w-5 text-[#2F6FED]" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-[#212121]">
                  Available Tests
                </h2>

                <p className="text-xs text-[#7A7A7A]">
                  Tests offered by this diagnostic center
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-lg bg-[#F9FAFB] p-4">
              <p className="whitespace-pre-line text-sm leading-6 text-[#212121]">
                {center.tests || "No test information available."}
              </p>
            </div>
          </div>

          {/* Prices */}
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#212121]">
              Test Prices
            </h2>

            <div className="mt-5 rounded-lg bg-[#F9FAFB] p-4">
              <p className="whitespace-pre-line text-sm leading-6 text-[#212121]">
                {center.prices || "No price information available."}
              </p>
            </div>
          </div>

          {/* Packages */}
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#D9F7E8]">
                <Package className="h-5 w-5 text-[#16A34A]" />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-[#212121]">
                  Packages
                </h2>

                <p className="text-xs text-[#7A7A7A]">
                  Available diagnostic packages
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-lg bg-[#F9FAFB] p-4">
              <p className="whitespace-pre-line text-sm leading-6 text-[#212121]">
                {center.packages ||
                  "No package information available."}
              </p>
            </div>
          </div>

          {/* Record Information */}
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[#212121]">
              Record Information
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-[#2F6FED]" />

                <div>
                  <p className="text-xs text-[#7A7A7A]">
                    Created At
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#212121]">
                    {formatDate(center.created_at)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-[#2F6FED]" />

                <div>
                  <p className="text-xs text-[#7A7A7A]">
                    Last Updated
                  </p>

                  <p className="mt-1 text-sm font-medium text-[#212121]">
                    {formatDate(center.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticCenterDetails;
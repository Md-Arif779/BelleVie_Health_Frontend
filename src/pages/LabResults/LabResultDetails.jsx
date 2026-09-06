import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  FlaskConical,
  Loader2,
  CalendarDays,
  User,
  Building2,
  FileText,
  ClipboardCheck,
} from "lucide-react";

import { getLabResult } from "../../services/labResultService";

import { useAuth } from "../../context/AuthContext";
import { canEdit } from "../../utils/permission";

const statusLabels = {
  PENDING: "Pending",
  COMPLETED: "Completed",
  REVIEWED: "Reviewed",
};

const getStatusClass = (status) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-700";
    case "REVIEWED":
      return "bg-blue-100 text-blue-700";
    case "PENDING":
    default:
      return "bg-yellow-100 text-yellow-700";
  }
};

const getMemberName = (data) => {
  return (
    data?.member_name ||
    data?.member?.full_name ||
    data?.member?.name ||
    "-"
  );
};

const getMemberId = (data) => {
  return (
    data?.member_id ||
    data?.member?.member_id ||
    "-"
  );
};

const getDiagnosticCenterName = (data) => {
  return (
    data?.diagnostic_center_name ||
    data?.diagnostic_center?.name ||
    data?.diagnostic_center?.center_name ||
    "-"
  );
};

const getBookingId = (data) => {
  return (
    data?.booking_id ||
    data?.booking?.booking_id ||
    (data?.booking?.id
      ? `#${data.booking.id}`
      : "-")
  );
};

const formatDate = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString();
};

const formatDateTime = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleString();
};

function LabResultDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { permissions } = useAuth();

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadResult = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getLabResult(id);

        setResult(data);
      } catch (err) {
        console.error(
          "Lab Result Details Error:",
          err
        );

        setError(
          err?.response?.data?.detail ||
            err?.response?.data?.message ||
            "Failed to load lab result."
        );
      } finally {
        setLoading(false);
      }
    };

    loadResult();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F2F2F2]">
        <div className="flex items-center gap-2 text-sm text-[#7A7A7A]">
          <Loader2
            size={20}
            className="animate-spin"
          />
          Loading lab result...
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">
        <div className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <FlaskConical
            size={40}
            className="mx-auto text-red-400"
          />

          <h2 className="mt-4 text-xl font-bold text-[#212121]">
            Unable to Load Lab Result
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error || "Lab result not found."}
          </p>

          <Link
            to="/lab-results"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#2F6FED] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2459C7]"
          >
            <ArrowLeft size={17} />
            Back to Lab Results
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() =>
              navigate("/lab-results")
            }
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#212121] hover:bg-[#F9FAFB]"
          >
            <ArrowLeft size={19} />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D9F7E8]">
              <FlaskConical
                size={23}
                className="text-[#2F6FED]"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#212121]">
                Lab Result Details
              </h1>

              <p className="text-sm text-[#7A7A7A]">
                {result.result_id ||
                  `Result #${result.id}`}
              </p>
            </div>
          </div>
        </div>

        {canEdit(
          permissions,
          "lab_results"
        ) && (
          <Link
            to={`/lab-results/${result.id}/edit`}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2F6FED] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2459C7]"
          >
            <Pencil size={17} />
            Edit Result
          </Link>
        )}
      </div>

      {/* Status Card */}
      <div className="mb-6 rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-[#7A7A7A]">
              Result ID
            </p>

            <p className="mt-1 text-xl font-bold text-[#2F6FED]">
              {result.result_id ||
                `#${result.id}`}
            </p>
          </div>

          <div>
            <span
              className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${getStatusClass(
                result.status
              )}`}
            >
              {statusLabels[
                result.status
              ] ||
                result.status ||
                "-"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Information */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Member Information */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-[#E5E7EB] px-6 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF4FF]">
              <User
                size={20}
                className="text-[#2F6FED]"
              />
            </div>

            <div>
              <h2 className="font-semibold text-[#212121]">
                Member Information
              </h2>

              <p className="text-xs text-[#7A7A7A]">
                Patient details
              </p>
            </div>
          </div>

          <div className="space-y-4 p-6">
            <div>
              <p className="text-xs text-[#7A7A7A]">
                Member Name
              </p>

              <p className="mt-1 font-medium text-[#212121]">
                {getMemberName(result)}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#7A7A7A]">
                Member ID
              </p>

              <p className="mt-1 font-medium text-[#2F6FED]">
                {getMemberId(result)}
              </p>
            </div>
          </div>
        </div>

        {/* Test Information */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-[#E5E7EB] px-6 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#D9F7E8]">
              <FlaskConical
                size={20}
                className="text-[#2F6FED]"
              />
            </div>

            <div>
              <h2 className="font-semibold text-[#212121]">
                Test Information
              </h2>

              <p className="text-xs text-[#7A7A7A]">
                Diagnostic test details
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
            <div>
              <p className="text-xs text-[#7A7A7A]">
                Test Name
              </p>

              <p className="mt-1 font-medium text-[#212121]">
                {result.test_name || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#7A7A7A]">
                Booking ID
              </p>

              <p className="mt-1 font-medium text-[#2F6FED]">
                {getBookingId(result)}
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-xs text-[#7A7A7A]">
                Diagnostic Center
              </p>

              <p className="mt-1 font-medium text-[#212121]">
                {getDiagnosticCenterName(
                  result
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Result Information */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-[#E5E7EB] px-6 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <ClipboardCheck
                size={20}
                className="text-[#2F6FED]"
              />
            </div>

            <div>
              <h2 className="font-semibold text-[#212121]">
                Result Information
              </h2>

              <p className="text-xs text-[#7A7A7A]">
                Laboratory findings
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
            <div>
              <p className="text-xs text-[#7A7A7A]">
                Result Value
              </p>

              <p className="mt-1 text-lg font-semibold text-[#212121]">
                {result.result_value || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#7A7A7A]">
                Unit
              </p>

              <p className="mt-1 font-medium text-[#212121]">
                {result.unit || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#7A7A7A]">
                Reference Range
              </p>

              <p className="mt-1 font-medium text-[#212121]">
                {result.reference_range ||
                  "-"}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#7A7A7A]">
                Result Date
              </p>

              <div className="mt-1 flex items-center gap-2">
                <CalendarDays
                  size={16}
                  className="text-[#7A7A7A]"
                />

                <p className="font-medium text-[#212121]">
                  {formatDate(
                    result.result_date
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interpretation */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-[#E5E7EB] px-6 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF4FF]">
              <FileText
                size={20}
                className="text-[#2F6FED]"
              />
            </div>

            <div>
              <h2 className="font-semibold text-[#212121]">
                Interpretation
              </h2>

              <p className="text-xs text-[#7A7A7A]">
                Medical interpretation
              </p>
            </div>
          </div>

          <div className="p-6">
            <p className="whitespace-pre-wrap text-sm leading-6 text-[#212121]">
              {result.interpretation ||
                "No interpretation available."}
            </p>
          </div>
        </div>

        {/* Notes */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm xl:col-span-2">
          <div className="flex items-center gap-3 border-b border-[#E5E7EB] px-6 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              <FileText
                size={20}
                className="text-[#7A7A7A]"
              />
            </div>

            <div>
              <h2 className="font-semibold text-[#212121]">
                Notes
              </h2>

              <p className="text-xs text-[#7A7A7A]">
                Additional information
              </p>
            </div>
          </div>

          <div className="p-6">
            <p className="whitespace-pre-wrap text-sm leading-6 text-[#212121]">
              {result.notes ||
                "No additional notes."}
            </p>
          </div>
        </div>

        {/* Timestamps */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm xl:col-span-2">
          <div className="flex items-center gap-3 border-b border-[#E5E7EB] px-6 py-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
              <CalendarDays
                size={20}
                className="text-[#7A7A7A]"
              />
            </div>

            <div>
              <h2 className="font-semibold text-[#212121]">
                Record Information
              </h2>

              <p className="text-xs text-[#7A7A7A]">
                System timestamps
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 p-6 sm:grid-cols-2">
            <div>
              <p className="text-xs text-[#7A7A7A]">
                Created At
              </p>

              <p className="mt-1 text-sm font-medium text-[#212121]">
                {formatDateTime(
                  result.created_at
                )}
              </p>
            </div>

            <div>
              <p className="text-xs text-[#7A7A7A]">
                Updated At
              </p>

              <p className="mt-1 text-sm font-medium text-[#212121]">
                {formatDateTime(
                  result.updated_at
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LabResultDetails;
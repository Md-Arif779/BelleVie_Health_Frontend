import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  UserRound,
  Stethoscope,
  Pill,
  CalendarDays,
  FileText,
  ClipboardList,
  Clock,
} from "lucide-react";

import { getPrescription } from "../../services/prescriptionService";

import { useAuth } from "../../context/AuthContext";
import { canEdit } from "../../utils/permission";

const PrescriptionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { permissions } = useAuth();

  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPrescription = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getPrescription(id);

        setPrescription(data);
      } catch (err) {
        console.error(
          "Prescription Details Error:",
          err
        );

        setError(
          err.response?.data?.detail ||
            "Failed to load prescription details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPrescription();
  }, [id]);

  const getMemberName = () => {
    if (!prescription?.member) {
      return "-";
    }

    if (typeof prescription.member === "object") {
      return (
        prescription.member.full_name ||
        prescription.member.name ||
        "-"
      );
    }

    return prescription.member_name || "-";
  };

  const getMemberId = () => {
    if (!prescription?.member) {
      return "-";
    }

    if (typeof prescription.member === "object") {
      return (
        prescription.member.member_id ||
        prescription.member.id ||
        "-"
      );
    }

    return (
      prescription.member_id ||
      prescription.member ||
      "-"
    );
  };

  const getDoctorName = () => {
    if (!prescription?.doctor) {
      return "-";
    }

    if (typeof prescription.doctor === "object") {
      return (
        prescription.doctor.full_name ||
        prescription.doctor.name ||
        "-"
      );
    }

    return (
      prescription.doctor_name ||
      "-"
    );
  };

  const getDoctorId = () => {
    if (!prescription?.doctor) {
      return "-";
    }

    if (typeof prescription.doctor === "object") {
      return (
        prescription.doctor.doctor_id ||
        prescription.doctor.id ||
        "-"
      );
    }

    return (
      prescription.doctor_id ||
      prescription.doctor ||
      "-"
    );
  };

  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(date).toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    } catch {
      return date;
    }
  };

  const formatDateTime = (date) => {
    if (!date) return "-";

    try {
      return new Date(date).toLocaleString(
        "en-GB",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    } catch {
      return date;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-50 text-[#16A34A]";

      case "COMPLETED":
        return "bg-blue-50 text-[#2F6FED]";

      case "CANCELLED":
        return "bg-red-50 text-[#DC2626]";

      default:
        return "bg-gray-100 text-[#7A7A7A]";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "ACTIVE":
        return "Active";

      case "COMPLETED":
        return "Completed";

      case "CANCELLED":
        return "Cancelled";

      default:
        return status || "Unknown";
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-[#F2F2F2]">
        <div className="flex items-center gap-3 text-sm text-[#7A7A7A]">
          <Clock
            size={18}
            className="animate-spin"
          />
          Loading prescription details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">
        <button
          onClick={() =>
            navigate("/prescriptions")
          }
          className="mb-5 flex items-center gap-2 text-sm font-medium text-[#2F6FED] hover:text-[#2459C7]"
        >
          <ArrowLeft size={18} />
          Back to Prescriptions
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!prescription) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <button
            onClick={() =>
              navigate("/prescriptions")
            }
            className="mb-3 flex items-center gap-2 text-sm font-medium text-[#2F6FED] hover:text-[#2459C7]"
          >
            <ArrowLeft size={18} />
            Back to Prescriptions
          </button>

          <h1 className="text-2xl font-bold text-[#212121]">
            Prescription Details
          </h1>

          <p className="mt-1 text-sm text-[#7A7A7A]">
            View complete prescription information
          </p>
        </div>

        {canEdit(
          permissions,
          "prescriptions"
        ) && (
          <button
            onClick={() =>
              navigate(
                `/prescriptions/${prescription.id}/edit`
              )
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-[#2F6FED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2459C7]"
          >
            <Pencil size={17} />
            Edit Prescription
          </button>
        )}
      </div>

      {/* Prescription Header Card */}
      <div className="mb-5 rounded-xl border border-[#E5E7EB] bg-white p-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#EEF4FF]">
              <Pill
                size={32}
                className="text-[#2F6FED]"
              />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#212121]">
                {prescription.prescription_id ||
                  `Prescription #${prescription.id}`}
              </h2>

              <p className="mt-1 text-sm text-[#7A7A7A]">
                Prescription Record
              </p>
            </div>
          </div>

          <div>
            <span
              className={`inline-flex rounded-full px-4 py-2 text-xs font-semibold ${getStatusStyle(
                prescription.status
              )}`}
            >
              {getStatusLabel(
                prescription.status
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Member & Doctor */}
      <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Member */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-lg bg-[#EEF4FF] p-2">
              <UserRound
                size={20}
                className="text-[#2F6FED]"
              />
            </div>

            <div>
              <h3 className="font-semibold text-[#212121]">
                Member Information
              </h3>

              <p className="text-xs text-[#7A7A7A]">
                Patient receiving the prescription
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <InfoRow
              label="Member ID"
              value={getMemberId()}
            />

            <InfoRow
              label="Member Name"
              value={getMemberName()}
            />
          </div>
        </div>

        {/* Doctor */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-lg bg-[#D9F7E8] p-2">
              <Stethoscope
                size={20}
                className="text-[#16A34A]"
              />
            </div>

            <div>
              <h3 className="font-semibold text-[#212121]">
                Doctor Information
              </h3>

              <p className="text-xs text-[#7A7A7A]">
                Prescribing healthcare provider
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <InfoRow
              label="Doctor ID"
              value={getDoctorId()}
            />

            <InfoRow
              label="Doctor Name"
              value={getDoctorName()}
            />

            <InfoRow
              label="Specialty"
              value={
                typeof prescription.doctor ===
                "object"
                  ? prescription.doctor
                      ?.specialty
                  : prescription.doctor_specialty
              }
            />
          </div>
        </div>
      </div>

      {/* Prescription Information */}
      <div className="mb-5 rounded-xl border border-[#E5E7EB] bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-lg bg-[#FFF7ED] p-2">
            <CalendarDays
              size={20}
              className="text-[#F59E0B]"
            />
          </div>

          <div>
            <h3 className="font-semibold text-[#212121]">
              Prescription Information
            </h3>

            <p className="text-xs text-[#7A7A7A]">
              Basic prescription details
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <InfoRow
            label="Prescription ID"
            value={
              prescription.prescription_id ||
              "-"
            }
          />

          <InfoRow
            label="Prescription Date"
            value={formatDate(
              prescription.prescription_date
            )}
          />

          <InfoRow
            label="Diagnosis"
            value={
              prescription.diagnosis
            }
          />

          <InfoRow
            label="Status"
            value={getStatusLabel(
              prescription.status
            )}
          />
        </div>
      </div>

      {/* Medicine Card */}
      <div className="mb-5 rounded-xl border border-[#E5E7EB] bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-lg bg-[#EEF4FF] p-2">
            <Pill
              size={20}
              className="text-[#2F6FED]"
            />
          </div>

          <div>
            <h3 className="font-semibold text-[#212121]">
              Medication
            </h3>

            <p className="text-xs text-[#7A7A7A]">
              Prescribed medicine and dosage information
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-5">
          <div className="mb-5">
            <p className="text-xs font-medium uppercase tracking-wide text-[#7A7A7A]">
              Medicine
            </p>

            <p className="mt-1 text-lg font-bold text-[#212121]">
              {prescription.medicine ||
                "-"}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <InfoRow
              label="Dosage"
              value={prescription.dosage}
            />

            <InfoRow
              label="Frequency"
              value={
                prescription.frequency
              }
            />

            <InfoRow
              label="Duration"
              value={
                prescription.duration
              }
            />
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="mb-5 rounded-xl border border-[#E5E7EB] bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-lg bg-[#D9F7E8] p-2">
            <ClipboardList
              size={20}
              className="text-[#16A34A]"
            />
          </div>

          <div>
            <h3 className="font-semibold text-[#212121]">
              Medication Instructions
            </h3>

            <p className="text-xs text-[#7A7A7A]">
              Instructions provided for the patient
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-[#F9FAFB] p-5">
          <p className="whitespace-pre-line text-sm leading-7 text-[#212121]">
            {prescription.instructions ||
              "No medication instructions provided."}
          </p>
        </div>
      </div>

      {/* Notes */}
      <div className="mb-5 rounded-xl border border-[#E5E7EB] bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-lg bg-[#EEF4FF] p-2">
            <FileText
              size={20}
              className="text-[#2F6FED]"
            />
          </div>

          <div>
            <h3 className="font-semibold text-[#212121]">
              Notes
            </h3>

            <p className="text-xs text-[#7A7A7A]">
              Additional prescription notes
            </p>
          </div>
        </div>

        <div className="rounded-lg bg-[#F9FAFB] p-5">
          <p className="whitespace-pre-line text-sm leading-7 text-[#212121]">
            {prescription.notes ||
              "No additional notes."}
          </p>
        </div>
      </div>

      {/* Record Information */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-lg bg-[#FFF7ED] p-2">
            <Clock
              size={20}
              className="text-[#F59E0B]"
            />
          </div>

          <h3 className="font-semibold text-[#212121]">
            Record Information
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <InfoRow
            label="Created At"
            value={formatDateTime(
              prescription.created_at
            )}
          />

          <InfoRow
            label="Last Updated"
            value={formatDateTime(
              prescription.updated_at
            )}
          />
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({
  icon,
  label,
  value,
}) => {
  return (
    <div className="flex gap-3">
      {icon && (
        <div className="mt-0.5 shrink-0 text-[#7A7A7A]">
          {icon}
        </div>
      )}

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-[#7A7A7A]">
          {label}
        </p>

        <p className="mt-1 whitespace-pre-line break-words text-sm font-medium text-[#212121]">
          {value || "-"}
        </p>
      </div>
    </div>
  );
};

export default PrescriptionDetails;
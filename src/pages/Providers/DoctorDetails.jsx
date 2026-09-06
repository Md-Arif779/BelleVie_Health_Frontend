import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  UserRound,
  Stethoscope,
  Building2,
  Phone,
  Mail,
  Clock,
  BadgeDollarSign,
  GraduationCap,
} from "lucide-react";

import { getDoctor } from "../../services/doctorService";
import { useAuth } from "../../context/AuthContext";
import { canEdit } from "../../utils/permission";

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { permissions } = useAuth();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDoctor = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getDoctor(id);
        setDoctor(data);
      } catch (err) {
        console.error("Doctor Details Error:", err);

        setError(
          err.response?.data?.detail ||
            "Failed to load doctor details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDoctor();
  }, [id]);

  const formatFee = (fee) => {
    if (fee === null || fee === undefined || fee === "") {
      return "৳0";
    }

    return `৳${Number(fee).toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-[#F2F2F2]">
        <div className="text-sm text-[#7A7A7A]">
          Loading doctor details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">
        <button
          onClick={() => navigate("/doctors")}
          className="mb-5 flex items-center gap-2 text-sm font-medium text-[#2F6FED]"
        >
          <ArrowLeft size={18} />
          Back to Doctors
        </button>

        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!doctor) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <button
            onClick={() => navigate("/doctors")}
            className="mb-3 flex items-center gap-2 text-sm font-medium text-[#2F6FED] hover:text-[#2459C7]"
          >
            <ArrowLeft size={18} />
            Back to Doctors
          </button>

          <h1 className="text-2xl font-bold text-[#212121]">
            Doctor Details
          </h1>

          <p className="mt-1 text-sm text-[#7A7A7A]">
            View complete information about this doctor
          </p>
        </div>

        {canEdit(permissions, "doctors") && (
          <button
            onClick={() =>
              navigate(`/doctors/${doctor.id}/edit`)
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-[#2F6FED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2459C7]"
          >
            <Pencil size={17} />
            Edit Doctor
          </button>
        )}
      </div>

      {/* Profile Card */}
      <div className="mb-5 rounded-xl border border-[#E5E7EB] bg-white p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#EEF4FF]">
            <UserRound
              size={38}
              className="text-[#2F6FED]"
            />
          </div>

          <div className="flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-xl font-bold text-[#212121]">
                  {doctor.full_name}
                </h2>

                <p className="mt-1 text-sm text-[#7A7A7A]">
                  {doctor.doctor_id}
                </p>
              </div>

              {doctor.status === "ACTIVE" ? (
                <span className="w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-[#16A34A]">
                  Active
                </span>
              ) : (
                <span className="w-fit rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-[#DC2626]">
                  Inactive
                </span>
              )}
            </div>

            <div className="mt-3 flex items-center gap-2 text-sm text-[#7A7A7A]">
              <Stethoscope size={16} />
              {doctor.specialty || "Specialty not provided"}
            </div>
          </div>
        </div>
      </div>

      {/* Basic & Professional Information */}
      <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2">

        {/* Basic Information */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-lg bg-[#EEF4FF] p-2">
              <UserRound
                size={20}
                className="text-[#2F6FED]"
              />
            </div>

            <h3 className="font-semibold text-[#212121]">
              Basic Information
            </h3>
          </div>

          <div className="space-y-4">

            <InfoRow
              label="Doctor ID"
              value={doctor.doctor_id}
            />

            <InfoRow
              label="Full Name"
              value={doctor.full_name}
            />

            <InfoRow
              label="Specialty"
              value={doctor.specialty}
            />

            <InfoRow
              label="Years of Experience"
              value={`${doctor.years_of_experience ?? 0} years`}
            />

          </div>
        </div>

        {/* Professional Information */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-lg bg-[#D9F7E8] p-2">
              <GraduationCap
                size={20}
                className="text-[#16A34A]"
              />
            </div>

            <h3 className="font-semibold text-[#212121]">
              Professional Information
            </h3>
          </div>

          <div className="space-y-4">

            <InfoRow
              label="Qualifications"
              value={doctor.qualifications}
            />

            <InfoRow
              label="Hospital"
              value={doctor.hospital_name}
            />

            <InfoRow
              label="Chamber"
              value={doctor.chamber}
            />

            <InfoRow
              label="Consultation Fee"
              value={formatFee(doctor.consultation_fee)}
            />

          </div>
        </div>
      </div>

      {/* Contact & Availability */}
      <div className="mb-5 grid grid-cols-1 gap-5 lg:grid-cols-2">

        {/* Contact */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-lg bg-[#EEF4FF] p-2">
              <Phone
                size={20}
                className="text-[#2F6FED]"
              />
            </div>

            <h3 className="font-semibold text-[#212121]">
              Contact Information
            </h3>
          </div>

          <div className="space-y-4">

            <InfoRow
              icon={<Phone size={17} />}
              label="Phone"
              value={doctor.phone}
            />

            <InfoRow
              icon={<Mail size={17} />}
              label="Email"
              value={doctor.email}
            />

          </div>
        </div>

        {/* Availability */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-lg bg-[#FFF7ED] p-2">
              <Clock
                size={20}
                className="text-[#F59E0B]"
              />
            </div>

            <h3 className="font-semibold text-[#212121]">
              Availability
            </h3>
          </div>

          <div className="rounded-lg bg-[#F9FAFB] p-4">
            <p className="whitespace-pre-line text-sm leading-6 text-[#212121]">
              {doctor.availability ||
                "Availability information not provided."}
            </p>
          </div>
        </div>
      </div>

      {/* Record Information */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-lg bg-[#EEF4FF] p-2">
            <BadgeDollarSign
              size={20}
              className="text-[#2F6FED]"
            />
          </div>

          <h3 className="font-semibold text-[#212121]">
            Record Information
          </h3>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

          <InfoRow
            label="Created At"
            value={
              doctor.created_at
                ? new Date(
                    doctor.created_at
                  ).toLocaleString()
                : "-"
            }
          />

          <InfoRow
            label="Last Updated"
            value={
              doctor.updated_at
                ? new Date(
                    doctor.updated_at
                  ).toLocaleString()
                : "-"
            }
          />

        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value }) => {
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

export default DoctorDetails;
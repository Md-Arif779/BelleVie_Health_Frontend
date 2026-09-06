import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Pencil,
  Loader2,
  MapPin,
  Phone,
  Mail,
  Globe,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { getHospital } from "../../services/hospitalService";

import { useAuth } from "../../context/AuthContext";
import { canEdit } from "../../utils/permission";


const InfoRow = ({
  icon: Icon,
  label,
  value,
}) => {
  return (
    <div className="flex gap-3 py-3">

      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EEF4FF]">
        <Icon
          size={17}
          className="text-[#2F6FED]"
        />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-[#7A7A7A]">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-[#212121]">
          {value || "-"}
        </p>
      </div>

    </div>
  );
};


const TextSection = ({
  title,
  value,
}) => {
  return (
    <div>

      <h3 className="mb-2 text-sm font-semibold text-[#212121]">
        {title}
      </h3>

      <div className="rounded-lg bg-[#F9FAFB] p-4">

        <p className="whitespace-pre-wrap text-sm leading-6 text-[#212121]">
          {value || "No information available."}
        </p>

      </div>

    </div>
  );
};


function HospitalDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { permissions } = useAuth();

  const [hospital, setHospital] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  // =========================
  // LOAD HOSPITAL
  // =========================

  useEffect(() => {
    const loadHospital = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getHospital(id);

        setHospital(data);
      } catch (err) {
        console.error("Hospital Details Error:", err);

        setError(
          err?.response?.data?.detail ||
          "Failed to load hospital details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadHospital();
  }, [id]);


  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">

        <div className="flex min-h-[400px] items-center justify-center">

          <div className="flex items-center gap-3 text-sm text-[#7A7A7A]">

            <Loader2
              size={20}
              className="animate-spin text-[#2F6FED]"
            />

            Loading hospital...

          </div>

        </div>

      </div>
    );
  }


  // =========================
  // ERROR
  // =========================

  if (error || !hospital) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">

        <button
          type="button"
          onClick={() => navigate("/hospitals")}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-[#2F6FED] hover:underline"
        >
          <ArrowLeft size={17} />

          Back to Hospitals
        </button>


        <div className="rounded-xl border border-red-200 bg-red-50 p-6">

          <p className="text-sm font-medium text-[#DC2626]">
            {error || "Hospital not found."}
          </p>

        </div>

      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">

      {/* =========================
          HEADER
      ========================= */}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={() => navigate("/hospitals")}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#7A7A7A] transition hover:bg-[#EEF4FF] hover:text-[#2F6FED]"
          >
            <ArrowLeft size={19} />
          </button>


          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D9F7E8]">
            <Building2
              size={23}
              className="text-[#2F6FED]"
            />
          </div>


          <div>

            <h1 className="text-2xl font-bold text-[#212121]">
              {hospital.name}
            </h1>

            <div className="mt-1 flex flex-wrap items-center gap-2">

              <span className="font-mono text-xs font-medium text-[#2F6FED]">
                {hospital.hospital_id}
              </span>

              <span className="text-[#D1D5DB]">
                •
              </span>

              {hospital.status === "ACTIVE" ? (

                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#16A34A]">

                  <CheckCircle2 size={14} />

                  Active

                </span>

              ) : (

                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#DC2626]">

                  <XCircle size={14} />

                  Inactive

                </span>

              )}

            </div>

          </div>

        </div>


        {/* Edit */}

        {canEdit(permissions, "hospitals") && (
          <button
            type="button"
            onClick={() =>
              navigate(`/hospitals/${hospital.id}/edit`)
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-[#2F6FED] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2459C7]"
          >
            <Pencil size={17} />

            Edit Hospital
          </button>
        )}

      </div>


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <div className="mx-auto max-w-6xl space-y-6">


        {/* =========================
            OVERVIEW
        ========================= */}

        <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm">

          <div className="border-b border-[#E5E7EB] px-6 py-4">

            <h2 className="font-semibold text-[#212121]">
              Hospital Information
            </h2>

          </div>


          <div className="grid grid-cols-1 divide-y divide-[#E5E7EB] px-6 md:grid-cols-2 md:divide-y-0 md:gap-x-10">

            <InfoRow
              icon={Building2}
              label="Hospital ID"
              value={hospital.hospital_id}
            />

            <InfoRow
              icon={Building2}
              label="Hospital Name"
              value={hospital.name}
            />

            <InfoRow
              icon={MapPin}
              label="Location"
              value={hospital.location}
            />

            <InfoRow
              icon={Phone}
              label="Phone"
              value={hospital.phone}
            />

            <InfoRow
              icon={Mail}
              label="Email"
              value={hospital.email}
            />

            <InfoRow
              icon={Globe}
              label="Website"
              value={hospital.website}
            />

          </div>

        </div>


        {/* =========================
            WEBSITE
        ========================= */}

        {hospital.website && (
          <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">

            <h2 className="mb-3 font-semibold text-[#212121]">
              Website
            </h2>

            <a
              href={hospital.website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-[#2F6FED] hover:underline"
            >
              <Globe size={17} />

              {hospital.website}
            </a>

          </div>
        )}


        {/* =========================
            SERVICES
        ========================= */}

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">

          <div className="mb-5">

            <h2 className="font-semibold text-[#212121]">
              Hospital Services
            </h2>

            <p className="mt-1 text-sm text-[#7A7A7A]">
              Specialties, departments, services and packages
            </p>

          </div>


          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <TextSection
              title="Specialties"
              value={hospital.specialties}
            />

            <TextSection
              title="Departments"
              value={hospital.departments}
            />

            <TextSection
              title="Services"
              value={hospital.services}
            />

            <TextSection
              title="Packages"
              value={hospital.packages}
            />

          </div>

        </div>


        {/* =========================
            STATUS
        ========================= */}

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">

          <h2 className="mb-4 font-semibold text-[#212121]">
            Status
          </h2>

          {hospital.status === "ACTIVE" ? (

            <div className="flex items-center gap-3 rounded-lg bg-green-50 p-4">

              <CheckCircle2
                size={21}
                className="text-[#16A34A]"
              />

              <div>
                <p className="text-sm font-semibold text-[#16A34A]">
                  Active Hospital
                </p>

                <p className="mt-0.5 text-xs text-[#7A7A7A]">
                  This hospital is currently active.
                </p>
              </div>

            </div>

          ) : (

            <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4">

              <XCircle
                size={21}
                className="text-[#DC2626]"
              />

              <div>
                <p className="text-sm font-semibold text-[#DC2626]">
                  Inactive Hospital
                </p>

                <p className="mt-0.5 text-xs text-[#7A7A7A]">
                  This hospital is currently inactive.
                </p>
              </div>

            </div>

          )}

        </div>


        {/* =========================
            TIMESTAMPS
        ========================= */}

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">

          <h2 className="mb-4 font-semibold text-[#212121]">
            Record Information
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#7A7A7A]">
                Created At
              </p>

              <p className="mt-1 text-sm text-[#212121]">
                {hospital.created_at
                  ? new Date(
                      hospital.created_at
                    ).toLocaleString()
                  : "-"}
              </p>
            </div>


            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#7A7A7A]">
                Last Updated
              </p>

              <p className="mt-1 text-sm text-[#212121]">
                {hospital.updated_at
                  ? new Date(
                      hospital.updated_at
                    ).toLocaleString()
                  : "-"}
              </p>
            </div>

          </div>

        </div>


        {/* =========================
            BACK BUTTON
        ========================= */}

        <div className="pb-6">

          <button
            type="button"
            onClick={() => navigate("/hospitals")}
            className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-medium text-[#212121] transition hover:bg-[#EEF4FF]"
          >
            <ArrowLeft size={17} />

            Back to Hospitals
          </button>

        </div>

      </div>

    </div>
  );
}

export default HospitalDetails;
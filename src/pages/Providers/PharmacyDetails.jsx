import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle,
  Edit,
  ExternalLink,
  Loader2,
  MapPin,
  Phone,
  Mail,
  XCircle,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { getPharmacy } from "../../services/pharmacyService";
import { useAuth } from "../../context/AuthContext";
import { canEdit } from "../../utils/permission";

const PharmacyDetails = () => {
  const { id } = useParams();
  const { permissions } = useAuth();

  const [pharmacy, setPharmacy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPharmacy = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getPharmacy(id);

        setPharmacy(data);
      } catch (err) {
        console.error("Pharmacy Details Error:", err);

        setError(
          err?.response?.data?.detail ||
            "Failed to load pharmacy details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadPharmacy();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F2F2F2]">
        <div className="flex items-center gap-2 text-[#7A7A7A]">
          <Loader2
            size={20}
            className="animate-spin"
          />
          Loading pharmacy...
        </div>
      </div>
    );
  }

  if (error || !pharmacy) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">
        <div className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-[#212121]">
            Unable to Load Pharmacy
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error || "Pharmacy not found."}
          </p>

          <Link
            to="/pharmacies"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#2F6FED] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2459C7]"
          >
            <ArrowLeft size={17} />
            Back to Pharmacies
          </Link>
        </div>
      </div>
    );
  }

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    return new Date(value).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/pharmacies"
            className="rounded-lg border border-[#E5E7EB] bg-white p-2.5 text-[#212121] transition hover:bg-[#F8FAFC]"
          >
            <ArrowLeft size={19} />
          </Link>

          <div>
            <p className="text-sm font-medium text-[#2F6FED]">
              {pharmacy.pharmacy_id || "-"}
            </p>

            <h1 className="text-2xl font-bold text-[#212121]">
              {pharmacy.name || "-"}
            </h1>

            <p className="mt-1 text-sm text-[#7A7A7A]">
              Pharmacy provider details
            </p>
          </div>
        </div>

        {canEdit(permissions, "pharmacies") && (
          <Link
            to={`/pharmacies/${pharmacy.id}/edit`}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2F6FED] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2459C7]"
          >
            <Edit size={17} />
            Edit Pharmacy
          </Link>
        )}
      </div>

      {/* Main Information */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Basic Info */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-5 text-lg font-bold text-[#212121]">
            Pharmacy Information
          </h2>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#7A7A7A]">
                Pharmacy ID
              </p>

              <p className="mt-1 font-semibold text-[#2F6FED]">
                {pharmacy.pharmacy_id || "-"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#7A7A7A]">
                Name
              </p>

              <p className="mt-1 font-semibold text-[#212121]">
                {pharmacy.name || "-"}
              </p>
            </div>

            <div className="flex gap-3">
              <MapPin
                size={19}
                className="mt-1 shrink-0 text-[#2F6FED]"
              />

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#7A7A7A]">
                  Location
                </p>

                <p className="mt-1 text-sm text-[#212121]">
                  {pharmacy.location || "-"}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Phone
                size={19}
                className="mt-1 shrink-0 text-[#2F6FED]"
              />

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#7A7A7A]">
                  Phone
                </p>

                <p className="mt-1 text-sm text-[#212121]">
                  {pharmacy.phone || "-"}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Mail
                size={19}
                className="mt-1 shrink-0 text-[#2F6FED]"
              />

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#7A7A7A]">
                  Email
                </p>

                <p className="mt-1 break-all text-sm text-[#212121]">
                  {pharmacy.email || "-"}
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#7A7A7A]">
                Status
              </p>

              <div className="mt-2">
                {pharmacy.status === "ACTIVE" ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#D9F7E8] px-3 py-1.5 text-xs font-semibold text-[#16A34A]">
                    <CheckCircle size={14} />
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FEF2F2] px-3 py-1.5 text-xs font-semibold text-[#DC2626]">
                    <XCircle size={14} />
                    Inactive
                  </span>
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#7A7A7A]">
                Delivery
              </p>

              <div className="mt-2">
                {pharmacy.delivery_available ? (
                  <span className="rounded-full bg-[#D9F7E8] px-3 py-1.5 text-xs font-semibold text-[#16A34A]">
                    Available
                  </span>
                ) : (
                  <span className="rounded-full bg-[#F2F2F2] px-3 py-1.5 text-xs font-semibold text-[#7A7A7A]">
                    Not Available
                  </span>
                )}
              </div>
            </div>

            {pharmacy.website && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-[#7A7A7A]">
                  Website
                </p>

                <a
                  href={pharmacy.website}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-[#2F6FED] hover:underline"
                >
                  Visit Website
                  <ExternalLink size={14} />
                </a>
              </div>
            )}
          </div>

          {/* Address */}
          <div className="mt-6 border-t border-[#E5E7EB] pt-5">
            <p className="text-xs font-medium uppercase tracking-wide text-[#7A7A7A]">
              Address
            </p>

            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-[#212121]">
              {pharmacy.address || "-"}
            </p>
          </div>
        </div>

        {/* Timestamps */}
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-lg font-bold text-[#212121]">
            Record Information
          </h2>

          <div className="space-y-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#7A7A7A]">
                Created At
              </p>

              <p className="mt-1 text-sm text-[#212121]">
                {formatDate(pharmacy.created_at)}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[#7A7A7A]">
                Last Updated
              </p>

              <p className="mt-1 text-sm text-[#212121]">
                {formatDate(pharmacy.updated_at)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Medicines / Availability / Prices */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-[#212121]">
            Medicines
          </h2>

          <p className="whitespace-pre-line text-sm leading-6 text-[#7A7A7A]">
            {pharmacy.medicines || "No medicine information available."}
          </p>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-[#212121]">
            Availability
          </h2>

          <p className="whitespace-pre-line text-sm leading-6 text-[#7A7A7A]">
            {pharmacy.availability ||
              "No availability information available."}
          </p>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-[#212121]">
            Prices
          </h2>

          <p className="whitespace-pre-line text-sm leading-6 text-[#7A7A7A]">
            {pharmacy.prices ||
              "No pricing information available."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDetails;
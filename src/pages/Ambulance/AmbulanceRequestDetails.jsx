import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Ambulance,
  ArrowLeft,
  Pencil,
  UserRound,
  Phone,
  MapPin,
  Car,
  UserCog,
  AlertTriangle,
  FileText,
  CalendarDays,
  Clock3,
} from "lucide-react";

import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import {
  canEdit,
  canView,
} from "../../utils/permission";

const STATUS_LABELS = {
  REQUESTED: "Requested",
  ASSIGNED: "Assigned",
  ON_THE_WAY: "On The Way",
  PICKED_UP: "Picked Up",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const STATUS_STYLES = {
  REQUESTED: "bg-blue-50 text-blue-700",
  ASSIGNED: "bg-purple-50 text-purple-700",
  ON_THE_WAY: "bg-yellow-50 text-yellow-700",
  PICKED_UP: "bg-indigo-50 text-indigo-700",
  COMPLETED: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-700",
};

function AmbulanceRequestDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { permissions, loading } = useAuth();

  const [request, setRequest] = useState(null);
  const [loadingRequest, setLoadingRequest] = useState(true);
  const [error, setError] = useState("");

  const ambulancePermission = "ambulance";

  const canViewAmbulance = canView(
    permissions,
    ambulancePermission
  );

  const canEditAmbulance = canEdit(
    permissions,
    ambulancePermission
  );

  useEffect(() => {
    if (loading || !canViewAmbulance) {
      return;
    }

    fetchRequest();
  }, [loading, canViewAmbulance, id]);

  const fetchRequest = async () => {
    try {
      setLoadingRequest(true);
      setError("");

      const response = await api.get(
        `/ambulance/requests/${id}/`
      );

      setRequest(response.data);
    } catch (err) {
      console.error(
        "Ambulance request details error:",
        err
      );

      setError(
        err.response?.data?.detail ||
          "Failed to load ambulance request."
      );
    } finally {
      setLoadingRequest(false);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleString("en-BD", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  const formatStatus = (status) => {
    return (
      STATUS_LABELS[status] ||
      status ||
      "-"
    );
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-[#7A7A7A]">
          Loading permissions...
        </div>
      </div>
    );
  }

  if (!canViewAmbulance) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="bg-white border border-red-100 rounded-xl p-8 text-center shadow-sm">
          <Ambulance
            size={42}
            className="mx-auto text-red-500 mb-4"
          />

          <h2 className="text-xl font-semibold text-[#212121]">
            Access Denied
          </h2>

          <p className="text-[#7A7A7A] mt-2">
            You do not have permission to view ambulance
            requests.
          </p>
        </div>
      </div>
    );
  }

  if (loadingRequest) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-[#7A7A7A]">
          Loading ambulance request...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">
        <button
          type="button"
          onClick={() =>
            navigate("/ambulance-requests")
          }
          className="mb-5 inline-flex items-center gap-2 text-[#2F6FED] font-medium hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Ambulance Requests
        </button>

        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-5 py-4">
          {error}
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-[#7A7A7A]">
          Ambulance request not found.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() =>
              navigate("/ambulance-requests")
            }
            className="w-10 h-10 rounded-lg bg-white border border-[#E5E7EB] flex items-center justify-center text-[#7A7A7A] hover:text-[#2F6FED] transition"
          >
            <ArrowLeft size={19} />
          </button>

          <div className="w-11 h-11 rounded-xl bg-[#D9F7E8] flex items-center justify-center">
            <Ambulance
              size={24}
              className="text-[#2F6FED]"
            />
          </div>

          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold text-[#212121]">
                {request.request_id || "Ambulance Request"}
              </h1>

              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                  STATUS_STYLES[request.status] ||
                  "bg-gray-100 text-gray-700"
                }`}
              >
                {formatStatus(request.status)}
              </span>
            </div>

            <p className="text-sm text-[#7A7A7A] mt-1">
              Ambulance request details
            </p>
          </div>
        </div>

        {canEditAmbulance && (
          <button
            type="button"
            onClick={() =>
              navigate(
                `/ambulance-requests/${request.id}/edit`
              )
            }
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#2F6FED] text-white font-medium hover:bg-[#2459C7] transition"
          >
            <Pencil size={18} />
            Edit Request
          </button>
        )}
      </div>

      {/* Request Summary */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
            <Ambulance
              size={19}
              className="text-[#2F6FED]"
            />
          </div>

          <div>
            <h2 className="font-semibold text-[#212121]">
              Request Summary
            </h2>

            <p className="text-xs text-[#7A7A7A]">
              Basic ambulance request information
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <InfoItem
            label="Request ID"
            value={request.request_id}
          />

          <InfoItem
            label="Status"
            value={formatStatus(request.status)}
          />

          <InfoItem
            label="Request Date"
            value={formatDate(request.request_date)}
          />

          <InfoItem
            label="Last Updated"
            value={formatDate(request.updated_at)}
          />
        </div>
      </div>

      {/* Patient Information */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
            <UserRound
              size={19}
              className="text-[#2F6FED]"
            />
          </div>

          <div>
            <h2 className="font-semibold text-[#212121]">
              Patient Information
            </h2>

            <p className="text-xs text-[#7A7A7A]">
              Patient and BelleVie member information
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <InfoItem
            label="Member ID"
            value={request.member_id}
          />

          <InfoItem
            label="Member Name"
            value={request.member_name}
          />

          <InfoItem
            label="Patient Name"
            value={request.patient_name}
          />

          <InfoItem
            label="Patient Phone"
            value={request.patient_phone}
            icon={<Phone size={15} />}
          />

          <InfoItem
            label="Member Database ID"
            value={request.member}
          />
        </div>
      </div>

      {/* Journey Information */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center">
            <MapPin
              size={19}
              className="text-green-600"
            />
          </div>

          <div>
            <h2 className="font-semibold text-[#212121]">
              Journey Information
            </h2>

            <p className="text-xs text-[#7A7A7A]">
              Pickup and destination details
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <LocationCard
            title="Pickup Location"
            value={request.pickup_location}
          />

          <LocationCard
            title="Destination"
            value={request.destination}
          />
        </div>
      </div>

      {/* Ambulance & Driver */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center">
            <Car
              size={19}
              className="text-purple-600"
            />
          </div>

          <div>
            <h2 className="font-semibold text-[#212121]">
              Ambulance & Driver
            </h2>

            <p className="text-xs text-[#7A7A7A]">
              Assigned ambulance and driver information
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <InfoItem
            label="Ambulance Number"
            value={
              request.ambulance_number ||
              "Not assigned"
            }
            icon={<Car size={15} />}
          />

          <InfoItem
            label="Driver Name"
            value={
              request.driver_name ||
              "Not assigned"
            }
            icon={<UserCog size={15} />}
          />

          <InfoItem
            label="Driver Phone"
            value={
              request.driver_phone ||
              "Not assigned"
            }
            icon={<Phone size={15} />}
          />
        </div>
      </div>

      {/* Emergency Information */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mb-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
            <AlertTriangle
              size={19}
              className="text-red-600"
            />
          </div>

          <div>
            <h2 className="font-semibold text-[#212121]">
              Emergency Information
            </h2>

            <p className="text-xs text-[#7A7A7A]">
              Emergency instructions and additional notes
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <TextSection
            title="Emergency Note"
            value={request.emergency_note}
            icon={<AlertTriangle size={16} />}
            emptyText="No emergency note provided."
          />

          <TextSection
            title="Additional Notes"
            value={request.notes}
            icon={<FileText size={16} />}
            emptyText="No additional notes provided."
          />
        </div>
      </div>

      {/* Record Information */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
            <CalendarDays
              size={19}
              className="text-[#7A7A7A]"
            />
          </div>

          <div>
            <h2 className="font-semibold text-[#212121]">
              Record Information
            </h2>

            <p className="text-xs text-[#7A7A7A]">
              System record timestamps
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InfoItem
            label="Created At"
            value={formatDate(request.created_at)}
            icon={<Clock3 size={15} />}
          />

          <InfoItem
            label="Updated At"
            value={formatDate(request.updated_at)}
            icon={<Clock3 size={15} />}
          />
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  label,
  value,
  icon,
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-[#7A7A7A] mb-2">
        {label}
      </p>

      <div className="flex items-center gap-2 text-[#212121]">
        {icon && (
          <span className="text-[#7A7A7A]">
            {icon}
          </span>
        )}

        <span className="font-medium break-words">
          {value || "-"}
        </span>
      </div>
    </div>
  );
}

function LocationCard({
  title,
  value,
}) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] bg-gray-50 p-5">
      <div className="flex items-center gap-2 mb-3">
        <MapPin
          size={17}
          className="text-[#2F6FED]"
        />

        <p className="text-sm font-semibold text-[#212121]">
          {title}
        </p>
      </div>

      <p className="text-sm text-[#212121] leading-6">
        {value || "-"}
      </p>
    </div>
  );
}

function TextSection({
  title,
  value,
  icon,
  emptyText,
}) {
  return (
    <div className="rounded-xl border border-[#E5E7EB] p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-[#7A7A7A]">
          {icon}
        </span>

        <h3 className="text-sm font-semibold text-[#212121]">
          {title}
        </h3>
      </div>

      <p className="text-sm text-[#7A7A7A] whitespace-pre-wrap leading-6">
        {value || emptyText}
      </p>
    </div>
  );
}

export default AmbulanceRequestDetails;
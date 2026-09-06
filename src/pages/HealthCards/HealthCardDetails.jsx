import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Pencil,
  CreditCard,
  User,
  Calendar,
  Wallet,
  RefreshCw,
} from "lucide-react";

import { getHealthCard } from "../../services/healthCardService";

const HealthCardDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [healthCard, setHealthCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadHealthCard = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getHealthCard(id);

        setHealthCard(data);
      } catch (err) {
        console.error("Health Card Details Error:", err);

        setError("Failed to load health card.");
      } finally {
        setLoading(false);
      }
    };

    loadHealthCard();
  }, [id]);

  const getStatusClass = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-50 text-green-600 border-green-200";

      case "EXPIRED":
        return "bg-red-50 text-red-600 border-red-200";

      case "SUSPENDED":
        return "bg-yellow-50 text-yellow-600 border-yellow-200";

      case "CANCELLED":
        return "bg-gray-100 text-gray-600 border-gray-200";

      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "-";

    return status.charAt(0) + status.slice(1).toLowerCase();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-[#7A7A7A]">
          Loading health card...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <button
          type="button"
          onClick={() => navigate("/health-cards")}
          className="
            flex
            items-center
            gap-2
            text-sm
            text-[#2F6FED]
            hover:text-[#2459C7]
            mb-6
          "
        >
          <ArrowLeft size={18} />
          Back to Health Cards
        </button>

        <div
          className="
            rounded-xl
            border
            border-red-200
            bg-red-50
            px-5
            py-4
            text-sm
            text-red-600
          "
        >
          {error}
        </div>
      </div>
    );
  }

  if (!healthCard) {
    return null;
  }

  const memberName =
    healthCard.member_name ||
    healthCard.member?.full_name ||
    "-";

  const memberId =
    healthCard.member_id ||
    healthCard.member?.member_id ||
    "-";

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <div className="flex items-center gap-4">

          <button
            type="button"
            onClick={() => navigate("/health-cards")}
            className="
              w-10
              h-10
              rounded-lg
              border
              border-[#E5E7EB]
              bg-white
              flex
              items-center
              justify-center
              text-[#7A7A7A]
              hover:bg-[#F2F2F2]
              transition
            "
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-[#212121]">
              Health Card Details
            </h1>

            <p className="text-sm text-[#7A7A7A] mt-1">
              View health card information
            </p>
          </div>

        </div>

        <button
          type="button"
          onClick={() =>
            navigate(`/health-cards/${healthCard.id}/edit`)
          }
          className="
            h-11
            px-5
            rounded-lg
            bg-[#2F6FED]
            text-white
            text-sm
            font-medium
            flex
            items-center
            gap-2
            hover:bg-[#2459C7]
            transition
          "
        >
          <Pencil size={18} />
          Edit Health Card
        </button>

      </div>


      {/* Main Card */}
      <div className="max-w-4xl">

        {/* Card Header */}
        <div
          className="
            bg-white
            rounded-2xl
            border
            border-[#E5E7EB]
            overflow-hidden
          "
        >

          <div
            className="
              px-6
              py-5
              border-b
              border-[#E5E7EB]
              flex
              items-center
              justify-between
            "
          >

            <div className="flex items-center gap-3">

              <div
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-[#D9F7E8]
                  flex
                  items-center
                  justify-center
                  text-[#2F6FED]
                "
              >
                <CreditCard size={22} />
              </div>

              <div>
                <p className="text-xs text-[#7A7A7A]">
                  Health Card ID
                </p>

                <h2 className="text-lg font-semibold text-[#212121]">
                  {healthCard.card_id || "-"}
                </h2>
              </div>

            </div>

            <span
              className={`
                px-3
                py-1.5
                rounded-full
                border
                text-xs
                font-medium
                ${getStatusClass(healthCard.status)}
              `}
            >
              {formatStatus(healthCard.status)}
            </span>

          </div>


          {/* Member Section */}
          <div className="p-6 border-b border-[#E5E7EB]">

            <div className="flex items-center gap-2 mb-5">

              <User
                size={18}
                className="text-[#2F6FED]"
              />

              <h3 className="text-base font-semibold text-[#212121]">
                Member Information
              </h3>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <InfoItem
                label="Member ID"
                value={memberId}
              />

              <InfoItem
                label="Member Name"
                value={memberName}
              />

            </div>

          </div>


          {/* Plan Section */}
          <div className="p-6 border-b border-[#E5E7EB]">

            <div className="flex items-center gap-2 mb-5">

              <CreditCard
                size={18}
                className="text-[#2F6FED]"
              />

              <h3 className="text-base font-semibold text-[#212121]">
                Plan Information
              </h3>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <InfoItem
                label="Plan Name"
                value={healthCard.plan_name}
              />

              <InfoItem
                label="Premium"
                value={
                  healthCard.premium !== null &&
                  healthCard.premium !== undefined
                    ? `৳ ${healthCard.premium}`
                    : "৳ 0.00"
                }
                icon={<Wallet size={16} />}
              />

            </div>

          </div>


          {/* Date Section */}
          <div className="p-6 border-b border-[#E5E7EB]">

            <div className="flex items-center gap-2 mb-5">

              <Calendar
                size={18}
                className="text-[#2F6FED]"
              />

              <h3 className="text-base font-semibold text-[#212121]">
                Card Dates
              </h3>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              <InfoItem
                label="Issue Date"
                value={healthCard.issue_date || "-"}
              />

              <InfoItem
                label="Expiry Date"
                value={healthCard.expiry_date || "-"}
              />

              <InfoItem
                label="Renewal Date"
                value={healthCard.renewal_date || "-"}
                icon={<RefreshCw size={16} />}
              />

            </div>

          </div>


          {/* System Information */}
          <div className="p-6">

            <h3 className="text-base font-semibold text-[#212121] mb-5">
              System Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <InfoItem
                label="Created At"
                value={healthCard.created_at || "-"}
              />

              <InfoItem
                label="Updated At"
                value={healthCard.updated_at || "-"}
              />

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};


const InfoItem = ({
  label,
  value,
  icon,
}) => {
  return (
    <div>

      <p className="text-xs text-[#7A7A7A] mb-1.5">
        {label}
      </p>

      <div className="flex items-center gap-2">

        {icon && (
          <span className="text-[#2F6FED]">
            {icon}
          </span>
        )}

        <p className="text-sm font-medium text-[#212121]">
          {value || "-"}
        </p>

      </div>

    </div>
  );
};

export default HealthCardDetails;
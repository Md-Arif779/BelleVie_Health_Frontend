import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  HeartPulse,
  UserRound,
} from "lucide-react";

import { getHealthProfile } from "../../services/healthProfileService";
import { useAuth } from "../../context/AuthContext";
import { canEdit } from "../../utils/permission";

const HealthProfileDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { permissions } = useAuth();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const canEditProfile = canEdit(
    permissions,
    "health_profiles"
  );

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getHealthProfile(id);

        setProfile(data);
      } catch (err) {
        console.error(
          "Health Profile Details Error:",
          err
        );

        setError(
          err?.response?.data?.detail ||
            "Failed to load health profile."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [id]);

  const formatValue = (value) => {
    if (!value) {
      return "-";
    }

    return value;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[#7A7A7A]">
          Loading health profile...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <button
          type="button"
          onClick={() => navigate("/health-profiles")}
          className="flex items-center gap-2 mb-6 text-sm text-[#7A7A7A] hover:text-[#2F6FED]"
        >
          <ArrowLeft size={17} />
          Back to Health Profiles
        </button>

        <div className="bg-white border border-red-200 rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold text-[#212121] mb-2">
            Unable to Load Profile
          </h2>

          <p className="text-[#DC2626]">
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const memberName =
    profile.member_name ||
    profile.member?.full_name ||
    "-";

  const memberId =
    profile.member_id ||
    profile.member?.member_id ||
    "-";

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <button
            type="button"
            onClick={() =>
              navigate("/health-profiles")
            }
            className="flex items-center gap-2 text-sm text-[#7A7A7A] hover:text-[#2F6FED] mb-3"
          >
            <ArrowLeft size={17} />
            Back to Health Profiles
          </button>

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-[#EEF4FF] flex items-center justify-center">
              <HeartPulse
                size={23}
                className="text-[#2F6FED]"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#212121]">
                Health Profile
              </h1>

              <p className="text-sm text-[#7A7A7A] mt-1">
                Member medical information
              </p>
            </div>

          </div>
        </div>

        {canEditProfile && (
          <button
            type="button"
            onClick={() =>
              navigate(
                `/health-profiles/${profile.id}/edit`
              )
            }
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#2F6FED] text-white text-sm font-medium hover:bg-[#2459C7]"
          >
            <Edit size={17} />
            Edit Profile
          </button>
        )}

      </div>


      {/* Member Information */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm mb-6">

        <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center gap-2">
          <UserRound
            size={19}
            className="text-[#2F6FED]"
          />

          <h2 className="text-lg font-semibold text-[#212121]">
            Member Information
          </h2>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>
            <p className="text-xs text-[#7A7A7A] mb-1">
              Member ID
            </p>

            <p className="text-sm font-semibold text-[#212121]">
              {memberId}
            </p>
          </div>

          <div>
            <p className="text-xs text-[#7A7A7A] mb-1">
              Member Name
            </p>

            <p className="text-sm font-semibold text-[#212121]">
              {memberName}
            </p>
          </div>

        </div>

      </div>


      {/* Medical Information */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm">

        <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center gap-2">
          <HeartPulse
            size={19}
            className="text-[#2F6FED]"
          />

          <h2 className="text-lg font-semibold text-[#212121]">
            Medical Information
          </h2>
        </div>


        <div className="p-6 space-y-6">

          {/* Blood Group */}
          <div>
            <p className="text-xs text-[#7A7A7A] mb-1">
              Blood Group
            </p>

            <p className="text-sm font-semibold text-[#212121]">
              {formatValue(profile.blood_group)}
            </p>
          </div>


          {/* Allergies */}
          <div>
            <p className="text-xs text-[#7A7A7A] mb-2">
              Allergies
            </p>

            <div className="bg-[#F2F2F2] rounded-lg px-4 py-3 text-sm text-[#212121] whitespace-pre-wrap">
              {formatValue(profile.allergies)}
            </div>
          </div>


          {/* Existing Conditions */}
          <div>
            <p className="text-xs text-[#7A7A7A] mb-2">
              Existing Conditions
            </p>

            <div className="bg-[#F2F2F2] rounded-lg px-4 py-3 text-sm text-[#212121] whitespace-pre-wrap">
              {formatValue(
                profile.existing_conditions
              )}
            </div>
          </div>


          {/* Current Medications */}
          <div>
            <p className="text-xs text-[#7A7A7A] mb-2">
              Current Medications
            </p>

            <div className="bg-[#F2F2F2] rounded-lg px-4 py-3 text-sm text-[#212121] whitespace-pre-wrap">
              {formatValue(
                profile.current_medications
              )}
            </div>
          </div>


          {/* Medical History */}
          <div>
            <p className="text-xs text-[#7A7A7A] mb-2">
              Medical History
            </p>

            <div className="bg-[#F2F2F2] rounded-lg px-4 py-3 text-sm text-[#212121] whitespace-pre-wrap">
              {formatValue(
                profile.medical_history
              )}
            </div>
          </div>

        </div>

      </div>


      {/* Timestamps */}
      <div className="mt-6 bg-white border border-[#E5E7EB] rounded-xl shadow-sm">

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

          <div>
            <p className="text-xs text-[#7A7A7A] mb-1">
              Created At
            </p>

            <p className="text-sm text-[#212121]">
              {formatValue(profile.created_at)}
            </p>
          </div>

          <div>
            <p className="text-xs text-[#7A7A7A] mb-1">
              Last Updated
            </p>

            <p className="text-sm text-[#212121]">
              {formatValue(profile.updated_at)}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default HealthProfileDetails;
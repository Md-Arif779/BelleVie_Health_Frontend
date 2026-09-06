import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  HeartPulse,
  UserRound,
} from "lucide-react";

import {
  createHealthProfile,
  getHealthProfile,
  updateHealthProfile,
} from "../../services/healthProfileService";

import { getMembers } from "../../services/memberService";

import { useAuth } from "../../context/AuthContext";

import {
  canAdd,
  canEdit,
} from "../../utils/permission";


const HealthProfileForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { permissions } = useAuth();

  const isEditMode = Boolean(id);

  const [members, setMembers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    member: "",
    blood_group: "",
    allergies: "",
    existing_conditions: "",
    current_medications: "",
    medical_history: "",
  });


  // =====================================================
  // PERMISSION
  // =====================================================

  const hasPermission = isEditMode
    ? canEdit(permissions, "health_profiles")
    : canAdd(permissions, "health_profiles");


  // =====================================================
  // LOAD MEMBERS + PROFILE
  // =====================================================

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        // Load members
        const memberData = await getMembers();

        const memberResults = Array.isArray(memberData)
          ? memberData
          : memberData?.results || [];

        setMembers(memberResults);


        // Edit mode → load profile
        if (isEditMode) {
          const profile = await getHealthProfile(id);

          setFormData({
            member: profile.member || "",
            blood_group: profile.blood_group || "",
            allergies: profile.allergies || "",
            existing_conditions:
              profile.existing_conditions || "",
            current_medications:
              profile.current_medications || "",
            medical_history:
              profile.medical_history || "",
          });
        }

      } catch (err) {
        console.error(
          "Health Profile Load Error:",
          err
        );

        setError(
          err?.response?.data?.detail ||
          "Failed to load health profile data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, isEditMode]);


  // =====================================================
  // HANDLE INPUT
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!hasPermission) {
      setError(
        isEditMode
          ? "You do not have permission to edit health profiles."
          : "You do not have permission to add health profiles."
      );

      return;
    }


    // Member required
    if (!formData.member) {
      setError("Please select a member.");
      return;
    }


    try {
      setSaving(true);

      const payload = {
        member: Number(formData.member),

        blood_group:
          formData.blood_group || null,

        allergies:
          formData.allergies.trim() || null,

        existing_conditions:
          formData.existing_conditions.trim() || null,

        current_medications:
          formData.current_medications.trim() || null,

        medical_history:
          formData.medical_history.trim() || null,
      };


      if (isEditMode) {
        await updateHealthProfile(
          id,
          payload
        );

        setSuccess(
          "Health profile updated successfully."
        );
      } else {
        await createHealthProfile(
          payload
        );

        setSuccess(
          "Health profile created successfully."
        );
      }


      // Navigate after short delay
      setTimeout(() => {
        navigate("/health-profiles");
      }, 700);

    } catch (err) {
      console.error(
        "Health Profile Save Error:",
        err
      );

      const responseData =
        err?.response?.data;

      if (
        responseData &&
        typeof responseData === "object"
      ) {
        const firstError =
          Object.values(responseData)
            .flat()
            .find(Boolean);

        setError(
          firstError ||
          "Failed to save health profile."
        );
      } else {
        setError(
          "Failed to save health profile."
        );
      }
    } finally {
      setSaving(false);
    }
  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[#7A7A7A]">
          Loading health profile...
        </div>
      </div>
    );
  }


  // =====================================================
  // PERMISSION BLOCK
  // =====================================================

  if (!hasPermission) {
    return (
      <div className="p-6">

        <button
          type="button"
          onClick={() =>
            navigate("/health-profiles")
          }
          className="flex items-center gap-2 mb-6 text-[#2F6FED] hover:text-[#2459C7]"
        >
          <ArrowLeft size={18} />
          Back to Health Profiles
        </button>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-[#212121] mb-2">
            Access Denied
          </h2>

          <p className="text-[#7A7A7A]">
            You do not have permission to{" "}
            {isEditMode ? "edit" : "add"} health profiles.
          </p>
        </div>

      </div>
    );
  }


  // =====================================================
  // UI
  // =====================================================

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
                {isEditMode
                  ? "Edit Health Profile"
                  : "Add Health Profile"}
              </h1>

              <p className="text-sm text-[#7A7A7A] mt-1">
                {isEditMode
                  ? "Update member health information"
                  : "Create a health profile for a member"}
              </p>
            </div>

          </div>
        </div>

      </div>


      {/* Alerts */}

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-[#DC2626]">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-[#16A34A]">
          {success}
        </div>
      )}


      {/* Form */}

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm"
      >

        {/* Basic Information */}

        <div className="p-6 border-b border-[#E5E7EB]">

          <div className="flex items-center gap-2 mb-5">
            <UserRound
              size={19}
              className="text-[#2F6FED]"
            />

            <h2 className="text-lg font-semibold text-[#212121]">
              Member Information
            </h2>
          </div>


          <div className="max-w-xl">

            <label className="block text-sm font-medium text-[#212121] mb-2">
              Member
              <span className="text-[#DC2626] ml-1">
                *
              </span>
            </label>

            <select
              name="member"
              value={formData.member}
              onChange={handleChange}
              disabled={isEditMode}
              className="w-full h-11 px-3 rounded-lg border border-[#E5E7EB] bg-white text-[#212121] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10 disabled:bg-[#F2F2F2] disabled:text-[#7A7A7A]"
            >
              <option value="">
                Select Member
              </option>

              {members.map((member) => (
                <option
                  key={member.id}
                  value={member.id}
                >
                  {member.member_id} — {member.full_name}
                </option>
              ))}
            </select>

            {isEditMode && (
              <p className="text-xs text-[#7A7A7A] mt-2">
                Member cannot be changed while editing a health profile.
              </p>
            )}

          </div>

        </div>


        {/* Medical Information */}

        <div className="p-6">

          <div className="flex items-center gap-2 mb-5">

            <HeartPulse
              size={19}
              className="text-[#2F6FED]"
            />

            <h2 className="text-lg font-semibold text-[#212121]">
              Medical Information
            </h2>

          </div>


          {/* Blood Group */}

          <div className="max-w-xl mb-5">

            <label className="block text-sm font-medium text-[#212121] mb-2">
              Blood Group
            </label>

            <select
              name="blood_group"
              value={formData.blood_group}
              onChange={handleChange}
              className="w-full h-11 px-3 rounded-lg border border-[#E5E7EB] bg-white text-[#212121] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
            >
              <option value="">
                Select Blood Group
              </option>

              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>

          </div>


          {/* Allergies */}

          <div className="mb-5">

            <label className="block text-sm font-medium text-[#212121] mb-2">
              Allergies
            </label>

            <textarea
              name="allergies"
              value={formData.allergies}
              onChange={handleChange}
              rows={3}
              placeholder="Enter allergies, if any..."
              className="w-full px-3 py-3 rounded-lg border border-[#E5E7EB] bg-white text-[#212121] outline-none resize-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
            />

          </div>


          {/* Existing Conditions */}

          <div className="mb-5">

            <label className="block text-sm font-medium text-[#212121] mb-2">
              Existing Conditions
            </label>

            <textarea
              name="existing_conditions"
              value={formData.existing_conditions}
              onChange={handleChange}
              rows={3}
              placeholder="Enter existing medical conditions..."
              className="w-full px-3 py-3 rounded-lg border border-[#E5E7EB] bg-white text-[#212121] outline-none resize-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
            />

          </div>


          {/* Current Medications */}

          <div className="mb-5">

            <label className="block text-sm font-medium text-[#212121] mb-2">
              Current Medications
            </label>

            <textarea
              name="current_medications"
              value={formData.current_medications}
              onChange={handleChange}
              rows={3}
              placeholder="Enter current medications..."
              className="w-full px-3 py-3 rounded-lg border border-[#E5E7EB] bg-white text-[#212121] outline-none resize-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
            />

          </div>


          {/* Medical History */}

          <div className="mb-2">

            <label className="block text-sm font-medium text-[#212121] mb-2">
              Medical History
            </label>

            <textarea
              name="medical_history"
              value={formData.medical_history}
              onChange={handleChange}
              rows={5}
              placeholder="Enter previous medical history..."
              className="w-full px-3 py-3 rounded-lg border border-[#E5E7EB] bg-white text-[#212121] outline-none resize-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
            />

          </div>

        </div>


        {/* Footer */}

        <div className="px-6 py-4 bg-[#F2F2F2] border-t border-[#E5E7EB] rounded-b-xl flex items-center justify-end gap-3">

          <button
            type="button"
            onClick={() =>
              navigate("/health-profiles")
            }
            disabled={saving}
            className="px-5 py-2.5 rounded-lg border border-[#E5E7EB] bg-white text-[#212121] text-sm font-medium hover:bg-[#EEEEEE] disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#2F6FED] text-white text-sm font-medium hover:bg-[#2459C7] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={17} />

            {saving
              ? "Saving..."
              : isEditMode
                ? "Update Profile"
                : "Save Profile"}
          </button>

        </div>

      </form>

    </div>
  );
};

export default HealthProfileForm;
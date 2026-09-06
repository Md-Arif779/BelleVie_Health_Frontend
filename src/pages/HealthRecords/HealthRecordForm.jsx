import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  FileText,
  UserRound,
} from "lucide-react";

import {
  createHealthRecord,
  getHealthRecord,
  updateHealthRecord,
} from "../../services/healthRecordService";

import { getMembers } from "../../services/memberService";

import { useAuth } from "../../context/AuthContext";

import {
  canAdd,
  canEdit,
} from "../../utils/permission";


const HealthRecordForm = () => {
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
    record_type: "",
    record_date: "",
    title: "",
    description: "",
    diagnosis: "",
    treatment: "",
    doctor_name: "",
    hospital_name: "",
    notes: "",
  });

  const hasPermission = isEditMode
    ? canEdit(permissions, "health_records")
    : canAdd(permissions, "health_records");


  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const memberData = await getMembers();

        const memberResults = Array.isArray(memberData)
          ? memberData
          : memberData?.results || [];

        setMembers(memberResults);

        if (isEditMode) {
          const record = await getHealthRecord(id);

          setFormData({
            member: record.member || "",
            record_type: record.record_type || "",
            record_date: record.record_date || "",
            title: record.title || "",
            description: record.description || "",
            diagnosis: record.diagnosis || "",
            treatment: record.treatment || "",
            doctor_name: record.doctor_name || "",
            hospital_name: record.hospital_name || "",
            notes: record.notes || "",
          });
        }
      } catch (err) {
        console.error(
          "Health Record Load Error:",
          err
        );

        setError(
          err?.response?.data?.detail ||
            "Failed to load health record data."
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, isEditMode]);


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!hasPermission) {
      setError(
        isEditMode
          ? "You do not have permission to edit health records."
          : "You do not have permission to add health records."
      );

      return;
    }

    if (!formData.member) {
      setError("Please select a member.");
      return;
    }

    if (!formData.record_type) {
      setError("Please select a record type.");
      return;
    }

    if (!formData.record_date) {
      setError("Please select a record date.");
      return;
    }

    if (!formData.title.trim()) {
      setError("Please enter a record title.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        member: Number(formData.member),

        record_type: formData.record_type,

        record_date: formData.record_date,

        title: formData.title.trim(),

        description:
          formData.description.trim() || null,

        diagnosis:
          formData.diagnosis.trim() || null,

        treatment:
          formData.treatment.trim() || null,

        doctor_name:
          formData.doctor_name.trim() || null,

        hospital_name:
          formData.hospital_name.trim() || null,

        notes:
          formData.notes.trim() || null,
      };


      if (isEditMode) {
        await updateHealthRecord(
          id,
          payload
        );

        setSuccess(
          "Health record updated successfully."
        );
      } else {
        await createHealthRecord(
          payload
        );

        setSuccess(
          "Health record created successfully."
        );
      }


      setTimeout(() => {
        navigate("/health-records");
      }, 700);

    } catch (err) {
      console.error(
        "Health Record Save Error:",
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
            "Failed to save health record."
        );
      } else {
        setError(
          "Failed to save health record."
        );
      }
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[#7A7A7A]">
          Loading health record...
        </div>
      </div>
    );
  }


  if (!hasPermission) {
    return (
      <div className="p-6">

        <button
          type="button"
          onClick={() =>
            navigate("/health-records")
          }
          className="flex items-center gap-2 mb-6 text-[#2F6FED] hover:text-[#2459C7]"
        >
          <ArrowLeft size={18} />
          Back to Health Records
        </button>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-8 text-center shadow-sm">

          <h2 className="text-xl font-semibold text-[#212121] mb-2">
            Access Denied
          </h2>

          <p className="text-[#7A7A7A]">
            You do not have permission to{" "}
            {isEditMode ? "edit" : "add"} health records.
          </p>

        </div>
      </div>
    );
  }


  return (
    <div className="p-6">

      {/* Header */}

      <div className="mb-6">

        <button
          type="button"
          onClick={() =>
            navigate("/health-records")
          }
          className="flex items-center gap-2 text-sm text-[#7A7A7A] hover:text-[#2F6FED] mb-3"
        >
          <ArrowLeft size={17} />
          Back to Health Records
        </button>


        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-[#EEF4FF] flex items-center justify-center">
            <FileText
              size={23}
              className="text-[#2F6FED]"
            />
          </div>


          <div>

            <h1 className="text-2xl font-bold text-[#212121]">
              {isEditMode
                ? "Edit Health Record"
                : "Add Health Record"}
            </h1>

            <p className="text-sm text-[#7A7A7A] mt-1">
              {isEditMode
                ? "Update member medical record"
                : "Create a medical record for a member"}
            </p>

          </div>

        </div>

      </div>


      {/* Messages */}

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


      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm"
      >

        {/* Member Information */}

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
              className="w-full h-11 px-3 rounded-lg border border-[#E5E7EB] bg-white text-[#212121] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
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

          </div>

        </div>


        {/* Record Information */}

        <div className="p-6">

          <div className="flex items-center gap-2 mb-5">

            <FileText
              size={19}
              className="text-[#2F6FED]"
            />

            <h2 className="text-lg font-semibold text-[#212121]">
              Record Information
            </h2>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Record Type */}

            <div>

              <label className="block text-sm font-medium text-[#212121] mb-2">
                Record Type
                <span className="text-[#DC2626] ml-1">
                  *
                </span>
              </label>

              <select
                name="record_type"
                value={formData.record_type}
                onChange={handleChange}
                className="w-full h-11 px-3 rounded-lg border border-[#E5E7EB] bg-white text-[#212121] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
              >

                <option value="">
                  Select Record Type
                </option>

                <option value="CONSULTATION">
                  Consultation
                </option>

                <option value="DIAGNOSIS">
                  Diagnosis
                </option>

                <option value="INVESTIGATION">
                  Investigation
                </option>

                <option value="PRESCRIPTION">
                  Prescription
                </option>

                <option value="SURGERY">
                  Surgery
                </option>

                <option value="HOSPITALIZATION">
                  Hospitalization
                </option>

              </select>

            </div>


            {/* Record Date */}

            <div>

              <label className="block text-sm font-medium text-[#212121] mb-2">
                Record Date
                <span className="text-[#DC2626] ml-1">
                  *
                </span>
              </label>

              <input
                type="date"
                name="record_date"
                value={formData.record_date}
                onChange={handleChange}
                className="w-full h-11 px-3 rounded-lg border border-[#E5E7EB] bg-white text-[#212121] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
              />

            </div>


            {/* Title */}

            <div className="md:col-span-2">

              <label className="block text-sm font-medium text-[#212121] mb-2">
                Title
                <span className="text-[#DC2626] ml-1">
                  *
                </span>
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter record title..."
                className="w-full h-11 px-3 rounded-lg border border-[#E5E7EB] bg-white text-[#212121] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
              />

            </div>


            {/* Description */}

            <div className="md:col-span-2">

              <label className="block text-sm font-medium text-[#212121] mb-2">
                Description
              </label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                placeholder="Describe the medical record..."
                className="w-full px-3 py-3 rounded-lg border border-[#E5E7EB] bg-white text-[#212121] outline-none resize-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
              />

            </div>


            {/* Diagnosis */}

            <div>

              <label className="block text-sm font-medium text-[#212121] mb-2">
                Diagnosis
              </label>

              <textarea
                name="diagnosis"
                value={formData.diagnosis}
                onChange={handleChange}
                rows={4}
                placeholder="Enter diagnosis..."
                className="w-full px-3 py-3 rounded-lg border border-[#E5E7EB] bg-white text-[#212121] outline-none resize-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
              />

            </div>


            {/* Treatment */}

            <div>

              <label className="block text-sm font-medium text-[#212121] mb-2">
                Treatment
              </label>

              <textarea
                name="treatment"
                value={formData.treatment}
                onChange={handleChange}
                rows={4}
                placeholder="Enter treatment details..."
                className="w-full px-3 py-3 rounded-lg border border-[#E5E7EB] bg-white text-[#212121] outline-none resize-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
              />

            </div>


            {/* Doctor Name */}

            <div>

              <label className="block text-sm font-medium text-[#212121] mb-2">
                Doctor Name
              </label>

              <input
                type="text"
                name="doctor_name"
                value={formData.doctor_name}
                onChange={handleChange}
                placeholder="Enter doctor name..."
                className="w-full h-11 px-3 rounded-lg border border-[#E5E7EB] bg-white text-[#212121] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
              />

            </div>


            {/* Hospital Name */}

            <div>

              <label className="block text-sm font-medium text-[#212121] mb-2">
                Hospital Name
              </label>

              <input
                type="text"
                name="hospital_name"
                value={formData.hospital_name}
                onChange={handleChange}
                placeholder="Enter hospital name..."
                className="w-full h-11 px-3 rounded-lg border border-[#E5E7EB] bg-white text-[#212121] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
              />

            </div>


            {/* Notes */}

            <div className="md:col-span-2">

              <label className="block text-sm font-medium text-[#212121] mb-2">
                Notes
              </label>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                placeholder="Enter additional notes..."
                className="w-full px-3 py-3 rounded-lg border border-[#E5E7EB] bg-white text-[#212121] outline-none resize-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
              />

            </div>

          </div>

        </div>


        {/* Footer */}

        <div className="px-6 py-4 bg-[#F2F2F2] border-t border-[#E5E7EB] rounded-b-xl flex items-center justify-end gap-3">

          <button
            type="button"
            onClick={() =>
              navigate("/health-records")
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
                ? "Update Record"
                : "Save Record"}

          </button>

        </div>

      </form>

    </div>
  );
};

export default HealthRecordForm;
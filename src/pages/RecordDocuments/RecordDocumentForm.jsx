import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  FileUp,
  Loader2,
  Save,
} from "lucide-react";

import {
  createRecordDocument,
  getRecordDocument,
  updateRecordDocument,
} from "../../services/recordDocumentService";

import { getMembers } from "../../services/memberService";
import { getHealthRecords } from "../../services/healthRecordService";

import { useAuth } from "../../context/AuthContext";
import { canAdd, canEdit } from "../../utils/permission";

const RecordDocumentForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { permissions } = useAuth();

  const isEditMode = Boolean(id);

  const [members, setMembers] = useState([]);
  const [records, setRecords] = useState([]);

  const [formData, setFormData] = useState({
    member: "",
    record: "",
    document_type: "LAB_REPORT",
    title: "",
    file: null,
    description: "",
    status: "ACTIVE",
  });

  const [existingFile, setExistingFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        setInitialLoading(true);
        setError("");

        const membersResponse = await getMembers();

        const membersData = Array.isArray(membersResponse)
          ? membersResponse
          : membersResponse?.results || membersResponse?.members || [];

        setMembers(membersData);

        const recordsResponse = await getHealthRecords();

        const recordsData = Array.isArray(recordsResponse)
          ? recordsResponse
          : recordsResponse?.results || recordsResponse?.records || [];

        setRecords(recordsData);

        if (isEditMode) {
          const document = await getRecordDocument(id);

          setFormData({
            member: document.member || "",
            record: document.record || "",
            document_type:
              document.document_type || "LAB_REPORT",
            title: document.title || "",
            file: null,
            description: document.description || "",
            status: document.status || "ACTIVE",
          });

          setExistingFile(document.file || "");
        }
      } catch (err) {
        console.error("Record Document Form Error:", err);

        setError(
          err?.response?.data?.detail ||
            "Failed to load record document data."
        );
      } finally {
        setInitialLoading(false);
      }
    };

    loadData();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;

    setFormData((prev) => ({
      ...prev,
      file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.member) {
      setError("Please select a member.");
      return;
    }

    if (!formData.record) {
      setError("Please select a health record.");
      return;
    }

    if (!formData.title.trim()) {
      setError("Please enter a document title.");
      return;
    }

    if (!isEditMode && !formData.file) {
      setError("Please select a file.");
      return;
    }

    try {
      setLoading(true);

      const payload = new FormData();

      payload.append("member", formData.member);
      payload.append("record", formData.record);
      payload.append("document_type", formData.document_type);
      payload.append("title", formData.title.trim());
      payload.append("description", formData.description || "");
      payload.append("status", formData.status);

      if (formData.file) {
        payload.append("file", formData.file);
      }

      if (isEditMode) {
        await updateRecordDocument(id, payload);
      } else {
        await createRecordDocument(payload);
      }

      navigate("/record-documents");
    } catch (err) {
      console.error("Save Record Document Error:", err);

      const responseData = err?.response?.data;

      if (typeof responseData === "object") {
        const messages = Object.entries(responseData)
          .map(([field, message]) => {
            const value = Array.isArray(message)
              ? message.join(", ")
              : message;

            return `${field}: ${value}`;
          })
          .join("\n");

        setError(messages || "Failed to save record document.");
      } else {
        setError("Failed to save record document.");
      }
    } finally {
      setLoading(false);
    }
  };

  const selectedMemberId = formData.member;

  const filteredRecords = selectedMemberId
    ? records.filter(
        (record) =>
          String(record.member) === String(selectedMemberId)
      )
    : records;

  if (initialLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#7A7A7A]">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading document...</span>
        </div>
      </div>
    );
  }

  if (
    !isEditMode &&
    !canAdd(permissions, "record_documents")
  ) {
    return (
      <div className="p-6">
        <div className="bg-white border border-red-200 rounded-xl p-6 text-red-600">
          You do not have permission to add record documents.
        </div>
      </div>
    );
  }

  if (
    isEditMode &&
    !canEdit(permissions, "record_documents")
  ) {
    return (
      <div className="p-6">
        <div className="bg-white border border-red-200 rounded-xl p-6 text-red-600">
          You do not have permission to edit record documents.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#F2F2F2] min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate("/record-documents")}
          className="flex items-center gap-2 text-[#7A7A7A] hover:text-[#2F6FED] mb-3 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Record Documents
        </button>

        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#D9F7E8] flex items-center justify-center">
            <FileUp className="w-6 h-6 text-[#2F6FED]" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-[#212121]">
              {isEditMode
                ? "Edit Record Document"
                : "Add Record Document"}
            </h1>

            <p className="text-sm text-[#7A7A7A] mt-1">
              {isEditMode
                ? "Update medical record document"
                : "Upload a new medical record document"}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm"
      >
        <div className="p-6">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600 whitespace-pre-line">
                {error}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Member */}
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-2">
                Member <span className="text-red-500">*</span>
              </label>

              <select
                name="member"
                value={formData.member}
                onChange={(e) => {
                  handleChange(e);

                  setFormData((prev) => ({
                    ...prev,
                    member: e.target.value,
                    record: "",
                  }));
                }}
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
              >
                <option value="">Select Member</option>

                {members.map((member) => (
                  <option
                    key={member.id}
                    value={member.id}
                  >
                    {member.member_id} - {member.full_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Health Record */}
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-2">
                Health Record <span className="text-red-500">*</span>
              </label>

              <select
                name="record"
                value={formData.record}
                onChange={handleChange}
                disabled={!formData.member}
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm bg-white disabled:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
              >
                <option value="">
                  {formData.member
                    ? "Select Health Record"
                    : "Select Member First"}
                </option>

                {filteredRecords.map((record) => (
                  <option
                    key={record.id}
                    value={record.id}
                  >
                    {record.title}{" "}
                    {record.record_date
                      ? `(${record.record_date})`
                      : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Document Type */}
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-2">
                Document Type <span className="text-red-500">*</span>
              </label>

              <select
                name="document_type"
                value={formData.document_type}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
              >
                <option value="LAB_REPORT">
                  Lab Report
                </option>

                <option value="PRESCRIPTION">
                  Prescription
                </option>

                <option value="DISCHARGE_SUMMARY">
                  Discharge Summary
                </option>

                <option value="MEDICAL_CERTIFICATE">
                  Medical Certificate
                </option>

                <option value="DIAGNOSTIC_REPORT">
                  Diagnostic Report
                </option>

                <option value="OTHER">
                  Other
                </option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-[#212121] mb-2">
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
              >
                <option value="ACTIVE">Active</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>

            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#212121] mb-2">
                Document Title{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter document title"
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
              />
            </div>

            {/* File */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#212121] mb-2">
                Document File{" "}
                {!isEditMode && (
                  <span className="text-red-500">*</span>
                )}
              </label>

              {isEditMode && existingFile && (
                <div className="mb-3 bg-[#EEF4FF] border border-[#D7E4FF] rounded-lg p-3">
                  <p className="text-xs text-[#7A7A7A] mb-1">
                    Current File
                  </p>

                  <a
                    href={existingFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#2F6FED] hover:underline break-all"
                  >
                    View Current Document
                  </a>
                </div>
              )}

              <input
                type="file"
                onChange={handleFileChange}
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm bg-white file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:bg-[#EEF4FF] file:text-[#2F6FED] file:font-medium"
              />

              {formData.file && (
                <p className="text-xs text-[#7A7A7A] mt-2">
                  Selected: {formData.file.name}
                </p>
              )}

              {isEditMode && (
                <p className="text-xs text-[#7A7A7A] mt-2">
                  Leave empty to keep the existing file.
                </p>
              )}
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
                rows="4"
                placeholder="Enter document description"
                className="w-full px-3 py-2.5 border border-[#E5E7EB] rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E5E7EB] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/record-documents")}
            className="px-4 py-2.5 border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#212121] hover:bg-[#F8F9FA] transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#2F6FED] text-white rounded-lg text-sm font-medium hover:bg-[#2459C7] disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {isEditMode ? "Update Document" : "Save Document"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecordDocumentForm;
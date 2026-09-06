import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  ExternalLink,
  FileText,
  Loader2,
} from "lucide-react";

import { getRecordDocument } from "../../services/recordDocumentService";
import { useAuth } from "../../context/AuthContext";
import { canEdit } from "../../utils/permission";

const RecordDocumentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { permissions } = useAuth();

  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDocument = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getRecordDocument(id);

        setDocument(response);
      } catch (err) {
        console.error("Record Document Details Error:", err);

        setError(
          err?.response?.data?.detail ||
            "Failed to load record document details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadDocument();
    }
  }, [id]);

  const formatDocumentType = (type) => {
    if (!type) return "N/A";

    return type
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";

      case "ARCHIVED":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#7A7A7A]">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading document...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate("/record-documents")}
          className="flex items-center gap-2 text-[#2F6FED] hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Record Documents
        </button>

        <div className="bg-white border border-red-200 rounded-xl p-6 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="p-6">
        <button
          onClick={() => navigate("/record-documents")}
          className="flex items-center gap-2 text-[#2F6FED] hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Record Documents
        </button>

        <div className="bg-white border border-[#E5E7EB] rounded-xl p-6 text-[#7A7A7A]">
          Record document not found.
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#F2F2F2] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <button
            onClick={() => navigate("/record-documents")}
            className="flex items-center gap-2 text-[#7A7A7A] hover:text-[#2F6FED] mb-3 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Record Documents
          </button>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#D9F7E8] flex items-center justify-center">
              <FileText className="w-6 h-6 text-[#2F6FED]" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-[#212121]">
                Document Details
              </h1>

              <p className="text-sm text-[#7A7A7A] mt-1">
                {document.document_id || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {canEdit(permissions, "record_documents") && (
          <button
            onClick={() =>
              navigate(
                `/record-documents/${document.id}/edit`
              )
            }
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2F6FED] text-white rounded-lg hover:bg-[#2459C7] transition"
          >
            <Edit className="w-4 h-4" />
            Edit Document
          </button>
        )}
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] shadow-sm overflow-hidden">
        {/* Title */}
        <div className="px-6 py-5 border-b border-[#E5E7EB] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-[#212121]">
              {document.title || "N/A"}
            </h2>

            <p className="text-sm text-[#7A7A7A] mt-1">
              Document ID: {document.document_id || "N/A"}
            </p>
          </div>

          <span
            className={`inline-flex w-fit px-3 py-1.5 rounded-full text-sm font-medium ${getStatusStyle(
              document.status
            )}`}
          >
            {document.status || "N/A"}
          </span>
        </div>

        {/* Document Information */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-[#212121] mb-4">
            Document Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <InfoItem
              label="Document ID"
              value={document.document_id}
            />

            <InfoItem
              label="Document Type"
              value={formatDocumentType(
                document.document_type
              )}
            />

            <InfoItem
              label="Status"
              value={document.status}
            />

            <InfoItem
              label="Uploaded At"
              value={formatDateTime(
                document.uploaded_at
              )}
            />

            <InfoItem
              label="Updated At"
              value={formatDateTime(
                document.updated_at
              )}
            />
          </div>
        </div>

        {/* Member Information */}
        <div className="px-6 py-6 border-t border-[#E5E7EB]">
          <h3 className="text-lg font-semibold text-[#212121] mb-4">
            Member Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InfoItem
              label="Member ID"
              value={document.member_id}
            />

            <InfoItem
              label="Member Name"
              value={document.member_name}
            />
          </div>
        </div>

        {/* Health Record Information */}
        <div className="px-6 py-6 border-t border-[#E5E7EB]">
          <h3 className="text-lg font-semibold text-[#212121] mb-4">
            Health Record
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <InfoItem
              label="Record ID"
              value={document.record_id}
            />

            <InfoItem
              label="Record Type"
              value={formatDocumentType(
                document.record_type
              )}
            />

            <InfoItem
              label="Record Title"
              value={document.record_title}
            />
          </div>
        </div>

        {/* Description */}
        <div className="px-6 py-6 border-t border-[#E5E7EB]">
          <h3 className="text-lg font-semibold text-[#212121] mb-4">
            Description
          </h3>

          <div className="bg-[#F2F2F2] rounded-lg p-4 min-h-[100px]">
            <p className="text-sm text-[#212121] whitespace-pre-wrap">
              {document.description ||
                "No description available."}
            </p>
          </div>
        </div>

        {/* File */}
        <div className="px-6 py-6 border-t border-[#E5E7EB]">
          <h3 className="text-lg font-semibold text-[#212121] mb-4">
            Document File
          </h3>

          {document.file ? (
            <div className="flex items-center justify-between gap-4 bg-[#EEF4FF] border border-[#D7E4FF] rounded-lg p-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-[#2F6FED]" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#212121]">
                    Uploaded Document
                  </p>

                  <p className="text-xs text-[#7A7A7A] truncate">
                    {document.file}
                  </p>
                </div>
              </div>

              <a
                href={document.file}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-[#2F6FED] text-white rounded-lg text-sm font-medium hover:bg-[#2459C7] transition shrink-0"
              >
                <ExternalLink className="w-4 h-4" />
                Open
              </a>
            </div>
          ) : (
            <div className="bg-[#F2F2F2] rounded-lg p-4 text-sm text-[#7A7A7A]">
              No document file available.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const InfoItem = ({ label, value }) => {
  return (
    <div>
      <p className="text-xs font-medium text-[#7A7A7A] mb-1">
        {label}
      </p>

      <p className="text-sm font-medium text-[#212121] break-words">
        {value || "N/A"}
      </p>
    </div>
  );
};

export default RecordDocumentDetails;
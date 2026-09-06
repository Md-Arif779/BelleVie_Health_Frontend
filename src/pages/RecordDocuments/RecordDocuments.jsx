import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  FileText,
  Loader2,
} from "lucide-react";

import {
  getRecordDocuments,
  deleteRecordDocument,
} from "../../services/recordDocumentService";

import { useAuth } from "../../context/AuthContext";
import {
  canAdd,
  canEdit,
  canDelete,
} from "../../utils/permission";

const RecordDocuments = () => {
  const navigate = useNavigate();

  const { permissions } = useAuth();

  const [documents, setDocuments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getRecordDocuments();

      const data = Array.isArray(response)
        ? response
        : response?.results || response?.documents || [];

      setDocuments(data);
    } catch (err) {
      console.error("Record Documents Error:", err);

      setError(
        err?.response?.data?.detail ||
          "Failed to load record documents."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmed) return;

    try {
      await deleteRecordDocument(id);

      setDocuments((prev) =>
        prev.filter((document) => document.id !== id)
      );
    } catch (err) {
      console.error("Delete Record Document Error:", err);

      alert(
        err?.response?.data?.detail ||
          "Failed to delete record document."
      );
    }
  };

  const filteredDocuments = documents.filter((document) => {
    const searchText = search.toLowerCase();

    return (
      document.document_id
        ?.toLowerCase()
        .includes(searchText) ||
      document.title
        ?.toLowerCase()
        .includes(searchText) ||
      document.member_id
        ?.toLowerCase()
        .includes(searchText) ||
      document.member_name
        ?.toLowerCase()
        .includes(searchText) ||
      document.record_title
        ?.toLowerCase()
        .includes(searchText)
    );
  });

  const formatDocumentType = (type) => {
    if (!type) return "N/A";

    return type
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
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
          <span>Loading record documents...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-[#F2F2F2] min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#D9F7E8] flex items-center justify-center">
              <FileText className="w-6 h-6 text-[#2F6FED]" />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-[#212121]">
                Record Documents
              </h1>

              <p className="text-sm text-[#7A7A7A] mt-1">
                Manage member medical record documents
              </p>
            </div>
          </div>
        </div>

        {canAdd(permissions, "record_documents") && (
          <button
            onClick={() =>
              navigate("/record-documents/add")
            }
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#2F6FED] text-white rounded-lg hover:bg-[#2459C7] transition"
          >
            <Plus className="w-4 h-4" />
            Add Document
          </button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A7A7A]" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search document, member or record..."
            className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-white border border-red-200 rounded-xl p-5 mb-6 text-red-600">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F8F9FA] border-b border-[#E5E7EB]">
              <tr>
                <th className="text-left px-6 py-4 text-xs font-semibold text-[#7A7A7A] uppercase">
                  Document ID
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold text-[#7A7A7A] uppercase">
                  Title
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold text-[#7A7A7A] uppercase">
                  Member
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold text-[#7A7A7A] uppercase">
                  Record
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold text-[#7A7A7A] uppercase">
                  Type
                </th>

                <th className="text-left px-6 py-4 text-xs font-semibold text-[#7A7A7A] uppercase">
                  Status
                </th>

                <th className="text-right px-6 py-4 text-xs font-semibold text-[#7A7A7A] uppercase">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-[#7A7A7A]"
                  >
                    {search
                      ? "No matching documents found."
                      : "No record documents available."}
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((document) => (
                  <tr
                    key={document.id}
                    className="border-b border-[#E5E7EB] last:border-b-0 hover:bg-[#F8F9FA] transition"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-[#212121]">
                        {document.document_id || "N/A"}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-[#212121]">
                        {document.title || "N/A"}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-[#212121]">
                        {document.member_name || "N/A"}
                      </p>

                      <p className="text-xs text-[#7A7A7A] mt-1">
                        {document.member_id || ""}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <p className="text-sm text-[#212121]">
                        {document.record_title || "N/A"}
                      </p>

                      <p className="text-xs text-[#7A7A7A] mt-1">
                        {document.record_type
                          ? formatDocumentType(
                              document.record_type
                            )
                          : ""}
                      </p>
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-sm text-[#212121]">
                        {formatDocumentType(
                          document.document_type
                        )}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                          document.status
                        )}`}
                      >
                        {document.status || "N/A"}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() =>
                            navigate(
                              `/record-documents/${document.id}`
                            )
                          }
                          title="View"
                          className="p-2 rounded-lg text-[#2F6FED] hover:bg-[#EEF4FF] transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {canEdit(
                          permissions,
                          "record_documents"
                        ) && (
                          <button
                            onClick={() =>
                              navigate(
                                `/record-documents/${document.id}/edit`
                              )
                            }
                            title="Edit"
                            className="p-2 rounded-lg text-[#2F6FED] hover:bg-[#EEF4FF] transition"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}

                        {canDelete(
                          permissions,
                          "record_documents"
                        ) && (
                          <button
                            onClick={() =>
                              handleDelete(document.id)
                            }
                            title="Delete"
                            className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecordDocuments;
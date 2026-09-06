import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  FileText,
} from "lucide-react";

import {
  getHealthRecords,
  deleteHealthRecord,
} from "../../services/healthRecordService";

import { useAuth } from "../../context/AuthContext";
import {
  canAdd,
  canEdit,
  canDelete,
} from "../../utils/permission";

const HealthRecords = () => {
  const navigate = useNavigate();

  const { permissions } = useAuth();

  const [records, setRecords] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const canAddRecord = canAdd(
    permissions,
    "health_records"
  );

  const canEditRecord = canEdit(
    permissions,
    "health_records"
  );

  const canDeleteRecord = canDelete(
    permissions,
    "health_records"
  );

  const loadRecords = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getHealthRecords();

      const results = Array.isArray(data)
        ? data
        : data?.results || [];

      setRecords(results);
    } catch (err) {
      console.error(
        "Health Records Error:",
        err
      );

      setError(
        err?.response?.data?.detail ||
          "Failed to load health records."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  const filteredRecords = records.filter((record) => {
    const keyword = search
      .trim()
      .toLowerCase();

    if (!keyword) {
      return true;
    }

    return (
      record.title
        ?.toLowerCase()
        .includes(keyword) ||
      record.record_type
        ?.toLowerCase()
        .includes(keyword) ||
      record.member_name
        ?.toLowerCase()
        .includes(keyword) ||
      record.member_id
        ?.toLowerCase()
        .includes(keyword) ||
      record.doctor_name
        ?.toLowerCase()
        .includes(keyword)
    );
  });

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this health record?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteHealthRecord(id);

      setRecords((previous) =>
        previous.filter(
          (record) => record.id !== id
        )
      );
    } catch (err) {
      console.error(
        "Health Record Delete Error:",
        err
      );

      alert(
        err?.response?.data?.detail ||
          "Failed to delete health record."
      );
    }
  };

  const getMemberName = (record) => {
    return (
      record.member_name ||
      record.member?.full_name ||
      record.member ||
      "-"
    );
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-GB"
    );
  };

  const formatRecordType = (type) => {
    if (!type) {
      return "-";
    }

    return type
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[#7A7A7A]">
          Loading health records...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-[#EEF4FF] flex items-center justify-center">
            <FileText
              size={23}
              className="text-[#2F6FED]"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#212121]">
              Health Records
            </h1>

            <p className="text-sm text-[#7A7A7A] mt-1">
              Manage member medical records
            </p>
          </div>

        </div>

        {canAddRecord && (
          <button
            type="button"
            onClick={() =>
              navigate("/health-records/add")
            }
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#2F6FED] text-white text-sm font-medium hover:bg-[#2459C7]"
          >
            <Plus size={17} />
            Add Health Record
          </button>
        )}

      </div>


      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-[#DC2626]">
          {error}
        </div>
      )}


      {/* Search */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl p-4 shadow-sm mb-5">

        <div className="relative max-w-md">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]"
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search records..."
            className="w-full h-11 pl-10 pr-4 rounded-lg border border-[#E5E7EB] bg-white text-sm text-[#212121] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
          />

        </div>

      </div>


      {/* Table */}
      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>
              <tr className="bg-[#F2F2F2] border-b border-[#E5E7EB]">

                <th className="px-5 py-3 text-left text-xs font-semibold text-[#7A7A7A]">
                  Member
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold text-[#7A7A7A]">
                  Record Type
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold text-[#7A7A7A]">
                  Title
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold text-[#7A7A7A]">
                  Record Date
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold text-[#7A7A7A]">
                  Doctor
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold text-[#7A7A7A]">
                  Actions
                </th>

              </tr>
            </thead>

            <tbody>

              {filteredRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center text-sm text-[#7A7A7A]"
                  >
                    No health records found.
                  </td>
                </tr>
              ) : (
                filteredRecords.map(
                  (record) => (
                    <tr
                      key={record.id}
                      className="border-b border-[#E5E7EB] last:border-b-0 hover:bg-[#F8FAFC]"
                    >

                      <td className="px-5 py-4">

                        <div className="font-medium text-sm text-[#212121]">
                          {getMemberName(record)}
                        </div>

                        <div className="text-xs text-[#7A7A7A] mt-1">
                          {record.member_id || "-"}
                        </div>

                      </td>

                      <td className="px-5 py-4 text-sm text-[#212121]">
                        {formatRecordType(
                          record.record_type
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-[#212121]">
                        {record.title || "-"}
                      </td>

                      <td className="px-5 py-4 text-sm text-[#212121]">
                        {formatDate(
                          record.record_date
                        )}
                      </td>

                      <td className="px-5 py-4 text-sm text-[#212121]">
                        {record.doctor_name || "-"}
                      </td>

                      <td className="px-5 py-4">

                        <div className="flex items-center justify-end gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/health-records/${record.id}`
                              )
                            }
                            className="w-9 h-9 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#7A7A7A] hover:text-[#2F6FED] hover:bg-[#EEF4FF]"
                            title="View"
                          >
                            <Eye size={17} />
                          </button>

                          {canEditRecord && (
                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/health-records/${record.id}/edit`
                                )
                              }
                              className="w-9 h-9 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#7A7A7A] hover:text-[#2F6FED] hover:bg-[#EEF4FF]"
                              title="Edit"
                            >
                              <Edit size={17} />
                            </button>
                          )}

                          {canDeleteRecord && (
                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  record.id
                                )
                              }
                              className="w-9 h-9 rounded-lg border border-[#E5E7EB] flex items-center justify-center text-[#7A7A7A] hover:text-[#DC2626] hover:bg-red-50"
                              title="Delete"
                            >
                              <Trash2 size={17} />
                            </button>
                          )}

                        </div>

                      </td>

                    </tr>
                  )
                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default HealthRecords;
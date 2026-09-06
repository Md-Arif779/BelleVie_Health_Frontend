import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Pencil,
  Eye,
  Trash2,
  FlaskConical,
  Loader2,
  ClipboardCheck,
} from "lucide-react";

import {
  getLabResults,
  deleteLabResult,
} from "../../services/labResultService";

import { useAuth } from "../../context/AuthContext";
import {
  canAdd,
  canEdit,
  canDelete,
} from "../../utils/permission";

const statusLabels = {
  PENDING: "Pending",
  COMPLETED: "Completed",
  REVIEWED: "Reviewed",
};

const getStatusClass = (status) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-700";
    case "REVIEWED":
      return "bg-blue-100 text-blue-700";
    case "PENDING":
    default:
      return "bg-yellow-100 text-yellow-700";
  }
};

const getMemberName = (result) => {
  return (
    result?.member_name ||
    result?.member?.full_name ||
    result?.member?.name ||
    "-"
  );
};

const getMemberId = (result) => {
  return (
    result?.member_id ||
    result?.member?.member_id ||
    "-"
  );
};

const getDiagnosticCenterName = (result) => {
  return (
    result?.diagnostic_center_name ||
    result?.diagnostic_center?.name ||
    result?.diagnostic_center?.center_name ||
    "-"
  );
};

const formatDate = (date) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toLocaleDateString();
};

function LabResultList() {
  const navigate = useNavigate();

  const { permissions } = useAuth();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadResults = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getLabResults();

      const resultList = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
        ? data.results
        : [];

      setResults(resultList);
    } catch (err) {
      console.error("Lab Results Error:", err);

      setError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Failed to load lab results."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResults();
  }, []);

  const filteredResults = useMemo(() => {
    const searchValue = search.trim().toLowerCase();

    return results.filter((result) => {
      const matchesSearch =
        !searchValue ||
        String(
          result?.result_id || ""
        )
          .toLowerCase()
          .includes(searchValue) ||
        String(getMemberName(result))
          .toLowerCase()
          .includes(searchValue) ||
        String(getMemberId(result))
          .toLowerCase()
          .includes(searchValue) ||
        String(result?.test_name || "")
          .toLowerCase()
          .includes(searchValue) ||
        String(getDiagnosticCenterName(result))
          .toLowerCase()
          .includes(searchValue) ||
        String(result?.result_value || "")
          .toLowerCase()
          .includes(searchValue);

      const matchesStatus =
        statusFilter === "ALL" ||
        result?.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [results, search, statusFilter]);

  const totalResults = results.length;

  const pendingResults = results.filter(
    (result) => result.status === "PENDING"
  ).length;

  const completedResults = results.filter(
    (result) => result.status === "COMPLETED"
  ).length;

  const reviewedResults = results.filter(
    (result) => result.status === "REVIEWED"
  ).length;

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lab result?"
    );

    if (!confirmed) return;

    try {
      await deleteLabResult(id);

      setResults((currentResults) =>
        currentResults.filter(
          (result) => result.id !== id
        )
      );
    } catch (err) {
      console.error(
        "Delete Lab Result Error:",
        err
      );

      window.alert(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          "Failed to delete lab result."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D9F7E8]">
              <FlaskConical
                size={23}
                className="text-[#2F6FED]"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#212121]">
                Lab Results
              </h1>

              <p className="text-sm text-[#7A7A7A]">
                Manage diagnostic test results
              </p>
            </div>
          </div>
        </div>

        {canAdd(permissions, "lab_results") && (
          <Link
            to="/lab-results/add"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2F6FED] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2459C7]"
          >
            <Plus size={18} />
            Add Lab Result
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#7A7A7A]">
                Total Results
              </p>

              <p className="mt-2 text-2xl font-bold text-[#212121]">
                {totalResults}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#EEF4FF]">
              <FlaskConical
                size={21}
                className="text-[#2F6FED]"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#7A7A7A]">
                Pending
              </p>

              <p className="mt-2 text-2xl font-bold text-[#F59E0B]">
                {pendingResults}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-yellow-50">
              <Loader2
                size={21}
                className="text-[#F59E0B]"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#7A7A7A]">
                Completed
              </p>

              <p className="mt-2 text-2xl font-bold text-[#16A34A]">
                {completedResults}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50">
              <ClipboardCheck
                size={21}
                className="text-[#16A34A]"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#7A7A7A]">
                Reviewed
              </p>

              <p className="mt-2 text-2xl font-bold text-[#2F6FED]">
                {reviewedResults}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#EEF4FF]">
              <ClipboardCheck
                size={21}
                className="text-[#2F6FED]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-5 rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]"
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search result ID, member, test, diagnostic center..."
              className="w-full rounded-lg border border-[#E5E7EB] bg-white py-2.5 pl-10 pr-4 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#212121] outline-none focus:border-[#2F6FED]"
          >
            <option value="ALL">
              All Statuses
            </option>

            <option value="PENDING">
              Pending
            </option>

            <option value="COMPLETED">
              Completed
            </option>

            <option value="REVIEWED">
              Reviewed
            </option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-[1100px] w-full">
            <thead className="bg-[#F9FAFB]">
              <tr className="border-b border-[#E5E7EB]">
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                  Result ID
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                  Member
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                  Test
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                  Diagnostic Center
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                  Result
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                  Date
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-12 text-center"
                  >
                    <div className="flex items-center justify-center gap-2 text-sm text-[#7A7A7A]">
                      <Loader2
                        size={19}
                        className="animate-spin"
                      />
                      Loading lab results...
                    </div>
                  </td>
                </tr>
              ) : filteredResults.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-5 py-12 text-center"
                  >
                    <div className="flex flex-col items-center">
                      <FlaskConical
                        size={35}
                        className="text-[#7A7A7A]"
                      />

                      <p className="mt-3 text-sm font-medium text-[#212121]">
                        No lab results found
                      </p>

                      <p className="mt-1 text-xs text-[#7A7A7A]">
                        Try changing your search or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredResults.map((result) => (
                  <tr
                    key={result.id}
                    className="border-b border-[#E5E7EB] last:border-b-0 hover:bg-[#FAFAFA]"
                  >
                    <td className="px-5 py-4">
                      <span className="font-semibold text-[#2F6FED]">
                        {result.result_id ||
                          `#${result.id}`}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-[#212121]">
                          {getMemberName(result)}
                        </p>

                        <p className="mt-0.5 text-xs text-[#7A7A7A]">
                          {getMemberId(result)}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-medium text-[#212121]">
                        {result.test_name || "-"}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-sm text-[#212121]">
                      {getDiagnosticCenterName(
                        result
                      )}
                    </td>

                    <td className="max-w-[180px] px-5 py-4">
                      <p className="truncate text-sm font-medium text-[#212121]">
                        {result.result_value || "-"}
                      </p>

                      {result.unit && (
                        <p className="mt-0.5 text-xs text-[#7A7A7A]">
                          {result.unit}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#212121]">
                      {formatDate(
                        result.result_date
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                          result.status
                        )}`}
                      >
                        {statusLabels[
                          result.status
                        ] ||
                          result.status ||
                          "-"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/lab-results/${result.id}`}
                          title="View"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#2F6FED] transition hover:bg-[#EEF4FF]"
                        >
                          <Eye size={17} />
                        </Link>

                        {canEdit(
                          permissions,
                          "lab_results"
                        ) && (
                          <Link
                            to={`/lab-results/${result.id}/edit`}
                            title="Edit"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#F59E0B] transition hover:bg-yellow-50"
                          >
                            <Pencil size={17} />
                          </Link>
                        )}

                        {canDelete(
                          permissions,
                          "lab_results"
                        ) && (
                          <button
                            type="button"
                            title="Delete"
                            onClick={() =>
                              handleDelete(
                                result.id
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#DC2626] transition hover:bg-red-50"
                          >
                            <Trash2 size={17} />
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
}

export default LabResultList;
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  Eye,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Trash2,
} from "lucide-react";

import {
  getDiagnosticCenters,
  deleteDiagnosticCenter,
} from "../../services/diagnosticService";

import { useAuth } from "../../context/AuthContext";
import {
  canAdd,
  canEdit,
  canDelete,
} from "../../utils/permission";

const DiagnosticCenters = () => {
  const { permissions } = useAuth();

  const [centers, setCenters] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCenters = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDiagnosticCenters();

      setCenters(
        Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : []
      );
    } catch (err) {
      console.error("Diagnostic Centers Error:", err);

      setError(
        err?.response?.data?.detail ||
          "Failed to load diagnostic centers."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCenters();
  }, []);

  const filteredCenters = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return centers;
    }

    return centers.filter((center) =>
      [
        center.diagnostic_id,
        center.name,
        center.location,
        center.phone,
        center.email,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(keyword)
        )
    );
  }, [centers, search]);

  const totalCenters = centers.length;

  const activeCenters = centers.filter(
    (center) => center.status === "ACTIVE"
  ).length;

  const inactiveCenters = centers.filter(
    (center) => center.status === "INACTIVE"
  ).length;

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this diagnostic center?"
    );

    if (!confirmed) return;

    try {
      await deleteDiagnosticCenter(id);

      setCenters((prev) =>
        prev.filter((center) => center.id !== id)
      );
    } catch (err) {
      console.error("Delete Diagnostic Center Error:", err);

      alert(
        err?.response?.data?.detail ||
          "Failed to delete diagnostic center."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF4FF]">
              <Activity className="h-6 w-6 text-[#2F6FED]" />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#212121]">
                Diagnostic Centers
              </h1>

              <p className="text-sm text-[#7A7A7A]">
                Manage diagnostic centers and laboratory services
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={loadCenters}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-medium text-[#212121] transition hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                loading ? "animate-spin" : ""
              }`}
            />
            Refresh
          </button>

          {canAdd(permissions, "diagnostic_centers") && (
            <Link
              to="/diagnostics/add"
              className="flex items-center gap-2 rounded-lg bg-[#2F6FED] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2459C7]"
            >
              <Plus className="h-4 w-4" />
              Add Diagnostic Center
            </Link>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#7A7A7A]">
            Total Centers
          </p>

          <p className="mt-2 text-2xl font-bold text-[#212121]">
            {totalCenters}
          </p>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#7A7A7A]">
            Active Centers
          </p>

          <p className="mt-2 text-2xl font-bold text-[#16A34A]">
            {activeCenters}
          </p>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#7A7A7A]">
            Inactive Centers
          </p>

          <p className="mt-2 text-2xl font-bold text-[#DC2626]">
            {inactiveCenters}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-5 rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#7A7A7A]" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, name, location, phone or email..."
            className="w-full rounded-lg border border-[#E5E7EB] py-3 pl-10 pr-4 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-[#DC2626]">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <RefreshCw className="mx-auto h-8 w-8 animate-spin text-[#2F6FED]" />
              <p className="mt-3 text-sm text-[#7A7A7A]">
                Loading diagnostic centers...
              </p>
            </div>
          </div>
        ) : filteredCenters.length === 0 ? (
          <div className="flex min-h-[300px] items-center justify-center px-6">
            <div className="text-center">
              <Activity className="mx-auto h-10 w-10 text-[#7A7A7A]" />

              <h3 className="mt-3 text-lg font-semibold text-[#212121]">
                No diagnostic centers found
              </h3>

              <p className="mt-1 text-sm text-[#7A7A7A]">
                {search
                  ? "Try a different search term."
                  : "No diagnostic centers have been added yet."}
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Diagnostic ID
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Center
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Location
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Contact
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-[#E5E7EB]">
                {filteredCenters.map((center) => (
                  <tr
                    key={center.id}
                    className="transition hover:bg-[#F9FAFB]"
                  >
                    <td className="px-5 py-4 text-sm font-semibold text-[#2F6FED]">
                      {center.diagnostic_id || "-"}
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#212121]">
                        {center.name || "-"}
                      </p>

                      {center.address && (
                        <p className="mt-1 max-w-[250px] truncate text-xs text-[#7A7A7A]">
                          {center.address}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#212121]">
                      {center.location || "-"}
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm text-[#212121]">
                        {center.phone || "-"}
                      </p>

                      <p className="mt-1 text-xs text-[#7A7A7A]">
                        {center.email || "-"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          center.status === "ACTIVE"
                            ? "bg-green-100 text-[#16A34A]"
                            : "bg-red-100 text-[#DC2626]"
                        }`}
                      >
                        {center.status || "UNKNOWN"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/diagnostics/${center.id}`}
                          title="View"
                          className="rounded-lg border border-[#E5E7EB] p-2 text-[#7A7A7A] transition hover:border-[#2F6FED] hover:text-[#2F6FED]"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>

                        {canEdit(
                          permissions,
                          "diagnostic_centers"
                        ) && (
                          <Link
                            to={`/diagnostics/${center.id}/edit`}
                            title="Edit"
                            className="rounded-lg border border-[#E5E7EB] p-2 text-[#7A7A7A] transition hover:border-[#2F6FED] hover:text-[#2F6FED]"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                        )}

                        {canDelete(
                          permissions,
                          "diagnostic_centers"
                        ) && (
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(center.id)
                            }
                            title="Delete"
                            className="rounded-lg border border-[#E5E7EB] p-2 text-[#7A7A7A] transition hover:border-red-500 hover:text-[#DC2626]"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosticCenters;
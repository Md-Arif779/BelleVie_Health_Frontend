import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  CheckCircle,
  Edit,
  Eye,
  Loader2,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";

import { getPharmacies, deletePharmacy } from "../../services/pharmacyService";
import { useAuth } from "../../context/AuthContext";
import {
  canAdd,
  canEdit,
  canDelete,
} from "../../utils/permission";

const Pharmacies = () => {
  const { permissions } = useAuth();

  const [pharmacies, setPharmacies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPharmacies = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPharmacies();

      const pharmacyList = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
        ? data.results
        : [];

      setPharmacies(pharmacyList);
    } catch (err) {
      console.error("Pharmacies Error:", err);

      setError(
        err?.response?.data?.detail ||
          "Failed to load pharmacies."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPharmacies();
  }, []);

  const filteredPharmacies = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return pharmacies;
    }

    return pharmacies.filter((pharmacy) =>
      [
        pharmacy.pharmacy_id,
        pharmacy.name,
        pharmacy.location,
        pharmacy.phone,
        pharmacy.email,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(keyword)
        )
    );
  }, [pharmacies, search]);

  const totalPharmacies = pharmacies.length;

  const activePharmacies = pharmacies.filter(
    (pharmacy) => pharmacy.status === "ACTIVE"
  ).length;

  const inactivePharmacies = pharmacies.filter(
    (pharmacy) => pharmacy.status === "INACTIVE"
  ).length;

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deletePharmacy(id);

      setPharmacies((prev) =>
        prev.filter((pharmacy) => pharmacy.id !== id)
      );
    } catch (err) {
      console.error("Delete Pharmacy Error:", err);

      alert(
        err?.response?.data?.detail ||
          "Failed to delete pharmacy."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#212121]">
            Pharmacies
          </h1>

          <p className="mt-1 text-sm text-[#7A7A7A]">
            Manage BelleVie healthcare pharmacy providers.
          </p>
        </div>

        {canAdd(permissions, "pharmacies") && (
          <Link
            to="/pharmacies/add"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2F6FED] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2459C7]"
          >
            <Plus size={18} />
            Add Pharmacy
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#7A7A7A]">
                Total Pharmacies
              </p>

              <p className="mt-1 text-2xl font-bold text-[#212121]">
                {totalPharmacies}
              </p>
            </div>

            <div className="rounded-lg bg-[#EEF4FF] p-3 text-[#2F6FED]">
              <Building2 size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#7A7A7A]">
                Active
              </p>

              <p className="mt-1 text-2xl font-bold text-[#16A34A]">
                {activePharmacies}
              </p>
            </div>

            <div className="rounded-lg bg-[#D9F7E8] p-3 text-[#16A34A]">
              <CheckCircle size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#7A7A7A]">
                Inactive
              </p>

              <p className="mt-1 text-2xl font-bold text-[#DC2626]">
                {inactivePharmacies}
              </p>
            </div>

            <div className="rounded-lg bg-[#FEF2F2] p-3 text-[#DC2626]">
              <XCircle size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Search + Refresh */}
      <div className="mb-5 flex flex-col gap-3 rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pharmacy..."
            className="w-full rounded-lg border border-[#E5E7EB] bg-white py-2.5 pl-10 pr-4 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
          />
        </div>

        <button
          type="button"
          onClick={loadPharmacies}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm font-medium text-[#212121] transition hover:bg-[#F2F2F2] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-[#E5E7EB] bg-white">
          <div className="flex items-center gap-2 text-[#7A7A7A]">
            <Loader2 size={20} className="animate-spin" />
            Loading pharmacies...
          </div>
        </div>
      ) : filteredPharmacies.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-[#E5E7EB] bg-white px-6 text-center">
          <div className="mb-3 rounded-full bg-[#EEF4FF] p-4 text-[#2F6FED]">
            <Building2 size={28} />
          </div>

          <h3 className="text-lg font-semibold text-[#212121]">
            No pharmacies found
          </h3>

          <p className="mt-1 text-sm text-[#7A7A7A]">
            {search
              ? "Try a different search keyword."
              : "No pharmacy has been added yet."}
          </p>

          {!search &&
            canAdd(permissions, "pharmacies") && (
              <Link
                to="/pharmacies/add"
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#2F6FED] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2459C7]"
              >
                <Plus size={17} />
                Add Pharmacy
              </Link>
            )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Pharmacy ID
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Pharmacy
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Location
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Contact
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Delivery
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
                {filteredPharmacies.map((pharmacy) => (
                  <tr
                    key={pharmacy.id}
                    className="transition hover:bg-[#F8FAFC]"
                  >
                    <td className="whitespace-nowrap px-5 py-4 text-sm font-medium text-[#2F6FED]">
                      {pharmacy.pharmacy_id || "-"}
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-semibold text-[#212121]">
                        {pharmacy.name || "-"}
                      </p>

                      {pharmacy.email && (
                        <p className="mt-1 text-xs text-[#7A7A7A]">
                          {pharmacy.email}
                        </p>
                      )}
                    </td>

                    <td className="max-w-[220px] px-5 py-4 text-sm text-[#212121]">
                      {pharmacy.location || "-"}
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-sm text-[#212121]">
                        {pharmacy.phone || "-"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      {pharmacy.delivery_available ? (
                        <span className="inline-flex rounded-full bg-[#D9F7E8] px-2.5 py-1 text-xs font-semibold text-[#16A34A]">
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-[#F2F2F2] px-2.5 py-1 text-xs font-semibold text-[#7A7A7A]">
                          Not Available
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      {pharmacy.status === "ACTIVE" ? (
                        <span className="inline-flex rounded-full bg-[#D9F7E8] px-2.5 py-1 text-xs font-semibold text-[#16A34A]">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-[#FEF2F2] px-2.5 py-1 text-xs font-semibold text-[#DC2626]">
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/pharmacies/${pharmacy.id}`}
                          title="View"
                          className="rounded-lg p-2 text-[#2F6FED] transition hover:bg-[#EEF4FF]"
                        >
                          <Eye size={17} />
                        </Link>

                        {canEdit(
                          permissions,
                          "pharmacies"
                        ) && (
                          <Link
                            to={`/pharmacies/${pharmacy.id}/edit`}
                            title="Edit"
                            className="rounded-lg p-2 text-[#F59E0B] transition hover:bg-[#FFFBEB]"
                          >
                            <Edit size={17} />
                          </Link>
                        )}

                        {canDelete(
                          permissions,
                          "pharmacies"
                        ) && (
                          <button
                            type="button"
                            title="Delete"
                            onClick={() =>
                              handleDelete(
                                pharmacy.id,
                                pharmacy.name
                              )
                            }
                            className="rounded-lg p-2 text-[#DC2626] transition hover:bg-[#FEF2F2]"
                          >
                            <Trash2 size={17} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pharmacies;
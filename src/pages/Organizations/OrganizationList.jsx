
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Building2,
  RefreshCw,
} from "lucide-react";

import {
  getOrganizations,
  deleteOrganization,
} from "../../services/organizationService";


function OrganizationList() {
  const navigate = useNavigate();

  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [search, setSearch] = useState("");

  // =====================================================
  // LOAD ORGANIZATIONS
  // =====================================================

  const loadOrganizations = async () => {
    try {
      setLoading(true);

      const data = await getOrganizations();

      // DRF pagination support
      if (Array.isArray(data)) {
        setOrganizations(data);
      } else {
        setOrganizations(data.results || []);
      }
    } catch (error) {
      console.error(
        "Organization List Error:",
        error
      );

      setOrganizations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrganizations();
  }, []);

  // =====================================================
  // DELETE ORGANIZATION
  // =====================================================

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${name}"?`
    );

    if (!confirmed) return;

    try {
      setDeleting(id);

      await deleteOrganization(id);

      setOrganizations((prev) =>
        prev.filter(
          (organization) => organization.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete Organization Error:",
        error
      );

      alert(
        "Failed to delete organization."
      );
    } finally {
      setDeleting(null);
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredOrganizations =
    organizations.filter((organization) => {
      const searchText = search.toLowerCase();

      return (
        organization.organization_id
          ?.toLowerCase()
          .includes(searchText) ||
        organization.name
          ?.toLowerCase()
          .includes(searchText) ||
        organization.organization_type
          ?.toLowerCase()
          .includes(searchText) ||
        organization.contact_person
          ?.toLowerCase()
          .includes(searchText) ||
        organization.phone
          ?.toLowerCase()
          .includes(searchText)
      );
    });

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D9F7E8]">
              <Building2
                size={22}
                className="text-[#2F6FED]"
              />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-[#212121]">
                Organizations
              </h1>

              <p className="text-sm text-[#7A7A7A]">
                Manage organization information
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() =>
            navigate("/organizations/add")
          }
          className="flex items-center justify-center gap-2 rounded-lg bg-[#2F6FED] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90"
        >
          <Plus size={18} />
          Add Organization
        </button>
      </div>


      {/* =================================================
          SEARCH + REFRESH
      ================================================= */}

      <div className="mb-5 flex flex-col gap-3 rounded-xl border border-[#EEEEEE] bg-white p-4 shadow-sm sm:flex-row">

        <div className="relative flex-1">

          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]"
          />

          <input
            type="text"
            placeholder="Search organization..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-lg border border-[#EEEEEE] py-2.5 pl-10 pr-4 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED]"
          />

        </div>

        <button
          onClick={loadOrganizations}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg border border-[#EEEEEE] px-4 py-2.5 text-sm font-medium text-[#212121] transition hover:bg-[#F2F2F2] disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={
              loading
                ? "animate-spin"
                : ""
            }
          />

          Refresh
        </button>

      </div>


      {/* =================================================
          SUMMARY
      ================================================= */}

      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-xl border border-[#EEEEEE] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#7A7A7A]">
            Total Organizations
          </p>

          <h2 className="mt-1 text-2xl font-semibold text-[#212121]">
            {organizations.length}
          </h2>
        </div>

        <div className="rounded-xl border border-[#EEEEEE] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#7A7A7A]">
            Active
          </p>

          <h2 className="mt-1 text-2xl font-semibold text-[#212121]">
            {
              organizations.filter(
                (item) =>
                  item.status === "ACTIVE"
              ).length
            }
          </h2>
        </div>

        <div className="rounded-xl border border-[#EEEEEE] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#7A7A7A]">
            Inactive
          </p>

          <h2 className="mt-1 text-2xl font-semibold text-[#212121]">
            {
              organizations.filter(
                (item) =>
                  item.status === "INACTIVE"
              ).length
            }
          </h2>
        </div>

      </div>


      {/* =================================================
          TABLE
      ================================================= */}

      <div className="overflow-hidden rounded-xl border border-[#EEEEEE] bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

            <thead className="border-b border-[#EEEEEE] bg-[#F2F2F2]">

              <tr>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                  Organization ID
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                  Organization
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                  Type
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                  Contact Person
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                  Phone
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-[#EEEEEE]">

              {/* LOADING */}

              {loading && (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-12 text-center text-sm text-[#7A7A7A]"
                  >
                    Loading organizations...
                  </td>
                </tr>
              )}


              {/* EMPTY */}

              {!loading &&
                filteredOrganizations.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-12 text-center"
                    >

                      <Building2
                        size={40}
                        className="mx-auto mb-3 text-[#7A7A7A]"
                      />

                      <p className="text-sm font-medium text-[#212121]">
                        No organizations found
                      </p>

                      <p className="mt-1 text-xs text-[#7A7A7A]">
                        Add a new organization to get started.
                      </p>

                    </td>
                  </tr>
                )}


              {/* DATA */}

              {!loading &&
                filteredOrganizations.map(
                  (organization) => (
                    <tr
                      key={organization.id}
                      className="transition hover:bg-[#FAFAFA]"
                    >

                      {/* ID */}

                      <td className="px-5 py-4">

                        <span className="font-medium text-[#2F6FED]">
                          {organization.organization_id}
                        </span>

                      </td>


                      {/* NAME */}

                      <td className="px-5 py-4">

                        <div>
                          <p className="font-medium text-[#212121]">
                            {organization.name}
                          </p>

                          {organization.email && (
                            <p className="mt-1 text-xs text-[#7A7A7A]">
                              {organization.email}
                            </p>
                          )}
                        </div>

                      </td>


                      {/* TYPE */}

                      <td className="px-5 py-4 text-sm text-[#212121]">
                        {organization.organization_type ||
                          "-"}
                      </td>


                      {/* CONTACT */}

                      <td className="px-5 py-4 text-sm text-[#212121]">
                        {organization.contact_person ||
                          "-"}
                      </td>


                      {/* PHONE */}

                      <td className="px-5 py-4 text-sm text-[#212121]">
                        {organization.phone || "-"}
                      </td>


                      {/* STATUS */}

                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                            organization.status ===
                            "ACTIVE"
                              ? "bg-[#D9F7E8] text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {organization.status}
                        </span>

                      </td>


                      {/* ACTIONS */}

                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-2">

                          {/* VIEW */}

                          <button
                            onClick={() =>
                              navigate(
                                `/organizations/${organization.id}`
                              )
                            }
                            title="View"
                            className="rounded-lg p-2 text-[#2F6FED] transition hover:bg-[#D9F7E8]"
                          >
                            <Eye size={17} />
                          </button>


                          {/* EDIT */}

                          <button
                            onClick={() =>
                              navigate(
                                `/organizations/${organization.id}/edit`
                              )
                            }
                            title="Edit"
                            className="rounded-lg p-2 text-[#7A7A7A] transition hover:bg-[#F2F2F2]"
                          >
                            <Pencil size={17} />
                          </button>


                          {/* DELETE */}

                          <button
                            onClick={() =>
                              handleDelete(
                                organization.id,
                                organization.name
                              )
                            }
                            disabled={
                              deleting ===
                              organization.id
                            }
                            title="Delete"
                            className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 disabled:opacity-50"
                          >
                            <Trash2 size={17} />
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default OrganizationList;


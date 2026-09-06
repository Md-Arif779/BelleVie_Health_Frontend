import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  ShieldCheck,
} from "lucide-react";

import {
  getInsurancePolicies,
  deleteInsurancePolicy,
} from "../../services/insurancePolicyService";

import { useAuth } from "../../context/AuthContext";
import {
  canAdd,
  canEdit,
  canDelete,
} from "../../utils/permission";

const InsurancePolicyList = () => {
  const navigate = useNavigate();
  const { permissions } = useAuth();

  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const loadPolicies = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {};

      if (search.trim()) {
        params.search = search.trim();
      }

      if (status) {
        params.status = status;
      }

      const data = await getInsurancePolicies(params);

      setPolicies(
        Array.isArray(data)
          ? data
          : data.results || []
      );
    } catch (err) {
      console.error("Insurance Policies Error:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to load insurance policies."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPolicies();
  }, [status]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadPolicies();
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this insurance policy?"
    );

    if (!confirmed) return;

    try {
      await deleteInsurancePolicy(id);
      loadPolicies();
    } catch (err) {
      console.error("Delete Insurance Policy Error:", err);

      alert(
        err.response?.data?.detail ||
          "Failed to delete insurance policy."
      );
    }
  };

  const getMemberName = (member) => {
    if (!member) return "-";

    if (typeof member === "string") {
      return member;
    }

    return (
      member.full_name ||
      member.name ||
      member.member_id ||
      "-"
    );
  };

  const getStatusClass = (value) => {
    switch (value) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";

      case "EXPIRED":
        return "bg-gray-100 text-gray-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const totalPolicies = policies.length;

  const activePolicies = policies.filter(
    (item) => item.status === "ACTIVE"
  ).length;

  const expiredPolicies = policies.filter(
    (item) => item.status === "EXPIRED"
  ).length;

  const cancelledPolicies = policies.filter(
    (item) => item.status === "CANCELLED"
  ).length;

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D9F7E8]">
              <ShieldCheck
                size={24}
                className="text-[#2F6FED]"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#212121]">
                Insurance Policies
              </h1>

              <p className="text-sm text-[#7A7A7A]">
                Manage member insurance policies
              </p>
            </div>
          </div>
        </div>

        {canAdd(permissions, "insurance_policies") && (
          <button
            onClick={() =>
              navigate("/insurance-policies/add")
            }
            className="flex items-center justify-center gap-2 rounded-lg bg-[#2F6FED] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#2459C7]"
          >
            <Plus size={18} />
            Add Policy
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#7A7A7A]">
            Total Policies
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#212121]">
            {totalPolicies}
          </h2>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#7A7A7A]">
            Active
          </p>

          <h2 className="mt-2 text-2xl font-bold text-green-600">
            {activePolicies}
          </h2>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#7A7A7A]">
            Expired
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-600">
            {expiredPolicies}
          </h2>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <p className="text-sm text-[#7A7A7A]">
            Cancelled
          </p>

          <h2 className="mt-2 text-2xl font-bold text-red-600">
            {cancelledPolicies}
          </h2>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="mb-6 rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 md:flex-row"
        >
          <div className="relative flex-1">
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
              placeholder="Search policy ID, member, provider, policy number..."
              className="w-full rounded-lg border border-[#E5E7EB] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#2F6FED]"
            />
          </div>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none focus:border-[#2F6FED]"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="EXPIRED">Expired</option>
            <option value="CANCELLED">
              Cancelled
            </option>
          </select>

          <button
            type="submit"
            className="rounded-lg bg-[#2F6FED] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#2459C7]"
          >
            Search
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] text-left">
            <thead className="border-b border-[#E5E7EB] bg-[#F8F9FA]">
              <tr>
                <th className="px-5 py-4 text-xs font-semibold uppercase text-[#7A7A7A]">
                  Policy ID
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-[#7A7A7A]">
                  Member
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-[#7A7A7A]">
                  Provider
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-[#7A7A7A]">
                  Policy Number
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-[#7A7A7A]">
                  Plan
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-[#7A7A7A]">
                  Coverage
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-[#7A7A7A]">
                  Premium
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-[#7A7A7A]">
                  Expiry
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-[#7A7A7A]">
                  Status
                </th>

                <th className="px-5 py-4 text-xs font-semibold uppercase text-[#7A7A7A]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="10"
                    className="px-5 py-10 text-center text-sm text-[#7A7A7A]"
                  >
                    Loading insurance policies...
                  </td>
                </tr>
              ) : policies.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="px-5 py-10 text-center text-sm text-[#7A7A7A]"
                  >
                    No insurance policies found.
                  </td>
                </tr>
              ) : (
                policies.map((policy) => (
                  <tr
                    key={policy.id}
                    className="border-b border-[#E5E7EB] last:border-b-0 hover:bg-[#F8F9FA]"
                  >
                    <td className="px-5 py-4 text-sm font-semibold text-[#2F6FED]">
                      {policy.policy_id || "-"}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#212121]">
                      {getMemberName(policy.member)}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#212121]">
                      {policy.provider_name || "-"}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#212121]">
                      {policy.policy_number || "-"}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#212121]">
                      {policy.plan_name || "-"}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#212121]">
                      {policy.coverage_amount
                        ? `৳${policy.coverage_amount}`
                        : "-"}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#212121]">
                      {policy.premium
                        ? `৳${policy.premium}`
                        : "-"}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#212121]">
                      {policy.expiry_date || "-"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                          policy.status
                        )}`}
                      >
                        {policy.status || "-"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            navigate(
                              `/insurance-policies/${policy.id}`
                            )
                          }
                          className="rounded-lg p-2 text-[#2F6FED] hover:bg-[#EEF4FF]"
                          title="View"
                        >
                          <Eye size={17} />
                        </button>

                        {canEdit(
                          permissions,
                          "insurance_policies"
                        ) && (
                          <button
                            onClick={() =>
                              navigate(
                                `/insurance-policies/${policy.id}/edit`
                              )
                            }
                            className="rounded-lg p-2 text-[#F59E0B] hover:bg-orange-50"
                            title="Edit"
                          >
                            <Pencil size={17} />
                          </button>
                        )}

                        {canDelete(
                          permissions,
                          "insurance_policies"
                        ) && (
                          <button
                            onClick={() =>
                              handleDelete(policy.id)
                            }
                            className="rounded-lg p-2 text-[#DC2626] hover:bg-red-50"
                            title="Delete"
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
};

export default InsurancePolicyList;
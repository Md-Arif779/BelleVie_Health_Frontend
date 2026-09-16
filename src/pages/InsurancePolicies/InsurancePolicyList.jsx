
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
  ShieldCheck,
  Loader2,
} from "lucide-react";

import {
  getInsurancePolicies,
  deleteInsurancePolicy,
} from "../../services/insurancePolicyService";

import { useAuth } from "../../context/AuthContext";
import { hasPermission } from "../../utils/permission";


const STATUS_STYLES = {
  ACTIVE: "bg-[#DCFCE7] text-[#166534]",
  INACTIVE: "bg-[#F3F4F6] text-[#4B5563]",
  EXPIRED: "bg-[#FEE2E2] text-[#991B1B]",
};


const STATUS_LABELS = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  EXPIRED: "Expired",
};


const InsurancePolicyList = () => {
  const navigate = useNavigate();

  const {
    permissions,
    user,
    loading: authLoading,
  } = useAuth();

  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [error, setError] = useState("");


  const canView = () => {
    if (user?.role === "SUPER_ADMIN") {
      return true;
    }

    return hasPermission(
      permissions,
      "insurance_policies"
    );
  };


  const canAdd = () => {
    if (user?.role === "SUPER_ADMIN") {
      return true;
    }

    return hasPermission(
      permissions,
      "insurance_policies"
    );
  };


  const canEdit = () => {
    if (user?.role === "SUPER_ADMIN") {
      return true;
    }

    return hasPermission(
      permissions,
      "insurance_policies"
    );
  };


  const canDelete = () => {
    if (user?.role === "SUPER_ADMIN") {
      return true;
    }

    return hasPermission(
      permissions,
      "insurance_policies"
    );
  };


  const loadPolicies = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getInsurancePolicies();

      const policyList = Array.isArray(response)
        ? response
        : response?.results || [];

      setPolicies(policyList);
    } catch (error) {
      console.error(
        "Failed to load insurance policies:",
        error
      );

      setError(
        error.response?.data?.detail ||
          "Failed to load insurance policies."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!canView()) {
      setLoading(false);
      return;
    }

    loadPolicies();
  }, [authLoading, permissions, user]);


  const filteredPolicies = useMemo(() => {
    const keyword = search
      .trim()
      .toLowerCase();

    return policies.filter((policy) => {
      const matchesSearch =
        !keyword ||
        policy.policy_id
          ?.toLowerCase()
          .includes(keyword) ||
        policy.policy_number
          ?.toLowerCase()
          .includes(keyword) ||
        policy.plan_name
          ?.toLowerCase()
          .includes(keyword) ||
        policy.provider_name
          ?.toLowerCase()
          .includes(keyword) ||
        policy.member_name
          ?.toLowerCase()
          .includes(keyword) ||
        policy.member_id
          ?.toLowerCase()
          .includes(keyword);

      const matchesStatus =
        !statusFilter ||
        policy.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [policies, search, statusFilter]);


  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this Insurance Policy?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      await deleteInsurancePolicy(id);

      setPolicies((previous) =>
        previous.filter(
          (policy) => policy.id !== id
        )
      );
    } catch (error) {
      console.error(
        "Failed to delete insurance policy:",
        error
      );

      alert(
        error.response?.data?.detail ||
          "Failed to delete Insurance Policy."
      );
    } finally {
      setDeletingId(null);
    }
  };


  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            className="h-8 w-8 animate-spin text-[#2F6FED]"
          />

          <p className="text-sm text-[#7A7A7A]">
            Loading Insurance Policies...
          </p>
        </div>
      </div>
    );
  }


  if (!canView()) {
    return (
      <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-6">
        <p className="font-medium text-[#991B1B]">
          You do not have permission to view Insurance Policies.
        </p>
      </div>
    );
  }


  return (
    <div className="space-y-6 pb-8">

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck
              size={22}
              className="text-[#2F6FED]"
            />

            <p className="text-sm font-medium text-[#2F6FED]">
              Insurance Management
            </p>
          </div>

          <h1 className="mt-1 text-2xl font-semibold text-[#212121]">
            Insurance Policies
          </h1>

          <p className="mt-1 text-sm text-[#7A7A7A]">
            Manage member insurance policies and coverage information.
          </p>
        </div>


        <div className="flex items-center gap-2">

          <button
            type="button"
            onClick={loadPolicies}
            className="
              inline-flex
              items-center
              gap-2
              rounded-lg
              border
              border-[#E5E7EB]
              bg-white
              px-4
              py-2.5
              text-sm
              font-medium
              text-[#212121]
              transition
              hover:bg-[#F9FAFB]
            "
          >
            <RefreshCw size={16} />
            Refresh
          </button>


          {canAdd() && (
            <button
              type="button"
              onClick={() =>
                navigate("/insurance-policies/add")
              }
              className="
                inline-flex
                items-center
                gap-2
                rounded-lg
                bg-[#2F6FED]
                px-4
                py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-[#2459C7]
              "
            >
              <Plus size={17} />
              Add Policy
            </button>
          )}

        </div>

      </div>


      {/* Error */}
      {error && (
        <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#991B1B]">
          {error}
        </div>
      )}


      {/* Search + Filter */}
      <div className="rounded-xl border border-[#EEEEEE] bg-white p-4 shadow-sm">

        <div className="flex flex-col gap-3 md:flex-row">

          <div className="relative flex-1">

            <Search
              size={18}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-[#9CA3AF]
              "
            />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by policy ID, policy number, member, provider or plan..."
              className="
                w-full
                rounded-lg
                border
                border-[#E5E7EB]
                bg-white
                py-2.5
                pl-10
                pr-4
                text-sm
                outline-none
                transition
                focus:border-[#2F6FED]
                focus:ring-1
                focus:ring-[#2F6FED]
              "
            />

          </div>


          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="
              rounded-lg
              border
              border-[#E5E7EB]
              bg-white
              px-4
              py-2.5
              text-sm
              outline-none
              focus:border-[#2F6FED]
              focus:ring-1
              focus:ring-[#2F6FED]
            "
          >
            <option value="">
              All Status
            </option>

            <option value="ACTIVE">
              Active
            </option>

            <option value="INACTIVE">
              Inactive
            </option>

            <option value="EXPIRED">
              Expired
            </option>
          </select>

        </div>

      </div>


      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#EEEEEE] bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="min-w-full">

            <thead className="bg-[#F9FAFB]">

              <tr>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                  Policy
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                  Member
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                  Provider
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                  Plan
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                  Coverage
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                  Status
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                  Actions
                </th>

              </tr>

            </thead>


            <tbody className="divide-y divide-[#EEEEEE]">

              {filteredPolicies.length === 0 ? (

                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-12 text-center"
                  >
                    <ShieldCheck
                      size={32}
                      className="mx-auto text-[#D1D5DB]"
                    />

                    <p className="mt-3 text-sm font-medium text-[#4B5563]">
                      No Insurance Policies Found
                    </p>

                    <p className="mt-1 text-xs text-[#9CA3AF]">
                      Try changing your search or filter.
                    </p>
                  </td>
                </tr>

              ) : (

                filteredPolicies.map((policy) => {

                  const status =
                    String(
                      policy.status || ""
                    ).toUpperCase();

                  return (
                    <tr
                      key={policy.id}
                      className="transition hover:bg-[#FAFAFA]"
                    >

                      {/* Policy */}
                      <td className="px-5 py-4">

                        <p className="text-sm font-semibold text-[#212121]">
                          {policy.policy_id || "-"}
                        </p>

                        <p className="mt-1 text-xs text-[#7A7A7A]">
                          {policy.policy_number || "-"}
                        </p>

                      </td>


                      {/* Member */}
                      <td className="px-5 py-4">

                        <p className="text-sm font-medium text-[#212121]">
                          {policy.member_name || "-"}
                        </p>

                        <p className="mt-1 text-xs text-[#7A7A7A]">
                          {policy.member_id || "-"}
                        </p>

                      </td>


                      {/* Provider */}
                      <td className="px-5 py-4">

                        <p className="text-sm text-[#212121]">
                          {policy.provider_name || "-"}
                        </p>

                      </td>


                      {/* Plan */}
                      <td className="px-5 py-4">

                        <p className="text-sm text-[#212121]">
                          {policy.plan_name || "-"}
                        </p>

                      </td>


                      {/* Coverage */}
                      <td className="px-5 py-4">

                        <p className="text-sm font-medium text-[#212121]">
                          ৳{" "}
                          {Number(
                            policy.coverage_amount || 0
                          ).toLocaleString()}
                        </p>

                        <p className="mt-1 text-xs text-[#7A7A7A]">
                          Premium: ৳{" "}
                          {Number(
                            policy.premium || 0
                          ).toLocaleString()}
                        </p>

                      </td>


                      {/* Status */}
                      <td className="px-5 py-4">

                        <span
                          className={`
                            inline-flex
                            rounded-full
                            px-3
                            py-1
                            text-xs
                            font-medium
                            ${
                              STATUS_STYLES[
                                status
                              ] ||
                              "bg-[#F3F4F6] text-[#4B5563]"
                            }
                          `}
                        >
                          {STATUS_LABELS[
                            status
                          ] ||
                            status ||
                            "Unknown"}
                        </span>

                      </td>


                      {/* Actions */}
                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-1">

                          <button
                            type="button"
                            title="View"
                            onClick={() =>
                              navigate(
                                `/insurance-policies/${policy.id}`
                              )
                            }
                            className="
                              rounded-lg
                              p-2
                              text-[#2F6FED]
                              transition
                              hover:bg-[#EFF6FF]
                            "
                          >
                            <Eye size={17} />
                          </button>


                          {canEdit() && (
                            <button
                              type="button"
                              title="Edit"
                              onClick={() =>
                                navigate(
                                  `/insurance-policies/${policy.id}/edit`
                                )
                              }
                              className="
                                rounded-lg
                                p-2
                                text-[#7A7A7A]
                                transition
                                hover:bg-[#F3F4F6]
                              "
                            >
                              <Pencil size={17} />
                            </button>
                          )}


                          {canDelete() && (
                            <button
                              type="button"
                              title="Delete"
                              disabled={
                                deletingId ===
                                policy.id
                              }
                              onClick={() =>
                                handleDelete(
                                  policy.id
                                )
                              }
                              className="
                                rounded-lg
                                p-2
                                text-[#DC2626]
                                transition
                                hover:bg-[#FEF2F2]
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                              "
                            >
                              {deletingId ===
                              policy.id ? (
                                <Loader2
                                  size={17}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2
                                  size={17}
                                />
                              )}
                            </button>
                          )}

                        </div>

                      </td>

                    </tr>
                  );
                })

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* Result Count */}
      <div className="text-xs text-[#7A7A7A]">
        Showing {filteredPolicies.length} of{" "}
        {policies.length} insurance policies.
      </div>

    </div>
  );
};


export default InsurancePolicyList;


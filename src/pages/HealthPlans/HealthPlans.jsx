
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  Search,
  RefreshCw,
} from "lucide-react";

import {
  getHealthPlans,
  deleteHealthPlan,
} from "../../services/healthPlanService";

import { useAuth } from "../../context/AuthContext";

import {
  canAdd,
  canEdit,
  canDelete,
} from "../../utils/permission";

function HealthPlans() {
  const navigate = useNavigate();
  const { permissions } = useAuth();

  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const hasAddPermission = canAdd(permissions, "health_plans");
  const hasEditPermission = canEdit(permissions, "health_plans");
  const hasDeletePermission = canDelete(permissions, "health_plans");

  const loadPlans = async () => {
    try {
      setLoading(true);

      const response = await getHealthPlans();

      setPlans(
        Array.isArray(response)
          ? response
          : response.results || response.plans || []
      );
    } catch (error) {
      console.error("Health Plans Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this health plan?"
    );

    if (!confirmed) return;

    try {
      await deleteHealthPlan(id);
      await loadPlans();
    } catch (error) {
      console.error("Delete Health Plan Error:", error);

      alert(
        error.response?.data?.detail ||
          "Failed to delete health plan."
      );
    }
  };

  const filteredPlans = plans.filter((plan) => {
    const keyword = search.toLowerCase();

    return (
      plan.plan_id?.toLowerCase().includes(keyword) ||
      plan.plan_name?.toLowerCase().includes(keyword) ||
      plan.name?.toLowerCase().includes(keyword) ||
      plan.member_id?.toLowerCase().includes(keyword) ||
      plan.member_name?.toLowerCase().includes(keyword) ||
      plan.provider_name?.toLowerCase().includes(keyword) ||
      plan.provider?.name?.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#212121]">
            Health Plans
          </h1>

          <p className="mt-1 text-sm text-[#7A7A7A]">
            Manage member health plans
          </p>
        </div>

        {hasAddPermission && (
          <button
            onClick={() => navigate("/health-plans/add")}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#2F6FED] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#2459C7]"
          >
            <Plus size={18} />
            Add Health Plan
          </button>
        )}
      </div>

      {/* Search / Refresh */}
      <div className="mb-5 flex flex-col gap-3 rounded-xl border border-[#E5E7EB] bg-white p-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]"
          />

          <input
            type="text"
            placeholder="Search health plans..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-[#E5E7EB] py-2.5 pl-10 pr-4 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED] focus:ring-1 focus:ring-[#2F6FED]"
          />
        </div>

        <button
          onClick={loadPlans}
          className="flex items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-medium text-[#212121] transition hover:bg-[#F2F2F2]"
        >
          <RefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-sm text-[#7A7A7A]">
            Loading health plans...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px]">
              <thead className="border-b border-[#E5E7EB] bg-[#F8F9FA]">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Plan ID
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Plan Name
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Member
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Provider
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
                {filteredPlans.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-12 text-center text-sm text-[#7A7A7A]"
                    >
                      No health plans found.
                    </td>
                  </tr>
                ) : (
                  filteredPlans.map((plan) => (
                    <tr
                      key={plan.id}
                      className="border-b border-[#EEEEEE] last:border-b-0 hover:bg-[#FAFAFA]"
                    >
                      {/* Plan ID */}
                      <td className="px-5 py-4 text-sm font-medium text-[#212121]">
                        {plan.plan_id || `#${plan.id}`}
                      </td>

                      {/* Plan Name */}
                      <td className="px-5 py-4 text-sm text-[#212121]">
                        {plan.plan_name || plan.name || "-"}
                      </td>

                      {/* Member */}
                      <td className="px-5 py-4">
                        <div className="text-sm font-medium text-[#212121]">
                          {plan.member_name || "-"}
                        </div>

                        <div className="text-xs text-[#7A7A7A]">
                          {plan.member_id || "-"}
                        </div>
                      </td>

                      {/* Provider */}
                      <td className="px-5 py-4">
                        <div className="text-sm font-medium text-[#212121]">
                          {plan.provider_name ||
                            plan.provider?.name ||
                            "-"}
                        </div>

                        {plan.provider?.partner_id && (
                          <div className="text-xs text-[#7A7A7A]">
                            {plan.provider.partner_id}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                            plan.status === "ACTIVE"
                              ? "bg-[#DCFCE7] text-[#16A34A]"
                              : plan.status === "INACTIVE"
                              ? "bg-[#FEE2E2] text-[#DC2626]"
                              : "bg-[#FEF3C7] text-[#F59E0B]"
                          }`}
                        >
                          {plan.status || "-"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {/* View */}
                          <button
                            onClick={() =>
                              navigate(`/health-plans/${plan.id}`)
                            }
                            title="View"
                            className="rounded-lg p-2 text-[#7A7A7A] transition hover:bg-[#EEF4FF] hover:text-[#2F6FED]"
                          >
                            <Eye size={17} />
                          </button>

                          {/* Edit */}
                          {hasEditPermission && (
                            <button
                              onClick={() =>
                                navigate(
                                  `/health-plans/${plan.id}/edit`
                                )
                              }
                              title="Edit"
                              className="rounded-lg p-2 text-[#7A7A7A] transition hover:bg-[#EEF4FF] hover:text-[#2F6FED]"
                            >
                              <Pencil size={17} />
                            </button>
                          )}

                          {/* Delete */}
                          {hasDeletePermission && (
                            <button
                              onClick={() =>
                                handleDelete(plan.id)
                              }
                              title="Delete"
                              className="rounded-lg p-2 text-[#7A7A7A] transition hover:bg-[#FEE2E2] hover:text-[#DC2626]"
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
        )}
      </div>
    </div>
  );
}

export default HealthPlans;


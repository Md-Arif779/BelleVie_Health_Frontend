import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ShieldAlert,
  Clock,
  CheckCircle,
  XCircle,
  CreditCard,
} from "lucide-react";

import {
  getInsuranceClaims,
  deleteInsuranceClaim,
} from "../../services/insuranceClaimService";

import { useAuth } from "../../context/AuthContext";
import {
  canView,
  canAdd,
  canEdit,
  canDelete,
} from "../../utils/permission";

const CLAIM_STATUSES = [
  "PENDING",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
  "PAID",
];

const statusLabel = (status) => {
  const labels = {
    PENDING: "Pending",
    UNDER_REVIEW: "Under Review",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    PAID: "Paid",
  };

  return labels[status] || status;
};

const statusClass = (status) => {
  const classes = {
    PENDING: "bg-yellow-50 text-yellow-700",
    UNDER_REVIEW: "bg-blue-50 text-blue-700",
    APPROVED: "bg-green-50 text-green-700",
    REJECTED: "bg-red-50 text-red-700",
    PAID: "bg-purple-50 text-purple-700",
  };

  return classes[status] || "bg-gray-100 text-gray-700";
};

const claimTypeLabel = (type) => {
  const labels = {
    HOSPITALIZATION: "Hospitalization",
    CONSULTATION: "Consultation",
    DIAGNOSTIC: "Diagnostic",
    MEDICINE: "Medicine",
    SURGERY: "Surgery",
    OTHER: "Other",
  };

  return labels[type] || type;
};

function InsuranceClaimList() {
  const navigate = useNavigate();
  const { permissions, loading } = useAuth();

  const [claims, setClaims] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loadingClaims, setLoadingClaims] = useState(true);

  const module = "insurance_claims";

  const loadClaims = async () => {
    try {
      setLoadingClaims(true);

      const response = await getInsuranceClaims();

      const data = Array.isArray(response)
        ? response
        : response?.results || [];

      setClaims(data);
    } catch (error) {
      console.error("Insurance Claims Error:", error);
      setClaims([]);
    } finally {
      setLoadingClaims(false);
    }
  };

  useEffect(() => {
    if (!loading && canView(permissions, module)) {
      loadClaims();
    } else if (!loading) {
      setLoadingClaims(false);
    }
  }, [loading, permissions]);

  const filteredClaims = useMemo(() => {
    const query = search.trim().toLowerCase();

    return claims.filter((claim) => {
      const matchesSearch =
        !query ||
        claim.claim_id?.toLowerCase().includes(query) ||
        claim.member_id?.toLowerCase().includes(query) ||
        claim.member_name?.toLowerCase().includes(query) ||
        claim.policy_id?.toLowerCase().includes(query) ||
        claim.policy_number?.toLowerCase().includes(query) ||
        claim.claim_type?.toLowerCase().includes(query);

      const matchesStatus =
        !statusFilter || claim.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [claims, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: claims.length,
      pending: claims.filter(
        (claim) => claim.status === "PENDING"
      ).length,
      underReview: claims.filter(
        (claim) => claim.status === "UNDER_REVIEW"
      ).length,
      approved: claims.filter(
        (claim) => claim.status === "APPROVED"
      ).length,
      rejected: claims.filter(
        (claim) => claim.status === "REJECTED"
      ).length,
      paid: claims.filter(
        (claim) => claim.status === "PAID"
      ).length,
    };
  }, [claims]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this insurance claim?"
    );

    if (!confirmed) return;

    try {
      await deleteInsuranceClaim(id);
      await loadClaims();
    } catch (error) {
      console.error("Delete Insurance Claim Error:", error);

      alert(
        error?.response?.data?.detail ||
          "Failed to delete insurance claim."
      );
    }
  };

  if (loading || loadingClaims) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[#7A7A7A]">
          Loading insurance claims...
        </div>
      </div>
    );
  }

  if (!canView(permissions, module)) {
    return (
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-8 text-center">
        <ShieldAlert
          size={42}
          className="mx-auto mb-3 text-[#DC2626]"
        />

        <h2 className="text-xl font-semibold text-[#212121]">
          Access Denied
        </h2>

        <p className="mt-2 text-[#7A7A7A]">
          You do not have permission to view insurance claims.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#212121]">
            Insurance Claims
          </h1>

          <p className="text-sm text-[#7A7A7A] mt-1">
            Manage member insurance claims and claim processing.
          </p>
        </div>

        {canAdd(permissions, module) && (
          <button
            onClick={() => navigate("/insurance-claims/add")}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#2F6FED] text-white font-medium hover:bg-[#2459C7] transition"
          >
            <Plus size={18} />
            Add Claim
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="text-[#2F6FED]" size={22} />
            <div>
              <p className="text-sm text-[#7A7A7A]">Total</p>
              <p className="text-xl font-bold text-[#212121]">
                {stats.total}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
          <div className="flex items-center gap-3">
            <Clock className="text-yellow-500" size={22} />
            <div>
              <p className="text-sm text-[#7A7A7A]">Pending</p>
              <p className="text-xl font-bold text-[#212121]">
                {stats.pending}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
          <div className="flex items-center gap-3">
            <Clock className="text-[#2F6FED]" size={22} />
            <div>
              <p className="text-sm text-[#7A7A7A]">
                Under Review
              </p>
              <p className="text-xl font-bold text-[#212121]">
                {stats.underReview}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="text-[#16A34A]" size={22} />
            <div>
              <p className="text-sm text-[#7A7A7A]">Approved</p>
              <p className="text-xl font-bold text-[#212121]">
                {stats.approved}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
          <div className="flex items-center gap-3">
            <XCircle className="text-[#DC2626]" size={22} />
            <div>
              <p className="text-sm text-[#7A7A7A]">Rejected</p>
              <p className="text-xl font-bold text-[#212121]">
                {stats.rejected}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
          <div className="flex items-center gap-3">
            <CreditCard className="text-purple-600" size={22} />
            <div>
              <p className="text-sm text-[#7A7A7A]">Paid</p>
              <p className="text-xl font-bold text-[#212121]">
                {stats.paid}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-4">
        <div className="flex flex-col md:flex-row gap-3">

          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search claim ID, member, policy..."
              className="w-full pl-10 pr-4 py-2.5 border border-[#E5E7EB] rounded-lg outline-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="md:w-52 px-4 py-2.5 border border-[#E5E7EB] rounded-lg outline-none focus:ring-2 focus:ring-[#2F6FED]/20 focus:border-[#2F6FED]"
          >
            <option value="">All Statuses</option>

            {CLAIM_STATUSES.map((status) => (
              <option key={status} value={status}>
                {statusLabel(status)}
              </option>
            ))}
          </select>

        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden">

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">

            <thead className="bg-[#F2F2F2]">
              <tr>
                <th className="text-left px-5 py-3 text-sm font-semibold text-[#212121]">
                  Claim ID
                </th>

                <th className="text-left px-5 py-3 text-sm font-semibold text-[#212121]">
                  Member
                </th>

                <th className="text-left px-5 py-3 text-sm font-semibold text-[#212121]">
                  Policy
                </th>

                <th className="text-left px-5 py-3 text-sm font-semibold text-[#212121]">
                  Claim Type
                </th>

                <th className="text-left px-5 py-3 text-sm font-semibold text-[#212121]">
                  Claim Date
                </th>

                <th className="text-right px-5 py-3 text-sm font-semibold text-[#212121]">
                  Claim Amount
                </th>

                <th className="text-right px-5 py-3 text-sm font-semibold text-[#212121]">
                  Approved
                </th>

                <th className="text-left px-5 py-3 text-sm font-semibold text-[#212121]">
                  Status
                </th>

                <th className="text-center px-5 py-3 text-sm font-semibold text-[#212121]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredClaims.length === 0 ? (
                <tr>
                  <td
                    colSpan="9"
                    className="px-5 py-12 text-center text-[#7A7A7A]"
                  >
                    No insurance claims found.
                  </td>
                </tr>
              ) : (
                filteredClaims.map((claim) => (
                  <tr
                    key={claim.id}
                    className="border-t border-[#E5E7EB] hover:bg-[#F9FAFB]"
                  >

                    {/* Claim ID */}
                    <td className="px-5 py-4">
                      <div className="font-semibold text-[#2F6FED]">
                        {claim.claim_id || "-"}
                      </div>
                    </td>

                    {/* Member */}
                    <td className="px-5 py-4">
                      <div className="font-medium text-[#212121]">
                        {claim.member_name || "-"}
                      </div>

                      <div className="text-xs text-[#7A7A7A] mt-1">
                        {claim.member_id || "-"}
                      </div>
                    </td>

                    {/* Policy */}
                    <td className="px-5 py-4">
                      <div className="font-medium text-[#212121]">
                        {claim.policy_id || "-"}
                      </div>

                      <div className="text-xs text-[#7A7A7A] mt-1">
                        {claim.policy_number || "-"}
                      </div>
                    </td>

                    {/* Claim Type */}
                    <td className="px-5 py-4 text-sm text-[#212121]">
                      {claimTypeLabel(claim.claim_type)}
                    </td>

                    {/* Claim Date */}
                    <td className="px-5 py-4 text-sm text-[#212121]">
                      {claim.claim_date || "-"}
                    </td>

                    {/* Claim Amount */}
                    <td className="px-5 py-4 text-right font-medium text-[#212121]">
                      {claim.claim_amount ?? "0.00"}
                    </td>

                    {/* Approved Amount */}
                    <td className="px-5 py-4 text-right font-medium text-[#212121]">
                      {claim.approved_amount ?? "0.00"}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${statusClass(
                          claim.status
                        )}`}
                      >
                        {statusLabel(claim.status)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">

                        <button
                          onClick={() =>
                            navigate(
                              `/insurance-claims/${claim.id}`
                            )
                          }
                          title="View"
                          className="p-2 rounded-lg text-[#2F6FED] hover:bg-[#EEF4FF]"
                        >
                          <Eye size={17} />
                        </button>

                        {canEdit(permissions, module) && (
                          <button
                            onClick={() =>
                              navigate(
                                `/insurance-claims/${claim.id}/edit`
                              )
                            }
                            title="Edit"
                            className="p-2 rounded-lg text-[#2459C7] hover:bg-[#EEF4FF]"
                          >
                            <Pencil size={17} />
                          </button>
                        )}

                        {canDelete(permissions, module) && (
                          <button
                            onClick={() =>
                              handleDelete(claim.id)
                            }
                            title="Delete"
                            className="p-2 rounded-lg text-[#DC2626] hover:bg-red-50"
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

        {/* Result count */}
        <div className="px-5 py-3 border-t border-[#E5E7EB] text-sm text-[#7A7A7A]">
          Showing {filteredClaims.length} of {claims.length} claims
        </div>

      </div>
    </div>
  );
}

export default InsuranceClaimList;
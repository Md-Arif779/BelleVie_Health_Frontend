import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

import {
  getPrescriptions,
  deletePrescription,
} from "../../services/prescriptionService";

import { useAuth } from "../../context/AuthContext";
import {
  canAdd,
  canEdit,
  canDelete,
} from "../../utils/permission";

const PrescriptionList = () => {
  const navigate = useNavigate();
  const { permissions } = useAuth();

  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadPrescriptions = async () => {
    try {
      setLoading(true);

      const response = await getPrescriptions();

      const data = Array.isArray(response)
        ? response
        : response?.results || [];

      setPrescriptions(data);
    } catch (error) {
      console.error("Prescription loading error:", error);
      setPrescriptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrescriptions();
  }, []);

  const filteredPrescriptions = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return prescriptions.filter((prescription) => {
      const memberName =
        prescription.member?.full_name ||
        prescription.member_name ||
        "";

      const memberId =
        prescription.member?.member_id ||
        "";

      const doctorName =
        prescription.doctor?.full_name ||
        prescription.doctor_name ||
        "";

      const prescriptionId =
        prescription.prescription_id || "";

      const medicine =
        prescription.medicine || "";

      const diagnosis =
        prescription.diagnosis || "";

      const matchesSearch =
        !keyword ||
        prescriptionId.toLowerCase().includes(keyword) ||
        memberName.toLowerCase().includes(keyword) ||
        memberId.toLowerCase().includes(keyword) ||
        doctorName.toLowerCase().includes(keyword) ||
        medicine.toLowerCase().includes(keyword) ||
        diagnosis.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "ALL" ||
        prescription.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [prescriptions, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: prescriptions.length,
      active: prescriptions.filter(
        (item) => item.status === "ACTIVE"
      ).length,
      completed: prescriptions.filter(
        (item) => item.status === "COMPLETED"
      ).length,
      cancelled: prescriptions.filter(
        (item) => item.status === "CANCELLED"
      ).length,
    };
  }, [prescriptions]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this prescription?"
    );

    if (!confirmed) return;

    try {
      await deletePrescription(id);
      await loadPrescriptions();
    } catch (error) {
      console.error("Prescription delete error:", error);

      alert(
        error?.response?.data?.detail ||
          "Failed to delete prescription."
      );
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";

      case "COMPLETED":
        return "bg-blue-100 text-blue-700";

      case "CANCELLED":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatStatus = (status) => {
    if (!status) return "-";

    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#212121]">
            Prescriptions
          </h1>

          <p className="mt-1 text-sm text-[#7A7A7A]">
            Manage member prescriptions and medication records
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadPrescriptions}
            className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-medium text-[#212121] transition hover:bg-gray-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          {canAdd(permissions, "prescriptions") && (
            <button
              onClick={() => navigate("/prescriptions/add")}
              className="flex items-center gap-2 rounded-lg bg-[#2F6FED] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2459C7]"
            >
              <Plus size={18} />
              Add Prescription
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#7A7A7A]">
                Total Prescriptions
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#212121]">
                {stats.total}
              </h2>
            </div>

            <div className="rounded-lg bg-[#EEF4FF] p-3 text-[#2F6FED]">
              <FileText size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#7A7A7A]">
                Active
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#212121]">
                {stats.active}
              </h2>
            </div>

            <div className="rounded-lg bg-green-50 p-3 text-green-600">
              <CheckCircle size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#7A7A7A]">
                Completed
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#212121]">
                {stats.completed}
              </h2>
            </div>

            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <Clock size={22} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#7A7A7A]">
                Cancelled
              </p>

              <h2 className="mt-2 text-2xl font-bold text-[#212121]">
                {stats.cancelled}
              </h2>
            </div>

            <div className="rounded-lg bg-red-50 p-3 text-red-600">
              <XCircle size={22} />
            </div>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="mb-5 rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search prescription ID, member, doctor, medicine..."
              className="w-full rounded-lg border border-[#E5E7EB] py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#212121] outline-none focus:border-[#2F6FED]"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-sm text-[#7A7A7A]">
              Loading prescriptions...
            </div>
          </div>
        ) : filteredPrescriptions.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
            <FileText
              size={42}
              className="mb-3 text-[#7A7A7A]"
            />

            <h3 className="text-lg font-semibold text-[#212121]">
              No prescriptions found
            </h3>

            <p className="mt-1 text-sm text-[#7A7A7A]">
              No prescription records match your search or filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-gray-50">
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Prescription ID
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Member
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Doctor
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Medicine
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Diagnosis
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
                {filteredPrescriptions.map((prescription) => {
                  const memberName =
                    prescription.member?.full_name ||
                    prescription.member_name ||
                    "-";

                  const doctorName =
                    prescription.doctor?.full_name ||
                    prescription.doctor_name ||
                    "-";

                  return (
                    <tr
                      key={prescription.id}
                      className="border-b border-[#E5E7EB] last:border-b-0 hover:bg-gray-50"
                    >
                      <td className="px-5 py-4">
                        <span className="font-semibold text-[#2F6FED]">
                          {prescription.prescription_id || "-"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium text-[#212121]">
                            {memberName}
                          </p>

                          {prescription.member?.member_id && (
                            <p className="mt-0.5 text-xs text-[#7A7A7A]">
                              {prescription.member.member_id}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-[#212121]">
                        {doctorName}
                      </td>

                      <td className="max-w-[180px] px-5 py-4 text-sm text-[#212121]">
                        <div className="truncate">
                          {prescription.medicine || "-"}
                        </div>
                      </td>

                      <td className="max-w-[180px] px-5 py-4 text-sm text-[#212121]">
                        <div className="truncate">
                          {prescription.diagnosis || "-"}
                        </div>
                      </td>

                      <td className="px-5 py-4 text-sm text-[#212121]">
                        {prescription.prescription_date || "-"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                            prescription.status
                          )}`}
                        >
                          {formatStatus(prescription.status)}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() =>
                              navigate(
                                `/prescriptions/${prescription.id}`
                              )
                            }
                            title="View"
                            className="rounded-lg p-2 text-[#2F6FED] transition hover:bg-[#EEF4FF]"
                          >
                            <Eye size={17} />
                          </button>

                          {canEdit(
                            permissions,
                            "prescriptions"
                          ) && (
                            <button
                              onClick={() =>
                                navigate(
                                  `/prescriptions/${prescription.id}/edit`
                                )
                              }
                              title="Edit"
                              className="rounded-lg p-2 text-amber-600 transition hover:bg-amber-50"
                            >
                              <Pencil size={17} />
                            </button>
                          )}

                          {canDelete(
                            permissions,
                            "prescriptions"
                          ) && (
                            <button
                              onClick={() =>
                                handleDelete(prescription.id)
                              }
                              title="Delete"
                              className="rounded-lg p-2 text-red-600 transition hover:bg-red-50"
                            >
                              <Trash2 size={17} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionList;
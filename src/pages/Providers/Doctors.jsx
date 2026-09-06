import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
} from "lucide-react";

import { getDoctors, deleteDoctor } from "../../services/doctorService";
import { useAuth } from "../../context/AuthContext";
import {
  canAdd,
  canEdit,
  canDelete,
} from "../../utils/permission";

const Doctors = () => {
  const navigate = useNavigate();

  const { permissions } = useAuth();

  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDoctors = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getDoctors();

      if (Array.isArray(data)) {
        setDoctors(data);
      } else if (Array.isArray(data.results)) {
        setDoctors(data.results);
      } else {
        setDoctors([]);
      }
    } catch (err) {
      console.error("Doctors Error:", err);
      setError(
        err.response?.data?.detail ||
          "Failed to load doctors."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete Dr. ${name}?`
    );

    if (!confirmed) return;

    try {
      await deleteDoctor(id);

      setDoctors((prev) =>
        prev.filter((doctor) => doctor.id !== id)
      );
    } catch (err) {
      console.error("Delete Doctor Error:", err);

      alert(
        err.response?.data?.detail ||
          "Failed to delete doctor."
      );
    }
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return true;

    return (
      doctor.doctor_id?.toLowerCase().includes(keyword) ||
      doctor.full_name?.toLowerCase().includes(keyword) ||
      doctor.specialty?.toLowerCase().includes(keyword) ||
      doctor.hospital_name?.toLowerCase().includes(keyword) ||
      doctor.phone?.toLowerCase().includes(keyword) ||
      doctor.email?.toLowerCase().includes(keyword)
    );
  });

  const formatFee = (fee) => {
    if (fee === null || fee === undefined || fee === "") {
      return "৳0";
    }

    return `৳${Number(fee).toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#212121]">
            Doctors
          </h1>

          <p className="mt-1 text-sm text-[#7A7A7A]">
            Manage healthcare providers and doctors
          </p>
        </div>

        {canAdd(permissions, "doctors") && (
          <button
            onClick={() => navigate("/doctors/add")}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#2F6FED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2459C7]"
          >
            <Plus size={18} />
            Add Doctor
          </button>
        )}
      </div>

      {/* Search + Refresh */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by doctor ID, name, specialty, hospital..."
            className="w-full rounded-lg border border-[#E5E7EB] bg-white py-3 pl-10 pr-4 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED]"
          />
        </div>

        <button
          onClick={loadDoctors}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm font-medium text-[#212121] transition hover:bg-[#F9FAFB] disabled:cursor-not-allowed disabled:opacity-60"
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

      {/* Stats */}
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
          <p className="text-sm text-[#7A7A7A]">
            Total Doctors
          </p>

          <p className="mt-2 text-2xl font-bold text-[#212121]">
            {doctors.length}
          </p>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
          <p className="text-sm text-[#7A7A7A]">
            Active Doctors
          </p>

          <p className="mt-2 text-2xl font-bold text-[#16A34A]">
            {
              doctors.filter(
                (doctor) => doctor.status === "ACTIVE"
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5">
          <p className="text-sm text-[#7A7A7A]">
            Inactive Doctors
          </p>

          <p className="mt-2 text-2xl font-bold text-[#DC2626]">
            {
              doctors.filter(
                (doctor) => doctor.status === "INACTIVE"
              ).length
            }
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">

        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-[#7A7A7A]">
              <RefreshCw
                size={20}
                className="animate-spin"
              />
              Loading doctors...
            </div>
          </div>
        ) : filteredDoctors.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
            <div className="mb-3 rounded-full bg-[#EEF4FF] p-4">
              <Search
                size={24}
                className="text-[#2F6FED]"
              />
            </div>

            <h3 className="text-base font-semibold text-[#212121]">
              No doctors found
            </h3>

            <p className="mt-1 text-sm text-[#7A7A7A]">
              {search
                ? "Try changing your search keyword."
                : "No doctors have been added yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">

              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Doctor ID
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Doctor
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Specialty
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Experience
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Hospital
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Fee
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
                {filteredDoctors.map((doctor) => (
                  <tr
                    key={doctor.id}
                    className="border-b border-[#EEEEEE] last:border-b-0 hover:bg-[#FAFAFA]"
                  >
                    {/* Doctor ID */}
                    <td className="px-5 py-4">
                      <span className="font-medium text-[#2F6FED]">
                        {doctor.doctor_id || "-"}
                      </span>
                    </td>

                    {/* Doctor */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold text-[#212121]">
                          {doctor.full_name || "-"}
                        </p>

                        <p className="mt-1 text-xs text-[#7A7A7A]">
                          {doctor.email || doctor.phone || "-"}
                        </p>
                      </div>
                    </td>

                    {/* Specialty */}
                    <td className="px-5 py-4 text-sm text-[#212121]">
                      {doctor.specialty || "-"}
                    </td>

                    {/* Experience */}
                    <td className="px-5 py-4 text-sm text-[#212121]">
                      {doctor.years_of_experience ?? 0} years
                    </td>

                    {/* Hospital */}
                    <td className="px-5 py-4 text-sm text-[#212121]">
                      {doctor.hospital_name || "-"}
                    </td>

                    {/* Fee */}
                    <td className="px-5 py-4 text-sm font-medium text-[#212121]">
                      {formatFee(doctor.consultation_fee)}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      {doctor.status === "ACTIVE" ? (
                        <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-[#16A34A]">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-[#DC2626]">
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">

                        {/* View */}
                        <button
                          onClick={() =>
                            navigate(`/doctors/${doctor.id}`)
                          }
                          title="View"
                          className="rounded-lg p-2 text-[#7A7A7A] transition hover:bg-[#EEF4FF] hover:text-[#2F6FED]"
                        >
                          <Eye size={17} />
                        </button>

                        {/* Edit */}
                        {canEdit(
                          permissions,
                          "doctors"
                        ) && (
                          <button
                            onClick={() =>
                              navigate(
                                `/doctors/${doctor.id}/edit`
                              )
                            }
                            title="Edit"
                            className="rounded-lg p-2 text-[#7A7A7A] transition hover:bg-blue-50 hover:text-[#2F6FED]"
                          >
                            <Pencil size={17} />
                          </button>
                        )}

                        {/* Delete */}
                        {canDelete(
                          permissions,
                          "doctors"
                        ) && (
                          <button
                            onClick={() =>
                              handleDelete(
                                doctor.id,
                                doctor.full_name
                              )
                            }
                            title="Delete"
                            className="rounded-lg p-2 text-[#7A7A7A] transition hover:bg-red-50 hover:text-[#DC2626]"
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
        )}
      </div>
    </div>
  );
};

export default Doctors;
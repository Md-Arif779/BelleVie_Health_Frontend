import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Plus,
  Search,
  RefreshCw,
  Eye,
  Pencil,
  Trash2,
  MapPin,
  Phone,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import {
  getHospitals,
  deleteHospital,
} from "../../services/hospitalService";

import { useAuth } from "../../context/AuthContext";
import {
  canAdd,
  canEdit,
  canDelete,
} from "../../utils/permission";


function Hospitals() {
  const navigate = useNavigate();

  const { permissions } = useAuth();

  const [hospitals, setHospitals] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [deletingId, setDeletingId] = useState(null);


  // =========================
  // LOAD HOSPITALS
  // =========================

  const loadHospitals = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getHospitals();

      const hospitalList = Array.isArray(data)
        ? data
        : data?.results || [];

      setHospitals(hospitalList);
    } catch (err) {
      console.error("Hospitals Error:", err);

      setError(
        err?.response?.data?.detail ||
        "Failed to load hospitals."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadHospitals();
  }, []);


  // =========================
  // SEARCH
  // =========================

  const filteredHospitals = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return hospitals;
    }

    return hospitals.filter((hospital) => {
      return (
        hospital.hospital_id
          ?.toLowerCase()
          .includes(keyword) ||

        hospital.name
          ?.toLowerCase()
          .includes(keyword) ||

        hospital.location
          ?.toLowerCase()
          .includes(keyword) ||

        hospital.phone
          ?.toLowerCase()
          .includes(keyword) ||

        hospital.email
          ?.toLowerCase()
          .includes(keyword)
      );
    });
  }, [hospitals, search]);


  // =========================
  // STATS
  // =========================

  const totalHospitals = hospitals.length;

  const activeHospitals = hospitals.filter(
    (hospital) => hospital.status === "ACTIVE"
  ).length;

  const inactiveHospitals = hospitals.filter(
    (hospital) => hospital.status === "INACTIVE"
  ).length;


  // =========================
  // DELETE
  // =========================

  const handleDelete = async (hospital) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${hospital.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(hospital.id);

      await deleteHospital(hospital.id);

      setHospitals((prev) =>
        prev.filter((item) => item.id !== hospital.id)
      );
    } catch (err) {
      console.error("Delete Hospital Error:", err);

      alert(
        err?.response?.data?.detail ||
        "Failed to delete hospital."
      );
    } finally {
      setDeletingId(null);
    }
  };


  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">

      {/* =========================
          HEADER
      ========================= */}

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D9F7E8]">
              <Building2
                size={23}
                className="text-[#2F6FED]"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#212121]">
                Hospitals
              </h1>

              <p className="text-sm text-[#7A7A7A]">
                Manage healthcare provider hospitals
              </p>
            </div>

          </div>
        </div>


        <div className="flex items-center gap-3">

          {/* Refresh */}

          <button
            type="button"
            onClick={loadHospitals}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-medium text-[#212121] transition hover:bg-[#EEF4FF] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />

            Refresh
          </button>


          {/* Add Hospital */}

          {canAdd(permissions, "hospitals") && (
            <button
              type="button"
              onClick={() => navigate("/hospitals/add")}
              className="flex items-center gap-2 rounded-lg bg-[#2F6FED] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2459C7]"
            >
              <Plus size={18} />

              Add Hospital
            </button>
          )}

        </div>

      </div>


      {/* =========================
          STATS
      ========================= */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

        {/* Total */}

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-[#7A7A7A]">
                Total Hospitals
              </p>

              <h2 className="mt-1 text-2xl font-bold text-[#212121]">
                {totalHospitals}
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF4FF]">
              <Building2
                size={20}
                className="text-[#2F6FED]"
              />
            </div>

          </div>

        </div>


        {/* Active */}

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-[#7A7A7A]">
                Active
              </p>

              <h2 className="mt-1 text-2xl font-bold text-[#16A34A]">
                {activeHospitals}
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <CheckCircle2
                size={20}
                className="text-[#16A34A]"
              />
            </div>

          </div>

        </div>


        {/* Inactive */}

        <div className="rounded-xl border border-[#E5E7EB] bg-white p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm text-[#7A7A7A]">
                Inactive
              </p>

              <h2 className="mt-1 text-2xl font-bold text-[#DC2626]">
                {inactiveHospitals}
              </h2>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
              <XCircle
                size={20}
                className="text-[#DC2626]"
              />
            </div>

          </div>

        </div>

      </div>


      {/* =========================
          SEARCH
      ========================= */}

      <div className="mb-5 rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm">

        <div className="relative max-w-xl">

          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search by hospital ID, name, location, phone or email..."
            className="w-full rounded-lg border border-[#E5E7EB] py-2.5 pl-10 pr-4 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
          />

        </div>

      </div>


      {/* =========================
          ERROR
      ========================= */}

      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-[#DC2626]">
          {error}
        </div>
      )}


      {/* =========================
          TABLE
      ========================= */}

      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">

        {loading ? (

          <div className="flex min-h-[300px] items-center justify-center">

            <div className="flex items-center gap-3 text-sm text-[#7A7A7A]">

              <RefreshCw
                size={19}
                className="animate-spin text-[#2F6FED]"
              />

              Loading hospitals...

            </div>

          </div>

        ) : filteredHospitals.length === 0 ? (

          <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#EEF4FF]">
              <Building2
                size={25}
                className="text-[#2F6FED]"
              />
            </div>

            <h3 className="text-base font-semibold text-[#212121]">
              No hospitals found
            </h3>

            <p className="mt-1 max-w-md text-sm text-[#7A7A7A]">
              {search
                ? "Try a different search keyword."
                : "No hospitals have been added yet."}
            </p>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1000px]">

              <thead className="border-b border-[#E5E7EB] bg-[#F9FAFB]">

                <tr>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Hospital ID
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Hospital
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

                {filteredHospitals.map((hospital) => (

                  <tr
                    key={hospital.id}
                    className="transition hover:bg-[#F9FAFB]"
                  >

                    {/* Hospital ID */}

                    <td className="px-5 py-4">

                      <span className="font-mono text-sm font-medium text-[#2F6FED]">
                        {hospital.hospital_id || "-"}
                      </span>

                    </td>


                    {/* Hospital */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#D9F7E8]">
                          <Building2
                            size={19}
                            className="text-[#2F6FED]"
                          />
                        </div>

                        <div>
                          <p className="font-semibold text-[#212121]">
                            {hospital.name || "-"}
                          </p>

                          {hospital.email && (
                            <p className="mt-0.5 text-xs text-[#7A7A7A]">
                              {hospital.email}
                            </p>
                          )}
                        </div>

                      </div>

                    </td>


                    {/* Location */}

                    <td className="px-5 py-4">

                      <div className="flex items-start gap-2 text-sm text-[#212121]">

                        <MapPin
                          size={16}
                          className="mt-0.5 shrink-0 text-[#7A7A7A]"
                        />

                        <span>
                          {hospital.location || "-"}
                        </span>

                      </div>

                    </td>


                    {/* Contact */}

                    <td className="px-5 py-4">

                      {hospital.phone ? (

                        <div className="flex items-center gap-2 text-sm text-[#212121]">

                          <Phone
                            size={16}
                            className="text-[#7A7A7A]"
                          />

                          {hospital.phone}

                        </div>

                      ) : (
                        <span className="text-sm text-[#7A7A7A]">
                          -
                        </span>
                      )}

                    </td>


                    {/* Status */}

                    <td className="px-5 py-4">

                      {hospital.status === "ACTIVE" ? (

                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-[#16A34A]">

                          <CheckCircle2 size={14} />

                          Active

                        </span>

                      ) : (

                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-[#DC2626]">

                          <XCircle size={14} />

                          Inactive

                        </span>

                      )}

                    </td>


                    {/* Actions */}

                    <td className="px-5 py-4">

                      <div className="flex items-center justify-end gap-2">

                        {/* View */}

                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/hospitals/${hospital.id}`)
                          }
                          title="View"
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#7A7A7A] transition hover:border-[#2F6FED] hover:bg-[#EEF4FF] hover:text-[#2F6FED]"
                        >
                          <Eye size={17} />
                        </button>


                        {/* Edit */}

                        {canEdit(permissions, "hospitals") && (
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/hospitals/${hospital.id}/edit`
                              )
                            }
                            title="Edit"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#7A7A7A] transition hover:border-[#2F6FED] hover:bg-[#EEF4FF] hover:text-[#2F6FED]"
                          >
                            <Pencil size={17} />
                          </button>
                        )}


                        {/* Delete */}

                        {canDelete(permissions, "hospitals") && (
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(hospital)
                            }
                            disabled={deletingId === hospital.id}
                            title="Delete"
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E5E7EB] text-[#7A7A7A] transition hover:border-red-200 hover:bg-red-50 hover:text-[#DC2626] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId === hospital.id ? (
                              <RefreshCw
                                size={17}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2 size={17} />
                            )}
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


      {/* =========================
          RESULT COUNT
      ========================= */}

      {!loading && filteredHospitals.length > 0 && (
        <div className="mt-4 text-sm text-[#7A7A7A]">
          Showing{" "}
          <span className="font-semibold text-[#212121]">
            {filteredHospitals.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-[#212121]">
            {hospitals.length}
          </span>{" "}
          hospitals
        </div>
      )}

    </div>
  );
}

export default Hospitals;
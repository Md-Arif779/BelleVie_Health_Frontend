
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";

import {
  getMembers,
  deleteMember,
} from "../../services/memberService";

function Members() {
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [gender, setGender] = useState("");

  const [deletingId, setDeletingId] = useState(null);

  const loadMembers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMembers({
        search: search || undefined,
        status: status || undefined,
        gender: gender || undefined,
      });

      setMembers(data.results || data);
    } catch (err) {
      console.error("Members Error:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to load members."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [search, status, gender]);

  const handleViewMember = (id) => {
    navigate(`/members/${id}`);
  };

  const handleEditMember = (id) => {
    navigate(`/members/${id}/edit`);
  };

  const handleAddMember = () => {
    navigate("/members/add");
  };

  const handleDeleteMember = async (member) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${member.full_name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(member.id);
      setError("");

      await deleteMember(member.id);

      setMembers((previousMembers) =>
        previousMembers.filter(
          (item) => item.id !== member.id
        )
      );
    } catch (err) {
      console.error("Delete Member Error:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to delete member."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "ACTIVE":
        return (
          <span className="inline-flex rounded-full bg-[#D9F7E8] px-3 py-1 text-xs font-semibold text-[#166534]">
            Active
          </span>
        );

      case "INACTIVE":
        return (
          <span className="inline-flex rounded-full bg-[#F3F4F6] px-3 py-1 text-xs font-semibold text-[#6B7280]">
            Inactive
          </span>
        );

      case "SUSPENDED":
        return (
          <span className="inline-flex rounded-full bg-[#FEF3C7] px-3 py-1 text-xs font-semibold text-[#92400E]">
            Suspended
          </span>
        );

      default:
        return (
          <span className="inline-flex rounded-full bg-[#F3F4F6] px-3 py-1 text-xs font-semibold text-[#6B7280]">
            {status || "Unknown"}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-[#212121]">
            Members
          </h1>

          <p className="mt-1 text-sm text-[#7A7A7A]">
            Manage BelleVie Health members
          </p>
        </div>

        <button
          type="button"
          onClick={handleAddMember}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2F6FED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2459C7]"
        >
          <Plus size={18} />
          Add Member
        </button>

      </div>


      {/* ================= ERROR ================= */}
      {error && (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">

          <p className="text-sm font-medium text-[#DC2626]">
            {error}
          </p>

          <button
            type="button"
            onClick={loadMembers}
            className="shrink-0 text-sm font-semibold text-[#2F6FED] hover:underline"
          >
            Try Again
          </button>

        </div>
      )}


      {/* ================= FILTERS ================= */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm">

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

          {/* SEARCH */}
          <div className="relative">

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
              placeholder="Search member..."
              className="w-full rounded-lg border border-[#E5E7EB] py-3 pl-10 pr-4 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED] focus:ring-1 focus:ring-[#2F6FED]"
            />

          </div>


          {/* STATUS */}
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
            className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED] focus:ring-1 focus:ring-[#2F6FED]"
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

            <option value="SUSPENDED">
              Suspended
            </option>
          </select>


          {/* GENDER */}
          <select
            value={gender}
            onChange={(e) =>
              setGender(e.target.value)
            }
            className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED] focus:ring-1 focus:ring-[#2F6FED]"
          >
            <option value="">
              All Gender
            </option>

            <option value="MALE">
              Male
            </option>

            <option value="FEMALE">
              Female
            </option>

            <option value="OTHER">
              Other
            </option>
          </select>

        </div>

      </div>


      {/* ================= MEMBERS TABLE ================= */}
      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="min-w-full">

            {/* TABLE HEADER */}
            <thead className="border-b border-[#E5E7EB] bg-[#F8FAFC]">

              <tr>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                  Member ID
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                  Name
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                  Phone
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                  Gender
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                  Registration
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                  Actions
                </th>

              </tr>

            </thead>


            {/* TABLE BODY */}
            <tbody className="divide-y divide-[#E5E7EB]">

              {/* LOADING */}
              {loading && (
                <tr>

                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center"
                  >

                    <div className="flex flex-col items-center gap-3">

                      <Loader2
                        size={28}
                        className="animate-spin text-[#2F6FED]"
                      />

                      <span className="text-sm text-[#7A7A7A]">
                        Loading members...
                      </span>

                    </div>

                  </td>

                </tr>
              )}


              {/* EMPTY */}
              {!loading &&
                members.length === 0 && (
                  <tr>

                    <td
                      colSpan="7"
                      className="px-6 py-12 text-center"
                    >

                      <div className="flex flex-col items-center">

                        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#D9F7E8] text-[#2F6FED]">
                          <Search size={22} />
                        </div>

                        <p className="text-sm font-semibold text-[#212121]">
                          No members found
                        </p>

                        <p className="mt-1 text-xs text-[#7A7A7A]">
                          Try changing your search or filters.
                        </p>

                      </div>

                    </td>

                  </tr>
                )}


              {/* MEMBER ROWS */}
              {!loading &&
                members.length > 0 &&
                members.map((member) => (

                  <tr
                    key={member.id}
                    className="transition hover:bg-[#F8FAFC]"
                  >

                    {/* MEMBER ID */}
                    <td className="whitespace-nowrap px-6 py-4">

                      <span className="text-sm font-semibold text-[#2F6FED]">
                        {member.member_id || "-"}
                      </span>

                    </td>


                    {/* NAME */}
                    <td className="px-6 py-4">

                      <div>

                        <p className="text-sm font-semibold text-[#212121]">
                          {member.full_name || "-"}
                        </p>

                        {member.email && (
                          <p className="mt-1 text-xs text-[#7A7A7A]">
                            {member.email}
                          </p>
                        )}

                      </div>

                    </td>


                    {/* PHONE */}
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[#212121]">
                      {member.phone || "-"}
                    </td>


                    {/* GENDER */}
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[#212121]">
                      {member.gender || "-"}
                    </td>


                    {/* STATUS */}
                    <td className="whitespace-nowrap px-6 py-4">
                      {getStatusBadge(member.status)}
                    </td>


                    {/* REGISTRATION */}
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-[#7A7A7A]">

                      {member.registration_date
                        ? new Date(
                            member.registration_date
                          ).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "-"}

                    </td>


                    {/* ACTIONS */}
                    <td className="whitespace-nowrap px-6 py-4">

                      <div className="flex items-center justify-end gap-2">

                        {/* VIEW */}
                        <button
                          type="button"
                          onClick={() =>
                            handleViewMember(member.id)
                          }
                          title="View Member"
                          className="inline-flex items-center justify-center rounded-lg border border-[#E5E7EB] bg-white p-2 text-[#2F6FED] transition hover:border-[#2F6FED] hover:bg-[#EEF4FF]"
                        >
                          <Eye size={17} />
                        </button>


                        {/* EDIT */}
                        <button
                          type="button"
                          onClick={() =>
                            handleEditMember(member.id)
                          }
                          title="Edit Member"
                          className="inline-flex items-center justify-center rounded-lg border border-[#E5E7EB] bg-white p-2 text-[#F59E0B] transition hover:border-[#F59E0B] hover:bg-[#FFFBEB]"
                        >
                          <Pencil size={17} />
                        </button>


                        {/* DELETE */}
                        <button
                          type="button"
                          onClick={() =>
                            handleDeleteMember(member)
                          }
                          disabled={
                            deletingId === member.id
                          }
                          title="Delete Member"
                          className="inline-flex items-center justify-center rounded-lg border border-[#E5E7EB] bg-white p-2 text-[#DC2626] transition hover:border-[#DC2626] hover:bg-[#FEF2F2] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === member.id ? (
                            <Loader2
                              size={17}
                              className="animate-spin"
                            />
                          ) : (
                            <Trash2 size={17} />
                          )}
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default Members;


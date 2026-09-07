import { useEffect, useState } from "react";
import {
  Search,
  Users,
  RefreshCw,
  AlertCircle,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import { canView } from "../../utils/permission";
import { getMemberReport } from "../../services/reportService";

const MemberReport = () => {
  const { permissions } = useAuth();
  const navigate = useNavigate();

  const [members, setMembers] = useState([]);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMembers = async () => {
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

      const data = await getMemberReport(params);

      setMembers(data?.results || []);
      setTotal(data?.total || 0);
    } catch (err) {
      console.error("Member Report Error:", err);

      setError(
        err?.response?.data?.detail ||
          "Failed to load member report."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [status]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadMembers();
  };

  const getStatusClass = (memberStatus) => {
    switch (memberStatus) {
      case "ACTIVE":
        return "bg-[#D9F7E8] text-[#15803D]";

      case "INACTIVE":
        return "bg-gray-100 text-gray-600";

      case "SUSPENDED":
        return "bg-red-50 text-red-600";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (!canView(permissions, "reports")) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-xl border border-[#E5E7EB] p-8 text-center">
          <AlertCircle
            size={42}
            className="mx-auto text-red-500 mb-3"
          />

          <h2 className="text-xl font-bold text-[#212121]">
            Permission Denied
          </h2>

          <p className="text-sm text-[#7A7A7A] mt-2">
            You do not have permission to view reports.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

          <div>
            <h1 className="text-2xl font-bold text-[#212121]">
              Member Report
            </h1>

            <p className="text-sm text-[#7A7A7A] mt-1">
              View and filter registered members
            </p>
          </div>

          <button
            type="button"
            onClick={loadMembers}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-[#E5E7EB] rounded-lg text-sm font-medium text-[#212121] hover:bg-gray-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

        </div>

        {/* SUMMARY */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 mb-6">

          <div className="flex items-center gap-4">

            <div className="w-11 h-11 rounded-xl bg-[#EEF4FF] flex items-center justify-center">
              <Users
                size={22}
                className="text-[#2F6FED]"
              />
            </div>

            <div>
              <p className="text-sm text-[#7A7A7A]">
                Total Members
              </p>

              <h2 className="text-2xl font-bold text-[#212121]">
                {total}
              </h2>
            </div>

          </div>

        </div>

        {/* FILTERS */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl p-5 mb-6">

          <form
            onSubmit={handleSearch}
            className="grid grid-cols-1 md:grid-cols-[1fr_200px_auto] gap-3"
          >

            {/* SEARCH */}
            <div className="relative">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search member by name..."
                className="w-full h-11 pl-10 pr-4 border border-[#E5E7EB] rounded-lg outline-none focus:border-[#2F6FED]"
              />

            </div>

            {/* STATUS */}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-11 px-3 border border-[#E5E7EB] rounded-lg bg-white outline-none focus:border-[#2F6FED]"
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

            {/* SEARCH BUTTON */}
            <button
              type="submit"
              className="h-11 px-5 rounded-lg bg-[#2F6FED] text-white font-medium hover:bg-[#2459C7]"
            >
              Search
            </button>

          </form>

        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-white border border-red-200 rounded-xl p-6 text-center mb-6">

            <AlertCircle
              size={36}
              className="mx-auto text-red-500 mb-2"
            />

            <p className="text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={loadMembers}
              className="mt-4 px-4 py-2 bg-[#2F6FED] text-white rounded-lg text-sm"
            >
              Try Again
            </button>

          </div>
        )}

        {/* TABLE */}
        <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">

          <div className="px-5 py-4 border-b border-[#E5E7EB]">

            <h2 className="font-semibold text-[#212121]">
              Members
            </h2>

          </div>

          {loading ? (
            <div className="py-16 flex justify-center">

              <RefreshCw
                size={28}
                className="animate-spin text-[#2F6FED]"
              />

            </div>
          ) : members.length === 0 ? (
            <div className="py-16 text-center">

              <Users
                size={40}
                className="mx-auto text-[#7A7A7A] mb-3"
              />

              <p className="text-[#7A7A7A]">
                No members found.
              </p>

            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                <thead>
                  <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">

                    <th className="px-5 py-3 text-left text-xs font-semibold text-[#7A7A7A] uppercase">
                      Member ID
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-[#7A7A7A] uppercase">
                      Name
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-[#7A7A7A] uppercase">
                      Phone
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-[#7A7A7A] uppercase">
                      Email
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-[#7A7A7A] uppercase">
                      Gender
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-[#7A7A7A] uppercase">
                      Registration Date
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold text-[#7A7A7A] uppercase">
                      Status
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-semibold text-[#7A7A7A] uppercase">
                      Action
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {members.map((member) => (
                    <tr
                      key={member.id}
                      className="border-b border-[#E5E7EB] last:border-b-0 hover:bg-[#F9FAFB]"
                    >

                      <td className="px-5 py-4 text-sm font-medium text-[#2F6FED]">
                        {member.member_id}
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-[#212121]">
                        {member.full_name}
                      </td>

                      <td className="px-5 py-4 text-sm text-[#7A7A7A]">
                        {member.phone || "-"}
                      </td>

                      <td className="px-5 py-4 text-sm text-[#7A7A7A]">
                        {member.email || "-"}
                      </td>

                      <td className="px-5 py-4 text-sm text-[#7A7A7A]">
                        {member.gender || "-"}
                      </td>

                      <td className="px-5 py-4 text-sm text-[#7A7A7A]">
                        {member.registration_date
                          ? new Date(
                              member.registration_date
                            ).toLocaleDateString("en-GB")
                          : "-"}
                      </td>

                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${getStatusClass(
                            member.status
                          )}`}
                        >
                          {member.status || "-"}
                        </span>

                      </td>

                      <td className="px-5 py-4 text-right">

                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/members/${member.id}`)
                          }
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-[#2F6FED] hover:bg-[#EEF4FF]"
                        >
                          <Eye size={16} />
                          View
                        </button>

                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </div>

      </div>

    </div>
  );
};

export default MemberReport;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  UserRound,
  RefreshCw,
} from "lucide-react";

import {
  getHealthProfiles,
  deleteHealthProfile,
} from "../../services/healthProfileService";

import { useAuth } from "../../context/AuthContext";

import {
  canAdd,
  canEdit,
  canDelete,
} from "../../utils/permission";

const HealthProfiles = () => {
  const navigate = useNavigate();

  const { permissions } = useAuth();

  const [profiles, setProfiles] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const showAdd = canAdd(
    permissions,
    "health_profiles"
  );

  const showEdit = canEdit(
    permissions,
    "health_profiles"
  );

  const showDelete = canDelete(
    permissions,
    "health_profiles"
  );

  const loadProfiles = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getHealthProfiles({
        search: search || undefined,
      });

      const results = Array.isArray(data)
        ? data
        : data?.results || [];

      setProfiles(results);
    } catch (err) {
      console.error(
        "Health Profiles Load Error:",
        err
      );

      setError(
        "Failed to load health profiles."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, [search]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this health profile?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteHealthProfile(id);

      await loadProfiles();
    } catch (err) {
      console.error(
        "Health Profile Delete Error:",
        err
      );

      setError(
        "Failed to delete health profile."
      );
    }
  };

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>
          <h1 className="text-2xl font-bold text-[#212121]">
            Health Profiles
          </h1>

          <p className="text-sm text-[#7A7A7A] mt-1">
            Manage member health profiles
          </p>
        </div>

        {showAdd && (
          <button
            type="button"
            onClick={() =>
              navigate("/health-profiles/add")
            }
            className="
              h-11
              px-5
              rounded-lg
              bg-[#2F6FED]
              text-white
              text-sm
              font-medium
              flex
              items-center
              justify-center
              gap-2
              hover:bg-[#2459C7]
              transition
            "
          >
            <Plus size={18} />
            Add Health Profile
          </button>
        )}

      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 mb-6">

        <div className="relative max-w-md">

          <Search
            size={18}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-[#7A7A7A]
            "
          />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search health profiles..."
            className="
              w-full
              h-11
              rounded-lg
              border
              border-[#E5E7EB]
              pl-10
              pr-4
              text-sm
              text-[#212121]
              outline-none
              focus:border-[#2F6FED]
              focus:ring-2
              focus:ring-[#2F6FED]/10
            "
          />

        </div>

      </div>

      {/* Error */}
      {error && (
        <div
          className="
            mb-5
            rounded-lg
            bg-red-50
            border
            border-red-200
            px-4
            py-3
            text-sm
            text-red-600
          "
        >
          {error}
        </div>
      )}

      {/* Table */}
      <div
        className="
          bg-white
          rounded-2xl
          border
          border-[#E5E7EB]
          overflow-hidden
        "
      >

        <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div
              className="
                w-10
                h-10
                rounded-xl
                bg-[#D9F7E8]
                flex
                items-center
                justify-center
                text-[#2F6FED]
              "
            >
              <UserRound size={20} />
            </div>

            <div>
              <h2 className="text-base font-semibold text-[#212121]">
                Health Profiles
              </h2>

              <p className="text-xs text-[#7A7A7A] mt-0.5">
                {profiles.length} profile
                {profiles.length !== 1 ? "s" : ""}
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={loadProfiles}
            className="
              w-9
              h-9
              rounded-lg
              border
              border-[#E5E7EB]
              bg-white
              flex
              items-center
              justify-center
              text-[#7A7A7A]
              hover:bg-[#F2F2F2]
              transition
            "
            title="Refresh"
          >
            <RefreshCw size={17} />
          </button>

        </div>

        {loading ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <p className="text-sm text-[#7A7A7A]">
              Loading health profiles...
            </p>
          </div>
        ) : profiles.length === 0 ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <div className="text-center">

              <div
                className="
                  w-14
                  h-14
                  mx-auto
                  mb-4
                  rounded-2xl
                  bg-[#F2F2F2]
                  flex
                  items-center
                  justify-center
                  text-[#7A7A7A]
                "
              >
                <UserRound size={24} />
              </div>

              <h3 className="text-base font-semibold text-[#212121]">
                No Health Profiles Found
              </h3>

              <p className="text-sm text-[#7A7A7A] mt-1">
                No health profiles are available.
              </p>

            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">

                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#7A7A7A]">
                    ID
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#7A7A7A]">
                    Member
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-[#7A7A7A]">
                    Created
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold text-[#7A7A7A]">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {profiles.map((profile) => {

                  const memberName =
                    profile.member_name ||
                    profile.member?.full_name ||
                    profile.member ||
                    "-";

                  return (
                    <tr
                      key={profile.id}
                      className="
                        border-b
                        border-[#E5E7EB]
                        last:border-b-0
                        hover:bg-[#FAFAFA]
                        transition
                      "
                    >

                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-[#212121]">
                          {profile.id || "-"}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-medium text-[#212121]">
                            {memberName}
                          </p>

                          {profile.member_id && (
                            <p className="text-xs text-[#7A7A7A] mt-0.5">
                              {profile.member_id}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-sm text-[#7A7A7A]">
                          {profile.created_at || "-"}
                        </span>
                      </td>

                      <td className="px-6 py-4">

                        <div className="flex items-center justify-end gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/health-profiles/${profile.id}`
                              )
                            }
                            className="
                              w-9
                              h-9
                              rounded-lg
                              border
                              border-[#E5E7EB]
                              bg-white
                              flex
                              items-center
                              justify-center
                              text-[#7A7A7A]
                              hover:bg-[#F2F2F2]
                              transition
                            "
                            title="View"
                          >
                            <Eye size={17} />
                          </button>

                          {showEdit && (
                            <button
                              type="button"
                              onClick={() =>
                                navigate(
                                  `/health-profiles/${profile.id}/edit`
                                )
                              }
                              className="
                                w-9
                                h-9
                                rounded-lg
                                border
                                border-[#E5E7EB]
                                bg-white
                                flex
                                items-center
                                justify-center
                                text-[#2F6FED]
                                hover:bg-[#EEF4FF]
                                transition
                              "
                              title="Edit"
                            >
                              <Pencil size={17} />
                            </button>
                          )}

                          {showDelete && (
                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(profile.id)
                              }
                              className="
                                w-9
                                h-9
                                rounded-lg
                                border
                                border-[#E5E7EB]
                                bg-white
                                flex
                                items-center
                                justify-center
                                text-red-500
                                hover:bg-red-50
                                transition
                              "
                              title="Delete"
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

export default HealthProfiles;
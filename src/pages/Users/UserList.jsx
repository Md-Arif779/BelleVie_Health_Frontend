import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  UserRound,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import {
  getUsers,
  deleteUser,
} from "../../services/userService";

const UserList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // --------------------------------------------------
  // Super Admin only
  // --------------------------------------------------

  if (!user?.is_superuser) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-10 text-center">
          <ShieldCheck
            size={44}
            className="mx-auto text-[#DC2626] mb-4"
          />

          <h2 className="text-xl font-bold text-[#212121]">
            Access Denied
          </h2>

          <p className="text-sm text-[#7A7A7A] mt-2">
            Only Super Admin can manage system users.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              px-5
              h-10
              rounded-xl
              bg-[#2F6FED]
              text-white
              text-sm
              font-semibold
              hover:bg-[#2459C7]
              transition
            "
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Load users
  // --------------------------------------------------

  const loadUsers = async () => {
    try {
      setLoading(true);

      const response = await getUsers();

      setUsers(response?.users || []);
    } catch (error) {
      console.error("Failed to load users:", error);

      alert(
        error?.response?.data?.detail ||
          "Failed to load users."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  // --------------------------------------------------
  // Delete user
  // --------------------------------------------------

  const handleDelete = async (selectedUser) => {
    if (selectedUser.id === user?.id) {
      alert("You cannot delete your own account.");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete user "${selectedUser.username}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteUser(selectedUser.id);

      setUsers((prev) =>
        prev.filter(
          (item) => item.id !== selectedUser.id
        )
      );

      alert("User deleted successfully.");
    } catch (error) {
      console.error("Failed to delete user:", error);

      alert(
        error?.response?.data?.detail ||
          "Failed to delete user."
      );
    }
  };

  // --------------------------------------------------
  // Search
  // --------------------------------------------------

  const filteredUsers = users.filter((item) => {
    const searchValue = search
      .trim()
      .toLowerCase();

    if (!searchValue) {
      return true;
    }

    const searchableText = [
      item.username,
      item.email,
      item.first_name,
      item.last_name,
      item.employee_id,
      item.role,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return searchableText.includes(searchValue);
  });

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-10 text-center">
          <div
            className="
              w-8
              h-8
              border-4
              border-[#EEF4FF]
              border-t-[#2F6FED]
              rounded-full
              animate-spin
              mx-auto
            "
          />

          <p className="text-sm text-[#7A7A7A] mt-4">
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* -------------------------------------------- */}
      {/* Header */}
      {/* -------------------------------------------- */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#212121]">
            Users
          </h1>

          <p className="text-sm text-[#7A7A7A] mt-1">
            Manage staff accounts and their module access.
          </p>
        </div>

        <Link
          to="/users/add"
          className="
            inline-flex
            items-center
            justify-center
            gap-2
            px-5
            h-11
            rounded-xl
            bg-[#2F6FED]
            text-white
            text-sm
            font-semibold
            hover:bg-[#2459C7]
            transition
          "
        >
          <Plus size={18} />
          Add User
        </Link>
      </div>

      {/* -------------------------------------------- */}
      {/* Search */}
      {/* -------------------------------------------- */}

      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-4 mb-5">
        <div className="relative max-w-md">
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
            placeholder="Search users..."
            className="
              w-full
              h-11
              pl-10
              pr-4
              rounded-xl
              border
              border-[#E5E7EB]
              bg-white
              text-sm
              text-[#212121]
              outline-none
              focus:border-[#2F6FED]
              focus:ring-2
              focus:ring-[#EEF4FF]
            "
          />
        </div>
      </div>

      {/* -------------------------------------------- */}
      {/* User Table */}
      {/* -------------------------------------------- */}

      <div className="bg-white rounded-2xl border border-[#E5E7EB] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E5E7EB]">
                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#7A7A7A]">
                  User
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#7A7A7A]">
                  Employee ID
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#7A7A7A]">
                  Role
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#7A7A7A]">
                  Email
                </th>

                <th className="text-left px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#7A7A7A]">
                  Status
                </th>

                <th className="text-right px-5 py-4 text-xs font-bold uppercase tracking-wide text-[#7A7A7A]">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-5 py-12 text-center"
                  >
                    <UserRound
                      size={38}
                      className="mx-auto text-[#D1D5DB]"
                    />

                    <p className="text-sm font-semibold text-[#4B5563] mt-3">
                      No users found
                    </p>

                    <p className="text-xs text-[#9CA3AF] mt-1">
                      Try a different search term.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((item) => {
                  const isCurrentUser =
                    item.id === user?.id;

                  return (
                    <tr
                      key={item.id}
                      className="
                        border-b
                        border-[#F0F1F3]
                        last:border-b-0
                        hover:bg-[#FAFBFC]
                        transition
                      "
                    >
                      {/* User */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="
                              w-10
                              h-10
                              rounded-xl
                              bg-[#EEF4FF]
                              text-[#2F6FED]
                              flex
                              items-center
                              justify-center
                              shrink-0
                            "
                          >
                            <UserRound size={18} />
                          </div>

                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#212121] truncate">
                              {item.first_name ||
                              item.last_name
                                ? `${item.first_name || ""} ${
                                    item.last_name || ""
                                  }`.trim()
                                : item.username}
                            </p>

                            <p className="text-xs text-[#7A7A7A] mt-0.5">
                              @{item.username}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Employee ID */}
                      <td className="px-5 py-4">
                        <span className="text-sm text-[#4B5563]">
                          {item.employee_id || "—"}
                        </span>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-4">
                        {item.is_superuser ? (
                          <span
                            className="
                              inline-flex
                              items-center
                              gap-1.5
                              px-2.5
                              py-1
                              rounded-full
                              bg-[#EEF4FF]
                              text-[#2F6FED]
                              text-xs
                              font-semibold
                            "
                          >
                            <ShieldCheck size={13} />
                            Super Admin
                          </span>
                        ) : (
                          <span className="text-sm text-[#4B5563]">
                            {item.role || "Staff"}
                          </span>
                        )}
                      </td>

                      {/* Email */}
                      <td className="px-5 py-4">
                        <span className="text-sm text-[#4B5563]">
                          {item.email || "—"}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        {item.is_active ? (
                          <span
                            className="
                              inline-flex
                              items-center
                              px-2.5
                              py-1
                              rounded-full
                              bg-[#DCFCE7]
                              text-[#166534]
                              text-xs
                              font-semibold
                            "
                          >
                            Active
                          </span>
                        ) : (
                          <span
                            className="
                              inline-flex
                              items-center
                              px-2.5
                              py-1
                              rounded-full
                              bg-[#FEE2E2]
                              text-[#991B1B]
                              text-xs
                              font-semibold
                            "
                          >
                            Inactive
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {/* Edit */}
                          <Link
                            to={`/users/${item.id}/edit`}
                            className="
                              w-9
                              h-9
                              rounded-lg
                              flex
                              items-center
                              justify-center
                              text-[#7A7A7A]
                              bg-[#F8FAFC]
                              hover:bg-[#EEF4FF]
                              hover:text-[#2F6FED]
                              transition
                            "
                            title="Edit User"
                          >
                            <Pencil size={16} />
                          </Link>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(item)
                            }
                            disabled={isCurrentUser}
                            className="
                              w-9
                              h-9
                              rounded-lg
                              flex
                              items-center
                              justify-center
                              text-[#7A7A7A]
                              bg-[#F8FAFC]
                              hover:bg-[#FEE2E2]
                              hover:text-[#DC2626]
                              transition
                              disabled:opacity-30
                              disabled:cursor-not-allowed
                            "
                            title={
                              isCurrentUser
                                ? "You cannot delete your own account"
                                : "Delete User"
                            }
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {filteredUsers.length > 0 && (
          <div className="px-5 py-4 border-t border-[#E5E7EB] bg-[#FAFBFC]">
            <p className="text-xs text-[#7A7A7A]">
              Showing{" "}
              <span className="font-semibold text-[#4B5563]">
                {filteredUsers.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#4B5563]">
                {users.length}
              </span>{" "}
              users
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
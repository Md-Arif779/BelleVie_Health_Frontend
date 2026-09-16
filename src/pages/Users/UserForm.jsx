import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, ShieldCheck } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import {
  createUser,
  getUser,
  updateUser,
} from "../../services/userService";

const MODULES = [
  {
    group: "Overview",
    items: [
      {
        key: "dashboard",
        label: "Dashboard",
      },
    ],
  },

  {
    group: "People",
    items: [
      {
        key: "members",
        label: "Members",
      },
    ],
  },

  {
    group: "Healthcare",
    items: [
      {
        key: "health_cards",
        label: "Health Cards",
      },
      {
        key: "health_profiles",
        label: "Health Profiles",
      },
      {
        key: "health_records",
        label: "Health Records",
      },
      {
        key: "health_plans",
        label: "Health Plans",
      },
      {
        key: "record_documents",
        label: "Record Documents",
      },
    ],
  },

  {
    group: "Providers",
    items: [
      {
        key: "doctors",
        label: "Doctors",
      },
      {
        key: "hospitals",
        label: "Hospitals",
      },
      {
        key: "diagnostic_centers",
        label: "Diagnostic Centers",
      },
      {
        key: "pharmacies",
        label: "Pharmacies",
      },
    ],
  },

  {
    group: "Services",
    items: [
      {
        key: "services",
        label: "Services",
      },
      {
        key: "appointments",
        label: "Appointments",
      },
      {
        key: "telemedicine",
        label: "Telemedicine",
      },
      {
        key: "hospital_bookings",
        label: "Hospital Bookings",
      },
      {
        key: "home_healthcare",
        label: "Home Healthcare",
      },
      {
        key: "lab_tests",
        label: "Lab Tests",
      },
      {
        key: "lab_results",
        label: "Lab Results",
      },
      {
        key: "prescriptions",
        label: "Prescriptions",
      },
    ],
  },

  {
    group: "Insurance",
    items: [
      {
        key: "insurance_policies",
        label: "Insurance Policies",
      },
      {
        key: "insurance_claims",
        label: "Insurance Claims",
      },
    ],
  },

  {
    group: "Operations",
    items: [
      {
        key: "medicine_orders",
        label: "Medicine Orders",
      },
      {
        key: "organizations",
        label: "Organizations",
      },
      {
        key: "ambulance",
        label: "Ambulance",
      },
      {
        key: "medical_tourism",
        label: "Medical Tourism",
      },
      {
        key: "partners",
        label: "Partners",
      },
      {
        key: "crm",
        label: "CRM",
      },
    ],
  },

  {
    group: "Finance",
    items: [
      {
        key: "invoices",
        label: "Invoices",
      },
      {
        key: "payments",
        label: "Payments",
      },
    ],
  },

  {
    group: "Analytics",
    items: [
      {
        key: "reports",
        label: "Reports",
      },
    ],
  },
];

const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { user } = useAuth();

  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditMode);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone: "",
    employee_id: "",
    role: "",
    is_active: true,
  });

  const [selectedModules, setSelectedModules] = useState({});

  // --------------------------------------------------
  // Super Admin only
  // --------------------------------------------------

  if (!user?.is_superuser) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-2xl border border-[#E5E7EB] p-10 text-center">
          <ShieldCheck
            size={42}
            className="mx-auto text-[#DC2626] mb-4"
          />

          <h2 className="text-xl font-bold text-[#212121]">
            Access Denied
          </h2>

          <p className="text-sm text-[#7A7A7A] mt-2">
            Only Super Admin can manage users and permissions.
          </p>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="
              mt-6
              px-5
              py-2.5
              rounded-xl
              bg-[#2F6FED]
              text-white
              text-sm
              font-semibold
              hover:bg-[#2459C7]
              transition
            "
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // Load user for edit
  // --------------------------------------------------

  useEffect(() => {
    if (!isEditMode) {
      setInitialLoading(false);
      return;
    }

    const loadUser = async () => {
      try {
        const response = await getUser(id);

        const userData = response.user || {};

        setFormData({
          username: userData.username || "",
          email: userData.email || "",
          password: "",
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
          phone: userData.phone || "",
          employee_id: userData.employee_id || "",
          role: userData.role || "",
          is_active: userData.is_active ?? true,
        });

        const modules = {};

        (response.permissions || []).forEach((permission) => {
          if (permission.module) {
            modules[permission.module] = true;
          }
        });

        setSelectedModules(modules);
      } catch (error) {
        console.error("Failed to load user:", error);

        alert(
          error?.response?.data?.detail ||
            "Failed to load user."
        );

        navigate("/users");
      } finally {
        setInitialLoading(false);
      }
    };

    loadUser();
  }, [id, isEditMode, navigate]);

  // --------------------------------------------------
  // Form input
  // --------------------------------------------------

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // --------------------------------------------------
  // Module checkbox
  // --------------------------------------------------

  const handleModuleChange = (moduleKey) => {
    setSelectedModules((prev) => ({
      ...prev,
      [moduleKey]: !prev[moduleKey],
    }));
  };

  // --------------------------------------------------
  // Select all modules
  // --------------------------------------------------

  const handleSelectAll = () => {
    const allModules = {};

    MODULES.forEach((group) => {
      group.items.forEach((module) => {
        allModules[module.key] = true;
      });
    });

    setSelectedModules(allModules);
  };

  // --------------------------------------------------
  // Clear all modules
  // --------------------------------------------------

  const handleClearAll = () => {
    setSelectedModules({});
  };

  // --------------------------------------------------
  // Submit
  // --------------------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    try {
      const permissions = Object.entries(selectedModules)
        .filter(([, enabled]) => enabled)
        .map(([module]) => ({
          module,
        }));

      const payload = {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        employee_id: formData.employee_id,
        role: formData.role,
        is_active: formData.is_active,
        permissions,
      };

      // Password is required during create
      if (!isEditMode) {
        payload.password = formData.password;
      }

      // Password is optional during edit
      if (isEditMode && formData.password.trim()) {
        payload.password = formData.password;
      }

      if (isEditMode) {
        await updateUser(id, payload);

        alert("User updated successfully.");
      } else {
        await createUser(payload);

        alert("User created successfully.");
      }

      navigate("/users");
    } catch (error) {
      console.error("User save failed:", error);

      const errorData = error?.response?.data;

      if (typeof errorData === "object") {
        const messages = Object.entries(errorData)
          .map(([field, message]) => {
            const text = Array.isArray(message)
              ? message.join(", ")
              : String(message);

            return `${field}: ${text}`;
          })
          .join("\n");

        alert(messages || "Failed to save user.");
      } else {
        alert("Failed to save user.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (initialLoading) {
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
            Loading user...
          </p>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/users")}
            className="
              w-10
              h-10
              rounded-xl
              border
              border-[#E5E7EB]
              bg-white
              flex
              items-center
              justify-center
              text-[#7A7A7A]
              hover:text-[#2F6FED]
              hover:bg-[#EEF4FF]
              transition
            "
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <h1 className="text-2xl font-bold text-[#212121]">
              {isEditMode ? "Edit User" : "Add User"}
            </h1>

            <p className="text-sm text-[#7A7A7A] mt-1">
              {isEditMode
                ? "Update staff account and module access."
                : "Create a staff account and assign module access."}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* ---------------------------------------- */}
          {/* User Information */}
          {/* ---------------------------------------- */}

          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-[#212121]">
                  User Information
                </h2>

                <p className="text-xs text-[#7A7A7A] mt-1">
                  Basic information for the staff account.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Username */}
                <div>
                  <label className="block text-sm font-semibold text-[#212121] mb-2">
                    Username
                    <span className="text-[#DC2626] ml-1">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="
                      w-full
                      h-11
                      px-4
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
                    placeholder="Enter username"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-[#212121] mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="
                      w-full
                      h-11
                      px-4
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
                    placeholder="Enter email"
                  />
                </div>

                {/* First Name */}
                <div>
                  <label className="block text-sm font-semibold text-[#212121] mb-2">
                    First Name
                  </label>

                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="
                      w-full
                      h-11
                      px-4
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
                    placeholder="Enter first name"
                  />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-semibold text-[#212121] mb-2">
                    Last Name
                  </label>

                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="
                      w-full
                      h-11
                      px-4
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
                    placeholder="Enter last name"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-[#212121] mb-2">
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="
                      w-full
                      h-11
                      px-4
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
                    placeholder="Enter phone number"
                  />
                </div>

                {/* Employee ID */}
                <div>
                  <label className="block text-sm font-semibold text-[#212121] mb-2">
                    Employee ID
                  </label>

                  <input
                    type="text"
                    name="employee_id"
                    value={formData.employee_id}
                    onChange={handleChange}
                    className="
                      w-full
                      h-11
                      px-4
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
                    placeholder="Enter employee ID"
                  />
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-semibold text-[#212121] mb-2">
                    Role
                  </label>

                  <input
                    type="text"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="
                      w-full
                      h-11
                      px-4
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
                    placeholder="e.g. Staff, Manager"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-semibold text-[#212121] mb-2">
                    Password
                    {!isEditMode && (
                      <span className="text-[#DC2626] ml-1">
                        *
                      </span>
                    )}
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required={!isEditMode}
                    className="
                      w-full
                      h-11
                      px-4
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
                    placeholder={
                      isEditMode
                        ? "Leave blank to keep current password"
                        : "Enter password"
                    }
                  />
                </div>
              </div>

              {/* Active status */}
              <div className="mt-6">
                <label
                  className="
                    flex
                    items-center
                    gap-3
                    cursor-pointer
                    select-none
                  "
                >
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="
                      w-4
                      h-4
                      accent-[#2F6FED]
                    "
                  />

                  <div>
                    <p className="text-sm font-semibold text-[#212121]">
                      Active Account
                    </p>

                    <p className="text-xs text-[#7A7A7A] mt-0.5">
                      Inactive users cannot log in to the system.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* ---------------------------------------- */}
          {/* Permissions */}
          {/* ---------------------------------------- */}

          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6">
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <h2 className="text-lg font-bold text-[#212121]">
                    Module Access
                  </h2>

                  <p className="text-xs text-[#7A7A7A] mt-1">
                    Select the modules this user can access.
                  </p>
                </div>

                <ShieldCheck
                  size={22}
                  className="text-[#2F6FED] shrink-0"
                />
              </div>

              {/* Select/Clear */}
              <div className="flex items-center gap-2 mb-5">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="
                    flex-1
                    h-9
                    rounded-lg
                    bg-[#EEF4FF]
                    text-[#2F6FED]
                    text-xs
                    font-semibold
                    hover:bg-[#E3ECFF]
                    transition
                  "
                >
                  Select All
                </button>

                <button
                  type="button"
                  onClick={handleClearAll}
                  className="
                    flex-1
                    h-9
                    rounded-lg
                    bg-[#F8FAFC]
                    border
                    border-[#E5E7EB]
                    text-[#7A7A7A]
                    text-xs
                    font-semibold
                    hover:bg-[#F1F5F9]
                    transition
                  "
                >
                  Clear All
                </button>
              </div>

              {/* Module Groups */}
              <div className="space-y-5">
                {MODULES.map((group) => (
                  <div key={group.group}>
                    <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] mb-2">
                      {group.group}
                    </h3>

                    <div className="space-y-1">
                      {group.items.map((module) => {
                        const checked =
                          Boolean(
                            selectedModules[module.key]
                          );

                        return (
                          <label
                            key={module.key}
                            className={`
                              flex
                              items-center
                              gap-3
                              px-3
                              py-2.5
                              rounded-xl
                              border
                              cursor-pointer
                              transition-all
                              ${
                                checked
                                  ? "bg-[#EEF4FF] border-[#C9DAFF]"
                                  : "bg-white border-[#E5E7EB] hover:bg-[#F8FAFC]"
                              }
                            `}
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() =>
                                handleModuleChange(
                                  module.key
                                )
                              }
                              className="
                                w-4
                                h-4
                                accent-[#2F6FED]
                                shrink-0
                              "
                            />

                            <span
                              className={`
                                text-sm
                                font-medium
                                ${
                                  checked
                                    ? "text-[#2F6FED]"
                                    : "text-[#4B5563]"
                                }
                              `}
                            >
                              {module.label}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-3 rounded-xl bg-[#D9F7E8]">
                <p className="text-xs text-[#166534] leading-5">
                  <strong>Note:</strong> If a module is selected,
                  the user gets full access to that module.
                  There are no separate View, Add, Edit, or
                  Delete permissions.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ------------------------------------------ */}
        {/* Bottom Actions */}
        {/* ------------------------------------------ */}

        <div
          className="
            mt-6
            flex
            items-center
            justify-end
            gap-3
          "
        >
          <button
            type="button"
            onClick={() => navigate("/users")}
            disabled={loading}
            className="
              px-5
              h-11
              rounded-xl
              border
              border-[#E5E7EB]
              bg-white
              text-[#6B7280]
              text-sm
              font-semibold
              hover:bg-[#F8FAFC]
              transition
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="
              flex
              items-center
              gap-2
              px-6
              h-11
              rounded-xl
              bg-[#2F6FED]
              text-white
              text-sm
              font-semibold
              hover:bg-[#2459C7]
              transition
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
          >
            <Save size={17} />

            {loading
              ? "Saving..."
              : isEditMode
              ? "Update User"
              : "Create User"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
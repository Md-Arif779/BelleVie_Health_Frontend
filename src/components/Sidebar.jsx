
import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { hasPermission } from "../utils/permission";

import {
  LayoutDashboard,
  Users,
  Stethoscope,
  CalendarDays,
  FlaskConical,
  Pill,
  CreditCard,
  ShieldCheck,
  HeartPulse,
  FileText,
  ClipboardList,
  Settings,
  ShieldAlert,
  UserRound,
  Activity,
  IdCard,
  UserCircle,
  Video,
  Hospital,
  Home,
  TestTube2,
  ShoppingCart,
  Landmark,
  Ambulance,
  Plane,
  Handshake,
  MessageCircle,
  Receipt,
  UserCog,
  KeyRound,
  ScrollText,
  ChevronDown,
} from "lucide-react";

const Sidebar = () => {
  const { permissions, user } = useAuth();
  const location = useLocation();

  const [openMenus, setOpenMenus] = useState({});

  // --------------------------------------------------
  // Permission
  // --------------------------------------------------
  const canView = (module) => {
    if (user?.role === "SUPER_ADMIN") {
      return true;
    }

    return hasPermission(permissions, module, "can_view");
  };

  // --------------------------------------------------
  // Navigation
  // --------------------------------------------------
  const navSections = [
    {
      title: "Overview",
      items: [
        {
          label: "Dashboard",
          path: "/",
          icon: LayoutDashboard,
          show: canView("dashboard"),
        },
      ],
    },

    {
      title: "People",
      items: [
        {
          label: "Members",
          path: "/members",
          icon: Users,
          show: canView("members"),
        },
      ],
    },

    {
      title: "Healthcare",
      items: [
        {
          label: "Healthcare",
          icon: HeartPulse,
          show:
            canView("health_cards") ||
            canView("health_profiles") ||
            canView("health_records") ||
            canView("record_documents") ||
            canView("health_plans"),
            

          children: [
            {
              label: "Health Cards",
              path: "/health-cards",
              icon: IdCard,
              show: canView("health_cards"),
            },
            {
              label: "Health Profiles",
              path: "/health-profiles",
              icon: UserCircle,
              show: canView("health_profiles"),
            },
            {
              label: "Health Records",
              path: "/health-records",
              icon: FileText,
              show: canView("health_records"),
            },
            {
              label: "Health Plans",
              path: "/health-plans",
              icon: ClipboardList,
              show: canView("health-plans"),
            },
            {
              label: "Record Documents",
              path: "/record-documents",
              icon: FileText,
              show: canView("record_documents"),
            },
          ],
        },
      ],
    },

    {
      title: "Providers",
      items: [
        {
          label: "Providers",
          icon: Stethoscope,
          show:
            canView("doctors") ||
            canView("hospitals") ||
            canView("diagnostic_centers") ||
            canView("pharmacies"),

          children: [
            {
              label: "Doctors",
              path: "/doctors",
              icon: Stethoscope,
              show: canView("doctors"),
            },
            {
              label: "Hospitals",
              path: "/hospitals",
              icon: Hospital,
              show: canView("hospitals"),
            },
            {
              label: "Diagnostic Centers",
              path: "/diagnostic-centers",
              icon: FlaskConical,
              show: canView("diagnostic_centers"),
            },
            {
              label: "Pharmacies",
              path: "/pharmacies",
              icon: Pill,
              show: canView("pharmacies"),
            },
          ],
        },
      ],
    },

    {
      title: "Services",
      items: [
        {
          label: "Services",
          icon: Activity,
          show:
            canView("appointments") ||
            canView("telemedicine") ||
            canView("hospital_bookings") ||
            canView("home_healthcare") ||
            canView("lab_tests") ||
            canView("lab_results") ||
            canView("prescriptions"),

          children: [
            {
              label: "Appointments",
              path: "/appointments",
              icon: CalendarDays,
              show: canView("appointments"),
            },
            {
              label: "Telemedicine",
              path: "/telemedicine",
              icon: Video,
              show: canView("telemedicine"),
            },
            {
              label: "Hospital Bookings",
              path: "/hospital-bookings",
              icon: Hospital,
              show: canView("hospital_bookings"),
            },
            {
              label: "Home Healthcare",
              path: "/home-healthcare",
              icon: Home,
              show: canView("home_healthcare"),
            },
            {
              label: "Lab Tests",
              path: "/lab-test-bookings",
              icon: TestTube2,
              show: canView("lab_tests"),
            },
            {
              label: "Lab Results",
              path: "/lab-results",
              icon: FlaskConical,
              show: canView("lab_results"),
            },
            {
              label: "Prescriptions",
              path: "/prescriptions",
              icon: ScrollText,
              show: canView("prescriptions"),
            },
          ],
        },
      ],
    },

    {
      title: "Insurance",
      items: [
        {
          label: "Insurance",
          icon: ShieldCheck,
          show:
            canView("insurance_policies") ||
            canView("insurance_claims"),

          children: [
            {
              label: "Insurance Policies",
              path: "/insurance-policies",
              icon: ShieldCheck,
              show: canView("insurance_policies"),
            },
            {
              label: "Insurance Claims",
              path: "/insurance-claims",
              icon: ShieldAlert,
              show: canView("insurance_claims"),
            },
          ],
        },
      ],
    },

    {
      title: "Operations",
      items: [
        {
          label: "Pharmacy Orders",
          path: "/medicine-orders",
          icon: ShoppingCart,
          show: canView("medicine_orders"),
        },
        {
          label: "Organizations",
          path: "/organizations",
          icon: Landmark,
          show: canView("organizations"),
        },
        {
          label: "Ambulance",
          path: "/ambulance-requests",
          icon: Ambulance,
          show: canView("ambulance"),
        },
        {
          label: "Medical Tourism",
          path: "/medical-tourism",
          icon: Plane,
          show: canView("medical_tourism"),
        },
        {
          label: "Partners",
          path: "/partners",
          icon: Handshake,
          show: canView("partners"),
        },
        {
          label: "CRM",
          path: "/crm",
          icon: MessageCircle,
          show: canView("crm"),
        },
      ],
    },

    {
      title: "Finance",
      items: [
        {
          label: "Billing",
          icon: CreditCard,
          show: canView("invoices") || canView("payments"),

          children: [
            {
              label: "Invoices",
              path: "/invoices",
              icon: Receipt,
              show: canView("invoices"),
            },
            {
              label: "Payments",
              path: "/payments",
              icon: CreditCard,
              show: canView("payments"),
            },
          ],
        },
      ],
    },

    {
      title: "Analytics",
      items: [
        {
          label: "Reports",
          path: "/reports",
          icon: FileText,
          show: canView("reports"),
        },
      ],
    },

    {
      title: "Administration",
      items: [
        {
          label: "Administration",
          icon: Settings,
          show: canView("users") || canView("permissions"),

          children: [
            {
              label: "Users",
              path: "/users",
              icon: UserCog,
              show: canView("users"),
            },
            {
              label: "Permissions",
              path: "/permissions",
              icon: KeyRound,
              show: canView("permissions"),
            },
          ],
        },
      ],
    },
  ];

  // --------------------------------------------------
  // Toggle menu
  // --------------------------------------------------
  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  // --------------------------------------------------
  // Active child check
  // --------------------------------------------------
  const hasActiveChild = (item) => {
    if (!item.children) {
      return false;
    }

    return item.children.some((child) =>
      location.pathname.startsWith(child.path)
    );
  };

  // --------------------------------------------------
  // Automatically open active parent menu
  // --------------------------------------------------
  useEffect(() => {
    const activeMenus = {};

    navSections.forEach((section) => {
      section.items.forEach((item) => {
        if (item.children && hasActiveChild(item)) {
          activeMenus[item.label] = true;
        }
      });
    });

    setOpenMenus((prev) => ({
      ...prev,
      ...activeMenus,
    }));
  }, [location.pathname, permissions, user]);

  // --------------------------------------------------
  // Filter visible navigation
  // --------------------------------------------------
  const visibleSections = navSections
    .map((section) => ({
      ...section,
      items: section.items
        .map((item) => ({
          ...item,
          children: item.children
            ? item.children.filter((child) => child.show)
            : undefined,
        }))
        .filter(
          (item) =>
            item.show &&
            (!item.children || item.children.length > 0)
        ),
    }))
    .filter((section) => section.items.length > 0);

  return (
    <aside
      className="
        flex
        w-[270px]
        shrink-0
        min-h-[calc(100vh-72px)]
        bg-white
        border-r border-[#E5E7EB]
        flex-col
      "
    >
      {/* -------------------------------------------- */}
      {/* Navigation */}
      {/* -------------------------------------------- */}

      <nav className="flex-1 px-4 py-5 overflow-y-auto">
        {visibleSections.map((section, sectionIndex) => (
          <div
            key={section.title}
            className={sectionIndex > 0 ? "mt-7" : ""}
          >
            {/* Section title */}
            <div className="px-3 mb-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9CA3AF]">
                {section.title}
              </p>
            </div>

            {/* Section items */}
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;

                // --------------------------------------
                // Parent menu
                // --------------------------------------
                if (item.children) {
                  const isOpen =
                    openMenus[item.label] ||
                    hasActiveChild(item);

                  return (
                    <div key={item.label}>
                      <button
                        type="button"
                        onClick={() => toggleMenu(item.label)}
                        className="
                          group
                          w-full
                          flex
                          items-center
                          gap-3
                          px-3
                          py-2.5
                          rounded-xl
                          text-[13px]
                          font-semibold
                          text-[#6B7280]
                          hover:bg-[#F8FAFC]
                          hover:text-[#212121]
                          transition-all
                          duration-200
                        "
                      >
                        <span
                          className="
                            flex
                            items-center
                            justify-center
                            w-8
                            h-8
                            rounded-lg
                            bg-[#F8FAFC]
                            text-[#7A7A7A]
                            group-hover:bg-[#EEF4FF]
                            group-hover:text-[#2F6FED]
                            transition-all
                          "
                        >
                          <Icon size={17} strokeWidth={2} />
                        </span>

                        <span className="flex-1 text-left">
                          {item.label}
                        </span>

                        <ChevronDown
                          size={16}
                          strokeWidth={2}
                          className={`
                            transition-transform
                            duration-200
                            ${
                              isOpen
                                ? "rotate-180 text-[#2F6FED]"
                                : "text-[#9CA3AF]"
                            }
                          `}
                        />
                      </button>

                      {/* Children */}
                      <div
                        className={`
                          overflow-hidden
                          transition-all
                          duration-200
                          ${
                            isOpen
                              ? "max-h-[600px] opacity-100 mt-1"
                              : "max-h-0 opacity-0"
                          }
                        `}
                      >
                        <div className="ml-5 pl-4 border-l border-[#E5E7EB] space-y-1">
                          {item.children.map((child) => {
                            const ChildIcon = child.icon;

                            return (
                              <NavLink
                                key={child.path}
                                to={child.path}
                                className={({ isActive }) => `
                                  group
                                  flex
                                  items-center
                                  gap-3
                                  px-3
                                  py-2.5
                                  rounded-xl
                                  text-[12px]
                                  font-medium
                                  transition-all
                                  duration-200
                                  ${
                                    isActive
                                      ? "bg-[#EEF4FF] text-[#2F6FED]"
                                      : "text-[#7A7A7A] hover:bg-[#F8FAFC] hover:text-[#212121]"
                                  }
                                `}
                              >
                                {({ isActive }) => (
                                  <>
                                    <ChildIcon
                                      size={15}
                                      strokeWidth={2}
                                      className={
                                        isActive
                                          ? "text-[#2F6FED]"
                                          : "text-[#9CA3AF]"
                                      }
                                    />

                                    <span>
                                      {child.label}
                                    </span>
                                  </>
                                )}
                              </NavLink>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }

                // --------------------------------------
                // Normal menu item
                // --------------------------------------
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === "/"}
                    className={({ isActive }) => `
                      group
                      flex
                      items-center
                      gap-3
                      px-3
                      py-2.5
                      rounded-xl
                      text-[13px]
                      font-semibold
                      transition-all
                      duration-200
                      ${
                        isActive
                          ? "bg-[#EEF4FF] text-[#2F6FED]"
                          : "text-[#6B7280] hover:bg-[#F8FAFC] hover:text-[#212121]"
                      }
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={`
                            flex
                            items-center
                            justify-center
                            w-8
                            h-8
                            rounded-lg
                            transition-all
                            ${
                              isActive
                                ? "bg-[#2F6FED] text-white"
                                : "bg-[#F8FAFC] text-[#7A7A7A] group-hover:bg-[#EEF4FF] group-hover:text-[#2F6FED]"
                            }
                          `}
                        >
                          <Icon
                            size={17}
                            strokeWidth={2}
                          />
                        </span>

                        <span>{item.label}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* -------------------------------------------- */}
      {/* Staff Card */}
      {/* -------------------------------------------- */}

      <div className="p-4 border-t border-[#E5E7EB]">
        <div
          className="
            flex
            items-center
            gap-3
            p-3
            rounded-2xl
            bg-[#F8FAFC]
            border
            border-[#E5E7EB]
          "
        >
          {/* Avatar */}
          <div
            className="
              w-10
              h-10
              shrink-0
              rounded-xl
              bg-[#D9F7E8]
              flex
              items-center
              justify-center
              text-[#2F6FED]
            "
          >
            <UserRound
              size={19}
              strokeWidth={2}
            />
          </div>

          {/* User info */}
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold text-[#212121] truncate">
              {user?.first_name ||
                user?.username ||
                "Staff User"}
            </p>

            <p className="text-[11px] text-[#7A7A7A] truncate mt-0.5">
              {user?.role || "Authorized Staff"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;




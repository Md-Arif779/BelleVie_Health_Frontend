
import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock3,
  FileText,
  FlaskConical,
  HeartPulse,
  Hospital,
  Loader2,
  Pill,
  Plus,
  Search,
  ShieldCheck,
  Stethoscope,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { getDashboard } from "../services/dashboardService";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const navigate = useNavigate();
  const { user, permissions } = useAuth();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getDashboard();

        if (mounted) {
          setDashboard(data);
        }
      } catch (err) {
        console.error("Dashboard Error:", err);

        if (mounted) {
          setError(
            err?.response?.data?.detail ||
              "Unable to load dashboard data."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  const summary = dashboard?.summary || {};
  const recentActivity = dashboard?.recent_activity || [];

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  const canView = (moduleName) => {
    if (isSuperAdmin) return true;
    return Boolean(permissions?.[moduleName]?.can_view);
  };

  const canAdd = (moduleName) => {
    if (isSuperAdmin) return true;
    return Boolean(permissions?.[moduleName]?.can_add);
  };

  const displayName = useMemo(() => {
    if (!user) return "User";

    return (
      user.full_name ||
      [user.first_name, user.last_name]
        .filter(Boolean)
        .join(" ") ||
      user.username ||
      "User"
    );
  }, [user]);

  const stats = [
    {
      title: "Total Members",
      value: summary.members ?? 0,
      icon: Users,
      path: "/members",
      permission: canView("members"),
      color: "text-[#2F6FED]",
      bg: "bg-[#EEF4FF]",
    },
    {
      title: "Appointments",
      value: summary.appointments ?? 0,
      icon: CalendarDays,
      path: "/appointments",
      permission: canView("appointments"),
      color: "text-[#7C3AED]",
      bg: "bg-[#F3E8FF]",
    },
    {
      title: "Telemedicine",
      value: summary.telemedicine ?? 0,
      icon: Stethoscope,
      path: "/telemedicine",
      permission: canView("telemedicine"),
      color: "text-[#0891B2]",
      bg: "bg-[#ECFEFF]",
    },
    {
      title: "Hospital Bookings",
      value: summary.hospital_bookings ?? 0,
      icon: Hospital,
      path: "/hospital-bookings",
      permission: canView("hospital_bookings"),
      color: "text-[#DC2626]",
      bg: "bg-[#FEF2F2]",
    },
    {
      title: "Home Healthcare",
      value: summary.home_healthcare ?? 0,
      icon: HeartPulse,
      path: "/home-healthcare",
      permission: canView("home_healthcare"),
      color: "text-[#16A34A]",
      bg: "bg-[#F0FDF4]",
    },
    {
      title: "Lab Test Bookings",
      value: summary.lab_test_bookings ?? 0,
      icon: FlaskConical,
      path: "/lab-tests",
      permission: canView("lab_tests"),
      color: "text-[#EA580C]",
      bg: "bg-[#FFF7ED]",
    },
  ].filter((item) => item.permission);

  const quickActions = [
    {
      title: "Add Member",
      description: "Register a new member",
      icon: UserPlus,
      path: "/members",
      permission: canAdd("members"),
    },
    {
      title: "New Appointment",
      description: "Create an appointment",
      icon: CalendarDays,
      path: "/appointments",
      permission: canAdd("appointments"),
    },
    {
      title: "Add Doctor",
      description: "Register a healthcare provider",
      icon: Stethoscope,
      path: "/doctors",
      permission: canAdd("doctors"),
    },
    {
      title: "Lab Test",
      description: "Create a lab test booking",
      icon: FlaskConical,
      path: "/lab-tests",
      permission: canAdd("lab_tests"),
    },
  ].filter((action) => action.permission);

  const systemModules = [
    {
      title: "Members",
      description: "Manage member information",
      icon: Users,
      path: "/members",
      permission: canView("members"),
    },
    {
      title: "Appointments",
      description: "Manage appointments",
      icon: CalendarDays,
      path: "/appointments",
      permission: canView("appointments"),
    },
    {
      title: "Health Records",
      description: "View healthcare records",
      icon: FileText,
      path: "/health-records",
      permission: canView("health_records"),
    },
    {
      title: "Prescriptions",
      description: "Manage prescriptions",
      icon: Pill,
      path: "/prescriptions",
      permission: canView("prescriptions"),
    },
    {
      title: "Health Plans",
      description: "Manage healthcare plans",
      icon: HeartPulse,
      path: "/health-plans",
      permission: canView("health_plans"),
    },
    {
      title: "Insurance Policies",
      description: "Manage insurance policies",
      icon: ShieldCheck,
      path: "/insurance-policies",
      permission: canView("insurance_policies"),
    },
    {
      title: "Insurance Claims",
      description: "Manage insurance claims",
      icon: ShieldCheck,
      path: "/insurance-claims",
      permission: canView("insurance_claims"),
    },
    {
      title: "Doctors",
      description: "Manage healthcare providers",
      icon: Stethoscope,
      path: "/doctors",
      permission: canView("doctors"),
    },
    {
      title: "Hospitals",
      description: "Manage hospital partners",
      icon: Hospital,
      path: "/hospitals",
      permission: canView("hospitals"),
    },
  ].filter((module) => module.permission);

  const serviceOverview = [
    {
      title: "Telemedicine",
      value: summary.telemedicine ?? 0,
      icon: Stethoscope,
      path: "/telemedicine",
      permission: canView("telemedicine"),
    },
    {
      title: "Hospital Bookings",
      value: summary.hospital_bookings ?? 0,
      icon: Hospital,
      path: "/hospital-bookings",
      permission: canView("hospital_bookings"),
    },
    {
      title: "Home Healthcare",
      value: summary.home_healthcare ?? 0,
      icon: HeartPulse,
      path: "/home-healthcare",
      permission: canView("home_healthcare"),
    },
    {
      title: "Lab Tests",
      value: summary.lab_test_bookings ?? 0,
      icon: FlaskConical,
      path: "/lab-tests",
      permission: canView("lab_tests"),
    },
  ].filter((service) => service.permission);

  const activityMeta = {
    MEMBER: {
      label: "Member",
      icon: Users,
      iconClass: "bg-[#EEF4FF] text-[#2F6FED]",
    },
    APPOINTMENT: {
      label: "Appointment",
      icon: CalendarDays,
      iconClass: "bg-[#F3E8FF] text-[#7C3AED]",
    },
    TELEMEDICINE: {
      label: "Telemedicine",
      icon: Stethoscope,
      iconClass: "bg-[#ECFEFF] text-[#0891B2]",
    },
    HOSPITAL_BOOKING: {
      label: "Hospital Booking",
      icon: Hospital,
      iconClass: "bg-[#FEF2F2] text-[#DC2626]",
    },
    HOME_HEALTHCARE: {
      label: "Home Healthcare",
      icon: HeartPulse,
      iconClass: "bg-[#F0FDF4] text-[#16A34A]",
    },
    LAB_TEST: {
      label: "Lab Test",
      icon: FlaskConical,
      iconClass: "bg-[#FFF7ED] text-[#EA580C]",
    },
  };

  const formatActivityTime = (dateValue) => {
    if (!dateValue) return "Recently";

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "Recently";
    }

    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const getStatusStyle = (status) => {
    const normalized = String(status || "").toUpperCase();

    if (
      ["COMPLETED", "CONFIRMED", "ACTIVE", "SUCCESS"].includes(
        normalized
      )
    ) {
      return "bg-[#DCFCE7] text-[#166534]";
    }

    if (
      ["PENDING", "PROCESSING", "SCHEDULED"].includes(
        normalized
      )
    ) {
      return "bg-[#FEF3C7] text-[#92400E]";
    }

    if (
      ["CANCELLED", "REJECTED", "FAILED", "INACTIVE"].includes(
        normalized
      )
    ) {
      return "bg-[#FEE2E2] text-[#991B1B]";
    }

    return "bg-[#F3F4F6] text-[#4B5563]";
  };

  const handleMemberSearch = () => {
    const value = search.trim();

    if (!value) return;

    navigate(`/members?search=${encodeURIComponent(value)}`);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      handleMemberSearch();
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#2F6FED]" />
          <p className="text-sm text-[#7A7A7A]">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-[#2F6FED]">
            BelleVie Health
          </p>

          <h1 className="mt-1 text-2xl md:text-3xl font-bold text-[#212121]">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-[#7A7A7A]">
            Welcome back, {displayName}. Here is your healthcare
            management overview.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-3 py-2 shadow-sm">
            <Activity className="w-4 h-4 text-[#16A34A]" />

            <span className="text-sm font-medium text-[#212121]">
              System Online
            </span>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-sm text-[#991B1B]">
          {error}
        </div>
      )}

      {/* Global Member Search */}
      {canView("members") && (
        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-semibold text-[#212121]">
                Global Member Search
              </h2>

              <p className="mt-1 text-sm text-[#7A7A7A]">
                Search members by Member ID, name, phone or other
                available information.
              </p>
            </div>

            <div className="w-full lg:max-w-xl">
              <div className="flex items-center gap-2 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB] p-2 transition focus-within:border-[#2F6FED] focus-within:ring-2 focus-within:ring-[#2F6FED]/10">
                <Search className="ml-2 h-5 w-5 shrink-0 text-[#7A7A7A]" />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search Member ID, name or phone..."
                  className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm text-[#212121] outline-none placeholder:text-[#9CA3AF]"
                />

                <button
                  type="button"
                  onClick={handleMemberSearch}
                  disabled={!search.trim()}
                  className="rounded-lg bg-[#2F6FED] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#2459C7] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Search
                </button>
              </div>

              <p className="mt-2 text-xs text-[#7A7A7A]">
                Press Enter to search
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Healthcare Overview */}
      <section>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-[#212121]">
            Healthcare Overview
          </h2>

          <p className="mt-1 text-sm text-[#7A7A7A]">
            Current system statistics
          </p>
        </div>

        {stats.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <Link
                  key={stat.title}
                  to={stat.path}
                  className="group rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.bg}`}
                    >
                      <Icon
                        className={`h-5 w-5 ${stat.color}`}
                      />
                    </div>

                    <ArrowUpRight className="h-4 w-4 text-[#9CA3AF] transition group-hover:text-[#2F6FED]" />
                  </div>

                  <div className="mt-5">
                    <p className="text-sm text-[#7A7A7A]">
                      {stat.title}
                    </p>

                    <h3 className="mt-1 text-2xl font-bold text-[#212121]">
                      {stat.value}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-10 text-center shadow-sm">
            <Activity className="mx-auto h-8 w-8 text-[#9CA3AF]" />
            <p className="mt-3 text-sm text-[#7A7A7A]">
              No dashboard statistics are available.
            </p>
          </div>
        )}
      </section>

      {/* Activities */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <section className="xl:col-span-2 rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
            <div>
              <h2 className="font-semibold text-[#212121]">
                Recent Activities
              </h2>

              <p className="mt-1 text-xs text-[#7A7A7A]">
                Latest healthcare system activity
              </p>
            </div>

            <Clock3 className="h-5 w-5 text-[#7A7A7A]" />
          </div>

          <div className="divide-y divide-[#E5E7EB]">
            {recentActivity.length === 0 ? (
              <div className="px-5 py-10 text-center">
                <Activity className="mx-auto h-8 w-8 text-[#9CA3AF]" />

                <p className="mt-3 text-sm text-[#7A7A7A]">
                  No recent activity available.
                </p>
              </div>
            ) : (
              recentActivity.slice(0, 6).map((item, index) => {
                const meta =
                  activityMeta[item.type] ||
                  activityMeta.MEMBER;

                const Icon = meta.icon;

                return (
                  <div
                    key={`${item.type}-${item.id}-${index}`}
                    className="flex items-center gap-3 px-5 py-4"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${meta.iconClass}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-medium text-[#212121]">
                          {item.title ||
                            item.description ||
                            meta.label}
                        </p>

                        {item.status && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${getStatusStyle(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-xs text-[#7A7A7A]">
                        {item.member_name
                          ? `${item.member_name} • `
                          : ""}
                        {formatActivityTime(
                          item.created_at || item.date
                        )}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Appointment Overview */}
        {canView("appointments") && (
          <section className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
            <div className="border-b border-[#E5E7EB] px-5 py-4">
              <h2 className="font-semibold text-[#212121]">
                Appointment Overview
              </h2>

              <p className="mt-1 text-xs text-[#7A7A7A]">
                Current appointment summary
              </p>
            </div>

            <div className="space-y-3 p-5">
              <Link
                to="/appointments"
                className="flex items-center justify-between rounded-xl bg-[#EEF4FF] px-4 py-4 transition hover:bg-[#E4EDFF]"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white">
                    <CalendarDays className="h-4 w-4 text-[#2F6FED]" />
                  </div>

                  <span className="text-sm font-medium text-[#212121]">
                    Total Appointments
                  </span>
                </div>

                <span className="text-lg font-bold text-[#2F6FED]">
                  {summary.appointments ?? 0}
                </span>
              </Link>

              <div className="rounded-xl border border-dashed border-[#E5E7EB] px-4 py-5 text-center">
                <p className="text-sm font-medium text-[#212121]">
                  Appointment status breakdown
                </p>

                <p className="mt-1 text-xs text-[#7A7A7A]">
                  Detailed confirmed, pending and cancelled
                  counts will appear when the backend provides
                  status-wise statistics.
                </p>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Service Overview */}
      {serviceOverview.length > 0 && (
        <section className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] px-5 py-4">
            <div>
              <h2 className="font-semibold text-[#212121]">
                Service Overview
              </h2>

              <p className="mt-1 text-xs text-[#7A7A7A]">
                Healthcare services currently being managed
              </p>
            </div>

            <ClipboardList className="h-5 w-5 text-[#7A7A7A]" />
          </div>

          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-4">
            {serviceOverview.map((service) => {
              const Icon = service.icon;

              return (
                <Link
                  key={service.title}
                  to={service.path}
                  className="group rounded-xl border border-[#E5E7EB] p-4 transition hover:border-[#2F6FED] hover:bg-[#FAFCFF]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF4FF]">
                      <Icon className="h-5 w-5 text-[#2F6FED]" />
                    </div>

                    <ArrowUpRight className="h-4 w-4 text-[#9CA3AF] group-hover:text-[#2F6FED]" />
                  </div>

                  <p className="mt-4 text-sm font-medium text-[#212121]">
                    {service.title}
                  </p>

                  <p className="mt-1 text-2xl font-bold text-[#212121]">
                    {service.value}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Pending Actions */}
      <section className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
        <div className="border-b border-[#E5E7EB] px-5 py-4">
          <h2 className="font-semibold text-[#212121]">
            Pending Actions
          </h2>

          <p className="mt-1 text-xs text-[#7A7A7A]">
            Items that may require staff attention
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 p-5 md:grid-cols-3">
          {canView("appointments") && (
            <Link
              to="/appointments"
              className="flex items-center gap-4 rounded-xl border border-[#E5E7EB] p-4 transition hover:border-[#2F6FED] hover:bg-[#FAFCFF]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FEF3C7]">
                <Clock3 className="h-5 w-5 text-[#D97706]" />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#212121]">
                  Pending Appointments
                </p>

                <p className="mt-1 text-xs text-[#7A7A7A]">
                  Review appointment requests
                </p>
              </div>
            </Link>
          )}

          {canView("payments") && (
            <Link
              to="/payments"
              className="flex items-center gap-4 rounded-xl border border-[#E5E7EB] p-4 transition hover:border-[#2F6FED] hover:bg-[#FAFCFF]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FEFCE8]">
                <WalletIcon />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#212121]">
                  Payment Management
                </p>

                <p className="mt-1 text-xs text-[#7A7A7A]">
                  Review payment transactions
                </p>
              </div>
            </Link>
          )}

          {canView("insurance_claims") && (
            <Link
              to="/insurance-claims"
              className="flex items-center gap-4 rounded-xl border border-[#E5E7EB] p-4 transition hover:border-[#2F6FED] hover:bg-[#FAFCFF]"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EEF2FF]">
                <ShieldCheck className="h-5 w-5 text-[#4F46E5]" />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#212121]">
                  Insurance Claims
                </p>

                <p className="mt-1 text-xs text-[#7A7A7A]">
                  Review insurance claims
                </p>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      {quickActions.length > 0 && (
        <section>
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-[#212121]">
              Quick Actions
            </h2>

            <p className="mt-1 text-sm text-[#7A7A7A]">
              Frequently used actions for daily operations
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  key={action.title}
                  to={action.path}
                  className="group rounded-2xl border border-[#E5E7EB] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#2F6FED] hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF4FF]">
                      <Icon className="h-5 w-5 text-[#2F6FED]" />
                    </div>

                    <Plus className="h-5 w-5 text-[#9CA3AF] transition group-hover:text-[#2F6FED]" />
                  </div>

                  <h3 className="mt-5 text-sm font-semibold text-[#212121]">
                    {action.title}
                  </h3>

                  <p className="mt-1 text-xs text-[#7A7A7A]">
                    {action.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* System Overview */}
      {systemModules.length > 0 && (
        <section className="rounded-2xl border border-[#E5E7EB] bg-white shadow-sm">
          <div className="border-b border-[#E5E7EB] px-5 py-4">
            <h2 className="font-semibold text-[#212121]">
              System Overview
            </h2>

            <p className="mt-1 text-xs text-[#7A7A7A]">
              Access healthcare management modules from one
              place
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 xl:grid-cols-3">
            {systemModules.map((module) => {
              const Icon = module.icon;

              return (
                <Link
                  key={module.title}
                  to={module.path}
                  className="group flex items-center gap-4 rounded-xl border border-[#E5E7EB] p-4 transition hover:border-[#2F6FED] hover:bg-[#FAFCFF]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#EEF4FF]">
                    <Icon className="h-5 w-5 text-[#2F6FED]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-[#212121]">
                      {module.title}
                    </p>

                    <p className="mt-1 text-xs text-[#7A7A7A]">
                      {module.description}
                    </p>
                  </div>

                  <ArrowUpRight className="h-4 w-4 shrink-0 text-[#9CA3AF] transition group-hover:text-[#2F6FED]" />
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Footer */}
      <div className="flex flex-col gap-2 rounded-xl border border-[#E5E7EB] bg-white px-5 py-4 text-xs text-[#7A7A7A] sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#16A34A]" />

          <span>
            BelleVie Health Central Management System
          </span>
        </div>

        <span>Dashboard data loaded successfully</span>
      </div>
    </div>
  );
}

/*
  Small reusable icon wrapper for the payment action.
  Kept here to avoid adding another import just for this icon.
*/
function WalletIcon() {
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FEFCE8]">
      <span className="text-lg font-bold text-[#CA8A04]">৳</span>
    </div>
  );
}

export default Dashboard;


import { useState } from "react";
import { NavLink } from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  UserRound,
  HeartPulse,
  CreditCard,
  FileText,
  Files,
  Stethoscope,
  Building2,
  FlaskConical,
  Pill,
  CalendarDays,
  Video,
  BedDouble,
  Home,
  ClipboardList,
  FileCheck,
  ShieldCheck,
  ShoppingCart,
  Landmark,
  Ambulance,
  Plane,
  Handshake,
  MessageSquare,
  Receipt,
  Wallet,
  BarChart3,
  UserCog,
  KeyRound,
  ChevronDown,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { hasPermission } from "../utils/permission";


const Sidebar = () => {
  const { permissions } = useAuth();

  const [openMenus, setOpenMenus] = useState({
    healthcare: true,
    providers: true,
    services: true,
    operations: true,
    billing: true,
    administration: true,
  });

  const toggleMenu = (menu) => {
    setOpenMenus((previous) => ({
      ...previous,
      [menu]: !previous[menu],
    }));
  };

  const canAccess = (moduleName) => {
    return hasPermission(permissions, moduleName);
  };

  const navClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
      isActive
        ? "bg-[#D9F7E8] text-[#2F6FED]"
        : "text-[#7A7A7A] hover:bg-[#F2F2F2] hover:text-[#212121]"
    }`;

  const sectionButtonClass =
    "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-[#212121] hover:bg-[#F2F2F2] transition-colors";

  return (
    <aside className="w-64 shrink-0 bg-white border-r border-[#EEEEEE] min-h-[calc(100vh-72px)]">
      <div className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-72px)]">

        {/* =====================================================
            DASHBOARD
        ====================================================== */}

        {canAccess("dashboard") && (
          <NavLink to="/" className={navClass}>
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </NavLink>
        )}


        {/* =====================================================
            MEMBERS
        ====================================================== */}

        {canAccess("members") && (
          <NavLink to="/members" className={navClass}>
            <Users className="w-5 h-5" />
            <span>Members</span>
          </NavLink>
        )}


        {/* =====================================================
            HEALTHCARE
        ====================================================== */}

        {(canAccess("health_cards") ||
          canAccess("health_profiles") ||
          canAccess("health_records") ||
          canAccess("record_documents") ||
          canAccess("health_plans")) && (
          <div>

            <button
              type="button"
              onClick={() => toggleMenu("healthcare")}
              className={sectionButtonClass}
            >
              <div className="flex items-center gap-3">
                <HeartPulse className="w-5 h-5 text-[#2F6FED]" />
                <span>Healthcare</span>
              </div>

              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  openMenus.healthcare ? "rotate-180" : ""
                }`}
              />
            </button>

            {openMenus.healthcare && (
              <div className="ml-3 mt-1 space-y-1 border-l border-[#EEEEEE] pl-3">

                {canAccess("health_cards") && (
                  <NavLink to="/health-cards" className={navClass}>
                    <CreditCard className="w-4 h-4" />
                    <span>Health Cards</span>
                  </NavLink>
                )}

                {canAccess("health_profiles") && (
                  <NavLink to="/health-profiles" className={navClass}>
                    <UserRound className="w-4 h-4" />
                    <span>Health Profiles</span>
                  </NavLink>
                )}

                {canAccess("health_records") && (
                  <NavLink to="/health-records" className={navClass}>
                    <FileText className="w-4 h-4" />
                    <span>Health Records</span>
                  </NavLink>
                )}

                {canAccess("record_documents") && (
                  <NavLink to="/record-documents" className={navClass}>
                    <Files className="w-4 h-4" />
                    <span>Record Documents</span>
                  </NavLink>
                )}

                {canAccess("health_plans") && (
                  <NavLink to="/health-plans" className={navClass}>
                    <ClipboardList className="w-4 h-4" />
                    <span>Health Plans</span>
                  </NavLink>
                )}

              </div>
            )}
          </div>
        )}


        {/* =====================================================
            PROVIDERS
        ====================================================== */}

        {(canAccess("doctors") ||
          canAccess("hospitals") ||
          canAccess("diagnostic_centers") ||
          canAccess("pharmacies")) && (
          <div>

            <button
              type="button"
              onClick={() => toggleMenu("providers")}
              className={sectionButtonClass}
            >
              <div className="flex items-center gap-3">
                <Stethoscope className="w-5 h-5 text-[#2F6FED]" />
                <span>Providers</span>
              </div>

              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  openMenus.providers ? "rotate-180" : ""
                }`}
              />
            </button>

            {openMenus.providers && (
              <div className="ml-3 mt-1 space-y-1 border-l border-[#EEEEEE] pl-3">

                {canAccess("doctors") && (
                  <NavLink to="/doctors" className={navClass}>
                    <Stethoscope className="w-4 h-4" />
                    <span>Doctors</span>
                  </NavLink>
                )}

                {canAccess("hospitals") && (
                  <NavLink to="/hospitals" className={navClass}>
                    <Building2 className="w-4 h-4" />
                    <span>Hospitals</span>
                  </NavLink>
                )}

                {canAccess("diagnostic_centers") && (
                  <NavLink to="/diagnostic-centers" className={navClass}>
                    <FlaskConical className="w-4 h-4" />
                    <span>Diagnostic Centers</span>
                  </NavLink>
                )}

                {canAccess("pharmacies") && (
                  <NavLink to="/pharmacies" className={navClass}>
                    <Pill className="w-4 h-4" />
                    <span>Pharmacies</span>
                  </NavLink>
                )}

              </div>
            )}
          </div>
        )}


        {/* =====================================================
            SERVICES
        ====================================================== */}

        {(canAccess("services") ||
          canAccess("appointments") ||
          canAccess("telemedicine") ||
          canAccess("hospital_bookings") ||
          canAccess("home_healthcare") ||
          canAccess("lab_tests") ||
          canAccess("lab_results") ||
          canAccess("prescriptions")) && (
          <div>

            <button
              type="button"
              onClick={() => toggleMenu("services")}
              className={sectionButtonClass}
            >
              <div className="flex items-center gap-3">
                <CalendarDays className="w-5 h-5 text-[#2F6FED]" />
                <span>Services</span>
              </div>

              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  openMenus.services ? "rotate-180" : ""
                }`}
              />
            </button>

            {openMenus.services && (
              <div className="ml-3 mt-1 space-y-1 border-l border-[#EEEEEE] pl-3">

                {canAccess("services") && (
                  <NavLink to="/services" className={navClass}>
                    <FileCheck className="w-4 h-4" />
                    <span>Services</span>
                  </NavLink>
                )}

                {canAccess("appointments") && (
                  <NavLink to="/appointments" className={navClass}>
                    <CalendarDays className="w-4 h-4" />
                    <span>Appointments</span>
                  </NavLink>
                )}

                {canAccess("telemedicine") && (
                  <NavLink to="/telemedicine" className={navClass}>
                    <Video className="w-4 h-4" />
                    <span>Telemedicine</span>
                  </NavLink>
                )}

                {canAccess("hospital_bookings") && (
                  <NavLink to="/hospital-bookings" className={navClass}>
                    <BedDouble className="w-4 h-4" />
                    <span>Hospital Bookings</span>
                  </NavLink>
                )}

                {canAccess("home_healthcare") && (
                  <NavLink to="/home-healthcare" className={navClass}>
                    <Home className="w-4 h-4" />
                    <span>Home Healthcare</span>
                  </NavLink>
                )}

                {canAccess("lab_tests") && (
                  <NavLink to="/lab-test-bookings" className={navClass}>
                    <FlaskConical className="w-4 h-4" />
                    <span>Lab Tests</span>
                  </NavLink>
                )}

                {canAccess("lab_results") && (
                  <NavLink to="/lab-results" className={navClass}>
                    <FileCheck className="w-4 h-4" />
                    <span>Lab Results</span>
                  </NavLink>
                )}

                {canAccess("prescriptions") && (
                  <NavLink to="/prescriptions" className={navClass}>
                    <FileText className="w-4 h-4" />
                    <span>Prescriptions</span>
                  </NavLink>
                )}

              </div>
            )}
          </div>
        )}


        {/* =====================================================
            INSURANCE
        ====================================================== */}

        {(canAccess("insurance_policies") ||
          canAccess("insurance_claims")) && (
          <div>

            <NavLink
              to="/insurance-policies"
              className={navClass}
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Insurance Policies</span>
            </NavLink>

            {canAccess("insurance_claims") && (
              <NavLink
                to="/insurance-claims"
                className={navClass}
              >
                <FileCheck className="w-5 h-5" />
                <span>Insurance Claims</span>
              </NavLink>
            )}

          </div>
        )}


        {/* =====================================================
            OPERATIONS
        ====================================================== */}

        {(canAccess("medicine_orders") ||
          canAccess("organizations") ||
          canAccess("ambulance") ||
          canAccess("medical_tourism") ||
          canAccess("partners") ||
          canAccess("crm")) && (
          <div>

            <button
              type="button"
              onClick={() => toggleMenu("operations")}
              className={sectionButtonClass}
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-[#2F6FED]" />
                <span>Operations</span>
              </div>

              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  openMenus.operations ? "rotate-180" : ""
                }`}
              />
            </button>

            {openMenus.operations && (
              <div className="ml-3 mt-1 space-y-1 border-l border-[#EEEEEE] pl-3">

                {canAccess("medicine_orders") && (
                  <NavLink to="/medicine-orders" className={navClass}>
                    <ShoppingCart className="w-4 h-4" />
                    <span>Medicine Orders</span>
                  </NavLink>
                )}

                {canAccess("organizations") && (
                  <NavLink to="/organizations" className={navClass}>
                    <Landmark className="w-4 h-4" />
                    <span>Organizations</span>
                  </NavLink>
                )}

                {canAccess("ambulance") && (
                  <NavLink to="/ambulance-requests" className={navClass}>
                    <Ambulance className="w-4 h-4" />
                    <span>Ambulance</span>
                  </NavLink>
                )}

                {canAccess("medical_tourism") && (
                  <NavLink to="/medical-tourism" className={navClass}>
                    <Plane className="w-4 h-4" />
                    <span>Medical Tourism</span>
                  </NavLink>
                )}

                {canAccess("partners") && (
                  <NavLink to="/partners" className={navClass}>
                    <Handshake className="w-4 h-4" />
                    <span>Partners</span>
                  </NavLink>
                )}

                {canAccess("crm") && (
                  <NavLink to="/crm" className={navClass}>
                    <MessageSquare className="w-4 h-4" />
                    <span>CRM</span>
                  </NavLink>
                )}

              </div>
            )}
          </div>
        )}


        {/* =====================================================
            BILLING
        ====================================================== */}

        {(canAccess("invoices") || canAccess("payments")) && (
          <div>

            <button
              type="button"
              onClick={() => toggleMenu("billing")}
              className={sectionButtonClass}
            >
              <div className="flex items-center gap-3">
                <Receipt className="w-5 h-5 text-[#2F6FED]" />
                <span>Billing</span>
              </div>

              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  openMenus.billing ? "rotate-180" : ""
                }`}
              />
            </button>

            {openMenus.billing && (
              <div className="ml-3 mt-1 space-y-1 border-l border-[#EEEEEE] pl-3">

                {canAccess("invoices") && (
                  <NavLink to="/invoices" className={navClass}>
                    <Receipt className="w-4 h-4" />
                    <span>Invoices</span>
                  </NavLink>
                )}

                {canAccess("payments") && (
                  <NavLink to="/payments" className={navClass}>
                    <Wallet className="w-4 h-4" />
                    <span>Payments</span>
                  </NavLink>
                )}

              </div>
            )}
          </div>
        )}


        {/* =====================================================
            REPORTS
        ====================================================== */}

        {canAccess("reports") && (
          <NavLink to="/reports" className={navClass}>
            <BarChart3 className="w-5 h-5" />
            <span>Reports</span>
          </NavLink>
        )}


        {/* =====================================================
            ADMINISTRATION
        ====================================================== */}

        {(canAccess("users") || canAccess("permissions")) && (
          <div>

            <button
              type="button"
              onClick={() => toggleMenu("administration")}
              className={sectionButtonClass}
            >
              <div className="flex items-center gap-3">
                <UserCog className="w-5 h-5 text-[#2F6FED]" />
                <span>Administration</span>
              </div>

              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  openMenus.administration ? "rotate-180" : ""
                }`}
              />
            </button>

            {openMenus.administration && (
              <div className="ml-3 mt-1 space-y-1 border-l border-[#EEEEEE] pl-3">

                {canAccess("users") && (
                  <NavLink to="/users" className={navClass}>
                    <UserCog className="w-4 h-4" />
                    <span>Users</span>
                  </NavLink>
                )}

                {canAccess("permissions") && (
                  <NavLink to="/permissions" className={navClass}>
                    <KeyRound className="w-4 h-4" />
                    <span>Permissions</span>
                  </NavLink>
                )}

              </div>
            )}

          </div>
        )}

      </div>
    </aside>
  );
};


export default Sidebar;
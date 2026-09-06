
import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  Bell,
  ChevronDown,
  LogOut,
  Settings,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);

  // =========================================================
  // USER INFORMATION
  // =========================================================

  const displayName =
    user?.full_name ||
    [user?.first_name, user?.last_name].filter(Boolean).join(" ") ||
    user?.username ||
    "User";

  const userRole =
    user?.role ||
    user?.user_type ||
    user?.role_name ||
    "Staff";

  const initials =
    displayName
      .split(" ")
      .filter(Boolean)
      .map((name) => name.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U";

  const formattedRole = String(userRole)
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());

  // =========================================================
  // CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
  // =========================================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  // =========================================================
  // NAVIGATION HELPERS
  // =========================================================

  const openProfile = () => {
    setProfileOpen(false);
    navigate("/profile");
  };

  const openSettings = () => {
    setProfileOpen(false);
    navigate("/settings");
  };

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
  };

  return (
    <header
      className="
        sticky
        top-0
        z-50
        h-[72px]
        bg-white/95
        backdrop-blur-md
        border-b
        border-[#E5E7EB]
      "
    >
      <div
        className="
          h-full
          px-4
          sm:px-6
          lg:px-7
          flex
          items-center
          justify-between
          gap-4
        "
      >
        {/* =====================================================
            LEFT — BRAND
        ====================================================== */}

        <NavLink
          to="/"
          className="
            flex
            items-center
            gap-3
            shrink-0
            rounded-xl
            focus:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#2F6FED]/30
          "
        >
          {/* Logo */}

          <div className="relative">
            <div
              className="
                w-11
                h-11
                rounded-[14px]
                bg-[#D9F7E8]
                flex
                items-center
                justify-center
              "
            >
              <div
                className="
                  w-8
                  h-8
                  rounded-[10px]
                  bg-[#2F6FED]
                  flex
                  items-center
                  justify-center
                  shadow-[0_4px_12px_rgba(47,111,237,0.20)]
                "
              >
                <span className="text-white font-bold text-base">
                  B
                </span>
              </div>
            </div>

            {/* Online indicator */}

            <span
              className="
                absolute
                -right-0.5
                -bottom-0.5
                w-3
                h-3
                rounded-full
                bg-[#16A34A]
                border-2
                border-white
              "
            />
          </div>

          {/* Brand Text */}

          <div className="hidden sm:block leading-none">
            <h1
              className="
                text-[18px]
                font-bold
                tracking-[-0.02em]
                text-[#212121]
              "
            >
              BelleVie{" "}
              <span className="text-[#2F6FED] font-semibold">
                Health
              </span>
            </h1>

            <p
              className="
                text-[10px]
                text-[#7A7A7A]
                mt-1.5
                font-medium
                tracking-wide
              "
            >
              HEALTHCARE MANAGEMENT SYSTEM
            </p>
          </div>
        </NavLink>

        {/* =====================================================
            RIGHT AREA
        ====================================================== */}

        <div className="flex items-center gap-2 sm:gap-3">

          {/* =================================================
              SECURITY STATUS
          ================================================== */}

          <div
            className="
              hidden
              xl:flex
              items-center
              gap-2
              px-3.5
              py-2
              rounded-xl
              bg-[#F7FCF9]
              border
              border-[#D9F7E8]
            "
          >
            <ShieldCheck
              className="w-4 h-4 text-[#16A34A]"
              strokeWidth={2}
            />

            <span className="text-xs font-medium text-[#4B5563]">
              Secure Session
            </span>

            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
          </div>

          {/* =================================================
              NOTIFICATIONS
          ================================================== */}

          <div
            ref={notificationRef}
            className="relative"
          >
            <button
              type="button"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
              onClick={() => {
                setNotificationsOpen((prev) => !prev);
                setProfileOpen(false);
              }}
              className="
                relative
                w-10
                h-10
                rounded-xl
                flex
                items-center
                justify-center
                text-[#7A7A7A]
                hover:text-[#2F6FED]
                hover:bg-[#EEF4FF]
                transition-all
                duration-200
                cursor-pointer
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#2F6FED]/30
              "
              title="Notifications"
            >
              <Bell
                className="w-[19px] h-[19px]"
                strokeWidth={2}
              />

              {/* Notification badge */}

              <span
                className="
                  absolute
                  top-[7px]
                  right-[7px]
                  w-2
                  h-2
                  rounded-full
                  bg-[#2F6FED]
                  border-2
                  border-white
                "
              />
            </button>

            {/* Notification Dropdown */}

            {notificationsOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-[52px]
                  w-[320px]
                  max-w-[calc(100vw-32px)]
                  bg-white
                  rounded-2xl
                  border
                  border-[#E5E7EB]
                  shadow-[0_15px_45px_rgba(0,0,0,0.12)]
                  overflow-hidden
                  animate-in
                "
              >
                {/* Header */}

                <div
                  className="
                    px-4
                    py-3.5
                    border-b
                    border-[#EEEEEE]
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >
                  <div>
                    <p className="text-sm font-bold text-[#212121]">
                      Notifications
                    </p>

                    <p className="text-[11px] text-[#7A7A7A] mt-0.5">
                      Recent system activity
                    </p>
                  </div>

                  <span
                    className="
                      text-[10px]
                      font-semibold
                      text-[#2F6FED]
                      bg-[#EEF4FF]
                      px-2
                      py-1
                      rounded-lg
                      shrink-0
                    "
                  >
                    1 New
                  </span>
                </div>

                {/* Notification */}

                <div className="p-3">
                  <div
                    className="
                      flex
                      gap-3
                      p-3
                      rounded-xl
                      bg-[#F7FCF9]
                      border
                      border-[#ECFDF3]
                    "
                  >
                    <div
                      className="
                        w-9
                        h-9
                        shrink-0
                        rounded-xl
                        bg-[#D9F7E8]
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <ShieldCheck
                        className="w-4 h-4 text-[#2F6FED]"
                        strokeWidth={2}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#212121]">
                        Secure login detected
                      </p>

                      <p className="text-[11px] text-[#7A7A7A] mt-1 leading-4">
                        Your BelleVie Health session is active.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}

          <div className="hidden sm:block h-8 w-px bg-[#EEEEEE]" />

          {/* =================================================
              USER PROFILE
          ================================================== */}

          <div
            ref={profileRef}
            className="relative"
          >
            <button
              type="button"
              aria-label="Open user menu"
              aria-expanded={profileOpen}
              onClick={() => {
                setProfileOpen((prev) => !prev);
                setNotificationsOpen(false);
              }}
              className="
                flex
                items-center
                gap-2.5
                sm:gap-3
                px-1.5
                py-1.5
                rounded-xl
                hover:bg-[#F7F8FA]
                transition-all
                duration-200
                cursor-pointer
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#2F6FED]/30
              "
            >
              {/* Avatar */}

              <div className="relative">
                <div
                  className="
                    w-10
                    h-10
                    rounded-xl
                    bg-[#2F6FED]
                    flex
                    items-center
                    justify-center
                    shadow-[0_4px_12px_rgba(47,111,237,0.16)]
                  "
                >
                  <span className="text-white text-sm font-bold">
                    {initials}
                  </span>
                </div>

                <span
                  className="
                    absolute
                    -right-0.5
                    -bottom-0.5
                    w-3
                    h-3
                    rounded-full
                    bg-[#16A34A]
                    border-2
                    border-white
                  "
                />
              </div>

              {/* User Details */}

              <div className="hidden sm:block text-left leading-tight min-w-0">
                <p
                  className="
                    text-sm
                    font-semibold
                    text-[#212121]
                    max-w-[130px]
                    truncate
                  "
                >
                  {displayName}
                </p>

                <p className="text-[11px] text-[#7A7A7A] mt-1">
                  {formattedRole}
                </p>
              </div>

              <ChevronDown
                className={`
                  hidden
                  sm:block
                  w-4
                  h-4
                  text-[#7A7A7A]
                  transition-transform
                  duration-200
                  ${
                    profileOpen
                      ? "rotate-180"
                      : ""
                  }
                `}
              />
            </button>

            {/* =================================================
                PROFILE DROPDOWN
            ================================================== */}

            {profileOpen && (
              <div
                className="
                  absolute
                  right-0
                  top-[55px]
                  w-[285px]
                  max-w-[calc(100vw-32px)]
                  bg-white
                  rounded-2xl
                  border
                  border-[#E5E7EB]
                  shadow-[0_15px_45px_rgba(0,0,0,0.12)]
                  overflow-hidden
                "
              >
                {/* Profile Header */}

                <div
                  className="
                    p-4
                    bg-[#F8FAFF]
                    border-b
                    border-[#EEEEEE]
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        w-12
                        h-12
                        rounded-xl
                        bg-[#2F6FED]
                        flex
                        items-center
                        justify-center
                        shrink-0
                      "
                    >
                      <span className="text-white font-bold">
                        {initials}
                      </span>
                    </div>

                    <div className="min-w-0">
                      <p
                        className="
                          text-sm
                          font-bold
                          text-[#212121]
                          truncate
                        "
                      >
                        {displayName}
                      </p>

                      <p
                        className="
                          text-xs
                          text-[#7A7A7A]
                          mt-1
                          truncate
                        "
                      >
                        {user?.email || "BelleVie Health Staff"}
                      </p>
                    </div>
                  </div>

                  {/* Role */}

                  <div
                    className="
                      mt-3
                      inline-flex
                      items-center
                      gap-1.5
                      px-2.5
                      py-1
                      rounded-lg
                      bg-[#D9F7E8]
                    "
                  >
                    <ShieldCheck
                      className="w-3.5 h-3.5 text-[#16A34A]"
                    />

                    <span className="text-[10px] font-semibold text-[#166534]">
                      {formattedRole}
                    </span>
                  </div>
                </div>

                {/* Menu */}

                <div className="p-2">

                  {/* My Profile */}

                  <button
                    type="button"
                    onClick={openProfile}
                    className="
                      w-full
                      flex
                      items-center
                      gap-3
                      px-3
                      py-2.5
                      rounded-xl
                      text-left
                      text-sm
                      text-[#4B5563]
                      hover:bg-[#F7F8FA]
                      hover:text-[#212121]
                      transition-colors
                      cursor-pointer
                    "
                  >
                    <div
                      className="
                        w-8
                        h-8
                        rounded-lg
                        bg-[#F2F2F2]
                        flex
                        items-center
                        justify-center
                        shrink-0
                      "
                    >
                      <UserRound
                        className="w-4 h-4 text-[#7A7A7A]"
                      />
                    </div>

                    <span className="font-medium">
                      My Profile
                    </span>
                  </button>

                  {/* Settings */}

                  <button
                    type="button"
                    onClick={openSettings}
                    className="
                      w-full
                      flex
                      items-center
                      gap-3
                      px-3
                      py-2.5
                      rounded-xl
                      text-left
                      text-sm
                      text-[#4B5563]
                      hover:bg-[#F7F8FA]
                      hover:text-[#212121]
                      transition-colors
                      cursor-pointer
                    "
                  >
                    <div
                      className="
                        w-8
                        h-8
                        rounded-lg
                        bg-[#F2F2F2]
                        flex
                        items-center
                        justify-center
                        shrink-0
                      "
                    >
                      <Settings
                        className="w-4 h-4 text-[#7A7A7A]"
                      />
                    </div>

                    <span className="font-medium">
                      Settings
                    </span>
                  </button>

                </div>

                {/* Logout */}

                <div className="p-2 border-t border-[#EEEEEE]">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      w-full
                      flex
                      items-center
                      gap-3
                      px-3
                      py-2.5
                      rounded-xl
                      text-left
                      text-sm
                      text-[#DC2626]
                      hover:bg-[#FEF2F2]
                      transition-colors
                      cursor-pointer
                    "
                  >
                    <div
                      className="
                        w-8
                        h-8
                        rounded-lg
                        bg-[#FEF2F2]
                        flex
                        items-center
                        justify-center
                        shrink-0
                      "
                    >
                      <LogOut
                        className="w-4 h-4 text-[#DC2626]"
                      />
                    </div>

                    <span className="font-semibold">
                      Sign out
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;




import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getMember } from "../../services/memberService";
import StatusBadge from "../../components/StatusBadge";

import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  ShieldCheck,
  AlertCircle,
  Loader2,
  HeartPulse,
  IdCard,
} from "lucide-react";

const MemberDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchMemberDetails();
  }, [id]);

  const fetchMemberDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMember(id);

      setMember(data);
    } catch (err) {
      console.error("Failed to load member profile:", err);

      setError(
        err.response?.data?.detail ||
          "Member information could not be loaded."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    try {
      return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return date;
    }
  };

  const getInitials = (name) => {
    if (!name) {
      return "M";
    }

    const words = name.trim().split(" ");

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  // ========================================
  // LOADING
  // ========================================

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#2F6FED] animate-spin" />

          <p className="text-sm text-[#7A7A7A]">
            Loading member profile...
          </p>
        </div>
      </div>
    );
  }

  // ========================================
  // ERROR
  // ========================================

  if (error || !member) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-[#EEEEEE] shadow-sm">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />

        <h3 className="text-lg font-semibold text-[#212121]">
          Member Not Found
        </h3>

        <p className="text-sm text-[#7A7A7A] mt-1">
          {error || "The requested member could not be found."}
        </p>

        <button
          type="button"
          onClick={() => navigate("/members")}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-[#2F6FED] text-white rounded-lg text-sm font-medium hover:bg-[#2459C7] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Members
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ========================================
          PAGE HEADER
      ======================================== */}

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate("/members")}
          className="p-2.5 bg-white rounded-lg border border-[#EEEEEE] text-[#7A7A7A] hover:text-[#212121] hover:bg-[#F2F2F2] transition-colors cursor-pointer"
          title="Back to Members"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-2xl font-bold text-[#212121]">
            Member Details
          </h2>

          <p className="text-sm text-[#7A7A7A] mt-0.5">
            View member profile and account information.
          </p>
        </div>
      </div>


      {/* ========================================
          PROFILE HEADER
      ======================================== */}

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EEEEEE]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          {/* PROFILE */}

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#D9F7E8] text-[#212121] flex items-center justify-center font-bold text-xl border border-emerald-200 shrink-0">
              {getInitials(member.full_name)}
            </div>

            <div>
              <h3 className="text-xl font-bold text-[#212121]">
                {member.full_name || "Unnamed Member"}
              </h3>

              <div className="flex flex-wrap items-center gap-3 mt-1">
                <span className="text-sm text-[#2F6FED] font-medium">
                  {member.member_id || "N/A"}
                </span>

                <span className="text-[#EEEEEE]">
                  |
                </span>

                <span className="text-sm text-[#7A7A7A]">
                  {member.gender || "Gender not specified"}
                </span>
              </div>
            </div>
          </div>


          {/* STATUS */}

          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs text-[#7A7A7A] uppercase font-semibold mb-1">
                Status
              </p>

              <StatusBadge
                status={member.status || "UNKNOWN"}
              />
            </div>
          </div>

        </div>
      </div>


      {/* ========================================
          PERSONAL INFORMATION
      ======================================== */}

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EEEEEE]">

        <div className="flex items-center gap-2 border-b border-[#EEEEEE] pb-4 mb-5">
          <User className="w-5 h-5 text-[#2F6FED]" />

          <h3 className="text-lg font-semibold text-[#212121]">
            Personal Information
          </h3>
        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* FULL NAME */}

          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-[#7A7A7A] mt-0.5 shrink-0" />

            <div>
              <p className="text-xs text-[#7A7A7A] uppercase font-semibold">
                Full Name
              </p>

              <p className="text-sm font-medium text-[#212121] mt-1">
                {member.full_name || "N/A"}
              </p>
            </div>
          </div>


          {/* DATE OF BIRTH */}

          <div className="flex items-start gap-3">
            <CalendarDays className="w-5 h-5 text-[#7A7A7A] mt-0.5 shrink-0" />

            <div>
              <p className="text-xs text-[#7A7A7A] uppercase font-semibold">
                Date of Birth
              </p>

              <p className="text-sm font-medium text-[#212121] mt-1">
                {formatDate(member.date_of_birth)}
              </p>
            </div>
          </div>


          {/* GENDER */}

          <div className="flex items-start gap-3">
            <HeartPulse className="w-5 h-5 text-[#7A7A7A] mt-0.5 shrink-0" />

            <div>
              <p className="text-xs text-[#7A7A7A] uppercase font-semibold">
                Gender
              </p>

              <p className="text-sm font-medium text-[#212121] mt-1">
                {member.gender || "N/A"}
              </p>
            </div>
          </div>


          {/* NID / PASSPORT */}

          <div className="flex items-start gap-3">
            <IdCard className="w-5 h-5 text-[#7A7A7A] mt-0.5 shrink-0" />

            <div>
              <p className="text-xs text-[#7A7A7A] uppercase font-semibold">
                NID / Passport
              </p>

              <p className="text-sm font-medium text-[#212121] mt-1">
                {member.nid_or_passport || "N/A"}
              </p>
            </div>
          </div>


          {/* PHONE */}

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-[#7A7A7A] mt-0.5 shrink-0" />

            <div>
              <p className="text-xs text-[#7A7A7A] uppercase font-semibold">
                Phone
              </p>

              <p className="text-sm font-medium text-[#212121] mt-1">
                {member.phone || "N/A"}
              </p>
            </div>
          </div>


          {/* EMAIL */}

          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-[#7A7A7A] mt-0.5 shrink-0" />

            <div className="min-w-0">
              <p className="text-xs text-[#7A7A7A] uppercase font-semibold">
                Email
              </p>

              <p className="text-sm font-medium text-[#212121] mt-1 break-all">
                {member.email || "N/A"}
              </p>
            </div>
          </div>


          {/* ADDRESS */}

          <div className="flex items-start gap-3 sm:col-span-2 lg:col-span-3">
            <MapPin className="w-5 h-5 text-[#7A7A7A] mt-0.5 shrink-0" />

            <div>
              <p className="text-xs text-[#7A7A7A] uppercase font-semibold">
                Address
              </p>

              <p className="text-sm font-medium text-[#212121] mt-1">
                {member.address || "N/A"}
              </p>
            </div>
          </div>

        </div>
      </div>


      {/* ========================================
          EMERGENCY CONTACT
      ======================================== */}

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EEEEEE]">

        <div className="flex items-center gap-2 border-b border-[#EEEEEE] pb-4 mb-5">

          <AlertCircle className="w-5 h-5 text-[#2F6FED]" />

          <h3 className="text-lg font-semibold text-[#212121]">
            Emergency Contact
          </h3>

        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div>
            <p className="text-xs text-[#7A7A7A] uppercase font-semibold">
              Contact Name
            </p>

            <p className="text-sm font-medium text-[#212121] mt-1">
              {member.emergency_contact_name || "N/A"}
            </p>
          </div>


          <div>
            <p className="text-xs text-[#7A7A7A] uppercase font-semibold">
              Contact Phone
            </p>

            <p className="text-sm font-medium text-[#212121] mt-1">
              {member.emergency_contact_phone || "N/A"}
            </p>
          </div>

        </div>
      </div>


      {/* ========================================
          ACCOUNT INFORMATION
      ======================================== */}

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EEEEEE]">

        <div className="flex items-center gap-2 border-b border-[#EEEEEE] pb-4 mb-5">

          <ShieldCheck className="w-5 h-5 text-[#2F6FED]" />

          <h3 className="text-lg font-semibold text-[#212121]">
            Account Information
          </h3>

        </div>


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* MEMBER ID */}

          <div>
            <p className="text-xs text-[#7A7A7A] uppercase font-semibold">
              Member ID
            </p>

            <p className="text-sm font-semibold text-[#2F6FED] mt-1">
              {member.member_id || "N/A"}
            </p>
          </div>


          {/* REGISTRATION DATE */}

          <div>
            <p className="text-xs text-[#7A7A7A] uppercase font-semibold">
              Registration Date
            </p>

            <p className="text-sm font-medium text-[#212121] mt-1">
              {formatDate(member.registration_date)}
            </p>
          </div>


          {/* CREATED AT */}

          <div>
            <p className="text-xs text-[#7A7A7A] uppercase font-semibold">
              Created At
            </p>

            <p className="text-sm font-medium text-[#212121] mt-1">
              {formatDate(member.created_at)}
            </p>
          </div>


          {/* LAST UPDATED */}

          <div>
            <p className="text-xs text-[#7A7A7A] uppercase font-semibold">
              Last Updated
            </p>

            <p className="text-sm font-medium text-[#212121] mt-1">
              {formatDate(member.updated_at)}
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default MemberDetails;




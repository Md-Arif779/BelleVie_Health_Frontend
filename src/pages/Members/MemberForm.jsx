
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Save,
  Loader2,
  User,
  Phone,
  Mail,
  MapPin,
  CalendarDays,
  IdCard,
  AlertCircle,
} from "lucide-react";

import {
  createMember,
  getMember,
  updateMember,
} from "../../services/memberService";

const MemberForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditMode);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "",
    nid_or_passport: "",
    phone: "",
    email: "",
    address: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (isEditMode) {
      loadMember();
    }
  }, [id]);

  const loadMember = async () => {
    try {
      setPageLoading(true);
      setError("");

      const data = await getMember(id);

      setFormData({
        full_name: data.full_name || "",
        date_of_birth: data.date_of_birth || "",
        gender: data.gender || "",
        nid_or_passport: data.nid_or_passport || "",
        phone: data.phone || "",
        email: data.email || "",
        address: data.address || "",
        emergency_contact_name:
          data.emergency_contact_name || "",
        emergency_contact_phone:
          data.emergency_contact_phone || "",
        status: data.status || "ACTIVE",
      });
    } catch (err) {
      console.error("Load Member Error:", err);

      setError(
        err.response?.data?.detail ||
          "Failed to load member information."
      );
    } finally {
      setPageLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.full_name.trim()) {
      setError("Full name is required.");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Phone number is required.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        full_name: formData.full_name.trim(),
        date_of_birth:
          formData.date_of_birth || null,
        gender: formData.gender || null,
        nid_or_passport:
          formData.nid_or_passport.trim() || null,
        phone: formData.phone.trim(),
        email: formData.email.trim() || null,
        address: formData.address.trim() || null,
        emergency_contact_name:
          formData.emergency_contact_name.trim() || null,
        emergency_contact_phone:
          formData.emergency_contact_phone.trim() || null,
        status: formData.status,
      };

      if (isEditMode) {
        await updateMember(id, payload);

        setSuccess("Member updated successfully.");

        setTimeout(() => {
          navigate(`/members/${id}`);
        }, 700);
      } else {
        const createdMember =
          await createMember(payload);

        setSuccess("Member created successfully.");

        setTimeout(() => {
          if (createdMember?.id) {
            navigate(`/members/${createdMember.id}`);
          } else {
            navigate("/members");
          }
        }, 700);
      }
    } catch (err) {
      console.error(
        isEditMode
          ? "Update Member Error:"
          : "Create Member Error:",
        err
      );

      const responseData = err.response?.data;

      if (responseData) {
        if (typeof responseData === "object") {
          const messages = Object.entries(
            responseData
          )
            .map(([field, value]) => {
              const message = Array.isArray(value)
                ? value.join(", ")
                : value;

              return `${field}: ${message}`;
            })
            .join(" | ");

          setError(
            messages || "Something went wrong."
          );
        } else {
          setError(String(responseData));
        }
      } else {
        setError(
          isEditMode
            ? "Failed to update member."
            : "Failed to create member."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2
            size={32}
            className="animate-spin text-[#2F6FED]"
          />

          <p className="text-sm text-[#7A7A7A]">
            Loading member information...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex items-center gap-3">

        <button
          type="button"
          onClick={() => navigate("/members")}
          className="rounded-lg border border-[#E5E7EB] bg-white p-2.5 text-[#7A7A7A] transition hover:bg-[#F2F2F2] hover:text-[#212121]"
          title="Back to Members"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-[#212121]">
            {isEditMode
              ? "Edit Member"
              : "Add Member"}
          </h1>

          <p className="mt-1 text-sm text-[#7A7A7A]">
            {isEditMode
              ? "Update member information."
              : "Create a new BelleVie Health member."}
          </p>
        </div>

      </div>


      {/* ================= ERROR ================= */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">

          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0 text-[#DC2626]"
          />

          <p className="text-sm font-medium text-[#DC2626]">
            {error}
          </p>

        </div>
      )}


      {/* ================= SUCCESS ================= */}
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3">

          <p className="text-sm font-medium text-green-700">
            {success}
          </p>

        </div>
      )}


      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >

        {/* ================= PERSONAL INFORMATION ================= */}
        <div className="rounded-2xl border border-[#EEEEEE] bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center gap-2 border-b border-[#EEEEEE] pb-4">

            <User
              size={20}
              className="text-[#2F6FED]"
            />

            <h2 className="text-lg font-semibold text-[#212121]">
              Personal Information
            </h2>

          </div>


          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* FULL NAME */}
            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Full Name
                <span className="text-red-500">
                  {" "}*
                </span>
              </label>

              <div className="relative">

                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]"
                />

                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="w-full rounded-lg border border-[#E5E7EB] py-3 pl-10 pr-4 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED] focus:ring-1 focus:ring-[#2F6FED]"
                  required
                />

              </div>

            </div>


            {/* DATE OF BIRTH */}
            <div>

              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Date of Birth
              </label>

              <div className="relative">

                <CalendarDays
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]"
                />

                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#E5E7EB] py-3 pl-10 pr-4 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED] focus:ring-1 focus:ring-[#2F6FED]"
                />

              </div>

            </div>


            {/* GENDER */}
            <div>

              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Gender
              </label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED] focus:ring-1 focus:ring-[#2F6FED]"
              >
                <option value="">
                  Select Gender
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


            {/* NID / PASSPORT */}
            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium text-[#212121]">
                NID / Passport
              </label>

              <div className="relative">

                <IdCard
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]"
                />

                <input
                  type="text"
                  name="nid_or_passport"
                  value={formData.nid_or_passport}
                  onChange={handleChange}
                  placeholder="Enter NID or Passport number"
                  className="w-full rounded-lg border border-[#E5E7EB] py-3 pl-10 pr-4 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED] focus:ring-1 focus:ring-[#2F6FED]"
                />

              </div>

            </div>

          </div>

        </div>


        {/* ================= CONTACT INFORMATION ================= */}
        <div className="rounded-2xl border border-[#EEEEEE] bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center gap-2 border-b border-[#EEEEEE] pb-4">

            <Phone
              size={20}
              className="text-[#2F6FED]"
            />

            <h2 className="text-lg font-semibold text-[#212121]">
              Contact Information
            </h2>

          </div>


          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* PHONE */}
            <div>

              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Phone
                <span className="text-red-500">
                  {" "}*
                </span>
              </label>

              <div className="relative">

                <Phone
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]"
                />

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full rounded-lg border border-[#E5E7EB] py-3 pl-10 pr-4 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED] focus:ring-1 focus:ring-[#2F6FED]"
                  required
                />

              </div>

            </div>


            {/* EMAIL */}
            <div>

              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Email
              </label>

              <div className="relative">

                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="w-full rounded-lg border border-[#E5E7EB] py-3 pl-10 pr-4 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED] focus:ring-1 focus:ring-[#2F6FED]"
                />

              </div>

            </div>


            {/* ADDRESS */}
            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Address
              </label>

              <div className="relative">

                <MapPin
                  size={18}
                  className="absolute left-3 top-3 text-[#7A7A7A]"
                />

                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter full address"
                  rows="4"
                  className="w-full resize-none rounded-lg border border-[#E5E7EB] py-3 pl-10 pr-4 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED] focus:ring-1 focus:ring-[#2F6FED]"
                />

              </div>

            </div>

          </div>

        </div>


        {/* ================= EMERGENCY CONTACT ================= */}
        <div className="rounded-2xl border border-[#EEEEEE] bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center gap-2 border-b border-[#EEEEEE] pb-4">

            <AlertCircle
              size={20}
              className="text-[#2F6FED]"
            />

            <h2 className="text-lg font-semibold text-[#212121]">
              Emergency Contact
            </h2>

          </div>


          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* EMERGENCY NAME */}
            <div>

              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Contact Name
              </label>

              <input
                type="text"
                name="emergency_contact_name"
                value={
                  formData.emergency_contact_name
                }
                onChange={handleChange}
                placeholder="Emergency contact name"
                className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED] focus:ring-1 focus:ring-[#2F6FED]"
              />

            </div>


            {/* EMERGENCY PHONE */}
            <div>

              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Contact Phone
              </label>

              <input
                type="tel"
                name="emergency_contact_phone"
                value={
                  formData.emergency_contact_phone
                }
                onChange={handleChange}
                placeholder="Emergency contact phone"
                className="w-full rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED] focus:ring-1 focus:ring-[#2F6FED]"
              />

            </div>

          </div>

        </div>


        {/* ================= ACCOUNT STATUS ================= */}
        <div className="rounded-2xl border border-[#EEEEEE] bg-white p-6 shadow-sm">

          <div className="mb-6 flex items-center gap-2 border-b border-[#EEEEEE] pb-4">

            <IdCard
              size={20}
              className="text-[#2F6FED]"
            />

            <h2 className="text-lg font-semibold text-[#212121]">
              Account Status
            </h2>

          </div>


          <div className="max-w-md">

            <label className="mb-2 block text-sm font-medium text-[#212121]">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED] focus:ring-1 focus:ring-[#2F6FED]"
            >
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

          </div>

        </div>


        {/* ================= ACTIONS ================= */}
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

          <button
            type="button"
            onClick={() => navigate("/members")}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-lg border border-[#E5E7EB] bg-white px-5 py-3 text-sm font-semibold text-[#212121] transition hover:bg-[#F2F2F2] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>


          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2F6FED] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2459C7] disabled:cursor-not-allowed disabled:opacity-60"
          >

            {loading ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />

                {isEditMode
                  ? "Updating..."
                  : "Saving..."}
              </>
            ) : (
              <>
                <Save size={18} />

                {isEditMode
                  ? "Update Member"
                  : "Save Member"}
              </>
            )}

          </button>

        </div>

      </form>

    </div>
  );
};

export default MemberForm;

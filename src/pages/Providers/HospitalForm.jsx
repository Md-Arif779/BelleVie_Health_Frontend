import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Save,
  Loader2,
} from "lucide-react";

import {
  getHospital,
  createHospital,
  updateHospital,
} from "../../services/hospitalService";

import { useAuth } from "../../context/AuthContext";
import {
  canAdd,
  canEdit,
} from "../../utils/permission";


const initialForm = {
  name: "",
  location: "",
  specialties: "",
  departments: "",
  services: "",
  packages: "",
  phone: "",
  email: "",
  website: "",
  status: "ACTIVE",
};


function HospitalForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEditMode = Boolean(id);

  const { permissions } = useAuth();

  const [formData, setFormData] = useState(initialForm);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditMode);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // =========================
  // LOAD HOSPITAL FOR EDIT
  // =========================

  useEffect(() => {
    if (!isEditMode) {
      return;
    }

    const loadHospital = async () => {
      try {
        setPageLoading(true);
        setError("");

        const data = await getHospital(id);

        setFormData({
          name: data.name || "",
          location: data.location || "",
          specialties: data.specialties || "",
          departments: data.departments || "",
          services: data.services || "",
          packages: data.packages || "",
          phone: data.phone || "",
          email: data.email || "",
          website: data.website || "",
          status: data.status || "ACTIVE",
        });
      } catch (err) {
        console.error("Hospital Details Error:", err);

        setError(
          err?.response?.data?.detail ||
          "Failed to load hospital."
        );
      } finally {
        setPageLoading(false);
      }
    };

    loadHospital();
  }, [id, isEditMode]);


  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // Permission check

    if (
      !isEditMode &&
      !canAdd(permissions, "hospitals")
    ) {
      setError(
        "You do not have permission to add hospitals."
      );
      return;
    }

    if (
      isEditMode &&
      !canEdit(permissions, "hospitals")
    ) {
      setError(
        "You do not have permission to edit hospitals."
      );
      return;
    }


    // Validation

    if (!formData.name.trim()) {
      setError("Hospital name is required.");
      return;
    }

    if (!formData.location.trim()) {
      setError("Location is required.");
      return;
    }


    try {
      setLoading(true);

      if (isEditMode) {
        await updateHospital(id, formData);
        setSuccess("Hospital updated successfully.");
      } else {
        await createHospital(formData);
        setSuccess("Hospital created successfully.");
      }

      setTimeout(() => {
        navigate("/hospitals");
      }, 700);

    } catch (err) {
      console.error("Hospital Save Error:", err);

      const apiError = err?.response?.data;

      if (typeof apiError === "object") {
        const messages = Object.entries(apiError)
          .map(([field, value]) => {
            const message = Array.isArray(value)
              ? value.join(", ")
              : value;

            return `${field}: ${message}`;
          })
          .join(" | ");

        setError(
          messages || "Failed to save hospital."
        );
      } else {
        setError("Failed to save hospital.");
      }
    } finally {
      setLoading(false);
    }
  };


  // =========================
  // PAGE LOADING
  // =========================

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">

        <div className="flex min-h-[400px] items-center justify-center">

          <div className="flex items-center gap-3 text-sm text-[#7A7A7A]">

            <Loader2
              size={20}
              className="animate-spin text-[#2F6FED]"
            />

            Loading hospital...

          </div>

        </div>

      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">

      {/* =========================
          HEADER
      ========================= */}

      <div className="mb-6 flex items-center justify-between">

        <div className="flex items-center gap-3">

          <button
            type="button"
            onClick={() => navigate("/hospitals")}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#7A7A7A] transition hover:bg-[#EEF4FF] hover:text-[#2F6FED]"
          >
            <ArrowLeft size={19} />
          </button>


          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D9F7E8]">
            <Building2
              size={23}
              className="text-[#2F6FED]"
            />
          </div>


          <div>
            <h1 className="text-2xl font-bold text-[#212121]">
              {isEditMode
                ? "Edit Hospital"
                : "Add Hospital"}
            </h1>

            <p className="text-sm text-[#7A7A7A]">
              {isEditMode
                ? "Update hospital information"
                : "Add a new healthcare provider hospital"}
            </p>
          </div>

        </div>

      </div>


      {/* =========================
          FORM
      ========================= */}

      <form onSubmit={handleSubmit}>

        <div className="mx-auto max-w-5xl space-y-6">


          {/* =========================
              BASIC INFORMATION
          ========================= */}

          <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm">

            <div className="border-b border-[#E5E7EB] px-6 py-4">

              <h2 className="font-semibold text-[#212121]">
                Basic Information
              </h2>

              <p className="mt-1 text-sm text-[#7A7A7A]">
                Basic hospital identification and location
              </p>

            </div>


            <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">


              {/* Hospital Name */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[#212121]">
                  Hospital Name
                  <span className="ml-1 text-[#DC2626]">*</span>
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter hospital name"
                  className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
                />
              </div>


              {/* Location */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[#212121]">
                  Location
                  <span className="ml-1 text-[#DC2626]">*</span>
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Enter hospital location"
                  className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
                />
              </div>

            </div>

          </div>


          {/* =========================
              HOSPITAL SERVICES
          ========================= */}

          <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm">

            <div className="border-b border-[#E5E7EB] px-6 py-4">

              <h2 className="font-semibold text-[#212121]">
                Hospital Services
              </h2>

              <p className="mt-1 text-sm text-[#7A7A7A]">
                Specialties, departments and available services
              </p>

            </div>


            <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">


              {/* Specialties */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[#212121]">
                  Specialties
                </label>

                <textarea
                  name="specialties"
                  value={formData.specialties}
                  onChange={handleChange}
                  rows={4}
                  placeholder="e.g. Cardiology, Neurology, Orthopedics"
                  className="w-full resize-none rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
                />
              </div>


              {/* Departments */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[#212121]">
                  Departments
                </label>

                <textarea
                  name="departments"
                  value={formData.departments}
                  onChange={handleChange}
                  rows={4}
                  placeholder="e.g. ICU, Emergency, Radiology"
                  className="w-full resize-none rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
                />
              </div>


              {/* Services */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[#212121]">
                  Services
                </label>

                <textarea
                  name="services"
                  value={formData.services}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Enter available hospital services"
                  className="w-full resize-none rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
                />
              </div>


              {/* Packages */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[#212121]">
                  Packages
                </label>

                <textarea
                  name="packages"
                  value={formData.packages}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Enter available packages"
                  className="w-full resize-none rounded-lg border border-[#E5E7EB] px-4 py-3 text-sm outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
                />
              </div>

            </div>

          </div>


          {/* =========================
              CONTACT INFORMATION
          ========================= */}

          <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm">

            <div className="border-b border-[#E5E7EB] px-6 py-4">

              <h2 className="font-semibold text-[#212121]">
                Contact Information
              </h2>

              <p className="mt-1 text-sm text-[#7A7A7A]">
                Hospital contact and website information
              </p>

            </div>


            <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">


              {/* Phone */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[#212121]">
                  Phone
                </label>

                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
                />
              </div>


              {/* Email */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[#212121]">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
                />
              </div>


              {/* Website */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-medium text-[#212121]">
                  Website
                </label>

                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="w-full rounded-lg border border-[#E5E7EB] px-4 py-2.5 text-sm outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
                />

              </div>

            </div>

          </div>


          {/* =========================
              STATUS
          ========================= */}

          <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm">

            <div className="border-b border-[#E5E7EB] px-6 py-4">

              <h2 className="font-semibold text-[#212121]">
                Status
              </h2>

            </div>


            <div className="p-6">

              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Hospital Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full max-w-md rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
              >
                <option value="ACTIVE">
                  Active
                </option>

                <option value="INACTIVE">
                  Inactive
                </option>
              </select>

            </div>

          </div>


          {/* =========================
              ERROR / SUCCESS
          ========================= */}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-[#DC2626]">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-[#16A34A]">
              {success}
            </div>
          )}


          {/* =========================
              ACTIONS
          ========================= */}

          <div className="flex items-center justify-end gap-3 pb-6">

            <button
              type="button"
              onClick={() => navigate("/hospitals")}
              className="rounded-lg border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-medium text-[#212121] transition hover:bg-[#F9FAFB]"
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 rounded-lg bg-[#2F6FED] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2459C7] disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? (
                <>
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  Saving...
                </>
              ) : (
                <>
                  <Save size={18} />

                  {isEditMode
                    ? "Update Hospital"
                    : "Save Hospital"}
                </>
              )}

            </button>

          </div>

        </div>

      </form>

    </div>
  );
}

export default HospitalForm;
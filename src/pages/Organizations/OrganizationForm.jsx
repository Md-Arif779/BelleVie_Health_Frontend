
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Building2,
  Save,
} from "lucide-react";

import {
  getOrganization,
  createOrganization,
  updateOrganization,
} from "../../services/organizationService";


function OrganizationForm() {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    organization_type: "",
    contact_person: "",
    phone: "",
    email: "",
    address: "",
    status: "ACTIVE",
    notes: "",
  });

  // =====================================================
  // LOAD ORGANIZATION FOR EDIT
  // =====================================================

  useEffect(() => {
    if (!isEdit) return;

    const loadOrganization = async () => {
      try {
        setLoading(true);

        const data = await getOrganization(id);

        setFormData({
          name: data.name || "",
          organization_type:
            data.organization_type || "",
          contact_person:
            data.contact_person || "",
          phone: data.phone || "",
          email: data.email || "",
          address: data.address || "",
          status: data.status || "ACTIVE",
          notes: data.notes || "",
        });
      } catch (error) {
        console.error(
          "Organization Details Error:",
          error
        );

        alert(
          "Failed to load organization."
        );

        navigate("/organizations");
      } finally {
        setLoading(false);
      }
    };

    loadOrganization();
  }, [id, isEdit, navigate]);

  // =====================================================
  // INPUT CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Organization name is required.");
      return;
    }

    if (!formData.organization_type.trim()) {
      alert(
        "Organization type is required."
      );
      return;
    }

    try {
      setSaving(true);

      if (isEdit) {
        await updateOrganization(
          id,
          formData
        );
      } else {
        await createOrganization(
          formData
        );
      }

      navigate("/organizations");
    } catch (error) {
      console.error(
        "Save Organization Error:",
        error
      );

      console.error(
        "Backend Response:",
        error?.response?.data
      );

      const backendMessage =
        error?.response?.data;

      if (
        backendMessage &&
        typeof backendMessage === "object"
      ) {
        const messages = Object.entries(
          backendMessage
        )
          .map(
            ([field, message]) =>
              `${field}: ${
                Array.isArray(message)
                  ? message.join(", ")
                  : message
              }`
          )
          .join("\n");

        alert(messages);
      } else {
        alert(
          "Failed to save organization."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">

        <div className="rounded-xl border border-[#EEEEEE] bg-white p-10 text-center shadow-sm">

          <p className="text-sm text-[#7A7A7A]">
            Loading organization...
          </p>

        </div>

      </div>
    );
  }

  // =====================================================
  // FORM
  // =====================================================

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-6 flex items-center gap-4">

        <button
          type="button"
          onClick={() =>
            navigate("/organizations")
          }
          className="rounded-lg border border-[#EEEEEE] bg-white p-2.5 text-[#212121] transition hover:bg-[#F2F2F2]"
          title="Back"
        >
          <ArrowLeft size={19} />
        </button>

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D9F7E8]">

            <Building2
              size={22}
              className="text-[#2F6FED]"
            />

          </div>

          <div>

            <h1 className="text-2xl font-semibold text-[#212121]">
              {isEdit
                ? "Edit Organization"
                : "Create Organization"}
            </h1>

            <p className="text-sm text-[#7A7A7A]">
              {isEdit
                ? "Update organization information"
                : "Add a new organization"}
            </p>

          </div>

        </div>

      </div>


      {/* =================================================
          FORM CARD
      ================================================= */}

      <form
        onSubmit={handleSubmit}
        className="mx-auto max-w-5xl"
      >

        <div className="rounded-xl border border-[#EEEEEE] bg-white shadow-sm">

          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

          <div className="border-b border-[#EEEEEE] p-6">

            <h2 className="mb-1 text-lg font-semibold text-[#212121]">
              Organization Information
            </h2>

            <p className="mb-6 text-sm text-[#7A7A7A]">
              Enter the basic organization details.
            </p>


            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              {/* NAME */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[#212121]">
                  Organization Name
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter organization name"
                  className="w-full rounded-lg border border-[#EEEEEE] px-4 py-2.5 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED]"
                  required
                />
              </div>


              {/* TYPE */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[#212121]">
                  Organization Type
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  name="organization_type"
                  value={
                    formData.organization_type
                  }
                  onChange={handleChange}
                  placeholder="e.g. Corporate, NGO, Hospital"
                  className="w-full rounded-lg border border-[#EEEEEE] px-4 py-2.5 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED]"
                  required
                />
              </div>


              {/* CONTACT PERSON */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[#212121]">
                  Contact Person
                </label>

                <input
                  type="text"
                  name="contact_person"
                  value={
                    formData.contact_person
                  }
                  onChange={handleChange}
                  placeholder="Enter contact person"
                  className="w-full rounded-lg border border-[#EEEEEE] px-4 py-2.5 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED]"
                />
              </div>


              {/* PHONE */}

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
                  className="w-full rounded-lg border border-[#EEEEEE] px-4 py-2.5 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED]"
                />
              </div>


              {/* EMAIL */}

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
                  className="w-full rounded-lg border border-[#EEEEEE] px-4 py-2.5 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED]"
                />
              </div>


              {/* STATUS */}

              <div>
                <label className="mb-2 block text-sm font-medium text-[#212121]">
                  Status
                </label>

                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#EEEEEE] bg-white px-4 py-2.5 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED]"
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

          </div>


          {/* =================================================
              ADDRESS
          ================================================= */}

          <div className="border-b border-[#EEEEEE] p-6">

            <h2 className="mb-1 text-lg font-semibold text-[#212121]">
              Address
            </h2>

            <p className="mb-5 text-sm text-[#7A7A7A]">
              Enter the organization's address.
            </p>

            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter organization address"
              rows={4}
              className="w-full resize-none rounded-lg border border-[#EEEEEE] px-4 py-3 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED]"
            />

          </div>


          {/* =================================================
              NOTES
          ================================================= */}

          <div className="p-6">

            <h2 className="mb-1 text-lg font-semibold text-[#212121]">
              Notes
            </h2>

            <p className="mb-5 text-sm text-[#7A7A7A]">
              Add any additional information.
            </p>

            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Enter notes..."
              rows={4}
              className="w-full resize-none rounded-lg border border-[#EEEEEE] px-4 py-3 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED]"
            />

          </div>


          {/* =================================================
              ACTIONS
          ================================================= */}

          <div className="flex flex-col-reverse gap-3 border-t border-[#EEEEEE] bg-[#FAFAFA] p-6 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={() =>
                navigate("/organizations")
              }
              disabled={saving}
              className="rounded-lg border border-[#EEEEEE] bg-white px-5 py-2.5 text-sm font-medium text-[#212121] transition hover:bg-[#F2F2F2] disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#2F6FED] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >

              <Save size={18} />

              {saving
                ? "Saving..."
                : isEdit
                  ? "Update Organization"
                  : "Save Organization"}

            </button>

          </div>

        </div>

      </form>

    </div>
  );
}

export default OrganizationForm;


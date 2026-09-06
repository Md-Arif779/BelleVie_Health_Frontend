import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  FlaskConical,
  Save,
  Loader2,
} from "lucide-react";

import {
  getLabResult,
  createLabResult,
  updateLabResult,
} from "../../services/labResultService";

import { getMembers } from "../../services/memberService";
import { getLabTestBookings } from "../../services/labTestBookingService";
import { getDiagnosticCenters } from "../../services/diagnosticService";

import { useAuth } from "../../context/AuthContext";
import {
  canAdd,
  canEdit,
} from "../../utils/permission";

const initialFormData = {
  booking: "",
  member: "",
  diagnostic_center: "",
  test_name: "",
  result_value: "",
  reference_range: "",
  unit: "",
  result_date: "",
  status: "PENDING",
  interpretation: "",
  notes: "",
};

const statusOptions = [
  {
    value: "PENDING",
    label: "Pending",
  },
  {
    value: "COMPLETED",
    label: "Completed",
  },
  {
    value: "REVIEWED",
    label: "Reviewed",
  },
];

const getMemberName = (member) => {
  return (
    member?.full_name ||
    member?.name ||
    "-"
  );
};

const getMemberId = (member) => {
  return member?.member_id || "-";
};

const getBookingId = (booking) => {
  return (
    booking?.booking_id ||
    `#${booking?.id || "-"}`
  );
};

const getDiagnosticCenterName = (center) => {
  return (
    center?.name ||
    center?.center_name ||
    center?.diagnostic_center_name ||
    center?.full_name ||
    `Center #${center?.id || "-"}`
  );
};

const getBookingDiagnosticCenterId = (booking) => {
  if (!booking) {
    return "";
  }

  if (
    typeof booking.diagnostic_center === "object" &&
    booking.diagnostic_center !== null
  ) {
    return (
      booking.diagnostic_center.id ||
      ""
    );
  }

  return (
    booking.diagnostic_center ||
    booking.diagnostic_center_id ||
    ""
  );
};

const getBookingMemberId = (booking) => {
  if (!booking) {
    return "";
  }

  if (
    typeof booking.member === "object" &&
    booking.member !== null
  ) {
    return booking.member.id || "";
  }

  return (
    booking.member ||
    booking.member_id ||
    ""
  );
};

function LabResultForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEditMode = Boolean(id);

  const { permissions } = useAuth();

  const [formData, setFormData] =
    useState(initialFormData);

  const [members, setMembers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [diagnosticCenters, setDiagnosticCenters] =
    useState([]);

  const [loading, setLoading] = useState(
    isEditMode
  );

  const [loadingOptions, setLoadingOptions] =
    useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [fieldErrors, setFieldErrors] =
    useState({});

  useEffect(() => {
    const loadOptions = async () => {
      try {
        setLoadingOptions(true);
        setError("");

        const [
          membersData,
          bookingsData,
          diagnosticCentersData,
        ] = await Promise.all([
          getMembers(),
          getLabTestBookings(),
          getDiagnosticCenters(),
        ]);

        const memberList = Array.isArray(
          membersData
        )
          ? membersData
          : Array.isArray(membersData?.results)
          ? membersData.results
          : [];

        const bookingList = Array.isArray(
          bookingsData
        )
          ? bookingsData
          : Array.isArray(bookingsData?.results)
          ? bookingsData.results
          : [];

        const centerList = Array.isArray(
          diagnosticCentersData
        )
          ? diagnosticCentersData
          : Array.isArray(
              diagnosticCentersData?.results
            )
          ? diagnosticCentersData.results
          : [];

        setMembers(memberList);
        setBookings(bookingList);
        setDiagnosticCenters(centerList);
      } catch (err) {
        console.error(
          "Lab Result Options Error:",
          err
        );

        setError(
          err?.response?.data?.detail ||
            err?.response?.data?.message ||
            "Failed to load members, bookings or diagnostic centers."
        );
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  useEffect(() => {
    if (!isEditMode) {
      setLoading(false);
      return;
    }

    const loadResult = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getLabResult(id);

        setFormData({
          booking:
            data?.booking?.id ||
            data?.booking ||
            "",
          member:
            data?.member?.id ||
            data?.member ||
            "",
          diagnostic_center:
            data?.diagnostic_center?.id ||
            data?.diagnostic_center ||
            "",
          test_name:
            data?.test_name || "",
          result_value:
            data?.result_value || "",
          reference_range:
            data?.reference_range || "",
          unit:
            data?.unit || "",
          result_date:
            data?.result_date || "",
          status:
            data?.status || "PENDING",
          interpretation:
            data?.interpretation || "",
          notes:
            data?.notes || "",
        });
      } catch (err) {
        console.error(
          "Lab Result Details Error:",
          err
        );

        setError(
          err?.response?.data?.detail ||
            err?.response?.data?.message ||
            "Failed to load lab result."
        );
      } finally {
        setLoading(false);
      }
    };

    loadResult();
  }, [id, isEditMode]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setFieldErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };

  const handleBookingChange = (event) => {
    const bookingId = event.target.value;

    const selectedBooking =
      bookings.find(
        (booking) =>
          String(booking.id) ===
          String(bookingId)
      );

    const selectedMemberId =
      getBookingMemberId(
        selectedBooking
      );

    const selectedCenterId =
      getBookingDiagnosticCenterId(
        selectedBooking
      );

    setFormData((current) => ({
      ...current,

      booking: bookingId,

      member:
        selectedMemberId ||
        current.member,

      diagnostic_center:
        selectedCenterId ||
        current.diagnostic_center,

      test_name:
        selectedBooking?.test_name ||
        current.test_name,
    }));

    setFieldErrors((current) => ({
      ...current,
      booking: "",
      member: "",
      diagnostic_center: "",
      test_name: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setFieldErrors({});

    if (!formData.booking) {
      setError(
        "Please select a lab test booking."
      );
      setSaving(false);
      return;
    }

    if (!formData.member) {
      setError(
        "Please select a member."
      );
      setSaving(false);
      return;
    }

    if (!formData.diagnostic_center) {
      setError(
        "Please select a diagnostic center."
      );
      setSaving(false);
      return;
    }

    if (!formData.test_name.trim()) {
      setError(
        "Test name is required."
      );
      setSaving(false);
      return;
    }

    if (!formData.result_date) {
      setError(
        "Result date is required."
      );
      setSaving(false);
      return;
    }

    const payload = {
      booking: Number(
        formData.booking
      ),

      member: Number(
        formData.member
      ),

      diagnostic_center: Number(
        formData.diagnostic_center
      ),

      test_name:
        formData.test_name.trim(),

      result_value:
        formData.result_value.trim(),

      reference_range:
        formData.reference_range.trim(),

      unit:
        formData.unit.trim(),

      result_date:
        formData.result_date,

      status:
        formData.status,

      interpretation:
        formData.interpretation.trim(),

      notes:
        formData.notes.trim(),
    };

    try {
      if (isEditMode) {
        await updateLabResult(
          id,
          payload
        );
      } else {
        await createLabResult(
          payload
        );
      }

      navigate("/lab-results");
    } catch (err) {
      console.error(
        "Save Lab Result Error:",
        err
      );

      const responseData =
        err?.response?.data;

      if (
        responseData &&
        typeof responseData ===
          "object" &&
        !Array.isArray(
          responseData
        )
      ) {
        const extractedErrors =
          {};

        Object.entries(
          responseData
        ).forEach(
          ([key, value]) => {
            extractedErrors[key] =
              Array.isArray(value)
                ? value.join(" ")
                : String(value);
          }
        );

        setFieldErrors(
          extractedErrors
        );

        setError(
          responseData?.detail ||
            responseData?.message ||
            "Please correct the highlighted fields."
        );
      } else {
        setError(
          "Failed to save lab result."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F2F2F2]">
        <div className="flex items-center gap-2 text-sm text-[#7A7A7A]">
          <Loader2
            size={20}
            className="animate-spin"
          />
          Loading lab result...
        </div>
      </div>
    );
  }

  const allowed = isEditMode
    ? canEdit(
        permissions,
        "lab_results"
      )
    : canAdd(
        permissions,
        "lab_results"
      );

  if (!allowed) {
    return (
      <div className="min-h-screen bg-[#F2F2F2] p-6">
        <div className="rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-[#212121]">
            Permission Denied
          </h2>

          <p className="mt-2 text-sm text-[#7A7A7A]">
            You do not have permission to{" "}
            {isEditMode
              ? "edit"
              : "add"}{" "}
            lab results.
          </p>

          <Link
            to="/lab-results"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#2F6FED] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#2459C7]"
          >
            <ArrowLeft size={17} />
            Back to Lab Results
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F2F2] p-6">

      {/* HEADER */}
      <div className="mb-6 flex items-center gap-4">

        <Link
          to="/lab-results"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#212121] hover:bg-[#F9FAFB]"
        >
          <ArrowLeft size={19} />
        </Link>

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D9F7E8]">
            <FlaskConical
              size={23}
              className="text-[#2F6FED]"
            />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#212121]">
              {isEditMode
                ? "Edit Lab Result"
                : "Add Lab Result"}
            </h1>

            <p className="text-sm text-[#7A7A7A]">
              {isEditMode
                ? "Update diagnostic test result"
                : "Enter diagnostic test result information"}
            </p>
          </div>

        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSubmit}>

        <div className="rounded-xl border border-[#E5E7EB] bg-white shadow-sm">

          <div className="border-b border-[#E5E7EB] px-6 py-5">

            <h2 className="text-lg font-semibold text-[#212121]">
              Result Information
            </h2>

            <p className="mt-1 text-sm text-[#7A7A7A]">
              Fill in the laboratory test result details.
            </p>

          </div>

          <div className="grid grid-cols-1 gap-5 p-6 md:grid-cols-2">

            {/* BOOKING */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Lab Test Booking{" "}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <select
                name="booking"
                value={
                  formData.booking
                }
                onChange={
                  handleBookingChange
                }
                disabled={
                  loadingOptions
                }
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#212121] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
              >
                <option value="">
                  {loadingOptions
                    ? "Loading bookings..."
                    : "Select lab test booking"}
                </option>

                {bookings.map(
                  (booking) => (
                    <option
                      key={
                        booking.id
                      }
                      value={
                        booking.id
                      }
                    >
                      {
                        getBookingId(
                          booking
                        )
                      }{" "}
                      —{" "}
                      {booking.test_name ||
                        "Lab Test"}
                    </option>
                  )
                )}
              </select>

              {fieldErrors.booking && (
                <p className="mt-1 text-xs text-red-600">
                  {
                    fieldErrors.booking
                  }
                </p>
              )}
            </div>

            {/* MEMBER */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Member{" "}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <select
                name="member"
                value={
                  formData.member
                }
                onChange={
                  handleChange
                }
                disabled={
                  loadingOptions
                }
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#212121] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
              >
                <option value="">
                  {loadingOptions
                    ? "Loading members..."
                    : "Select member"}
                </option>

                {members.map(
                  (member) => (
                    <option
                      key={
                        member.id
                      }
                      value={
                        member.id
                      }
                    >
                      {
                        getMemberId(
                          member
                        )
                      }{" "}
                      —{" "}
                      {getMemberName(
                        member
                      )}
                    </option>
                  )
                )}
              </select>

              {fieldErrors.member && (
                <p className="mt-1 text-xs text-red-600">
                  {
                    fieldErrors.member
                  }
                </p>
              )}
            </div>

            {/* DIAGNOSTIC CENTER */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Diagnostic Center{" "}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <select
                name="diagnostic_center"
                value={
                  formData.diagnostic_center
                }
                onChange={
                  handleChange
                }
                disabled={
                  loadingOptions
                }
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#212121] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
              >
                <option value="">
                  {loadingOptions
                    ? "Loading diagnostic centers..."
                    : "Select diagnostic center"}
                </option>

                {diagnosticCenters.map(
                  (center) => (
                    <option
                      key={
                        center.id
                      }
                      value={
                        center.id
                      }
                    >
                      {getDiagnosticCenterName(
                        center
                      )}
                    </option>
                  )
                )}
              </select>

              {fieldErrors.diagnostic_center && (
                <p className="mt-1 text-xs text-red-600">
                  {
                    fieldErrors.diagnostic_center
                  }
                </p>
              )}
            </div>

            {/* TEST NAME */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Test Name{" "}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <input
                type="text"
                name="test_name"
                value={
                  formData.test_name
                }
                onChange={
                  handleChange
                }
                placeholder="Enter test name"
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#212121] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
              />

              {fieldErrors.test_name && (
                <p className="mt-1 text-xs text-red-600">
                  {
                    fieldErrors.test_name
                  }
                </p>
              )}
            </div>

            {/* RESULT VALUE */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Result Value
              </label>

              <input
                type="text"
                name="result_value"
                value={
                  formData.result_value
                }
                onChange={
                  handleChange
                }
                placeholder="e.g. 120"
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#212121] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
              />

              {fieldErrors.result_value && (
                <p className="mt-1 text-xs text-red-600">
                  {
                    fieldErrors.result_value
                  }
                </p>
              )}
            </div>

            {/* REFERENCE RANGE */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Reference Range
              </label>

              <input
                type="text"
                name="reference_range"
                value={
                  formData.reference_range
                }
                onChange={
                  handleChange
                }
                placeholder="e.g. 70 - 110"
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#212121] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
              />

              {fieldErrors.reference_range && (
                <p className="mt-1 text-xs text-red-600">
                  {
                    fieldErrors.reference_range
                  }
                </p>
              )}
            </div>

            {/* UNIT */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Unit
              </label>

              <input
                type="text"
                name="unit"
                value={
                  formData.unit
                }
                onChange={
                  handleChange
                }
                placeholder="e.g. mg/dL"
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#212121] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
              />

              {fieldErrors.unit && (
                <p className="mt-1 text-xs text-red-600">
                  {
                    fieldErrors.unit
                  }
                </p>
              )}
            </div>

            {/* RESULT DATE */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Result Date{" "}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <input
                type="date"
                name="result_date"
                value={
                  formData.result_date
                }
                onChange={
                  handleChange
                }
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#212121] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
              />

              {fieldErrors.result_date && (
                <p className="mt-1 text-xs text-red-600">
                  {
                    fieldErrors.result_date
                  }
                </p>
              )}
            </div>

            {/* STATUS */}
            <div>
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Status
              </label>

              <select
                name="status"
                value={
                  formData.status
                }
                onChange={
                  handleChange
                }
                className="w-full rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#212121] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
              >
                {statusOptions.map(
                  (option) => (
                    <option
                      key={
                        option.value
                      }
                      value={
                        option.value
                      }
                    >
                      {
                        option.label
                      }
                    </option>
                  )
                )}
              </select>

              {fieldErrors.status && (
                <p className="mt-1 text-xs text-red-600">
                  {
                    fieldErrors.status
                  }
                </p>
              )}
            </div>

            {/* INTERPRETATION */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Interpretation
              </label>

              <textarea
                name="interpretation"
                value={
                  formData.interpretation
                }
                onChange={
                  handleChange
                }
                rows="4"
                placeholder="Enter result interpretation..."
                className="w-full resize-none rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#212121] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
              />

              {fieldErrors.interpretation && (
                <p className="mt-1 text-xs text-red-600">
                  {
                    fieldErrors.interpretation
                  }
                </p>
              )}
            </div>

            {/* NOTES */}
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#212121]">
                Notes
              </label>

              <textarea
                name="notes"
                value={
                  formData.notes
                }
                onChange={
                  handleChange
                }
                rows="4"
                placeholder="Enter additional notes..."
                className="w-full resize-none rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm text-[#212121] outline-none focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
              />

              {fieldErrors.notes && (
                <p className="mt-1 text-xs text-red-600">
                  {
                    fieldErrors.notes
                  }
                </p>
              )}
            </div>

          </div>

          {/* BUTTONS */}
          <div className="flex flex-col-reverse gap-3 border-t border-[#E5E7EB] px-6 py-5 sm:flex-row sm:justify-end">

            <Link
              to="/lab-results"
              className="inline-flex items-center justify-center rounded-lg border border-[#E5E7EB] bg-white px-5 py-2.5 text-sm font-medium text-[#212121] transition hover:bg-[#F9FAFB]"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={
                saving ||
                loadingOptions
              }
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2F6FED] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2459C7] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2
                    size={17}
                    className="animate-spin"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={17} />

                  {isEditMode
                    ? "Update Result"
                    : "Save Result"}
                </>
              )}
            </button>

          </div>

        </div>
      </form>
    </div>
  );
}

export default LabResultForm;
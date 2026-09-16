
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
  CreditCard,
  Stethoscope,
  CalendarCheck,
  Video,
  Building2,
  FlaskConical,
  Pill,
  Shield,
  FileText,
  Wallet,
  ShoppingBag,
  BriefcaseBusiness,
  Ambulance,
  Plane,
  MessageSquare,
  ClipboardList,
  FileCheck,
} from "lucide-react";

const MemberDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

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

  const formatDateTime = (date) => {
    if (!date) {
      return "N/A";
    }

    try {
      return new Date(date).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return date;
    }
  };

  const formatTime = (time) => {
    if (!time) {
      return "N/A";
    }

    try {
      return new Date(time).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return time;
    }
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined || value === "") {
      return "N/A";
    }

    const number = Number(value);

    if (Number.isNaN(number)) {
      return value;
    }

    return `৳${number.toLocaleString("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
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

  const getCount = (key) => {
    if (!member) {
      return 0;
    }

    if (Array.isArray(member[key])) {
      return member[key].length;
    }

    return member[key] ? 1 : 0;
  };

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: ClipboardList,
    },
    {
      id: "health",
      label: "Health",
      icon: HeartPulse,
    },
    {
      id: "services",
      label: "Services",
      icon: Stethoscope,
    },
    {
      id: "insurance",
      label: "Insurance",
      icon: Shield,
    },
    {
      id: "billing",
      label: "Billing",
      icon: Wallet,
    },
    {
      id: "pharmacy",
      label: "Pharmacy",
      icon: Pill,
    },
    {
      id: "organization",
      label: "Organization",
      icon: BriefcaseBusiness,
    },
    {
      id: "ambulance",
      label: "Ambulance",
      icon: Ambulance,
    },
    {
      id: "medical-tourism",
      label: "Medical Tourism",
      icon: Plane,
    },
    {
      id: "crm",
      label: "CRM",
      icon: MessageSquare,
    },
  ];

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

  const summaryCards = [
    {
      label: "Health Records",
      value: getCount("health_records"),
      icon: FileText,
    },
    {
      label: "Appointments",
      value: getCount("appointments"),
      icon: CalendarCheck,
    },
    {
      label: "Insurance Policies",
      value: getCount("insurance_policies"),
      icon: Shield,
    },
    {
      label: "Insurance Claims",
      value: getCount("insurance_claims"),
      icon: FileCheck,
    },
    {
      label: "Invoices",
      value: getCount("invoices"),
      icon: CreditCard,
    },
    {
      label: "Medicine Orders",
      value: getCount("medicine_orders"),
      icon: ShoppingBag,
    },
  ];

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
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
            Member 360
          </h2>

          <p className="text-sm text-[#7A7A7A] mt-0.5">
            Complete member profile and connected healthcare information.
          </p>
        </div>
      </div>

      {/* PROFILE HEADER */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#EEEEEE]">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
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

                <span className="text-[#EEEEEE]">|</span>

                <span className="text-sm text-[#7A7A7A]">
                  {member.gender || "Gender not specified"}
                </span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs text-[#7A7A7A] uppercase font-semibold mb-1">
              Status
            </p>

            <StatusBadge status={member.status || "UNKNOWN"} />
          </div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="bg-white rounded-xl p-4 border border-[#EEEEEE] shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs text-[#7A7A7A] font-medium">
                    {card.label}
                  </p>

                  <p className="text-2xl font-bold text-[#212121] mt-1">
                    {card.value}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-lg bg-[#D9F7E8] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#2F6FED]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* TABS */}
      <div className="bg-white rounded-2xl border border-[#EEEEEE] shadow-sm">
        <div className="border-b border-[#EEEEEE] overflow-x-auto">
          <div className="flex min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                    active
                      ? "text-[#2F6FED] border-[#2F6FED]"
                      : "text-[#7A7A7A] border-transparent hover:text-[#212121] hover:bg-[#F8F8F8]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* PERSONAL INFORMATION */}
              <Section title="Personal Information" icon={User}>
                <InfoGrid>
                  <InfoItem
                    icon={User}
                    label="Full Name"
                    value={member.full_name}
                  />

                  <InfoItem
                    icon={CalendarDays}
                    label="Date of Birth"
                    value={formatDate(member.date_of_birth)}
                  />

                  <InfoItem
                    icon={HeartPulse}
                    label="Gender"
                    value={member.gender}
                  />

                  <InfoItem
                    icon={IdCard}
                    label="NID / Passport"
                    value={member.nid_or_passport}
                  />

                  <InfoItem
                    icon={Phone}
                    label="Phone"
                    value={member.phone}
                  />

                  <InfoItem
                    icon={Mail}
                    label="Email"
                    value={member.email}
                  />

                  <InfoItem
                    icon={MapPin}
                    label="Address"
                    value={member.address}
                    full
                  />
                </InfoGrid>
              </Section>

              {/* EMERGENCY CONTACT */}
              <Section title="Emergency Contact" icon={AlertCircle}>
                <InfoGrid>
                  <InfoItem
                    label="Contact Name"
                    value={member.emergency_contact_name}
                  />

                  <InfoItem
                    label="Contact Phone"
                    value={member.emergency_contact_phone}
                  />
                </InfoGrid>
              </Section>

              {/* HEALTH QUICK VIEW */}
              <Section title="Health Quick View" icon={HeartPulse}>
                {member.health_profile ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <QuickValue
                      label="Blood Group"
                      value={member.health_profile.blood_group}
                    />

                    <QuickValue
                      label="Allergies"
                      value={member.health_profile.allergies}
                    />

                    <QuickValue
                      label="Existing Conditions"
                      value={member.health_profile.existing_conditions}
                    />

                    <QuickValue
                      label="Current Medications"
                      value={member.health_profile.current_medications}
                    />
                  </div>
                ) : (
                  <EmptyState text="No health profile available." />
                )}
              </Section>

              {/* ACCOUNT INFORMATION */}
              <Section title="Account Information" icon={ShieldCheck}>
                <InfoGrid>
                  <InfoItem
                    label="Member ID"
                    value={member.member_id}
                    highlight
                  />

                  <InfoItem
                    label="Registration Date"
                    value={formatDateTime(member.registration_date)}
                  />

                  <InfoItem
                    label="Created At"
                    value={formatDateTime(member.created_at)}
                  />

                  <InfoItem
                    label="Last Updated"
                    value={formatDateTime(member.updated_at)}
                  />
                </InfoGrid>
              </Section>
            </div>
          )}

          {/* HEALTH */}
          {activeTab === "health" && (
            <div className="space-y-6">
              <Section title="Health Card" icon={CreditCard}>
                {member.health_card ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                    <InfoItem
                      label="Card ID"
                      value={member.health_card.card_id}
                      highlight
                    />

                    <InfoItem
                      label="Plan Name"
                      value={member.health_card.plan_name}
                    />

                    <InfoItem
                      label="Issue Date"
                      value={formatDate(member.health_card.issue_date)}
                    />

                    <InfoItem
                      label="Expiry Date"
                      value={formatDate(member.health_card.expiry_date)}
                    />

                    <InfoItem
                      label="Premium"
                      value={formatCurrency(member.health_card.premium)}
                    />

                    <InfoItem
                      label="Renewal Date"
                      value={formatDate(member.health_card.renewal_date)}
                    />

                    <InfoItem
                      label="Status"
                      value={member.health_card.status}
                    />
                  </div>
                ) : (
                  <EmptyState text="No health card available." />
                )}
              </Section>

              <Section title="Health Profile" icon={HeartPulse}>
                {member.health_profile ? (
                  <InfoGrid>
                    <InfoItem
                      label="Blood Group"
                      value={member.health_profile.blood_group}
                    />

                    <InfoItem
                      label="Allergies"
                      value={member.health_profile.allergies}
                    />

                    <InfoItem
                      label="Existing Conditions"
                      value={member.health_profile.existing_conditions}
                    />

                    <InfoItem
                      label="Current Medications"
                      value={member.health_profile.current_medications}
                    />

                    <InfoItem
                      label="Medical History"
                      value={member.health_profile.medical_history}
                      full
                    />
                  </InfoGrid>
                ) : (
                  <EmptyState text="No health profile available." />
                )}
              </Section>

              <DataTableSection
                title="Health Records"
                icon={FileText}
                data={member.health_records}
                columns={[
                  ["Record ID", "id"],
                  ["Type", "record_type"],
                  ["Date", "record_date", "date"],
                  ["Title", "title"],
                  ["Diagnosis", "diagnosis"],
                  ["Doctor", "doctor_name"],
                  ["Hospital", "hospital_name"],
                ]}
              />

              <DataTableSection
                title="Record Documents"
                icon={FileCheck}
                data={member.record_documents}
                columns={[
                  ["Document ID", "document_id"],
                  ["Type", "document_type"],
                  ["Title", "title"],
                  ["Record", "record_title"],
                  ["Status", "status"],
                  ["Uploaded", "uploaded_at", "datetime"],
                ]}
              />

              <DataTableSection
                title="Health Plans"
                icon={Shield}
                data={member.health_plans}
                columns={[
                  ["Plan ID", "plan_id"],
                  ["Plan Name", "plan_name"],
                  ["Type", "plan_type"],
                  ["Coverage", "coverage_amount", "currency"],
                  ["Premium", "premium", "currency"],
                  ["Start", "start_date", "date"],
                  ["Expiry", "expiry_date", "date"],
                  ["Status", "status"],
                ]}
              />
            </div>
          )}

          {/* SERVICES */}
          {activeTab === "services" && (
            <div className="space-y-6">
              <DataTableSection
                title="Appointments"
                icon={CalendarCheck}
                data={member.appointments}
                columns={[
                  ["Appointment ID", "appointment_id"],
                  ["Doctor", "doctor_name"],
                  ["Date", "appointment_date", "date"],
                  ["Time", "appointment_time", "time"],
                  ["Type", "appointment_type"],
                  ["Reason", "reason"],
                  ["Status", "status"],
                ]}
              />

              <DataTableSection
                title="Telemedicine Consultations"
                icon={Video}
                data={member.telemedicine_consultations}
                columns={[
                  ["Telemedicine ID", "telemedicine_id"],
                  ["Doctor", "doctor_name"],
                  ["Date", "consultation_date", "date"],
                  ["Time", "consultation_time", "time"],
                  ["Type", "consultation_type"],
                  ["Diagnosis", "diagnosis"],
                  ["Status", "status"],
                ]}
              />

              <DataTableSection
                title="Hospital Bookings"
                icon={Building2}
                data={member.hospital_bookings}
                columns={[
                  ["Booking ID", "booking_id"],
                  ["Hospital", "hospital_name"],
                  ["Booking Date", "booking_date", "date"],
                  ["Admission", "admission_date", "date"],
                  ["Procedure", "procedure"],
                  ["Cost", "estimated_cost", "currency"],
                  ["Status", "status"],
                ]}
              />

              <DataTableSection
                title="Home Healthcare"
                icon={HeartPulse}
                data={member.home_healthcare_services}
                columns={[
                  ["Service ID", "service_id"],
                  ["Type", "service_type"],
                  ["Date", "service_date", "date"],
                  ["Time", "service_time", "time"],
                  ["Assigned Staff", "assigned_staff"],
                  ["Cost", "estimated_cost", "currency"],
                  ["Status", "status"],
                ]}
              />

              <DataTableSection
                title="Lab Test Bookings"
                icon={FlaskConical}
                data={member.lab_test_bookings}
                columns={[
                  ["Booking ID", "booking_id"],
                  ["Diagnostic Center", "diagnostic_center_name"],
                  ["Test", "test_name"],
                  ["Sample", "sample_type"],
                  ["Booking Date", "booking_date", "date"],
                  ["Price", "price", "currency"],
                  ["Status", "status"],
                ]}
              />

              <DataTableSection
                title="Lab Results"
                icon={FlaskConical}
                data={member.lab_results}
                columns={[
                  ["Result ID", "result_id"],
                  ["Test", "test_name"],
                  ["Diagnostic Center", "diagnostic_center_name"],
                  ["Result", "result_value"],
                  ["Reference", "reference_range"],
                  ["Unit", "unit"],
                  ["Date", "result_date", "date"],
                  ["Status", "status"],
                ]}
              />

              <DataTableSection
                title="Prescriptions"
                icon={Pill}
                data={member.prescriptions}
                columns={[
                  ["Prescription ID", "prescription_id"],
                  ["Doctor", "doctor_name"],
                  ["Date", "prescription_date", "date"],
                  ["Diagnosis", "diagnosis"],
                  ["Medicine", "medicine"],
                  ["Dosage", "dosage"],
                  ["Frequency", "frequency"],
                  ["Status", "status"],
                ]}
              />
            </div>
          )}

          {/* INSURANCE */}
          {activeTab === "insurance" && (
            <div className="space-y-6">
              <DataTableSection
                title="Insurance Policies"
                icon={Shield}
                data={member.insurance_policies}
                columns={[
                  ["Policy ID", "policy_id"],
                  ["Policy Number", "policy_number"],
                  ["Provider", "provider_name"],
                  ["Plan", "plan_name"],
                  ["Coverage", "coverage_amount", "currency"],
                  ["Premium", "premium", "currency"],
                  ["Start", "start_date", "date"],
                  ["Expiry", "expiry_date", "date"],
                  ["Status", "status"],
                ]}
              />

              <DataTableSection
                title="Insurance Claims"
                icon={FileCheck}
                data={member.insurance_claims}
                columns={[
                  ["Claim ID", "claim_id"],
                  ["Policy", "policy_number"],
                  ["Claim Type", "claim_type"],
                  ["Claim Date", "claim_date", "date"],
                  ["Claim Amount", "claim_amount", "currency"],
                  ["Approved", "approved_amount", "currency"],
                  ["Status", "status"],
                ]}
              />
            </div>
          )}

          {/* BILLING */}
          {activeTab === "billing" && (
            <div className="space-y-6">
              <DataTableSection
                title="Invoices"
                icon={CreditCard}
                data={member.invoices}
                columns={[
                  ["Invoice ID", "invoice_id"],
                  ["Service", "service_name"],
                  ["Reference", "service_reference"],
                  ["Amount", "amount", "currency"],
                  ["Discount", "discount", "currency"],
                  ["Total", "total_amount", "currency"],
                  ["Due Date", "due_date", "date"],
                  ["Status", "status"],
                ]}
              />

              <DataTableSection
                title="Payments"
                icon={Wallet}
                data={member.payments}
                columns={[
                  ["Payment ID", "payment_id"],
                  ["Invoice", "invoice_id"],
                  ["Amount", "amount", "currency"],
                  ["Method", "payment_method"],
                  ["Transaction", "transaction_id"],
                  ["Payment Date", "payment_date", "datetime"],
                  ["Status", "status"],
                ]}
              />
            </div>
          )}

          {/* PHARMACY */}
          {activeTab === "pharmacy" && (
            <DataTableSection
              title="Medicine Orders"
              icon={ShoppingBag}
              data={member.medicine_orders}
              columns={[
                ["Order ID", "order_id"],
                ["Medicine", "medicine_name"],
                ["Pharmacy", "pharmacy_name"],
                ["Quantity", "quantity"],
                ["Unit Price", "unit_price", "currency"],
                ["Total", "total_amount", "currency"],
                ["Delivery", "delivery_type"],
                ["Order Date", "order_date", "datetime"],
                ["Status", "status"],
              ]}
            />
          )}

          {/* ORGANIZATION */}
          {activeTab === "organization" && (
            <DataTableSection
              title="Organization Memberships"
              icon={BriefcaseBusiness}
              data={member.organization_memberships}
              columns={[
                ["Membership ID", "membership_id"],
                ["Organization", "organization_name"],
                ["Type", "membership_type"],
                ["Join Date", "join_date", "date"],
                ["End Date", "end_date", "date"],
                ["Status", "status"],
              ]}
            />
          )}

          {/* AMBULANCE */}
          {activeTab === "ambulance" && (
            <DataTableSection
              title="Ambulance Requests"
              icon={Ambulance}
              data={member.ambulance_requests}
              columns={[
                ["Request ID", "request_id"],
                ["Patient", "patient_name"],
                ["Phone", "patient_phone"],
                ["Pickup", "pickup_location"],
                ["Destination", "destination"],
                ["Ambulance", "ambulance_number"],
                ["Driver", "driver_name"],
                ["Request Date", "request_date", "datetime"],
                ["Status", "status"],
              ]}
            />
          )}

          {/* MEDICAL TOURISM */}
          {activeTab === "medical-tourism" && (
            <DataTableSection
              title="Medical Tourism Requests"
              icon={Plane}
              data={member.medical_tourism_requests}
              columns={[
                ["Request ID", "request_id"],
                ["Country", "destination_country"],
                ["Hospital", "international_hospital"],
                ["Treatment", "treatment_name"],
                ["Quotation", "quotation_amount", "currency"],
                ["Visa Status", "visa_status"],
                ["Travel Status", "travel_status"],
                ["Status", "status"],
                ["Request Date", "request_date", "datetime"],
              ]}
            />
          )}

          {/* CRM */}
          {activeTab === "crm" && (
            <DataTableSection
              title="CRM Interactions"
              icon={MessageSquare}
              data={member.crm_interactions}
              columns={[
                ["Interaction ID", "interaction_id"],
                ["Type", "interaction_type"],
                ["Subject", "subject"],
                ["Partner", "partner_name"],
                ["Organization", "organization_name"],
                ["Assigned To", "assigned_to_name"],
                ["Date", "interaction_date", "datetime"],
                ["Priority", "priority"],
                ["Status", "status"],
              ]}
            />
          )}
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   REUSABLE COMPONENTS
========================================================= */

const Section = ({ title, icon: Icon, children }) => {
  return (
    <div>
      <div className="flex items-center gap-2 border-b border-[#EEEEEE] pb-4 mb-5">
        <Icon className="w-5 h-5 text-[#2F6FED]" />

        <h3 className="text-lg font-semibold text-[#212121]">
          {title}
        </h3>
      </div>

      {children}
    </div>
  );
};

const InfoGrid = ({ children }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {children}
    </div>
  );
};

const InfoItem = ({
  icon: Icon,
  label,
  value,
  full = false,
  highlight = false,
}) => {
  return (
    <div className={full ? "sm:col-span-2 lg:col-span-3" : ""}>
      <div className="flex items-start gap-3">
        {Icon && (
          <Icon className="w-5 h-5 text-[#7A7A7A] mt-0.5 shrink-0" />
        )}

        <div className="min-w-0">
          <p className="text-xs text-[#7A7A7A] uppercase font-semibold">
            {label}
          </p>

          <p
            className={`text-sm font-medium mt-1 break-words ${
              highlight
                ? "text-[#2F6FED]"
                : "text-[#212121]"
            }`}
          >
            {value || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

const QuickValue = ({ label, value }) => {
  return (
    <div className="bg-[#F8F8F8] rounded-xl p-4 border border-[#EEEEEE]">
      <p className="text-xs text-[#7A7A7A] uppercase font-semibold">
        {label}
      </p>

      <p className="text-sm font-medium text-[#212121] mt-1 break-words">
        {value || "N/A"}
      </p>
    </div>
  );
};

const EmptyState = ({ text }) => {
  return (
    <div className="py-10 text-center bg-[#F8F8F8] rounded-xl border border-dashed border-[#DDDDDD]">
      <p className="text-sm text-[#7A7A7A]">
        {text}
      </p>
    </div>
  );
};

const DataTableSection = ({
  title,
  icon: Icon,
  data = [],
  columns = [],
}) => {
  const formatValue = (value, type) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "N/A";
    }

    if (type === "date") {
      try {
        return new Date(value).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      } catch {
        return value;
      }
    }

    if (type === "datetime") {
      try {
        return new Date(value).toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch {
        return value;
      }
    }

    if (type === "time") {
      try {
        return new Date(value).toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
        });
      } catch {
        return value;
      }
    }

    if (type === "currency") {
      const number = Number(value);

      if (Number.isNaN(number)) {
        return value;
      }

      return `৳${number.toLocaleString("en-BD", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
    }

    return String(value);
  };

  return (
    <div>
      <div className="flex items-center gap-2 border-b border-[#EEEEEE] pb-4 mb-5">
        <Icon className="w-5 h-5 text-[#2F6FED]" />

        <h3 className="text-lg font-semibold text-[#212121]">
          {title}
        </h3>

        <span className="ml-auto text-xs font-semibold px-2.5 py-1 rounded-full bg-[#D9F7E8] text-[#212121]">
          {data?.length || 0}
        </span>
      </div>

      {!data || data.length === 0 ? (
        <EmptyState
          text={`No ${title.toLowerCase()} available.`}
        />
      ) : (
        <div className="overflow-x-auto border border-[#EEEEEE] rounded-xl">
          <table className="w-full min-w-max text-sm">
            <thead className="bg-[#F8F8F8]">
              <tr>
                {columns.map(([label]) => (
                  <th
                    key={label}
                    className="px-4 py-3 text-left text-xs font-semibold text-[#7A7A7A] uppercase whitespace-nowrap border-b border-[#EEEEEE]"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#EEEEEE]">
              {data.map((item, index) => (
                <tr
                  key={item.id ?? index}
                  className="hover:bg-[#FAFAFA] transition-colors"
                >
                  {columns.map(([label, key, type]) => (
                    <td
                      key={label}
                      className="px-4 py-3 text-[#212121] whitespace-nowrap"
                    >
                      {formatValue(item[key], type)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MemberDetails;


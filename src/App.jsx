
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";

// Existing Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MemberForm from "./pages/Members/MemberForm";
import Members from "./pages/Members/Members"
import MemberDetails from "./pages/Members/MemberDetails"

import HealthCards from "./pages/HealthCards/HealthCards";
import HealthCardForm from "./pages/HealthCards/HealthCardForm";
import HealthCardDetails from "./pages/HealthCards/HealthCardDetails";

import HealthProfiles from "./pages/HealthProfiles/HealthProfiles";
import HealthProfileForm from "./pages/HealthProfiles/HealthProfileForm";
import HealthProfileDetails from "./pages/HealthProfiles/HealthProfileDetails";

import HealthRecords from "./pages/HealthRecords/HealthRecords";
import HealthRecordForm from "./pages/HealthRecords/HealthRecordForm";
import HealthRecordDetails from "./pages/HealthRecords/HealthRecordDetails";

import HealthPlans from "./pages/HealthPlans/HealthPlans";
import HealthPlanForm from "./pages/HealthPlans/HealthPlanForm";
import HealthPlanDetails from "./pages/HealthPlans/HealthPlanDetails";

import RecordDocuments from "./pages/RecordDocuments/RecordDocuments";
import RecordDocumentForm from "./pages/RecordDocuments/RecordDocumentForm";
import RecordDocumentDetails from "./pages/RecordDocuments/RecordDocumentDetails";

import Doctors from "./pages/Providers/Doctors";
import DoctorForm from "./pages/Providers/DoctorForm";
import DoctorDetails from "./pages/Providers/DoctorDetails";

import Hospitals from "./pages/Providers/Hospitals";
import HospitalForm from "./pages/Providers/HospitalForm";
import HospitalDetails from "./pages/Providers/HospitalDetails";

import DiagnosticCenters from "./pages/Providers/DiagnosticCenters";
import DiagnosticCenterForm from "./pages/Providers/DiagnosticCenterForm";
import DiagnosticCenterDetails from "./pages/Providers/DiagnosticCenterDetails";

import Pharmacies from "./pages/Providers/Pharmacies";
import PharmacyForm from "./pages/Providers/PharmacyForm";
import PharmacyDetails from "./pages/Providers/PharmacyDetails";

import Appointments from "./pages/Appointments/Appointments";
import AppointmentForm from "./pages/Appointments/AppointmentForm";
import AppointmentDetails from "./pages/Appointments/AppointmentDetails";

import Telemedicine from "./pages/Telemedicine/Telemedicine";
import TelemedicineForm from "./pages/Telemedicine/TelemedicineForm";
import TelemedicineDetails from "./pages/Telemedicine/TelemedicineDetails";

import HospitalBookings from "./pages/HospitalBookings/HospitalBooking";
import HospitalBookingForm from "./pages/HospitalBookings/HospitalBookingForm";
import HospitalBookingDetails from "./pages/HospitalBookings/HospitalBookingDetails";

import HomeHealthcareList from "./pages/HomeHealthcare/HomeHealthcareList";
import HomeHealthcareForm from "./pages/HomeHealthcare/HomeHealthcareForm";
import HomeHealthcareDetails from "./pages/HomeHealthcare/HomeHealthcareDetails";

import LabTestBookingList from "./pages/LabTestBookings/LabTestBookingList";
import LabTestBookingForm from "./pages/LabTestBookings/LabTestBookingForm";
import LabTestBookingDetails from "./pages/LabTestBookings/LabTestBookingDetails";

import LabResultList from "./pages/LabResults/LabResultList";
import LabResultForm from "./pages/LabResults/LabResultForm";
import LabResultDetails from "./pages/LabResults/LabResultDetails";

import PrescriptionList from "./pages/Prescriptions/PrescriptionList";
import PrescriptionForm from "./pages/Prescriptions/PrescriptionForm";
import PrescriptionDetails from "./pages/Prescriptions/PrescriptionDetails";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* =====================================================
              AUTH
          ====================================================== */}

          <Route
            path="/login"
            element={<Login />}
          />


          {/* =====================================================
              PROTECTED APPLICATION
          ====================================================== */}

          <Route element={<ProtectedRoute />}>

            <Route element={<MainLayout />}>

              {/* =================================================
                  OVERVIEW
              ================================================== */}

              <Route
                path="/"
                element={<Dashboard />}
              />


              {/* =================================================
                  MEMBERS
              ================================================== */}

              <Route
                path="/members"
                element={<Members />}
              />

              <Route
                path="/members/:id"
                element={<MemberDetails />}
              />

              <Route
                path="/members/add"
                element={<MemberForm />}
              />

              <Route
                path="/members/:id/edit"
                element={<MemberForm />}
              />


              {/* =================================================
                  HEALTHCARE
              ================================================== */}

              <Route
                path="/health-cards"
                element={<HealthCards />}
              />

              <Route
                path="/health-cards/add"
                element={<HealthCardForm />}
              />

              <Route
                path="/health-cards/:id/edit"
                element={<HealthCardForm />}
              />
              <Route
                path="/health-cards/:id"
                element={<HealthCardDetails />}
              />

              <Route
                path="/health-profiles"
                element={<HealthProfiles />}
              />

              <Route
                path="/health-profiles/add"
                element={<HealthProfileForm />}
              />

              <Route
                path="/health-profiles/:id/edit"
                element={<HealthProfileForm />}
              />
              <Route
                path="/health-profiles/:id"
                element={<HealthProfileDetails />}
              />

              <Route
                path="/health-records"
                element={<HealthRecords />}
              />

              <Route
                path="/health-records/add"
                element={<HealthRecordForm />}
              />

              <Route
                path="/health-records/:id/edit"
                element={<HealthRecordForm />}
              />

              <Route
                path="/health-records/:id"
                element={<HealthRecordDetails />}
              />

              <Route path="/health-plans" element={<HealthPlans />} />
              <Route path="/health-plans/add" element={<HealthPlanForm />} />
              <Route path="/health-plans/:id/edit" element={<HealthPlanForm />} />
              <Route path="/health-plans/:id" element={<HealthPlanDetails />} />


              <Route
                path="/record-documents"
                element={<RecordDocuments />}
              />

              <Route
                path="/record-documents/add"
                element={<RecordDocumentForm />}
              />

              <Route
                path="/record-documents/:id"
                element={<RecordDocumentDetails />}
              />

              <Route
                path="/record-documents/:id/edit"
                element={<RecordDocumentForm />}
              />


              {/* =================================================
                  PROVIDERS
              ================================================== */}

              <Route path="/doctors" element={<Doctors />} />
              <Route path="/doctors/add" element={<DoctorForm />} />
              <Route path="/doctors/:id" element={<DoctorDetails />} />
              <Route path="/doctors/:id/edit" element={<DoctorForm />} />

              <Route path="/hospitals" element={<Hospitals />} />
              <Route path="/hospitals/add" element={<HospitalForm />} />
              <Route path="/hospitals/:id" element={<HospitalDetails />} />
              <Route path="/hospitals/:id/edit" element={<HospitalForm />} />

              <Route path="/diagnostic-centers" element={<DiagnosticCenters />} />
              <Route
                path="/diagnostics/add"
                element={<DiagnosticCenterForm />}
              />
              <Route
                path="/diagnostics/:id"
                element={<DiagnosticCenterDetails />}
              />
              <Route
                path="/diagnostics/:id/edit"
                element={<DiagnosticCenterForm />}
              />

              <Route path="/pharmacies" element={<Pharmacies />} />
              <Route
                path="/pharmacies/add"
                element={<PharmacyForm />}
              />
              <Route
                path="/pharmacies/:id"
                element={<PharmacyDetails />}
              />
              <Route
                path="/pharmacies/:id/edit"
                element={<PharmacyForm />}
              />

              {/* =================================================
                  SERVICES
              ================================================== */}

              <Route
                path="/appointments"
                element={<Appointments />}
              />

              <Route
                path="/appointments/add"
                element={<AppointmentForm />}
              />

              <Route
                path="/appointments/:id"
                element={<AppointmentDetails />}
              />

              <Route
                path="/appointments/:id/edit"
                element={<AppointmentForm />}
              />

              <Route
                path="/telemedicine"
                element={<Telemedicine />}
              />

              <Route
                path="/telemedicine/new"
                element={<TelemedicineForm />}
              />

              <Route
                path="/telemedicine/:id"
                element={<TelemedicineDetails />}
              />

              <Route
                path="/telemedicine/:id/edit"
                element={<TelemedicineForm />}
              />

              <Route
                path="/hospital-bookings"
                element={<HospitalBookings />}
              />

              <Route
                path="/hospital-bookings/add"
                element={<HospitalBookingForm />}
              />

              <Route
                path="/hospital-bookings/:id"
                element={<HospitalBookingDetails />}
              />

              <Route
                path="/hospital-bookings/:id/edit"
                element={<HospitalBookingForm />}
              />

              <Route
                path="/home-healthcare"
                element={<HomeHealthcareList />}
              />

              <Route
                path="/home-healthcare/add"
                element={<HomeHealthcareForm />}
              />

              <Route
                path="/home-healthcare/:id"
                element={<HomeHealthcareDetails />}
              />

              <Route
                path="/home-healthcare/:id/edit"
                element={<HomeHealthcareForm />}
              />

              <Route
                path="/lab-test-bookings"
                element={<LabTestBookingList />}
              />

              <Route
                path="/lab-test-bookings/add"
                element={<LabTestBookingForm />}
              />

              <Route
                path="/lab-test-bookings/:id"
                element={<LabTestBookingDetails />}
              />

              <Route
                path="/lab-test-bookings/:id/edit"
                element={<LabTestBookingForm />}
              />
              
              <Route
                path="/lab-results"
                element={<LabResultList />}
              />

              <Route
                path="/lab-results/add"
                element={<LabResultForm />}
              />

              <Route
                path="/lab-results/:id"
                element={<LabResultDetails />}
              />

              <Route
                path="/lab-results/:id/edit"
                element={<LabResultForm />}
              />

              <Route
                path="/prescriptions"
                element={<PrescriptionList />}
              />

              <Route
                path="/prescriptions/add"
                element={<PrescriptionForm />}
              />

              <Route
                path="/prescriptions/:id"
                element={<PrescriptionDetails />}
              />

              <Route
                path="/prescriptions/:id/edit"
                element={<PrescriptionForm />}
              />

              {/* =================================================
                  INSURANCE
              ================================================== */}

              <Route
                path="/insurance/policies"
                element={<ComingSoon title="Insurance Policies" />}
              />

              <Route
                path="/insurance/claims"
                element={<ComingSoon title="Insurance Claims" />}
              />


              {/* =================================================
                  OPERATIONS
              ================================================== */}

              <Route
                path="/pharmacy/orders"
                element={<ComingSoon title="Medicine Orders" />}
              />

              <Route
                path="/organizations"
                element={<ComingSoon title="Organizations" />}
              />

              <Route
                path="/ambulance"
                element={<ComingSoon title="Ambulance" />}
              />

              <Route
                path="/medical-tourism"
                element={<ComingSoon title="Medical Tourism" />}
              />

              <Route
                path="/partners"
                element={<ComingSoon title="Partners" />}
              />

              <Route
                path="/crm"
                element={<ComingSoon title="CRM" />}
              />


              {/* =================================================
                  BILLING
              ================================================== */}

              <Route
                path="/invoices"
                element={<ComingSoon title="Invoices" />}
              />

              <Route
                path="/payments"
                element={<ComingSoon title="Payments" />}
              />


              {/* =================================================
                  REPORTS
              ================================================== */}

              <Route
                path="/reports"
                element={<ComingSoon title="Reports" />}
              />


              {/* =================================================
                  ADMINISTRATION
              ================================================== */}

              <Route
                path="/users"
                element={<ComingSoon title="Users" />}
              />

              <Route
                path="/permissions"
                element={<ComingSoon title="Permissions" />}
              />

            </Route>
          </Route>


          {/* =====================================================
              FALLBACK
          ====================================================== */}

          <Route
            path="*"
            element={
              <Navigate
                to="/"
                replace
              />
            }
          />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}


/*
|--------------------------------------------------------------------------
| Temporary Coming Soon Component
|--------------------------------------------------------------------------
|
| এগুলো temporary.
| পরে প্রত্যেকটার জন্য proper page বানাবো।
|
*/

const ComingSoon = ({ title }) => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">

      <div className="text-center">

        <div
          className="
            w-16
            h-16
            mx-auto
            mb-4
            rounded-2xl
            bg-[#D9F7E8]
            flex
            items-center
            justify-center
            text-[#2F6FED]
            text-2xl
            font-bold
          "
        >
          BV
        </div>

        <h1
          className="
            text-2xl
            font-bold
            text-[#212121]
          "
        >
          {title}
        </h1>

        <p
          className="
            mt-2
            text-sm
            text-[#7A7A7A]
          "
        >
          This module is under development.
        </p>

      </div>

    </div>
  );
};


export default App;


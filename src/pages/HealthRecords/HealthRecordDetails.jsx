import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  FileText,
  UserRound,
  CalendarDays,
  Stethoscope,
  Building2,
} from "lucide-react";

import { getHealthRecord } from "../../services/healthRecordService";

import { useAuth } from "../../context/AuthContext";

import { canEdit } from "../../utils/permission";


const HealthRecordDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { permissions } = useAuth();

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const canEditRecord = canEdit(
    permissions,
    "health_records"
  );


  useEffect(() => {
    const loadRecord = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getHealthRecord(id);

        setRecord(data);
      } catch (err) {
        console.error(
          "Health Record Details Error:",
          err
        );

        setError(
          err?.response?.data?.detail ||
            "Failed to load health record."
        );
      } finally {
        setLoading(false);
      }
    };

    loadRecord();
  }, [id]);


  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-GB"
    );
  };


  const formatRecordType = (type) => {
    if (!type) {
      return "-";
    }

    return type
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };


  const getMemberName = () => {
    return (
      record?.member_name ||
      record?.member?.full_name ||
      record?.member ||
      "-"
    );
  };


  const InfoItem = ({
    label,
    value,
  }) => {
    return (
      <div>
        <p className="text-xs font-medium text-[#7A7A7A] mb-1">
          {label}
        </p>

        <p className="text-sm text-[#212121] whitespace-pre-wrap">
          {value || "-"}
        </p>
      </div>
    );
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[#7A7A7A]">
          Loading health record...
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="p-6">

        <button
          type="button"
          onClick={() =>
            navigate("/health-records")
          }
          className="flex items-center gap-2 text-sm text-[#7A7A7A] hover:text-[#2F6FED] mb-5"
        >
          <ArrowLeft size={17} />
          Back to Health Records
        </button>


        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 text-sm text-[#DC2626]">
          {error}
        </div>

      </div>
    );
  }


  if (!record) {
    return (
      <div className="p-6">

        <button
          type="button"
          onClick={() =>
            navigate("/health-records")
          }
          className="flex items-center gap-2 text-sm text-[#7A7A7A] hover:text-[#2F6FED]"
        >
          <ArrowLeft size={17} />
          Back to Health Records
        </button>

      </div>
    );
  }


  return (
    <div className="p-6">

      {/* Header */}

      <div className="mb-6">

        <button
          type="button"
          onClick={() =>
            navigate("/health-records")
          }
          className="flex items-center gap-2 text-sm text-[#7A7A7A] hover:text-[#2F6FED] mb-3"
        >
          <ArrowLeft size={17} />
          Back to Health Records
        </button>


        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-[#EEF4FF] flex items-center justify-center">
              <FileText
                size={23}
                className="text-[#2F6FED]"
              />
            </div>


            <div>

              <h1 className="text-2xl font-bold text-[#212121]">
                Health Record Details
              </h1>

              <p className="text-sm text-[#7A7A7A] mt-1">
                View member medical record information
              </p>

            </div>

          </div>


          {canEditRecord && (
            <button
              type="button"
              onClick={() =>
                navigate(
                  `/health-records/${record.id}/edit`
                )
              }
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#2F6FED] text-white text-sm font-medium hover:bg-[#2459C7]"
            >
              <Edit size={17} />
              Edit Record
            </button>
          )}

        </div>

      </div>


      {/* Member Card */}

      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm mb-5">

        <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center gap-2">

          <UserRound
            size={19}
            className="text-[#2F6FED]"
          />

          <h2 className="text-lg font-semibold text-[#212121]">
            Member Information
          </h2>

        </div>


        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

          <InfoItem
            label="Member ID"
            value={record.member_id}
          />

          <InfoItem
            label="Member Name"
            value={getMemberName()}
          />

        </div>

      </div>


      {/* Record Information */}

      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm mb-5">

        <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center gap-2">

          <FileText
            size={19}
            className="text-[#2F6FED]"
          />

          <h2 className="text-lg font-semibold text-[#212121]">
            Record Information
          </h2>

        </div>


        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

          <InfoItem
            label="Record Type"
            value={formatRecordType(
              record.record_type
            )}
          />

          <div className="flex items-start gap-3">

            <CalendarDays
              size={18}
              className="text-[#2F6FED] mt-0.5"
            />

            <div>
              <p className="text-xs font-medium text-[#7A7A7A] mb-1">
                Record Date
              </p>

              <p className="text-sm text-[#212121]">
                {formatDate(
                  record.record_date
                )}
              </p>
            </div>

          </div>


          <InfoItem
            label="Title"
            value={record.title}
          />

          <InfoItem
            label="Doctor Name"
            value={record.doctor_name}
          />

          <div className="flex items-start gap-3">

            <Building2
              size={18}
              className="text-[#2F6FED] mt-0.5"
            />

            <div>
              <p className="text-xs font-medium text-[#7A7A7A] mb-1">
                Hospital Name
              </p>

              <p className="text-sm text-[#212121]">
                {record.hospital_name || "-"}
              </p>
            </div>

          </div>

        </div>

      </div>


      {/* Medical Details */}

      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm mb-5">

        <div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center gap-2">

          <Stethoscope
            size={19}
            className="text-[#2F6FED]"
          />

          <h2 className="text-lg font-semibold text-[#212121]">
            Medical Details
          </h2>

        </div>


        <div className="p-6 space-y-6">

          <div>

            <p className="text-xs font-medium text-[#7A7A7A] mb-2">
              Description
            </p>

            <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg px-4 py-3 text-sm text-[#212121] whitespace-pre-wrap min-h-[60px]">
              {record.description || "-"}
            </div>

          </div>


          <div>

            <p className="text-xs font-medium text-[#7A7A7A] mb-2">
              Diagnosis
            </p>

            <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg px-4 py-3 text-sm text-[#212121] whitespace-pre-wrap min-h-[60px]">
              {record.diagnosis || "-"}
            </div>

          </div>


          <div>

            <p className="text-xs font-medium text-[#7A7A7A] mb-2">
              Treatment
            </p>

            <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg px-4 py-3 text-sm text-[#212121] whitespace-pre-wrap min-h-[60px]">
              {record.treatment || "-"}
            </div>

          </div>


          <div>

            <p className="text-xs font-medium text-[#7A7A7A] mb-2">
              Notes
            </p>

            <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-lg px-4 py-3 text-sm text-[#212121] whitespace-pre-wrap min-h-[60px]">
              {record.notes || "-"}
            </div>

          </div>

        </div>

      </div>


      {/* Metadata */}

      <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-sm">

        <div className="px-6 py-4 border-b border-[#E5E7EB]">

          <h2 className="text-lg font-semibold text-[#212121]">
            Record Metadata
          </h2>

        </div>


        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

          <InfoItem
            label="Created At"
            value={
              record.created_at
                ? new Date(
                    record.created_at
                  ).toLocaleString("en-GB")
                : "-"
            }
          />

          <InfoItem
            label="Updated At"
            value={
              record.updated_at
                ? new Date(
                    record.updated_at
                  ).toLocaleString("en-GB")
                : "-"
            }
          />

        </div>

      </div>

    </div>
  );
};

export default HealthRecordDetails;
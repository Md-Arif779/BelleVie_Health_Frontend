const StatusBadge = ({ status }) => {
  const getStyle = (st) => {
    switch (st?.toLowerCase()) {
      case "active":
      case "completed":
      case "paid":
      case "approved":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "pending":
      case "processing":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "cancelled":
      case "failed":
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <span
      className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border capitalize ${getStyle(
        status
      )}`}
    >
      {status || "N/A"}
    </span>
  );
};

export default StatusBadge;
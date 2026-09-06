import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Eye,
  Pencil,
  Trash2,
  CreditCard,
  RefreshCw,
} from "lucide-react";

import {
  getHealthCards,
  deleteHealthCard,
} from "../../services/healthCardService";

import { useAuth } from "../../context/AuthContext";
import {
  canAdd,
  canEdit,
  canDelete,
} from "../../utils/permission";

const HealthCards = () => {
  const navigate = useNavigate();
  const { permissions } = useAuth();

  const [healthCards, setHealthCards] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHealthCards = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getHealthCards({
        search: search || undefined,
      });

      const results = Array.isArray(data)
        ? data
        : data?.results || [];

      setHealthCards(results);
    } catch (err) {
      console.error("Health Cards Error:", err);

      setError(
        err?.response?.data?.detail ||
          "Failed to load health cards."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHealthCards();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadHealthCards();
  };

  const handleDelete = async (card) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete health card "${card.card_id}"?`
    );

    if (!confirmed) return;

    try {
      await deleteHealthCard(card.id);

      setHealthCards((prev) =>
        prev.filter((item) => item.id !== card.id)
      );
    } catch (err) {
      console.error("Delete Health Card Error:", err);

      alert(
        err?.response?.data?.detail ||
          "Failed to delete health card."
      );
    }
  };

  const handleAdd = () => {
    navigate("/health-cards/add");
  };

  const handleView = (id) => {
    navigate(`/health-cards/${id}`);
  };

  const handleEdit = (id) => {
    navigate(`/health-cards/${id}/edit`);
  };

  const showAdd = canAdd(permissions, "health_cards");
  const showEdit = canEdit(permissions, "health_cards");
  const showDelete = canDelete(permissions, "health_cards");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF4FF]">
              <CreditCard
                size={22}
                className="text-[#2F6FED]"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-[#212121]">
                Health Cards
              </h1>

              <p className="text-sm text-[#7A7A7A]">
                Manage member health cards
              </p>
            </div>
          </div>
        </div>

        {showAdd && (
          <button
            onClick={handleAdd}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2F6FED] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2459C7]"
          >
            <Plus size={18} />
            Add Health Card
          </button>
        )}
      </div>

      {/* Search */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm">
        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A7A7A]"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by card ID or member..."
              className="w-full rounded-lg border border-[#E5E7EB] py-2.5 pl-10 pr-4 text-sm text-[#212121] outline-none transition focus:border-[#2F6FED] focus:ring-2 focus:ring-[#2F6FED]/10"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2F6FED] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#2459C7]"
          >
            <Search size={17} />
            Search
          </button>

          <button
            type="button"
            onClick={loadHealthCards}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-medium text-[#212121] hover:bg-[#F2F2F2]"
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white shadow-sm">
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <RefreshCw
                size={28}
                className="mx-auto mb-3 animate-spin text-[#2F6FED]"
              />

              <p className="text-sm text-[#7A7A7A]">
                Loading health cards...
              </p>
            </div>
          </div>
        ) : healthCards.length === 0 ? (
          <div className="flex min-h-[300px] items-center justify-center px-6">
            <div className="text-center">
              <CreditCard
                size={42}
                className="mx-auto mb-3 text-[#7A7A7A]"
              />

              <h3 className="text-base font-semibold text-[#212121]">
                No Health Cards Found
              </h3>

              <p className="mt-1 text-sm text-[#7A7A7A]">
                No health cards are available yet.
              </p>

              {showAdd && (
                <button
                  onClick={handleAdd}
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#2F6FED] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2459C7]"
                >
                  <Plus size={17} />
                  Add Health Card
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F8FAFC]">
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Card ID
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Member
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Issue Date
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Expiry Date
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-[#7A7A7A]">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {healthCards.map((card) => (
                  <tr
                    key={card.id}
                    className="border-b border-[#E5E7EB] last:border-b-0 hover:bg-[#F8FAFC]"
                  >
                    <td className="px-5 py-4">
                      <span className="font-semibold text-[#2F6FED]">
                        {card.card_id || "-"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-[#212121]">
                          {card.member_name ||
                            card.member?.full_name ||
                            card.member ||
                            "-"}
                        </p>

                        {card.member_id && (
                          <p className="mt-0.5 text-xs text-[#7A7A7A]">
                            {card.member_id}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-[#212121]">
                      {card.issue_date || "-"}
                    </td>

                    <td className="px-5 py-4 text-sm text-[#212121]">
                      {card.expiry_date || "-"}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          String(card.status).toUpperCase() ===
                          "ACTIVE"
                            ? "bg-green-100 text-green-700"
                            : String(card.status).toUpperCase() ===
                              "EXPIRED"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {card.status || "N/A"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleView(card.id)}
                          title="View"
                          className="rounded-lg p-2 text-[#2F6FED] transition hover:bg-[#EEF4FF]"
                        >
                          <Eye size={18} />
                        </button>

                        {showEdit && (
                          <button
                            type="button"
                            onClick={() => handleEdit(card.id)}
                            title="Edit"
                            className="rounded-lg p-2 text-[#F59E0B] transition hover:bg-[#FFF7E6]"
                          >
                            <Pencil size={18} />
                          </button>
                        )}

                        {showDelete && (
                          <button
                            type="button"
                            onClick={() => handleDelete(card)}
                            title="Delete"
                            className="rounded-lg p-2 text-[#DC2626] transition hover:bg-red-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthCards;
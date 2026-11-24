
import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Search,
  RefreshCw,
  LogOut,
  Menu,
  X,
  Trash2,
  Eye,
  Phone,
  Mail,
  MessageCircle,
  Clock,
  Sparkles,
  CheckCircle,
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight,
  BarChart3,
  Download,
} from "lucide-react";

import Analytics from "./Analytics";

const API = "http://127.0.0.1:5000/api";

const statusOptions = ["New", "Contacted", "Confirmed", "Cancelled"];

const normalizeStatus = (status) => {
  if (!status) return "New";

  const value = String(status).toLowerCase();

  if (value === "pending") return "New";
  if (value === "completed") return "Confirmed";

  return statusOptions.find(
    (item) => item.toLowerCase() === value
  ) || "New";
};

const getStatusColors = (status) => {
  const value = normalizeStatus(status);
  const palette = {
    New: { background: "#F3E8E3", color: "#7A263F", border: "#C6A36A" },
    Contacted: { background: "#F8EBD4", color: "#805817", border: "#D9B66F" },
    Confirmed: { background: "#DCEFE5", color: "#064E3B", border: "#78B99A" },
    Cancelled: { background: "#F1E5DC", color: "#874B32", border: "#C99478" },
  };
  return palette[value] || palette.New;
};

const getValue = (item, keys, fallback = "—") => {
  for (const key of keys) {
    if (
      item?.[key] !== undefined &&
      item?.[key] !== null &&
      item[key] !== ""
    ) {
      return item[key];
    }
  }

  return fallback;
};

// Some appointment enquiries store the phone only inside the message text.
// Use that value as a fallback when the lead's dedicated phone field is empty.
const getLeadPhone = (lead) => {
  const savedPhone = getValue(lead, ["phone", "phone_number"], "");
  if (savedPhone && savedPhone !== "—") return String(savedPhone).trim();

  const message = String(getValue(lead, ["message", "notes"], ""));
  const match = message.match(/\bphone\s*:\s*([+()\d][+()\d\s.-]*)/i);
  return match ? match[1].trim().replace(/[|,;]+$/, "").trim() : "—";
};

const formatDate = (date) => {
  if (!date || date === "—") return "—";

  const parsed = new Date(`${String(date).slice(0, 10)}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const getAppointmentDate = (item) =>
  String(
    getValue(item, ["date", "appointment_date"], "")
  ).slice(0, 10);

const styles = {
  page: {
    minHeight: "100vh",
    background: "#F7F4EF",
    color: "#24352F",
    fontFamily: "'DM Sans', Arial, sans-serif",
  },

  layout: {
    display: "flex",
    minHeight: "100vh",
  },

  sidebar: {
    width: "226px",
    background: "linear-gradient(180deg, #064E3B 0%, #043B2E 100%)",
    color: "#FFFCF8",
    padding: "26px 16px",
    boxShadow: "8px 0 30px rgba(37,36,58,.08)",
    display: "flex",
    flexDirection: "column",
    flexShrink: 0,
  },

  brand: {
    fontSize: "23px",
    fontWeight: 750,
    letterSpacing: "-.7px",
    color: "#E7CFA5",
    marginBottom: "5px",
  },

  brandSub: {
    fontSize: "11px",
    color: "#D8E4DC",
    letterSpacing: "2px",
    marginBottom: "42px",
  },

  navButton: {
    display: "flex",
    alignItems: "center",
    gap: "13px",
    width: "100%",
    padding: "13px 14px",
    border: "none",
    borderRadius: "9px",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "14px",
    marginBottom: "8px",
  },

  main: {
    flex: 1,
    minWidth: 0,
    padding: "28px 30px",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    flexWrap: "wrap",
    marginBottom: "28px",
  },

  heading: {
    fontSize: "28px",
    fontWeight: 750,
    letterSpacing: "-.8px",
    margin: 0,
    color: "#24352F",
  },

  subtitle: {
    color: "#69766F",
    fontSize: "13px",
    marginTop: "7px",
  },

  button: {
    border: "none",
    borderRadius: "9px",
    padding: "11px 16px",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "13px",
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(165px, 1fr))",
    gap: "14px",
    marginBottom: "24px",
  },

  card: {
    background: "linear-gradient(145deg, #FFFDF9 0%, #F5EFE5 100%)",
    padding: "20px 21px",
    borderRadius: "11px",
    border: "1px solid #C8B58F",
    boxShadow: "0 4px 12px rgba(6,78,59,.07), inset 0 0 0 1px rgba(255,255,255,.75)",
    position: "relative",
    overflow: "hidden",
    transition: "transform .22s ease, box-shadow .22s ease, border-color .22s ease",
  },

  cardLabel: {
    fontSize: "13px",
    color: "#69766F",
    marginBottom: "12px",
  },

  cardNumber: {
    fontSize: "28px",
    fontWeight: 700,
    color: "#24352F",
  },

  panel: {
    background: "#FFFCF8",
    border: "1px solid #DED6CA",
    borderRadius: "12px",
    padding: "22px",
    marginBottom: "22px",
    boxShadow: "0 8px 26px rgba(37,36,58,.04)",
  },

  panelTitle: {
    fontSize: "17px",
    fontWeight: 700,
    margin: "0 0 18px",
  },

  search: {
    flex: "1 1 220px",
    minWidth: 0,
    padding: "12px 14px",
    border: "1px solid #D8D0C5",
    borderRadius: "9px",
    outline: "none",
    fontSize: "13px",
    background: "#FFFCF8",
    color: "#24352F",
  },

  select: {
    flex: "0 1 175px",
    minWidth: "145px",
    padding: "12px",
    border: "1px solid #D8D0C5",
    borderRadius: "9px",
    background: "#FFFCF8",
    color: "#24352F",
    fontSize: "13px",
    outline: "none",
  },

  tableWrap: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "700px",
    fontSize: "13px",
  },

  th: {
    padding: "14px 12px",
    textAlign: "left",
    color: "#69766F",
    fontWeight: 600,
    borderBottom: "1px solid #DED6CA",
    whiteSpace: "nowrap",
  },

  td: {
    padding: "15px 12px",
    borderBottom: "1px solid #E8DED3",
    color: "#24352F",
    verticalAlign: "middle",
  },

  statusSelect: {
    padding: "7px 9px",
    borderRadius: "7px",
    border: "1px solid #D8D0C5",
    background: "#FFFCF8",
    color: "#24352F",
    fontSize: "12px",
    cursor: "pointer",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(6, 45, 34, 0.58)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "18px",
    zIndex: 1000,
  },

  modal: {
    width: "100%",
    maxWidth: "560px",
    background: "#F7F4EF",
    border: "1px solid #D6BD8A",
    borderTop: "5px solid #C6A36A",
    borderRadius: "16px",
    padding: "26px",
    boxShadow: "0 18px 55px rgba(6, 78, 59, 0.22)",
    maxHeight: "88vh",
    overflowY: "auto",
    boxSizing: "border-box",
  },

  detailLabel: {
    fontSize: "11px",
    color: "#8B6B35",
    marginBottom: 0,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    fontWeight: 700,
    background: "#F0E7D7",
    border: "1px solid #C6A36A",
    borderBottom: "none",
    borderRadius: "9px 9px 0 0",
    padding: "10px 12px 5px",
  },

  detailValue: {
    fontSize: "14px",
    color: "#064E3B",
    marginBottom: "13px",
    overflowWrap: "anywhere",
    background: "#FFFCF7",
    border: "1px solid #C6A36A",
    borderTop: "none",
    borderRadius: "0 0 9px 9px",
    padding: "4px 12px 11px",
    minHeight: "34px",
    boxSizing: "border-box",
  },
};

function StatusBadge({ status }) {
  const value = normalizeStatus(status);
  const colors = getStatusColors(value);

  return (
    <span
      style={{
        ...colors,
        display: "inline-block",
        border: `1px solid ${colors.border}`,
        borderRadius: "20px",
        padding: "6px 11px",
        fontSize: "11px",
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      {value}
    </span>
  );
}

/* CALENDAR COMPONENT */

function CalendarView({ appointments, onSelectAppointment }) {
  const today = new Date();

  const [monthDate, setMonthDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDate, setSelectedDate] = useState("");

  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthName = monthDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const appointmentMap = useMemo(() => {
    const map = {};

    appointments.forEach((item) => {
      const date = getAppointmentDate(item);

      if (!date) return;

      if (!map[date]) map[date] = [];

      map[date].push(item);
    });

    return map;
  }, [appointments]);

  const selectedAppointments = selectedDate
    ? appointmentMap[selectedDate] || []
    : [];

  const calendarCells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  const makeDateKey = (day) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "22px",
        }}
      >
        <div>
          <h2 style={{ fontSize: "21px", margin: 0 }}>
            {monthName}
          </h2>

          <p
            style={{
              color: "#887B70",
              fontSize: "12px",
              margin: "6px 0 0",
            }}
          >
            Select a date to view appointments
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={() => {
              setMonthDate(
                new Date(today.getFullYear(), today.getMonth(), 1)
              );
              setSelectedDate("");
            }}
            style={{
              ...styles.button,
              background: "#F1E7D8",
              color: "#064E3B",
            }}
          >
            Today
          </button>

          <button
            onClick={() => {
              setMonthDate(new Date(year, month - 1, 1));
              setSelectedDate("");
            }}
            aria-label="Previous month"
            style={{
              ...styles.button,
              padding: "10px",
              background: "#F1E7D8",
              color: "#064E3B",
            }}
          >
            <ChevronLeft size={17} />
          </button>

          <button
            onClick={() => {
              setMonthDate(new Date(year, month + 1, 1));
              setSelectedDate("");
            }}
            aria-label="Next month"
            style={{
              ...styles.button,
              padding: "10px",
              background: "#F1E7D8",
              color: "#064E3B",
            }}
          >
            <ChevronRight size={17} />
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, minmax(0, 1fr))",
          gap: "6px",
        }}
      >
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            style={{
              textAlign: "center",
              padding: "10px 2px",
              color: "#887B70",
              fontSize: "12px",
              fontWeight: 700,
            }}
          >
            {day}
          </div>
        ))}

        {calendarCells.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} />;
          }

          const dateKey = makeDateKey(day);
          const dayAppointments = appointmentMap[dateKey] || [];
          const isSelected = selectedDate === dateKey;

          const isToday =
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day;

          return (
            <button
              key={dateKey}
              onClick={() =>
                setSelectedDate(isSelected ? "" : dateKey)
              }
              style={{
                minHeight: "82px",
                padding: "8px 4px",
                border: isSelected
                  ? "2px solid #C5A36A"
                  : isToday
                  ? "1px solid #C5A36A"
                  : "1px solid #E9DFD1",
                borderRadius: "9px",
                background: isSelected ? "#F1E7D8" : "#FFFCF8",
                cursor: "pointer",
                color: "#24352F",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: isToday || isSelected ? 800 : 500,
                }}
              >
                {day}
              </div>

              {dayAppointments.length > 0 && (
                <>
                  <div
                    style={{
                      marginTop: "9px",
                      display: "flex",
                      justifyContent: "center",
                      gap: "3px",
                      flexWrap: "wrap",
                    }}
                  >
                    {dayAppointments.slice(0, 4).map((item, i) => {
                      const status = normalizeStatus(item.status);

                      const color = {
                        New: "#E11D48",
                        Contacted: "#C5A36A",
                        Confirmed: "#064E3B",
                        Cancelled: "#A65F45",
                      }[status];

                      return (
                        <span
                          key={`${item.id}-${i}`}
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: color,
                          }}
                        />
                      );
                    })}
                  </div>

                  <div
                    style={{
                      fontSize: "10px",
                      color: "#69766F",
                      marginTop: "5px",
                    }}
                  >
                    {dayAppointments.length} booking
                    {dayAppointments.length !== 1 ? "s" : ""}
                  </div>
                </>
              )}
            </button>
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          marginTop: "20px",
          paddingTop: "16px",
          borderTop: "1px solid #E9DFD1",
        }}
      >
        {[
          ["New", "#E11D48"],
          ["Contacted", "#C5A36A"],
          ["Confirmed", "#064E3B"],
          ["Cancelled", "#A65F45"],
        ].map(([label, color]) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
              color: "#69766F",
              fontSize: "11px",
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: color,
              }}
            />
            {label}
          </div>
        ))}
      </div>

      {selectedDate && (
        <div
          style={{
            marginTop: "24px",
            padding: "18px",
            borderRadius: "12px",
            background: "#F7F4EF",
            border: "1px solid #DED6CA",
          }}
        >
          <h3 style={{ fontSize: "16px", margin: "0 0 15px" }}>
            Appointments · {formatDate(selectedDate)}
          </h3>

          {selectedAppointments.length === 0 ? (
            <p
              style={{
                color: "#887B70",
                fontSize: "13px",
                margin: 0,
              }}
            >
              No appointments scheduled for this date.
            </p>
          ) : (
            <div style={{ display: "grid", gap: "10px" }}>
              {selectedAppointments.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onSelectAppointment(item)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                    width: "100%",
                    textAlign: "left",
                    padding: "14px",
                    border: "1px solid #DED6CA",
                    borderRadius: "9px",
                    background: "#FFFCF8",
                    cursor: "pointer",
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: "#24352F",
                        fontSize: "13px",
                        fontWeight: 700,
                      }}
                    >
                      {getValue(item, ["name", "customer_name", "full_name"])}
                    </div>

                    <div
                      style={{
                        color: "#69766F",
                        fontSize: "12px",
                        marginTop: "5px",
                      }}
                    >
                      {getValue(item, ["service", "service_name"])} ·{" "}
                      {getValue(item, ["time", "appointment_time"])}
                    </div>
                  </div>

                  <StatusBadge status={item.status} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}

/* MAIN ADMIN COMPONENT */

export default function Admin({ onLogout }) {
  const [activeTab, setActiveTab] = useState("overview");

  const [appointments, setAppointments] = useState([]);
  const [leads, setLeads] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLeadTarget, setDeleteLeadTarget] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  /* FETCH DATA */

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const [appointmentResponse, leadResponse] = await Promise.all([
        fetch(`${API}/appointments`),
        fetch(`${API}/leads`),
      ]);

      if (!appointmentResponse.ok || !leadResponse.ok) {
        throw new Error("Could not load dashboard data.");
      }

      const appointmentData = await appointmentResponse.json();
      const leadData = await leadResponse.json();

      setAppointments(
        Array.isArray(appointmentData)
          ? appointmentData
          : appointmentData.appointments || []
      );

      setLeads(
        Array.isArray(leadData)
          ? leadData
          : leadData.leads || []
      );
    } catch (err) {
      setError(err.message || "Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* APPOINTMENT FILTERS */

  const filteredAppointments = useMemo(() => {
    const term = search.trim().toLowerCase();

    return appointments.filter((item) => {
      const matchesSearch = [
        getValue(item, ["name", "customer_name", "full_name"], ""),
        getValue(item, ["email"], ""),
        getValue(item, ["phone", "phone_number"], ""),
        getValue(item, ["service", "service_name"], ""),
        normalizeStatus(item.status),
      ]
        .join(" ")
        .toLowerCase()
        .includes(term);

      const matchesStatus =
        statusFilter === "All" ||
        normalizeStatus(item.status) === statusFilter;

      const matchesDate =
        !dateFilter || getAppointmentDate(item) === dateFilter;

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [appointments, search, statusFilter, dateFilter]);

  /* LEAD SEARCH */

  const filteredLeads = useMemo(() => {
    const term = search.trim().toLowerCase();

    return leads.filter((item) =>
      [
        getValue(item, ["name", "customer_name", "full_name"], ""),
        getValue(item, ["email"], ""),
        getLeadPhone(item),
        getValue(item, ["message", "notes"], ""),
      ]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [leads, search]);

  /* UPDATE APPOINTMENT STATUS */

  const updateStatus = async (appointment, newStatus) => {
    try {
      const response = await fetch(
        `${API}/appointments/${appointment.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Could not update appointment status.");
      }

      setAppointments((previous) =>
        previous.map((item) =>
          item.id === appointment.id
            ? { ...item, status: newStatus }
            : item
        )
      );

      setSelectedAppointment((previous) =>
        previous?.id === appointment.id
          ? { ...previous, status: newStatus }
          : previous
      );
    } catch (err) {
      alert(err.message);
    }
  };

  /* DELETE APPOINTMENT */

  const deleteAppointment = async () => {
    if (!deleteTarget) return;

    setActionLoading(true);

    try {
      const response = await fetch(
        `${API}/appointments/${deleteTarget.id}`,
        {
          method: "DELETE",
        }
      );

      const responseText = await response.text();
      let result = {};

      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error(
          "Unexpected server response. Check that Flask is running and the delete route exists."
        );
      }

      if (!response.ok) {
        throw new Error(
          result.error || "Could not delete appointment."
        );
      }

      setAppointments((previous) =>
        previous.filter((item) => item.id !== deleteTarget.id)
      );

      setDeleteTarget(null);

      if (selectedAppointment?.id === deleteTarget.id) {
        setSelectedAppointment(null);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  /* DELETE LEAD */

  const deleteLead = async () => {
    if (!deleteLeadTarget) return;

    setActionLoading(true);

    try {
      const response = await fetch(`${API}/leads/${deleteLeadTarget.id}`, {
        method: "DELETE",
      });

      const responseText = await response.text();
      let result = {};

      try {
        result = responseText ? JSON.parse(responseText) : {};
      } catch {
        throw new Error("Unexpected server response. Check that the Flask lead delete route exists.");
      }

      if (!response.ok) {
        throw new Error(result.error || "Could not delete lead.");
      }

      setLeads((previous) =>
        previous.filter((lead) => lead.id !== deleteLeadTarget.id)
      );

      if (selectedLead?.id === deleteLeadTarget.id) {
        setSelectedLead(null);
      }

      setDeleteLeadTarget(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  /* EXPORT APPOINTMENTS TO CSV */

  const exportAppointmentsCSV = () => {
    if (filteredAppointments.length === 0) {
      alert("No appointments available to export.");
      return;
    }

    const headers = [
      "ID", "Name", "Email", "Phone", "Service",
      "Date", "Time", "Status", "Notes",
    ];

    const rows = filteredAppointments.map((item) => [
      getValue(item, ["id"], ""),
      getValue(item, ["name", "customer_name", "full_name"], ""),
      getValue(item, ["email"], ""),
      getValue(item, ["phone", "phone_number"], ""),
      getValue(item, ["service", "service_name"], ""),
      getValue(item, ["date", "appointment_date"], ""),
      getValue(item, ["time", "appointment_time"], ""),
      normalizeStatus(item.status),
      getValue(item, ["notes", "message"], ""),
    ]);

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Glow_Med_Spa_Appointments.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  /* EXPORT LEADS TO CSV */

  const exportLeadsCSV = () => {
    if (filteredLeads.length === 0) {
      alert("No leads available to export.");
      return;
    }

    const headers = ["ID", "Name", "Email", "Phone", "Message"];

    const rows = filteredLeads.map((lead) => [
      getValue(lead, ["id"], ""),
      getValue(lead, ["name", "customer_name", "full_name"], ""),
      getValue(lead, ["email"], ""),
      getLeadPhone(lead),
      getValue(lead, ["message", "notes"], ""),
    ]);

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Glow_Med_Spa_Leads.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setDateFilter("");
  };

  /* NAVIGATION */

  const navigation = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: CalendarDays,
    },
    {
      id: "appointments",
      label: "Appointments",
      icon: Calendar,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
    },
    {
      id: "leads",
      label: "Leads",
      icon: Users,
    },
  ];

  /* DASHBOARD STATISTICS */

  const statCards = [
    {
      label: "Total Appointments",
      value: appointments.length,
      icon: CalendarDays,
    },
    {
      label: "New Appointments",
      value: appointments.filter(
        (item) => normalizeStatus(item.status) === "New"
      ).length,
      icon: Sparkles,
    },
    {
      label: "Confirmed",
      value: appointments.filter(
        (item) => normalizeStatus(item.status) === "Confirmed"
      ).length,
      icon: CheckCircle,
    },
    {
      label: "Total Leads",
      value: leads.length,
      icon: Users,
    },
  ];

  /* APPOINTMENT TABLE */

  const renderAppointmentTable = (items) => (
    <div style={styles.tableWrap}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Customer</th>
            <th style={styles.th}>Service</th>
            <th style={styles.th}>Date</th>
            <th style={styles.th}>Time</th>
            <th style={styles.th}>Status</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td style={styles.td}>
                <button
                  onClick={() => setSelectedAppointment(item)}
                  style={{
                    border: "none",
                    background: "transparent",
                    color: "#064E3B",
                    cursor: "pointer",
                    fontWeight: 700,
                    padding: 0,
                    textAlign: "left",
                  }}
                >
                  {getValue(item, ["name", "customer_name", "full_name"])}
                </button>

                <div
                  style={{
                    fontSize: "11px",
                    color: "#887B70",
                    marginTop: "5px",
                  }}
                >
                  {getValue(item, ["email"])}
                </div>
              </td>

              <td style={styles.td}>
                {getValue(item, ["service", "service_name"])}
              </td>

              <td style={styles.td}>
                {formatDate(
                  getValue(item, ["date", "appointment_date"])
                )}
              </td>

              <td style={styles.td}>
                {getValue(item, ["time", "appointment_time"])}
              </td>

              <td style={styles.td}>
                <select
                  value={normalizeStatus(item.status)}
                  onChange={(event) =>
                    updateStatus(item, event.target.value)
                  }
                  className="status-select"
                  style={{
                    ...styles.statusSelect,
                    ...getStatusColors(item.status),
                    border: `1px solid ${getStatusColors(item.status).border}`,
                    fontWeight: 700,
                    minWidth: "112px",
                  }}
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>

              <td style={styles.td}>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    title="View details"
                    onClick={() => setSelectedAppointment(item)}
                    style={{
                      border: "none",
                      background: "#F1E7D8",
                      color: "#805B2B",
                      borderRadius: "7px",
                      padding: "8px",
                      cursor: "pointer",
                    }}
                  >
                    <Eye size={15} />
                  </button>

                  <button
                    title="Delete appointment"
                    onClick={() => setDeleteTarget(item)}
                    style={{
                      border: "none",
                      background: "#F3E8E3",
                      color: "#8B4A3A",
                      borderRadius: "7px",
                      padding: "8px",
                      cursor: "pointer",
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}

          {items.length === 0 && (
            <tr>
              <td
                colSpan="6"
                style={{
                  ...styles.td,
                  textAlign: "center",
                  padding: "30px",
                }}
              >
                No appointments found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  /* SIDEBAR */

  const renderNavigation = () => (
    <>
      <div style={styles.brand}>Glow Med Spa</div>

      <div style={styles.brandSub}>
        ADMIN DASHBOARD
      </div>

      {navigation.map((item) => {
        const Icon = item.icon;
        const active = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              setSearch("");
              setMobileMenu(false);
            }}
            style={{
              ...styles.navButton,
              background: active ? "linear-gradient(90deg, #0A624A, #0A7253)" : "transparent",
              color: active ? "#F5D99A" : "#E4EEE8",
            }}
          >
            <Icon size={18} />
            {item.label}
          </button>
        );
      })}

      <div style={{ flex: 1 }} />

      <button
        onClick={onLogout}
        style={{
          ...styles.navButton,
          color: "#E9DFD1",
          background: "transparent",
          marginTop: "25px",
        }}
      >
        <LogOut size={18} />
        Logout
      </button>
    </>
  );

  /* MAIN UI */

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@500;600;700&display=swap');

        * {
          box-sizing: border-box;
        }

        .glow-main h1,
        .glow-main h2,
        .glow-main h3 {
          font-family: 'Playfair Display', Georgia, serif !important;
          letter-spacing: -.025em;
        }

        .glow-sidebar {
          border-right: 1px solid rgba(198,163,106,.35);
        }

        .glow-main {
          background:
            radial-gradient(circle at 92% 4%, rgba(198,163,106,.10), transparent 25%),
            #F8F3ED;
        }

        button, input, select, textarea {
          font-family: inherit;
        }

        button {
          transition: transform .18s ease, box-shadow .18s ease, background .18s ease;
        }

        button:not(:disabled):hover {
          transform: translateY(-2px);
          box-shadow: 0 9px 22px rgba(37,36,58,.14);
        }

        .stat-card {
          position: relative;
          isolation: isolate;
        }

        .stat-card::before {
          content: "";
          position: absolute;
          inset: 0 auto 0 0;
          width: 5px;
          background: linear-gradient(180deg, #C6A36A, #064E3B);
          border-radius: 18px 0 0 18px;
          opacity: .9;
        }

        .stat-card::after {
          content: "";
          position: absolute;
          width: 115px;
          height: 115px;
          right: -48px;
          top: -52px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(198,163,106,.20), rgba(198,163,106,0) 70%);
          pointer-events: none;
          z-index: -1;
        }

        .stat-card:hover {
          transform: translateY(-5px) scale(1.012);
          border-color: #A98B52 !important;
          box-shadow: 0 18px 34px rgba(6,78,59,.15), 0 5px 12px rgba(225,29,72,.07) !important;
        }

        .status-select {
          transition: box-shadow .18s ease, transform .18s ease;
        }

        .status-select:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(6,78,59,.12);
        }

        .status-select option {
          background: #FFFCF8;
          color: #24352F;
          font-weight: 600;
        }

        .glow-panel {
          border: 1px solid #D7C7A7 !important;
          border-radius: 12px !important;
          box-shadow: 0 10px 30px rgba(37,36,58,.055) !important;
          background: #FFFDF9 !important;
        }

        table tbody tr:hover {
          background: #F7F4EF;
        }

        input, select, textarea {
          accent-color: #064E3B;
        }

        button:focus-visible,
        input:focus-visible,
        select:focus-visible {
          outline: 2px solid #C5A36A;
          outline-offset: 2px;
        }

        .glow-mobile-menu {
          display: none;
        }

        @media(max-width: 850px) {
          .glow-sidebar {
            display: none !important;
          }

          .glow-mobile-menu {
            display: flex !important;
          }

          .glow-main {
            padding: 20px !important;
          }
        }

        @media(max-width: 520px) {
          .glow-main {
            padding: 15px !important;
          }

          .glow-heading {
            font-size: 22px !important;
          }

          .glow-panel {
            padding: 15px !important;
          }
        }
      `}</style>

      <div style={styles.layout}>
        <aside
          className="glow-sidebar"
          style={styles.sidebar}
        >
          {renderNavigation()}
        </aside>

        {mobileMenu && (
          <div style={styles.modalOverlay}>
            <div
              style={{
                ...styles.sidebar,
                width: "270px",
                minHeight: "420px",
                maxHeight: "90vh",
                borderRadius: "14px",
              }}
            >
              <button
                onClick={() => setMobileMenu(false)}
                style={{
                  ...styles.navButton,
                  justifyContent: "flex-end",
                  color: "#FFFCF8",
                }}
              >
                <X size={19} />
              </button>

              {renderNavigation()}
            </div>
          </div>
        )}

        <main
          className="glow-main"
          style={styles.main}
        >
          {/* HEADER */}

          <div style={styles.header}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <button
                className="glow-mobile-menu"
                onClick={() => setMobileMenu(true)}
                style={{
                  border: "none",
                  background: "#24352F",
                  color: "#C5A36A",
                  borderRadius: "8px",
                  padding: "9px",
                  cursor: "pointer",
                }}
              >
                <Menu size={20} />
              </button>

              <div>
                <h1
                  className="glow-heading"
                  style={styles.heading}
                >
                  {activeTab === "overview"
                    ? "Dashboard Overview"
                    : activeTab === "calendar"
                    ? "Appointment Calendar"
                    : activeTab === "appointments"
                    ? "Appointments"
                    : activeTab === "analytics"
                    ? "Analytics"
                    : "Leads"}
                </h1>

                <div style={styles.subtitle}>
                  Welcome to your Glow Med Spa admin panel
                </div>
              </div>
            </div>

            <button
              onClick={fetchData}
              disabled={loading}
              style={{
                ...styles.button,
                background: "#24352F",
                color: "#C5A36A",
              }}
            >
              <RefreshCw size={15} />
              {loading ? "Refreshing..." : "Refresh"}
            </button>
          </div>

          {/* ERROR */}

          {error && (
            <div
              style={{
                background: "#F3E8E3",
                color: "#8B4A3A",
                padding: "13px 16px",
                borderRadius: "9px",
                marginBottom: "20px",
                fontSize: "13px",
              }}
            >
              {error}
            </div>
          )}

          {loading ? (
            <div style={styles.panel}>
              Loading dashboard...
            </div>
          ) : (
            <>
              {/* OVERVIEW */}

              {activeTab === "overview" && (
                <>
                  <section
                    style={{
                      position: "relative",
                      overflow: "hidden",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "22px",
                      flexWrap: "wrap",
                      padding: "30px 32px",
                      marginBottom: "24px",
                      borderRadius: "12px",
                      color: "#FFFDF7",
                      background: "linear-gradient(112deg, #173B31 0%, #064E3B 58%, #496B5C 100%)",
                      border: "1px solid #315D4D",
                      boxShadow: "0 12px 28px rgba(6,78,59,.18)",
                    }}
                  >
                    <div style={{ position: "relative", zIndex: 1, maxWidth: "590px" }}>
                      <div style={{ color: "#E7C98F", fontSize: "11px", fontWeight: 700, letterSpacing: "2.2px", marginBottom: "12px" }}>GLOW MED SPA · BUSINESS OVERVIEW</div>
                      <h2 style={{ margin: 0, fontSize: "clamp(23px, 3vw, 31px)", lineHeight: 1.2, letterSpacing: "-.7px", fontWeight: 700 }}>A beautiful experience starts here.</h2>
                      <p style={{ margin: "11px 0 0", color: "#E5EEE8", fontSize: "14px", lineHeight: 1.65 }}>Your customer activity, appointments and enquiries — all in one place.</p>
                    </div>
                    <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "10px", padding: "13px 17px", border: "1px solid rgba(231,201,143,.55)", borderRadius: "9px", background: "rgba(255,255,255,.12)", color: "#FFF8E9", fontSize: "12px", fontWeight: 600 }}>
                      <Sparkles size={17} /> Your workspace at a glance
                    </div>
                    <div aria-hidden="true" style={{ position: "absolute", right: "17%", top: "-95px", width: "260px", height: "260px", borderRadius: "50%", border: "1px solid rgba(231,201,143,.16)", boxShadow: "0 0 0 28px rgba(255,255,255,.025), 0 0 0 58px rgba(255,255,255,.02)" }} />
                  </section>

                  <div style={styles.cards}>
                    {statCards.map((card) => {
                      const Icon = card.icon;

                      return (
                        <div
                          key={card.label}
                          className="stat-card"
                          style={styles.card}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "15px",
                            }}
                          >
                            <div style={styles.cardLabel}>
                              {card.label}
                            </div>

                            <span style={{
                              width: "42px",
                              height: "42px",
                              display: "grid",
                              placeItems: "center",
                              borderRadius: "13px",
                              color: "#064E3B",
                              background: "linear-gradient(145deg, #E4F0E9, #F4EBDD)",
                              border: "1px solid #E5D8C2",
                            }}>
                              <Icon size={20} />
                            </span>
                          </div>

                          <div style={styles.cardNumber}>
                            {card.value}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <section
                    className="glow-panel"
                    style={styles.panel}
                  >
                    <h2 style={styles.panelTitle}>
                      Recent Appointments
                    </h2>

                    {renderAppointmentTable(
                      [...appointments]
                        .sort((a, b) => (b.id || 0) - (a.id || 0))
                        .slice(0, 5)
                    )}

                    <button
                      onClick={() => setActiveTab("appointments")}
                      style={{
                        ...styles.button,
                        marginTop: "18px",
                        background: "#F1E7D8",
                        color: "#064E3B",
                      }}
                    >
                      View all appointments
                      <ChevronRight size={15} />
                    </button>
                  </section>
                </>
              )}

              {/* CALENDAR */}

              {activeTab === "calendar" && (
                <section
                  className="glow-panel"
                  style={styles.panel}
                >
                  <CalendarView
                    appointments={appointments}
                    onSelectAppointment={setSelectedAppointment}
                  />
                </section>
              )}

              {/* APPOINTMENTS */}

              {activeTab === "appointments" && (
                <section
                  className="glow-panel"
                  style={styles.panel}
                >
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                    marginBottom: "20px",
                  }}>
                    <h2 style={{ ...styles.panelTitle, margin: 0 }}>
                      Manage Appointments
                    </h2>
                    <button
                      onClick={exportAppointmentsCSV}
                      style={{
                        ...styles.button,
                        background: "#064E3B",
                        color: "#FFFCF8",
                      }}
                    >
                      <Download size={15} />
                      Export CSV
                    </button>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "11px",
                      flexWrap: "wrap",
                      alignItems: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      style={{
                        flex: "1 1 220px",
                        display: "flex",
                        alignItems: "center",
                        gap: "9px",
                        border: "1px solid #D8D0C5",
                        borderRadius: "9px",
                        paddingLeft: "12px",
                      }}
                    >
                      <Search size={16} color="#887B70" />

                      <input
                        style={{
                          ...styles.search,
                          border: "none",
                          paddingLeft: 0,
                        }}
                        placeholder="Search name, email, service..."
                        value={search}
                        onChange={(event) =>
                          setSearch(event.target.value)
                        }
                      />
                    </div>

                    <select
                      value={statusFilter}
                      onChange={(event) =>
                        setStatusFilter(event.target.value)
                      }
                      style={styles.select}
                    >
                      <option value="All">All Statuses</option>

                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>

                    <input
                      type="date"
                      value={dateFilter}
                      onChange={(event) =>
                        setDateFilter(event.target.value)
                      }
                      style={styles.select}
                      aria-label="Filter appointments by date"
                    />

                    <button
                      onClick={resetFilters}
                      style={{
                        ...styles.button,
                        background: "#F1E7D8",
                        color: "#064E3B",
                      }}
                    >
                      <Filter size={14} />
                      Clear Filters
                    </button>
                  </div>

                  <div
                    style={{
                      fontSize: "12px",
                      color: "#69766F",
                      marginBottom: "14px",
                    }}
                  >
                    Showing {filteredAppointments.length} of{" "}
                    {appointments.length} appointments
                  </div>

                  {renderAppointmentTable(filteredAppointments)}
                </section>
              )}

              {/* ANALYTICS */}

              {activeTab === "analytics" && (
                <section
                  className="glow-panel"
                  style={styles.panel}
                >
                  <Analytics appointments={appointments} />
                </section>
              )}

              {/* LEADS */}

              {activeTab === "leads" && (
                <section
                  className="glow-panel"
                  style={styles.panel}
                >
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                    marginBottom: "20px",
                  }}>
                    <h2 style={{ ...styles.panelTitle, margin: 0 }}>
                      Customer Leads
                    </h2>
                    <button
                      onClick={exportLeadsCSV}
                      style={{
                        ...styles.button,
                        background: "#064E3B",
                        color: "#FFFCF8",
                      }}
                    >
                      <Download size={15} />
                      Export Leads
                    </button>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      border: "1px solid #D8D0C5",
                      borderRadius: "9px",
                      paddingLeft: "12px",
                      marginBottom: "20px",
                      maxWidth: "420px",
                    }}
                  >
                    <Search size={16} color="#887B70" />

                    <input
                      style={{
                        ...styles.search,
                        border: "none",
                      }}
                      placeholder="Search leads..."
                      value={search}
                      onChange={(event) =>
                        setSearch(event.target.value)
                      }
                    />
                  </div>

                  <div style={styles.tableWrap}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>Name</th>
                          <th style={styles.th}>Email</th>
                          <th style={styles.th}>Phone</th>
                          <th style={styles.th}>Message</th>
                          <th style={styles.th}>Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredLeads.map((lead) => (
                          <tr key={lead.id}>
                            <td style={styles.td}>
                              {getValue(lead, [
                                "name",
                                "customer_name",
                                "full_name",
                              ])}
                            </td>

                            <td style={styles.td}>
                              {getValue(lead, ["email"])}
                            </td>

                            <td style={styles.td}>
                              {getLeadPhone(lead)}
                            </td>

                            <td
                              style={{
                                ...styles.td,
                                maxWidth: "220px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {getValue(lead, [
                                "message",
                                "notes",
                              ])}
                            </td>

                            <td style={styles.td}>
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "7px",
                                  flexWrap: "wrap",
                                }}
                              >
                                <button
                                  title="Send email"
                                  aria-label="Send email to customer"
                                  onClick={() => {
                                    const email = getValue(lead, ["email"], "");
                                    if (email && email !== "—") {
                                      window.location.href = `mailto:${email}`;
                                    }
                                  }}
                                  style={{
                                    border: "none",
                                    background: "#F1E7D8",
                                    color: "#805B2B",
                                    borderRadius: "7px",
                                    padding: "9px",
                                    cursor: "pointer",
                                    display: "inline-flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Mail size={15} />
                                </button>

                                <button
                                  title="Call customer"
                                  aria-label="Call customer"
                                  onClick={() => {
                                    const phone = getLeadPhone(lead);
                                    if (phone && phone !== "—") {
                                      window.location.href = `tel:${phone}`;
                                    }
                                  }}
                                  style={{
                                    border: "none",
                                    background: "#DDEDE4",
                                    color: "#064E3B",
                                    borderRadius: "7px",
                                    padding: "9px",
                                    cursor: "pointer",
                                    display: "inline-flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Phone size={15} />
                                </button>

                                <button
                                  title="Contact through WhatsApp"
                                  aria-label="Contact customer through WhatsApp"
                                  onClick={() => {
                                    const rawPhone = String(
                                      getLeadPhone(lead)
                                    ).trim();

                                    if (!rawPhone || rawPhone === "—") {
                                      alert("Customer phone number is not available.");
                                      return;
                                    }

                                    let whatsappNumber = rawPhone.replace(/\D/g, "");

                                    if (whatsappNumber.startsWith("00")) {
                                      whatsappNumber = whatsappNumber.slice(2);
                                    }

                                    // For this test, treat a 10-digit local number as Indian (+91).
                                    // US customers should be saved with +1, and other countries with their country code.
                                    if (whatsappNumber.length === 10) {
                                      whatsappNumber = `91${whatsappNumber}`;
                                    }

                                    if (whatsappNumber.length < 8 || whatsappNumber.length > 15) {
                                      alert("Please check the customer's phone number and include its country code.");
                                      return;
                                    }

                                    const customerName = getValue(
                                      lead,
                                      ["name", "customer_name", "full_name"],
                                      "there"
                                    );

                                    const message = `Hi ${customerName}, thank you for contacting Glow Med Spa! We received your enquiry. How can we assist you?`;
                                    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

                                    window.open(whatsappURL, "_blank", "noopener,noreferrer");
                                  }}
                                  style={{
                                    border: "none",
                                    background: "#DDEDE4",
                                    color: "#064E3B",
                                    borderRadius: "7px",
                                    padding: "9px",
                                    cursor: "pointer",
                                    display: "inline-flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <MessageCircle size={15} />
                                </button>

                                <button
                                  title="Delete lead"
                                  aria-label="Delete lead"
                                  onClick={() => setDeleteLeadTarget(lead)}
                                  style={{
                                    border: "none",
                                    background: "#F3E8E3",
                                    color: "#8B4A3A",
                                    borderRadius: "7px",
                                    padding: "9px",
                                    cursor: "pointer",
                                    display: "inline-flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Trash2 size={15} />
                                </button>

                                <button
                                  title="View enquiry details"
                                  onClick={() => setSelectedLead(lead)}
                                  style={{
                                    border: "none",
                                    background: "#F8EBD4",
                                    color: "#8B6428",
                                    borderRadius: "7px",
                                    padding: "9px 12px",
                                    cursor: "pointer",
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "7px",
                                    fontSize: "12px",
                                    fontWeight: 600,
                                  }}
                                >
                                  <Eye size={15} />
                                  View Details
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}

                        {filteredLeads.length === 0 && (
                          <tr>
                            <td
                              colSpan="5"
                              style={{
                                ...styles.td,
                                textAlign: "center",
                                padding: "30px",
                              }}
                            >
                              No leads found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}
            </>
          )}

          {/* FOOTER */}

          <div
            style={{
              textAlign: "center",
              color: "#887B70",
              fontSize: "11px",
              padding: "15px",
            }}
          >
            Glow Med Spa · Admin Dashboard · Demo Project
          </div>
        </main>
      </div>

      {/* APPOINTMENT DETAILS MODAL */}
      {selectedAppointment && (
        <div
          style={styles.modalOverlay}
          onClick={() => setSelectedAppointment(null)}
        >
          <div
            style={{
              ...styles.modal,
              maxWidth: "560px",
              padding: "26px",
              borderTop: "4px solid #C6A36A",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", marginBottom: "20px" }}>
              <div>
                <div style={{ color: "#A17B43", fontSize: "10px", fontWeight: 800, letterSpacing: "1.5px", marginBottom: "6px" }}>GLOW MED SPA · CUSTOMER RECORD</div>
                <h2 style={{ margin: 0, fontSize: "23px", color: "#064E3B" }}>Appointment Details</h2>
              </div>
              <button onClick={() => setSelectedAppointment(null)} aria-label="Close appointment details" style={{ border: "1px solid #E4D4B8", background: "#F0E5D2", color: "#064E3B", width: "38px", height: "38px", borderRadius: "11px", cursor: "pointer", display: "grid", placeItems: "center", flexShrink: 0 }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ background: "#FFFFFF", border: "1px solid #E8DFD1", borderRadius: "15px", padding: "18px", boxShadow: "0 5px 18px rgba(42, 62, 49, 0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingBottom: "15px", borderBottom: "1px solid #EEE7DC", marginBottom: "16px" }}>
                <div style={{ width: "46px", height: "46px", borderRadius: "50%", background: "#E5EFE8", color: "#064E3B", display: "grid", placeItems: "center", fontWeight: 800, fontSize: "17px" }}>
                  {String(getValue(selectedAppointment, ["name", "customer_name", "full_name"]) || "C").trim().charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: "#8A7968", fontSize: "10px", fontWeight: 800, letterSpacing: "1px", marginBottom: "4px" }}>CUSTOMER</div>
                  <div style={{ color: "#263C32", fontSize: "17px", fontWeight: 700, overflowWrap: "anywhere" }}>{getValue(selectedAppointment, ["name", "customer_name", "full_name"])}</div>
                </div>
                <StatusBadge status={selectedAppointment.status} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "16px 22px" }}>
                <div>
                  <div style={{ color: "#9A846B", fontSize: "10px", fontWeight: 800, letterSpacing: "1px", marginBottom: "6px" }}>EMAIL ADDRESS</div>
                  <div style={{ color: "#263C32", fontSize: "13px", display: "flex", alignItems: "center", gap: "7px", overflowWrap: "anywhere" }}><Mail size={15} color="#08704F" />{getValue(selectedAppointment, ["email"]) || "—"}</div>
                </div>
                <div>
                  <div style={{ color: "#9A846B", fontSize: "10px", fontWeight: 800, letterSpacing: "1px", marginBottom: "6px" }}>PHONE NUMBER</div>
                  <div style={{ color: "#263C32", fontSize: "13px", display: "flex", alignItems: "center", gap: "7px" }}><Phone size={15} color="#08704F" />{getValue(selectedAppointment, ["phone", "phone_number"]) || "—"}</div>
                </div>
                <div>
                  <div style={{ color: "#9A846B", fontSize: "10px", fontWeight: 800, letterSpacing: "1px", marginBottom: "6px" }}>SERVICE</div>
                  <div style={{ color: "#263C32", fontSize: "13px", fontWeight: 600 }}>{getValue(selectedAppointment, ["service", "service_name"]) || "—"}</div>
                </div>
                <div>
                  <div style={{ color: "#9A846B", fontSize: "10px", fontWeight: 800, letterSpacing: "1px", marginBottom: "6px" }}>APPOINTMENT DATE</div>
                  <div style={{ color: "#263C32", fontSize: "13px", display: "flex", alignItems: "center", gap: "7px" }}><Calendar size={15} color="#08704F" />{formatDate(getValue(selectedAppointment, ["date", "appointment_date"]))}</div>
                </div>
                <div>
                  <div style={{ color: "#9A846B", fontSize: "10px", fontWeight: 800, letterSpacing: "1px", marginBottom: "6px" }}>APPOINTMENT TIME</div>
                  <div style={{ color: "#263C32", fontSize: "13px", display: "flex", alignItems: "center", gap: "7px" }}><Clock size={15} color="#08704F" />{getValue(selectedAppointment, ["time", "appointment_time"]) || "—"}</div>
                </div>
              </div>

              <div style={{ marginTop: "18px", padding: "13px 14px", background: "#F7F4EF", borderRadius: "10px", borderLeft: "3px solid #C6A36A" }}>
                <div style={{ color: "#9A846B", fontSize: "10px", fontWeight: 800, letterSpacing: "1px", marginBottom: "5px" }}>NOTES</div>
                <div style={{ color: "#42564A", fontSize: "13px", lineHeight: 1.6, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{getValue(selectedAppointment, ["notes", "message"]) || "No additional notes"}</div>
              </div>
            </div>

            <button onClick={() => setSelectedAppointment(null)} style={{ ...styles.button, background: "#064E3B", color: "#F1D49B", border: "1px solid #C6A36A", width: "100%", justifyContent: "center", marginTop: "18px", padding: "12px" }}>Close</button>
          </div>
        </div>
      )}

      {/* LEAD DETAILS MODAL */}
      {selectedLead && (
        <div style={styles.modalOverlay} onClick={() => setSelectedLead(null)}>
          <div
            style={{ ...styles.modal, maxWidth: "560px", padding: "26px", borderTop: "4px solid #C6A36A" }}
            onClick={(event) => event.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", marginBottom: "20px" }}>
              <div>
                <div style={{ color: "#A17B43", fontSize: "10px", fontWeight: 800, letterSpacing: "1.5px", marginBottom: "6px" }}>GLOW MED SPA · CUSTOMER ENQUIRY</div>
                <h2 style={{ margin: 0, fontSize: "23px", color: "#064E3B" }}>Enquiry Details</h2>
                <p style={{ margin: "5px 0 0", color: "#8A7968", fontSize: "12px" }}>Customer enquiry information</p>
              </div>
              <button onClick={() => setSelectedLead(null)} aria-label="Close enquiry details" style={{ border: "1px solid #E4D4B8", background: "#F0E5D2", color: "#064E3B", width: "38px", height: "38px", borderRadius: "11px", cursor: "pointer", display: "grid", placeItems: "center", flexShrink: 0 }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ background: "#FFFCF8", border: "1px solid #E8DFD1", borderRadius: "15px", padding: "18px", boxShadow: "0 5px 18px rgba(42, 62, 49, 0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", paddingBottom: "15px", borderBottom: "1px solid #E5D8C2", marginBottom: "16px" }}>
                <div style={{ width: "46px", height: "46px", borderRadius: "50%", background: "#E5EFE8", color: "#064E3B", display: "grid", placeItems: "center", fontWeight: 800, fontSize: "17px", border: "1px solid #C6A36A" }}>
                  {String(getValue(selectedLead, ["name", "customer_name", "full_name"]) || "C").trim().charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: "#8A7968", fontSize: "10px", fontWeight: 800, letterSpacing: "1px", marginBottom: "4px" }}>CUSTOMER</div>
                  <div style={{ color: "#263C32", fontSize: "17px", fontWeight: 700, overflowWrap: "anywhere" }}>{getValue(selectedLead, ["name", "customer_name", "full_name"])}</div>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "16px 22px" }}>
                <div>
                  <div style={{ color: "#9A846B", fontSize: "10px", fontWeight: 800, letterSpacing: "1px", marginBottom: "6px" }}>EMAIL ADDRESS</div>
                  <div style={{ color: "#263C32", fontSize: "13px", display: "flex", alignItems: "center", gap: "7px", overflowWrap: "anywhere" }}><Mail size={15} color="#08704F" />{getValue(selectedLead, ["email"]) || "—"}</div>
                </div>
                <div>
                  <div style={{ color: "#9A846B", fontSize: "10px", fontWeight: 800, letterSpacing: "1px", marginBottom: "6px" }}>PHONE NUMBER</div>
                  <div style={{ color: "#263C32", fontSize: "13px", display: "flex", alignItems: "center", gap: "7px" }}><Phone size={15} color="#08704F" />{getLeadPhone(selectedLead) || "—"}</div>
                </div>
              </div>

              <div style={{ marginTop: "18px", padding: "15px", background: "#F2EBDD", borderRadius: "10px", border: "1px solid #D9BE8C", borderLeft: "4px solid #064E3B" }}>
                <div style={{ color: "#8B6B35", fontSize: "10px", fontWeight: 800, letterSpacing: "1px", marginBottom: "8px" }}>FULL ENQUIRY MESSAGE</div>
                <div style={{ color: "#42564A", fontSize: "13px", lineHeight: 1.7, whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>{getValue(selectedLead, ["message", "notes"]) || "No enquiry message provided"}</div>
              </div>
            </div>

            <button onClick={() => setSelectedLead(null)} style={{ ...styles.button, background: "#064E3B", color: "#F1D49B", border: "1px solid #C6A36A", width: "100%", justifyContent: "center", marginTop: "18px", padding: "12px" }}>Close</button>
          </div>
        </div>
      )}

      {/* LEAD DELETE CONFIRMATION MODAL */}
      {deleteLeadTarget && (
        <div
          style={styles.modalOverlay}
          onClick={() => !actionLoading && setDeleteLeadTarget(null)}
        >
          <div
            style={{
              ...styles.modal,
              maxWidth: "440px",
              borderTop: "5px solid #C6A36A",
              background: "#F7F4EF",
              padding: "28px",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div style={{ textAlign: "center", padding: "8px 0" }}>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  background: "#F0E5D2",
                  color: "#8C4B36",
                  border: "1px solid #C6A36A",
                  display: "grid",
                  placeItems: "center",
                  margin: "0 auto 16px",
                }}
              >
                <Trash2 size={22} />
              </div>

              <h2 style={{ fontSize: "21px", margin: "0 0 10px", color: "#064E3B", fontWeight: 800 }}>
                Delete Lead?
              </h2>

              <p style={{ fontSize: "13px", color: "#5D6D63", lineHeight: 1.7, marginBottom: "24px" }}>
                Are you sure you want to delete the enquiry from{" "}
                <strong>
                  {getValue(deleteLeadTarget, ["name", "customer_name", "full_name"])}
                </strong>
                ? This action cannot be undone.
              </p>

              <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                <button
                  disabled={actionLoading}
                  onClick={() => setDeleteLeadTarget(null)}
                  style={{
                    ...styles.button,
                    background: "#E9E0D2",
                    color: "#064E3B",
                    border: "1px solid #D3C3A7",
                  }}
                >
                  Cancel
                </button>

                <button
                  disabled={actionLoading}
                  onClick={deleteLead}
                  style={{
                    ...styles.button,
                    background: "#064E3B",
                    color: "#F1D49B",
                    border: "1px solid #C6A36A",
                    opacity: actionLoading ? 0.7 : 1,
                  }}
                >
                  <Trash2 size={14} />
                  {actionLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* DELETE CONFIRMATION MODAL */}

      {deleteTarget && (
        <div
          style={styles.modalOverlay}
          onClick={() =>
            !actionLoading && setDeleteTarget(null)
          }
        >
          <div
            style={{
              ...styles.modal,
              maxWidth: "440px",
              borderTop: "5px solid #C6A36A",
              background: "#F7F4EF",
              padding: "28px",
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              style={{
                textAlign: "center",
                padding: "8px 0",
              }}
            >
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "50%",
                  background: "#F0E5D2",
                  color: "#8C4B36",
                  border: "1px solid #C6A36A",
                  display: "grid",
                  placeItems: "center",
                  margin: "0 auto 16px",
                }}
              >
                <Trash2 size={22} />
              </div>

              <h2
                style={{
                  fontSize: "21px",
                  margin: "0 0 10px",
                  color: "#064E3B",
                  fontWeight: 800,
                }}
              >
                Delete Appointment?
              </h2>

              <p
                style={{
                  fontSize: "13px",
                  color: "#5D6D63",
                  lineHeight: 1.7,
                  marginBottom: "24px",
                }}
              >
                Are you sure you want to delete this appointment for{" "}
                <strong>
                  {getValue(deleteTarget, [
                    "name",
                    "customer_name",
                    "full_name",
                  ])}
                </strong>
                ? This action cannot be undone.
              </p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <button
                  disabled={actionLoading}
                  onClick={() => setDeleteTarget(null)}
                  style={{
                    ...styles.button,
                    background: "#E9E0D2",
                    color: "#064E3B",
                    border: "1px solid #D3C3A7",
                  }}
                >
                  Cancel
                </button>

                <button
                  disabled={actionLoading}
                  onClick={deleteAppointment}
                  style={{
                    ...styles.button,
                    background: "#064E3B",
                    color: "#F1D49B",
                    border: "1px solid #C6A36A",
                    opacity: actionLoading ? 0.7 : 1,
                  }}
                >
                  <Trash2 size={14} />

                  {actionLoading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

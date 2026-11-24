
import { useMemo } from "react";

const COLORS = {
  purple: "#8063A5",
  gold: "#C6A45B",
  green: "#57966A",
  red: "#C66B6B",
  cream: "#F8F6F3",
};

const normalizeStatus = (status) => {
  const value = String(status || "New").toLowerCase();

  if (value === "pending") return "New";
  if (value === "completed") return "Confirmed";

  if (value === "new") return "New";
  if (value === "contacted") return "Contacted";
  if (value === "confirmed") return "Confirmed";
  if (value === "cancelled") return "Cancelled";

  return "New";
};

const getDate = (item) =>
  String(item.date || item.appointment_date || "").slice(0, 10);

const getService = (item) =>
  item.service || item.service_name || "Other";

const getMonthKey = (date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

const cardStyle = {
  background: "#fff",
  border: "1px solid #EEE8E2",
  borderRadius: "14px",
  padding: "22px",
  minWidth: 0,
};

function BarChart({ data }) {
  const max = Math.max(...data.map((item) => item.value), 1);

  return (
    <div style={{ display: "flex", alignItems: "end", gap: "12px", height: "220px", paddingTop: "20px" }}>
      {data.map((item) => (
        <div
          key={item.label}
          style={{
            flex: 1,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "end",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "12px", color: "#51465F", fontWeight: 700 }}>
            {item.value}
          </span>

          <div
            title={`${item.label}: ${item.value} appointments`}
            style={{
              width: "min(100%, 42px)",
              height: `${Math.max((item.value / max) * 145, 5)}px`,
              background: COLORS.purple,
              borderRadius: "7px 7px 2px 2px",
              transition: "height 0.3s",
            }}
          />

          <span style={{ fontSize: "10px", color: "#887F91", textAlign: "center" }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function StatusChart({ data }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div>
      <div style={{ display: "flex", height: "17px", overflow: "hidden", borderRadius: "20px", background: "#F0EAF0" }}>
        {data.map((item) => (
          <div
            key={item.label}
            title={`${item.label}: ${item.value}`}
            style={{
              width: total ? `${(item.value / total) * 100}%` : "0%",
              background: item.color,
              transition: "width 0.3s",
            }}
          />
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "17px", marginTop: "25px" }}>
        {data.map((item) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "9px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: item.color, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: "12px", color: "#887F91" }}>{item.label}</div>
              <div style={{ fontSize: "20px", fontWeight: 700, color: "#302344", marginTop: "3px" }}>
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServiceChart({ data }) {
  const max = Math.max(...data.map((item) => item.value), 1);

  if (data.length === 0) {
    return <p style={{ color: "#887F91", fontSize: "13px" }}>No service data available yet.</p>;
  }

  return (
    <div style={{ display: "grid", gap: "19px" }}>
      {data.map((item, index) => (
        <div key={item.label}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: "12px", marginBottom: "8px" }}>
            <span style={{ color: "#51465F", fontSize: "13px", fontWeight: 600 }}>
              {index + 1}. {item.label}
            </span>
            <span style={{ color: "#887F91", fontSize: "12px" }}>
              {item.value} bookings
            </span>
          </div>

          <div style={{ height: "9px", borderRadius: "20px", background: "#F0EAF0", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${(item.value / max) * 100}%`,
                background: index === 0 ? COLORS.gold : COLORS.purple,
                borderRadius: "20px",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Analytics({ appointments = [] }) {
  const monthlyData = useMemo(() => {
    const now = new Date();

    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);

      return {
        key: getMonthKey(date),
        label: date.toLocaleDateString("en-US", { month: "short" }),
        value: 0,
      };
    });

    appointments.forEach((item) => {
      const rawDate = getDate(item);
      if (!rawDate) return;

      const date = new Date(`${rawDate}T00:00:00`);
      if (Number.isNaN(date.getTime())) return;

      const key = getMonthKey(date);
      const month = months.find((item) => item.key === key);

      if (month) month.value += 1;
    });

    return months;
  }, [appointments]);

  const statusData = useMemo(() => {
    const statuses = [
      { label: "New", value: 0, color: COLORS.purple },
      { label: "Contacted", value: 0, color: COLORS.gold },
      { label: "Confirmed", value: 0, color: COLORS.green },
      { label: "Cancelled", value: 0, color: COLORS.red },
    ];

    appointments.forEach((item) => {
      const status = normalizeStatus(item.status);
      const entry = statuses.find((item) => item.label === status);

      if (entry) entry.value += 1;
    });

    return statuses;
  }, [appointments]);

  const serviceData = useMemo(() => {
    const counts = {};

    appointments.forEach((item) => {
      const service = getService(item);
      counts[service] = (counts[service] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [appointments]);

  const total = appointments.length;
  const confirmed = statusData.find((item) => item.label === "Confirmed").value;
  const cancelled = statusData.find((item) => item.label === "Cancelled").value;

  const summaryCards = [
    { label: "Total Bookings", value: total, color: COLORS.purple },
    { label: "Confirmed", value: confirmed, color: COLORS.green },
    { label: "Cancelled", value: cancelled, color: COLORS.red },
  ];

  return (
    <div>
      <div style={{ marginBottom: "23px" }}>
        <h2 style={{ margin: 0, fontSize: "21px", color: "#302344" }}>
          Business Analytics
        </h2>
        <p style={{ fontSize: "13px", color: "#887F91", marginTop: "7px" }}>
          Understand appointment activity and popular services.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "15px", marginBottom: "22px" }}>
        {summaryCards.map((card) => (
          <div key={card.label} style={cardStyle}>
            <div style={{ fontSize: "12px", color: "#887F91", marginBottom: "10px" }}>
              {card.label}
            </div>
            <div style={{ fontSize: "29px", fontWeight: 700, color: card.color }}>
              {card.value}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))", gap: "18px" }}>
        <section style={cardStyle}>
          <h3 style={{ fontSize: "16px", margin: "0 0 5px", color: "#302344" }}>
            Monthly Appointments
          </h3>
          <p style={{ fontSize: "12px", color: "#968B9B", margin: 0 }}>
            Last six calendar months
          </p>

          {total === 0 ? (
            <p style={{ color: "#887F91", fontSize: "13px", marginTop: "30px" }}>
              No appointment data available yet.
            </p>
          ) : (
            <BarChart data={monthlyData} />
          )}
        </section>

        <section style={cardStyle}>
          <h3 style={{ fontSize: "16px", margin: "0 0 5px", color: "#302344" }}>
            Appointment Status
          </h3>
          <p style={{ fontSize: "12px", color: "#968B9B", margin: "0 0 25px" }}>
            Current booking status breakdown
          </p>

          <StatusChart data={statusData} />
        </section>

        <section style={{ ...cardStyle, gridColumn: "1 / -1" }}>
          <h3 style={{ fontSize: "16px", margin: "0 0 5px", color: "#302344" }}>
            Popular Services
          </h3>
          <p style={{ fontSize: "12px", color: "#968B9B", margin: "0 0 25px" }}>
            Top five services by appointment count
          </p>

          <ServiceChart data={serviceData} />
        </section>
      </div>

      <p style={{ fontSize: "11px", color: "#A49AA9", marginTop: "20px" }}>
        Analytics are calculated from the appointment records currently stored in the demo database.
      </p>
    </div>
  );
}

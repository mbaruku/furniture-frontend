import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function DailyReportExport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  // Fetch report data from backend
  const fetchReport = async (selectedDate) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/reports/stock-summary?date=${selectedDate}`
      );
      setReport(res.data);
    } catch (err) {
      console.error("Error fetching stock report:", err);
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(date);
  }, [date]);

  const formatCurrency = (num) =>
    num.toLocaleString("en-TZ", { minimumFractionDigits: 0 });

  const subtotal = (items, field) =>
    items.reduce((sum, i) => sum + (i[field] || 0), 0);

  const handleExportPDF = () => {
    import("jspdf").then((jsPDF) => {
      import("html2canvas").then((html2canvas) => {
        const input = document.getElementById("report-content");
        html2canvas.default(input, { scale: 2 }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF.jsPDF("p", "mm", "a4");

          const imgProps = pdf.getImageProperties(imgData);
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

          pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
          pdf.save(`Daily_Report_${date}.pdf`);
        });
      });
    });
  };

  if (loading) return <p>Loading stock report...</p>;
  if (!report) return <p>No data available for {date}.</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ marginBottom: "15px" }}>
        <label htmlFor="reportDate">Chagua Tarehe: </label>
        <input
          type="date"
          id="reportDate"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <button
        onClick={handleExportPDF}
        style={{
          marginBottom: "15px",
          padding: "10px 15px",
          background: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Export to PDF
      </button>

      <div id="report-content">
        <h1>Stock & Sales Dashboard</h1>
        <p>Tarehe: {date}</p>

        {/* Stock Remaining */}
        {Object.entries(report.stock_remaining).map(([location, items]) => (
          <section key={location}>
            <h2>
              Stock Remaining - {location.charAt(0).toUpperCase() + location.slice(1)}
            </h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#007bff", color: "#fff" }}>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Product Name
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Product Type
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Quantity
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Unit Price (TZS)
                  </th>
                  <th style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Total Value (TZS)
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, idx) => (
                  <tr
                    key={idx}
                    style={{ backgroundColor: idx % 2 === 0 ? "#f2f2f2" : "#fff" }}
                  >
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {item.product_name}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {item.product_type || "-"}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {item.quantity}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {formatCurrency(item.unit_price)}
                    </td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                      {formatCurrency(item.total_value)}
                    </td>
                  </tr>
                ))}
                <tr style={{ fontWeight: "bold", backgroundColor: "#e9ecef" }}>
                  <td colSpan="2" style={{ border: "1px solid #ddd", padding: "8px" }}>
                    Subtotal
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {subtotal(items, "quantity")}
                  </td>
                  <td>-</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {formatCurrency(subtotal(items, "total_value"))}
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        ))}

        {/* Out of Stock */}
        <section>
          <h2>Out of Stock</h2>
          {Object.entries(report.out_of_stock).map(([location, items]) => (
            <div key={location}>
              <h3>{location.charAt(0).toUpperCase() + location.slice(1)}:</h3>
              <ul>
                {items.length > 0 ? (
                  items.map((p, idx) => <li key={idx}>{p}</li>)
                ) : (
                  <li>Hakuna bidhaa zilizoisha</li>
                )}
              </ul>
            </div>
          ))}
        </section>

        {/* Sold Items */}
        <section>
          <h2>Sold Items</h2>
          {Object.entries(report.sold_items).map(([location, items]) => (
            <div key={location}>
              <h3>{location.charAt(0).toUpperCase() + location.slice(1)}</h3>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ backgroundColor: "#007bff", color: "#fff" }}>
                    <th>Product Name</th>
                    <th>Product Type</th>
                    <th>Unit Price (TZS)</th>
                    <th>Quantity Sold</th>
                    <th>Revenue (TZS)</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(items).length > 0 ? (
                    Object.entries(items).map(([name, orders], idx) => {
                      const ordersArray = Array.isArray(orders) ? orders : [orders];
                      return ordersArray.map((info, i) => (
                        <tr
                          key={`${idx}-${i}`}
                          style={{
                            backgroundColor: (idx + i) % 2 === 0 ? "#f2f2f2" : "#fff",
                          }}
                        >
                          <td>{name}</td>
                          <td>{info.product_type || "-"}</td>
                          <td>{formatCurrency(info.unit_price || 0)}</td>
                          <td>{info.quantity}</td>
                          <td>{formatCurrency(info.revenue)}</td>
                        </tr>
                      ));
                    })
                  ) : (
                    <tr>
                      <td colSpan="5">Hakuna mauzo bado</td>
                    </tr>
                  )}
                  <tr style={{ fontWeight: "bold", backgroundColor: "#e9ecef" }}>
                    <td colSpan="3">Subtotal</td>
                    <td>
                      {Object.values(items)
                        .flatMap((o) => (Array.isArray(o) ? o : [o]))
                        .reduce((sum, i) => sum + i.quantity, 0)}
                    </td>
                    <td>
                      {formatCurrency(
                        Object.values(items)
                          .flatMap((o) => (Array.isArray(o) ? o : [o]))
                          .reduce((sum, i) => sum + i.revenue, 0)
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function DailyReportExport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // default leo

  // Function ya fetch report kulingana na tarehe
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
    import("jspdf").then(jsPDF => {
      import("html2canvas").then(html2canvas => {
        const input = document.getElementById("report-content");
        html2canvas.default(input, { scale: 2 }).then(canvas => {
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

        {/* Stock Remaining - Godown */}
        <section>
          <h2>Stock Remaining - Godown</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#007bff", color: "#fff" }}>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Product Name</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Product Type</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Quantity</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Unit Price (TZS)</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Total Value (TZS)</th>
              </tr>
            </thead>
            <tbody>
              {report.stock_remaining.godown.map((item, idx) => (
                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#f2f2f2" : "#fff" }}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.product_name}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.product_type || "-"}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.quantity}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{formatCurrency(item.unit_price)}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{formatCurrency(item.total_value)}</td>
                </tr>
              ))}
              <tr style={{ fontWeight: "bold", backgroundColor: "#e9ecef" }}>
                <td colSpan="2" style={{ border: "1px solid #ddd", padding: "8px" }}>Subtotal</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{subtotal(report.stock_remaining.godown, "quantity")}</td>
                <td>-</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{formatCurrency(subtotal(report.stock_remaining.godown, "total_value"))}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Stock Remaining - Workshop */}
        <section>
          <h2>Stock Remaining - Workshop</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#007bff", color: "#fff" }}>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Product Name</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Product Type</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Quantity</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Unit Price (TZS)</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Total Value (TZS)</th>
              </tr>
            </thead>
            <tbody>
              {report.stock_remaining.workshop.map((item, idx) => (
                <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#f2f2f2" : "#fff" }}>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.product_name}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.product_type || "-"}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{item.quantity}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{formatCurrency(item.unit_price)}</td>
                  <td style={{ border: "1px solid #ddd", padding: "8px" }}>{formatCurrency(item.total_value)}</td>
                </tr>
              ))}
              <tr style={{ fontWeight: "bold", backgroundColor: "#e9ecef" }}>
                <td colSpan="2" style={{ border: "1px solid #ddd", padding: "8px" }}>Subtotal</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{subtotal(report.stock_remaining.workshop, "quantity")}</td>
                <td>-</td>
                <td style={{ border: "1px solid #ddd", padding: "8px" }}>{formatCurrency(subtotal(report.stock_remaining.workshop, "total_value"))}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* Out of Stock */}
        <section>
          <h2>Out of Stock</h2>
          <h3>Godown:</h3>
          <ul>
            {report.out_of_stock.godown.length > 0
              ? report.out_of_stock.godown.map((p, idx) => <li key={idx}>{p}</li>)
              : <li>Hakuna bidhaa zilizoisha</li>}
          </ul>
          <h3>Workshop:</h3>
          <ul>
            {report.out_of_stock.workshop.length > 0
              ? report.out_of_stock.workshop.map((p, idx) => <li key={idx}>{p}</li>)
              : <li>Hakuna bidhaa zilizoisha</li>}
          </ul>
        </section>

        {/* Sold Items */}
        <section>
          <h2>Sold Items</h2>
          {/* Godown Sold Items */}
          <h3>Godown:</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#007bff", color: "#fff" }}>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Product Name</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Product Type</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Unit Price (TZS)</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Quantity Sold</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Revenue (TZS)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(report.sold_items.godown).length > 0
                ? Object.entries(report.sold_items.godown).map(([name, info], idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#f2f2f2" : "#fff" }}>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{name}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{info.product_type || "-"}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{formatCurrency(info.unit_price || 0)}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{info.quantity}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{formatCurrency(info.revenue)}</td>
                  </tr>
                ))
                : <tr><td colSpan="5">Hakuna mauzo bado</td></tr>}
              <tr style={{ fontWeight: "bold", backgroundColor: "#e9ecef" }}>
                <td colSpan="3" style={{ border: "1px solid #ddd", padding: "8px" }}>Subtotal</td>
                <td>{Object.values(report.sold_items.godown).reduce((sum, i) => sum + i.quantity, 0)}</td>
                <td>{formatCurrency(Object.values(report.sold_items.godown).reduce((sum, i) => sum + i.revenue, 0))}</td>
              </tr>
            </tbody>
          </table>

          {/* Workshop Sold Items */}
          <h3>Workshop:</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#007bff", color: "#fff" }}>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Product Name</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Product Type</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Unit Price (TZS)</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Quantity Sold</th>
                <th style={{ border: "1px solid #ddd", padding: "8px" }}>Revenue (TZS)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(report.sold_items.workshop).length > 0
                ? Object.entries(report.sold_items.workshop).map(([name, info], idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 === 0 ? "#f2f2f2" : "#fff" }}>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{name}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{info.product_type || "-"}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{formatCurrency(info.unit_price || 0)}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{info.quantity}</td>
                    <td style={{ border: "1px solid #ddd", padding: "8px" }}>{formatCurrency(info.revenue)}</td>
                  </tr>
                ))
                : <tr><td colSpan="5">Hakuna mauzo bado</td></tr>}
              <tr style={{ fontWeight: "bold", backgroundColor: "#e9ecef" }}>
                <td colSpan="3" style={{ border: "1px solid #ddd", padding: "8px" }}>Subtotal</td>
                <td>{Object.values(report.sold_items.workshop).reduce((sum, i) => sum + i.quantity, 0)}</td>
                <td>{formatCurrency(Object.values(report.sold_items.workshop).reduce((sum, i) => sum + i.revenue, 0))}</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

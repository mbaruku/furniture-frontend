import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";   // ✅ import sahihi
import "./OfficeExpenses.css";

export default function OfficeExpenses() {
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);

  // Update total whenever expenses change
  useEffect(() => {
    const sum = expenses.reduce((acc, exp) => acc + parseFloat(exp.amount), 0);
    setTotal(sum);
  }, [expenses]);

  const handleAddExpense = () => {
    if (!date || !category || !amount) {
      alert("Tafadhali jaza tarehe, kategoria, na kiasi.");
      return;
    }
    const newExpense = {
      id: Date.now(),
      date,
      category,
      description,
      amount: parseFloat(amount),
    };
    setExpenses([newExpense, ...expenses]);
    // Clear inputs
    setDate("");
    setCategory("");
    setDescription("");
    setAmount("");
  };

  const handleDelete = (id) => {
    const filtered = expenses.filter((exp) => exp.id !== id);
    setExpenses(filtered);
  };

  // ✅ Export PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Daily Office Expenses Report", 14, 15);

    const tableColumn = ["Date", "Category", "Description", "Amount (TZS)"];
    const tableRows = [];

    expenses.forEach((exp) => {
      tableRows.push([
        exp.date,
        exp.category,
        exp.description || "-",
        exp.amount.toLocaleString(),
      ]);
    });

    // Tumia autoTable sahihi
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 25,
    });

    // Ongeza Total chini ya jedwali
    doc.text(
      `Total: ${total.toLocaleString()} TZS`,
      14,
      doc.lastAutoTable.finalY + 10
    );

    doc.save("office_expenses.pdf");
  };

  return (
    <div className="office-expenses-card">
      <h2>Daily Office Expenses</h2>
      <div className="form-row">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Select Category</option>
          <option value="Supplies">Supplies</option>
          <option value="Utilities">Utilities</option>
          <option value="Cleaning">Cleaning</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button className="btn-add" onClick={handleAddExpense}>
          Add
        </button>
        <button
          className="btn-clear"
          onClick={() => {
            setDate("");
            setCategory("");
            setDescription("");
            setAmount("");
          }}
        >
          Clear
        </button>
      </div>

      {expenses.length > 0 && (
        <div className="expenses-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.id}>
                  <td>{exp.date}</td>
                  <td>{exp.category}</td>
                  <td>{exp.description}</td>
                  <td>{exp.amount.toLocaleString()}</td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(exp.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="total-row">
            <strong>Total: </strong> {total.toLocaleString()} TZS
          </div>

          {/* 🔹 Export PDF Button */}
          <div className="export-row">
            <button className="btn-export" onClick={handleExportPDF}>
              Export PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

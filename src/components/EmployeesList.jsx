import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./EmployeesList.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function EmployeesList() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingId, setLoadingId] = useState(null); // Spinner for specific row

  const fetchEmployees = () => {
    axios.get(`${API_BASE_URL}/api/employees`)
      .then(res => setEmployees(res.data))
      .catch(err => {
        console.error(err);
        toast.error("Imeshindikana kupakua wafanyakazi.");
      });
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const confirmPayment = (id) => {
    setLoadingId(id);
    axios.patch(`${API_BASE_URL}/api/employees/${id}/pay`)
      .then(() => {
        toast.success("Malipo yamethibitishwa.");
        fetchEmployees();
      })
      .catch(err => {
        console.error(err);
        toast.error("Hitilafu wakati wa kuthibitisha malipo.");
      })
      .finally(() => setLoadingId(null));
  };

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Orodha ya Wafanyakazi</h2>

      <input
        type="text"
        placeholder="Tafuta kwa jina..."
        className="input mb-4 p-2 border rounded w-full max-w-sm"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      <table className="min-w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Jina</th>
            <th className="border p-2">Jinsia</th>
            <th className="border p-2">Simu</th>
            <th className="border p-2">Cheo</th>
            <th className="border p-2">Mshahara</th>
            <th className="border p-2">Malipo</th>
            <th className="border p-2">Hatua</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center p-4">
                Hakuna mfanyakazi anayetegemewa na jina hilo.
              </td>
            </tr>
          ) : (
            filteredEmployees.map(emp => (
              <tr key={emp.id}>
                <td className="border p-2">{emp.name}</td>
                <td className="border p-2">{emp.gender}</td>
                <td className="border p-2">{emp.phone}</td>
                <td className="border p-2">{emp.position}</td>
                <td className="border p-2">{emp.salary}</td>
                <td className="border p-2">
                  {emp.is_paid ? `✔️ ${emp.month_paid}` : "❌ Hajalipwa"}
                </td>
                <td className="border p-2">
                  {!emp.is_paid && (
                    <button
                      onClick={() => confirmPayment(emp.id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded flex items-center justify-center"
                      disabled={loadingId === emp.id}
                    >
                      {loadingId === emp.id ? "Inathibitisha..." : "Thibitisha Malipo"}
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
    </div>
  );
}

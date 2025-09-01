import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Table, Badge, Spinner, Form } from "react-bootstrap";
import jsPDF from "jspdf";
import { toast } from "react-toastify";
import "./AdminOrders.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [loadingOrderId, setLoadingOrderId] = useState(null);
  const [deliveryFees, setDeliveryFees] = useState({});
  const [disabledOrders, setDisabledOrders] = useState({}); // Track disabled inputs

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/orders`);
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      toast.error("⚠️ Imeshindikana kupata oda kutoka server", {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleConfirmPayment = async (orderId) => {
    try {
      setLoadingOrderId(orderId);
      const res = await axios.post(
        `${API_BASE_URL}/api/orders/${orderId}/confirm`
      );

      // Update order status locally
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: res.data.status || "confirmed" }
            : order
        )
      );

      // Disable price & delivery inputs for this order
      setDisabledOrders((prev) => ({ ...prev, [orderId]: true }));

      toast.success("✅ Malipo yamethibitishwa", { position: "top-center" });
    } catch (error) {
      console.error("Confirmation failed:", error);
      toast.error("⚠️ Imeshindikana kuthibitisha malipo", {
        position: "top-center",
      });
    } finally {
      setLoadingOrderId(null);
    }
  };

  const handlePriceChange = async (orderId, itemIndex, newPrice) => {
    try {
      const price = parseFloat(newPrice) || 0;

      await axios.put(
        `${API_BASE_URL}/api/orders/${orderId}/update-item-price-orders`,
        {
          item_index: itemIndex,
          price,
        }
      );

      setOrders((prev) =>
        prev.map((o) => {
          if (o.id === orderId) {
            const updatedItems = [...o.order_items];
            updatedItems[itemIndex].price = price;
            return { ...o, order_items: updatedItems };
          }
          return o;
        })
      );

      toast.success("✅ Price imeupdatewa", { position: "top-center" });
    } catch (err) {
      console.error("Failed to update price:", err);
      toast.error("⚠️ Imeshindikana kuupdate price", {
        position: "top-center",
      });
    }
  };

  const handleUpdateDelivery = async (orderId) => {
    try {
      const fee = deliveryFees[orderId] ?? 0;
      await axios.post(
        `${API_BASE_URL}/api/orders/${orderId}/update-delivery`,
        { delivery_fee: fee }
      );
      toast.success("✅ Delivery fee imeupdatewa", { position: "top-center" });
      fetchOrders();
    } catch (err) {
      console.error("Failed to update delivery fee:", err);
      toast.error("⚠️ Delivery fee haiku-update", { position: "top-center" });
    }
  };

  const generatePDF = (order, type) => {
    const doc = new jsPDF();
    const headerColor = type === "invoice" ? "#007bff" : "#17a2b8";
    const tableHeaderColor = "#343a40";
    const rowColor = "#f8f9fa";

    doc.setFillColor(headerColor);
    doc.rect(0, 0, 210, 20, "F");
    doc.setTextColor("white");
    doc.setFontSize(16);
    doc.text(
      type === "invoice"
        ? "Mkombozi Furniture - Tax Invoice"
        : "Mkombozi Furniture - Delivery Note",
      105,
      14,
      { align: "center" }
    );

    doc.setFontSize(12);
    doc.setTextColor("black");
    doc.text(`Order ID: ${order.id}`, 14, 30);
    doc.text(`Customer: ${order.customer_name}`, 14, 36);
    doc.text(`Email: ${order.customer_address}`, 14, 42);
    doc.text(`Phone: ${order.customer_phone}`, 14, 48);
    doc.text(`Location: ${order.location}`, 14, 54);
    doc.text(`Delivery: ${order.delivery_option}`, 14, 60);

    let y = 70;
    doc.setFillColor(tableHeaderColor);
    doc.setTextColor("white");
    doc.rect(14, y - 6, 182, 8, "F");
    doc.text("S/N", 16, y);
    doc.text("Bidhaa", 28, y);
    doc.text("Type", 90, y);
    doc.text("Qty", 120, y);
    doc.text("Price", 140, y);
    doc.text("Total", 170, y);

    y += 6;
    let totalPrice = 0;
    doc.setTextColor("black");
    order.order_items.forEach((item, i) => {
      const rowY = y + i * 7;
      if (i % 2 === 0) doc.setFillColor(rowColor);
      else doc.setFillColor(255, 255, 255);
      doc.rect(14, rowY - 5, 182, 7, "F");

      const total = item.price * item.quantity;
      totalPrice += total;

      doc.text(`${i + 1}`, 16, rowY);
      doc.text(`${item.product_name}`, 28, rowY);
      doc.text(`${item.product_type}`, 90, rowY);
      doc.text(`${item.quantity}`, 120, rowY);
      doc.text(`${item.price.toLocaleString()} TZS`, 140, rowY);
      doc.text(`${total.toLocaleString()} TZS`, 170, rowY);
    });

    y += order.order_items.length * 7 + 5;
    const deliveryFee = deliveryFees[order.id] ?? order.delivery_fee ?? 0;
    doc.text(`Delivery Fee: ${deliveryFee.toLocaleString()} TZS`, 140, y);
    y += 7;
    doc.text(
      `Total: ${(totalPrice + deliveryFee).toLocaleString()} TZS`,
      140,
      y
    );

    doc.save(
      `${type === "invoice" ? "TaxInvoice" : "DeliveryNote"}_Order_${
        order.id
      }.pdf`
    );
  };

  const filteredOrders = orders.filter((order) =>
    order.customer_name?.toLowerCase().includes(filterName.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Oda Zilizowekwa (Online Only)</h2>

      <Form className="mb-4">
        <Form.Control
          type="text"
          placeholder="Tafuta kwa jina la mteja..."
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />
      </Form>

      {filteredOrders.length === 0 ? (
        <p className="text-center text-muted">
          Hakuna oda inayoendana na kigezo.
        </p>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Mteja</th>
                <th>Simu</th>
                <th>Email</th>
                <th>Location</th>
                <th>Delivery</th>
                <th>Tarehe</th>
                <th>Bidhaa</th>
                <th>Jumla</th>
                <th>Status</th>
                <th>Thibitisha Malipo</th>
                <th>Hatua/Zana</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => {
                const total = order.order_items.reduce(
                  (sum, item) => sum + item.price * item.quantity,
                  0
                );
                const totalWithDelivery =
                  total + (deliveryFees[order.id] ?? order.delivery_fee ?? 0);

                const isDisabled =
                  order.status === "confirmed" || disabledOrders[order.id];

                return (
                  <tr key={order.id}>
                    <td>{index + 1}</td>
                    <td>{order.customer_name}</td>
                    <td>{order.customer_phone}</td>
                    <td>{order.customer_address}</td>
                    <td>{order.location || "Haijatajwa"}</td>
                    <td>
                      <Badge
                        bg={
                          order.delivery_option?.toLowerCase() === "yes"
                            ? "success"
                            : "secondary"
                        }
                      >
                        {order.delivery_option || "No"}
                      </Badge>
                    </td>
                    <td>
                      {order.date_ordered
                        ? new Date(order.date_ordered + "Z").toLocaleString(
                            "sw-TZ"
                          )
                        : "Hakuna tarehe"}
                    </td>
                    <td>
                      <ul style={{ paddingLeft: 16, marginBottom: 0 }}>
                        {order.order_items.map((item, i) => (
                          <li key={i}>
                            {item.name || item.product_name}-{item.product_type}{" "}
                            ({item.quantity} x{" "}
                            <input
                              type="number"
                              value={item.price}
                              onChange={(e) =>
                                handlePriceChange(order.id, i, e.target.value)
                              }
                              style={{ width: "80px" }}
                              disabled={isDisabled}
                            />{" "}
                            TZS)
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      <strong>{totalWithDelivery.toLocaleString()} TZS</strong>
                    </td>
                    <td>
                      <Badge
                        bg={order.status === "confirmed" ? "success" : "warning"}
                      >
                        {order.status === "confirmed" ? "Paid" : "Pending"}
                      </Badge>
                    </td>
                    <td>
                      {order.status === "pending" ? (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleConfirmPayment(order.id)}
                          disabled={loadingOrderId === order.id}
                        >
                          {loadingOrderId === order.id ? (
                            <Spinner size="sm" animation="border" />
                          ) : (
                            "Thibitisha Malipo"
                          )}
                        </Button>
                      ) : (
                        <span className="text-muted">✔ Imelipwa</span>
                      )}
                    </td>
                    <td>
                      <Form.Control
                        type="number"
                        value={deliveryFees[order.id] ?? order.delivery_fee ?? 0}
                        onChange={(e) =>
                          setDeliveryFees((prev) => ({
                            ...prev,
                            [order.id]: parseFloat(e.target.value) || 0,
                          }))
                        }
                        disabled={
                          order.delivery_option?.toLowerCase() !== "yes" ||
                          isDisabled
                        }
                        style={{ marginBottom: 4 }}
                        placeholder="Delivery Fee"
                      />

                      {order.delivery_option?.toLowerCase() === "yes" && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleUpdateDelivery(order.id)}
                          style={{ marginBottom: 4 }}
                          disabled={isDisabled} // disable update button
                        >
                          Update Delivery
                        </Button>
                      )}

                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "4px",
                        }}
                      >
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => generatePDF(order, "invoice")}
                        >
                          Print Tax Invoice
                        </Button>

                        {order.delivery_option?.toLowerCase() === "yes" && (
                          <Button
                            variant="info"
                            size="sm"
                            onClick={() => generatePDF(order, "delivery")}
                          >
                            Print Delivery Note
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
}

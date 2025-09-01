import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Badge, Button, Spinner, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import jsPDF from "jspdf";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ManualOrders() {
  const [orders, setOrders] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [loadingOrderId, setLoadingOrderId] = useState(null);
  const [deliveryFees, setDeliveryFees] = useState({});
  const [disabledOrders, setDisabledOrders] = useState({}); // Track disabled inputs

  // Fetch manual orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/manual-orders`);
      setOrders(
        (res.data || []).map((order) => ({
          ...order,
          location: order.delivery_location?.trim() || "Haijatajwa",
          items: (order.items || []).map((item) => ({
            ...item,
            product_type: item.product_type || "Haijatajwa",
          })),
        }))
      );
    } catch (err) {
      console.error("Failed to fetch manual orders:", err);
      toast.error("⚠️ Haikuwezekana kupata manual orders", {
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Confirm payment
  const handleConfirmPayment = async (orderId) => {
    try {
      setLoadingOrderId(orderId);
      const res = await axios.post(
        `${API_BASE_URL}/api/manual-orders/${orderId}/confirm-payment`
      );
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: res.data.status || "paid" } : o
        )
      );

      // Disable inputs for this order
      setDisabledOrders((prev) => ({ ...prev, [orderId]: true }));

      toast.success("✅ Malipo yamethibitishwa", { position: "top-center" });
    } catch (err) {
      console.error("Confirmation failed:", err);
      toast.error("⚠️ Imeshindikana kuthibitisha malipo", {
        position: "top-center",
      });
    } finally {
      setLoadingOrderId(null);
    }
  };

  // Update item price
  const handlePriceChange = async (orderId, index, newPrice) => {
    try {
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                items: order.items.map((item, i) =>
                  i === index
                    ? { ...item, price: parseFloat(newPrice) || 0 }
                    : item
                ),
              }
            : order
        )
      );

      await axios.put(`${API_BASE_URL}/api/manual-orders/${orderId}/update-item-price`, {
        item_index: index,
        price: parseFloat(newPrice) || 0,
      });

      toast.success("✅ Price ime-update kwenye backend", {
        position: "top-center",
      });
    } catch (err) {
      console.error("Failed to update price:", err);
      toast.error("⚠️ Imeshindikana update price kwenye backend", {
        position: "top-center",
      });
    }
  };

  // Update delivery fee
  const handleUpdateDelivery = async (orderId) => {
    try {
      const fee = deliveryFees[orderId] ?? 0;
      await axios.post(
        `${API_BASE_URL}/api/manual-orders/${orderId}/update-delivery`,
        { delivery_fee: fee }
      );
      toast.success("✅ Delivery fee ime-updatewa", { position: "top-center" });
      fetchOrders();
    } catch (err) {
      console.error("Failed to update delivery fee:", err);
      toast.error("⚠️ Delivery fee haiku-update", { position: "top-center" });
    }
  };

  // Generate PDF
  const generatePDF = (order, type = "invoice") => {
    const doc = new jsPDF("p", "mm", "a4");
    doc.setFillColor(type === "invoice" ? "#007bff" : "#17a2b8");
    doc.rect(0, 0, 210, 20, "F");
    doc.setTextColor("#fff");
    doc.setFontSize(16);
    doc.text(
      type === "invoice" ? "Manual Order Invoice" : "Delivery Note",
      105,
      14,
      { align: "center" }
    );

    doc.setFontSize(12);
    doc.setTextColor("#000");
    doc.text(`Order ID: ${order.id}`, 14, 30);
    doc.text(`Customer: ${order.customer_name}`, 14, 36);
    doc.text(`Phone: ${order.phone}`, 14, 42);
    doc.text(`Location: ${order.delivery_location}`, 14, 48);
    doc.text(`Payment Method: ${order.payment_method}`, 14, 54);
    doc.text(`Delivery: ${order.delivery_option || "No"}`, 14, 60);

    let y = 70;
    doc.setFillColor("#343a40");
    doc.setTextColor("#fff");
    doc.rect(14, y - 6, 182, 8, "F");
    doc.text("S/N", 16, y);
    doc.text("Bidhaa", 28, y);
    doc.text("Type", 100, y);
    doc.text("Qty", 130, y);
    doc.text("Price", 150, y);
    doc.text("Total", 170, y);

    y += 6;
    let totalPrice = 0;
    order.items?.forEach((item, i) => {
      const rowY = y + i * 7;
      doc.setFillColor(i % 2 === 0 ? "#f8f9fa" : "#fff");
      doc.rect(14, rowY - 5, 182, 7, "F");

      const itemTotal = (item.price || 0) * (item.quantity || 0);
      totalPrice += itemTotal;

      doc.setTextColor("#000");
      doc.text(`${i + 1}`, 16, rowY);
      doc.text(`${item.product_name}`, 28, rowY);
      doc.text(`${item.product_type}`, 100, rowY);
      doc.text(`${item.quantity}`, 130, rowY);
      doc.text(`${item.price.toLocaleString()} TZS`, 150, rowY);
      doc.text(`${itemTotal.toLocaleString()} TZS`, 170, rowY);
    });

    y += (order.items?.length || 0) * 7 + 5;
    const deliveryFee = deliveryFees[order.id] ?? order.delivery_fee ?? 0;

    if (type === "delivery") {
      doc.text(`Delivery Fee: ${deliveryFee.toLocaleString()} TZS`, 150, y);
      y += 7;
    }

    doc.text(
      `Total: ${(totalPrice + deliveryFee).toLocaleString()} TZS`,
      150,
      y + 7
    );

    doc.setDrawColor(0);
    doc.setFillColor("#e6e6e6");
    doc.rect(14, y + 15, 60, 20, "F");
    doc.setFontSize(10);
    doc.text("Muhuri wa Ofisi", 16, y + 28);

    doc.save(
      `${type === "invoice" ? "Invoice" : "DeliveryNote"}_Order_${order.id}.pdf`
    );
  };

  const filteredOrders = orders.filter((order) =>
    order.customer_name?.toLowerCase().includes(filterName.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Manual Orders</h2>

      <Form className="mb-3">
        <Form.Control
          type="text"
          placeholder="Tafuta kwa jina la mteja..."
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />
      </Form>

      {filteredOrders.length === 0 ? (
        <p className="text-center text-muted">
          Hakuna manual orders zinazoendana na criteria
        </p>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Mteja</th>
                <th>Simu</th>
                <th>Location</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Delivery Fee</th>
                <th>Products</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, index) => {
                const total =
                  order.items?.reduce(
                    (sum, item) =>
                      sum + (item.price || 0) * (item.quantity || 0),
                    0
                  ) || 0;
                const totalWithDelivery =
                  total + (deliveryFees[order.id] ?? order.delivery_fee ?? 0);

                const isDisabled =
                  order.status === "paid" || disabledOrders[order.id];

                return (
                  <tr key={order.id}>
                    <td>{index + 1}</td>
                    <td>{order.customer_name}</td>
                    <td>{order.phone}</td>
                    <td>{order.delivery_location}</td>
                    <td>{order.payment_method}</td>
                    <td>
                      <Badge
                        bg={order.status === "paid" ? "success" : "warning"}
                      >
                        {order.status === "paid" ? "Imelipwa" : "Pending"}
                      </Badge>
                    </td>
                    <td>
                      {order.delivery_option?.toLowerCase() === "yes" ? (
                        <>
                          <Form.Control
                            type="number"
                            value={
                              deliveryFees[order.id] ?? order.delivery_fee ?? 0
                            }
                            onChange={(e) =>
                              setDeliveryFees((prev) => ({
                                ...prev,
                                [order.id]: parseFloat(e.target.value) || 0,
                              }))
                            }
                            placeholder="Delivery Fee"
                            style={{ width: "100px", marginBottom: "4px" }}
                            disabled={isDisabled} // disable after confirmation
                          />
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleUpdateDelivery(order.id)}
                            disabled={isDisabled} // disable update button
                          >
                            Update
                          </Button>
                        </>
                      ) : (
                        <Badge bg="secondary">No</Badge>
                      )}
                    </td>
                    <td>
                      <ul style={{ paddingLeft: 16, marginBottom: 0 }}>
                        {order.items?.map((item, i) => (
                          <li key={i}>
                            {item.product_name} - {item.product_type} (
                            {item.quantity} x{" "}
                            <input
                              type="number"
                              value={item.price}
                              onChange={(e) =>
                                handlePriceChange(order.id, i, e.target.value)
                              }
                              style={{ width: "100px" }}
                              disabled={isDisabled} // disable after confirmation
                            />{" "}
                            TZS)
                          </li>
                        ))}
                      </ul>
                      <strong>
                        Total: {totalWithDelivery.toLocaleString()} TZS
                      </strong>
                    </td>
                    <td
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                      }}
                    >
                      {order.status === "pending" && (
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
                      )}
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => generatePDF(order, "invoice")}
                      >
                        Print Invoice
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

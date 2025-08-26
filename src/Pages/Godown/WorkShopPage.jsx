import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WorkShopPage.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function WorkShopPage() {
  const [formData, setFormData] = useState({
    product_name: '',
    product_type: '',
    quantity: '',
    unit_price: '',
    date_added: '',
    image: null,
  });

  const [items, setItems] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [postSuccess, setPostSuccess] = useState('');
  const [postError, setPostError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [postData, setPostData] = useState({
    product_name: '',
    unit_price: '',
    discount_percentage: '',
    discount_expiry: '',
    category_type: 'normal',
  });

  // Fetch all workshop items
  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/workshop`);
      setItems(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // Submit "Post" data (PATCH)
  const handleSubmit = async () => {
    if (!selectedProduct || !selectedProduct.id) {
      setPostError("❌ Hakuna bidhaa iliyochaguliwa!");
      return;
    }

    const preparedData = {
      product_name: postData.product_name,
      unit_price: parseFloat(postData.unit_price),
      category_type: postData.category_type,
      discount_percentage:
        postData.category_type === 'discount'
          ? parseInt(postData.discount_percentage) || 0
          : 0,
      discount_expiry:
        postData.category_type === 'discount' && postData.discount_expiry
          ? new Date(postData.discount_expiry).toISOString().split('T')[0]
          : null,
    };

    try {
      await axios.patch(
        `${API_BASE_URL}/api/workshop/post/${selectedProduct.id}`,
        preparedData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      setPostSuccess('✅ Bidhaa imepostiwa kikamilifu!');
      setPostError('');
      setShowModal(false);
      setSelectedProduct(null);
      fetchItems();
      setTimeout(() => setPostSuccess(''), 3000);
    } catch (err) {
      console.error('Post submit error:', err.response || err.message || err);
      setPostError('❌ Imeshindikana kuposti bidhaa!');
      setPostSuccess('');
      setTimeout(() => setPostError(''), 4000);
    }
  };

  // Handle form changes for add/edit
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Delete item
  const handleDelete = async (id) => {
    if (!window.confirm('Una uhakika unataka kufuta bidhaa hii?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/workshop/${id}`);
      fetchItems();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Open post modal for a product
  const openPostModal = (item) => {
    setSelectedProduct(item);
    setPostData({
      product_name: item.product_name,
      unit_price: item.unit_price,
      discount_percentage: '',
      discount_expiry: '',
      category_type: 'normal',
    });
    setShowModal(true);
  };

  // Handle post modal input change
  const handlePostChange = (e) => {
    const { name, value } = e.target;
    setPostData(prev => ({ ...prev, [name]: value }));
  };

  // Open edit mode
  const handleEdit = (item) => {
    setEditMode(true);
    setEditId(item.id);
    setFormData({
      product_name: item.product_name,
      product_type: item.product_type,
      quantity: item.quantity,
      unit_price: item.unit_price,
      date_added: item.date_added ? item.date_added.split('T')[0] : '',
      image: null,
    });
    setImagePreview(item.image_filename ? `${API_BASE_URL}/uploads_workshop/${item.image_filename}` : null);
  };

  // Submit add or edit form
  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const formPayload = new FormData();

    formPayload.append("product_name", formData.product_name);
    formPayload.append("product_type", formData.product_type);
    formPayload.append("quantity", formData.quantity);
    formPayload.append("unit_price", formData.unit_price);
    formPayload.append("date_added", formData.date_added);
    if (formData.image) {
      formPayload.append("image", formData.image);
    }

    try {
      if (editMode && editId) {
        // UPDATE
        await axios.put(`${API_BASE_URL}/api/workshop/${editId}`, formPayload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess("✅ Bidhaa imehaririwa kikamilifu!");
      } else {
        // ADD NEW
        await axios.post(`${API_BASE_URL}/api/workshop`, formPayload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setSuccess("✅ Bidhaa imehifadhiwa kwenye workshop!");
      }

      setFormData({
        product_name: '',
        product_type: '',
        quantity: '',
        unit_price: '',
        date_added: '',
        image: null,
      });
      setImagePreview(null);
      setEditMode(false);
      setEditId(null);
      fetchItems();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Save error:", err);
      setSuccess("❌ Imeshindikana kuhifadhi/hariri bidhaa.");
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  // Filtering items by search and product type
  const filteredItems = items.filter(item => {
    const matchesSearch = item.product_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || item.product_type.toLowerCase() === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="workshop-page">
      <h2>Ongeza Bidhaa Mpya</h2>

      <form onSubmit={handlePostSubmit} className="product-form" encType="multipart/form-data">
        <input name="product_name" value={formData.product_name} onChange={handleChange} placeholder="Jina la bidhaa" required />
        <input name="product_type" value={formData.product_type} onChange={handleChange} placeholder="Aina ya bidhaa" required />
        <input name="quantity" type="number" value={formData.quantity} onChange={handleChange} placeholder="Idadi" required />
        <input name="unit_price" type="number" value={formData.unit_price} onChange={handleChange} placeholder="Bei kwa kipande" required />
        <input name="date_added" type="date" value={formData.date_added} onChange={handleChange} required />
        <input name="image" type="file" onChange={handleChange} accept="image/*" />
        {imagePreview && <img src={imagePreview} alt="Preview" className="preview-image" />}
        <button type="submit">{editMode ? "Hifadhi Mabadiliko" : "Hifadhi"}</button>
      </form>

      {success && <p className="success-msg">{success}</p>}
      {postSuccess && <p className="success-msg">{postSuccess}</p>}
      {postError && <p className="error-msg">{postError}</p>}

      <div className="controls">
        <input
          type="text"
          placeholder="Tafuta bidhaa..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="filter-select">
          <option value="all">Aina zote</option>
          <option value="viti">Viti</option>
          <option value="bench">Benches</option>
          <option value="cabinet">Cabinets</option>
        </select>
      </div>

      <table className="items-table">
        <thead>
          <tr>
            <th>Picha</th>
            <th>Jina</th>
            <th>Aina</th>
            <th>Idadi</th>
            <th>Bei kwa kipande</th>
            <th>Jumla</th>
            <th>Tarehe</th>
            <th>Vitendo</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map(item => (
            <tr key={item.id}>
              <td>
                {item.image_filename ? (
                  <img
                    src={`${API_BASE_URL}/uploads_workshop/${item.image_filename}`}
                    alt={item.product_name}
                    height="50"
                  />
                ) : (
                  <span>—</span>
                )}
              </td>
              <td>{item.product_name}</td>
              <td>{item.product_type}</td>
              <td>{item.quantity}</td>
              <td>{item.unit_price} Tsh</td>
              <td>{(item.quantity * item.unit_price).toFixed(2)} Tsh</td>
              <td>{item.date_added ? new Date(item.date_added).toLocaleDateString() : '-'}</td>
              <td>
                <button onClick={() => openPostModal(item)}>Post</button>
                <button onClick={() => handleEdit(item)}>Hariri</button>
                <button onClick={() => handleDelete(item.id)}>Futa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>Jaza taarifa kabla ya kuposti</h3>
            <input name="product_name" value={postData.product_name} onChange={handlePostChange} placeholder="Jina la bidhaa" />
            <input name="unit_price" type="number" value={postData.unit_price} onChange={handlePostChange} placeholder="Bei kwa kipande" />
            <select name="category_type" value={postData.category_type} onChange={handlePostChange}>
              <option value="normal">Chagua Kategoria</option>
              <option value="new">New</option>
              <option value="best">Best</option>
              <option value="discount">Discount</option>
            </select>
            {postData.category_type === 'discount' && (
              <>
                <input name="discount_percentage" type="number" value={postData.discount_percentage} onChange={handlePostChange} placeholder="Punguzo (%)" />
                <input name="discount_expiry" type="date" value={postData.discount_expiry} onChange={handlePostChange} />
              </>
            )}
            <div className="modal-actions">
              <button onClick={handleSubmit}>Post Sasa</button>
              <button onClick={() => setShowModal(false)}>Funga</button>
            </div>
          </div>
        </div>
      )}

      {editMode && (
        <button
          type="button"
          onClick={() => {
            setEditMode(false);
            setEditId(null);
            setFormData({
              product_name: '',
              product_type: '',
              quantity: '',
              unit_price: '',
              date_added: '',
              image: null,
            });
            setImagePreview(null);
          }}
          className="cancel-edit"
        >
          Ghairi Hariri
        </button>
      )}
    </div>
  );
}

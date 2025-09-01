import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Godown.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function GodownPage() {
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
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

  const [loading, setLoading] = useState(false); // general loading state
  const [deleteLoadingId, setDeleteLoadingId] = useState(null); // track which item is being deleted
  const [postLoading, setPostLoading] = useState(false); // track post modal loading
  const [submitLoading, setSubmitLoading] = useState(false); // track form submit loading

  const fetchItems = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/godown`);
      setItems(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("❌ Imeshindikana kupata bidhaa!");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async () => {
    if (!selectedProduct || !selectedProduct.id) {
      toast.error("❌ Hakuna bidhaa iliyochaguliwa!");
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
      setPostLoading(true);
      await axios.patch(
        `${API_BASE_URL}/api/godown/post/${selectedProduct.id}`,
        preparedData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      toast.success("✅ Bidhaa imepostiwa kikamilifu!");
      setShowModal(false);
      setSelectedProduct(null);
      fetchItems();
    } catch (err) {
      console.error('Post submit error:', err);
      toast.error("❌ Imeshindikana kuposti bidhaa!");
    } finally {
      setPostLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
      setImagePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Una uhakika unataka kufuta bidhaa hii?')) return;
    try {
      setDeleteLoadingId(id);
      await axios.delete(`${API_BASE_URL}/api/godown/${id}`);
      toast.success("✅ Bidhaa imetolewa kwa ufanisi!");
      fetchItems();
    } catch (err) {
      console.error('Delete error:', err);
      toast.error("❌ Imeshindikana kufuta bidhaa!");
    } finally {
      setDeleteLoadingId(null);
    }
  };

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

  const handlePostChange = (e) => {
    const { name, value } = e.target;
    setPostData(prev => ({ ...prev, [name]: value }));
  };

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
    setImagePreview(item.image ? `${API_BASE_URL}/uploads/${item.image || item.image_filename}` : null);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    const formPayload = new FormData();
    formPayload.append("product_name", formData.product_name);
    formPayload.append("product_type", formData.product_type);
    formPayload.append("quantity", formData.quantity);
    formPayload.append("unit_price", formData.unit_price);
    formPayload.append("date_added", formData.date_added);
    if (formData.image) formPayload.append("image", formData.image);

    try {
      setSubmitLoading(true);
      if (editMode && editId) {
        await axios.put(`${API_BASE_URL}/api/godown/${editId}`, formPayload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("✅ Bidhaa imehaririwa kikamilifu!");
      } else {
        await axios.post(`${API_BASE_URL}/api/godown`, formPayload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("✅ Bidhaa imehifadhiwa kwenye godown!");
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
    } catch (err) {
      console.error("Save error:", err);
      toast.error("❌ Imeshindikana kuhifadhi/hariri bidhaa.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.product_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || item.product_type.toLowerCase() === filterType.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="godown-page">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <h2>Ongeza Bidhaa Mpya</h2>
      <form onSubmit={handlePostSubmit} className="product-form" encType="multipart/form-data">
        <input name="product_name" value={formData.product_name} onChange={handleChange} placeholder="Jina la bidhaa" required />
        <input name="product_type" value={formData.product_type} onChange={handleChange} placeholder="Aina ya bidhaa" required />
        <input name="quantity" type="number" value={formData.quantity} onChange={handleChange} placeholder="Idadi" required />
        <input name="unit_price" type="number" value={formData.unit_price} onChange={handleChange} placeholder="Bei kwa kipande" required />
        <input name="date_added" type="date" value={formData.date_added} onChange={handleChange} required />
        <input name="image" type="file" onChange={handleChange} accept="image/*" />
        {imagePreview && <img src={imagePreview} alt="Preview" className="preview-image" />}
        <button type="submit" disabled={submitLoading}>
          {submitLoading ? 'Inahifadhi...' : 'Hifadhi'}
        </button>
      </form>

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
          <option value="Chair">Viti</option>
          <option value="Bench">Benches</option>
          <option value="Cabinet">Cabinets</option>
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
              <td><img src={`${API_BASE_URL}/uploads/${item.image || item.image_filename}`} alt={item.product_name} height="50" /></td>
              <td>{item.product_name}</td>
              <td>{item.product_type}</td>
              <td>{item.quantity}</td>
              <td>{item.unit_price} Tsh</td>
              <td>{item.quantity * item.unit_price} Tsh</td>
              <td>{item.date_added ? new Date(item.date_added).toLocaleDateString() : '-'}</td>
              <td>
                <button onClick={() => openPostModal(item)} disabled={postLoading}>
                  {postLoading && selectedProduct?.id === item.id ? 'Posting...' : 'Post'}
                </button>
                <button onClick={() => handleEdit(item)}>Hariri</button>
                <button onClick={() => handleDelete(item.id)} disabled={deleteLoadingId === item.id}>
                  {deleteLoadingId === item.id ? 'Inafutwa...' : 'Futa'}
                </button>
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
              <button onClick={handleSubmit} disabled={postLoading}>
                {postLoading ? 'Inapostiwa...' : 'Post Sasa'}
              </button>
              <button onClick={() => setShowModal(false)} disabled={postLoading}>Funga</button>
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

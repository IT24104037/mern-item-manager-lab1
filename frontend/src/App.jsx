import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [items, setItems] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
    category: "",
  });
  const [editingId, setEditingId] = useState(null);

  const API_URL = "https://mern-item-manager-backend.vercel.app/api/items";

  const fetchItems = async () => {
    try {
      const response = await axios.get(API_URL);
      setItems(response.data);
    } catch (error) {
      console.log("Fetch error:", error);
      alert("Could not fetch items from backend");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Button clicked");
    console.log("Form data:", formData);

    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post(API_URL, formData);
      }

      setFormData({
        name: "",
        price: "",
        quantity: "",
        category: "",
      });

      fetchItems();
      alert("Item saved successfully");
    } catch (error) {
  console.log("Save error full:", error);
  console.log("Save error response:", error.response);
  console.log("Save error data:", error.response?.data);
  alert("Error while saving item: " + (error.response?.data?.message || error.message));
}
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      category: item.category,
    });
    setEditingId(item._id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchItems();
    } catch (error) {
      console.log("Delete error:", error);
      alert("Error while deleting item");
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "30px auto", fontFamily: "Arial", color: "black" }}>
      <h1>Item Manager</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Item Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ margin: "5px", padding: "8px" }}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
          style={{ margin: "5px", padding: "8px" }}
        />
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
          required
          style={{ margin: "5px", padding: "8px" }}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
          required
          style={{ margin: "5px", padding: "8px" }}
        />
        <button type="submit" style={{ margin: "5px", padding: "8px 15px", cursor: "pointer" }}>
          {editingId ? "Update Item" : "Add Item"}
        </button>
      </form>

      <h2>Item List</h2>

      {items.length === 0 ? (
        <p>No items found.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.price}</td>
                <td>{item.quantity}</td>
                <td>{item.category}</td>
                <td>
                  <button onClick={() => handleEdit(item)} style={{ marginRight: "10px" }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(item._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
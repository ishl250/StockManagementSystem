import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const StockOut = () => {
  const [spareParts, setSpareParts] = useState([]);
  const [stockOuts, setStockOuts] = useState([]);
  const [formData, setFormData] = useState({
    SparePartID: '',
    StockOutQuantity: '',
    StockOutUnitPrice: '',
    StockOutDate: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    fetchSpareParts();
    fetchStockOuts();

    // Trigger fade-in animation on mount
    setFadeIn(true);
  }, []);

  const fetchSpareParts = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/spare-parts');
      setSpareParts(res.data);
    } catch (error) {
      console.error('Error fetching spare parts:', error);
    }
  };

  const fetchStockOuts = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/stock-outs');
      setStockOuts(res.data);
    } catch (error) {
      console.error('Error fetching stock outs:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:3000/api/stock-out/${editingId}`, formData);
        alert('Stock out updated successfully!');
      } else {
        await axios.post('http://localhost:3000/api/stock-out', formData);
        alert('Stock out entry added!');
      }
      setFormData({ SparePartID: '', StockOutQuantity: '', StockOutUnitPrice: '', StockOutDate: '' });
      setEditingId(null);
      fetchStockOuts();
    } catch (error) {
      alert(error.response?.data?.message || 'Error processing stock out');
    }
  };

  const handleEdit = (stockOut) => {
    setFormData({
      SparePartID: stockOut.SparePartID.toString(),
      StockOutQuantity: stockOut.StockOutQuantity,
      StockOutUnitPrice: stockOut.StockOutUnitPrice,
      StockOutDate: stockOut.StockOutDate.split('T')[0],
    });
    setEditingId(stockOut.StockOutID);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this stock out entry?')) {
      try {
        await axios.delete(`http://localhost:3000/api/stock-out/${id}`);
        fetchStockOuts();
      } catch (error) {
        alert('Error deleting stock out');
      }
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-5 border-r border-gray-200">
        <h2 className="text-3xl font-bold text-orange-600 mb-8 text-center">SIMS</h2>
        <nav className="space-y-4 text-orange-600 font-semibold">
          <Link
            to="/dashboard"
            className="block py-2 px-4 rounded-lg hover:bg-orange-100 transition"
          >
            Welcome Page
          </Link>
          <Link
            to="/spare-parts"
            className="block py-2 px-4 rounded-lg hover:bg-orange-100 transition"
          >
            Spare Parts
          </Link>
          <Link
            to="/stock-in"
            className="block py-2 px-4 rounded-lg hover:bg-orange-100 transition"
          >
            Stock In
          </Link>
          <Link
            to="/stock-out"
            className="block py-2 px-4 bg-orange-200 rounded-lg"
          >
            Stock Out
          </Link>
          <Link
            to="/report"
            className="block py-2 px-4 rounded-lg hover:bg-orange-100 transition"
          >
            Report
          </Link>
          <button
            onClick={() => { sessionStorage.clear(); window.location.href = '/'; }}
            className="w-full mt-6 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition"
          >
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <main
        className={`flex-1 p-10 overflow-y-auto transition-opacity duration-700 ${
          fadeIn ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h1 className="text-5xl font-extrabold text-orange-700 mb-8">Stock Out</h1>

        {/* Form */}
        <section
          className={`bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto mb-10 transition-transform duration-500 ${
            fadeIn ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <h2 className="text-3xl font-bold text-orange-600 mb-6">
            {editingId ? 'Edit' : 'Add'} Stock Out Entry
          </h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            {!editingId ? (
              <select
                name="SparePartID"
                value={formData.SparePartID}
                onChange={handleChange}
                required
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              >
                <option value="">Select Spare Part</option>
                {spareParts.map((part) => (
                  <option key={part.SparePartID} value={part.SparePartID}>
                    {part.Name} ({part.Category})
                  </option>
                ))}
              </select>
            ) : (
              <div className="w-full px-5 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-700 select-none">
                {spareParts.find((p) => p.SparePartID === parseInt(formData.SparePartID))?.Name} (
                {spareParts.find((p) => p.SparePartID === parseInt(formData.SparePartID))?.Category})
              </div>
            )}

            <input
              type="number"
              name="StockOutQuantity"
              placeholder="Stock Out Quantity"
              value={formData.StockOutQuantity}
              onChange={handleChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              required
            />
            <input
              type="number"
              name="StockOutUnitPrice"
              placeholder="Unit Price"
              value={formData.StockOutUnitPrice}
              onChange={handleChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              required
            />
            <input
              type="date"
              name="StockOutDate"
              value={formData.StockOutDate}
              onChange={handleChange}
              className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
              required
            />
            <button
              type="submit"
              className="w-full py-3 px-6 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition transform hover:scale-105"
            >
              {editingId ? 'Update' : 'Add'} Stock Out Entry
            </button>
          </form>
        </section>

        {/* Stock Out Records Table */}
        <section
          className={`bg-white p-8 rounded-lg shadow-md max-w-6xl mx-auto transition-transform duration-500 ${
            fadeIn ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <h2 className="text-3xl font-bold text-orange-600 mb-6">Stock Out Records</h2>
          <table className="min-w-full table-auto border border-gray-300">
            <thead>
              <tr className="bg-orange-200 text-orange-900">
                <th className="border px-6 py-3 text-left">ID</th>
                <th className="border px-6 py-3 text-left">Part Name</th>
                <th className="border px-6 py-3 text-left">Category</th>
                <th className="border px-6 py-3 text-left">Quantity</th>
                <th className="border px-6 py-3 text-left">Unit Price</th>
                <th className="border px-6 py-3 text-left">Total Price</th>
                <th className="border px-6 py-3 text-left">Date</th>
                <th className="border px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stockOuts.length > 0 ? (
                stockOuts.map((out) => (
                  <tr key={out.StockOutID} className="hover:bg-orange-50 transition">
                    <td className="border px-6 py-3">{out.StockOutID}</td>
                    <td className="border px-6 py-3">{out.Name}</td>
                    <td className="border px-6 py-3">{out.Category}</td>
                    <td className="border px-6 py-3">{out.StockOutQuantity}</td>
                    <td className="border px-6 py-3">{out.StockOutUnitPrice}</td>
                    <td className="border px-6 py-3">{out.StockOutTotalPrice}</td>
                    <td className="border px-6 py-3">{out.StockOutDate.split('T')[0]}</td>
                    <td className="border px-6 py-3 space-x-3">
                      <button
                        onClick={() => handleEdit(out)}
                        className="px-4 py-1 bg-yellow-400 hover:bg-yellow-500 text-white rounded-lg transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(out.StockOutID)}
                        className="px-4 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center p-6 text-orange-600 font-semibold">
                    No stock out records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default StockOut;

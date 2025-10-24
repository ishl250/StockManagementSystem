import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  FiHome,
  FiBox,
  FiArrowDown,
  FiArrowUp,
  FiFileText,
  FiLogOut,
} from 'react-icons/fi';

const SpareParts = () => {
  const [formData, setFormData] = useState({
    Name: '',
    Category: '',
    Quantity: '',
    UnitPrice: '',
  });

  const [spareParts, setSpareParts] = useState([]);

  useEffect(() => {
    fetchSpareParts();
  }, []);

  const fetchSpareParts = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/spare-parts');
      setSpareParts(res.data);
    } catch (error) {
      console.error('Error fetching spare parts:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const TotalPrice = (formData.Quantity * formData.UnitPrice).toFixed(2);
    try {
      await axios.post('http://localhost:3000/api/spare-parts', {
        ...formData,
        TotalPrice,
      });
      alert('Spare part added successfully!');
      setFormData({ Name: '', Category: '', Quantity: '', UnitPrice: '' });
      fetchSpareParts();
    } catch (error) {
      alert('Error adding spare part: ' + error.response?.data?.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-4xl font-bold text-orange-600 mb-6">Spare Parts</h1>

        {/* Form */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <h2 className="text-2xl font-semibold text-orange-500 mb-4">
            Add Spare Part
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="Name"
              placeholder="Spare Part Name"
              value={formData.Name}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="text"
              name="Category"
              placeholder="Category"
              value={formData.Category}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="number"
              name="Quantity"
              placeholder="Quantity"
              value={formData.Quantity}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg"
              required
            />
            <input
              type="number"
              name="UnitPrice"
              placeholder="Unit Price"
              value={formData.UnitPrice}
              onChange={handleChange}
              className="px-4 py-2 border rounded-lg"
              required
            />
            <button
              type="submit"
              className="md:col-span-2 py-2 px-4 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700"
            >
              Add Spare Part
            </button>
          </form>
        </div>

        {/* Table */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-orange-500 mb-4">
            Spare Parts List
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border">
              <thead>
                <tr className="bg-orange-100 text-left">
                  <th className="px-4 py-2 border">ID</th>
                  <th className="px-4 py-2 border">Name</th>
                  <th className="px-4 py-2 border">Category</th>
                  <th className="px-4 py-2 border">Quantity</th>
                  <th className="px-4 py-2 border">Unit Price</th>
                  <th className="px-4 py-2 border">Total Price</th>
                </tr>
              </thead>
              <tbody>
                {spareParts.length > 0 ? (
                  spareParts.map((part) => (
                    <tr key={part.SparePartID} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{part.SparePartID}</td>
                      <td className="px-4 py-2 border">{part.Name}</td>
                      <td className="px-4 py-2 border">{part.Category}</td>
                      <td className="px-4 py-2 border">{part.Quantity}</td>
                      <td className="px-4 py-2 border">{part.UnitPrice}</td>
                      <td className="px-4 py-2 border">{part.TotalPrice}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No spare parts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-64 bg-gray-200 shadow-xl p-5 border-l border-gray-300">
        <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center">SIMS</h2>
        <nav className="space-y-4">
          <Link
            to="/dashboard"
            className="flex items-center space-x-2 py-2 px-4 rounded-lg text-orange-600 hover:bg-gray-300 hover:text-orange-700"
          >
            <FiHome size={20} />
            <span>Welcome Page</span>
          </Link>
          <Link
            to="/spare-parts"
            className="flex items-center space-x-2 py-2 px-4 bg-white rounded-lg text-orange-600 shadow"
          >
            <FiBox size={20} />
            <span>Spare Parts</span>
          </Link>
          <Link
            to="/stock-in"
            className="flex items-center space-x-2 py-2 px-4 rounded-lg text-orange-600 hover:bg-gray-300 hover:text-orange-700"
          >
            <FiArrowDown size={20} />
            <span>Stock In</span>
          </Link>
          <Link
            to="/stock-out"
            className="flex items-center space-x-2 py-2 px-4 rounded-lg text-orange-600 hover:bg-gray-300 hover:text-orange-700"
          >
            <FiArrowUp size={20} />
            <span>Stock Out</span>
          </Link>
          <Link
            to="/report"
            className="flex items-center space-x-2 py-2 px-4 rounded-lg text-orange-600 hover:bg-gray-300 hover:text-orange-700"
          >
            <FiFileText size={20} />
            <span>Report</span>
          </Link>
          <button
            onClick={() => {
              sessionStorage.clear();
              window.location.href = '/';
            }}
            className="w-full mt-4 flex items-center justify-center space-x-2 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
          >
            <FiLogOut size={20} />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </div>
  );
};

export default SpareParts;

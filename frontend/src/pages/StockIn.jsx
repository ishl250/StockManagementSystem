import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FiHome, FiBox, FiArrowDown, FiArrowUp, FiFileText, FiLogOut } from 'react-icons/fi';

const StockIn = () => {
  const [spareParts, setSpareParts] = useState([]);
  const [formData, setFormData] = useState({
    SparePartID: '',
    StockInQuantity: '',
    StockInDate: '',
  });

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
    try {
      await axios.post('http://localhost:3000/api/stock-in', formData);
      alert('Stock entry added successfully!');
      setFormData({ SparePartID: '', StockInQuantity: '', StockInDate: '' });
    } catch (error) {
      console.error('Error adding stock entry:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 p-10 flex flex-col justify-center items-center text-center">
        <h1 className="text-4xl font-bold text-orange-600 mb-6">Stock In</h1>

        <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-orange-600 mb-6">Add Stock Entry</h2>
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <label className="block font-semibold text-gray-700 mb-1" htmlFor="SparePartID">Spare Part</label>
            <select
              id="SparePartID"
              name="SparePartID"
              value={formData.SparePartID}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            >
              <option value="">Select a Spare Part</option>
              {spareParts.map((part) => (
                <option key={part.SparePartID} value={part.SparePartID}>
                  {part.Name} (ID: {part.SparePartID})
                </option>
              ))}
            </select>

            <label className="block font-semibold text-gray-700 mb-1" htmlFor="StockInQuantity">Stock In Quantity</label>
            <input
              type="number"
              id="StockInQuantity"
              name="StockInQuantity"
              placeholder="Enter quantity"
              value={formData.StockInQuantity}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />

            <label className="block font-semibold text-gray-700 mb-1" htmlFor="StockInDate">Stock In Date</label>
            <input
              type="date"
              id="StockInDate"
              name="StockInDate"
              value={formData.StockInDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />

            <button
              type="submit"
              className="w-full py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-bold transition"
            >
              Add Stock Entry
            </button>
          </form>
        </div>
      </div>

      {/* Sidebar on Right */}
      <div className="w-64 bg-gray-200 shadow-xl p-5 border-l border-gray-300">
        <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center">SIMS</h2>
        <nav className="space-y-4">
          <Link to="/dashboard" className="flex items-center space-x-2 py-2 px-4 rounded-lg text-orange-600 hover:bg-gray-300 hover:text-orange-700">
            <FiHome size={20} />
            <span>Welcome Page</span>
          </Link>
          <Link to="/spare-parts" className="flex items-center space-x-2 py-2 px-4 rounded-lg text-orange-600 hover:bg-gray-300 hover:text-orange-700">
            <FiBox size={20} />
            <span>Spare Parts</span>
          </Link>
          <Link to="/stock-in" className="flex items-center space-x-2 py-2 px-4 rounded-lg bg-gray-300 text-orange-700 font-semibold rounded-lg">
            <FiArrowDown size={20} />
            <span>Stock In</span>
          </Link>
          <Link to="/stock-out" className="flex items-center space-x-2 py-2 px-4 rounded-lg text-orange-600 hover:bg-gray-300 hover:text-orange-700">
            <FiArrowUp size={20} />
            <span>Stock Out</span>
          </Link>
          <Link to="/report" className="flex items-center space-x-2 py-2 px-4 rounded-lg text-orange-600 hover:bg-gray-300 hover:text-orange-700">
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

export default StockIn;


import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiHome,
  FiBox,
  FiArrowDown,
  FiArrowUp,
  FiFileText,
  FiLogOut,
} from 'react-icons/fi';

const Dashboard = () => {
  const [totals, setTotals] = useState({
    sparePartTotalQuantity: 0,
    sparePartTotalPrice: 0,
    totalStockInQuantity: 0,
    totalStockOutQuantity: 0,
    totalStockOutPrice: 0,
  });

  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3000/check-auth', { withCredentials: true })
      .then(res => {
        if (!res.data.authenticated) {
          navigate('/');
        }
      })
      .catch(() => navigate('/'));

    // Fetch dashboard totals
    axios.get('http://localhost:3000/api/dashboard-totals')
      .then(res => {
        setTotals(res.data);
      })
      .catch(err => {
        console.error('Failed to fetch dashboard totals', err);
      });
  }, [navigate]);

  const logout = async () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (!confirmLogout) return;

    try {
      await axios.post('http://localhost:3000/logout', {}, { withCredentials: true });
      alert('Logout successful');
      sessionStorage.clear();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 p-10 flex flex-col justify-center items-center text-center space-y-10">
        <h1 className="text-4xl font-bold text-orange-600 mb-6">
          Welcome to Your Dashboard
        </h1>
        <p className="text-gray-700 mb-10">
          Monitor your stock status and navigate through system features.
        </p>

        {/* Totals Section */}
        <div className="grid grid-cols-3 gap-8 w-full max-w-4xl">
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
            <FiBox size={40} className="text-orange-600 mb-3 animate-bounce" />
            <h2 className="text-xl font-semibold text-orange-600 mb-2">
              Total Spare Part Quantity
            </h2>
            <p className="text-3xl font-bold text-gray-800">{totals.sparePartTotalQuantity}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
            <FiBox size={40} className="text-orange-600 mb-3 animate-pulse" />
            <h2 className="text-xl font-semibold text-orange-600 mb-2">
              Total Spare Part Price
            </h2>
            <p className="text-3xl font-bold text-gray-800">
              ${Number(totals.sparePartTotalPrice ?? 0).toFixed(2)}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
            <FiArrowDown size={40} className="text-orange-600 mb-3 animate-ping" />
            <h2 className="text-xl font-semibold text-orange-600 mb-2">
              Total Stock-In Quantity
            </h2>
            <p className="text-3xl font-bold text-gray-800">{totals.totalStockInQuantity}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
            <FiArrowUp size={40} className="text-orange-600 mb-3 animate-ping" />
            <h2 className="text-xl font-semibold text-orange-600 mb-2">
              Total Stock-Out Quantity
            </h2>
            <p className="text-3xl font-bold text-gray-800">{totals.totalStockOutQuantity}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center">
            <FiArrowUp size={40} className="text-orange-600 mb-3 animate-pulse" />
            <h2 className="text-xl font-semibold text-orange-600 mb-2">
              Total Stock-Out Price
            </h2>
            <p className="text-3xl font-bold text-gray-800">
              ${Number(totals.totalStockOutPrice ?? 0).toFixed(2)}
            </p>
          </div>
        </div>
      </div>

      {/* Sidebar on Right */}
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
            className="flex items-center space-x-2 py-2 px-4 rounded-lg text-orange-600 hover:bg-gray-300 hover:text-orange-700"
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
            onClick={logout}
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

export default Dashboard;





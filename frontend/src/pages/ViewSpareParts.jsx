import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ViewSpare = () => {
  const [spareParts, setSpareParts] = useState([]);
  const [editData, setEditData] = useState(null); // Store data for editing

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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this spare part?')) return;

    try {
      await axios.delete(`http://localhost:3000/api/spare-parts/${id}`);
      setSpareParts(spareParts.filter((part) => part.SparePartID !== id));
    } catch (error) {
      console.error('Error deleting spare part:', error);
    }
  };

  const handleEdit = (part) => {
    setEditData(part);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const totalPrice = (editData.Quantity * editData.UnitPrice).toFixed(2);

    try {
      await axios.put(`http://localhost:3000/api/spare-parts/${editData.SparePartID}`, { 
        ...editData, TotalPrice: totalPrice 
      });
      alert('Spare part updated successfully!');
      fetchSpareParts();
      setEditData(null);
    } catch (error) {
      console.error('Error updating spare part:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-green-100 to-green-300">
      <div className="w-64 bg-white shadow-lg p-5">
        <h2 className="text-2xl font-bold text-green-600 mb-6 text-center">SIMS</h2>
        <nav className="space-y-4">
          <Link to="/dashboard" className="block py-2 px-4 rounded-lg hover:bg-green-200">Welcome Page</Link>
          <Link to="/spare-parts" className="block py-2 px-4 rounded-lg hover:bg-green-200">Spare Parts</Link>
          <Link to="/view-spare" className="block py-2 px-4 rounded-lg hover:bg-green-200">View SpareParts</Link>
          <Link to="/stock-in" className="block py-2 px-4 rounded-lg hover:bg-green-200">Stock In</Link>
          <Link to="/stock-out" className="block py-2 px-4 rounded-lg hover:bg-green-200">Stock Out</Link>
          <Link to="/report" className="block py-2 px-4 rounded-lg hover:bg-green-200">Report</Link>
          <button
            onClick={() => { sessionStorage.clear(); window.location.href = '/'; }}
            className="w-full mt-4 py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold"
          >
            Logout
          </button>
        </nav>
      </div>

      <div className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-green-700">View Spare Parts</h1>

        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="p-3">ID</th>
                <th className="p-3">Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Unit Price</th>
                <th className="p-3">Total Price</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {spareParts.map((part) => (
                <tr key={part.SparePartID} className="border-t">
                  <td className="p-3 text-center">{part.SparePartID}</td>
                  <td className="p-3">{part.Name}</td>
                  <td className="p-3">{part.Category}</td>
                  <td className="p-3">{part.Quantity}</td>
                  <td className="p-3">${part.UnitPrice}</td>
                  <td className="p-3">${part.TotalPrice}</td>
                  <td className="p-3">
                    <button onClick={() => handleEdit(part)} className="mr-2 px-3 py-1 bg-blue-600 text-white rounded-lg">Edit</button>
                    <button onClick={() => handleDelete(part.SparePartID)} className="px-3 py-1 bg-red-600 text-white rounded-lg">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editData && (
          <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Edit Spare Part</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input type="text" name="Name" value={editData.Name} onChange={(e) => setEditData({...editData, Name: e.target.value})} className="w-full px-4 py-2 border rounded-lg" required />
              <input type="text" name="Category" value={editData.Category} onChange={(e) => setEditData({...editData, Category: e.target.value})} className="w-full px-4 py-2 border rounded-lg" required />
              <input type="number" name="Quantity" value={editData.Quantity} onChange={(e) => setEditData({...editData, Quantity: e.target.value})} className="w-full px-4 py-2 border rounded-lg" required />
              <input type="number" name="UnitPrice" value={editData.UnitPrice} onChange={(e) => setEditData({...editData, UnitPrice: e.target.value})} className="w-full px-4 py-2 border rounded-lg" required />
              <button type="submit" className="w-full py-2 px-4 bg-green-600 text-white rounded-lg font-bold">Update Spare Part</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewSpare;

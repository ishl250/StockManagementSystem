



// import React, { useState } from "react";
// import axios from "axios";

// const Report = () => {
//   const [reportType, setReportType] = useState("");
//   const [dailyDate, setDailyDate] = useState("");
//   const [reportData, setReportData] = useState([]);
//   const [totals, setTotals] = useState(null);
//   const [showReport, setShowReport] = useState(false);

//   const handleGenerateReport = async () => {
//     try {
//       let res;
//       if (reportType === "daily-stockout") {
//         if (!dailyDate) {
//           alert("Please select a date.");
//           return;
//         }
//         res = await axios.get(
//           `http://localhost:3000/api/report/daily-stockout/${dailyDate}`,
//           { withCredentials: true }
//         );
//       } else if (reportType === "stock-status") {
//         res = await axios.get("http://localhost:3000/api/report/stock-status", {
//           withCredentials: true,
//         });
//       }

//       if (res && res.data) {
//         setReportData(res.data.data || res.data);
//         setTotals(res.data.totals || null);
//         setShowReport(true);
//       }
//     } catch (error) {
//       console.error("Error generating report:", error);
//       alert("Failed to generate report.");
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4">Report</h2>
//       <div className="flex flex-col md:flex-row gap-4 mb-4">
//         <select
//           className="p-2 border rounded"
//           value={reportType}
//           onChange={(e) => {
//             setReportType(e.target.value);
//             setReportData([]);
//             setShowReport(false);
//           }}
//         >
//           <option value="">Select Report Type</option>
//           <option value="daily-stockout">Daily Stock Out</option>
//           <option value="stock-status">Stock Status</option>
//         </select>

//         {reportType === "daily-stockout" && (
//           <input
//             type="date"
//             className="p-2 border rounded"
//             value={dailyDate}
//             onChange={(e) => setDailyDate(e.target.value)}
//           />
//         )}

//         <button
//           onClick={handleGenerateReport}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//         >
//           Generate Report
//         </button>
//       </div>

//       {showReport && (
//         <div className="overflow-x-auto">
//           <table className="min-w-full table-auto border border-gray-300">
//             <thead className="bg-gray-100">
//               <tr>
//                 {reportData.length > 0 &&
//                   Object.keys(reportData[0]).map((key) => (
//                     <th key={key} className="border px-4 py-2 text-left">
//                       {key}
//                     </th>
//                   ))}
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.map((row, index) => (
//                 <tr key={index} className="hover:bg-gray-50">
//                   {Object.values(row).map((val, i) => (
//                     <td key={i} className="border px-4 py-2">
//                       {val}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           {totals && (
//             <div className="mt-4 p-4 bg-gray-100 rounded shadow">
//               <h3 className="font-semibold text-lg mb-2">Totals</h3>
//               <ul className="list-disc pl-5">
//                 {Object.entries(totals).map(([key, value]) => (
//                   <li key={key}>
//                     <span className="font-medium">{key}</span>: {value}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Report;


import React, { useState } from "react";
import axios from "axios";
import {
  FiHome,
  FiBox,
  FiArrowDown,
  FiArrowUp,
  FiFileText,
  FiLogOut,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const Report = () => {
  const [reportType, setReportType] = useState("");
  const [dailyDate, setDailyDate] = useState("");
  const [reportData, setReportData] = useState([]);
  const [totals, setTotals] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const navigate = useNavigate();

  const handleGenerateReport = async () => {
    try {
      let res;
      if (reportType === "daily-stockout") {
        if (!dailyDate) {
          alert("Please select a date.");
          return;
        }
        res = await axios.get(
          `http://localhost:3000/api/report/daily-stockout/${dailyDate}`,
          { withCredentials: true }
        );
      } else if (reportType === "stock-status") {
        res = await axios.get("http://localhost:3000/api/report/stock-status", {
          withCredentials: true,
        });
      }

      if (res && res.data) {
        setReportData(res.data.data || res.data);
        setTotals(res.data.totals || null);
        setShowReport(true);
      }
    } catch (error) {
      console.error("Error generating report:", error);
      alert("Failed to generate report.");
    }
  };

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
      <div className="flex-1 p-10 overflow-y-auto">
        <h1 className="text-4xl font-bold text-orange-600 mb-8 text-center">
          Report Generator
        </h1>

        <div className="bg-white rounded-2xl shadow-md p-6 max-w-4xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
            <select
              className="p-3 border rounded-lg w-full md:w-1/3"
              value={reportType}
              onChange={(e) => {
                setReportType(e.target.value);
                setReportData([]);
                setShowReport(false);
              }}
            >
              <option value="">Select Report Type</option>
              <option value="daily-stockout">Daily Stock Out</option>
              <option value="stock-status">Stock Status</option>
            </select>

            {reportType === "daily-stockout" && (
              <input
                type="date"
                className="p-3 border rounded-lg w-full md:w-1/3"
                value={dailyDate}
                onChange={(e) => setDailyDate(e.target.value)}
              />
            )}

            <button
              onClick={handleGenerateReport}
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-lg w-full md:w-auto"
            >
              Generate Report
            </button>
          </div>

          {showReport && (
            <>
              <div className="overflow-x-auto mt-6">
                <table className="min-w-full table-auto border border-gray-300">
                  <thead className="bg-gray-100">
                    <tr>
                      {reportData.length > 0 &&
                        Object.keys(reportData[0]).map((key) => (
                          <th
                            key={key}
                            className="border px-4 py-2 text-left text-sm font-semibold"
                          >
                            {key}
                          </th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.map((row, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        {Object.values(row).map((val, i) => (
                          <td key={i} className="border px-4 py-2 text-sm">
                            {val}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totals && (
                <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow">
                  <h3 className="text-lg font-semibold mb-2 text-orange-600">Totals</h3>
                  <ul className="list-disc list-inside text-sm">
                    {Object.entries(totals).map(([key, value]) => (
                      <li key={key}>
                        <span className="font-medium">{key}</span>: {value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
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
            className="flex items-center space-x-2 py-2 px-4 rounded-lg bg-gray-300 text-orange-700"
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

export default Report;




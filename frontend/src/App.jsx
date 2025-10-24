import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Register from './pages/register'
import Login from './pages/login'
import Dashboard from './pages/dashboard'
import SpareParts from './pages/SpareParts'
import StockIn from './pages/StockIn'
import StockOut from './pages/StockOut'
import Report from './pages/Report'
import Protect from './pages/Protect'

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={< Register />} />

        {/* Protected routes */}
        <Route path="/dashboard" element={
          <Protect>
            <Dashboard />
          </Protect>
        } />
        <Route path="/spare-parts" element={
          <Protect>
            <SpareParts />
          </Protect>
        } />
        <Route path="/stock-in" element={
          <Protect>
            <StockIn />
          </Protect>
        } />
        <Route path="/stock-out" element={
          <Protect>
            <StockOut />
          </Protect>
        } />
        <Route path="/report" element={
          <Protect>
            <Report />
          </Protect>
        } />
      </Routes>
    </Router>
  )
}

export default App

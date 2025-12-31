import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { I18nProvider } from './context/I18nContext';
import { AuthProvider } from './context/AuthContext';
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import React from 'react';

// Public Pages
import DashboardHome from './pages/dashboard/DashboardHome';
import VehicleManager from './pages/dashboard/VehicleManager';
import FindLoads from './pages/dashboard/FindLoads';
import PostLoad from './pages/dashboard/PostLoad';
import PostTruck from './pages/dashboard/carrier/PostTruck';
import MyTruckPostings from './pages/dashboard/carrier/MyTruckPostings';
import FindTrucks from './pages/dashboard/shipper/FindTrucks';
import MyPostings from './pages/dashboard/MyPostings';
import MyLoads from './pages/dashboard/MyLoads';
import HowItWorks from './pages/HowItWorks';
import Services from './pages/Services';
import MarketRates from './pages/MarketRates';
import Contact from './pages/Contact';
import Help from './pages/Help';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Loadboard from './pages/Loadboard';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import SuperAdminDashboard from './pages/admin/SuperAdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import LoadManagement from './pages/admin/LoadManagement';
import TruckManagement from './pages/admin/TruckManagement';
import CMSManagement from './pages/admin/CMSManagement';
import AdminSettings from './pages/admin/AdminSettings';

// Individual Service Pages
import ServiceFTL from './pages/services/ServiceFTL';
import ServiceLTL from './pages/services/ServiceLTL';
import ServiceCarMoving from './pages/services/ServiceCarMoving';
import ServicePackersMovers from './pages/services/ServicePackersMovers';
import ServiceContainerTransport from './pages/services/ServiceContainerTransport';
import ServiceCarTowing from './pages/services/ServiceCarTowing';

const Settings = () => <div className="h1">Settings</div>;

function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/how-it-works" element={<HowItWorks />} />

              {/* Services Overview */}
              <Route path="/services" element={<Services />} />

              {/* Individual Service Pages */}
              <Route path="/services/ftl" element={<ServiceFTL />} />
              <Route path="/services/ltl" element={<ServiceLTL />} />
              <Route path="/services/car-moving" element={<ServiceCarMoving />} />
              <Route path="/services/packers-movers" element={<ServicePackersMovers />} />
              <Route path="/services/container-transport" element={<ServiceContainerTransport />} />
              <Route path="/services/car-towing" element={<ServiceCarTowing />} />

              <Route path="/market-rates" element={<MarketRates />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/help" element={<Help />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/features" element={<div className="p-20 text-center">Features Page</div>} />

              {/* Public Load Board - Teaser for non-registered users */}
              <Route path="/loadboard" element={<Loadboard />} />
              <Route path="/loads" element={<Loadboard />} />
            </Route>

            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="loads" element={<FindLoads />} />
              <Route path="post-load" element={<PostLoad />} />
              <Route path="post-truck" element={<PostTruck />} />
              <Route path="find-trucks" element={<FindTrucks />} />
              <Route path="my-postings" element={<MyPostings />} />
              <Route path="my-loads" element={<MyLoads />} />
              <Route path="trucks" element={<MyTruckPostings />} />
              <Route path="vehicles" element={<VehicleManager />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="loads" element={<LoadManagement />} />
              <Route path="trucks" element={<TruckManagement />} />
              <Route path="cms" element={<CMSManagement />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="super-admin" element={<SuperAdminDashboard />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </I18nProvider>
  );
}

export default App;

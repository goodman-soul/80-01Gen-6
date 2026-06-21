import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import ExhibitionList from "@/pages/ExhibitionList";
import ExhibitionNew from "@/pages/ExhibitionNew";
import ExhibitionDetail from "@/pages/ExhibitionDetail";
import Warehouse from "@/pages/Warehouse";
import Logistics from "@/pages/Logistics";
import Unpacking from "@/pages/Unpacking";
import ExternalMuseum from "@/pages/ExternalMuseum";
import { AppLayout } from "@/components/layout/AppLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/exhibitions" element={<ExhibitionList />} />
          <Route path="/exhibitions/new" element={<ExhibitionNew />} />
          <Route path="/exhibitions/:id" element={<ExhibitionDetail />} />
          <Route path="/warehouse" element={<Warehouse />} />
          <Route path="/logistics" element={<Logistics />} />
          <Route path="/unpacking" element={<Unpacking />} />
          <Route path="/external" element={<ExternalMuseum />} />
        </Route>
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

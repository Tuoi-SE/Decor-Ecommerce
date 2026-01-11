import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const AdminDashboardPage = lazy(() => import('../pages/admin/DashboardPage'));

const AdminRoutes = () => {
    return (
        <Routes>
            <Route path="dashboard" element={<AdminDashboardPage />} />
            {/* Add other admin routes here */}
        </Routes>
    );
};

export default AdminRoutes;

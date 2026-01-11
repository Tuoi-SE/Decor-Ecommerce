import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';

const StaffDashboardPage = lazy(() => import('../pages/staff/DashboardPage'));

const StaffRoutes = () => {
    return (
        <Routes>
            <Route path="dashboard" element={<StaffDashboardPage />} />
        </Routes>
    );
};

export default StaffRoutes;

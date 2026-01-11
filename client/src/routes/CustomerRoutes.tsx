import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';

const CustomerProfilePage = lazy(() => import('../pages/customer/ProfilePage'));

const CustomerRoutes = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path="profile" element={<CustomerProfilePage />} />
            </Route>
        </Routes>
    );
};

export default CustomerRoutes;

import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

// Lazy Load Pages
const HomePage = lazy(() => import('@/pages/HomePage'));
const AdminLoginPage = lazy(() => import('@/pages/auth/AdminLoginPage'));
const CustomerLoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));

// Import Sub-routes components
const AdminRoutes = lazy(() => import('./AdminRoutes'));
const StaffRoutes = lazy(() => import('./StaffRoutes'));
const CustomerRoutes = lazy(() => import('./CustomerRoutes'));

// Loading Component
const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-screen">
        <span className="material-symbols-outlined animate-spin text-4xl text-primary">progress_activity</span>
    </div>
);

export const AppRouter = () => {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<HomePage />} />
                    {/* Customer Auth Routes */}
                    <Route path="login" element={<CustomerLoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                </Route>

                {/* Admin Auth Route (Separate) */}
                <Route path="/admin/login" element={<AdminLoginPage />} />

                {/* Modular Protected Routes */}
                {/* Admin: /admin/* -> AdminRoutes will handle sub-paths like /admin/dashboard */}
                <Route path="/admin/*" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                        <AdminRoutes />
                    </ProtectedRoute>
                } />

                {/* Staff: /staff/* */}
                <Route path="/staff/*" element={
                    <ProtectedRoute allowedRoles={['staff', 'admin']}>
                        <StaffRoutes />
                    </ProtectedRoute>
                } />

                {/* Customer: Wrapped in MainLayout via CustomerRoutes or here? 
                    CustomerRoutes uses MainLayout internally according to earlier step.
                */}
                <Route path="/*" element={
                    <ProtectedRoute allowedRoles={['customer', 'admin', 'staff']}>
                        <CustomerRoutes />
                    </ProtectedRoute>
                } />

                {/* Fallback for unknown routes not caught by above */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
};

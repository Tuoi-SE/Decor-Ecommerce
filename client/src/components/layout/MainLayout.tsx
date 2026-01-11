import { Outlet, Link } from 'react-router-dom';
import { useAuthStore } from '@/hooks/useAuthStore';

// Temporary basic layout
const MainLayout = ({ children }: { children?: React.ReactNode }) => {
    const { user, logout, isAuthenticated } = useAuthStore();

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="text-2xl font-serif font-bold text-primary tracking-tight">
                        Unbox
                    </Link>

                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/" className="text-gray-500 hover:text-primary transition-colors">Home</Link>
                        <Link to="/shop" className="text-gray-500 hover:text-primary transition-colors">Shop</Link>
                        <Link to="/inspiration" className="text-gray-500 hover:text-primary transition-colors">Inspiration</Link>
                    </nav>

                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                <span className="text-sm font-medium">Hi, {user?.fullName} ({user?.role})</span>
                                <button onClick={logout} className="text-sm text-red-500 hover:text-red-600">Logout</button>
                                {user?.role === 'admin' && <Link to="/admin/dashboard" className="text-sm font-semibold underline">Admin</Link>}
                                {user?.role === 'staff' && <Link to="/staff/dashboard" className="text-sm font-semibold underline">Staff</Link>}
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="text-sm font-medium hover:text-primary">Log in</Link>
                                <Link to="/register" className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm hover:bg-gray-800 transition-all">
                                    Sign up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <main>
                {children || <Outlet />}
            </main>

            <footer className="bg-white border-t border-gray-100 py-12 mt-20">
                <div className="container mx-auto px-6 text-center text-gray-400 text-sm">
                    © 2026 Unbox. Designed for aesthetics.
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;

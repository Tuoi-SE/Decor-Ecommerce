import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu } from 'lucide-react';

const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-white/20 shadow-sm">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-gray-800 tracking-tight">
                    DECOR<span className="text-gray-500">SYSTEM</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex space-x-8 text-gray-600 font-medium">
                    <Link to="/" className="hover:text-black transition-colors">Home</Link>
                    <Link to="/shop" className="hover:text-black transition-colors">Shop</Link>
                    <Link to="/about" className="hover:text-black transition-colors">About</Link>
                </div>

                {/* Icons */}
                <div className="flex items-center space-x-6">
                    <button className="relative hover:text-black text-gray-600 transition-colors">
                        <ShoppingCart size={20} />
                        <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">0</span>
                    </button>
                    <button className="hover:text-black text-gray-600 transition-colors">
                        <User size={20} />
                    </button>
                    <button className="md:hidden hover:text-black text-gray-600 transition-colors">
                        <Menu size={20} />
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

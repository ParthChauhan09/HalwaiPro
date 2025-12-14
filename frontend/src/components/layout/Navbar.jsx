import { Link } from 'react-router-dom';
import { Store, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-bakery-brown text-bakery-cream shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2 group">
                            <img
                                src="/halwaipro.png" // Assuming 'halwai.png' is in the public folder and accessible at the root.
                                alt="HalwaiPro Logo"
                                className="h-10 w-auto" // Adjust height as needed
                            />
                            <span className="text-2xl font-bold font-sans tracking-wide group-hover:text-bakery-orange transition-colors">
                                HalwaiPro
                            </span>
                        </Link>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-baseline space-x-4">
                                <Link to="/dashboard" className="px-3 py-2 rounded-md text-sm font-bold bg-bakery-orange text-white hover:bg-bakery-light-brown transition-colors shadow-sm">Dashboard</Link>
                                <Link to="/sweets" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-bakery-light-brown hover:text-white transition-colors">Sweets</Link>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-gray-600">
                            <User size={20} />
                            <span className="text-sm font-medium">{user?.name}</span>
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 text-red-600 hover:text-red-700 cursor-pointer"
                        >
                            <LogOut size={20} />
                            <span className="text-sm font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

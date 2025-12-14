import { Link } from 'react-router-dom';
import { Store, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center gap-6">
                        <Link to="/" className="flex items-center gap-2">
                            <Store className="h-8 w-8 text-indigo-600" />
                            <span className="text-xl font-bold text-gray-900">HalwaiPro</span>
                        </Link>
                        <div className="hidden md:flex gap-4">
                            <Link to="/sweets" className="text-gray-600 hover:text-gray-900 font-medium">
                                Sweets
                            </Link>
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

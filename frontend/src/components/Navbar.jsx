import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, LogOut, Home, FileText, BarChart3, Users, Settings, TrendingUp, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gray-900 shadow-lg border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-red-600" />
            <span className="ml-2 text-xl font-bold text-white">ChildSafe NG</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/dashboard" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                  <Home className="inline h-4 w-4 mr-1" /> Dashboard
                </Link>
                <Link to="/cases" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                  <FileText className="inline h-4 w-4 mr-1" /> Cases
                </Link>
                {user.role === 'admin' && (
                  <div className="relative group">
                    <button className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-200">
                      <Settings className="inline h-4 w-4 mr-1" /> Admin ▼
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <Link to="/admin/users" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                        <Users className="inline h-4 w-4 mr-2" /> User Management
                      </Link>
                      <Link to="/admin/analytics" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                        <TrendingUp className="inline h-4 w-4 mr-2" /> Analytics
                      </Link>
                      <Link to="/admin/system" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                        <Settings className="inline h-4 w-4 mr-2" /> System Settings
                      </Link>
                    </div>
                  </div>
                )}
                <div className="border-l pl-4 ml-2">
                  <span className="text-sm text-gray-400 mr-3">
                    <Users className="inline h-4 w-4 mr-1" />
                    {user.fullName} ({user.role})
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    <LogOut className="inline h-4 w-4 mr-1" /> Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                  Login
                </Link>
                <Link to="/report" className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700">
                  Report Abuse
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white p-2 rounded-md"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-gray-800 border-t border-gray-700">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {user ? (
                <>
                  <Link
                    to="/dashboard"
                    className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Home className="inline h-4 w-4 mr-2" /> Dashboard
                  </Link>
                  <Link
                    to="/cases"
                    className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FileText className="inline h-4 w-4 mr-2" /> Cases
                  </Link>
                  {user.role === 'admin' && (
                    <>
                      <Link
                        to="/admin/users"
                        className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Users className="inline h-4 w-4 mr-2" /> User Management
                      </Link>
                      <Link
                        to="/admin/analytics"
                        className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <TrendingUp className="inline h-4 w-4 mr-2" /> Analytics
                      </Link>
                      <Link
                        to="/admin/system"
                        className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Settings className="inline h-4 w-4 mr-2" /> System Settings
                      </Link>
                    </>
                  )}
                  <div className="border-t border-gray-700 pt-2">
                    <div className="px-3 py-2 text-sm text-gray-400">
                      <Users className="inline h-4 w-4 mr-1" />
                      {user.fullName} ({user.role})
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="text-red-600 hover:text-red-800 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
                    >
                      <LogOut className="inline h-4 w-4 mr-2" /> Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/report"
                    className="bg-red-600 text-white block px-3 py-2 rounded-md text-base font-medium hover:bg-red-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Report Abuse
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

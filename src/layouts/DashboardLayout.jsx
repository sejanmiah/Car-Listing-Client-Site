import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { NavLink, Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { LayoutDashboard, Car, Users, LogOut, PlusCircle, User, Bell, Search, Sun, Moon, Inbox } from 'lucide-react';
import { getImageUrl } from '../utils/imageUrl';


const DashboardLayout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = currentUser?.role === 'admin';

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  
  // Theme Transition State
  const [revealConfig, setRevealConfig] = useState(null);

  useEffect(() => {
    // Initial load class handling
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = (e) => {
    if (!document.startViewTransition) {
        setIsDarkMode(prev => !prev);
        return;
    }

    const doc = document.documentElement;
    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
        setIsDarkMode(prev => !prev);
    });

    transition.ready.then(() => {
        const clipPath = [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
        ];
        
        doc.animate(
            {
                clipPath: clipPath, 
            },
            {
                duration: 500,
                easing: 'ease-in',
                pseudoElement: '::view-transition-new(root)',
            }
        );
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Notification State
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);
  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Click outside to close notifications
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch notifications
  useEffect(() => {
    if (currentUser) {
        fetchNotifications();
        // Optional: Polling every 60 seconds
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }
  }, [currentUser]);

  const fetchNotifications = async () => {
    try {
        const response = await api.get('/notifications');
        setNotifications(response.data);
    } catch (error) {
        console.error("Error fetching notifications", error);
    }
  };

  const handleNotificationClick = async (notification) => {
    // 1. Mark as read
    if (!notification.is_read) {
        try {
            await api.put(`/notifications/${notification.id}/read`);
            setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, is_read: true } : n));
        } catch (error) {
            console.error("Error marking notification read", error);
        }
    }

    // 2. Navigate based on type and related_id
    setShowNotifications(false);
    
    if (notification.type === 'lead' && notification.related_id) {
        if (isAdmin) navigate(`/dashboard/admin/leads?highlight=${notification.related_id}`);
    } else if (notification.type === 'car' && notification.related_id) {
        if (isAdmin) {
             navigate(`/dashboard/admin/cars?highlight=${notification.related_id}`);
        } else {
             // For users, it might be MyListings, but usually we just go to the list
             navigate(`/dashboard/cars?highlight=${notification.related_id}`);
        }
    } else if (notification.type === 'user' && notification.related_id) {
        if (isAdmin) navigate(`/dashboard/users?highlight=${notification.related_id}`);
    }
  };

  const markAsRead = async (id) => {
    try {
        await api.put(`/notifications/${id}/read`);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (error) {
        console.error("Error marking notification read", error);
    }
  };

  const markAllAsRead = async () => {
      try {
          await api.put('/notifications/read-all');
          setNotifications(prev => prev.map(n => ({...n, is_read: true})));
      } catch (error) {
          console.error("Error marking all read", error);
      }
  };



  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
      isActive 
        ? 'bg-indigo-600 text-white shadow-md' 
        : 'text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-indigo-400'
    }`;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500 ease-in-out`}>
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-xl z-20 hidden md:flex flex-col border-r border-gray-100 dark:border-gray-700 transition-colors duration-500">
        <div className="p-6">
          <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">CarMarket</h1>
          <p className="text-xs font-semibold text-gray-400 mt-1 uppercase tracking-wider">{isAdmin ? 'Admin Portal' : 'User Dashboard'}</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto py-4">
          <NavLink to="/dashboard" end className={navItemClass}>
            <LayoutDashboard size={20} />
            <span className="font-medium">Overview</span>
          </NavLink>

          <NavLink to={isAdmin ? "/dashboard/admin/cars" : "/dashboard/cars"} className={navItemClass}>
            <Car size={20} />
            <span className="font-medium">{isAdmin ? 'All Listings' : 'My Listings'}</span>
          </NavLink>

         {!isAdmin && (
            <NavLink to="/dashboard/add-car" className={navItemClass}>
              <PlusCircle size={20} />
              <span className="font-medium">Sell a Car</span>
            </NavLink>
          )}

          <NavLink to="/dashboard/profile" className={navItemClass}>
            <User size={20} />
            <span className="font-medium">Profile</span>
          </NavLink>

          {isAdmin && (
            <NavLink to="/dashboard/users" className={navItemClass}>
              <Users size={20} />
              <span className="font-medium">Manage Users</span>
            </NavLink>
          )}

          {isAdmin && (
            <NavLink to="/dashboard/admin/leads" className={navItemClass}>
              <Inbox size={20} />
              <span className="font-medium">Leads</span>
            </NavLink>
          )}
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
        
        {/* Desktop Header */}
        <header className="hidden md:flex bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 px-8 py-4 justify-between items-center sticky top-0 z-10 transition-colors duration-500">
            <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
                    {getGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">{currentUser?.name?.split(' ')[0] || 'User'}</span> 👋
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300 mt-0.5">Here's what's happening with your account today.</p>
            </div>
            
            <div className="flex items-center gap-6">
                 {/* Search (Mock) */}
                 <div className="hidden lg:flex items-center bg-gray-100 dark:bg-gray-700/50 rounded-full px-4 py-2 w-64 border border-transparent focus-within:border-indigo-300 dark:focus-within:border-indigo-500 focus-within:bg-white dark:focus-within:bg-gray-800 transition-all duration-300">
                    <Search size={18} className="text-gray-400 dark:text-gray-500" />
                    <input type="text" placeholder="Search..." className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-600" />
                 </div>

                 {/* Dark Mode Toggle */}
                 <button 
                    onClick={toggleTheme}
                    className="relative p-2 text-gray-400 hover:text-indigo-600 dark:text-gray-500 dark:hover:text-yellow-400 transition-colors duration-300 rounded-full hover:bg-indigo-50 dark:hover:bg-gray-700 z-50 overflow-hidden"
                    title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                 >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                 </button>

                 {/* Notification Bell */}
                 <div className="relative" ref={notificationRef}>
                     <button 
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 text-gray-400 hover:text-indigo-600 dark:text-gray-500 dark:hover:text-indigo-400 transition-colors duration-300 rounded-full hover:bg-indigo-50 dark:hover:bg-gray-700 outline-none"
                     >
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-800 ring-1 ring-white dark:ring-gray-800 animate-pulse"></span>
                        )}
                        <Bell size={20} />
                     </button>

                     {/* Notification Dropdown */}
                     {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-700/30">
                                <h3 className="font-semibold text-gray-800 dark:text-white">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button onClick={markAllAsRead} className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 font-medium hover:underline">
                                        Mark all read
                                    </button>
                                )}
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center text-gray-400 dark:text-gray-500 text-sm">
                                        No notifications yet
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                        {notifications.map(notification => (
                                            <div 
                                                key={notification.id} 
                                                onClick={() => handleNotificationClick(notification)}
                                                className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${!notification.is_read ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}
                                            >
                                                <div className="flex gap-3">
                                                    <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${!notification.is_read ? 'bg-indigo-500' : 'bg-transparent'}`}></div>
                                                    <div>
                                                        <h4 className={`text-sm font-medium text-gray-800 dark:text-gray-200 ${!notification.is_read ? 'font-semibold' : ''}`}>
                                                            {notification.title}
                                                        </h4>
                                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                                            {notification.message}
                                                        </p>
                                                        <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-2 block">
                                                            {new Date(notification.created_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                     )}
                 </div>

                 <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 transition-colors duration-300"></div>

                 {/* User Profile */}
                 <div className="flex items-center gap-3 pl-2 cursor-pointer group">
                    <div className="text-right hidden xl:block">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">{currentUser?.name || 'User'}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{currentUser?.role}</p>
                    </div>
                     {currentUser?.picture ? (
                        <img
                            src={getImageUrl(currentUser.picture)}
                            alt="Profile"
                            className="w-10 h-10 rounded-full object-cover border-2 border-indigo-100 dark:border-gray-600 shadow-sm group-hover:shadow-md transition-all duration-300 ring-2 ring-transparent group-hover:ring-indigo-50 dark:group-hover:ring-indigo-900/30"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
                             {currentUser?.name?.[0] || 'U'}
                        </div>
                    )}
                 </div>
            </div>
        </header>

        {/* Mobile Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm md:hidden p-4 flex justify-between items-center z-20 relative transition-colors duration-500">
             <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">CarMarket</h1>
             <div className="flex items-center gap-4">
                 <button 
                    onClick={toggleTheme}
                    className="text-gray-600 dark:text-gray-300"
                 >
                    {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                 </button>
                 <button onClick={handleLogout}><LogOut size={20} className="text-gray-600 dark:text-gray-300" /></button>
             </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
          <Outlet />
        </main>
      </div>


    </div>
  );
};

export default DashboardLayout;

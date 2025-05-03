import { MoreVertical, Home, User, Sprout, CheckSquare, ClipboardList, Bell, LogOut } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutDriver } from "../../handlers/driverauthHandler";

export default function Sidebar({ children, user }) {
  const navigate = useNavigate();

  const sidebarItems = [
    { icon: <Home />, text: "Dashboard", path: "/drivers/dashboard" },
    { icon: <ClipboardList />, text: "Delivery Requests", path: "/drivers/delivery-requests" },
    { icon: <CheckSquare />, text: "Accepted Requests", path: "/drivers/accepted-requests" },
    { icon: <User />, text: "Profile", path: "/drivers/profile" },
    { icon: <Bell />, text: "Notifications", path: "/drivers/notifications", alert: true },
    { icon: <LogOut />, text: "Logout", path: "#logout" },
  ];

  return (
    <aside className="h-screen fixed top-0 left-0 z-50">
      <nav className="h-full flex flex-col bg-black border-r shadow-sm w-64">
        <div className="p-4 pb-2 flex items-center">
          <Sprout className="h-8 w-8 text-green-500" />
          <span className="text-white text-xl font-bold ml-3">Freshly.lk</span>
        </div>

        <ul className="flex-1 px-3">
          {sidebarItems.map((item, index) => (
            <SidebarItem 
              key={index} 
              icon={item.icon}
              text={item.text}
              path={item.path}
              alert={item.alert}
              navigate={navigate}
            />
          ))}
          {children}
        </ul>

        <div className="border-t border-white/10 flex p-3">
          <img
            src="https://ui-avatars.com/api/?background=22c55e&color=ffffff&bold=true"
            alt=""
            className="w-10 h-10 rounded-md"
          />
          <div className="flex justify-between items-center w-52 ml-3">
            <div className="leading-4">
              <h4 className="font-semibold text-white">{user?.name || 'Driver'}</h4>
              <span className="text-xs text-white/60">{user?.email || 'email@example.com'}</span>
            </div>
            <MoreVertical size={20} className="text-white/60" />
          </div>
        </div>
      </nav>
    </aside>
  );
}

function SidebarItem({ icon, text, path, alert, navigate }) {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleClick = (e) => {
    if (path === "#logout") {
      e.preventDefault();
      setIsLogoutDialogOpen(true);
    }
  };

  const confirmLogout = async () => {
    console.log('Confirming logout...');
    await logoutDriver(navigate);
    setIsLogoutDialogOpen(false);
  };

  return (
    <>
      <NavLink
        to={path}
        onClick={handleClick}
        className={({ isActive }) => `
          relative flex items-center py-2 px-3 my-1
          font-medium rounded-md cursor-pointer
          transition-colors group
          ${
            isActive
              ? "bg-green-400 text-white"
              : "hover:bg-green-400 text-white"
          }
        `}
      >
        {icon}
        <span className="w-52 ml-3">{text}</span>
        {alert && (
          <div className="absolute right-2 w-2 h-2 rounded bg-green-500" />
        )}
      </NavLink>

      {isLogoutDialogOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Are you sure you want to logout?</h2>
            <p className="mb-6 text-gray-600">You will be redirected to the login page.</p>
            <div className="flex justify-end space-x-2">
              <button 
                onClick={() => setIsLogoutDialogOpen(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button 
                onClick={confirmLogout}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
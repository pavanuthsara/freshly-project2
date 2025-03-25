import { MoreVertical, ChevronLast, ChevronFirst, Home, User, Sprout, Truck, CheckSquare, ClipboardList, Bell } from "lucide-react"
import { useContext, createContext, useState } from "react"
import { NavLink } from "react-router-dom"

const SidebarContext = createContext()

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true)

  const sidebarItems = [
    { icon: <Home />, text: "Dashboard", path: "/drivers/dashboard" },
    { icon: <ClipboardList />, text: "Delivery Requests", path: "/drivers/delivery-requests" },
    { icon: <CheckSquare />, text: "Accepted Requests", path: "/drivers/accepted-requests" },
    { icon: <User />, text: "Profile", path: "/drivers/profile" },
    { icon: <Bell />, text: "Notifications", path: "/drivers/notifications", alert: true },
  ];
  
  return (
    <aside className="flex h-screen">
      <nav className="h-full flex flex-col bg-black border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-between items-center">
          {expanded && (
            <>
              <Sprout className="h-8 w-8 text-green-500" />
              <span className="text-white text-xl font-bold ml-3">
                Freshly.lk
              </span>
            </>
          )}
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-green-500 hover:bg-green-600 text-white"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">
            {sidebarItems.map((item, index) => (
              <SidebarItem 
                key={index} 
                icon={item.icon}
                text={item.text}
                path={item.path}
                alert={item.alert}
              />
            ))}
            
            {children}
          </ul>
        </SidebarContext.Provider>

        <div className="border-t border-white/10 flex p-3">
          <img
            src="https://ui-avatars.com/api/?background=22c55e&color=ffffff&bold=true"
            alt=""
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
          >
            <div className="leading-4">
              <h4 className="font-semibold text-white">Yasitha Ransilu</h4>
              <span className="text-xs text-white/60">yasitha5718@gmail.com</span>
            </div>
            <MoreVertical size={20} className="text-white/60" />
          </div>
        </div>
      </nav>
    </aside>
  )
}

export function SidebarItem({ icon, text, path, alert }) {
  const { expanded } = useContext(SidebarContext)
  
  return (
    <NavLink
      to={path}
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
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-52 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-green-500 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}

      {!expanded && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-green-500 text-white text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
        >
          {text}
        </div>
      )}
    </NavLink>
  )
}
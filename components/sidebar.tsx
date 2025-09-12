import { BarChart3, ChevronRight, Users, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

function Sidebar() {
  const pathname = usePathname();
  const activeMenu = pathname.split("/")[1];
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
    },
    {
      id: "influencers",
      label: "Influencers",
      icon: Users,
    },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div
      className={`transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}
    >
      {/* Toggle Button */}
      <div className="flex justify-end items-center p-4">
        <button
          onClick={toggleSidebar}
          className="text-white hover:bg-gray-500 p-2 rounded-lg transition-colors duration-200"
        >
          {isCollapsed ? (
            <Menu className="w-5 h-5" />
          ) : (
            <X className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="">
        <div className="font-bold text-2xl px-6">
          {isCollapsed ? "S" : "shotzspot"}
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              href={`/${item.id}`}
              key={item.id}
              className={`w-full flex items-center px-6 py-3 mt-2 text-left hover:bg-gray-500 transition-colors duration-200 ${
                activeMenu === item.id
                  ? "bg-yellow-50 border-r-2 border-yellow-500 text-yellow-600"
                  : "text-white"
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 ${
                  !isCollapsed ? "mr-3" : ""
                }`}
              />
              {!isCollapsed && (
                <>
                  <span className="font-medium">{item.label}</span>
                  {activeMenu === item.id && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default Sidebar;

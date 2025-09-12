// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { useAuth } from "@/contexts/auth-context"
// import { Instagram, RefreshCw, User, LogOut, Settings, Bell } from "lucide-react"
// import Link from "next/link"
// import type { User as UserType } from "@/lib/auth-api"

// interface DashboardHeaderProps {
//   user: UserType | null
//   onRefresh: () => void
// }

// export function DashboardHeader({ user, onRefresh }: DashboardHeaderProps) {
//   const [refreshing, setRefreshing] = useState(false)
//   const { logout } = useAuth()

//   const handleRefresh = async () => {
//     setRefreshing(true)
//     await onRefresh()
//     setTimeout(() => setRefreshing(false), 1000)
//   }

//   const handleLogout = async () => {
//     await logout()
//   }

//   return (
//     <header className="bg-[#1a1a2e]  border-gray-700 backdrop-blur-sm sticky top-0 z-50">
//       <div className="mx-auto px-6 py-4">
//         <div className="flex items-center justify-between">

//           <div className="flex items-center space-x-3">
//             {/* Refresh Button */}

//             {/* User Menu */}
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button
//                   variant="ghost"
//                   className="flex items-center space-x-2 text-gray-300 hover:text-white hover:bg-gray-700"
//                 >
//                   <div className="w-8 h-8 bg-gradient-to-tr from-yellow-500 to-orange-400 rounded-full flex items-center justify-center">
//                     <User className="w-4 h-4 text-white" />
//                   </div>
//                   <div className="hidden md:block text-left">
//                     <p className="text-sm font-medium">{user?.username || "User"}</p>
//                     <p className="text-xs text-gray-400">{user?.email}</p>
//                   </div>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-56 bg-gray-800 border-gray-700">
//                 <DropdownMenuLabel className="text-gray-200">My Account</DropdownMenuLabel>
//                 <DropdownMenuSeparator className="bg-gray-700" />
//                 <DropdownMenuItem asChild className="text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer">
//                   <Link href="/profile" className="flex items-center">
//                     <User className="w-4 h-4 mr-2" />
//                     Profile
//                   </Link>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem className="text-gray-300 hover:bg-gray-700 hover:text-white cursor-pointer">
//                   <Settings className="w-4 h-4 mr-2" />
//                   Settings
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator className="bg-gray-700" />
//                 <DropdownMenuItem
//                   onClick={handleLogout}
//                   className="text-red-400 hover:bg-red-900/20 hover:text-red-300 cursor-pointer"
//                 >
//                   <LogOut className="w-4 h-4 mr-2" />
//                   Sign Out
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </div>
//         </div>
//       </div>
//     </header>
//   )
// }

'use client'
import React, { useState } from "react";
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"
import { Instagram, RefreshCw, User, LogOut, Settings, Bell } from "lucide-react"
import Link from "next/link"
import type { User as UserType } from "@/lib/auth-api"

function Header({title, onRefresh}:any) {
    const [refreshing, setRefreshing] = useState(false)
  const { logout } = useAuth()

  const handleRefresh = async () => {
    setRefreshing(true)
    await onRefresh()
    setTimeout(() => setRefreshing(false), 1000)
  }

  const handleLogout = async () => {
    await logout()
  }
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          {title} Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-4">
       <div></div>

       

        <Button
          onClick={onRefresh}
          disabled={refreshing}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6"
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>
    </div>
  );
}

export default Header;

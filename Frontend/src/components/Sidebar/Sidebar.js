'use client'

import { useState } from 'react'
import { Button } from "../../components/ui/button"
import { cn } from "../../lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { MenuIcon, XIcon, HomeIcon, InboxIcon, UsersIcon, SettingsIcon, ChevronLeftIcon, ChevronRightIcon, UserIcon, LogOutIcon, BotIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function Sidebar(props) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(true)

  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen)
  const toggleDesktopSidebar = () => setIsDesktopExpanded(!isDesktopExpanded)

  const navItems = [
    { icon: <HomeIcon className="h-5 w-5 sm:w-7 sm:h-9" />, label: 'Dashboard', href: '/portal/dashboard' },
    { icon: <InboxIcon className="h-5 w-5 sm:w-7 sm:h-9" />, label: 'Assigments', href: '/portal/assignment' },
    { icon: <UsersIcon className="h-5 w-5 sm:w-7 sm:h-9" />, label: 'Feedback', href: '/portal/feedback' },
    { icon: <BotIcon className="h-5 w-5 sm:w-7 sm:h-9" />, label: 'Tracking', href: '/portal/tracking' },
    { icon: <SettingsIcon className="h-5 w-5 sm:w-7 sm:h-9" />, label: 'Profile', href: '/portal/profile' },
  ]

  return (
    <div className="flex h-screen ">
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-56 bg-white shadow-lg transform transition-all duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0",
          isDesktopExpanded ? "md:w-64" : "md:w-20"
        )}
      >
        <div className="flex items-center justify-between p-4">
          <h2 className={cn("text-2xl font-semibold", !isDesktopExpanded && "md:hidden")}>Menu</h2>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileSidebar}
          >
            <XIcon className="h-6 w-6" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        <nav className="mt-8">
          <ul className="space-y-2">
            {navItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100",pathname.includes(item.href) && "bg-slate-100 border-l-[5px] border-gray-700 shadow-md",
                    !isDesktopExpanded && "md:justify-center"
                  )}
                >
                  {item.icon}
                  <span className={cn("ml-3 sm:ml-4 sm:text-xl tracking-wide", !isDesktopExpanded && "md:hidden")}>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-4 right-4 hidden md:flex"
          onClick={toggleDesktopSidebar}
        >
          {isDesktopExpanded ? <ChevronLeftIcon className="h-6 w-6" /> : <ChevronRightIcon className="h-6 w-6" />}
          <span className="sr-only">
            {isDesktopExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
          </span>
        </Button>
      </div>
      <div className={cn("flex-1", isDesktopExpanded ? "md:ml-64" : "md:ml-20")}>
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={toggleMobileSidebar}
              >
                <MenuIcon className="h-6 w-6" />
                <span className="sr-only">Open sidebar</span>
              </Button>
              <h1 className="text-2xl font-bold capitalize ml-2">{pathname.split('/')[2]}</h1>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <UserIcon className="h-6 w-6" />
                  <span className="sr-only">Open user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="">
          {props.content}
        </main>
      </div>
    </div>
  )
}
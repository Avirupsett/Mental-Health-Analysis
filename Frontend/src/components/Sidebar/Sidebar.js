'use client'

import { useEffect, useState } from 'react'
import { Button } from "../../components/ui/button"
import { cn } from "../../lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import { MenuIcon, XIcon, HomeIcon, InboxIcon, UsersIcon, SettingsIcon, ChevronLeftIcon, ChevronRightIcon, UserIcon, LogOutIcon, BotIcon, FileChartColumnIncreasingIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { toast } from 'sonner';
import logo from '../../../public/logo.png'
import { useTransitionRouter,Link } from 'next-view-transitions'

export default function Sidebar(props) {
  const router = useTransitionRouter()
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isDesktopExpanded, setIsDesktopExpanded] = useState(true)

  const toggleMobileSidebar = () => setIsMobileOpen(!isMobileOpen)
  const toggleDesktopSidebar = () => setIsDesktopExpanded(!isDesktopExpanded)

  useEffect(() => {
    const handleResize = () => {
      setIsDesktopExpanded(window.innerWidth >= 850 ? true : false)
    }

    // Set initial state
    handleResize()

    // Add event listener
    window.addEventListener('resize', handleResize)

    // Clean up
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const navItems = [
    { icon: <HomeIcon className="h-5 w-5 sm:w-7 sm:h-9" />, label: 'Dashboard', href: '/portal/dashboard' },
    { icon: <InboxIcon className="h-5 w-5 sm:w-7 sm:h-9" />, label: 'Assigments', href: '/portal/assignment' },
    { icon: <UsersIcon className="h-5 w-5 sm:w-7 sm:h-9" />, label: 'Feedback', href: '/portal/feedback' },
    { icon: <BotIcon className="h-5 w-5 sm:w-7 sm:h-9" />, label: 'Tracking', href: '/portal/tracking' },
    { icon: <FileChartColumnIncreasingIcon className="h-5 w-5 sm:w-7 sm:h-9" />, label: 'Report', href: '/portal/report' },
    { icon: <SettingsIcon className="h-5 w-5 sm:w-7 sm:h-9" />, label: 'Profile', href: '/portal/profile' },
  ]

  const handleLogout = () => {
    // Delete cookie
    props.signOut()
    toast.success('Logged out successfully')
  }

  if(props.user===null){
     router.refresh()
  }

  return (
    <div className="h-screen">
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-56 bg-white shadow-lg transform transition-all duration-300 ease-in-out",
          isMobileOpen ? "translate-x-0" : "-translate-x-full",
          "md:translate-x-0",
          isDesktopExpanded ? "md:w-64" : "md:w-20"
        )}
      >
        <div className="flex items-center justify-between p-4">
          <h2 className={cn("text-2xl font-semibold", !isDesktopExpanded && "md:hidden")}>
            
            <Link href='/' className="flex justify-center items-center">
              <Image src={logo} alt="logo" width={35} height={35} className="cursor-pointer mr-0.5  md:w-[38px] md:h-[38px] sm:mr-2" />
              <div className='text-2xl tracking-wide font-mono text-center text-light-secondary font-bold ml-2'>Men<span className='text-light-heading font-normal'>trix</span></div>
            </Link>
          </h2>
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
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-2 ml-1 text-gray-700 hover:bg-gray-100", pathname.includes(item.href) && "bg-slate-100 rounded  border-l-[5px] border-gray-700 shadow-sm",
                    !isDesktopExpanded && "md:justify-center"
                  )}
                >
                  {item.icon}
                  <span className={cn("ml-3 sm:ml-4 sm:text-xl tracking-wide", !isDesktopExpanded && "md:hidden")}>{item.label}</span>
                </Link>
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
          <div className="flex items-center justify-between p-2 px-3">
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
                <Button className="bg-purple-100 h-11 w-11 rounded-full hover:bg-purple-200 mr-2 border-purple-600 border-2 cursor-pointer" size="icon">
                  <span className="text-lg font-bold text-purple-600">{(props.user.firstName!==null?props.user.firstName.charAt(0).toUpperCase():'') + (props.user.lastName!==null?props.user.lastName.charAt(0).toUpperCase():'')}</span>
                  <span className="sr-only">Open user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="flex items-center justify-between hover:!bg-transparent">
                {props.user.profilePictureUrl && <Image src={props.user.profilePictureUrl} alt="user" width={35} height={35} className="rounded-full mr-3" />}
                  <div className="flex flex-col items-start">
                    <span className="font-semibold">{props.user.firstName!==null?props.user.firstName:''} {props.user.lastName!==null?props.user.lastName:''}</span>
                    <span className="text-sm text-gray-500">{props.user.email}</span>
                  </div>
                </DropdownMenuItem>
                {/* <DropdownMenuSeparator /> */}
                {/* <DropdownMenuItem className="cursor-pointer">
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  <button type="submit">Log out</button>
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
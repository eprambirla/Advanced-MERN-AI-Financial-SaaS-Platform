import { LogOut } from "lucide-react"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "../ui/avatar"
  import { Button } from "../ui/button"
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
        DropdownMenuTrigger,
  } from "../ui/dropdown-menu"
  import { cn } from "@/lib/utils"
  
export function UserNav({
  userName,
  profilePicture,
  onLogout,
  showName,
}: {
  userName: string;
  profilePicture: string;
  onLogout: () => void;
  showName?: boolean;
}) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "relative !bg-transparent h-8 rounded-lg !gap-2 hover:!bg-gray-100 dark:hover:!bg-gray-800",
            showName ? "w-full justify-start px-2" : "!w-auto !rounded-full !px-0"
          )}
        >
          <Avatar className={cn("h-10 w-10 !cursor-pointer", showName && "h-8 w-8")}>
            <AvatarImage
              src={profilePicture || ""}
              className="!cursor-pointer "
            />
            <AvatarFallback
              className="!bg-[var(--secondary-dark-color)] border !border-gray-700
               !text-white"
            >
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {showName && (
            <div className="flex flex-col items-start flex-1 min-w-0">
              <span className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">
                {userName}
              </span>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 !bg-[var(--secondary-dark-color)] !text-white
         !border-gray-700
        "
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="flex flex-col items-start gap-1">
          <span className="font-semibold">{userName}</span>
            <span className="text-[13px] text-gray-400 font-light">Free Trial (2 days left)</span>
           </DropdownMenuLabel>
           <DropdownMenuSeparator className="!bg-gray-700" />
           <DropdownMenuGroup>
          <DropdownMenuItem className="hover:!bg-gray-800 hover:!text-white"
          onClick={onLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Log out
          </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
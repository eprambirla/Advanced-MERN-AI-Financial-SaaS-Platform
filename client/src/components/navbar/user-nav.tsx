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
  import { useOptimizedImage } from "@/hooks/use-optimized-image"

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
    const optimizedImage = useOptimizedImage(profilePicture, {
      width: showName ? 32 : 40,
      height: showName ? 32 : 40,
      quality: "auto:best",
      format: "webp",
      crop: "fill",
      gravity: "face",
    });

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "relative h-8 rounded-lg gap-2 hover:bg-accent",
            showName ? "w-full justify-start px-2" : "w-auto rounded-full px-0"
          )}
        >
          <Avatar className={cn("h-10 w-10 cursor-pointer", showName && "h-8 w-8")}>
            <AvatarImage
              src={optimizedImage || ""}
              className="cursor-pointer"
            />
            <AvatarFallback className="bg-primary text-primary-foreground">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {showName && (
            <div className="flex flex-col items-start flex-1 min-w-0">
              <span className="text-sm font-medium truncate text-foreground">
                {userName}
              </span>
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-card border-border"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="flex flex-col items-start gap-1">
          <span className="font-semibold text-foreground">{userName}</span>
            </DropdownMenuLabel>
           <DropdownMenuSeparator className="bg-border" />
           <DropdownMenuGroup>
          <DropdownMenuItem
            className="hover:bg-accent cursor-pointer"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4 mr-2 text-foreground" />
            <span className="text-foreground">Log out</span>
          </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
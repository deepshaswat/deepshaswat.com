"use client";

import "@repo/ui/styles.css";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  SidebarGroup,
  Separator,
  NavMain,
  NavProjects,
  NavUser,
} from "@repo/ui";
import {
  Home,
  FileText,
  Tag,
  Users,
  BarChart3,
  Lightbulb,
  Calendar,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

function getPageTitle(pathname: string): string {
  const routes: Record<string, string> = {
    "/": "Dashboard",
    "/ideas": "Ideas",
    "/ideas/new-status": "New Ideas",
    "/ideas/in-progress": "In Progress",
    "/ideas/draft-created": "Draft Created",
    "/ideas/archived": "Archived Ideas",
    "/posts": "Posts",
    "/new-post": "New Post",
    "/drafts": "Drafts",
    "/scheduled-posts": "Scheduled",
    "/published": "Published",
    "/newsletters": "Newsletters",
    "/calendar": "Calendar",
    "/tags": "Tags",
    "/members": "Members",
    "/analytics": "Analytics",
  };

  // Check for exact match first
  if (routes[pathname]) {
    return routes[pathname];
  }

  // Check for dynamic routes
  if (pathname.startsWith("/ideas/") && pathname.split("/").length === 3) {
    return "Edit Idea";
  }
  if (pathname.startsWith("/editor/")) {
    return "Edit Post";
  }
  if (pathname.startsWith("/members/")) {
    return "Member Details";
  }
  if (pathname.startsWith("/tags/")) {
    return "Edit Tag";
  }

  return "Admin";
}

const navMainItems = [
  {
    title: "Ideas",
    url: "/ideas",
    icon: Lightbulb,
    items: [
      { title: "All Ideas", url: "/ideas" },
      { title: "New Ideas", url: "/ideas/new-status" },
      { title: "In Progress", url: "/ideas/in-progress" },
      { title: "Draft Created", url: "/ideas/draft-created" },
      { title: "Archived", url: "/ideas/archived" },
    ],
  },
  {
    title: "Posts",
    url: "/posts",
    icon: FileText,
    items: [
      { title: "All Posts", url: "/posts" },
      { title: "New Post", url: "/new-post" },
      { title: "Drafts", url: "/drafts" },
      { title: "Scheduled", url: "/scheduled-posts" },
      { title: "Published", url: "/published" },
      { title: "Newsletters", url: "/newsletters" },
    ],
  },
  {
    title: "Calendar",
    url: "/calendar",
    icon: Calendar,
  },
];

const navProjectItems = [
  { name: "Tags", url: "/tags", icon: Tag },
  { name: "Members", url: "/members", icon: Users },
  { name: "Analytics", url: "/analytics", icon: BarChart3 },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild size="lg">
                <Link href="/">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Home className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Admin</span>
                    <span className="truncate text-xs">deepshaswat.com</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/"}
                  tooltip="Dashboard"
                >
                  <Link href="/">
                    <LayoutDashboard className="size-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <NavMain items={navMainItems} />
          <NavProjects projects={navProjectItems} />
        </SidebarContent>
        <SidebarFooter>
          <NavUser />
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 border-b border-border">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator className="mr-2 h-4" orientation="vertical" />
            <span className="text-sm font-medium">{pageTitle}</span>
          </div>
        </header>
        <div className="flex-1 h-full overflow-y-auto bg-background">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

"use client";

import * as React from "react";
import {
  FileText,
  Plus,
  PencilLine,
  CalendarCheck2,
  BookCheck,
  Newspaper,
  Tag,
  Users,
  BarChart3,
  Home,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
} from "../../ui/sidebar";
import { NavMain, type NavMainItem } from "./nav-main";
import { NavProjects, type NavProjectItem } from "./nav-projects";
import { NavUser } from "./nav-user";

const navMainItems: NavMainItem[] = [
  {
    title: "Posts",
    url: "/posts",
    icon: FileText,
  },
];

const navProjectItems: NavProjectItem[] = [
  { name: "Tags", url: "/tags", icon: Tag },
  { name: "Members", url: "/members", icon: Users },
  { name: "Analytics", url: "/analytics", icon: BarChart3 },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
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
  );
}

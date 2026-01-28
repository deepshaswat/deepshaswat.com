"use client";

import { Card, CardContent, CardHeader, CardTitle, Button } from "@repo/ui";
import {
  Plus,
  FileText,
  Tags,
  Users,
  BarChart3,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";

const actions = [
  {
    title: "New Post",
    icon: Plus,
    href: "/new-post",
    variant: "default" as const,
  },
  {
    title: "Ideas",
    icon: Lightbulb,
    href: "/ideas",
    variant: "outline" as const,
  },
  {
    title: "All Posts",
    icon: FileText,
    href: "/posts",
    variant: "outline" as const,
  },
  {
    title: "Tags",
    icon: Tags,
    href: "/tags",
    variant: "outline" as const,
  },
  {
    title: "Members",
    icon: Users,
    href: "/members",
    variant: "outline" as const,
  },
  {
    title: "Analytics",
    icon: BarChart3,
    href: "/analytics",
    variant: "outline" as const,
  },
];

export function QuickActions(): JSX.Element {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link href={action.href} key={action.title}>
                <Button size="sm" variant={action.variant}>
                  <Icon className="h-4 w-4 mr-2" />
                  {action.title}
                </Button>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

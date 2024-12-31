"use client";

import * as React from "react";
import { Drawer as DrawerPrimitive } from "vaul";

import { cn } from "@repo/ui/utils";

const Drawer = ({
  shouldScaleBackground = true,
  ...props
}: React.ComponentProps<typeof DrawerPrimitive.Root>) => (
  <DrawerPrimitive.Root
    shouldScaleBackground={shouldScaleBackground}
    {...props}
  />
);
Drawer.displayName = "Drawer";

const DrawerTrigger: typeof DrawerPrimitive.Trigger = DrawerPrimitive.Trigger;

const DrawerPortal: typeof DrawerPrimitive.Portal = DrawerPrimitive.Portal;

const DrawerClose: typeof DrawerPrimitive.Close = DrawerPrimitive.Close;

type OverlayProps = React.ComponentPropsWithoutRef<
  typeof DrawerPrimitive.Overlay
>;
type OverlayRef = React.ElementRef<typeof DrawerPrimitive.Overlay>;

const DrawerOverlay: React.ForwardRefExoticComponent<
  OverlayProps & React.RefAttributes<OverlayRef>
> = React.forwardRef<OverlayRef, OverlayProps>(
  ({ className, ...props }, ref) => (
    <DrawerPrimitive.Overlay
      ref={ref}
      className={cn("fixed inset-0 z-50 bg-black/80", className)}
      {...props}
    />
  ),
);
DrawerOverlay.displayName = DrawerPrimitive.Overlay.displayName;

type ContentProps = React.ComponentPropsWithoutRef<
  typeof DrawerPrimitive.Content
>;
type ContentRef = React.ElementRef<typeof DrawerPrimitive.Content>;

const DrawerContent: React.ForwardRefExoticComponent<
  ContentProps & React.RefAttributes<ContentRef>
> = React.forwardRef<ContentRef, ContentProps>(
  ({ className, children, ...props }, ref) => (
    <DrawerPortal>
      <DrawerOverlay />
      <DrawerPrimitive.Content
        ref={ref}
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 mt-24 flex h-auto flex-col rounded-t-[10px] border bg-background",
          className,
        )}
        {...props}
      >
        <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
        {children}
      </DrawerPrimitive.Content>
    </DrawerPortal>
  ),
);
DrawerContent.displayName = "DrawerContent";

const DrawerHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("grid gap-1.5 p-4 text-center sm:text-left", className)}
    {...props}
  />
);
DrawerHeader.displayName = "DrawerHeader";

const DrawerFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    {...props}
  />
);
DrawerFooter.displayName = "DrawerFooter";

type TitleProps = React.ComponentPropsWithoutRef<typeof DrawerPrimitive.Title>;
type TitleRef = React.ElementRef<typeof DrawerPrimitive.Title>;

const DrawerTitle: React.ForwardRefExoticComponent<
  TitleProps & React.RefAttributes<TitleRef>
> = React.forwardRef<TitleRef, TitleProps>(({ className, ...props }, ref) => (
  <DrawerPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
));
DrawerTitle.displayName = DrawerPrimitive.Title.displayName;

type DescriptionProps = React.ComponentPropsWithoutRef<
  typeof DrawerPrimitive.Description
>;
type DescriptionRef = React.ElementRef<typeof DrawerPrimitive.Description>;

const DrawerDescription: React.ForwardRefExoticComponent<
  DescriptionProps & React.RefAttributes<DescriptionRef>
> = React.forwardRef<DescriptionRef, DescriptionProps>(
  ({ className, ...props }, ref) => (
    <DrawerPrimitive.Description
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  ),
);
DrawerDescription.displayName = DrawerPrimitive.Description.displayName;

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};

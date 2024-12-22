import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import * as RovingFocusPrimitive from "@radix-ui/react-roving-focus"
import { cn } from "@/lib/utils"
import { MenubarRoot } from "./menubar-root"
import { MenubarTrigger } from "./menubar-trigger"
import { MenubarContent } from "./menubar-content"
import { MenubarItem } from "./menubar-item"
import { MenubarCheckboxItem } from "./menubar-checkbox"
import { MenubarRadioGroup, MenubarRadioItem } from "./menubar-radio"
import { MenubarSub, MenubarSubContent, MenubarSubTrigger } from "./menubar-sub"
import { MenubarShortcut } from "./menubar-shortcut"

const MenubarMenu = MenubarPrimitive.Menu
const MenubarGroup = MenubarPrimitive.Group
const MenubarPortal = MenubarPrimitive.Portal
const RovingFocusGroup = RovingFocusPrimitive.Root

const MenubarSeparator = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
))
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName

const MenubarLabel = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <MenubarPrimitive.Label
    ref={ref}
    className={cn(
      "px-2 py-1.5 text-sm font-semibold",
      inset && "pl-8",
      className
    )}
    {...props}
  />
))
MenubarLabel.displayName = MenubarPrimitive.Label.displayName

export {
  MenubarMenu,
  MenubarGroup,
  MenubarPortal,
  MenubarSub,
  MenubarRadioGroup,
  RovingFocusGroup,
  MenubarRoot as Menubar,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioItem,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarShortcut,
}
import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import * as RovingFocusPrimitive from "@radix-ui/react-roving-focus"
import { cn } from "@/lib/utils"

const MenubarItem = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <RovingFocusPrimitive.Root>
    <MenubarPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  </RovingFocusPrimitive.Root>
))
MenubarItem.displayName = MenubarPrimitive.Item.displayName

export { MenubarItem }
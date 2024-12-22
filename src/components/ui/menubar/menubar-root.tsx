import * as React from "react"
import * as MenubarPrimitive from "@radix-ui/react-menubar"
import * as RovingFocusPrimitive from "@radix-ui/react-roving-focus"
import { cn } from "@/lib/utils"

const MenubarRoot = React.forwardRef<
  React.ElementRef<typeof MenubarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <MenubarPrimitive.Root
    ref={ref}
    className={cn(
      "flex h-10 items-center space-x-1 rounded-md border bg-background p-1",
      className
    )}
    {...props}
  >
    <RovingFocusPrimitive.Root asChild>
      {props.children}
    </RovingFocusPrimitive.Root>
  </MenubarPrimitive.Root>
))
MenubarRoot.displayName = MenubarPrimitive.Root.displayName

export { MenubarRoot }
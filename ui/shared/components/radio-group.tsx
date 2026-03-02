"use client"

import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { Circle, Square } from "lucide-react"
import { cn } from "../utils/utils"
import { Label } from "./label"

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> & {
    /** Optional label text. When provided, renders a Label component above the radio group. */
    label?: string
    /** Optional id for the radio group. If not provided, one will be generated. Useful for composition with Label component. */
    id?: string
  }
>(({ className, label, id: providedId, ...props }, ref) => {
  const generatedId = React.useId()
  const groupId = providedId ?? generatedId

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={groupId} className="mb-2">
          {label}
        </Label>
      )}
      <RadioGroupPrimitive.Root
        id={groupId}
        className={cn("grid gap-2", className)}
        {...props}
        ref={ref}
      />
    </div>
  )
})
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName

export interface RadioGroupItemProps extends React.ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive.Item
> {
  brand?: boolean
}

const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, style, brand = false, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "!cursor-pointer aspect-square h-4 w-4 !rounded-full border border-primary text-primary shadow transition-[background-color,border-color] duration-150 disabled:cursor-not-allowed disabled:opacity-50",
        brand && "border-accent-brand text-accent-brand",
        className
      )}
      style={style}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="!cursor-pointer flex items-center justify-center">
        <Circle className={cn("h-2.5 w-2.5 fill-primary", brand && "fill-accent-brand")} />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
})
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName

export { RadioGroup, RadioGroupItem }

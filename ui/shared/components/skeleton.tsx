import * as React from "react"
import { cn } from "../utils/utils"

function Skeleton({
  className,
  style,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-app-radius bg-muted", className)}
      style={style}
      {...props}
    />
  )
}

export { Skeleton }


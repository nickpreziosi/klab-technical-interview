"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  ColumnFiltersState,
  PaginationState,
  OnChangeFn,
  Updater,
  Column,
  Table as TanStackTable,
} from "@tanstack/react-table"
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"
import { cn } from "../utils/utils"
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table"
import { Skeleton } from "./skeleton"
import { Spinner } from "./spinner"

export type DataTableLoaderVariant = "skeleton" | "spinner"

export interface DataTableContextValue<TData, TValue> {
  table: TanStackTable<TData>
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  columnFilters: ColumnFiltersState
  loading?: boolean
  initialLoading?: boolean
  serverSide?: boolean
  pagination: PaginationState
  handleColumnSort?: (columnId: string) => void
  globalFilter: string
  setGlobalFilter: (value: string) => void
  /** Loading UI: "skeleton" (default) or "spinner". Spinner is better when no data may load. */
  loaderVariant?: DataTableLoaderVariant
}

export const DataTableContext = React.createContext<DataTableContextValue<unknown, unknown> | null>(
  null
)

function useDataTableContext<TData, TValue>() {
  const context = React.useContext(DataTableContext) as DataTableContextValue<TData, TValue> | null
  if (!context) {
    throw new Error(
      "DataTable subcomponents must be used within DataTableContainer or DataTableProvider"
    )
  }
  return context
}

// Public hook for composition-based approach
export function useDataTable<TData, TValue>() {
  return useDataTableContext<TData, TValue>()
}

interface DataTableContainerProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  /** Enable server-side pagination */
  serverSide?: boolean
  /** Total number of pages (required for server-side) */
  pageCount?: number
  /** Current pagination state (required for server-side) */
  pagination?: PaginationState
  /** Callback when pagination changes (required for server-side) */
  onPaginationChange?: OnChangeFn<PaginationState>
  /** Default page size (defaults to 10) */
  defaultPageSize?: number
  /** Loading state for server-side operations */
  loading?: boolean
  /** Initial loading state for client-side initial data fetch */
  initialLoading?: boolean
  /** Current sort state (for server-side sorting) */
  sort?: {
    column: string
    direction: "asc" | "desc" | null
  }
  /** Callback when sort changes (for server-side sorting) */
  onSortChange?: (column: string, direction: "asc" | "desc" | null) => void
  /** Enable three-state sorting (asc -> desc -> null) */
  enableThreeStateSort?: boolean
  /** Controlled column filters */
  columnFilters?: ColumnFiltersState
  /** Callback when column filters change */
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
  /** Controlled column visibility (Record<columnId, boolean>) */
  columnVisibility?: Record<string, boolean>
  /** Callback when column visibility changes */
  onColumnVisibilityChange?: OnChangeFn<Record<string, boolean>>
  /** Columns to search when using global filter (defaults to all columns) */
  globalFilterColumns?: string[]
  /** Loading UI: "skeleton" or "spinner" (default). Spinner works better when no data may load. */
  loaderVariant?: DataTableLoaderVariant
  children: React.ReactNode
  className?: string
}

export function DataTableContainer<TData, TValue>({
  columns,
  data,
  serverSide = false,
  pageCount,
  pagination: controlledPagination,
  onPaginationChange,
  defaultPageSize = 10,
  loading = false,
  initialLoading = false,
  sort: controlledSort,
  onSortChange,
  enableThreeStateSort = true,
  columnFilters: controlledColumnFilters,
  onColumnFiltersChange,
  columnVisibility: controlledColumnVisibility,
  onColumnVisibilityChange,
  globalFilterColumns,
  loaderVariant = "spinner",
  children,
  className,
}: DataTableContainerProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [internalColumnFilters, setInternalColumnFilters] = React.useState<ColumnFiltersState>([])
  const [internalColumnVisibility, setInternalColumnVisibility] = React.useState<
    Record<string, boolean>
  >({})
  const columnVisibility = controlledColumnVisibility ?? internalColumnVisibility
  const handleColumnVisibilityChange: OnChangeFn<Record<string, boolean>> = React.useCallback(
    (updaterOrValue) => {
      if (onColumnVisibilityChange) {
        onColumnVisibilityChange(updaterOrValue)
      } else {
        setInternalColumnVisibility((prev) =>
          typeof updaterOrValue === "function" ? updaterOrValue(prev) : updaterOrValue
        )
      }
    },
    [onColumnVisibilityChange]
  )
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [internalPagination, setInternalPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  })

  // Track if component is mounted to avoid state updates during render
  const isMountedRef = React.useRef(false)
  React.useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  const columnFilters = controlledColumnFilters ?? internalColumnFilters
  const pagination = controlledPagination ?? internalPagination

  // Handle pagination changes - support both direct values and updater functions
  const setPagination: OnChangeFn<PaginationState> = React.useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      if (onPaginationChange) {
        // Only call callback after component is mounted
        if (isMountedRef.current) {
          // Defer to avoid setState during render
          queueMicrotask(() => {
            if (isMountedRef.current) {
              onPaginationChange(updaterOrValue)
            }
          })
        }
      } else {
        const newPagination =
          typeof updaterOrValue === "function" ? updaterOrValue(internalPagination) : updaterOrValue
        setInternalPagination(newPagination)
      }
    },
    [onPaginationChange, internalPagination]
  )

  // Convert controlled sort to TanStack sorting state
  React.useEffect(() => {
    if (serverSide && controlledSort) {
      if (controlledSort.direction) {
        setSorting([
          {
            id: controlledSort.column,
            desc: controlledSort.direction === "desc",
          },
        ])
      } else {
        setSorting([])
      }
    }
  }, [serverSide, controlledSort])

  const handleSortingChange = React.useCallback(
    (updater: SortingState | ((old: SortingState) => SortingState)) => {
      setSorting((prevSorting) => {
        const newSorting = typeof updater === "function" ? updater(prevSorting) : updater

        if (serverSide && onSortChange) {
          // For server-side, notify parent of sort change (defer to avoid setState during render)
          // Only call callback after component is mounted
          if (isMountedRef.current) {
            queueMicrotask(() => {
              if (isMountedRef.current) {
                if (newSorting.length === 0) {
                  onSortChange("", null)
                } else {
                  const sort = newSorting[0]
                  onSortChange(sort.id, sort.desc ? "desc" : "asc")
                }
              }
            })
          }
        }

        return newSorting
      })
    },
    [serverSide, onSortChange]
  )

  // Custom sort handler for three-state sorting (asc -> desc -> null)
  const handleColumnSort = React.useCallback(
    (columnId: string) => {
      setSorting((prevSorting) => {
        const currentSort = prevSorting.find((s) => s.id === columnId)
        let newSorting: SortingState = []

        if (!currentSort) {
          // First click: ascending
          newSorting = [{ id: columnId, desc: false }]
        } else if (!currentSort.desc) {
          // Second click: descending
          newSorting = [{ id: columnId, desc: true }]
        } else {
          // Third click: unsort (empty array)
          newSorting = []
        }

        if (serverSide && onSortChange) {
          // For server-side, notify parent of sort change (defer to avoid setState during render)
          // Only call callback after component is mounted
          if (isMountedRef.current) {
            queueMicrotask(() => {
              if (isMountedRef.current) {
                if (newSorting.length === 0) {
                  onSortChange("", null)
                } else {
                  const sort = newSorting[0]
                  onSortChange(sort.id, sort.desc ? "desc" : "asc")
                }
              }
            })
          }
        }

        return newSorting
      })
    },
    [serverSide, onSortChange]
  )

  // Custom global filter function for multi-column search
  const globalFilterFn = React.useCallback(
    (row: { original: TData }, columnId: string, filterValue: string) => {
      if (!filterValue) return true

      try {
        const searchValue = filterValue.toLowerCase()
        const rowData = row.original as Record<string, unknown>

        // If specific columns are provided, search only those columns
        if (globalFilterColumns && globalFilterColumns.length > 0) {
          return globalFilterColumns.some((columnKey) => {
            try {
              const value = rowData[columnKey]
              if (value === null || value === undefined) return false
              return String(value).toLowerCase().includes(searchValue)
            } catch {
              return false
            }
          })
        }

        // Otherwise, search across all columns
        return Object.values(rowData).some((value) => {
          if (value === null || value === undefined) return false
          try {
            return String(value).toLowerCase().includes(searchValue)
          } catch {
            return false
          }
        })
      } catch (error) {
        console.error("Error in global filter:", error)
        return true // Include row if filter fails to prevent data loss
      }
    },
    [globalFilterColumns]
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(serverSide
      ? {
          manualPagination: true,
          pageCount: pageCount ?? -1,
          manualSorting: true,
        }
      : {
          getPaginationRowModel: getPaginationRowModel(),
          getSortedRowModel: getSortedRowModel(),
        }),
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: onColumnFiltersChange ?? setInternalColumnFilters,
    ...(serverSide
      ? {}
      : {
          getFilteredRowModel: getFilteredRowModel(),
          globalFilterFn,
        }),
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: handleColumnVisibilityChange,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
      globalFilter,
    },
  })

  const contextValue: DataTableContextValue<TData, TValue> = {
    table,
    columns,
    data,
    columnFilters,
    loading,
    initialLoading,
    serverSide,
    pagination,
    handleColumnSort: enableThreeStateSort ? handleColumnSort : undefined,
    globalFilter,
    setGlobalFilter,
    loaderVariant,
  }

  return (
    <DataTableContext.Provider value={contextValue as DataTableContextValue<unknown, unknown>}>
      <div className={cn("", className)}>{children}</div>
    </DataTableContext.Provider>
  )
}

DataTableContainer.displayName = "DataTableContainer"

// Provider component for using filters outside the container
export interface DataTableProviderProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  serverSide?: boolean
  pageCount?: number
  pagination?: PaginationState
  onPaginationChange?: OnChangeFn<PaginationState>
  /** Default page size (defaults to 10) */
  defaultPageSize?: number
  loading?: boolean
  initialLoading?: boolean
  sort?: {
    column: string
    direction: "asc" | "desc" | null
  }
  onSortChange?: (column: string, direction: "asc" | "desc" | null) => void
  enableThreeStateSort?: boolean
  columnFilters?: ColumnFiltersState
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>
  /** Columns to search when using global filter (defaults to all columns) */
  globalFilterColumns?: string[]
  /** Loading UI: "skeleton" or "spinner" (default) */
  loaderVariant?: DataTableLoaderVariant
  children: React.ReactNode
}

export function DataTableProvider<TData, TValue>({
  columns,
  data,
  serverSide = false,
  pageCount,
  pagination: controlledPagination,
  onPaginationChange,
  defaultPageSize = 10,
  loading = false,
  initialLoading = false,
  sort: controlledSort,
  onSortChange,
  enableThreeStateSort = true,
  columnFilters: controlledColumnFilters,
  onColumnFiltersChange,
  globalFilterColumns,
  loaderVariant = "spinner",
  children,
}: DataTableProviderProps<TData, TValue>) {
  // Reuse the same logic as DataTableContainer but without the wrapper div
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [internalColumnFilters, setInternalColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [internalPagination, setInternalPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: defaultPageSize,
  })

  const columnFilters = controlledColumnFilters ?? internalColumnFilters
  const pagination = controlledPagination ?? internalPagination

  const setPagination: OnChangeFn<PaginationState> = React.useCallback(
    (updaterOrValue: Updater<PaginationState>) => {
      if (onPaginationChange) {
        // Defer to avoid setState during render
        queueMicrotask(() => {
          onPaginationChange(updaterOrValue)
        })
      } else {
        const newPagination =
          typeof updaterOrValue === "function" ? updaterOrValue(internalPagination) : updaterOrValue
        setInternalPagination(newPagination)
      }
    },
    [onPaginationChange, internalPagination]
  )

  React.useEffect(() => {
    if (serverSide && controlledSort) {
      if (controlledSort.direction) {
        setSorting([
          {
            id: controlledSort.column,
            desc: controlledSort.direction === "desc",
          },
        ])
      } else {
        setSorting([])
      }
    }
  }, [serverSide, controlledSort])

  const handleSortingChange = React.useCallback(
    (updater: SortingState | ((old: SortingState) => SortingState)) => {
      setSorting((prevSorting) => {
        const newSorting = typeof updater === "function" ? updater(prevSorting) : updater

        if (serverSide && onSortChange) {
          queueMicrotask(() => {
            if (newSorting.length === 0) {
              onSortChange("", null)
            } else {
              const sort = newSorting[0]
              onSortChange(sort.id, sort.desc ? "desc" : "asc")
            }
          })
        }

        return newSorting
      })
    },
    [serverSide, onSortChange]
  )

  const handleColumnSort = React.useCallback(
    (columnId: string) => {
      setSorting((prevSorting) => {
        const currentSort = prevSorting.find((s) => s.id === columnId)
        let newSorting: SortingState = []

        if (!currentSort) {
          newSorting = [{ id: columnId, desc: false }]
        } else if (!currentSort.desc) {
          newSorting = [{ id: columnId, desc: true }]
        } else {
          newSorting = []
        }

        if (serverSide && onSortChange) {
          queueMicrotask(() => {
            if (newSorting.length === 0) {
              onSortChange("", null)
            } else {
              const sort = newSorting[0]
              onSortChange(sort.id, sort.desc ? "desc" : "asc")
            }
          })
        }

        return newSorting
      })
    },
    [serverSide, onSortChange]
  )

  const globalFilterFn = React.useCallback(
    (row: { original: TData }, columnId: string, filterValue: string) => {
      if (!filterValue) return true
      const searchValue = filterValue.toLowerCase()
      const rowData = row.original as Record<string, unknown>

      // If specific columns are provided, search only those columns
      if (globalFilterColumns && globalFilterColumns.length > 0) {
        return globalFilterColumns.some((columnKey) => {
          const value = rowData[columnKey]
          if (value === null || value === undefined) return false
          return String(value).toLowerCase().includes(searchValue)
        })
      }

      // Otherwise, search across all columns
      return Object.values(rowData).some((value) => {
        if (value === null || value === undefined) return false
        return String(value).toLowerCase().includes(searchValue)
      })
    },
    [globalFilterColumns]
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    ...(serverSide
      ? {
          manualPagination: true,
          pageCount: pageCount ?? -1,
          manualSorting: true,
        }
      : {
          getPaginationRowModel: getPaginationRowModel(),
          getSortedRowModel: getSortedRowModel(),
        }),
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: onColumnFiltersChange ?? setInternalColumnFilters,
    ...(serverSide
      ? {}
      : {
          getFilteredRowModel: getFilteredRowModel(),
          globalFilterFn,
        }),
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
      globalFilter,
    },
  })

  const contextValue: DataTableContextValue<TData, TValue> = {
    table,
    columns,
    data,
    columnFilters,
    loading,
    initialLoading,
    serverSide,
    pagination,
    handleColumnSort: enableThreeStateSort ? handleColumnSort : undefined,
    globalFilter,
    setGlobalFilter,
    loaderVariant,
  }

  return (
    <DataTableContext.Provider value={contextValue as DataTableContextValue<unknown, unknown>}>
      {children}
    </DataTableContext.Provider>
  )
}

DataTableProvider.displayName = "DataTableProvider"

// Utility functions for common filter patterns
/**
 * Extract unique values from a column in the table data
 * @throws {Error} If data is not an array or columnKey is invalid
 */
export function extractUniqueColumnValues<TData>(
  data: TData[],
  columnKey: string
): Array<{ label: string; value: string }> {
  if (!Array.isArray(data)) {
    throw new Error("extractUniqueColumnValues: data must be an array")
  }

  if (!columnKey || typeof columnKey !== "string") {
    throw new Error("extractUniqueColumnValues: columnKey must be a non-empty string")
  }

  if (data.length === 0) {
    return []
  }

  const uniqueValues = new Set<string>()
  try {
    data.forEach((row) => {
      if (row == null) return
      const rowData = row as Record<string, unknown>
      const cellValue = rowData[columnKey]
      if (cellValue != null && cellValue !== "") {
        uniqueValues.add(String(cellValue))
      }
    })
  } catch (error) {
    console.error("Error extracting unique column values:", error)
    return []
  }

  return Array.from(uniqueValues)
    .sort()
    .map((val) => ({ label: val, value: val }))
}

/**
 * Extract min and max numeric values from a column in the table data
 * @throws {Error} If data is not an array or columnKey is invalid
 */
export function extractNumericRange<TData>(
  data: TData[],
  columnKey: string,
  padding = 0.1
): [number, number] {
  if (!Array.isArray(data)) {
    throw new Error("extractNumericRange: data must be an array")
  }

  if (!columnKey || typeof columnKey !== "string") {
    throw new Error("extractNumericRange: columnKey must be a non-empty string")
  }

  if (data.length === 0) {
    return [0, 100]
  }

  let dataMin = Infinity
  let dataMax = -Infinity

  try {
    data.forEach((row) => {
      if (row == null) return
      const rowData = row as Record<string, unknown>
      const cellValue = rowData[columnKey]
      if (typeof cellValue === "number" && !isNaN(cellValue) && isFinite(cellValue)) {
        dataMin = Math.min(dataMin, cellValue)
        dataMax = Math.max(dataMax, cellValue)
      }
    })
  } catch (error) {
    console.error("Error extracting numeric range:", error)
    return [0, 100]
  }

  if (dataMin === Infinity || dataMax === -Infinity) {
    return [0, 100]
  }

  const rangePadding = (dataMax - dataMin) * padding || 1
  return [Math.floor(dataMin - rangePadding), Math.ceil(dataMax + rangePadding)]
}

// Table subcomponent
export type DataTableWrapperProps = React.HTMLAttributes<HTMLDivElement>

export const DataTableWrapper = React.forwardRef<HTMLDivElement, DataTableWrapperProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("rounded-app-radius border", className)} {...props}>
        {children}
      </div>
    )
  }
)
DataTableWrapper.displayName = "DataTableWrapper"

// Table header subcomponent
export type DataTableHeaderProps = React.ComponentProps<typeof TableHeader>

export const DataTableHeader = React.forwardRef<HTMLTableSectionElement, DataTableHeaderProps>(
  ({ className, children, ...props }, ref) => {
    const { table, loading, initialLoading } = useDataTableContext()
    const isLoading = loading || initialLoading

    return (
      <TableHeader ref={ref} className={className} {...props}>
        {children ??
          table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-background" role="row">
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort()
                const sortDirection = header.column.getIsSorted()
                const ariaSort =
                  sortDirection === "asc"
                    ? "ascending"
                    : sortDirection === "desc"
                      ? "descending"
                      : "none"

                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      canSort && !isLoading && "cursor-pointer select-none hover:bg-muted/50",
                      isLoading && "opacity-50",
                      canSort && "overflow-visible"
                    )}
                    role="columnheader"
                    aria-sort={canSort ? ariaSort : undefined}
                    scope="col"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
      </TableHeader>
    )
  }
)
DataTableHeader.displayName = "DataTableHeader"

// Loader subcomponent
export interface DataTableLoaderProps extends Omit<
  React.HTMLAttributes<HTMLTableRowElement>,
  "children"
> {
  /** Number of loader rows to render */
  rows?: number
  /** Render function that receives the row index, or a single React node for a single loader */
  children?: React.ReactNode | ((index: number) => React.ReactNode)
}

export const DataTableLoader = React.forwardRef<HTMLTableRowElement, DataTableLoaderProps>(
  ({ rows, className, children, ...props }, ref) => {
    const { columns, pagination, table } = useDataTableContext()
    const skeletonCount = rows ?? pagination.pageSize

    // Get visible columns to match actual column positioning
    const visibleColumns = React.useMemo(() => {
      if (table) {
        return table.getAllColumns().filter((col) => col.getIsVisible())
      }
      return columns
    }, [table, columns])

    // If children is a function, call it for each row
    if (typeof children === "function") {
      return (
        <>
          {Array.from({ length: skeletonCount }).map((_, index) => (
            <TableRow key={`loader-${index}`} ref={index === 0 ? ref : undefined} {...props}>
              {visibleColumns.map((column) => (
                <TableCell key={column.id || index} className={className}>
                  {children(index)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </>
      )
    }

    // If children is provided (single loader), render it once with full width
    if (children) {
      return (
        <TableRow ref={ref} {...props}>
          <TableCell colSpan={visibleColumns.length} className="p-0">
            <div className={cn("w-full", className)}>{children}</div>
          </TableCell>
        </TableRow>
      )
    }

    // Default: render skeleton rows that match row height and column widths
    return (
      <>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <TableRow
            key={`skeleton-${index}`}
            ref={index === 0 ? ref : undefined}
            className={className}
            {...props}
          >
            {visibleColumns.map((column, colIndex) => (
              <TableCell key={column.id || `skeleton-${index}-${colIndex}`} className="p-4">
                <Skeleton className="h-6 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </>
    )
  }
)
DataTableLoader.displayName = "DataTableLoader"

// Table body subcomponent
export interface DataTableBodyProps extends React.ComponentProps<typeof TableBody> {
  /** Custom empty state message */
  emptyMessage?: string
  /** Custom empty state component */
  emptyComponent?: React.ReactNode
  /** Custom row renderer function */
  renderRow?: (row: {
    id: string
    getVisibleCells: () => Array<{
      id: string
      column: { columnDef: ColumnDef<unknown, unknown> }
      getContext: () => unknown
    }>
    getIsSelected: () => boolean
  }) => React.ReactNode
}

export const DataTableBody = React.forwardRef<HTMLTableSectionElement, DataTableBodyProps>(
  ({ className, emptyMessage = "No results.", renderRow, children, ...props }, ref) => {
    const { table, columns, loading, initialLoading, loaderVariant = "spinner" } =
      useDataTableContext()
    const isLoading = loading || initialLoading

    // Filter children to separate loaders from data rows
    // Use a helper function to reliably detect DataTableLoader components
    const isDataTableLoader = (child: React.ReactNode): boolean => {
      if (!React.isValidElement(child)) return false
      const childType = child.type

      // Direct type match
      if (childType === DataTableLoader) return true

      // For forwardRef components, check displayName
      if (typeof childType === "object" && childType !== null) {
        const typeObj = childType as { displayName?: string }
        if (typeObj.displayName === "DataTableLoader") {
          return true
        }
      }

      // For function components
      if (typeof childType === "function") {
        const funcType = childType as { displayName?: string; name?: string }
        if (funcType.displayName === "DataTableLoader" || funcType.name === "DataTableLoader") {
          return true
        }
      }

      return false
    }

    const childrenArray = React.Children.toArray(children)
    const loaderChildren = childrenArray.filter(isDataTableLoader)
    const dataChildren = childrenArray.filter((child) => !isDataTableLoader(child))

    return (
      <TableBody ref={ref} className={className} {...props}>
        {isLoading ? (
          loaderChildren.length > 0 ? (
            loaderChildren
          ) : loaderVariant === "spinner" ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="py-12">
                <div className="flex justify-center">
                  <Spinner size="lg" className="text-orange-500" />
                </div>
              </TableCell>
            </TableRow>
          ) : (
            <DataTableLoader />
          )
        ) : dataChildren.length > 0 ? (
          dataChildren
        ) : table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => {
            if (renderRow) {
              return <React.Fragment key={row.id}>{renderRow(row)}</React.Fragment>
            }
            return (
              <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            )
          })
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    )
  }
)
DataTableBody.displayName = "DataTableBody"

// Table row subcomponent
export interface DataTableRowProps extends React.ComponentProps<typeof TableRow> {
  row?: {
    id: string
    getIsSelected: () => boolean
    getVisibleCells: () => Array<{
      id: string
      column: { columnDef: ColumnDef<unknown, unknown> }
      getContext: () => {
        cell: unknown
        column: unknown
        getValue: () => unknown
        renderValue: () => unknown
        row: unknown
        table: unknown
      }
    }>
  }
}

export const DataTableRow = React.forwardRef<HTMLTableRowElement, DataTableRowProps>(
  ({ row, className, children, ...props }, ref) => {
    if (row) {
      return (
        <TableRow
          ref={ref}
          key={row.id}
          data-state={row.getIsSelected() && "selected"}
          className={className}
          {...props}
        >
          {row.getVisibleCells().map((cell) => {
            // Type assertion is safe here because cell.getContext() returns the correct type
            // The interface uses unknown for flexibility, but at runtime the types are correct
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const context = cell.getContext() as any
            return (
              <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, context)}</TableCell>
            )
          })}
        </TableRow>
      )
    }
    return (
      <TableRow ref={ref} className={className} {...props}>
        {children}
      </TableRow>
    )
  }
)
DataTableRow.displayName = "DataTableRow"

// Sortable column header helper component
export interface SortableColumnHeaderProps<TData, TValue> {
  column: Column<TData, TValue>
  title: string
  className?: string
  onSortChange?: (columnId: string) => void
}

export function SortableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  onSortChange,
}: SortableColumnHeaderProps<TData, TValue>) {
  const context = React.useContext(DataTableContext) as DataTableContextValue<TData, TValue> | null
  const handleColumnSort = context?.handleColumnSort
  const sortHandler = onSortChange ?? handleColumnSort
  const sortDirection = column.getIsSorted()

  const getSortIcon = () => {
    if (sortDirection === "asc") {
      return (
        <ArrowDown className="ml-2 h-4 w-4 shrink-0 text-accent-brand" aria-hidden="true" />
      )
    }
    if (sortDirection === "desc") {
      return <ArrowUp className="ml-2 h-4 w-4 shrink-0 text-accent-brand" aria-hidden="true" />
    }
    return (
      <ArrowUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" aria-hidden="true" />
    )
  }

  const getAriaSort = (): "ascending" | "descending" | "none" => {
    if (sortDirection === "asc") return "ascending"
    if (sortDirection === "desc") return "descending"
    return "none"
  }

  const handleClick = () => {
    if (sortHandler) {
      sortHandler(column.id)
    } else {
      column.toggleSorting(column.getIsSorted() === "asc")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <button
      type="button"
      className={cn(
        "flex items-center w-full h-full py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 focus-visible:-m-[2px]",
        className
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={`Sort by ${title}. Current sort: ${getAriaSort()}`}
      tabIndex={0}
    >
      {title}
      {getSortIcon()}
    </button>
  )
}

// Table subcomponent

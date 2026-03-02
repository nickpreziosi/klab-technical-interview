"use client"

import * as React from "react"
import {
  ChevronDown,
  Plus,
  MoreHorizontal,
  DollarSign,
  TrendingUp,
  AlertCircle,
  FileText,
  Filter,
} from "lucide-react"
import { Button } from "@/ui/shared/components/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/ui/shared/components/dropdown-menu"
import { Badge } from "@/ui/shared/components/badge"
import { Card, CardContent } from "@/ui/shared/components/card"
import {
  DataCard,
  DataCardContent,
  DataCardLabel,
  DataCardValue,
  DataCardDescription,
} from "@/ui/shared/components/data-card"
import {
  DataTableContainer,
  DataTableWrapper,
  DataTableHeader,
  DataTableBody,
  SortableColumnHeader,
  useDataTable,
  extractUniqueColumnValues,
  extractNumericRange,
} from "@/ui/shared/components/data-table"
import { FloatingLabelInput } from "@/ui/shared/components/floating-label-input"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/ui/shared/components/pagination"
import { Table } from "@/ui/shared/components/table"
import { ColumnDef, ColumnFiltersState, PaginationState } from "@tanstack/react-table"
import { cn } from "@/ui/shared/utils/utils"
import { Content } from "@/ui/shared/components/content"
import { PageHeader } from "@/ui/shared/components/page-header"
import { DatePicker } from "@/ui/shared/components/date-picker"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/ui/shared/components/accordion"
import type { DateRange } from "react-day-picker"
import { fetchInvoices, type Invoice } from "@/lib/data/invoices"

// Component to calculate and display stats
function InvoiceStats({ data }: { data: Invoice[] }) {
  const stats = React.useMemo(() => {
    const totalAmount = data.reduce((sum, inv) => sum + inv.amount, 0)
    const paidCount = data.filter((inv) => inv.status === "Paid").length
    const pendingCount = data.filter((inv) => inv.status === "Pending").length
    const overdueCount = data.filter((inv) => inv.status === "Overdue").length

    return {
      totalAmount,
      paidCount,
      pendingCount,
      overdueCount,
      totalCount: data.length,
    }
  }, [data])

  return (
    <Content className="@container">
      <div className="grid gap-4 grid-cols-1 @[600px]:grid-cols-2 @[960px]:grid-cols-4">
        <DataCard variant="gradient" theme="primary" showLeftBorder>
          <DataCardContent>
            <DataCardLabel>
              <DollarSign className="h-4 w-4" />
              Total Value
            </DataCardLabel>
            <DataCardValue>
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(stats.totalAmount)}
            </DataCardValue>
            <DataCardDescription>{stats.totalCount} invoices</DataCardDescription>
          </DataCardContent>
        </DataCard>

        <DataCard variant="gradient" theme="success" showLeftBorder>
          <DataCardContent>
            <DataCardLabel>
              <TrendingUp className="h-4 w-4" />
              Paid
            </DataCardLabel>
            <DataCardValue>{stats.paidCount}</DataCardValue>
            <DataCardDescription>
              {stats.totalCount > 0
                ? `${((stats.paidCount / stats.totalCount) * 100).toFixed(0)}% of total`
                : "0% of total"}
            </DataCardDescription>
          </DataCardContent>
        </DataCard>

        <DataCard variant="gradient" theme="warning" showLeftBorder>
          <DataCardContent>
            <DataCardLabel>
              <AlertCircle className="h-4 w-4" />
              Pending
            </DataCardLabel>
            <DataCardValue>{stats.pendingCount}</DataCardValue>
            <DataCardDescription>
              {stats.totalCount > 0
                ? `${((stats.pendingCount / stats.totalCount) * 100).toFixed(0)}% of total`
                : "0% of total"}
            </DataCardDescription>
          </DataCardContent>
        </DataCard>

        <DataCard variant="gradient" theme="destructive" showLeftBorder>
          <DataCardContent>
            <DataCardLabel>
              <AlertCircle className="h-4 w-4" />
              Overdue
            </DataCardLabel>
            <DataCardValue>{stats.overdueCount}</DataCardValue>
            <DataCardDescription>Needs attention</DataCardDescription>
          </DataCardContent>
        </DataCard>
      </div>
    </Content>
  )
}

const ACCORDION_STORAGE_KEY = "invoices-filters-accordion"

/** Self-contained accordion - manages its own state so it never re-renders on theme change */
const FiltersAccordion = React.memo(function FiltersAccordion() {
  const [value, setValue] = React.useState<string | undefined>(() => {
    if (typeof window === "undefined") return "filters"
    const stored = localStorage.getItem(ACCORDION_STORAGE_KEY)
    return stored === "closed" ? undefined : stored ?? "filters"
  })

  const handleChange = React.useCallback((v: string | undefined) => {
    setValue(v)
    try {
      localStorage.setItem(ACCORDION_STORAGE_KEY, v ?? "closed")
    } catch {
      // ignore
    }
    // Clear data-theme-changing on any accordion interaction (open or close) - keeps it cleared
    // so the next open animates. Removing it on a timeout would retrigger animation on open accordion.
    document.documentElement.removeAttribute("data-theme-changing")
  }, [])

  React.useEffect(() => {
    return () => document.documentElement.removeAttribute("data-theme-changing")
  }, [])

  return (
    <div data-accordion-filters>
      <Accordion type="single" collapsible value={value} onValueChange={handleChange}>
        <AccordionItem value="filters" className="border-0">
          <AccordionTrigger className="py-3 ">
            <span className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-2 grid grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-4 gap-4 pt-4 items-end">
              <div className="min-w-0">
                <StatusFilter />
              </div>
              <div className="min-w-0">
                <SupplierFilter />
              </div>
              <div className="min-w-0">
                <BuyerFilter />
              </div>
              <div className="min-w-0">
                <ColumnToggle />
              </div>
              <div className="min-w-0">
                <DateRangeFilter />
              </div>
              <div className="min-w-0">
                <DueDateRangeFilter />
              </div>
              <div className="min-w-0">
                <MinAmountFilter />
              </div>
              <div className="min-w-0">
                <MaxAmountFilter />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
})

export function InvoicesView() {
  const [invoices, setInvoices] = React.useState<Invoice[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<Record<string, boolean>>({})
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  React.useEffect(() => {
    fetchInvoices().then((data) => {
      setInvoices(data)
      setIsLoading(false)
    })
  }, [])

  const formatCurrency = React.useCallback((amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }, [])

  const formatDate = React.useCallback((dateString: string) => {
    const [month, day, year] = dateString.split("/")
    if (!month || !day || !year) return dateString
    return `${month.padStart(2, "0")}/${day.padStart(2, "0")}/${year}`
  }, [])

  const parseDate = React.useCallback((dateString: string): Date => {
    const [month, day, year] = dateString.split("/")
    return new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day)))
  }, [])

  const getStatusVariant = React.useCallback((status: Invoice["status"]) => {
    switch (status) {
      case "Paid":
        return "success-soft"
      case "Pending":
        return "warning-soft"
      case "Overdue":
        return "destructive-soft"
      case "Draft":
        return "primary-soft"
      default:
        return "secondary"
    }
  }, [])

  const columns: ColumnDef<Invoice>[] = React.useMemo(
    () => [
      {
        accessorKey: "number",
        header: ({ column }) => <SortableColumnHeader column={column} title="NUMBER" />,
        cell: ({ row }) => (
          <span className="text-sm font-bold tracking-tight">{row.getValue("number")}</span>
        ),
      },
      {
        accessorKey: "issueDate",
        header: ({ column }) => <SortableColumnHeader column={column} title="ISSUE DATE" />,
        cell: ({ row }) => <div>{formatDate(row.getValue("issueDate"))}</div>,
        sortingFn: (rowA, rowB) => {
          return (
            parseDate(rowA.original.issueDate).getTime() -
            parseDate(rowB.original.issueDate).getTime()
          )
        },
        filterFn: (row, id, value) => {
          if (!value || typeof value !== "object") return true
          const range = value as DateRange
          const rowDate = parseDate(row.original.issueDate)
          const rowTime = rowDate.getTime()
          if (range.from) {
            const fromDate = new Date(range.from.getFullYear(), range.from.getMonth(), range.from.getDate())
            if (rowTime < fromDate.getTime()) return false
          }
          if (range.to) {
            const toDate = new Date(range.to.getFullYear(), range.to.getMonth(), range.to.getDate())
            toDate.setHours(23, 59, 59, 999)
            if (rowTime > toDate.getTime()) return false
          }
          return true
        },
      },
      {
        accessorKey: "dueDate",
        header: ({ column }) => <SortableColumnHeader column={column} title="DUE DATE" />,
        cell: ({ row }) => <div>{formatDate(row.getValue("dueDate"))}</div>,
        sortingFn: (rowA, rowB) => {
          return (
            parseDate(rowA.original.dueDate).getTime() - parseDate(rowB.original.dueDate).getTime()
          )
        },
        filterFn: (row, id, value) => {
          if (!value || typeof value !== "object") return true
          const range = value as DateRange
          const rowDate = parseDate(row.original.dueDate)
          const rowTime = rowDate.getTime()
          if (range.from) {
            const fromDate = new Date(range.from.getFullYear(), range.from.getMonth(), range.from.getDate())
            if (rowTime < fromDate.getTime()) return false
          }
          if (range.to) {
            const toDate = new Date(range.to.getFullYear(), range.to.getMonth(), range.to.getDate())
            toDate.setHours(23, 59, 59, 999)
            if (rowTime > toDate.getTime()) return false
          }
          return true
        },
      },
      {
        accessorKey: "supplier",
        header: ({ column }) => <SortableColumnHeader column={column} title="SUPPLIER" />,
        cell: ({ row }) => <div>{row.getValue("supplier")}</div>,
        filterFn: (row, id, value) => {
          return value ? row.getValue(id) === value : true
        },
      },
      {
        accessorKey: "buyer",
        header: ({ column }) => <SortableColumnHeader column={column} title="BUYER" />,
        cell: ({ row }) => <div>{row.getValue("buyer")}</div>,
        filterFn: (row, id, value) => {
          return value ? row.getValue(id) === value : true
        },
      },
      {
        accessorKey: "amount",
        header: ({ column }) => <SortableColumnHeader column={column} title="AMOUNT" />,
        cell: ({ row }) => {
          const amount = formatCurrency(row.getValue("amount"), "USD")
          const status = row.original.status
          const statusVariant = getStatusVariant(status)
          const bgClass =
            statusVariant === "success-soft"
              ? "bg-success/20"
              : statusVariant === "warning-soft"
                ? "bg-warning/20"
                : statusVariant === "destructive-soft"
                  ? "bg-destructive/20"
                  : "bg-primary/20"

          return (
            <div>
              <div
                className={cn(
                  "inline-block px-2 py-1 rounded-app-radius backdrop-blur-sm",
                  bgClass
                )}
              >
                <div className="text-md font-bold tracking-tight">{amount}</div>
              </div>
            </div>
          )
        },
        sortingFn: (rowA, rowB) => {
          return rowA.original.amount - rowB.original.amount
        },
        filterFn: (row, id, value) => {
          if (!value || (typeof value !== "object")) return true
          const range = value as { min?: number; max?: number }
          const amount = row.original.amount
          if (range.min != null && amount < range.min) return false
          if (range.max != null && amount > range.max) return false
          return true
        },
      },
      {
        accessorKey: "status",
        header: ({ column }) => <SortableColumnHeader column={column} title="STATUS" />,
        cell: ({ row }) => {
          const status = row.original.status
          const StatusIcon = (() => {
            switch (status) {
              case "Paid":
                return DollarSign
              case "Pending":
                return TrendingUp
              case "Overdue":
                return AlertCircle
              case "Draft":
                return FileText
              default:
                return FileText
            }
          })()
          return (
            <Badge className="flex gap-1 w-fit shrink-0" variant={getStatusVariant(status)}>
              <StatusIcon className="h-3 w-3" />
              {status}
            </Badge>
          )
        },
        filterFn: (row, id, value) => {
          return value ? row.getValue(id) === value : true
        },
      },
      {
        id: "actions",
        header: "ACTIONS",
        cell: () => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-morphism">
              <DropdownMenuItem asChild>
                <a href="#">View</a>
              </DropdownMenuItem>
              <DropdownMenuItem>Edit</DropdownMenuItem>
              <DropdownMenuItem>Duplicate</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [formatDate, parseDate, formatCurrency, getStatusVariant]
  )

  return (
    <div className="@container space-y-6">
      <PageHeader
        title="Invoice Management"
        subtitle="Manage and track your invoices"
        icon={<FileText className="text-accent-brand" />}
        actions={
          <div className="flex w-full flex-col items-center gap-4 @sm:w-fit @sm:flex-row">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" className="w-full gap-2 @sm:w-fit">
                  <Plus className="h-4 w-4" />
                  CREATE INVOICE
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[var(--radix-dropdown-menu-trigger-width)] glass-morphism"
              >
                <DropdownMenuItem asChild>
                  <a href="#">Create Single Invoice</a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="#">Create Multiple Invoices</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        }
      />

      <DataTableContainer
        columns={columns}
        data={invoices}
        loading={isLoading}
        pagination={pagination}
        onPaginationChange={setPagination}
        columnFilters={columnFilters}
        onColumnFiltersChange={setColumnFilters}
        columnVisibility={columnVisibility}
        onColumnVisibilityChange={setColumnVisibility}
        className="space-y-8"
      >
        <InvoiceStatsWithTable />

        <Card className="@container border-primary/20 bg-transparent">
          <CardContent className="p-6">
            <div className="mb-6">
              <FiltersAccordion />
            </div>
            <DataTableWrapper>
              <Table>
                <DataTableHeader />
                <DataTableBody />
              </Table>
            </DataTableWrapper>
            <PaginationControls />
          </CardContent>
        </Card>
      </DataTableContainer>
    </div>
  )
}

function InvoiceStatsWithTable() {
  const { table, data, columnFilters, globalFilter } = useDataTable()
  const filteredData = React.useMemo(() => {
    const filteredRows = table.getFilteredRowModel().rows
    return filteredRows.map((row) => row.original as Invoice)
  }, [table, data, columnFilters, globalFilter])

  return <InvoiceStats data={filteredData} />
}

function SearchFilter() {
  const { globalFilter, setGlobalFilter } = useDataTable()

  return (
    <FloatingLabelInput
      type="search"
      className="w-full"
      label="Search invoices"
      value={globalFilter as string}
      onChange={(e) => setGlobalFilter(e.target.value)}
      onClear={() => setGlobalFilter("")}
    />
  )
}

function StatusFilter() {
  const { table, data, columnFilters } = useDataTable()

  const extractedOptions = React.useMemo(() => {
    return extractUniqueColumnValues(data, "status")
  }, [data])

  const allOptions = React.useMemo(() => {
    return [{ label: "All", value: "all" }, ...extractedOptions]
  }, [extractedOptions])

  const currentFilterValue = React.useMemo(() => {
    const columnFilter = columnFilters.find((f) => f.id === "status")
    return (columnFilter?.value as string | undefined) || ""
  }, [columnFilters])

  const [localValue, setLocalValue] = React.useState<string>("all")

  React.useEffect(() => {
    setLocalValue(currentFilterValue || "all")
  }, [currentFilterValue])

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setLocalValue(value)
      const column = table.getColumn("status")
      if (column) {
        if (value === "all") {
          column.setFilterValue(undefined)
        } else {
          column.setFilterValue(value)
        }
      }
    },
    [table]
  )

  return (
    <FloatingLabelInput
      type="select"
      label="Status"
      value={localValue}
      onChange={handleChange}
      selectOptions={allOptions}
      className="w-full"
    />
  )
}

function SupplierFilter() {
  const { table, data, columnFilters } = useDataTable()

  const extractedOptions = React.useMemo(() => {
    return extractUniqueColumnValues(data, "supplier")
  }, [data])

  const allOptions = React.useMemo(() => {
    return [{ label: "All", value: "all" }, ...extractedOptions]
  }, [extractedOptions])

  const currentFilterValue = React.useMemo(() => {
    const columnFilter = columnFilters.find((f) => f.id === "supplier")
    return (columnFilter?.value as string | undefined) || ""
  }, [columnFilters])

  const [localValue, setLocalValue] = React.useState<string>("all")

  React.useEffect(() => {
    setLocalValue(currentFilterValue || "all")
  }, [currentFilterValue])

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setLocalValue(value)
      const column = table.getColumn("supplier")
      if (column) {
        if (value === "all") {
          column.setFilterValue(undefined)
        } else {
          column.setFilterValue(value)
        }
      }
    },
    [table]
  )

  return (
    <FloatingLabelInput
      type="combobox"
      label="Supplier"
      value={localValue}
      onChange={handleChange}
      selectOptions={allOptions}
      searchPlaceholder="Search suppliers..."
      emptyMessage="No suppliers found."
      className="w-full"
    />
  )
}

function BuyerFilter() {
  const { table, data, columnFilters } = useDataTable()

  const extractedOptions = React.useMemo(() => {
    return extractUniqueColumnValues(data, "buyer")
  }, [data])

  const allOptions = React.useMemo(() => {
    return [{ label: "All", value: "all" }, ...extractedOptions]
  }, [extractedOptions])

  const currentFilterValue = React.useMemo(() => {
    const columnFilter = columnFilters.find((f) => f.id === "buyer")
    return (columnFilter?.value as string | undefined) || ""
  }, [columnFilters])

  const [localValue, setLocalValue] = React.useState<string>("all")

  React.useEffect(() => {
    setLocalValue(currentFilterValue || "all")
  }, [currentFilterValue])

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setLocalValue(value)
      const column = table.getColumn("buyer")
      if (column) {
        if (value === "all") {
          column.setFilterValue(undefined)
        } else {
          column.setFilterValue(value)
        }
      }
    },
    [table]
  )

  return (
    <FloatingLabelInput
      type="combobox"
      label="Buyer"
      value={localValue}
      onChange={handleChange}
      selectOptions={allOptions}
      searchPlaceholder="Search buyers..."
      emptyMessage="No buyers found."
      className="w-full"
    />
  )
}

function DateRangeFilter() {
  const { table, columnFilters } = useDataTable()

  const currentRange = React.useMemo(() => {
    const columnFilter = columnFilters.find((f) => f.id === "issueDate")
    return (columnFilter?.value as DateRange | undefined) ?? undefined
  }, [columnFilters])

  const handleRangeSelect = React.useCallback(
    (range: DateRange | undefined) => {
      const column = table.getColumn("issueDate")
      if (column) {
        column.setFilterValue(range ?? undefined)
      }
    },
    [table]
  )

  return (
    <DatePicker
      mode="range-single"
      label="Issue date"
      placeholder="Select date range"
      range={currentRange}
      onRangeSelect={handleRangeSelect}
      className="w-full"
    />
  )
}

function DueDateRangeFilter() {
  const { table, columnFilters } = useDataTable()

  const currentRange = React.useMemo(() => {
    const columnFilter = columnFilters.find((f) => f.id === "dueDate")
    return (columnFilter?.value as DateRange | undefined) ?? undefined
  }, [columnFilters])

  const handleRangeSelect = React.useCallback(
    (range: DateRange | undefined) => {
      const column = table.getColumn("dueDate")
      if (column) {
        column.setFilterValue(range ?? undefined)
      }
    },
    [table]
  )

  return (
    <DatePicker
      mode="range-single"
      label="Due date"
      placeholder="Select date range"
      range={currentRange}
      onRangeSelect={handleRangeSelect}
      className="w-full"
    />
  )
}

function MinAmountFilter() {
  const { table, data, columnFilters } = useDataTable()

  const [amountMin] = React.useMemo(() => {
    return extractNumericRange(data, "amount")
  }, [data])

  const currentFilter = React.useMemo(() => {
    const columnFilter = columnFilters.find((f) => f.id === "amount")
    return (columnFilter?.value as { min?: number; max?: number } | undefined) || {}
  }, [columnFilters])

  const [localValue, setLocalValue] = React.useState<string>("")

  React.useEffect(() => {
    setLocalValue(currentFilter.min != null ? String(currentFilter.min) : "")
  }, [currentFilter.min])

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setLocalValue(value)
      const column = table.getColumn("amount")
      if (!column) return
      const parsedMin = value === "" || isNaN(parseFloat(value)) ? undefined : parseFloat(value)
      const current = (column.getFilterValue() as { min?: number; max?: number }) || {}
      const next = { ...current, min: parsedMin }
      column.setFilterValue(
        next.min == null && next.max == null ? undefined : next
      )
    },
    [table]
  )

  return (
    <FloatingLabelInput
      type="number"
      label="Min amount"
      value={localValue}
      onChange={handleChange}
      placeholder={String(amountMin)}
      className="w-full"
    />
  )
}

function MaxAmountFilter() {
  const { table, data, columnFilters } = useDataTable()

  const [, amountMax] = React.useMemo(() => {
    return extractNumericRange(data, "amount")
  }, [data])

  const currentFilter = React.useMemo(() => {
    const columnFilter = columnFilters.find((f) => f.id === "amount")
    return (columnFilter?.value as { min?: number; max?: number } | undefined) || {}
  }, [columnFilters])

  const [localValue, setLocalValue] = React.useState<string>("")

  React.useEffect(() => {
    setLocalValue(currentFilter.max != null ? String(currentFilter.max) : "")
  }, [currentFilter.max])

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setLocalValue(value)
      const column = table.getColumn("amount")
      if (!column) return
      const parsedMax = value === "" || isNaN(parseFloat(value)) ? undefined : parseFloat(value)
      const current = (column.getFilterValue() as { min?: number; max?: number }) || {}
      const next = { ...current, max: parsedMax }
      column.setFilterValue(
        next.min == null && next.max == null ? undefined : next
      )
    },
    [table]
  )

  return (
    <FloatingLabelInput
      type="number"
      label="Max amount"
      value={localValue}
      onChange={handleChange}
      placeholder={String(amountMax)}
      className="w-full"
    />
  )
}

function ColumnToggle() {
  const { table } = useDataTable()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-11 justify-between rounded-app-radius border border-input bg-transparent px-3 py-2 text-left font-normal hover:bg-accent hover:text-foreground"
        >
          <span>Columns</span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="glass-morphism w-[var(--radix-dropdown-menu-trigger-width)]">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function PaginationControls() {
  const { table, loading, initialLoading } = useDataTable()
  const isLoading = loading || initialLoading

  if (table.getPageCount() === 0) return null

  const { pageIndex, pageSize } = table.getState().pagination
  const totalFiltered = table.getFilteredRowModel().rows.length
  const start = totalFiltered === 0 ? 0 : pageIndex * pageSize + 1
  const end = Math.min((pageIndex + 1) * pageSize, totalFiltered)

  return (
    <div className="relative mt-6 flex items-center justify-between gap-4">
      <p className="absolute w-40 hidden text-sm text-muted-foreground @sm:block">
        {start}-{end} of {totalFiltered} invoices
      </p>
      <Pagination className="ml-auto">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (!isLoading && table.getCanPreviousPage()) {
                  table.previousPage()
                }
              }}
              disabled={!table.getCanPreviousPage() || isLoading}
            />
          </PaginationItem>
          {(() => {
            const currentPage = table.getState().pagination.pageIndex + 1
            const totalPages = table.getPageCount()
            const pages: (number | "ellipsis")[] = []

            if (totalPages <= 7) {
              for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
              }
            } else {
              pages.push(1)
              if (currentPage <= 4) {
                for (let i = 2; i <= 5; i++) {
                  pages.push(i)
                }
                pages.push("ellipsis")
                pages.push(totalPages)
              } else if (currentPage >= totalPages - 3) {
                pages.push("ellipsis")
                for (let i = totalPages - 4; i <= totalPages; i++) {
                  pages.push(i)
                }
              } else {
                pages.push("ellipsis")
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                  pages.push(i)
                }
                pages.push("ellipsis")
                pages.push(totalPages)
              }
            }

            return pages.map((page, index) => {
              if (page === "ellipsis") {
                return (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (!isLoading) {
                        table.setPageIndex(page - 1)
                      }
                    }}
                    isActive={page === currentPage}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            })
          })()}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (!isLoading && table.getCanNextPage()) {
                  table.nextPage()
                }
              }}
              disabled={!table.getCanNextPage() || isLoading}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

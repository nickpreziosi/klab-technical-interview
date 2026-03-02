/**
 * Invoice data module — mimics fetching from a database.
 * Keeps data separate from UI for cleaner architecture and easier testing.
 * Dates are within the past year from 3/2/2026.
 */

export interface Invoice {
  id: string
  number: string
  issueDate: string
  dueDate: string
  supplier: string
  buyer: string
  amount: number
  currency: string
  status: "Pending" | "Paid" | "Overdue" | "Draft"
}

const sampleInvoices: Invoice[] = [
  { id: "1", number: "INV-2025-001", issueDate: "04/15/2025", dueDate: "05/15/2025", supplier: "Tech Solutions Inc.", buyer: "Acme Corporation", amount: 12500.0, currency: "USD", status: "Pending" },
  { id: "2", number: "INV-2025-002", issueDate: "04/20/2025", dueDate: "05/20/2025", supplier: "Tech Solutions Inc.", buyer: "Acme Corporation", amount: 8750.5, currency: "USD", status: "Paid" },
  { id: "3", number: "INV-2025-003", issueDate: "04/10/2025", dueDate: "05/10/2025", supplier: "Tech Solutions Inc.", buyer: "Beta Industries", amount: 3200.0, currency: "USD", status: "Overdue" },
  { id: "4", number: "INV-2025-004", issueDate: "05/25/2025", dueDate: "06/25/2025", supplier: "Tech Solutions Inc.", buyer: "Delta Corp", amount: 15600.75, currency: "USD", status: "Pending" },
  { id: "5", number: "INV-2025-005", issueDate: "05/05/2025", dueDate: "06/05/2025", supplier: "Global Services Ltd.", buyer: "Acme Corporation", amount: 9800.0, currency: "USD", status: "Draft" },
  { id: "6", number: "INV-2025-006", issueDate: "05/18/2025", dueDate: "06/18/2025", supplier: "Global Services Ltd.", buyer: "Beta Industries", amount: 11200.25, currency: "USD", status: "Paid" },
  { id: "7", number: "INV-2025-007", issueDate: "06/12/2025", dueDate: "07/12/2025", supplier: "Global Services Ltd.", buyer: "Gamma Enterprises", amount: 4500.0, currency: "USD", status: "Overdue" },
  { id: "8", number: "INV-2025-008", issueDate: "06/28/2025", dueDate: "07/28/2025", supplier: "Creative Agency", buyer: "Delta Corp", amount: 18900.5, currency: "USD", status: "Pending" },
  { id: "9", number: "INV-2025-009", issueDate: "06/08/2025", dueDate: "07/08/2025", supplier: "Creative Agency", buyer: "Lambda Industries", amount: 7200.0, currency: "USD", status: "Paid" },
  { id: "10", number: "INV-2025-010", issueDate: "07/22/2025", dueDate: "08/22/2025", supplier: "Digital Marketing Co.", buyer: "Acme Corporation", amount: 13500.75, currency: "USD", status: "Pending" },
  { id: "11", number: "INV-2025-011", issueDate: "07/30/2025", dueDate: "08/29/2025", supplier: "Digital Marketing Co.", buyer: "Beta Industries", amount: 21000.0, currency: "USD", status: "Draft" },
  { id: "12", number: "INV-2025-012", issueDate: "08/14/2025", dueDate: "09/14/2025", supplier: "Cloud Services", buyer: "Gamma Enterprises", amount: 16800.25, currency: "USD", status: "Overdue" },
  { id: "13", number: "INV-2025-013", issueDate: "08/16/2025", dueDate: "09/16/2025", supplier: "Tech Solutions Inc.", buyer: "Delta Corp", amount: 9500.5, currency: "USD", status: "Paid" },
  { id: "14", number: "INV-2025-014", issueDate: "09/24/2025", dueDate: "10/24/2025", supplier: "Global Services Ltd.", buyer: "Lambda Industries", amount: 14200.0, currency: "USD", status: "Pending" },
  { id: "15", number: "INV-2025-015", issueDate: "09/06/2025", dueDate: "10/06/2025", supplier: "Creative Agency", buyer: "Acme Corporation", amount: 11200.75, currency: "USD", status: "Overdue" },
  { id: "16", number: "INV-2025-016", issueDate: "10/01/2025", dueDate: "11/01/2025", supplier: "Tech Solutions Inc.", buyer: "Beta Industries", amount: 7800.0, currency: "USD", status: "Pending" },
  { id: "17", number: "INV-2025-017", issueDate: "10/05/2025", dueDate: "11/05/2025", supplier: "Global Services Ltd.", buyer: "Delta Corp", amount: 15600.0, currency: "USD", status: "Paid" },
  { id: "18", number: "INV-2025-018", issueDate: "11/08/2025", dueDate: "12/08/2025", supplier: "Digital Marketing Co.", buyer: "Gamma Enterprises", amount: 22000.5, currency: "USD", status: "Draft" },
  { id: "19", number: "INV-2025-019", issueDate: "11/10/2025", dueDate: "12/10/2025", supplier: "Tech Solutions Inc.", buyer: "Lambda Industries", amount: 4200.25, currency: "USD", status: "Overdue" },
  { id: "20", number: "INV-2025-020", issueDate: "11/12/2025", dueDate: "12/12/2025", supplier: "Global Services Ltd.", buyer: "Acme Corporation", amount: 18900.0, currency: "USD", status: "Pending" },
  { id: "21", number: "INV-2025-021", issueDate: "12/14/2025", dueDate: "01/14/2026", supplier: "Creative Agency", buyer: "Beta Industries", amount: 6400.75, currency: "USD", status: "Paid" },
  { id: "22", number: "INV-2025-022", issueDate: "12/18/2025", dueDate: "01/18/2026", supplier: "Tech Solutions Inc.", buyer: "Delta Corp", amount: 31500.0, currency: "USD", status: "Pending" },
  { id: "23", number: "INV-2026-001", issueDate: "01/20/2026", dueDate: "02/20/2026", supplier: "Design Studio", buyer: "Sigma Ltd", amount: 8900.5, currency: "USD", status: "Draft" },
  { id: "24", number: "INV-2026-002", issueDate: "02/22/2026", dueDate: "03/22/2026", supplier: "Digital Marketing Co.", buyer: "Omega Corp", amount: 12300.25, currency: "USD", status: "Overdue" },
  { id: "25", number: "INV-2026-003", issueDate: "02/25/2026", dueDate: "03/25/2026", supplier: "Cloud Services", buyer: "Lambda Industries", amount: 27500.0, currency: "USD", status: "Paid" },
]

/**
 * Fetches invoices from the data layer (simulates database/API call).
 * Includes a delay to mimic network latency.
 */
export async function fetchInvoices(): Promise<Invoice[]> {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return sampleInvoices
}

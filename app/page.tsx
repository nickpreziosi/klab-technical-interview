import { DemoLayoutClient } from "@/ui/demo/demo-layout-client"
import { InvoicesView } from "@/ui/views/invoices-view"

export default function Home() {
  return (
    <DemoLayoutClient>
      <InvoicesView />
    </DemoLayoutClient>
  )
}

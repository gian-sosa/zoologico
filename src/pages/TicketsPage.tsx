import PageHeader from '../shared/components/PageHeader'
import TicketSection from '../components/TicketSection'

export default function TicketsPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
      <PageHeader
        eyebrow="Boletería online"
        title="Entradas"
        description="Compra tus entradas para el Zoológico de Totorilla, elige la fecha de tu visita y muestra tu código en puerta. Sin colas, 100% online."
      />

      <div className="mt-12">
        <TicketSection />
      </div>
    </main>
  )
}

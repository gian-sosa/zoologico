import PageHeader from '../shared/components/PageHeader'
import PhotoWall from '../components/PhotoWall'

export default function CommunityPage() {
  return (
    <main className="mx-auto max-w-5xl px-6 py-16 sm:py-20">
      <PageHeader
        eyebrow="Comunidad Totorilla"
        title="Comparte tu visita"
        description="Sube tus fotos del zoológico, inspira a otros visitantes y forma parte del muro de la comunidad. Las imágenes se guardan en tu navegador."
      />

      <div className="mt-12">
        <PhotoWall />
      </div>
    </main>
  )
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { listPhotos, photoRequest } from './photos.store'
import type { VisitorPhoto } from './photos.store'
import { fileToCompressedWebP } from './image'

export type { VisitorPhoto }

export function useVisitorPhotos(moderation = false) {
  const [photos, setPhotos] = useState<VisitorPhoto[]>([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const busy = useRef(false)
  const readVersion = useRef(0)
  const refresh = useCallback(async () => {
    const version = ++readVersion.current
    try {
      const result = await listPhotos(moderation, moderation ? page : 0)
      if (version !== readVersion.current) return
      setPhotos(result.photos)
      setHasMore(result.hasMore)
    } catch (cause) {
      if (version === readVersion.current) setError(cause instanceof Error ? cause.message : 'No se pudieron cargar las fotos.')
    } finally {
      if (version === readVersion.current) setLoading(false)
    }
  }, [moderation, page])
  const cancelReads = useCallback(() => { readVersion.current++ }, [])

  useEffect(() => {
    void Promise.resolve().then(refresh)
    // Renovar las URL firmadas antes de su vencimiento, incluso en pestañas abiertas.
    const interval = window.setInterval(() => { void refresh() }, 5 * 60 * 1000)
    const onVisible = () => { if (document.visibilityState === 'visible') void refresh() }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      cancelReads()
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [refresh, cancelReads])

  async function addFiles(files: File[], author: string) {
    if (busy.current || !files.length) return
    if (files.length > 6) {
      setError('Selecciona como máximo 6 fotos por vez.')
      return
    }
    busy.current = true
    setUploading(true)
    setError('')
    setNotice('')
    let added = 0
    try {
      for (const file of files) {
        const blob = await fileToCompressedWebP(file)
        await photoRequest('POST', new URLSearchParams({ author }), blob)
        added++
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo subir la imagen.')
    } finally {
      if (added) setNotice(`${added} foto(s) enviada(s). Se publicarán después de la aprobación del administrador.`)
      await refresh()
      busy.current = false
      setUploading(false)
    }
  }

  async function moderatePhoto(id: string, action: string) {
    setError('')
    setNotice('')
    try {
      await photoRequest('PATCH', new URLSearchParams({ id, action }))
      setNotice(action === 'request-delete' ? 'Solicitud de eliminación enviada al administrador.' : 'Decisión guardada.')
      await refresh()
      return true
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo completar la acción.')
      await refresh()
      return false
    }
  }

  const removePhoto = (id: string) => moderatePhoto(id, 'request-delete')
  function changePage(next: number) {
    setLoading(true)
    setPage(Math.max(0, next))
  }
  return { photos, loading, uploading, error, notice, page, hasMore, changePage, addFiles, removePhoto, moderatePhoto, refresh }
}

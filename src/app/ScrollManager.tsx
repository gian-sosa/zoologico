import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollManager() {
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0)
      return
    }

    let id: string
    try { id = decodeURIComponent(hash.slice(1)) }
    catch { return }

    function scrollToTarget() {
      const target = document.getElementById(id)
      if (!target) return false
      target.scrollIntoView({ block: 'start' })
      return true
    }

    if (scrollToTarget()) return
    // Las rutas se cargan bajo demanda: el destino puede aparecer tras Suspense.
    const observer = new MutationObserver(() => {
      if (scrollToTarget()) observer.disconnect()
    })
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [pathname, hash, key])

  return null
}

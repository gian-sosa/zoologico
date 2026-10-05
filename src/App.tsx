import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import AppRouter from './app/router'

export default function App() {
  return (
    <>
      <AppRouter />
      <Analytics />
      <SpeedInsights />
    </>
  )
}

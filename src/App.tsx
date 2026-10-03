import { Analytics } from '@vercel/analytics/react'
import AppRouter from './app/router'

export default function App() {
  return (
    <>
      <AppRouter />
      <Analytics />
    </>
  )
}

import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router'
import { useAuthStore } from './features/auth/authStore'

export default function App() {
  const init = useAuthStore((state) => state.init)

  useEffect(() => {
    const unsubscribe = init()
    return () => {
      unsubscribe()
    }
  }, [init])

  return <RouterProvider router={router} />
}

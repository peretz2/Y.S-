import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api.js'
import { registryToMap } from './registry.js'

const SiteContentContext = createContext({
  t: (k, fb = '') => fb,
  ready: false,
  reload: async () => {},
})

export function SiteContentProvider({ children }) {
  const [map, setMap] = useState(() => registryToMap())
  const [ready, setReady] = useState(false)

  async function load() {
    try {
      const { data } = await api.get('/content')
      setMap({ ...registryToMap(), ...data })
    } catch {
      // keep registry defaults
    } finally {
      setReady(true)
    }
  }

  useEffect(() => {
    load()
  }, [])

  function t(key, fallback = '') {
    const val = map[key]
    return val !== undefined && val !== '' ? val : fallback
  }

  return (
    <SiteContentContext.Provider value={{ t, ready, reload: load }}>
      {children}
    </SiteContentContext.Provider>
  )
}

export function useContent() {
  return useContext(SiteContentContext)
}

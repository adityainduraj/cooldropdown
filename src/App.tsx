import { useState, useEffect } from 'react'
import LaraconSelect from './components/LaraconSelect'

function App() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const preloadResources = async () => {
      // Wait for fonts to load
      await document.fonts.ready
      
      // Preload noise image
      const noiseImage = new Image()
      noiseImage.src = '/noise.png'
      await new Promise((resolve) => {
        noiseImage.onload = resolve
      })

      setIsLoaded(true)
    }

    preloadResources()
  }, [])

  if (!isLoaded) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(circle at 22% 0%, rgba(13, 30, 29, 1) 0%, rgba(17, 17, 17, 1) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Loading state with same background */}
      </div>
    )
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      position: 'relative',
      background: 'radial-gradient(circle at 22% 0%, rgba(13, 30, 29, 1) 0%, rgba(17, 17, 17, 1) 100%)',
      overflow: 'hidden',
      borderTop: '1px solid rgba(255, 255, 255, 0.09)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      paddingTop: '30vh'
    }}>
      <div 
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          backgroundImage: 'url(/noise.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: '55.7%',
          opacity: 0.7,
          mixBlendMode: 'overlay',
          zIndex: 1000,
          pointerEvents: 'none'
        }}
      />
      <LaraconSelect />
    </div>
  )
}

export default App

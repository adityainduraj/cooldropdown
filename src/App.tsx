import LaraconSelect from './components/LaraconSelect'

function App() {
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

import { useEffect, useState } from 'react'
import { Button } from './components/Button/Button'

interface ColorData {
  current: string | null
  previous: string | null
}

function App() {
  const [colors, setColors] = useState<ColorData>({
    current: null,
    previous: null
  })
  const [error, setError] = useState<string>('')
  const [title, setTitle] = useState<string>('Ainda não tem nenhuma cor selecionada :/')
  const [showColors, setShowColors] = useState<boolean>(false)

  useEffect(() => {
    if (!('EyeDropper' in window)) {
      setError('Error: Seu navegador ainda não suporta a aplicação :/')
      setTitle('')
      return
    }

    const savedCurrent = localStorage.getItem('corSelecionada')
    const savedPrevious = localStorage.getItem('corAnterior')

    if (savedCurrent) {
      setColors({
        current: savedCurrent,
        previous: savedPrevious
      })
      setTitle('Cores:')
      setShowColors(true)
    }
  }, [])

  const handleChooseColor = async () => {
    try {
      const dropper = new EyeDropper()
      const result = await dropper.open()
      
      const newColors = {
        current: result.sRGBHex,
        previous: colors.current
      }
      
      setColors(newColors)
      setTitle('Cores:')
      setShowColors(true)
      setError('')
      
      localStorage.setItem('corSelecionada', result.sRGBHex)
      if (colors.current) {
        localStorage.setItem('corAnterior', colors.current)
      }
    } catch {
      setError('Erro ao selecionar cor')
    }
  }

  const handleClearColors = () => {
    if (!colors.current && !colors.previous) {
      setTitle('Você não tem cores para apagar ヾ( ･`⌓´･)ﾉﾞ')
      return
    }
    
    setTitle('Você apagou as cores :/')
    setColors({ current: null, previous: null })
    setShowColors(false)
    
    localStorage.removeItem('corSelecionada')
    localStorage.removeItem('corAnterior')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-4">
      <main className="w-full max-w-2xl">
        <article className="bg-gray-900 rounded-3xl p-8 shadow-2xl">
          <header className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Clique e selecione a cor
            </h1>
          </header>

          <section className="text-center mb-8">
            <Button onClick={handleChooseColor} />
          </section>

          {error && (
            <section className="mb-4">
              <div className="text-red-500 text-xl text-center" role="alert" aria-live="polite">
                {error}
              </div>
            </section>
          )}

          {title && (
            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-white text-center">
                {title}
              </h2>
            </section>
          )}

          {showColors && (
            <section className="mb-8" aria-label="Cores selecionadas">
              <div className="flex flex-col md:flex-row justify-center gap-6">
                <article className="flex flex-col items-center">
                  <h3 className="text-white text-lg mb-4">Cor atual:</h3>
                  <div 
                    className="w-20 h-20 md:w-24 md:h-24 rounded-lg border-2 border-gray-900 flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: colors.current || 'transparent' }}
                    role="img"
                    aria-label={`Cor atual: ${colors.current}`}
                  >
                    <span className="text-sm md:text-base font-bold text-white drop-shadow-lg">
                      {colors.current}
                    </span>
                  </div>
                </article>

                <article className="flex flex-col items-center">
                  <h3 className="text-white text-lg mb-4">Cor anterior:</h3>
                  <div 
                    className="w-20 h-20 md:w-24 md:h-24 rounded-lg border-2 border-gray-900 flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: colors.previous || 'transparent' }}
                    role="img"
                    aria-label={`Cor anterior: ${colors.previous}`}
                  >
                    <span className="text-sm md:text-base font-bold text-white drop-shadow-lg">
                      {colors.previous}
                    </span>
                  </div>
                </article>
              </div>
            </section>
          )}

          <footer className="text-center">
            <button
              onClick={handleClearColors}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-200"
              aria-label="Limpar todas as cores selecionadas"
            >
              Limpar Cores
            </button>
          </footer>
        </article>
      </main>
    </div>
  )
}

export default App

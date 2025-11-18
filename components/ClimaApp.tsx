'use client'

import { useState } from 'react'
import { obtenerClimaPorCiudad, DatosClima } from '@/lib/climaApi'
import estilos from './Clima.module.css'

export default function ClimaApp() {
  const [ciudad, setCiudad] = useState('')
  const [datosClima, setDatosClima] = useState<DatosClima | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cargando, setCargando] = useState(false)

  const buscarClima = async () => {
    if (!ciudad.trim()) {
      setError('Ingresa el nombre de una ciudad para comenzar')
      return
    }

    setCargando(true)
    setError(null)
    setDatosClima(null)

    try {
      const datos = await obtenerClimaPorCiudad(ciudad.trim())
      setDatosClima(datos)
    } catch (err: any) {
      setError(err.message || 'No se pudo obtener la información del clima')
    } finally {
      setCargando(false)
    }
  }

  const manejarTeclaEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      buscarClima()
    }
  }

  return (
    <div className={estilos.contenedor}>
      <h1 className={estilos.titulo}>Clima en Tiempo Real</h1>
      
      <div className={estilos.buscador}>
        <input
          type="text"
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
          onKeyPress={manejarTeclaEnter}
          placeholder="Ej: Madrid, Barcelona, Lima..."
          className={estilos.entrada}
          data-testid="city-input"
        />
        <button
          onClick={buscarClima}
          disabled={cargando}
          className={estilos.boton}
          data-testid="search-button"
        >
          {cargando ? 'Consultando...' : 'Consultar'}
        </button>
      </div>

      {error && (
        <div className={estilos.mensajeError} data-testid="error-message">
          {error}
        </div>
      )}

      {datosClima && (
        <div className={estilos.tarjetaClima} data-testid="weather-data">
          <h2 className={estilos.nombreCiudad}>{datosClima.ciudad}</h2>
          <div className={estilos.infoClima}>
            <div className={estilos.itemInfo}>
              <span className={estilos.etiqueta}>Temperatura</span>
              <span className={estilos.valor} data-testid="temperature">
                {datosClima.temperatura}°C
              </span>
            </div>
            <div className={estilos.itemInfo}>
              <span className={estilos.etiqueta}>Humedad</span>
              <span className={estilos.valor} data-testid="humidity">
                {datosClima.humedad}%
              </span>
            </div>
            <div className={estilos.itemInfo}>
              <span className={estilos.etiqueta}>Condiciones</span>
              <span className={estilos.valor} data-testid="description">
                {datosClima.descripcion}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


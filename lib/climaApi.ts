export interface DatosClima {
  temperatura: number
  humedad: number
  descripcion: string
  ciudad: string
}

export async function obtenerClimaPorCiudad(ciudad: string): Promise<DatosClima> {
  const respuesta = await fetch(`/api/clima?ciudad=${encodeURIComponent(ciudad)}`)

  if (!respuesta.ok) {
    const datosError = await respuesta.json()
    throw new Error(datosError.error || 'No se pudo obtener la información del clima')
  }

  const datos = await respuesta.json()
  return datos
}


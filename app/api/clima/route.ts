import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const ciudad = searchParams.get('ciudad')

  if (!ciudad) {
    return NextResponse.json(
      { error: 'Debes proporcionar el nombre de una ciudad' },
      { status: 400 }
    )
  }

  const CLAVE_API = process.env.WEATHER_API_KEY

  if (!CLAVE_API) {
    return NextResponse.json(
      { error: 'Configuración incompleta. Verifica tu archivo .env.local' },
      { status: 500 }
    )
  }

  try {
    const respuesta = await axios.get(BASE_URL, {
      params: {
        q: ciudad,
        appid: CLAVE_API,
        units: 'metric',
        lang: 'es',
      },
    })

    return NextResponse.json({
      temperatura: Math.round(respuesta.data.main.temp),
      humedad: respuesta.data.main.humidity,
      descripcion: respuesta.data.weather[0].description,
      ciudad: respuesta.data.name,
    })
  } catch (error: any) {
    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: 'No se encontró información para esa ciudad. Verifica el nombre e intenta nuevamente.' },
        { status: 404 }
      )
    }
    if (error.response?.status === 401) {
      return NextResponse.json(
        { error: 'La clave de API no está activa. Si acabas de crear tu cuenta, puede tardar hasta 2 horas en activarse.' },
        { status: 401 }
      )
    }
    return NextResponse.json(
      { error: 'No se pudo obtener la información. Intenta más tarde.' },
      { status: 500 }
    )
  }
}


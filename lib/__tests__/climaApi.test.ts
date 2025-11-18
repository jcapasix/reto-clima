import { obtenerClimaPorCiudad } from '../climaApi'

global.fetch = jest.fn()

describe('climaApi', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('obtenerClimaPorCiudad', () => {
    it('debe retornar datos del clima correctamente para una ciudad válida', async () => {
      const datosMock = {
        temperatura: 23,
        humedad: 65,
        descripcion: 'cielo despejado',
        ciudad: 'Madrid',
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => datosMock,
      })

      const resultado = await obtenerClimaPorCiudad('Madrid')

      expect(resultado).toEqual(datosMock)
      expect(global.fetch).toHaveBeenCalledWith('/api/clima?ciudad=Madrid')
    })

    it('debe lanzar un error cuando la ciudad no se encuentra (404)', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Ciudad no encontrada. Por favor, verifica el nombre de la ciudad.' }),
      })

      await expect(obtenerClimaPorCiudad('CiudadInexistente')).rejects.toThrow(
        'Ciudad no encontrada. Por favor, verifica el nombre de la ciudad.'
      )
    })

    it('debe lanzar un error cuando la API key es inválida (401)', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'API key inválida o no activada. Si acabas de crear tu cuenta en OpenWeatherMap, la API key puede tardar hasta 2 horas en activarse. Por favor, verifica tu configuración o espera a que se active.' }),
      })

      await expect(obtenerClimaPorCiudad('Madrid')).rejects.toThrow(
        'API key inválida o no activada. Si acabas de crear tu cuenta en OpenWeatherMap, la API key puede tardar hasta 2 horas en activarse. Por favor, verifica tu configuración o espera a que se active.'
      )
    })

    it('debe lanzar un error genérico para otros errores', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Error al obtener el clima. Por favor, intenta de nuevo más tarde.' }),
      })

      await expect(obtenerClimaPorCiudad('Madrid')).rejects.toThrow(
        'Error al obtener el clima. Por favor, intenta de nuevo más tarde.'
      )
    })
  })
})


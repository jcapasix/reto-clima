import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ClimaApp from '../ClimaApp'
import { obtenerClimaPorCiudad } from '@/lib/climaApi'

jest.mock('@/lib/climaApi')

const mockObtenerClimaPorCiudad = obtenerClimaPorCiudad as jest.MockedFunction<typeof obtenerClimaPorCiudad>

describe('ClimaApp', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Funcionalidad del campo de entrada y botón', () => {
    it('debe renderizar el campo de entrada y el botón de búsqueda', () => {
      render(<ClimaApp />)
      
      const input = screen.getByTestId('city-input')
      const button = screen.getByTestId('search-button')
      
      expect(input).toBeInTheDocument()
      expect(button).toBeInTheDocument()
    })

    it('debe permitir al usuario ingresar texto en el campo de entrada', async () => {
      const user = userEvent.setup()
      render(<ClimaApp />)
      
      const input = screen.getByTestId('city-input') as HTMLInputElement
      
      await user.type(input, 'Madrid')
      
      expect(input.value).toBe('Madrid')
    })

    it('debe ejecutar la búsqueda cuando se presiona Enter en el campo de entrada', async () => {
      const user = userEvent.setup()
      mockObtenerClimaPorCiudad.mockResolvedValue({
        temperature: 20,
        humidity: 60,
        description: 'soleado',
        city: 'Madrid',
      })

      render(<ClimaApp />)
      
      const input = screen.getByTestId('city-input')
      await user.type(input, 'Madrid{Enter}')
      
      await waitFor(() => {
        expect(mockObtenerClimaPorCiudad).toHaveBeenCalledWith('Madrid')
      })
    })

    it('debe ejecutar la búsqueda cuando se hace clic en el botón', async () => {
      const user = userEvent.setup()
      mockObtenerClimaPorCiudad.mockResolvedValue({
        temperature: 20,
        humidity: 60,
        description: 'soleado',
        city: 'Madrid',
      })

      render(<ClimaApp />)
      
      const input = screen.getByTestId('city-input')
      const button = screen.getByTestId('search-button')
      
      await user.type(input, 'Madrid')
      await user.click(button)
      
      await waitFor(() => {
        expect(mockObtenerClimaPorCiudad).toHaveBeenCalledWith('Madrid')
      })
    })
  })

  describe('Búsqueda exitosa', () => {
    it('debe mostrar la información del clima correctamente después de una búsqueda exitosa', async () => {
      const user = userEvent.setup()
      const datosClimaMock = {
        temperature: 22,
        humidity: 65,
        description: 'parcialmente nublado',
        city: 'Barcelona',
      }

      mockObtenerClimaPorCiudad.mockResolvedValue(datosClimaMock)

      render(<ClimaApp />)
      
      const input = screen.getByTestId('city-input')
      const button = screen.getByTestId('search-button')
      
      await user.type(input, 'Barcelona')
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByTestId('weather-data')).toBeInTheDocument()
      })

      expect(screen.getByText('Barcelona')).toBeInTheDocument()
      expect(screen.getByTestId('temperature')).toHaveTextContent('22°C')
      expect(screen.getByTestId('humidity')).toHaveTextContent('65%')
      expect(screen.getByTestId('description')).toHaveTextContent('parcialmente nublado')
    })

    it('debe mostrar el estado de carga mientras se busca el clima', async () => {
      const user = userEvent.setup()
      mockObtenerClimaPorCiudad.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve({
          temperature: 20,
          humidity: 60,
          description: 'soleado',
          city: 'Madrid',
        }), 100))
      )

      render(<ClimaApp />)
      
      const input = screen.getByTestId('city-input')
      
      await user.type(input, 'Madrid')
      await user.click(screen.getByTestId('search-button'))

      await waitFor(() => {
        expect(screen.getByText('Buscando...')).toBeInTheDocument()
      })
      
      const button = screen.getByTestId('search-button')
      expect(button).toBeDisabled()

      await waitFor(() => {
        expect(screen.queryByText('Buscando...')).not.toBeInTheDocument()
      }, { timeout: 2000 })
    })
  })

  describe('Manejo de errores', () => {
    it('debe mostrar un error cuando se ingresa un nombre de ciudad inválido', async () => {
      const user = userEvent.setup()
      mockObtenerClimaPorCiudad.mockRejectedValue(new Error('Ciudad no encontrada. Por favor, verifica el nombre de la ciudad.'))

      render(<ClimaApp />)
      
      const input = screen.getByTestId('city-input')
      const button = screen.getByTestId('search-button')
      
      await user.type(input, 'CiudadInexistente123')
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
      })

      expect(screen.getByTestId('error-message')).toHaveTextContent('Ciudad no encontrada. Por favor, verifica el nombre de la ciudad.')
      expect(screen.queryByTestId('weather-data')).not.toBeInTheDocument()
    })

    it('debe mostrar un error cuando se intenta buscar sin ingresar una ciudad', async () => {
      const user = userEvent.setup()
      render(<ClimaApp />)
      
      const button = screen.getByTestId('search-button')
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
      })

      expect(screen.getByTestId('error-message')).toHaveTextContent('Por favor, ingresa el nombre de una ciudad')
      expect(mockObtenerClimaPorCiudad).not.toHaveBeenCalled()
    })

    it('debe limpiar el error anterior cuando se realiza una nueva búsqueda exitosa', async () => {
      const user = userEvent.setup()
      
      // Primero generar un error
      mockObtenerClimaPorCiudad.mockRejectedValueOnce(new Error('Ciudad no encontrada'))
      render(<ClimaApp />)
      
      const input = screen.getByTestId('city-input')
      const button = screen.getByTestId('search-button')
      
      await user.type(input, 'CiudadInvalida')
      await user.click(button)

      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
      })

      // Luego hacer una búsqueda exitosa
      mockObtenerClimaPorCiudad.mockResolvedValueOnce({
        temperature: 20,
        humidity: 60,
        description: 'soleado',
        city: 'Madrid',
      })

      // Limpiar el input seleccionando todo y escribiendo de nuevo
      await user.click(input)
      await user.clear(input)
      await user.type(input, 'Madrid')
      await user.click(button)

      await waitFor(() => {
        expect(screen.queryByTestId('error-message')).not.toBeInTheDocument()
        expect(screen.getByTestId('weather-data')).toBeInTheDocument()
      })
    })
  })
})


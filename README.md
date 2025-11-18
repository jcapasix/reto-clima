## Características

- 🔍 Búsqueda de clima por ciudad
- 🌡️ Visualización de temperatura actual
- 💧 Información de humedad
- ☁️ Descripción del clima
- ⚠️ Manejo de errores robusto
- ✅ Pruebas unitarias con cobertura del 80%

## Requisitos Previos

- Node.js 18.x o superior
- npm o yarn
- Una API key de OpenWeatherMap (gratuita en [openweathermap.org](https://openweathermap.org/api))

## Instalación

1. Clona el repositorio o navega al directorio del proyecto:
```bash
cd reto-clima
```

2. Instala las dependencias:
```bash
npm install
```

3. Crea un archivo `.env.local` en la raíz del proyecto:
```bash
cp .env.example .env.local
```

4. Edita `.env.local` y agrega tu API key de OpenWeatherMap:
```
WEATHER_API_KEY=tu_api_key_aqui
```

Para obtener una API key gratuita:
- Visita [https://openweathermap.org/api](https://openweathermap.org/api)
- Crea una cuenta gratuita
- Ve a "API keys" en tu perfil
- Copia tu API key y pégala en el archivo `.env.local`

## Ejecutar la Aplicación

### Modo de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

### Modo de Producción

1. Construye la aplicación:
```bash
npm run build
```

2. Inicia el servidor de producción:
```bash
npm start
```

## Ejecutar las Pruebas

### Ejecutar todas las pruebas:
```bash
npm test
```

### Ejecutar pruebas en modo watch:
```bash
npm run test:watch
```

### Ejecutar pruebas con cobertura:
```bash
npm run test:coverage
```

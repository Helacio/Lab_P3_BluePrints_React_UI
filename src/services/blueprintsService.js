// Elige entre el mock y el API real segun la variable de entorno.
// VITE_USE_MOCK=true  -> apimock
// VITE_USE_MOCK=false -> apiclient
//
// Los dos servicios exponen la misma interfaz, asi que el resto de la
// aplicacion no necesita saber cual esta activo.

import apimock from './apimock.js'
import apiclient from './apiclient.js'

const useMock = import.meta.env.VITE_USE_MOCK === 'true'

const blueprintsService = useMock ? apimock : apiclient

export default blueprintsService

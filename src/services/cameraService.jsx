import privateHttp from './http/privateHttp.config'
import publicHttp from './http/publicHttp.config'

const CAMERA = {
  getCamerasInFarm: async ({ farmId }) => {
    let result = await publicHttp({
      method: 'GET',
      url: `/camera/farm/${farmId}`
    })

    return result
  },
  getCameraByCameraId: async ({ cameraId }) => {
    let result = await publicHttp({
      method: 'GET',
      url: `/camera/${cameraId}`
    })

    return result
  },
  createCamera: async ({ data }) => {
    let result = await privateHttp({
      method: 'POST',
      url: '/camera',
      data
    })

    return result
  },
  updateCamera: async ({ cameraId, data }) => {
    let result = await privateHttp({
      method: 'PATCH',
      url: `/camera/${cameraId}`,
      data
    })

    return result
  },
  deleteCamera: async ({ cameraId }) => {
    let result = await privateHttp({
      method: 'DELETE',
      url: `/camera/${cameraId}`
    })

    return result
  }
}

export default CAMERA

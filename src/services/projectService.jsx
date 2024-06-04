import publicHttp from './http/publicHttp.config'
import privateHttp from './http/privateHttp.config'

const PROJECT = {
  getWeatherByTime: async ({ time }) => {
    return await privateHttp({
      method: 'GET',
      url: `/weather?time=${time}`
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  },

  getPlantFarmingFromProject: async (projectId) => {
    return await publicHttp({
      method: 'GET',
      url: `/project/${projectId}/plantFarming`
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  },

  getProjectByProjectId: async (projectId) => {
    return await publicHttp({
      method: 'GET',
      url: `/project/${projectId}`
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  },

  editProjectInfo: async (data, projectId) => {
    return await privateHttp({
      method: 'PATCH',
      url: `/project/${projectId}`,
      data
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  },

  addPlantFarmingToProject: async ({ data, projectId }) => {
    return await privateHttp({
      method: 'POST',
      url: `/project/${projectId}/plantFarming`,
      data
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  },

  addProcess: async ({ data, projectId }) => {
    return await privateHttp({
      method: 'POST',
      url: `/project/${projectId}/process`,
      data
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  },

  getProcess: async (projectId) => {
    return await publicHttp({
      method: 'GET',
      url: `/project/${projectId}/process`
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  },

  updateProcess: async ({ data, projectId, processId }) => {
    return await privateHttp({
      method: 'PATCH',
      url: `/project/${projectId}/process/${processId}`,
      data
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  },

  deleteProcess: async ({ projectId, processId }) => {
    return await privateHttp({
      method: 'DELETE',
      url: `/project/${projectId}/process/${processId}`
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  },

  updateCameraToProject: async ({ projectId, data }) => {
    return await privateHttp({
      method: 'PATCH',
      url: `/project/${projectId}/camera`,
      data
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  },

  getCameraInProject: async (projectId) => {
    return await publicHttp({
      method: 'GET',
      url: `/project/${projectId}/camera`
    })
      .then((res) => {
        return res
      })
      .catch((err) => {
        return err
      })
  }
}

export default PROJECT

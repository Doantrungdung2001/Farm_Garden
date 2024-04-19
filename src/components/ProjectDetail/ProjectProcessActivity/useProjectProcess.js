import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import PROJECT from '../../../services/projectService'

export default function useProjectProcess({ projectId }) {
  const parseData = useCallback((data) => {
    // base on type of each item in data(list), (type: ['cultivation', 'planting', 'fertilize', 'pesticide', 'other']), classify to 5 list
    const process = {
      cultivation: [],
      planting: [],
      fertilize: [],
      pesticide: [],
      other: []
    }
    data.forEach((item) => {
      process[item.type].push(item)
    })
    return { process }
  }, [])

  const { data, isSuccess, isLoading, refetch } = useQuery({
    queryKey: ['getProcess', projectId],
    queryFn: () => PROJECT.getProcess(projectId),
    staleTime: 20 * 1000,
    select: (data) => parseData(data?.data?.metadata),
    enabled: !!projectId
  })

  const parseDataPlantFarming = useCallback((data) => {
    if (!data)
      return {
        plantFarming: null
      }
    const plantFarming = {
      id: data?._id,
      cultivationActivities: data?.cultivationActivities,
      plantingActivity: [data?.plantingActivity],
      fertilizationActivities: data?.fertilizationActivities,
      pestAndDiseaseControlActivities: data?.pestAndDiseaseControlActivities
    }
    return { plantFarming }
  }, [])

  const {
    data: dataPlantFarming,
    isSuccess: isSuccessPlantFarming,
    isLoading: isLoadingPlantFarming
  } = useQuery({
    queryKey: ['getPlantFarmingFromProject', projectId],
    queryFn: () => PROJECT.getPlantFarmingFromProject(projectId),
    staleTime: 20 * 1000,
    select: (data) => parseDataPlantFarming(data?.data?.metadata),
    enabled: !!projectId
  })

  const parseDataProjectInfo = useCallback((data) => {
    console.log('data: ', data)
    const project = {
      id: data?._id,
      plant: data?.plant,
      seed: data?.seed,
      startDate: data?.startDate,
      square: data?.square,
      status: data?.status,
      description: data?.description,
      isGarden: data?.isGarden,
      projectIndex: data?.projectIndex
    }
    return {
      project
    }
  }, [])

  const { data: dataProjectInfo, isSuccess: isSuccessProjectInfo } = useQuery({
    queryKey: ['projectInfo', projectId],
    queryFn: () => PROJECT.getProjectByProjectId(projectId),
    staleTime: 20 * 1000,
    select: (data) => parseDataProjectInfo(data?.data?.metadata),
    enabled: !!projectId
  })

  return {
    cultivation: data?.process?.cultivation,
    planting: data?.process?.planting,
    fertilize: data?.process?.fertilize,
    pesticide: data?.process?.pesticide,
    other: data?.process?.other,
    isSuccess,
    isLoading,
    refetch,
    cultivationPlantFarming: dataPlantFarming?.plantFarming?.cultivationActivities,
    plantingPlantFarming: dataPlantFarming?.plantFarming?.plantingActivity,
    fertilizePlantFarming: dataPlantFarming?.plantFarming?.fertilizationActivities,
    pesticidePlantFarming: dataPlantFarming?.plantFarming?.pestAndDiseaseControlActivities,
    isSuccessPlantFarming,
    isLoadingPlantFarming,
    projectInfo: dataProjectInfo?.project,
    isSuccessProjectInfo
  }
}

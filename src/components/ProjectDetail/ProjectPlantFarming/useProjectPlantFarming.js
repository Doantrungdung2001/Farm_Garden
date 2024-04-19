import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import PROJECT from '../../../services/projectService'
import PLANT_FARMING from '../../../services/plantFarmingService'

export default function useProjectPlantFarming({
  projectId,
  projectInfo,
  isSuccess,
  isDefaultPlantFarming,
  isFarmPlantFarming
}) {
  const parseData = useCallback((data) => {
    if (!data)
      return {
        plantFarming: null
      }
    const plantFarming = {
      id: data?._id,
      plant: data?.plant,
      seed: data?.seed,
      timeCultivates: data?.timeCultivates,
      cultivationActivities: data?.cultivationActivities,
      plantingActivity: data?.plantingActivity,
      fertilizationActivities: data?.fertilizationActivities,
      pestAndDiseaseControlActivities: data?.pestAndDiseaseControlActivities,
      bestTimeCultivate: data?.bestTimeCultivate,
      farmingTime: data?.farmingTime,
      harvestTime: data?.harvestTime,
      isEdited: data?.isEdited,
      historyPlantFarmingEdit: data?.historyPlantFarmingEdit,
      createdAtTime: data?.createdAtTime
    }
    return { plantFarming }
  }, [])

  const {
    data,
    isSuccess: isSuccessPlantFarming,
    isLoading: isLoadingPlantFarming,
    refetch
  } = useQuery({
    queryKey: ['getPlantFarmingFromProject', projectId],
    queryFn: () => PROJECT.getPlantFarmingFromProject(projectId),
    staleTime: 20 * 1000,
    select: (data) => parseData(data?.data?.metadata),
    enabled: !!projectId
  })

  const parseDataRecommendPlantFarming = useCallback((data) => {
    return {
      recommendPlantFarming: {
        timeCultivates: data?.timeCultivates,
        cultivationActivities: data?.cultivationActivities,
        plantingActivity: data?.plantingActivity,
        fertilizationActivities: data?.fertilizationActivities,
        pestAndDiseaseControlActivities: data?.pestAndDiseaseControlActivities,
        bestTimeCultivate: data?.bestTimeCultivate,
        farmingTime: data?.farmingTime,
        harvestTime: data?.harvestTime
      }
    }
  }, [])

  const {
    data: dataRecommendPlantFarming,
    isSuccess: isSuccessRecommendPlantFarming,
    isLoading: isLoadingRecommendPlantFarming
  } = useQuery({
    queryKey: ['getRecommendPlantFarmingFromPlantNameAndSeedName', projectInfo],
    queryFn: () =>
      PLANT_FARMING.getRecommendPlantFarmingFromPlantNameAndSeedName({
        seedName: projectInfo?.seed?.seed_name,
        plantName: projectInfo?.plant?.plant_name
      }),
    staleTime: 20 * 1000,
    select: (data) => parseDataRecommendPlantFarming(data.data.metadata),
    enabled: !!projectInfo && !!isDefaultPlantFarming && !!isSuccess
  })

  const parseDataFarmPlantFarming = useCallback((data) => {
    const recommendPlantFarmingDefault = data.filter((plantFarming) => plantFarming.isPlantFarmingDefault === true)
    let recommendPlantFarmingTmp = {}
    if (recommendPlantFarmingDefault) {
      recommendPlantFarmingTmp = recommendPlantFarmingDefault[0]
    } else {
      recommendPlantFarmingTmp = data[0]
    }
    return {
      recommendPlantFarming: {
        timeCultivates: recommendPlantFarmingTmp?.timeCultivates,
        cultivationActivities: recommendPlantFarmingTmp?.cultivationActivities,
        plantingActivity: recommendPlantFarmingTmp?.plantingActivity,
        fertilizationActivities: recommendPlantFarmingTmp?.fertilizationActivities,
        pestAndDiseaseControlActivities: recommendPlantFarmingTmp?.pestAndDiseaseControlActivities,
        bestTimeCultivate: recommendPlantFarmingTmp?.bestTimeCultivate,
        farmingTime: recommendPlantFarmingTmp?.farmingTime,
        harvestTime: recommendPlantFarmingTmp?.harvestTime
      }
    }
  }, [])

  const {
    data: dataFarmPlantFarming,
    isSuccess: isSuccessFarmPlantFarming,
    isLoading: isLoadingFarmPlantFarming
  } = useQuery({
    queryKey: ['getPlantFarmingFromSeed', projectInfo],
    queryFn: () => PLANT_FARMING.getPlantFarmingFromSeed(projectInfo?.seed?._id),
    staleTime: 20 * 1000,
    select: (data) => parseDataFarmPlantFarming(data.data.metadata),
    enabled: !!projectInfo && !!isFarmPlantFarming && !!isSuccess
  })

  return {
    plantFarming: data?.plantFarming,
    isSuccessPlantFarming,
    isLoadingPlantFarming,
    refetch,
    dataRecommendPlantFarming: dataRecommendPlantFarming?.recommendPlantFarming,
    isSuccessRecommendPlantFarming,
    isLoadingRecommendPlantFarming,
    dataFarmPlantFarming: dataFarmPlantFarming?.recommendPlantFarming,
    isSuccessFarmPlantFarming,
    isLoadingFarmPlantFarming
  }
}

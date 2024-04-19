import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import PLANT from '../../services/plantService'
import PLANT_FARMING from '../../services/plantFarmingService'

export default function useManagePlant({ seedId, isDefaultPlantFarming }) {
  const farmId = localStorage.getItem('id')
  const parseData = useCallback((data) => {
    const plant = data.map((plant) => ({
      _id: plant._id,
      name: plant.plant_name,
      image: plant.plant_thumb,
      description: plant.plant_description,
      type: plant.plant_type,
      isActive: plant.isActive
    }))
    return { plant }
  }, [])

  const { data, isSuccess, isLoading, refetch } = useQuery({
    queryKey: ['getPlant', farmId],
    queryFn: () => PLANT.getPlantFromFarm(farmId),
    staleTime: 20 * 1000,
    select: (data) => parseData(data.data.metadata),
    enabled: !!farmId
  })

  const parseDataRecommendPlantFarming = useCallback((data) => {
    const recommendPlantFarmingDefault = data.filter((plantFarming) => plantFarming.isPlantFarmingDefault === true)
    let recommendPlantFarmingTmp = {}
    if (recommendPlantFarmingDefault) {
      recommendPlantFarmingTmp = recommendPlantFarmingDefault[0]
    } else {
      recommendPlantFarmingTmp = data[0]
    }
    if (recommendPlantFarmingDefault)
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
    data: dataRecommendPlantFarming,
    isSuccess: isSuccessRecommendPlantFarming,
    isLoading: isLoadingRecommendPlantFarming
  } = useQuery({
    queryKey: ['getPlanFromSeed', seedId],
    queryFn: () => PLANT_FARMING.getPlantFarmingFromSeed(seedId),
    staleTime: 20 * 1000,
    select: (data) => parseDataRecommendPlantFarming(data.data.metadata),
    enabled: !!seedId && !!isDefaultPlantFarming
  })

  return {
    plantData: data?.plant,
    isSuccess,
    isLoading,
    refetch,
    recommendPlantFarming: dataRecommendPlantFarming?.recommendPlantFarming,
    isSuccessRecommendPlantFarming,
    isLoadingRecommendPlantFarming
  }
}

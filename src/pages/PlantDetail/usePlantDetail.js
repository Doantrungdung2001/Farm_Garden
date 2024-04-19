import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import PLANT from '../../services/plantService'
import PLANT_FARMING from '../../services/plantFarmingService'

export default function usePlantDetail({ plantId, seedId, isDefaultPlantFarming }) {
  const parseDataPlans = useCallback((data) => {
    const plans = data.map((plan) => ({
      _id: plan._id,
      name: plan.seed.seed_name,
      description: plan.seed.seed_description,
      image: plan.seed.seed_thumb,
      seedId: plan.seed._id,
      isSeedDefault: plan.seed.isSeedDefault,
      timeCultivates: plan.timeCultivates,
      cultivationActivities: plan.cultivationActivities,
      plantingActivity: plan.plantingActivity,
      fertilizationActivities: plan.fertilizationActivities,
      pestAndDiseaseControlActivities: plan.pestAndDiseaseControlActivities,
      bestTimeCultivate: plan.bestTimeCultivate,
      farmingTime: plan.farmingTime,
      harvestTime: plan.harvestTime
    }))
    return { plans }
  }, [])

  const {
    data: dataPlans,
    isSuccess: isSuccessPlans,
    isLoading: isLoadingPlans,
    refetch: refetchPlans
  } = useQuery({
    queryKey: ['getPlans', plantId],
    queryFn: () => PLANT_FARMING.getListPlantFarmingFromPlant(plantId),
    staleTime: 20 * 1000,
    select: (data) => parseDataPlans(data.data.metadata),
    enabled: !!plantId
  })

  const parseDataCurrentPlant = useCallback((data) => {
    const currentPlant = {
      name: data.plant_name
    }

    return {
      currentPlant
    }
  }, [])

  const {
    data: dataCurrentPlant,
    isSuccess: isSuccessCurrentPlant,
    isLoading: isLoadingCurrentPlant
  } = useQuery({
    queryKey: ['getPlantByPlantId', plantId],
    queryFn: () => PLANT.getPlantByPlantId(plantId),
    staleTime: 20 * 1000,
    select: (data) => parseDataCurrentPlant(data.data.metadata),
    enabled: !!plantId
  })

  const parseDataRecommendPlantFarming = useCallback((data) => {
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

  const parseDataDefaultPlant = useCallback((data) => {
    const defaultPlant = {
      id: data._id,
      name: data.plant_name
    }

    return {
      defaultPlant
    }
  }, [])

  const {
    data: dataDefaultPlant,
    isSuccess: isSuccessDefaultPlant,
    isLoading: isLoadingDefaultPlant
  } = useQuery({
    queryKey: ['defaultPlant'],
    queryFn: () => PLANT.getDefautlPlant(plantId),
    staleTime: 20 * 1000,
    select: (data) => parseDataDefaultPlant(data.data.metadata),
    enabled: !!plantId
  })

  return {
    plans: dataPlans?.plans,
    isSuccessPlans,
    isLoadingPlans,
    refetchPlans,
    currentPlant: dataCurrentPlant?.currentPlant,
    isSuccessCurrentPlant,
    isLoadingCurrentPlant,
    recommendPlantFarming: dataRecommendPlantFarming?.recommendPlantFarming,
    isSuccessRecommendPlantFarming,
    isLoadingRecommendPlantFarming,
    defaultPlant: dataDefaultPlant?.defaultPlant,
    isSuccessDefaultPlant,
    isLoadingDefaultPlant
  }
}

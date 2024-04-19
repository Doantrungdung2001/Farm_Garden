import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import SEED from '../../../services/seedService'

export default function useAddSeedPopup({ plantId, currentPlantId }) {
  const parseDataAllSeedFromPlant = useCallback((data) => {
    const allSeedsFromPlant = data.map((item) => {
      return {
        id: item?._id,
        name: item?.seed_name,
        image: item?.seed_thumb,
        description: item?.seed_description
      }
    })

    return {
      allSeedsFromPlant
    }
  }, [])

  const {
    data: dataAllSeedFromPlant,
    isSuccess: isSuccessAllSeedFromPlant,
    isLoading: isLoadingAllSeedFromPlant
  } = useQuery({
    queryKey: ['getAllSeedFromPlant', plantId],
    queryFn: () => SEED.getAllSeedByPlantId(plantId),
    staleTime: 20 * 1000,
    select: (data) => parseDataAllSeedFromPlant(data.data.metadata),
    enabled: !!plantId
  })

  const parseDataAllSeedFromPlantInFarm = useCallback((data) => {
    const allSeedsFromPlantInFarm = data.map((item) => {
      return {
        id: item?._id,
        name: item?.seed_name,
        image: item?.seed_thumb,
        description: item?.seed_description
      }
    })

    return {
      allSeedsFromPlantInFarm
    }
  }, [])

  const {
    data: dataAllSeedFromPlantInFarm,
    isSuccess: isSuccessAllSeedFromPlantInFarm,
    isLoading: isLoadingAllSeedFromPlantInFarm
  } = useQuery({
    queryKey: ['getAllSeedFromPlantInFarm', currentPlantId],
    queryFn: () => SEED.getAllSeedByPlantId(currentPlantId),
    staleTime: 20 * 1000,
    select: (data) => parseDataAllSeedFromPlantInFarm(data.data.metadata),
    enabled: !!currentPlantId
  })

  return {
    allSeedFromPlant: dataAllSeedFromPlant?.allSeedsFromPlant || [],
    isSuccessAllSeedFromPlant,
    isLoadingAllSeedFromPlant,
    allSeedFromPlantInFarm: dataAllSeedFromPlantInFarm?.allSeedsFromPlantInFarm || [],
    isSuccessAllSeedFromPlantInFarm,
    isLoadingAllSeedFromPlantInFarm
  }
}

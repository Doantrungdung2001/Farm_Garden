import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import GARDEN from '../../../services/gardenService'

export default function useGardenProjectInput(gardenId) {
  const parseData = useCallback((data) => {
    const gardens = data.map((item) => ({
      _id: item?._id,
      plantImage: item?.plant.plant_thumb,
      name: item?.plant.plant_name,
      startDate: item?.startDate,
      input: {
        seed: item?.seed.seed_name,
        initDate: item?.startDate
      },
      plant: {
        id: item?.plant._id,
        name: item?.plant.plant_name
      },
      status: item?.status
    }))
    return { gardens }
  }, [])

  const { data, isSuccess, isLoading, refetch } = useQuery({
    queryKey: ['getGardenInput', gardenId],
    queryFn: () => GARDEN.getGardenInput(gardenId),
    staleTime: 20 * 1000,
    select: (data) => parseData(data?.data?.metadata),
    enabled: !!gardenId
  })

  return {
    initData: data?.gardens,
    isSuccess,
    isLoading,
    refetch
  }
}

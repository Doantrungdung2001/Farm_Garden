import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import PLANT from '../../../services/plantService'

export default function useAddProject() {
  const farmId = localStorage.getItem('id')
  const parseData = useCallback((data) => {
    const plant = data.map((plant) => ({
      _id: plant._id,
      name: plant.plant_name,
      image: plant.plant_thumb
    }))
    return { plant }
  }, [])

  const { data, isSuccess, isLoading } = useQuery({
    queryKey: ['getPlant', farmId],
    queryFn: () => PLANT.getPlantFromFarm(farmId),
    staleTime: 20 * 1000,
    select: (data) => parseData(data.data.metadata),
    enabled: !!farmId
  })

  const parseDataAllPlants = useCallback((data) => {
    const allPlants = data
      .map((item) => {
        return {
          id: item?._id,
          name: item?.plant_name,
          image: item?.plant_thumb,
          type: item?.plant_type,
          isActive: item?.isActive
        }
      })
      .filter((item) => item.isActive)

    return {
      allPlants
    }
  }, [])

  const {
    data: dataAllPlantInFarm,
    isSuccess: isSuccessAllPlants,
    isLoading: isLoadingAllPlants,
    refetch
  } = useQuery({
    queryKey: ['allPlant'],
    queryFn: () => PLANT.getAllPlant(),
    staleTime: 20 * 1000,
    select: (data) => parseDataAllPlants(data.data.metadata)
  })

  return {
    allPlants: dataAllPlantInFarm?.allPlants || [],
    isSuccessAllPlants,
    isLoadingAllPlants,
    refetch,
    plantInFarm: data?.plant,
    isSuccess
  }
}

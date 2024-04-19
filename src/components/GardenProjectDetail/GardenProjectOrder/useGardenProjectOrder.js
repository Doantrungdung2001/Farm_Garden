import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import GARDEN from '../../../services/gardenService'

export default function useGardenProjectOrder(gardenId) {
  const parseData = useCallback((data) => {
    const garden = {
      _id: data?._id,
      startDate: data?.startDate,
      template: data?.gardenServiceTemplate,
      client: data?.client,
      herbList: data?.gardenServiceRequest?.herbList.map((item) => ({
        _id: item?._id,
        name: item?.plant_name
      })),
      leafyList: data?.gardenServiceRequest?.leafyList.map((item) => ({
        _id: item?._id,
        name: item?.plant_name
      })),
      rootList: data?.gardenServiceRequest?.rootList.map((item) => ({
        _id: item?._id,
        name: item?.plant_name
      })),
      fruitList: data?.gardenServiceRequest?.fruitList.map((item) => ({
        _id: item?._id,
        name: item?.plant_name
      })),
      status: data?.status
    }
    return { garden }
  }, [])

  const { data, isSuccess, isLoading, refetch } = useQuery({
    queryKey: ['getGardenByGardenId', gardenId],
    queryFn: () => GARDEN.getGardenByGardenId(gardenId),
    staleTime: 20 * 1000,
    select: (data) => parseData(data?.data?.metadata),
    enabled: !!gardenId
  })

  return {
    initData: data?.garden,
    isSuccess,
    isLoading,
    refetch
  }
}

import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import GARDEN_SERVICE_REQUEST from '../../services/gardenServiceRequest'

export default function useManageRequest() {
  const farmId = localStorage.getItem('id')
  const parseData = useCallback((data) => {
    const gardenServiceRequest = data.map((item) => ({
      _id: item?._id,
      status: item?.status,
      date: item?.time,
      name: item?.client.name,
      phone: item?.client.phone || 'Không có thông tin',
      address: item?.client.address || 'Không có thông tin',
      square: item?.gardenServiceTemplate.square,
      price: item?.gardenServiceTemplate.price,
      herbMax: item?.gardenServiceTemplate.herbMax,
      leafyMax: item?.gardenServiceTemplate.leafyMax,
      rootMax: item?.gardenServiceTemplate.rootMax,
      fruitMax: item?.gardenServiceTemplate.fruitMax,
      expectedOutput: item?.gardenServiceTemplate.expectedOutput,
      expectDeliveryPerWeek: item?.gardenServiceTemplate.expectDeliveryPerWeek,
      expectDeliveryAmount: item?.gardenServiceTemplate.expectDeliveryAmount,
      note: item?.note,
      herbList: item?.herbList
        ? item?.herbList.map((herb) => ({
            id: herb._id,
            name: herb.plant_name
          }))
        : [],
      leafyList: item?.leafyList
        ? item?.leafyList.map((leafy) => ({
            id: leafy._id,
            name: leafy.plant_name
          }))
        : [],
      rootList: item?.rootList
        ? item?.rootList.map((root) => ({
            id: root._id,
            name: root.plant_name
          }))
        : [],
      fruitList: item?.fruitList
        ? item?.fruitList.map((fruit) => ({
            id: fruit._id,
            name: fruit.plant_name
          }))
        : []
    }))

    return { gardenServiceRequest }
  }, [])

  const { data, isSuccess, isLoading, refetch } = useQuery({
    queryKey: ['getGardenServiceRequest', farmId],
    queryFn: () => GARDEN_SERVICE_REQUEST.getGardenServiceRequest(farmId),
    staleTime: 20 * 1000,
    select: (data) => parseData(data?.data?.metadata),
    enabled: !!farmId
  })

  return {
    requests: data?.gardenServiceRequest,
    isSuccess,
    isLoading,
    refetch
  }
}

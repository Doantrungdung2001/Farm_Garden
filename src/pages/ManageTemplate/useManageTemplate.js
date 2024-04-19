import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import GARDEN_SERVICE_TEMPLATE from '../../services/gardenServiceTemplate'

export default function useManageTemplate() {
  const farmId = localStorage.getItem('id')
  const parseData = useCallback((data) => {
    const gardenServiceTemplate = data.map((item) => ({
      _id: item?._id,
      square: item?.square,
      herbMax: item?.herbMax,
      leafyMax: item?.leafyMax,
      rootMax: item?.rootMax,
      fruitMax: item?.fruitMax,
      expectedOutput: item?.expectedOutput,
      expectDeliveryPerWeek: item?.expectDeliveryPerWeek,
      price: item?.price,
      expectDeliveryAmount: item?.expectDeliveryAmount
    }))
    return { gardenServiceTemplate }
  }, [])

  const { data, isSuccess, isLoading, refetch } = useQuery({
    queryKey: ['getServiceTemplate', farmId],
    queryFn: () => GARDEN_SERVICE_TEMPLATE.getServiceTemplate(farmId),
    staleTime: 20 * 1000,
    select: (data) => parseData(data?.data?.metadata),
    enabled: !!farmId
  })

  return {
    templates: data?.gardenServiceTemplate,
    isSuccess,
    isLoading,
    refetch
  }
}

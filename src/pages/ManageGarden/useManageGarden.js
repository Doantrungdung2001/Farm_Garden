import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import GARDEN from '../../services/gardenService'

export default function useManageGarden() {
  const farmId = localStorage.getItem('id')
  const parseData = useCallback((data) => {
    const gardens = data.map((item) => ({
      _id: item?._id,
      startDate: item?.startDate,
      template: item?.gardenServiceTemplate,
      client: item?.client,
      status: item?.status,
      gardenServiceRequest: item?.gardenServiceRequest
    }))
    return { gardens }
  }, [])

  const { data, isSuccess, isLoading, refetch } = useQuery({
    queryKey: ['getGardens', farmId],
    queryFn: () => GARDEN.getGardens(farmId),
    staleTime: 20 * 1000,
    select: (data) => parseData(data?.data?.metadata),
    enabled: !!farmId
  })

  return {
    gardens: data?.gardens,
    isSuccess,
    isLoading,
    refetch
  }
}

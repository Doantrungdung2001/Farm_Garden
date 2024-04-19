import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import GARDEN from '../../../services/gardenService'
import { formatDateTime } from '../../../utils/helpers'

export default function useGardenProjectClientRequest(gardenId) {
  const parseData = useCallback((data) => {
    const gardenClientRequest = data.map((item) => {
      if (item.type === 'deliveryRequest') {
        return {
          time: formatDateTime(item.time),
          type: 'Cây sẽ giao',
          detail:
            item.deliveryDetails
              .map((detailItem) => `${detailItem.plant.plant_name}: ${detailItem.amount}kg`)
              .join(', ') + ` (${item.note || 'Không có ghi chú'})`,
          id: item._id
        }
      } else if (item.type === 'newPlant') {
        return {
          time: formatDateTime(item.time),
          type: 'Trồng cây mới',
          detail: `${item.newPlant.plant_name} (${item.note || 'Không có ghi chú'})`,
          id: item._id
        }
      } else {
        return {
          time: formatDateTime(item.time),
          type: 'Khác',
          detail: item.note,
          id: item._id
        }
      }
    })
    return { gardenClientRequest }
  }, [])

  const { data, isSuccess, isLoading, refetch } = useQuery({
    queryKey: ['getClientRequest', gardenId],
    queryFn: () => GARDEN.getClientRequest(gardenId),
    staleTime: 20 * 1000,
    select: (data) => parseData(data?.data?.metadata),
    enabled: !!gardenId
  })

  return {
    initData: data?.gardenClientRequest,
    isSuccess,
    isLoading,
    refetch
  }
}

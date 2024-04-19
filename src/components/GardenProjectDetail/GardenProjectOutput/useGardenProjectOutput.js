import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import GARDEN from '../../../services/gardenService'
import { formatDateTime } from '../../../utils/helpers'

export default function useGardenProjectOutput(gardenId) {
  const parseData = useCallback((data) => {
    const output = {
      coming: [],
      done: [],
      cancel: []
    }
    data.forEach((item) => {
      output[item.status].push({
        id: item?._id,
        time: formatDateTime(item?.time),
        plants: item?.deliveryDetails.map((detail) => ({
          name: detail?.plant.plant_name,
          plantId: detail?.plant._id,
          amount: detail?.amount,
          id: detail?._id
        })),
        note: item?.note,
        status: item?.status,
        clientAccept: item?.clientAccept,
        clientNote: item?.clientNote
      })
    })
    return { output }
  }, [])

  const { data, isSuccess, isLoading, refetch } = useQuery({
    queryKey: ['getGardenOutput', gardenId],
    queryFn: () => GARDEN.getGardenOutput(gardenId),
    staleTime: 20 * 1000,
    select: (data) => parseData(data?.data?.metadata),
    enabled: !!gardenId
  })

  const parseDataListPlant = useCallback((data) => {
    const listPlant = data.map((item) => ({
      id: item?._id,
      plantId: item?.plant._id,
      name: item?.plant.plant_name,
      status: item?.status
    }))
    return { listPlant }
  }, [])

  const {
    data: dataListPlant,
    isSuccess: isSuccessListPlant,
    isLoading: isLoadingListPlant
  } = useQuery({
    queryKey: ['getGardenInput', gardenId],
    queryFn: () => GARDEN.getGardenInput(gardenId),
    staleTime: 20 * 1000,
    select: (data) => parseDataListPlant(data?.data?.metadata),
    enabled: !!gardenId
  })

  return {
    comingDeliveries: data?.output.coming,
    doneDeliveries: data?.output.done,
    cancelDeliveries: data?.output.cancel,
    isSuccess,
    isLoading,
    refetch,
    listPlant: dataListPlant?.listPlant,
    isSuccessListPlant,
    isLoadingListPlant
  }
}

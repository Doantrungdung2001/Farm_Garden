import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import FARM from '../../services/farmService'
import { titleCase } from '../../utils/constant'

export default function useProfile() {
  const farmId = localStorage.getItem('id')
  console.log(farmId)
  const parseData = useCallback((data) => {
    const profile = {
      _id: data?._id,
      name: data?.name,
      description: data?.description,
      district: data?.district ? titleCase(data?.district) : null,
      address: data?.address,
      images: data?.images,
      lat: data?.lat,
      lng: data?.lng,
      phone: data?.phone,
      email: data?.email
    }
    return { profile }
  }, [])

  const { data, isSuccess, isLoading, refetch } = useQuery({
    queryKey: ['getProfile', farmId],
    queryFn: () => FARM.getProfile({ farmId }),
    staleTime: 20 * 1000,
    select: (data) => parseData(data?.data?.metadata),
    enabled: !!farmId
  })

  return {
    profile: data?.profile,
    isSuccess,
    isLoading,
    refetch
  }
}

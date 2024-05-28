import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import CAMERA from '../../services/cameraService'

export default function useProjectOtherInfo() {
  const farmId = localStorage.getItem('id')

  const parseDataCamera = useCallback((data) => {
    const cameraData = data.map((camera) => {
      return {
        _id: camera?._id,
        name: camera?.name,
        rtsp_link: camera?.rtsp_link
      }
    })
    return {
      cameraData
    }
  }, [])

  const {
    data: cameraData,
    isSuccess: isSuccessCamera,
    isLoading: isLoadingCamera,
    refetch: refetchCamera,
    isError: isErrorCamera
  } = useQuery({
    queryKey: ['farmCamera', farmId],
    queryFn: () => CAMERA.getCamerasInFarm({ farmId }),
    staleTime: 20 * 1000,
    select: (data) => parseDataCamera(data?.data?.metadata),
    enabled: !!farmId
  })

  return {
    cameraData: cameraData?.cameraData,
    isSuccessCamera,
    isLoadingCamera,
    refetchCamera,
    isErrorCamera
  }
}

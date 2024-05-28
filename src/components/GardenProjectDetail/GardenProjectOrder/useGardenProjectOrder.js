import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import GARDEN from '../../../services/gardenService'
import CAMERA from '../../../services/cameraService'

export default function useGardenProjectOrder(gardenId) {
  const farmId = localStorage.getItem('id')
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
    refetch: refetchCamera
  } = useQuery({
    queryKey: ['farmCamera', farmId],
    queryFn: () => CAMERA.getCamerasInFarm({ farmId }),
    staleTime: 20 * 1000,
    select: (data) => parseDataCamera(data?.data?.metadata),
    enabled: !!farmId
  })

  const parseDataCameraInGarden = useCallback((data) => {
    const cameraInGarden = data.map((camera) => {
      return {
        _id: camera?._id,
        name: camera?.name,
        rtsp_link: camera?.rtsp_link
      }
    })
    return {
      cameraInGarden
    }
  }, [])

  const {
    data: cameraInGarden,
    isSuccess: isSuccessCameraInGarden,
    isLoading: isLoadingCameraInGarden,
    refetch: refetchCameraInGarden
  } = useQuery({
    queryKey: ['cameraInGarden', gardenId],
    queryFn: () => GARDEN.getCameraInGarden(gardenId),
    staleTime: 20 * 1000,
    select: (data) => parseDataCameraInGarden(data?.data?.metadata),
    enabled: !!gardenId
  })

  return {
    initData: data?.garden,
    isSuccess,
    isLoading,
    refetch,
    cameraData: cameraData?.cameraData,
    isSuccessCamera,
    isLoadingCamera,
    refetchCamera,
    cameraInGarden: cameraInGarden?.cameraInGarden,
    isSuccessCameraInGarden,
    isLoadingCameraInGarden,
    refetchCameraInGarden
  }
}

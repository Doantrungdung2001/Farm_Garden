import { useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import PROJECT from '../../../services/projectService'
import CAMERA from '../../../services/cameraService'

export default function useProjectInput({ projectId }) {
  const farmId = localStorage.getItem('id')
  const parseData = useCallback((data) => {
    const project = {
      id: data?._id,
      plant: data?.plant,
      seed: data?.seed,
      startDate: data?.startDate,
      square: data?.square,
      status: data?.status,
      description: data?.description,
      txHash: data?.txHash,
      createdAtTime: data?.createdAtTime,
      isInfoEdited: data?.isInfoEdited,
      historyInfo: data?.historyInfo,
      projectIndex: data?.projectIndex
    }
    return {
      project
    }
  }, [])

  const { data, isSuccess, isLoading, refetch } = useQuery({
    queryKey: ['projectInfo', projectId],
    queryFn: () => PROJECT.getProjectByProjectId(projectId),
    staleTime: 20 * 1000,
    select: (data) => parseData(data?.data?.metadata),
    enabled: !!projectId
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

  const parseDataCameraInProject = useCallback((data) => {
    const cameraInProject = data.map((camera) => {
      return {
        _id: camera?._id,
        name: camera?.name,
        rtsp_link: camera?.rtsp_link
      }
    })
    return {
      cameraInProject
    }
  }, [])

  const {
    data: cameraInProject,
    isSuccess: isSuccessCameraInProject,
    isLoading: isLoadingCameraInProject,
    refetch: refetchCameraInProject
  } = useQuery({
    queryKey: ['cameraInProject', projectId],
    queryFn: () => PROJECT.getCameraInProject(projectId),
    staleTime: 20 * 1000,
    select: (data) => parseDataCameraInProject(data?.data?.metadata),
    enabled: !!projectId
  })

  return {
    projectInfo: data?.project,
    isSuccess,
    isLoading,
    refetch,
    cameraData: cameraData?.cameraData,
    isSuccessCamera,
    isLoadingCamera,
    refetchCamera,
    cameraInProject: cameraInProject?.cameraInProject,
    isSuccessCameraInProject,
    isLoadingCameraInProject,
    refetchCameraInProject
  }
}

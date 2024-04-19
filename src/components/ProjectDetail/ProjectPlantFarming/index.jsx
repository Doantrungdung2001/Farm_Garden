import React, { useState } from 'react'
import useProjectPlantFarming from './useProjectPlantFarming'
import Loading from '../../../pages/Loading'
import AddPlantFarmingPopup from '../../ManagePlant/AddPlantFarmingPopup'
import PLANT_FARMING from '../../../services/plantFarmingService'
import { Button, Divider, Table } from 'antd'
import SelectOptionConfirmationModal from './SelectOptionConfirmationModal'
import useProjectInput from '../ProjectInput/useProjectInput'
import PROJECT from '../../../services/projectService'
import EditPlantFarmingHistory from './EditPlantFarmingHistory'

const ProjectFarming = ({ projectId }) => {
  const [openUpdatePlantFarming, setOpenUpdatePlantFarming] = useState(false)
  const [openAddPlantFarming, setOpenAddPlantFarming] = useState(false)
  const [opneConfirmPlantFarming, setOpenConfirmPlantFarming] = useState(false)
  const [isDefaultPlantFarming, setIsDefaultPlantFarming] = useState(false)
  const [isFarmPlantFarming, setIsFarmPlantFarming] = useState(false)
  console.log("projectId:", projectId)
  const { projectInfo, isSuccess } = useProjectInput({ projectId })
  console.log("isSuccess: ", isSuccess)
  const {
    plantFarming,
    isSuccessPlantFarming,
    refetch,
    dataRecommendPlantFarming,
    isSuccessRecommendPlantFarming,
    dataFarmPlantFarming,
    isSuccessFarmPlantFarming
  } = useProjectPlantFarming({
    projectId,
    projectInfo,
    isSuccess,
    isDefaultPlantFarming,
    isFarmPlantFarming
  })
  console.log("isSuccessPlantFarming: ", isSuccessPlantFarming)

  const handleUpdatePlantFarming = async (values) => {
    try {
      await PLANT_FARMING.updatePlantFarming({
        plantFarmingId: plantFarming.id,
        data: values
      })
      refetch()
      setOpenUpdatePlantFarming(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleAddPlantFarming = async (values) => {
    try {
      await PROJECT.addPlantFarmingToProject({
        projectId: projectId,
        data: values
      })
      refetch()
      setOpenAddPlantFarming(false)
    } catch (error) {
      console.error(error)
    }
  }

  const timeCultivatesColumns = [
    {
      title: 'Tháng bắt đầu',
      dataIndex: 'start',
      key: 'start'
    },
    {
      title: 'Tháng kết thúc',
      dataIndex: 'end',
      key: 'end'
    }
  ]

  const timeCultivatesDataSource = (item) =>
    item.timeCultivates.map((timeCultivate, index) => ({
      ...timeCultivate,
      key: index
    }))

  const cultivationActivitiesColumns = [
    {
      title: 'Tên hoạt động',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description'
    }
  ]

  const cultivationActivitiesDataSource = (cultivationActivities) =>
    cultivationActivities.map((cultivationActivity, index) => ({
      ...cultivationActivity,
      key: index
    }))

  const fertilizationActivitiesColumns = [
    {
      title: 'Thời gian',
      dataIndex: 'fertilizationTime',
      key: 'fertilizationTime',
      width: '35%'
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      width: '8%',
      render: (type) => (type === 'baseFertilizer' ? 'Bón lót' : type === 'topFertilizer' ? 'Bón thúc' : type)
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description'
    }
  ]

  const fertilizationActivitiesDataSource = (fertilizationActivities) =>
    fertilizationActivities.map((fertilizationActivity, index) => ({
      ...fertilizationActivity,
      key: index
    }))

  const pestAndDiseaseControlActivitiesColumns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (type === 'pest' ? 'Sâu' : type === 'disease' ? 'Bệnh' : type)
    },
    {
      title: 'Triệu chứng',
      dataIndex: 'symptoms',
      key: 'symptoms'
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'Giải pháp',
      dataIndex: 'solution',
      key: 'solution',
      render: (solution) => (
        <ul>
          {solution.map((sol, index) => (
            <li key={index}>{sol}</li>
          ))}
        </ul>
      )
    }
  ]

  const pestAndDiseaseControlActivitiesDataSource = (pestAndDiseaseControlActivities) =>
    pestAndDiseaseControlActivities.map((activity, index) => ({
      ...activity,
      key: index
    }))

  if (!isSuccessPlantFarming || !isSuccess) {
    return <Loading />
  }
  if (plantFarming === null && isSuccessPlantFarming) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold' }}>Dự án này chưa có Quy trình canh tác</h1>
        <button onClick={() => setOpenConfirmPlantFarming(true)} style={{ fontSize: '24px', marginTop: '20px' }}>
          Khởi tạo quy trình canh tác
        </button>
        <SelectOptionConfirmationModal
          visible={opneConfirmPlantFarming}
          onCancel={() => setOpenConfirmPlantFarming(false)}
          onContinueWithEmpty={() => {
            setIsDefaultPlantFarming(false)
            setIsFarmPlantFarming(false)
            setOpenConfirmPlantFarming(false)
            setOpenAddPlantFarming(true)
          }}
          onContinueWithRecommendPlantFarming={() => {
            setIsFarmPlantFarming(false)
            setIsDefaultPlantFarming(true)
            setOpenConfirmPlantFarming(false)
            setOpenAddPlantFarming(true)
          }}
          onContinueWithFarmPlantfarming={() => {
            setIsDefaultPlantFarming(false)
            setIsFarmPlantFarming(true)
            setOpenConfirmPlantFarming(false)
            setOpenAddPlantFarming(true)
          }}
        />
        {isSuccessRecommendPlantFarming && isDefaultPlantFarming && (
          <AddPlantFarmingPopup
            open={openAddPlantFarming}
            onCancel={() => {
              setIsDefaultPlantFarming(false)
              setOpenAddPlantFarming(false)
            }}
            onCreate={handleAddPlantFarming}
            recommendPlantFarming={dataRecommendPlantFarming}
            isUpdate={true}
          />
        )}
        {isSuccessFarmPlantFarming && isFarmPlantFarming && (
          <AddPlantFarmingPopup
            open={openAddPlantFarming}
            onCancel={() => {
              setIsFarmPlantFarming(false)
              setOpenAddPlantFarming(false)
            }}
            onCreate={handleAddPlantFarming}
            recommendPlantFarming={dataFarmPlantFarming}
            isUpdate={true}
          />
        )}
        {!isFarmPlantFarming && !isDefaultPlantFarming && (
          <AddPlantFarmingPopup
            open={openAddPlantFarming}
            onCancel={() => {
              setOpenAddPlantFarming(false)
            }}
            onCreate={handleAddPlantFarming}
            recommendPlantFarming={null}
          />
        )}
      </div>
    )
  } else {
    // Nếu có plantFarming, hiển thị nó
    return (
      <div>
        <h2>{`Quy trình canh tác cho cây ${projectInfo.plant?.plant_name} với hạt giống ${projectInfo.seed?.seed_name}`}</h2>
        <Button
          type="primary"
          onClick={() => {
            setOpenUpdatePlantFarming(true)
          }}
          style={{ marginRight: '20px' }}
        >
          Chỉnh sửa
        </Button>
        {plantFarming.isEdited ? (
          <EditPlantFarmingHistory historyPlantFarmingEdit={plantFarming.historyPlantFarmingEdit} />
        ) : null}
        <AddPlantFarmingPopup
          open={openUpdatePlantFarming}
          onCancel={() => setOpenUpdatePlantFarming(false)}
          onCreate={handleUpdatePlantFarming}
          recommendPlantFarming={plantFarming}
          isUpdate={true}
        />
        <div>
          {/* time cultivates: [{ start, end }] */}
          <h2> Thời gian canh tác </h2>
          <Table
            columns={timeCultivatesColumns}
            dataSource={timeCultivatesDataSource(plantFarming)}
            pagination={false}
          />
        </div>
        <Divider />
        <div>
          {/* bestTimeCultivate: {start, end} */}
          <h2> Thời gian canh tác tốt nhất </h2>
          <p>Tháng bắt đầu: {plantFarming.bestTimeCultivate.start}</p>
          <p>Tháng kết thúc: {plantFarming.bestTimeCultivate.end}</p>
        </div>

        <Divider />
        {/* farmingTime: number */}
        <p>Thời gian trồng cây: {plantFarming.farmingTime} ngày</p>
        <Divider />
        {/* harvestTime: number */}
        <p>Thời gian thu hoạch: {plantFarming.harvestTime} ngày</p>
        <Divider />
        <div>
          {/* cultivationActivities: [{name, description}] */}
          <h2> Hoạt động với đất </h2>
          <Table
            columns={cultivationActivitiesColumns}
            dataSource={cultivationActivitiesDataSource(plantFarming.cultivationActivities)}
            pagination={false}
          />
        </div>
        <Divider />
        <div>
          {/*  plantingActivity: {density, description} */}
          <h2> Hoạt động trong gieo trồng </h2>
          <p>
            <strong>Mật độ:</strong> {plantFarming?.plantingActivity?.density}
          </p>
          <p>
            <strong>Mô tả:</strong> {plantFarming?.plantingActivity?.description}
          </p>
        </div>
        <Divider />
        <div>
          {/* fertilizationActivities: [{ fertilizationTime, type, description }] */}
          <h2> Hoạt động phân bón </h2>
          <Table
            columns={fertilizationActivitiesColumns}
            dataSource={fertilizationActivitiesDataSource(plantFarming.fertilizationActivities)}
          />
        </div>
        <Divider />
        <div>
          {/* pestAndDiseaseControlActivities: [{name, type, symptoms, description, solution: [string], note}] */}
          <h2> Hoạt động phòng ngừa sâu, bệnh </h2>
          <Table
            columns={pestAndDiseaseControlActivitiesColumns}
            dataSource={pestAndDiseaseControlActivitiesDataSource(plantFarming.pestAndDiseaseControlActivities)}
          />
        </div>
        <Divider />
      </div>
    )
  }
}

export default ProjectFarming

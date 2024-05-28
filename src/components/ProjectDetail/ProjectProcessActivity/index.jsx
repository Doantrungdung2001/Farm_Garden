import React, { useState } from 'react'
import { Row, Col, Card, notification } from 'antd'
import useProjectProcess from './useProjectProcess'
import Loading from '../../../pages/Loading'
import CultivationTable from './CultivationActivity'
import PlantingTable from './PlantingActivity'
import FertilizeTable from './FertilizationActivity'
import OtherTable from './OtherActivity'
import PesticideTable from './PesticideActivity'

import PROJECT from '../../../services/projectService'

const ProcessActivityPage = ({ projectId }) => {
  const [loading, setLoading] = useState(false)
  const {
    cultivation,
    planting,
    fertilize,
    pesticide,
    other,
    isSuccess,
    refetch,
    cultivationPlantFarming,
    plantingPlantFarming,
    fertilizePlantFarming,
    pesticidePlantFarming,
    isSuccessPlantFarming,
    projectInfo,
    isSuccessProjectInfo
  } = useProjectProcess({
    projectId
  })

  const [api, contextHolder] = notification.useNotification()
  const openNotificationWithIcon = (type, title, content) => {
    api[type]({
      message: title,
      description: content,
      duration: 3.5
    })
  }

  const handleAddProcess = async (values) => {
    //     {
    //   "time": "2024-02-22T02:46:53.882Z",
    //   "type": "cultivation",
    //   "cultivationActivity": {
    //     "name": "Vệ sinh vườn",
    //     "description": "Vệ sinh vườn, dọn sạch các tàn dư thực vật của vụ trước, rải vôi cày xới kỹ sâu khoảng 20-25cm. "
    //   }
    // }
    console.log('Received values of form: ', values)
    console.log('projectInfo?.projectIndex:', projectInfo?.projectIndex)
    setLoading(true)

    try {
      setLoading(false)
      const res = await PROJECT.addProcess({
        data: {
          ...values
        },
        projectId
      })
      if (res.status === 200) {
        refetch()
        openNotificationWithIcon('success', 'Thông báo', 'Thêm thành công')
      } else {
        openNotificationWithIcon('error', 'Thông báo', 'Thêm thất bại')
      }
    } catch (error) {
      setLoading(false)
      console.log('error: ', error)
      openNotificationWithIcon('error', 'Thông báo', 'Thêm thất bại')
    }
  }

  const handleUpdateProcess = async (values) => {
    // {
    //   "processId": "65d6b5a0f0e5b78ef7694aa2",
    //   "time": "2024-02-22T02:46:53.882Z",
    //   "type": "cultivation",
    //   "cultivationActivity": {
    //     "name": "Vệ sinh vườn",
    //     "description": "Vệ sinh vườn, dọn sạch các tàn dư thực vật của vụ trước, rải vôi cày xới kỹ sâu khoảng 20-25cm. Update ở đây."
    //   }
    // }
    console.log('Received values of form: ', values)
    setLoading(true)
    try {
      const { processId, ...updateProcess } = values
      const res = await PROJECT.updateProcess({
        data: {
          ...updateProcess
        },
        projectId,
        processId
      })
      setLoading(false)
      if (res.status === 200) {
        refetch()
        openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
      } else {
        openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại')
      }
    } catch (error) {
      setLoading(false)
      console.log('error: ', error)
      openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại')
    }
  }

  const handleDeleteProcess = async (processId) => {
    console.log('Delete process: ', processId)
    const res = await PROJECT.deleteProcess({ projectId, processId })
    if (res.status === 200) {
      refetch()
      openNotificationWithIcon('success', 'Thông báo', 'Xóa thành công')
    } else {
      openNotificationWithIcon('error', 'Thông báo', 'Xóa thất bại')
    }
  }

  return isSuccess && isSuccessPlantFarming && isSuccessProjectInfo ? (
    <>
      {contextHolder}
      <div style={{ padding: '24px' }}>
        <Row gutter={[16, 16]}>
          {/* Cultivation Activity */}
          <Col span={24}>
            <Card title="Hoạt động với đất">
              {/* List of cultivation activities */}
              <CultivationTable
                cultivation={cultivation}
                cultivationPlantFarming={cultivationPlantFarming}
                handleAddProcess={handleAddProcess}
                handleUpdateProcess={handleUpdateProcess}
                handleDeleteProcess={handleDeleteProcess}
                isGarden={projectInfo.isGarden}
                loading={loading}
              />
            </Card>
          </Col>

          {/* Planting Activity */}
          <Col span={24}>
            <Card title="Hoạt động gieo trồng">
              {/* Display planting activity */}
              <PlantingTable
                planting={planting}
                plantingPlantFarming={plantingPlantFarming}
                handleAddProcess={handleAddProcess}
                handleUpdateProcess={handleUpdateProcess}
                handleDeleteProcess={handleDeleteProcess}
                isGarden={projectInfo.isGarden}
                loading={loading}
              />
            </Card>
          </Col>

          {/* Fertilization Activity */}
          <Col span={24}>
            <Card title="Hoạt động bón phân">
              {/* Display fertilization activity */}
              <FertilizeTable
                fertilize={fertilize}
                fertilizePlantFarming={fertilizePlantFarming}
                handleAddProcess={handleAddProcess}
                handleUpdateProcess={handleUpdateProcess}
                handleDeleteProcess={handleDeleteProcess}
                isGarden={projectInfo.isGarden}
                loading={loading}
              />
            </Card>
          </Col>

          {/* Pest and Disease Control Activity */}
          <Col span={24}>
            <Card title="Hoạt động phòng ngừa sâu bệnh">
              {/* Display pest and disease control activity */}
              <PesticideTable
                pesticide={pesticide}
                pesticidePlantFarming={pesticidePlantFarming}
                handleAddProcess={handleAddProcess}
                handleUpdateProcess={handleUpdateProcess}
                handleDeleteProcess={handleDeleteProcess}
                isGarden={projectInfo.isGarden}
                loading={loading}
              />
            </Card>
          </Col>

          {/* Other Activity */}
          <Col span={24}>
            <Card title="Hoạt động khác">
              {/* Display other activity */}
              <OtherTable
                other={other}
                handleAddProcess={handleAddProcess}
                handleUpdateProcess={handleUpdateProcess}
                handleDeleteProcess={handleDeleteProcess}
                isGarden={projectInfo.isGarden}
                loading={loading}
              />
            </Card>
          </Col>
        </Row>
      </div>
    </>
  ) : (
    <Loading />
  )
}

export default ProcessActivityPage

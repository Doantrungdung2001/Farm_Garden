import React, { useState } from 'react'
import { useParams } from 'react-router'
import { Card, Tooltip, Button, Flex, notification, Modal, Radio, List } from 'antd'
import { EditFilled } from '@ant-design/icons'
import Loading from '../../../pages/Loading'
import { formatDate } from '../../../utils/helpers'
import useGardenProjectInput from './useGardenProjectInput'
import PlantModal from '../../ProjectDetail/AddProject/AddProjectPlant'
import SeedModal from '../../ProjectDetail/AddProject/AddProjectSeed'
import GARDEN from '../../../services/gardenService'
import PROJECT from '../../../services/projectService'

const { Meta } = Card

const UpdateStatusModal = ({
  visible,
  onCancel,
  onInProgressUpdate,
  onHarvestingUpdate,
  onAlmostFinishedUpdate,
  onFinishedUpdate,
  onCancelUpdate,
  selectedItem
}) => {
  return (
    selectedItem && (
      <Modal
        open={visible}
        title="Upate status"
        onCancel={onCancel}
        footer={null}
        width={400} // Đặt độ rộng cho Modal
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '20px', fontSize: '16px' }}>Vui lòng chọn một lựa chọn để tiếp tục:</p>
          {selectedItem.status !== 'inProgress' && (
            <Button onClick={onInProgressUpdate} style={{ marginBottom: '10px', width: '100%' }}>
              Đang thực hiện
            </Button>
          )}
          {selectedItem.status !== 'harvesting' && (
            <Button onClick={onHarvestingUpdate} style={{ marginBottom: '10px', width: '100%' }}>
              Đang thu hoạch
            </Button>
          )}
          {selectedItem.status !== 'almostFinished' && (
            <Button onClick={onAlmostFinishedUpdate} style={{ marginBottom: '10px', width: '100%' }}>
              Sắp thu hoạch xong
            </Button>
          )}
          {selectedItem.status !== 'finished' && (
            <Button onClick={onFinishedUpdate} style={{ marginBottom: '10px', width: '100%' }}>
              Hoàn thành
            </Button>
          )}
          {selectedItem.status !== 'cancel' && (
            <Button onClick={onCancelUpdate} style={{ marginBottom: '10px', width: '100%' }}>
              Đã hủy
            </Button>
          )}
        </div>
      </Modal>
    )
  )
}

const GardenProjectInput = () => {
  const [api, contextHolder] = notification.useNotification()
  const openNotificationWithIcon = (type, title, content) => {
    api[type]({
      message: title,
      description: content,
      duration: 3.5
    })
  }

  const gardenId = useParams().id
  const [openEdit, setOpenEdit] = useState(false)
  const [open, setOpen] = useState(false)
  const [selectedPlantEdit, setSelectedPlantEdit] = useState(null)
  const [projectDetail, setProjectDetail] = useState(null)
  const [selectedPlant, setSelectedPlant] = useState(null)
  const [selectedSeed, setSelectedSeed] = useState(null)
  const [openSeed, setOpenSeed] = useState(false)
  const [openUpdateStatus, setOpenUpdateStatus] = useState(false)
  const [isAddSeed, setIsAddSeed] = useState(false)
  const { initData, isSuccess, refetch } = useGardenProjectInput(gardenId)
  const [value, setValue] = useState('all')

  const filteredProjects =
    initData && initData.length > 0
      ? initData.filter((project) => {
          if (value === 'all') return project
          else {
            return project.status.toLowerCase().includes(value.toLowerCase())
          }
        })
      : []
  const onChange = (e) => {
    setValue(e.target.value)
  }

  const handleAddPlant = (plant) => {
    setSelectedPlant(plant)
    setOpen(false)
    setIsAddSeed(true)
    setOpenSeed(true)
  }
  const handleAddSeed = () => {
    if (selectedSeed) {
      console.log(selectedSeed)
      // Do something with the selected seed
    }
    handleAddProject()
  }

  const handleAddProject = async () => {
    try {
      const data = {
        plantId: selectedPlant.id,
        seedId: selectedSeed.id,
        startDate: new Date()
      }
      await GARDEN.addNewProjectToGarden(data, gardenId)
      refetch()
      openNotificationWithIcon('success', 'Thông báo', 'Thêm thành công')
    } catch (error) {
      console.log(error)
    }
    setOpenSeed(false)
  }

  const handleUpdateProject = async () => {
    try {
      const data = {
        seed: selectedSeed.id
      }
      await PROJECT.editProjectInfo(data, projectDetail._id)
      refetch()
      openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
    } catch (error) {
      console.log(error)
      openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại ')
    }
    setOpenEdit(false)
  }

  const handleUpdateStatus = async (status) => {
    try {
      const data = {
        status: status
      }
      const res = await PROJECT.editProjectInfo(data, projectDetail._id)
      if (res.status === 200) {
        refetch()
        openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
      }
    } catch (error) {
      console.log(error)
      openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại ')
    }
    setOpenUpdateStatus(false)
  }

  const renderStatus = (status) => {
    switch (status) {
      case 'inProgress':
        return 'Đang thực hiện'
      case 'harvesting':
        return 'Đang thu hoạch'
      case 'almostFinished':
        return 'Sắp thu hoạch xong'
      case 'finished':
        return 'Hoàn thành'
      case 'cancel':
        return 'Đã hủy'
      default:
        return 'Chưa có thông tin'
    }
  }

  return (
    <div>
      {contextHolder}
      {isSuccess ? (
        <div>
          <Flex justify="space-between" align="center">
            <h2 style={{ margin: '0px' }}>Thông tin khởi tạo</h2>
            <Button
              type="primary"
              onClick={() => {
                setOpen(true)
              }}
            >
              Thêm cây mới
            </Button>
          </Flex>
          <Radio.Group onChange={onChange} value={value} style={{ marginTop: '1rem', fontSize: '1rem' }}>
            <Radio value="all"> Tất cả </Radio>
            <Radio value="inProgress"> Đang thực hiện </Radio>
            <Radio value="harvesting"> Đang thu hoạch </Radio>
            <Radio value="almostFinished"> Sắp thu hoạch xong </Radio>
            <Radio value="finished"> Hoàn thành </Radio>
            <Radio value="cancel"> Đã hủy </Radio>
          </Radio.Group>
          <List
            grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 4, xl: 4, xxl: 4 }}
            dataSource={filteredProjects}
            pagination={{
              onChange: (page) => {
                console.log(page)
              },
              pageSize: 8
            }}
            style={{ width: '100%', marginTop: '1.5rem' }}
            renderItem={(project) => (
              <List.Item key={project._id}>
                <Card
                  style={{
                    marginBottom: '1.5rem'
                  }}
                  hoverable
                  cover={<img alt="example" src={project.plantImage} />}
                >
                  <Meta
                    align={'center'}
                    style={{ fontStyle: 'italic' }}
                    title={
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between'
                        }}
                      >
                        <span>{project.name}</span>{' '}
                      </div>
                    }
                  />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex' }}>
                      <p>Hạt giống: {project.input.seed || 'Chưa có thông tin'}</p>
                      <Tooltip title="Sửa/Cập nhật Hạt giống">
                        <EditFilled
                          style={{ color: '#476930' }}
                          onClick={() => {
                            setProjectDetail(project)
                            setSelectedPlantEdit(project.plant)
                            setIsAddSeed(false)
                            setOpenEdit(true)
                          }}
                        />
                      </Tooltip>{' '}
                    </div>
                    <p>
                      Ngày bắt đầu: {project.input.initDate ? formatDate(project.input.initDate) : 'Chưa có thông tin'}
                    </p>
                    <div style={{ display: 'flex' }}>
                      <p>Trạng thái: {renderStatus(project.status) || 'Chưa có thông tin'}</p>
                      <Tooltip title="Sửa/Cập nhật Trạng thái">
                        <EditFilled
                          style={{ color: '#476930' }}
                          onClick={() => {
                            setProjectDetail(project)
                            setOpenUpdateStatus(true)
                          }}
                        />
                      </Tooltip>{' '}
                    </div>
                  </div>
                </Card>
              </List.Item>
            )}
          />

          <PlantModal
            open={open}
            onClose={() => setOpen(false)}
            selectedPlant={selectedPlant}
            setSelectedPlant={setSelectedPlant}
            handleAddPlant={handleAddPlant}
          />
          <SeedModal
            selectedPlant={selectedPlant}
            open={openSeed}
            onClose={() => setOpenSeed(false)}
            selectedSeed={selectedSeed}
            setSelectedSeed={setSelectedSeed}
            handleAddSeed={handleAddSeed}
            isAddSeed={isAddSeed}
          />
          <SeedModal
            selectedPlant={selectedPlantEdit}
            open={openEdit}
            onClose={() => setOpenEdit(false)}
            selectedSeed={selectedSeed}
            setSelectedSeed={setSelectedSeed}
            handleAddSeed={handleUpdateProject}
            isAddSeed={isAddSeed}
          />
          <UpdateStatusModal
            visible={openUpdateStatus}
            onCancel={() => {
              setOpenUpdateStatus(false)
            }}
            onInProgressUpdate={() => {
              handleUpdateStatus('inProgress')
              setOpenUpdateStatus(false)
            }}
            onCancelUpdate={() => {
              handleUpdateStatus('cancel')
              setOpenUpdateStatus(false)
            }}
            onHarvestingUpdate={() => {
              handleUpdateStatus('harvesting')
              setOpenUpdateStatus(false)
            }}
            onAlmostFinishedUpdate={() => {
              handleUpdateStatus('almostFinished')
              setOpenUpdateStatus(false)
            }}
            onFinishedUpdate={() => {
              handleUpdateStatus('finished')
              setOpenUpdateStatus(false)
            }}
            selectedItem={projectDetail}
          />
        </div>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default GardenProjectInput

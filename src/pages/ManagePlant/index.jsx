import React from 'react'
import { useState } from 'react'
import { Row, Col, Input, Button, Popconfirm, notification, List, Tooltip, Typography, Radio } from 'antd'
import { Link } from 'react-router-dom'
import Loading from '../Loading'
import { Card } from 'antd'
import AddPlantPopup from '../../components/ManagePlant/AddPlantPopup'
import AddSeedPopup from '../../components/ManagePlant/AddSeedPopup'
import AddSeedConfirmationModal from '../../components/ManagePlant/AddSeedConfirmationModal'
import AddPlantFarmingPopup from '../../components/ManagePlant/AddPlantFarmingPopup'
import PLANT from '../../services/plantService'
import useManagePlant from './useManagePlant'
import SEED from '../../services/seedService'
import PLANT_FARMING from '../../services/plantFarmingService'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import UpdatePlantInfo from '../../components/ManagePlant/UpdatePlantInfo'
import Search from 'antd/es/input/Search'
const { Paragraph } = Typography

const ManagePlant = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlant, setSelectedPlant] = useState(null)
  const [selectedSeed, setSelectedSeed] = useState(null)
  const [openSeed, setOpenSeed] = useState(false)
  const [open, setOpen] = useState(false)
  const [openPlantFarming, setOpenPlantFarming] = useState(false)
  const [confirmationModalVisible, setConfirmationModalVisible] = useState(false)
  const [isDefaultPlantFarming, setIsDefaultPlantFarming] = useState(false)
  const [selectedUpdatePlant, setSelectedUpdatePlant] = useState(null)
  const [openUpdatePlant, setOpenUpdatePlant] = useState(false)
  const [selectedPlantType, setSelectedPlantType] = useState('all')
  const [api, contextHolder] = notification.useNotification()
  const openNotificationWithIcon = (type, title, content) => {
    api[type]({
      message: title,
      description: content,
      duration: 3.5
    })
  }

  const { plantData, isSuccess, isLoading, refetch, recommendPlantFarming, isSuccessRecommendPlantFarming } =
    useManagePlant({
      seedId: selectedSeed?.id,
      isDefaultPlantFarming: isDefaultPlantFarming
    })

  const onCreate = async (values) => {
    try {
      const res = await PLANT.addPlantByRecommendPlantId(selectedPlant.id)
      if (res.response && res.response?.data?.message === 'Plant already exists') {
        openNotificationWithIcon('error', 'Thông báo', 'Cây đã tồn tại')
      } else {
        const resSeed = await SEED.addSeedByRecommendSeedId({
          recommendSeedId: selectedSeed.id
        })
        if (resSeed.response && resSeed.response?.data?.message === 'Seed already exists') {
          refetch()
          openNotificationWithIcon('success', 'Thông báo', 'Thêm thành công (Hạt giống đã tồn tại trong hệ thống)')
        } else {
          const res = await PLANT_FARMING.addPlantFarmingWithRecommendPlantIdAndSeedId({
            plantId: selectedPlant.id,
            seedId: selectedSeed.id,
            data: {
              isPlantFarmingDefault: true,
              ...values
            }
          })
          if (res.status === 200) {
            refetch()
            openNotificationWithIcon('success', 'Thông báo', 'Thêm thành công')
          } else {
            openNotificationWithIcon('error', 'Thông báo', 'Thêm thất bại')
          }
        }
      }
      setOpen(false)
      setOpenSeed(false)
      setOpenPlantFarming(false)
    } catch (error) {
      console.error(error)
      openNotificationWithIcon('error', 'Thông báo', 'Thêm thất bại')
      setOpen(false)
      setOpenSeed(false)
      setOpenPlantFarming(false)
    }
  }

  const handleAddPlant = (plant) => {
    setSelectedPlant(plant)
    setOpen(false)
    setOpenSeed(true)
  }

  const handleAddSeed = () => {
    if (selectedSeed) {
      setOpenSeed(false)
      setConfirmationModalVisible(true)
    }
  }

  const handleContinueWithTemplate = () => {
    setConfirmationModalVisible(false)
    setIsDefaultPlantFarming(true)
    setOpenPlantFarming(true)
  }

  const handleContinueWithEmpty = () => {
    setConfirmationModalVisible(false)
    setIsDefaultPlantFarming(false)
    setOpenPlantFarming(true)
  }

  const handleDelete = async (plantId) => {
    try {
      const res = await PLANT.deletePlant(plantId)
      if (res.status === 200) {
        refetch()
        openNotificationWithIcon('success', 'Thông báo', 'Xóa thành công')
      } else {
        openNotificationWithIcon('error', 'Thông báo', 'Xóa thất bại')
      }
    } catch (error) {
      console.log(error)
      openNotificationWithIcon('error', 'Thông báo', 'Xóa thất bại')
    }
  }

  const handleUpdatePlant = async (values) => {
    try {
      const data = {
        plant_description: values.description,
        plant_thumb: values.thumb[0].url || values.thumb[0].response.metadata.thumb_url
      }
      const res = await PLANT.updatePlant({
        plantId: selectedUpdatePlant._id,
        data
      })
      if (res.status === 200) {
        refetch()
        openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
      } else {
        openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại')
      }
    } catch (error) {
      console.log(error)
      openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại')
    }
    setOpenUpdatePlant(false)
  }

  const renderPlantType = (type) => {
    switch (type) {
      case 'herb':
        return 'Rau gia vị'
      case 'leafy':
        return 'Rau ăn lá'
      case 'root':
        return 'Củ'
      case 'fruit':
        return 'Quả'
      default:
        return type
    }
  }

  const filterPlantsByType = (type) => {
    if (type === 'all') {
      return plantData
    } else {
      return plantData.filter((plant) => plant.type === type)
    }
  }

  return (
    <>
      {contextHolder}
      {isLoading && <Loading />}
      {isSuccess && (
        <div>
          <h1>Danh sách các cây</h1>
          <Row>
            <Col span={8}>
              <Search
                placeholder="Tìm kiếm cây"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ marginBottom: '30px' }}
              />
            </Col>
            <Col span={1}></Col>
            <Col span={6}>
              <div>
                <Button
                  type="primary"
                  onClick={() => {
                    setOpen(true)
                  }}
                >
                  Thêm cây mới
                </Button>
                <AddPlantPopup
                  open={open}
                  onClose={() => setOpen(false)}
                  selectedPlant={selectedPlant}
                  setSelectedPlant={setSelectedPlant}
                  handleAddPlant={handleAddPlant}
                />
                <AddSeedPopup
                  selectedPlant={selectedPlant}
                  open={openSeed}
                  onClose={() => {
                    setOpenSeed(false)
                  }}
                  selectedSeed={selectedSeed}
                  setSelectedSeed={setSelectedSeed}
                  handleAddSeed={handleAddSeed}
                />
                <AddSeedConfirmationModal
                  visible={confirmationModalVisible}
                  onCancel={() => setConfirmationModalVisible(false)}
                  onContinueWithEmpty={handleContinueWithEmpty}
                  onContinueWithTemplate={handleContinueWithTemplate}
                />
                <UpdatePlantInfo
                  visible={openUpdatePlant}
                  onCancel={() => setOpenUpdatePlant(false)}
                  onCreate={handleUpdatePlant}
                  isUpdate={true}
                  plant={selectedUpdatePlant}
                />
                {isDefaultPlantFarming ? (
                  <>
                    {isSuccessRecommendPlantFarming && (
                      <AddPlantFarmingPopup
                        open={openPlantFarming}
                        onCancel={() => setOpenPlantFarming(false)}
                        onCreate={onCreate}
                        recommendPlantFarming={recommendPlantFarming}
                      />
                    )}
                  </>
                ) : (
                  <>
                    <AddPlantFarmingPopup
                      open={openPlantFarming}
                      onCancel={() => setOpenPlantFarming(false)}
                      onCreate={onCreate}
                      recommendPlantFarming={null}
                    />
                  </>
                )}
              </div>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <div style={{ marginBottom: '20px' }}>
                <Radio.Group onChange={(e) => setSelectedPlantType(e.target.value)} value={selectedPlantType}>
                  <Radio value="all">Tất cả</Radio>
                  <Radio value="leafy">Rau ăn lá</Radio>
                  <Radio value="herb">Rau gia vị</Radio>
                  <Radio value="root">Củ</Radio>
                  <Radio value="fruit">Quả</Radio>
                </Radio.Group>
              </div>
            </Col>
          </Row>
          <Row>
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 4, xl: 4, xxl: 4 }}
              dataSource={filterPlantsByType(selectedPlantType).filter((plant) =>
                plant.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
              )}
              pagination={{
                onChange: (page) => {
                  console.log(page)
                },
                pageSize: 8
              }}
              style={{ width: '100%' }}
              renderItem={(plant) => (
                <List.Item key={plant._id}>
                  <Card
                    hoverable
                    cover={<img alt={plant.name} src={plant.image} />}
                    actions={[
                      <Tooltip title="Chỉnh sửa" key="edit">
                        <EditOutlined
                          onClick={() => {
                            setSelectedUpdatePlant(plant)
                            setOpenUpdatePlant(true)
                          }}
                        />
                      </Tooltip>,
                      <Popconfirm
                        title={`Bạn muốn xóa cây ${plant.name}?`}
                        onConfirm={() => handleDelete(plant._id)}
                        okText="Có"
                        cancelText="Không"
                        key="delete"
                      >
                        <span onClick={(e) => e.stopPropagation()}>
                          <DeleteOutlined />
                        </span>
                      </Popconfirm>
                    ]}
                  >
                    <Link to={`/plant/${plant._id}`}>
                      <Card.Meta
                        title={plant.name}
                        description={
                          <Paragraph
                            ellipsis={{
                              rows: 3,
                              expandable: true,
                              symbol: 'đọc thêm',
                              tooltip: true,
                              onExpand: function (event) {
                                console.log('onExpand', event)
                                event.stopPropagation()
                                event.preventDefault()
                              }
                            }}
                          >
                            {plant.description}
                          </Paragraph>
                        }
                      />
                      <p>{renderPlantType(plant.type)}</p>
                    </Link>
                  </Card>
                </List.Item>
              )}
            />
          </Row>
        </div>
      )}
    </>
  )
}

export default ManagePlant

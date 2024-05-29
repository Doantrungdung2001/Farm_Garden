import React, { useState } from 'react'
import { Modal, Input, Button, Card, Space, Row, Col } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import useAddProject from './useAddProject'
import Loading from '../../../pages/Loading'

const PlantModal = ({ open, onClose, selectedPlant, setSelectedPlant, handleAddPlant }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState(null)
  const { allPlantsInFarm, isSuccessAllPlantsInFarm } = useAddProject({
    plantId: selectedPlant?.id
  })

  const handleSearch = (value) => {
    setSearchTerm(value)
  }

  const handleFilter = (type) => {
    setSelectedType(type)
  }

  const filteredPlants = allPlantsInFarm.filter(
    (plant) =>
      (searchTerm === '' || plant.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedType === null || plant.type === selectedType)
  )

  const renderType = (type) => {
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
        return 'Khác'
    }
  }

  return isSuccessAllPlantsInFarm ? (
    <Modal
      open={open}
      title="Chọn cây"
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="add" type="primary" disabled={!selectedPlant} onClick={() => handleAddPlant(selectedPlant)}>
          Thêm
        </Button>
      ]}
    >
      <Input
        placeholder="Tìm kiếm theo tên cây"
        prefix={<SearchOutlined />}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16 }}
      />

      <Space>
        <Button onClick={() => handleFilter(null)}>Tất cả</Button>
        <Button onClick={() => handleFilter('herb')}>Rau gia vị</Button>
        <Button onClick={() => handleFilter('leafy')}>Rau ăn lá</Button>
        <Button onClick={() => handleFilter('root')}>Củ</Button>
        <Button onClick={() => handleFilter('fruit')}>Quả</Button>
      </Space>

      <Row gutter={16} style={{ marginTop: 16 }}>
        {filteredPlants.map((plant) => (
          <Col key={plant.id} span={6}>
            <Card
              hoverable
              style={{
                marginBottom: 16,
                cursor: 'pointer',
                border: selectedPlant === plant ? '2px solid #1890ff' : ''
              }}
              onClick={() => setSelectedPlant(plant)}
            >
              <img src={plant.image} alt={plant.name} style={{ width: '100%', height: 120, objectFit: 'cover' }} />
              <p style={{ marginTop: 8 }}>{plant.name}</p>
              <p style={{ color: '#888' }}>{renderType(plant.type)}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </Modal>
  ) : (
    <Loading />
  )
}

export default PlantModal

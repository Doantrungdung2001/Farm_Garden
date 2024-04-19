import React, { useState } from 'react'
import { Modal, Input, Button, Card, Row, Col } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import useAddSeedPopup from './useAddSeedPopup'
import { ParagraphWithEllipsis } from '../../../utils/helpers'

const AddSeedPopup = ({
  selectedPlant,
  open,
  onClose,
  selectedSeed,
  setSelectedSeed,
  handleAddSeed,
  currentPlantId
}) => {
  const [searchTerm, setSearchTerm] = useState('')

  const { allSeedFromPlant, isSuccessAllSeedFromPlant, allSeedFromPlantInFarm } = useAddSeedPopup({
    plantId: selectedPlant?.id,
    currentPlantId: currentPlantId
  })
  const handleSearch = (value) => {
    setSearchTerm(value)
  }

  // filter seeds by search term and seed not has in farm
  const filteredSeeds = allSeedFromPlant
    .filter(
      (seed) =>
        searchTerm === '' ||
        seed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        seed.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((seed) => !allSeedFromPlantInFarm.find((seedInFarm) => seedInFarm.name === seed.name))

  return isSuccessAllSeedFromPlant ? (
    <Modal
      open={open}
      title="Chọn hạt giống"
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="add" type="primary" disabled={!selectedSeed} onClick={handleAddSeed}>
          Thêm
        </Button>
      ]}
    >
      <Input
        placeholder="Tìm kiếm theo tên hoặc mô tả"
        prefix={<SearchOutlined />}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16 }}
      />

      <Row gutter={16}>
        {filteredSeeds.map((seed) => (
          <Col key={seed.id} span={8}>
            <Card
              hoverable
              style={{ marginBottom: 16, cursor: 'pointer', border: selectedSeed === seed ? '2px solid #1890ff' : '' }}
              onClick={() => setSelectedSeed(seed)}
            >
              <img src={seed.image} alt={seed.name} style={{ width: '100%', height: 120, objectFit: 'cover' }} />
              <p style={{ marginTop: 8, fontWeight: 'bold' }}>{seed.name}</p>
              <p style={{ color: '#888' }}>{<ParagraphWithEllipsis text={seed.description} rows={3} />}</p>
            </Card>
          </Col>
        ))}
      </Row>
    </Modal>
  ) : (
    <></>
  )
}

export default AddSeedPopup

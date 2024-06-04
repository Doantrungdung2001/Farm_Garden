import React, { useState } from 'react'
import { Modal, Input, Button, Card, Row, Col, Typography } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import useAddProject from './useAddProject'
const { Paragraph } = Typography

const SeedModal = ({ selectedPlant, open, onClose, selectedSeed, setSelectedSeed, handleAddSeed, isAddSeed }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const { allSeedFromPlant, isSuccessAllSeedFromPlant } = useAddProject({
    plantId: selectedPlant?.id
  })
  const handleSearch = (value) => {
    setSearchTerm(value)
  }

  const filteredSeeds = allSeedFromPlant.filter(
    (seed) =>
      searchTerm === '' ||
      seed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seed.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return isSuccessAllSeedFromPlant ? (
    <Modal
      open={open}
      title={isAddSeed ? 'Chọn hạt giống' : 'Chỉnh sửa hạt giống'}
      onCancel={onClose}
      width={1000}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="add"
          type="primary"
          disabled={!selectedSeed}
          onClick={() => {
            handleAddSeed()
            onClose()
          }}
        >
          {isAddSeed ? 'Thêm' : 'Cập nhật'}
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
              <p style={{ color: '#888' }}>
                {
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
                    {seed.description}
                  </Paragraph>
                }
              </p>
            </Card>
          </Col>
        ))}
      </Row>
    </Modal>
  ) : (
    <></>
  )
}

export default SeedModal

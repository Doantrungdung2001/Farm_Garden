import React from 'react'
import { Button, Space, Input, Tooltip, Select, Card, Flex, Typography, Row, Col } from 'antd'
import { EditFilled } from '@ant-design/icons'
import { districtOptions } from '../../../utils/constant'
const { Option } = Select

const OverViewProfile = ({
  isEditingOverView,
  setIsEditingOverView,
  description,
  setDescription,
  district,
  setDistrict,
  address,
  setAddress,
  handleSave,
  profile
}) => {
  const handleCancel = () => {
    setIsEditingOverView(false)
    setDescription(profile?.description)
    setDistrict(profile?.district)
    setAddress(profile?.address)
  }

  const tittleCard = () => {
    return (
      <div style={{ display: 'flex' }}>
        <h2 style={{ marginRight: '1rem' }}>Thông tin chung</h2>
        <Tooltip title="Chỉnh sửa thông tin">
          <EditFilled style={{ color: '#476930' }} onClick={() => setIsEditingOverView(true)} />
        </Tooltip>
      </div>
    )
  }

  return (
    <div>
      {isEditingOverView ? (
        <Card
          title={tittleCard()}
          bordered={false}
          style={{
            width: '100%',
            padding: '20px'
          }}
        >
          <div>
            <Flex vertical>
              <Typography.Title level={5}>Mô tả</Typography.Title>
              <Input.TextArea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Mô tả"
                autoSize={{ minRows: 3, maxRows: 5 }}
                style={{ marginBottom: '8px' }}
              />
              <Typography.Title level={5}>Tỉnh</Typography.Title>
              <Select
                showSearch
                style={{ width: 200 }}
                placeholder="Chọn tỉnh"
                optionFilterProp="children"
                filterOption={(input, option) => option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                }
                onChange={setDistrict}
                value={district}
                label="Tỉnh"
              >
                {districtOptions.map((district) => (
                  <Option key={district.value} value={district.value}>
                    {district.label}
                  </Option>
                ))}
              </Select>
              <Typography.Title level={5}>Địa chỉ</Typography.Title>
              <Input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Địa chỉ"
                style={{ marginBottom: '8px' }}
                label="Địa chỉ"
              />
              <Row>
                <Col span={20}></Col>
                <Col span={4}>
                  <Space style={{ marginTop: '20px' }}>
                    <Button type="primary" onClick={handleSave}>
                      Lưu
                    </Button>
                    <Button onClick={handleCancel}>Hủy</Button>
                  </Space>
                </Col>
              </Row>
            </Flex>
          </div>
        </Card>
      ) : (
        <Card
          title={tittleCard()}
          bordered={false}
          style={{
            width: '100%',
            padding: '20px'
          }}
        >
          <div>
            <p>
              <strong>Mô tả: </strong>
              {profile?.description}
            </p>
            <p>
              <strong>Tỉnh: </strong>
              {profile?.district}
            </p>
            <p>
              <strong>Địa chỉ: </strong>
              {profile?.address}
            </p>
          </div>
        </Card>
      )}
    </div>
  )
}

export default OverViewProfile

import React, { useState } from 'react'
import { Input, Flex, Row, Col, List, Radio, Space } from 'antd'
import { Link } from 'react-router-dom'
import Loading from '../Loading'
import { formatDateToInput } from '../../utils/helpers'
import useManageGarden from './useManageGarden'

const ManageGarden = () => {
  const { gardens, isSuccess } = useManageGarden()
  const [value, setValue] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const onChange = (e) => {
    setValue(e.target.value)
  }

  const filteredGardens =
    gardens && gardens.length
      ? gardens
          .filter((garden) => {
            return (
              garden.client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              garden.client.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              garden.client.phone?.toLowerCase().includes(searchQuery.toLowerCase())
            )
          })
          .filter((garden) => {
            if (value === 'all') return garden
            else return garden.status.toLowerCase().includes(value.toLowerCase())
          })
      : []
  return (
    <div>
      {isSuccess ? (
        <div>
          <h2 style={{ textAlign: 'left' }}>Quản lý mảnh vườn TRỒNG RAU HỘ</h2>
          {/* Sreach request */}
          <div>
            <p>
              <strong>Tìm kiếm thông tin</strong>
            </p>
            <Flex style={{ marginBottom: '2rem' }} align="flex-end">
              <Flex vertical style={{ marginRight: '1rem' }}>
                <label style={{ marginBottom: '0.5rem' }}>Tên / Sđt / Email của khách hàng: </label>
                <Input
                  placeholder="Tìm kiếm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%' }}
                />
              </Flex>
            </Flex>
          </div>
          <h2 style={{ textAlign: 'left', fontSize: '18px' }}>Danh sách dự án TRỒNG RAU HỘ</h2>
          <Row>
            <Col span={4}>
              <div style={{ marginTop: '2rem', marginLeft: '2rem', padding: '2rem', backgroundColor: '#f1f4ed' }}>
                <h3>Lọc theo trạng thái</h3>
                <Radio.Group onChange={onChange} value={value}>
                  <Space direction="vertical">
                    <Radio value="all">Tất cả</Radio>
                    <Radio value="started">Đang thực hiện</Radio>
                    <Radio value="end">Đã kết thúc</Radio>
                    <Radio value="cancel">Đã hủy</Radio>
                  </Space>
                </Radio.Group>
              </div>
            </Col>
            <Col span={20}>
              <List
                itemLayout="vertical"
                size="large"
                pagination={{
                  onChange: (page) => {
                    console.log(page)
                  },
                  pageSize: 5
                }}
                dataSource={filteredGardens}
                style={{ marginTop: '2rem', width: '90%', marginLeft: '2rem' }}
                renderItem={(item, index) => (
                  <div>
                    <Link to={`/manage-planting-garden/${item._id}`} key={item._id}>
                      <List.Item
                        key={item._id}
                        extra={
                          <img
                            width={272}
                            alt={item.client.name}
                            src="https://media.istockphoto.com/id/1323663582/vi/anh/tr%E1%BA%BB-em-v%C3%A0-m%E1%BA%B9-l%C3%A0m-v%C6%B0%E1%BB%9Dn-trong-v%C6%B0%E1%BB%9Dn-rau-%E1%BB%9F-s%C3%A2n-sau.jpg?s=612x612&w=0&k=20&c=wU9d5Vwf0Rmb6B7jZOU0T6KgcceeTrGU99lCT2XfH-Q="
                          />
                        }
                        style={{
                          backgroundColor: index % 2 === 0 ? '#ECFFDC' : '#C1E1C1',
                          marginBottom: '2rem',
                          borderRadius: '10px'
                        }}
                      >
                        <List.Item.Meta
                          title={
                            item.client.phone
                              ? `${item.client.name} - ${item.client.phone}`
                              : `${item.client.name} - Chưa có sdt`
                          }
                          description={formatDateToInput(item.startDate)}
                        />
                        <p>
                          {`Khu vườn được yêu cầu với diện tích ${item.template.square} và giá ${
                            item.template.price
                          } VND. Gồm  ${
                            item.gardenServiceRequest.herbList.length
                          } cây gia vị (${item.gardenServiceRequest.herbList
                            .map((plant) => plant.plant_name)
                            .join(', ')}), ${
                            item.gardenServiceRequest.leafyList.length
                          } cây ăn lá (${item.gardenServiceRequest.leafyList
                            .map((plant) => plant.plant_name)
                            .join(', ')}), ${
                            item.gardenServiceRequest.rootList.length
                          } củ (${item.gardenServiceRequest.rootList.map((plant) => plant.plant_name).join(', ')}),
                            ${item.gardenServiceRequest.fruitList.length} quả (${item.gardenServiceRequest.fruitList
                              .map((plant) => plant.plant_name)
                              .join(', ')}). Email: ${item.client.email ? item.client.email : 'Không có thông tin'}`}
                        </p>
                        <p style={{ marginBottom: 0, fontWeight: 'bold', color: '#1890ff' }}>
                          {item.status === 'started'
                            ? 'Đang thực hiện'
                            : item.status === 'end'
                              ? 'Đã kết thúc'
                              : 'Đã hủy'}
                        </p>
                      </List.Item>
                    </Link>
                  </div>
                )}
              />
            </Col>
          </Row>
        </div>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default ManageGarden

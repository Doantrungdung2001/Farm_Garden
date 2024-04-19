import React, { useState } from 'react'
import { Spin, Alert, Button, notification, List, Card, Row, Col, Popconfirm } from 'antd'
import useProjectOtherInfo from './useProjectOtherInfo'
import AddCameraModal from './AddCameraModal'
import CAMERA from '../../services/cameraService'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'


const CameraList = ({ cameraData, handleCameraSelect, selectedCamera, handleEditCamera, handleDeleteCamera }) => {
  return (
    <List
      dataSource={cameraData}
      renderItem={(camera, index) => (
        <List.Item
          key={index}
          onClick={() => handleCameraSelect(camera)}
          style={{
            cursor: 'pointer',
            background: camera === selectedCamera ? '#f0f0f0' : 'transparent',
            padding: '10px',
            borderRadius: '5px'
          }}
          actions={[
            <EditOutlined
              key="edit"
              onClick={(e) => handleEditCamera(e, camera)}
              style={{ fontSize: '20px', color: 'blue', cursor: 'pointer' }}
            />,
            <Popconfirm
              title="Bạn có chắc chắn muốn xóa camera này không?"
              onConfirm={() => handleDeleteCamera(camera)}
              onCancel={() => console.log('Cancel')}
              okText="Có"
              cancelText="Không"
            >
              <DeleteOutlined key="delete" style={{ fontSize: '20px', color: 'red', cursor: 'pointer' }} />
            </Popconfirm>
          ]}
        >
          <List.Item.Meta title={<p>Tên: {camera.name}</p>} description={<p>RTSP Link: {camera.rtsp_link}</p>} />
        </List.Item>
      )}
    />
  )
}

const VideoPlayer = ({ selectedCamera }) => {
  return (
    <Card title={selectedCamera ? selectedCamera.name : 'Chọn camera'}>
      {selectedCamera && (
        <video controls autoPlay>
          <source src={selectedCamera.rtsp_link} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </Card>
  )
}

const OtherInfo = () => {
  const [loading, setLoading] = useState(false)
  const [updateCameraModalVisible, setUpdateCameraModalVisible] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedCamera, setSelectedCamera] = useState(null)
  const [selectedUpdateCamera, setSelectedUpdateCamera] = useState(null)
  const [api, contextHolder] = notification.useNotification()
  const openNotificationWithIcon = (type, title, content) => {
    api[type]({
      message: title,
      description: content,
      duration: 3.5
    })
  }
  const {
    isSuccessCamera,
    refetchCamera,
    isLoadingCamera,
    cameraData
  } = useProjectOtherInfo()

  const handleCameraSelect = (camera) => {
    setSelectedCamera(camera)
  }

  const handleEditCamera = (e, camera) => {
    // Ngăn chặn sự kiện lan truyền lên cha
    e.stopPropagation()
    // Xử lý sự kiện chỉnh sửa camera ở đây
    console.log('Chỉnh sửa camera:', camera)
    setSelectedUpdateCamera(camera)
    // Hiển thị modal thêm camera
    setUpdateCameraModalVisible(true)
  }

  const handleAddCamera = async (values) => {
    console.log(values)
    setLoading(true)
    try {
      const res = await CAMERA.createCamera({
        data: {
          name: values.name,
          rtsp_link: values.rtsp_link,
        }
      })
      setLoading(false)
      if (res.status === 200) {
        openNotificationWithIcon('success', 'Thêm camera thành công', 'Thêm camera thành công')
        refetchCamera()
      } else {
        openNotificationWithIcon('error', 'Thêm camera thất bại', 'Thêm camera thất bại')
      }
    } catch (error) {
      setLoading(false)
      openNotificationWithIcon('error', 'Thêm camera thất bại', 'Thêm camera thất bại')
      console.log(error)
    }
  }

  const handleUpdateCamera = async (values) => {
    console.log(values)
    setLoading(true)
    try {
      const res = await CAMERA.updateCamera({
        cameraId: selectedUpdateCamera._id,
        data: {
          name: values.name,
          rtsp_link: values.rtsp_link
        }
      })
      setLoading(false)
      if (res.status === 200) {
        openNotificationWithIcon('success', 'Chỉnh sửa camera thành công', 'Chỉnh sửa camera thành công')
        refetchCamera()
      } else {
        openNotificationWithIcon('error', 'Chỉnh sửa camera thất bại', 'Chỉnh sửa camera thất bại')
      }
    } catch (error) {
      setLoading(false)
      openNotificationWithIcon('error', 'Chỉnh sửa camera thất bại', 'Chỉnh sửa camera thất bại')
      console.log(error)
    }
  }

  const handleDeleteCamera = async (camera) => {
    console.log(camera)
    setLoading(true)
    try {
      const res = await CAMERA.deleteCamera({
        cameraId: camera._id
      })
      setLoading(false)
      if (res.status === 200) {
        openNotificationWithIcon('success', 'Xóa camera thành công', 'Xóa camera thành công')
        refetchCamera()
      } else {
        openNotificationWithIcon('error', 'Xóa camera thất bại', 'Xóa camera thất bại')
      }
    } catch (error) {
      setLoading(false)
      openNotificationWithIcon('error', 'Xóa camera thất bại', 'Xóa camera thất bại')
      console.log(error)
    }
  }

  return (
    <div>
      {contextHolder}
      <Spin
        spinning={loading}
      >
        <div>
          <h2>Thông tin hình ảnh từ camera</h2>
          <Button
            type="primary"
            onClick={setModalVisible(true)}
          >
            Thêm camera
          </Button>
          <AddCameraModal visible={modalVisible} onCancel={() => setModalVisible(false)} onSubmit={handleAddCamera} />{' '}
          {/* Modal thêm camera */}
          <AddCameraModal
            visible={updateCameraModalVisible}
            onCancel={() => setUpdateCameraModalVisible(false)}
            onSubmit={handleUpdateCamera}
            cameraItem={selectedUpdateCamera}
            isUpdate={true}
          />
          {isLoadingCamera ? (
            <Spin />
          ) : isSuccessCamera ? (
            <div style={{ marginTop: '10px' }}>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <CameraList
                    cameraData={cameraData}
                    handleCameraSelect={handleCameraSelect}
                    selectedCamera={selectedCamera}
                    handleEditCamera={handleEditCamera}
                    handleDeleteCamera={handleDeleteCamera}
                  />
                </Col>
                <Col span={16}>
                  <VideoPlayer selectedCamera={selectedCamera} />
                </Col>
              </Row>
            </div>
          ) : (
            <Alert message="Lỗi khi load thông tin camera" type="error" />
          )}
        </div>
      </Spin>
    </div>
  )
}

export default OtherInfo

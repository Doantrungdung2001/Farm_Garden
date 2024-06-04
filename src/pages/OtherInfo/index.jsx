import React, { useState } from 'react'
import { Spin, Alert, Button, notification, List, Card, Row, Col, Popconfirm, Tooltip } from 'antd'
import useProjectOtherInfo from './useProjectOtherInfo'
import AddCameraModal from './AddCameraModal'
import CAMERA from '../../services/cameraService'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import YouTubeEmbed from '../../components/YouTubeEmbed'
import Loading from '../Loading'

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
            borderRadius: '5px',
            paddingLeft: '20px',
            border: '1px solid #f0f0f0',
            marginBottom: '10px'
          }}
          actions={[
            <Tooltip title="Chỉnh sửa camera" key="edit">
              <EditOutlined
                key="edit"
                onClick={(e) => handleEditCamera(e, camera)}
                style={{ fontSize: '20px', cursor: 'pointer' }}
              />
            </Tooltip>,
            <Tooltip title="Xóa camera" key="delete">
              <Popconfirm
                title="Bạn có chắc chắn muốn xóa camera này không?"
                onConfirm={() => handleDeleteCamera(camera)}
                onCancel={() => console.log('Cancel')}
                okText="Có"
                cancelText="Không"
              >
                <DeleteOutlined key="delete" style={{ fontSize: '20px', cursor: 'pointer' }} />
              </Popconfirm>
            </Tooltip>
          ]}
        >
          <List.Item.Meta title={<p>Tên: {camera.name}</p>} description={<p>Youtube Link: {camera.rtsp_link}</p>} />
        </List.Item>
      )}
    />
  )
}

const VideoPlayer = ({ selectedCamera }) => {
  return (
    <Card title={selectedCamera ? selectedCamera.name : 'Chọn camera'} style={{ height: '500px' }}>
      <div style={{ height: '400px' }}>
        {selectedCamera && <YouTubeEmbed videoUrl={selectedCamera.rtsp_link} style={{ height: '100%' }} />}
        {!selectedCamera && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              fontWeight: 'bold',
              fontSize: '20px',
              color: 'gray'
            }}
          >
            <p>Hãy chọn camera để xem livestream tương ứng</p>
          </div>
        )}
      </div>
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
  console.log('here')
  const { isSuccessCamera, refetchCamera, isLoadingCamera, cameraData, isErrorCamera } = useProjectOtherInfo()

  console.log('cameraData', cameraData)

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
          rtsp_link: values.rtsp_link
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
      <Spin spinning={loading} size="large">
        <div>
          <h2>Thông tin hình ảnh từ camera</h2>
          <Button type="primary" onClick={() => setModalVisible(true)}>
            Thêm camera
          </Button>
          <AddCameraModal visible={modalVisible} onCancel={() => setModalVisible(false)} onSubmit={handleAddCamera} />{' '}
          <AddCameraModal
            visible={updateCameraModalVisible}
            onCancel={() => setUpdateCameraModalVisible(false)}
            onSubmit={handleUpdateCamera}
            cameraItem={selectedUpdateCamera}
            isUpdate={true}
          />
          {isSuccessCamera ? (
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
                <Col span={16} style={{ height: '500px' }}>
                  <VideoPlayer selectedCamera={selectedCamera} />
                </Col>
              </Row>
            </div>
          ) : (
            <Loading />
          )}
          {isErrorCamera && (
            <Alert message="Lỗi" description="Có lỗi xảy ra, vui lòng thử lại sau" type="error" showIcon />
          )}
        </div>
      </Spin>
    </div>
  )
}

export default OtherInfo

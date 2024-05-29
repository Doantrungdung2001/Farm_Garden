import React, { useState } from 'react'
import { useParams } from 'react-router'
import { Divider, Alert, Tooltip, Modal, Button, notification, Checkbox, Spin } from 'antd'
import Loading from '../../../pages/Loading'
import { CalendarFilled, EditFilled } from '@ant-design/icons'
import { formatDateTime } from '../../../utils/helpers'
import useGardenProjectOrder from './useGardenProjectOrder'
import GARDEN from '../../../services/gardenService'

const UpdateStatusModal = ({ visible, onCancel, onInProgressUpdate, onCancelUpdate, onDoneUpdate, selectedItem }) => {
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
          {selectedItem.status !== 'started' && (
            <Button onClick={onInProgressUpdate} style={{ marginBottom: '10px', width: '100%' }}>
              Đang thực hiện
            </Button>
          )}
          {selectedItem.status !== 'end' && (
            <Button onClick={onDoneUpdate} style={{ marginBottom: '10px', width: '100%' }}>
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

// Modal component for selecting cameras
const CameraSelectionModal = ({
  visible,
  cameraList,
  selectedCameras,
  setSelectedCameras,
  onCancel,
  onSubmit,
  isSuccessCamera
}) => {
  return (
    <Modal
      open={visible}
      title="Lựa chọn camera"
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={onSubmit}>
          Cập nhật
        </Button>
      ]}
    >
      {/* Render list of cameras with checkboxes */}
      {cameraList?.map((camera) => (
        <div key={camera.id}>
          <Checkbox
            checked={selectedCameras.includes(camera._id)}
            onChange={() => {
              const updatedSelection = selectedCameras.includes(camera._id)
                ? selectedCameras.filter((id) => id !== camera._id)
                : [...selectedCameras, camera._id]
              setSelectedCameras(updatedSelection)
            }}
          >
            {camera.name}
          </Checkbox>
        </div>
      ))}
      {!isSuccessCamera && <Spin spinning={true} tip="Đang tải dữ liệu" size="large" />}
    </Modal>
  )
}

const GardenProjectOrder = () => {
  const gardenId = useParams().id
  const [openUpdateStatus, setOpenUpdateStatus] = useState(false)
  const [openUpdateCamera, setOpenUpdateCamera] = useState(false)
  const [selectedCameras, setSelectedCameras] = useState([])
  const [loading, setLoading] = useState(false)

  const {
    initData,
    isSuccess,
    refetch,
    cameraData,
    isSuccessCamera,
    cameraInGarden,
    isSuccessCameraInGarden,
    refetchCameraInGarden
  } = useGardenProjectOrder(gardenId)

  const [api, contextHolder] = notification.useNotification()
  const openNotificationWithIcon = (type, title, content) => {
    api[type]({
      message: title,
      description: content,
      duration: 3.5
    })
  }

  const handleUpdateStatus = async (status) => {
    try {
      const data = {
        status: status
      }
      const res = await GARDEN.updateStatusGarden(data, gardenId)
      if (res.status === 200) {
        refetch()
        openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
      }
    } catch (error) {
      openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại ')
    }
  }

  const handleUpdateCamera = async () => {
    setLoading(true)
    try {
      const data = {
        cameraId: selectedCameras
      }
      const res = await GARDEN.updateCameraToGarden({ data, gardenId })
      setLoading(false)
      if (res.status === 200) {
        refetchCameraInGarden()
        openNotificationWithIcon('success', 'Thông báo', 'Cập nhật thành công')
      } else {
        openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại ')
      }
    } catch (error) {
      setLoading(false)
      console.log(error)
      openNotificationWithIcon('error', 'Thông báo', 'Cập nhật thất bại ')
    }
    setOpenUpdateCamera(false)
  }

  return (
    <Spin spinning={loading} size="large">
      <div>
        {contextHolder}
        {isSuccess && isSuccessCamera && isSuccessCameraInGarden ? (
          <div>
            <div>
              <Alert
                style={{ fontWeight: '500', fontSize: '16px' }}
                message={`Ngày đặt hàng ${formatDateTime(initData.startDate)}`}
                showIcon
                icon={<CalendarFilled />}
                type="success"
              />
              <div
                style={{
                  display: 'flex'
                }}
              >
                <h3 style={{ marginRight: '5px' }}>
                  Trạng thái:{' '}
                  {initData.status === 'started'
                    ? 'Đang thực hiện'
                    : initData.status === 'end'
                      ? 'Đã kết thúc'
                      : 'Đã hủy'}{' '}
                </h3>
                <Tooltip title="Cập nhật trạng thái">
                  <EditFilled
                    style={{ color: '#476930' }}
                    onClick={() => {
                      setOpenUpdateStatus(true)
                    }}
                  />
                </Tooltip>
              </div>
              <UpdateStatusModal
                visible={openUpdateStatus}
                onCancel={() => {
                  setOpenUpdateStatus(false)
                }}
                onInProgressUpdate={() => {
                  handleUpdateStatus('started')
                  setOpenUpdateStatus(false)
                }}
                onCancelUpdate={() => {
                  handleUpdateStatus('cancel')
                  setOpenUpdateStatus(false)
                }}
                onDoneUpdate={() => {
                  handleUpdateStatus('end')
                  setOpenUpdateStatus(false)
                }}
                selectedItem={initData}
              />
              <Divider />
              {isSuccessCameraInGarden ? (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex' }}>
                    <h3 style={{ marginRight: '5px' }}>Danh sách Camera: </h3>
                    <Tooltip title="Chỉnh sửa Danh sách Camera">
                      <EditFilled
                        style={{ marginLeft: '0.5rem' }}
                        onClick={() => {
                          setOpenUpdateCamera(true)
                        }}
                      />
                    </Tooltip>
                  </div>
                  <ul>
                    {cameraInGarden.map((camera) => (
                      <li key={camera._id}>{camera.name}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <Spin spinning={true} tip="Đang tải dữ liệu" size="large" />
              )}
              <CameraSelectionModal
                visible={openUpdateCamera} // Set visibility of CameraSelectionModal
                cameraList={cameraData} // Pass camera data
                selectedCameras={selectedCameras || cameraInGarden?.map((camera) => camera._id)} // Pass selected cameras
                setSelectedCameras={setSelectedCameras} // Pass function to update selected cameras
                onCancel={() => {
                  setSelectedCameras(cameraInGarden?.map((camera) => camera._id))
                  setOpenUpdateCamera(false)
                }} // Set onCancel function
                onSubmit={handleUpdateCamera} // Set onSubmit function
                isSuccessCamera={isSuccessCamera} // Pass camera data success status
              />
              <Divider orientationMargin={0} orientation="left">
                <h3>Thông tin khách hàng</h3>
              </Divider>
              <div>
                <p>
                  <strong>Tên:</strong> {initData.client?.name ? initData.client.name : 'Không có thông tin'}
                </p>
                <p>
                  <strong>SĐT:</strong> {initData.client?.phone ? initData.client.phone : 'Không có thông tin'}
                </p>
                <p>
                  <strong>Email:</strong> {initData.client?.email ? initData.client.email : 'Không có thông tin'}
                </p>
                <p>
                  <strong>Địa chỉ:</strong> {initData.client?.address ? initData.client.address : 'Không có thông tin'}
                </p>
              </div>

              <Divider orientationMargin={0} orientation="left">
                <h3>Yêu cầu</h3>
              </Divider>

              <p>
                <i>
                  <strong>Diện tích: </strong>
                  <span>{initData.template?.square ? initData.template.square : 'Không có thông tin'} M2</span>
                </i>
              </p>
              <p>
                <strong>Giá: </strong>
                {initData.template?.price
                  ? initData.template?.price.toLocaleString('it-IT', {
                      style: 'currency',
                      currency: 'VND'
                    })
                  : 'Không có thông tin'}
              </p>
              <div style={{ textAlign: 'right', width: '50%' }}>
                <div className="styleText">
                  <p style={{ fontWeight: '600' }}>CHỦNG LOẠI GIEO TRỒNG</p>
                </div>
                <div className="styleText">
                  <p style={{ fontWeight: '600' }}>{initData.leafyList.length} Rau ăn lá</p>
                  <ul>
                    {initData.leafyList.map((leafy) => (
                      <li key={leafy.name}>{leafy.name}</li>
                    ))}
                  </ul>
                </div>
                <div className="styleText">
                  <p style={{ fontWeight: '600' }}>{initData.herbList.length} Rau gia vị</p>
                  <ul>
                    {initData.herbList.map((herb) => (
                      <li key={herb.name}>{herb.name}</li>
                    ))}
                  </ul>
                </div>
                <div className="styleText">
                  <p style={{ fontWeight: '600' }}>{initData.rootList.length} Củ</p>
                  <ul>
                    {initData.rootList.map((root) => (
                      <li key={root.name}>{root.name}</li>
                    ))}
                  </ul>
                </div>
                <div className="styleText">
                  <p style={{ fontWeight: '600' }}>{initData.fruitList.length} Quả</p>
                  <ul>
                    {initData.fruitList.map((fruit) => (
                      <li key={fruit.name}>{fruit.name}</li>
                    ))}
                  </ul>
                </div>
                <div className="styleText">
                  <p style={{ fontWeight: '600' }}>SẢN LƯỢNG DỰ KIẾN</p>
                  <p>{initData.template.expectedOutput} kg/tháng</p>
                </div>
                <div className="styleText">
                  <p style={{ fontWeight: '600' }}>SỐ LẦN GỬI RAU TỚI NHÀ</p>
                  <p>{initData.template.expectDeliveryPerWeek} lần/ tuần</p>
                </div>
                <div className="styleText">
                  <p style={{ fontWeight: '600' }}>SỐ LƯỢNG GỬI RAU TỚI NHÀ / lần</p>
                  <p>{initData.template.expectDeliveryAmount} kg/ lần</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Loading />
        )}
      </div>
    </Spin>
  )
}

export default GardenProjectOrder

import React from 'react'
import { Modal, Button } from 'antd'

const SelectOptionConfirmationModal = ({
  visible,
  onCancel,
  onContinueWithEmpty,
  onContinueWithRecommendPlantFarming,
  onContinueWithFarmPlantfarming
}) => {
  return (
    <Modal
      open={visible}
      title="Tạo quy trình canh tác"
      onCancel={onCancel}
      footer={null}
      width={400} // Đặt độ rộng cho Modal
    >
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: '20px', fontSize: '16px' }}>Vui lòng chọn một lựa chọn để tiếp tục:</p>
        <Button onClick={onContinueWithFarmPlantfarming} style={{ marginRight: '10px', width: '100%' }}>
          Sử dụng quy trình từ trang trại của bạn
        </Button>
        <Button onClick={onContinueWithRecommendPlantFarming} style={{ width: '100%', marginTop: '10px' }}>
          Sử dụng quy trình gợi ý từ hệ thống
        </Button>
        <Button onClick={onContinueWithEmpty} style={{ width: '100%', marginTop: '10px' }}>
          Trống
        </Button>
        <Button onClick={onCancel} style={{ width: '100%', marginTop: '10px' }}>
          Hủy
        </Button>
      </div>
    </Modal>
  )
}

export default SelectOptionConfirmationModal

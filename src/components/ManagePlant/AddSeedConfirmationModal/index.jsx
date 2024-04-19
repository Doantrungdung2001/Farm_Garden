import React from 'react'
import { Modal, Button } from 'antd'

const AddSeedConfirmationModal = ({ visible, onCancel, onContinueWithEmpty, onContinueWithTemplate }) => {
  return (
    <Modal
      open={visible}
      title="Tạo quy trình canh tác"
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="empty" onClick={onContinueWithEmpty}>
          Trống
        </Button>,
        <Button key="default" type="primary" onClick={onContinueWithTemplate}>
          Sử dụng quy trình gợi ý
        </Button>
      ]}
    >
      <p>Vui lòng chọn một lựa chọn để tiếp tục:</p>
    </Modal>
  )
}

export default AddSeedConfirmationModal

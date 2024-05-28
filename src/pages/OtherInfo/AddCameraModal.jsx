import React from 'react'
import { Modal, Form, Input } from 'antd'

const AddCameraModal = ({ visible, onCancel, onSubmit, cameraItem, isUpdate }) => {
  const [form] = Form.useForm()
  if (isUpdate) form.setFieldsValue(cameraItem)
  else form.setFieldsValue({ name: '', rtsp_link: '' })
  return (
    <Modal
      open={visible}
      title={isUpdate ? 'Chỉnh sửa camera' : 'Thêm camera'}
      okText={isUpdate ? 'Lưu' : 'Thêm'}
      cancelText="Hủy"
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      onOk={() => {
        form
          .validateFields()
          .then((values) => {
            onSubmit(values)
            form.resetFields()
            onCancel()
          })
          .catch((info) => {
            console.log('Validate Failed:', info)
          })
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="name" label="Tên">
          <Input />
        </Form.Item>
        <Form.Item name="rtsp_link" label="Youtube Link">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddCameraModal

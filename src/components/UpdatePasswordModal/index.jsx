import React, { useState } from 'react'
import { Modal, Form, Input, Button } from 'antd'
import { LockOutlined } from '@ant-design/icons'

const UpdatePasswordModal = ({ visible, onCancel, onUpdatePassword }) => {
  const [form] = Form.useForm()

  const handleFinish = async (values) => {
    await onUpdatePassword(values)
    form.resetFields()
  }

  return (
    <Modal title="Cập nhật mật khẩu" open={visible} onCancel={onCancel} footer={null}>
      <Form
        form={form}
        name="updatePasswordForm"
        onFinish={handleFinish}
        layout="vertical"
        initialValues={{
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        }}
      >
        <Form.Item
          name="oldPassword"
          label="Mật khẩu cũ"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu cũ' }]}
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>

        <Form.Item
          name="newPassword"
          label="Mật khẩu mới"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>

        <Form.Item
          name="confirmNewPassword"
          label="Nhập lại mật khẩu mới"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Vui lòng nhập lại mật khẩu mới' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve()
                }
                return Promise.reject('Mật khẩu mới không khớp')
              }
            })
          ]}
        >
          <Input.Password prefix={<LockOutlined />} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default UpdatePasswordModal

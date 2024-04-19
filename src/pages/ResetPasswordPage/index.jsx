import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Form, Input, Button, message } from 'antd'
import FARM from '../../services/farmService'

const ResetPasswordPage = () => {
  const { resetToken, email } = useParams()
  const [form] = Form.useForm()
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  const onFinish = async (values) => {
    const { password, confirmPassword } = values
    if (password !== confirmPassword) {
      setErrorMessage('Mật khẩu và xác nhận mật khẩu không khớp.')
      return
    }

    try {
      const res = await FARM.resetPassword({ resetToken, email, newPassword: password })
      if (res.status === 200) {
        message.success('Đặt lại mật khẩu thành công!')
        navigate('/login')
      } else {
        message.error(res.data.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.')
      }
    } catch (error) {
      console.error('Error resetting password:', error.message)
      message.error('Có lỗi xảy ra. Vui lòng thử lại sau.')
    }
  }

  return (
    <div style={{ width: 400, margin: 'auto', marginTop: 50 }}>
      <h2>Reset Mật Khẩu</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="password"
          label="Mật Khẩu Mới"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          label="Xác Nhận Mật Khẩu Mới"
          dependencies={['password']}
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve()
                }
                return Promise.reject('Mật khẩu và xác nhận mật khẩu không khớp')
              }
            })
          ]}
        >
          <Input.Password />
        </Form.Item>
        {errorMessage && <div style={{ color: 'red', marginBottom: 16 }}>{errorMessage}</div>}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Đặt Lại Mật Khẩu
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default ResetPasswordPage

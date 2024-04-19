import React, { useState } from 'react'
import { Form, Input, Button, message } from 'antd'
import { Link } from 'react-router-dom'
import FARM from '../../services/farmService'

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values) => {
    try {
      setLoading(true)
      const response = await FARM.forgotPassword({ email: values.email })
      console.log('response:', response)
      if (response.status === 200) {
        message.success('Vui lòng kiểm tra email của bạn để đặt lại mật khẩu.')
      } else {
        console.error('Error submitting forgot password form:', response.message)
        message.error(response.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.')
      }
    } catch (error) {
      console.error('Error submitting forgot password form:', error.message)
      message.error('Có lỗi xảy ra. Vui lòng thử lại sau.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ width: '100%', maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Forgot Password</h2>
      <Form name="forgot-password-form" initialValues={{ remember: true }} onFinish={handleSubmit}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: 'Please input your email!'
            },
            {
              type: 'email',
              message: 'Please enter a valid email address!'
            }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }} loading={loading}>
            Submit
          </Button>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Link to="/login">Quay về đăng nhập</Link>
        </Form.Item>
      </Form>
    </div>
  )
}

export default ForgotPasswordPage

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FARM from '../../services/farmService'
import token from '../../utils/token'
import './Login.css' // Import CSS file for component styling
import { message, Spin } from 'antd'
const { setAccessToken, setRefreshToken } = token

const LoginPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false) // State cho loading
  let errorTimeoutId = null // Biến để lưu id của timeout

  const [loading, setLoading] = useState(false)

  const [activePanel, setActivePanel] = useState('sign-in')

  const switchToSignUp = () => {
    setActivePanel('sign-up')
  }

  const switchToSignIn = () => {
    setActivePanel('sign-in')
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  const handle_login = async (email, password) => {
    setIsLoading(true) // Bắt đầu loading khi bắt đầu đăng nhập
    try {
      const res = await FARM.login({ email, password })
      const accessToken = res?.data?.metadata?.metadata?.tokens?.accessToken
      const refreshToken = res?.data?.metadata?.metadata?.tokens?.refreshToken

      if (accessToken) {
        setAccessToken(accessToken)
      }
      if (refreshToken) {
        setRefreshToken(refreshToken)
      }

      const id = res?.data?.metadata?.metadata?.farm?._id
      if (id) {
        localStorage.setItem('id', id)
      }

      // Navigate to success page or handle success message
      console.log('Login success')
      navigate('/manage-planting-garden')
    } catch (error) {
      // Handle login failure
      console.error(error?.response?.data?.message)
      setErrorMessage('Email hoặc mật khẩu sai. Vui lòng thử lại.')

      // Đặt timeout để xóa thông báo sau 3 giây
      errorTimeoutId = setTimeout(() => {
        setErrorMessage('')
      }, 3000)
    } finally {
      setIsLoading(false) // Dừng loading khi kết thúc xử lý
    }
  }

  const handleForgetPassword = async (values) => {
    console.log('email quen', values)
    try {
      setLoading(true)
      const response = await FARM.forgotPassword({ email: values })
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

  const handleSubmit = (e) => {
    e.preventDefault()
    handle_login(email, password)
    console.log('Email:', email)
    console.log('Password:', password)
    setEmail('')
    setPassword('')
  }

  return (
    <div className="back">
      <div className={`container ${activePanel === 'sign-up' ? 'active' : ''}`} id="container">
        <div className="form-container sign-up">
          <form>
            <h1>Nhập tài khoản Email</h1>
            <input type="email" placeholder="Email" value={email} onChange={handleEmailChange} />
            <button
              type="button"
              onClick={() => {
                handleForgetPassword(email)
                setEmail('')
              }}
              disabled={loading}
            >
              {loading ? <Spin size="small" /> : 'Xác nhận'}
            </button>
          </form>
        </div>
        <div className={`form-container sign-in ${activePanel === 'sign-in' ? 'active' : ''}`}>
          <form onSubmit={handleSubmit}>
            <h1>Đăng nhập</h1>
            <input type="email" placeholder="Email" value={email} onChange={handleEmailChange} />
            <input type="password" placeholder="Mật khẩu" value={password} onChange={handlePasswordChange} />
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button type="submit" disabled={isLoading}>
              {isLoading ? <Spin size="small" /> : 'Đăng nhập'}
            </button>
          </form>
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className={`toggle-panel toggle-left ${activePanel === 'sign-in' ? 'active' : ''}`}>
              <h1>Quay trở về!</h1>
              <p>Nhấn vào đây nếu bạn muốn đăng nhập!</p>
              <button className="hidden" id="login" onClick={switchToSignIn}>
                Đăng nhập
              </button>
            </div>
            <div className={`toggle-panel toggle-right ${activePanel === 'sign-up' ? 'active' : ''}`}>
              <h1>Xin chào, Nông trại!</h1>
              <p>Nhấn vào đây nếu quyên mật khẩu!</p>
              <button className="hidden" id="register" onClick={switchToSignUp}>
                Quên mật khẩu?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

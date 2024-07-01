import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FARM from '../../services/farmService';
import token from '../../utils/token';
import './styles.css'; // Import CSS file for component styling

const { setAccessToken, setRefreshToken } = token;

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // State cho loading
  let errorTimeoutId = null; // Biến để lưu id của timeout

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handle_login = async (email, password) => {
    setIsLoading(true); // Bắt đầu loading khi bắt đầu đăng nhập
    try {
      const res = await FARM.login({ email, password });
      const accessToken = res?.data?.metadata?.metadata?.tokens?.accessToken;
      const refreshToken = res?.data?.metadata?.metadata?.tokens?.refreshToken;

      if (accessToken) {
        setAccessToken(accessToken);
      }
      if (refreshToken) {
        setRefreshToken(refreshToken);
      }

      const id = res?.data?.metadata?.metadata?.farm?._id;
      if (id) {
        localStorage.setItem('id', id);
      }

      // Navigate to success page or handle success message
      console.log('Login success');
      navigate('/manage-planting-garden');
    } catch (error) {
      // Handle login failure
      console.error(error?.response?.data?.message);
      setErrorMessage('Email hoặc mật khẩu sai. Vui lòng thử lại.');

      // Đặt timeout để xóa thông báo sau 3 giây
      errorTimeoutId = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    } finally {
      setIsLoading(false); // Dừng loading khi kết thúc xử lý
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handle_login(email, password);
    console.log('Email:', email);
    console.log('Password:', password);
    // Reset form fields if needed
    setEmail('');
    setPassword('');
  };

  return (
    <div className="back">
      <div className="container">
        <div className="form-container sign-in">
          <form onSubmit={handleSubmit}>
            <h1>Đăng nhập</h1>
            <input type="email" placeholder="Email" value={email} onChange={handleEmailChange} />
            <input type="password" placeholder="Mật khẩu" value={password} onChange={handlePasswordChange} />
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <a href="/forgot-password">Bạn đã quên mật khẩu?</a>
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </button>
          </form>
        </div>
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-right">
              <h1>Xin chào, Nông trại!</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

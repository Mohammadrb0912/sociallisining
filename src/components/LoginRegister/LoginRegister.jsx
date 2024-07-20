import React, { useState, useEffect } from 'react';
import './LoginRegister.css';
import { FaUser, FaLock } from 'react-icons/fa';
import axios from 'axios';
import image1 from '../Assest/Logo-Avatar.jpg';

export const LoginRegister = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState('');
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [userData, setUserData] = useState(null);
  const [inputError, setInputError] = useState({ username: false, password: false });

  useEffect(() => {
    generateCaptcha();
  }, []);

  const generateCaptcha = () => {
    const captchaCode = Math.floor(1000 + Math.random() * 9000).toString();
    setCaptcha(captchaCode);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setInputError({ username: false, password: false });

    if (username === '' || password === '' || captchaInput === '') {
      setError('لطفا همه موارد را پر کنید');
      return;
    }

    if (captchaInput !== captcha) {
      setCaptchaError('کد امنیتی نادرست است');
      setError('');
      generateCaptcha();
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/oauth/token', {
        username,
        password,
        'grant_type': 'password',
        'client_id': 2,
        'client_secret': 'DIVHzGFDt9934iBEvI4gnPph5wUF1xAoUyix2MPT',
        'scope': ''
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      });

      if (response.data.access_token) {
        setUserData(response.data);
        setError('');
        setCaptchaError('');
      } else {
        if (response.data.error === 'invalid_grant') {
          setError('نام کاربری یا رمز عبور اشتباه است');
        } else {
          setError('خطا رخ داد');
        }
        setCaptchaError('');
        setInputError({ username: true, password: true });
      }
    } catch (err) {
      if (err.response && err.response.data.error === 'invalid_grant') {
        setError('نام کاربری یا رمز عبور اشتباه است');
      } else {
        setError('خطا رخ داد');
      }
      setCaptchaError('');
      setInputError({ username: true, password: true });
    }
  };

  return (
    <div className="containerr">
      <div className="wrapper">
        <div className="form-box login">
          <form onSubmit={handleLogin}>
            <h1>آژانس سوشال لیسنینگ ایران</h1>
            <h5>قبل از صحبت کردن گوش کنید</h5>
            <div className="headerr">
              <img src={image1} alt="Logo" />
            </div>
            <div className='vorod'>
              <h2>ورود به حساب کاربری</h2>
            </div>
            <div className={`input-box ${inputError.username ? 'error-input' : ''}`}>
              <input
                type="text"
                value={username}
                placeholder="نام کاربری"
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <FaUser className="icon" />
            </div>
            <br />
            <div className={`input-box ${inputError.password ? 'error-input' : ''}`}>
              <input
                type="password"
                value={password}
                placeholder="رمز عبور"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FaLock className="icon" />
            </div>
            <div className="captcha-box">
              <p className="captcha">{captcha}</p>
              <input
                type="text"
                value={captchaInput}
                placeholder="کد امنیتی"
                onChange={(e) => setCaptchaInput(e.target.value)}
                required
              />
              {captchaError && <p className="error">{captchaError}</p>}
            </div>
            {error && <p className="error">{error}</p>}
            <br />

            <div className="remember-forgot">
              <label>
                <input type="checkbox" />
                مرا به خاطر بسپار
              </label>

              <a href="#">رمز عبور را فراموش کرده‌اید؟</a>
            </div>
            <br />
            <br />
            <button type="submit">ورود</button>
            <br />
            <div className="register-link">
              <p>
                حساب کاربری ندارید؟ لطفا جهت هر گونه اطلاعات بیشتر با شماره <a href="#">02128422415</a> تماس بگیرید
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

import { useState, useEffect } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import s from './login.module.css'

import { login_api, register_api } from "../../api/auth_api.ts"

export default function Login() {
  const [tab, setTab] = useState('signin')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: '',
    remember: false,
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  
  const [isShowPassword, setIsShowPassword] = useState(false)
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false)



  const isSignup = tab === 'signup'

  const handleChange = (event) => {
    const { name, type, checked, value } = event.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }
  const switchTab = () => {
    setTab((prev) => (prev === 'signin' ? 'signup' : 'signin'))
    setErrors({})
    setIsShowPassword(false)
    setIsShowConfirmPassword(false)
  }


  const validateForm = () => {

    const EmailRE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const PasswordRE = /^[A-Za-z0-9.\-_!?=]+$/;
    const NicknameRE = /^[A-Za-z][A-Za-z0-9_-]*$/;

    if ((formData.username.trim().length < 4 || formData.username.trim().length > 32) && isSignup) {
      setErrors((prev) => ({ ...prev, nick: 'Username must be between 4 and 32 characters' }))
      return false

    } else if (!NicknameRE.test(formData.username.trim()) && isSignup) {
      setErrors((prev) => ({ ...prev, nick: 'Invalid username format' }))
      return false

    } else if (formData.email.trim().length > 254) {
      setErrors((prev) => ({ ...prev, email: 'Email is too long' }))
      return false

    } else if (!EmailRE.test(formData.email.trim())) {
      setErrors((prev) => {
        return { ...prev, email: 'Invalid email format' }
      })
      return false

    } else if (!PasswordRE.test(formData.password)) {
      setErrors((prev) => ({ ...prev, password: 'Password contains invalid characters' }))
      return false

    } else if (formData.password.length < 8 || formData.password.length > 128) {
      setErrors((prev) => ({ ...prev, password: 'Password must be between 8 and 128 characters' }))
      return false

    } else if ((formData.password !== formData.confirmPassword) && isSignup) {
      setErrors((prev) => ({ ...prev, confirm_password: 'Passwords do not match' }))
      return false

    }

    return true
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const { username, email, password, confirmPassword, remember } = formData


    if (validateForm()) {
      setIsLoading(true)
      if (isSignup) {
        async function load() {
          const data = await register_api(username, email, password, confirmPassword)

          if (data.detail){
            const [field, msg] = data.detail.split(": ")
            setErrors({ [field]: msg})
          } else {   
            setErrors({})
          }
          setIsLoading(false)
        }
        load()

      } else {
        async function load() {
          const data = await login_api(email, password)

          if (data.detail){
            const [field, msg] = data.detail.split(": ")
            setErrors({ [field]: msg})
          } else {   
            setErrors({})
          }
          setIsLoading(false)
        }
        load()
      }
    }
  }


  return (<>
    <main className={s.login_container}>
      <article className={s.article}>
        <section className={s.info}>
          <span className={s.badge}>
            {isSignup ? 'Create account' : 'Welcome back'}
          </span>
          <h1 className={s.title}>
            {isSignup ? 'Join the Workspace' : 'Secure Access'}
          </h1>
          <p className={s.description}>
            {isSignup
              ? 'Set up your profile and start managing your workspace in one place.'
              : 'Sign in to manage your workspace, check updates, and keep your progress in one place.'}
          </p>
          <ul className={s.points}>
            <li>
              {isSignup
                ? 'Quick profile setup with your username'
                : 'Private dashboard and activity history'}
            </li>
            <li>
              {isSignup
                ? 'Start with secure credentials in minutes'
                : 'Fast access to your saved sessions'}
            </li>
            <li>
              {isSignup
                ? 'Keep your data organized from day one'
                : 'Consistent settings across devices'}
            </li>
          </ul>
        </section>

        <section className={s.form}>
          <h2 className={s.form_title}>{isSignup ? 'Sign Up' : 'Sign In'}</h2>
          <p className={s.form_hint}>
            {isSignup
              ? 'Create your account to continue.'
              : 'Use your email and password to continue.'}
          </p>

          <form className={s.form_body} onSubmit={handleSubmit}>
            {isSignup && (
              <label className={s.label}>
                Username
                <input
                  className={s.input}
                  type='text'
                  name='username'
                  placeholder='Choose a username'
                  autoComplete='username'
                  value={formData.username}
                  onChange={handleChange}
                />
                <span className={s.error}>{errors.nick}</span>
              </label>
            )}

            <label className={s.label}>
              Email
              <input
                className={s.input}
                type='email'
                name='email'
                placeholder='you@example.com'
                autoComplete='email'
                value={formData.email}
                onChange={handleChange}
              /> 
              <span className={s.error}>{errors.email}</span>
            </label>

            <label className={s.label}>
              Password
              <div className={s.input_wrap}>
                <input
                  className={`${s.input} ${s.input_with_toggle}`}
                  type={isShowPassword ? 'text' : 'password'}
                  name='password'
                  placeholder='Enter your password'
                  autoComplete='current-password'
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  className={s.toggle_password}
                  type='button'
                  onClick={() => setIsShowPassword((prev) => !prev)}
                  aria-label={isShowPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={isShowPassword}
                >
                  {isShowPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <span className={s.error}>{errors.password}</span>
            </label>

            {isSignup && (
              <label className={s.label}>
                Confirm Password
                <div className={s.input_wrap}>
                  <input
                    className={`${s.input} ${s.input_with_toggle}`}
                    type={isShowConfirmPassword ? 'text' : 'password'}
                    name='confirmPassword'
                    placeholder='Repeat your password'
                    autoComplete='new-password'
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    className={s.toggle_password}
                    type='button'
                    onClick={() => setIsShowConfirmPassword((prev) => !prev)}
                    aria-label={
                      isShowConfirmPassword
                        ? 'Hide confirm password'
                        : 'Show confirm password'
                    }
                    aria-pressed={isShowConfirmPassword}
                  >
                    {isShowConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                <span className={s.error}>{errors.confirm_password}</span>
              </label>
            )}

            {!isSignup && (
              <div className={s.row}>
                <label className={s.checkbox}>
                  <input
                    type='checkbox'
                    name='remember'
                    checked={formData.remember}
                    onChange={handleChange}
                  />
                  Remember me
                </label>
                <a className={s.link} href='#'>
                  Forgot password?
                </a>
              </div>
            )}

            <button className={isLoading ? s.button : `${s.button} ${s.button_padding}` } type='submit' disabled={isLoading}>
              {isLoading 
              ? <div className={s.spiner_container}>
                <div className={s.spiner}>
                  <svg viewBox="0 0 50 50">
                    <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                  </svg>
                </div>
              </div>
              : (isSignup ? 'Create Account' : 'Log In')
              }
            </button>
          </form>

          <p className={s.signup}>
            {isSignup ? 'Already have an account?' : 'No account yet?'}{' '}
            <button className={s.switch_button} type='button' onClick={switchTab}>
              {isSignup ? 'Sign in' : 'Create one'}
            </button>
          </p>
        </section>
      </article>
    </main>
  </>)
}

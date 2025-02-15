import React, { useState } from 'react'
import "./Auth.css"

import Logo from "../../images/logo.avif"
import { toast } from 'react-toastify'
import { login, register } from '../../api/authRequests'
import { useInfoContext } from '../../context/Context'


const Auth = () => {
  const {setCurrentUser} = useInfoContext()
  const [loading, setLoading] = useState(false)
  const [isSignup, setIsSignup] = useState(true)
  const [confirmPass, setConfirmPass] = useState(true)


  const handleAuthForm = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    setLoading(true)
    try {
      toast.loading("Please wait...")
      let res;

      if(!isSignup) {
        // register
        const password = formData.get('password')
        const confirmPassword = formData.get('confirmPassword')
        if(password === confirmPassword) {
          setConfirmPass(true)
          res = await register(formData)
        } else {
          setConfirmPass(false)
          toast.dismiss()
          setLoading(false)
          return
        }
      } else {
        // login
        res = await login(formData)
      }
      setCurrentUser(res.data.user)
      localStorage.setItem('profile', JSON.stringify(res.data.user))
      localStorage.setItem('token', JSON.stringify(res.data.token))
      toast.dismiss()
      setLoading(false)      
    } catch (error) {
      setLoading(false)
      toast.dismiss()
      toast.error(error.response.data.message)
    }

  }

  return (
    <div className='auth-page'>
      <div className="left-side">
        <img width={80} src={Logo} alt="logo" className="logo-img" />
        <div className="chat-name">
          <h1>Chatxona Media App</h1>
          <h5>Explore with WEBSTAR IT ACADEMY</h5>
        </div>
      </div>

      <div className="right-side">
        <form onSubmit={handleAuthForm} action="" className="auth-form">
          <h3>{isSignup ? "Login" : "Signup"}</h3>
          {
            !isSignup && <>
              <div>
                <input type="text" name='firstname' className="info-input" placeholder='Enter your firstname' required/>
              </div>
              <div>
                <input type="text" name='lastname' className="info-input" placeholder='Enter your lastname' required/>
              </div>
            </>
          }
          <div>
            <input type="email" name='email' className="info-input" placeholder='Enter your email' required/>
          </div>
          <div>
            <input type="password" name='password' className="info-input" placeholder='Enter your password' required/>
          </div>

          {
            !isSignup && 
            <div>
              <input type="password" name='confirmPassword' className="info-input" placeholder='Confirm your password' required/>
            </div>
          }

          {!confirmPass && <span className="confirm-span">*Confirm password is not same!</span>}
          
          <span onClick={() => setIsSignup(!isSignup)} className="info-span">{isSignup ? "Don't have an account, Signup" : "Already have an account, Login"}</span>
          <button disabled={loading} className='info-btn button'>{isSignup ? "Login" : "Signup"}</button>
        </form>
      </div>

    </div>
  )
}

export default Auth
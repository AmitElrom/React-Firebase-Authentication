import { useContext, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import authContext from '../../store/auth-context';

import classes from './AuthForm.module.css';

const AuthForm = () => {

  const navigate = useNavigate();

  const { login } = useContext(authContext);

  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitAuthFormHandler = async (e) => {
    e.preventDefault()

    const enteredEmail = emailInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    try {
      // basic verification
      if (enteredEmail.includes('@') && enteredPassword.trim().length > 0) {
        setIsLoading(true)
        let signUpUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAnNM-XYPvMjILxz2KsBLgfNdLOTDAdi1U';
        let signInUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAnNM-XYPvMjILxz2KsBLgfNdLOTDAdi1U';
        const resp = await fetch(isLogin ? signInUrl : signUpUrl, {
          method: 'POST',
          body: JSON.stringify({
            email: enteredEmail,
            password: enteredPassword,
            returnSecureToken: true
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        })
        setIsLoading(false)
        const data = await resp.json();
        if (resp.ok) {
          const expirationTime = new Date(new Date().getTime() + (+data.expiresIn) * 1000);
          login(data.idToken, expirationTime.toISOString());
          navigate('/', { replace: true })
        } else {
          if (data.error && data.error.message) {
            throw new Error(data.error.message)
          }
        }
      }
    } catch (error) {
      if (error) {
        alert(error)
      } else {
        isLogin ? alert('Sign In Failed') : alert('Sign Up Failed')
      }
    }

  }


  return (
    <section className={classes.auth}>
      {isLoading && <p>Loading...</p>}
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitAuthFormHandler} >
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input type='email' id='email' required ref={emailInputRef} />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input type='password' id='password' required ref={passwordInputRef} />
        </div>
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='submit'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AuthForm;

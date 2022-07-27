import { useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import authContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';

const ProfileForm = () => {

  const navigate = useNavigate();

  const { token } = useContext(authContext);

  const passwordInputRef = useRef();

  const submitNewPasswordHandler = async e => {
    e.preventDefault();

    try {
      const resp = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyAnNM-XYPvMjILxz2KsBLgfNdLOTDAdi1U', {
        method: 'POST',
        body: JSON.stringify({
          idToken: token,
          password: passwordInputRef.current.value,
          returnSecureToken: false
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log(resp);
      navigate('/', { replace: true })
    } catch (error) {

    }
  }

  return (
    <form className={classes.form} onSubmit={submitNewPasswordHandler} >
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input type='password' id='new-password' ref={passwordInputRef} />
      </div>
      <div className={classes.action}>
        <button type='submit' >Change Password</button>
      </div>
    </form>
  );
}

export default ProfileForm;

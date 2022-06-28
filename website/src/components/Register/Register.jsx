import React, {useEffect, useState} from 'react';
import {Alert, Button, CircularProgress, Snackbar, TextField} from "@mui/material";
import {useHistory} from "react-router-dom";

const Register = ({

}) => {

  const [name, setName] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [passwordCheck, setPasswordCheck] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  useEffect(() => {
    if(name && email && password && passwordCheck) setIsDisabled(false);
    else setIsDisabled(true);
  }, [name, email, password, passwordCheck])

  const handleInputChange = e => {
    const inputName = e.target.name;
    const value = e.target.value;
    if(inputName === 'name') setName(value);
    if(inputName === 'email') setEmail(value);
    if(inputName === 'password') setPassword(value);
    else setPasswordCheck(value);
  }

  const arePasswordsEqual = () => password === passwordCheck;

  const handleSubmit = () => {
    if(!arePasswordsEqual()) {
      setError(true);
      setErrorMessage('Las contraseñas deben coincidir');
      return;
    }
    setError(false);
    setLoading(true);
    fetch('https://southamerica-east1-cloud-student-system.cloudfunctions.net/post-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: name,
        email,
        password
      })
    })
      .then(res => res.json())
      .then(res => {
        if(res.msg.name === 'error') {
          throw new Error(res.msg.detail);
        }
        localStorage.setItem('cloud-token', res.msg);
        history.push('/');
      })
      .catch(err => {
        setError(true);
        setErrorMessage(err.message);
      })
      .finally(() => setLoading(false));
  }

  return (
    <div style={{width: '100vw'}}>
      <div style={{width: '50%', height: 550, margin: '50px auto', border: 'solid 1px black', borderRadius: 6, display: 'flex', flexDirection: 'column', textAlign: 'center', marginTop: 30, paddingTop: 30}}>
        <h3>Bienvenido a la plataforma para estudiantes</h3>
        <p>Si ya tenés cuenta, iniciá sesión <a href={'/login'}>acá</a>.</p>
        { error && <Alert severity="error" sx={{ width: '50%', margin: '10px auto' }}>{errorMessage}</Alert> }
        <div style={{width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: '20px auto'}}>
          <TextField name={'name'} type={'text'} variant={'standard'} placeholder={'Ingresá tu nombre completo'} onChange={handleInputChange} fullWidth style={{marginBottom: 30}}/>
          <TextField name={'email'} type={'text'} variant={'standard'} placeholder={'Ingresá tu email'} onChange={handleInputChange} fullWidth style={{marginBottom: 30}}/>
          <TextField name={'password'} type={'password'} variant={'standard'} placeholder={'Ingresá tu contraseña'} onChange={handleInputChange} fullWidth style={{marginBottom: 30}}/>
          <TextField name={'password-check'} type={'password'} variant={'standard'} placeholder={'Repetí tu contraseña'} onChange={handleInputChange} fullWidth style={{marginBottom: 30}}/>
          <Button variant={'contained'} onClick={handleSubmit} disabled={isDisabled || loading}>
            {
              loading ?
                <CircularProgress sx={{color: 'white'}} size={25}/> :
                'Registrarse'
            }
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Register;
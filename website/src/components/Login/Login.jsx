import React, {useEffect, useState} from "react";
import {Alert, Button, CircularProgress, Snackbar, TextField} from "@mui/material";
import {useHistory} from "react-router-dom";

const Login = ({

}) => {

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const history = useHistory();
  const ERROR_MSG = 'Las credenciales de acceso son incorrectas';

  useEffect(() => {
    if(!!email && !!password) setIsDisabled(false)
    else setIsDisabled(true);
  }, [email, password])


  const handleInputChange = e => {
    const inputName = e.target.name;
    const value = e.target.value;
    if(inputName === 'email') setEmail(value);
    else setPassword(value);
  }

  const handleSubmit = () => {
    setLoading(true);
    setError(false);
    fetch('https://southamerica-east1-cloud-student-system.cloudfunctions.net/login',{
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
      })
    })
      .then(res => res.json())
      .then(res => {
        if(res.msg === ERROR_MSG) throw new Error(res.msg);
        localStorage.setItem('cloud-token', res.msg);
        history.push('/');
      })
      .catch(err => {
        setError(true);
        setErrorMessage(err.message);
        console.error(err.message);
      })
      .finally(() => setLoading(false));
  }

  return (
    <div style={{width: '100vw'}}>
      <div style={{width: '50%', height: 400, margin: '50px auto', border: 'solid 1px black', borderRadius: 6, display: 'flex', flexDirection: 'column', textAlign: 'center', marginTop: 30, paddingTop: 30}}>
        <h3>Para poder utilizar la plataforma para estudiantes, iniciá sesión primero.</h3>
        <p>Si no tenés cuenta aún, registrate <a href={'/register'}>acá</a>.</p>
        { error && <Alert severity="error" sx={{ width: '50%', margin: '10px auto' }}>{errorMessage}</Alert> }
        <div style={{width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: '20px auto'}}>
          <TextField name={'email'} type={'text'} variant={'standard'} placeholder={'Email'} onChange={handleInputChange} fullWidth style={{marginBottom: 30}}/>
          <TextField name={'password'} type={'password'} variant={'standard'} placeholder={'Contraseña'} onChange={handleInputChange} fullWidth style={{marginBottom: 30}}/>
          <Button variant={'contained'} onClick={handleSubmit} disabled={isDisabled || loading}>
            {
              loading ?
                <CircularProgress sx={{color: 'white'}} size={25}/> :
                'Iniciar sesión'
            }
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
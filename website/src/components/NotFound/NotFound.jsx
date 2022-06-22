import React from 'react';
import {Link} from "react-router-dom";

const NotFound = () => {

  return (
    <div style={{width: 400, height: 400, margin: '50px auto', textAlign: 'center'}}>
      <h3>La página a la que estás queriendo acceder no existe.</h3>
      <Link to={'/'}>Inicio.</Link>
    </div>
  )
}

export default NotFound;
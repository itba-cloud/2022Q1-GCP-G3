import React from 'react';
import Navbar from "./Navbar";

const Frame = ({
  children
}) => {

  return (
    <div style={{width: '100vw'}}>
      <Navbar/>
      {children}
    </div>
  )
};

export default Frame;
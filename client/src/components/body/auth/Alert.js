import React, { useEffect } from 'react';

const Alert = ({ type, msg, removeAlert}) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      removeAlert()
    }, 3000);
    return () => clearTimeout(timeout);
  }, [removeAlert]);
  return <p className={`alert alert-${type}`}>{msg}</p>;
};


export const Alert2 = ({ type, msg, removeAlert}) => {
  
  return <p className={`alert2 alert-${type}`}>{msg}</p>;
};

export default Alert;

import jwt from 'jsonwebtoken';


const jwtTokens = ({id, name, email, password }) => {
  const user = {id, name, email, password}; 
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
  return ({ accessToken, refreshToken});
}

const activateToken = ({id,name, email, password, role}) => {

  const user = {id,name, email, password, role}

  const activateToken = jwt.sign(user, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn:'15m'})

  return({activateToken})
}

export  {jwtTokens,activateToken};
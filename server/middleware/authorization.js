import jwt from 'jsonwebtoken'


export const authorization = (req, res, next) => {

    
    
    const token = req.headers.authorization
    //console.log(token)
    
    if(token === null) return res.status(401).json({error:"Null token"});

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
    if (error) {
      console.log('first')
      return res.status(403).json({
      status: 'failed_auth',
      error : error.message});
    }
    req.user = user;

    console.log('trece')
    
    next();
  });
    

}
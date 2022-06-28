const {Pool} = require('pg')
const jwt = require('jsonwebtoken');

const dbSocketAddr = process.env.DB_HOST.split(':');

const credentials = {
  "user": process.env.DB_USER,
  "password": process.env.DB_PASS, 
  "database": process.env.DB_NAME, 
  "host": dbSocketAddr[0], 
  "port": dbSocketAddr[1]
}

const pool = new Pool(credentials);

const JWT_KEY = 'cloud-tp-key'; // exportar a process.env

exports.postUserSubject = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if(req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  let code, response;
  
  let authHeader = req.headers['Authorization'];
  if(!authHeader) authHeader = req.headers['authorization']; // case sensitivity for HTTP/2 standard
  if(!authHeader) {
    res.status(403).json({msg: 'Unauthorized.'});
    return;
  }

  const userToken = authHeader.split('Bearer ')[1];
  if(!jwt.verify(userToken, JWT_KEY)) {
    res.status(403).json({msg: `Invalid token: ${userToken}`});
    return;
  }
  
  const {id} = jwt.decode(userToken);
  const {subjectId} = req.body;

  pool.connect((error, client, release) => {
    if(error) {
      res.status(500).json({msg: 'Error getting pg client'});
      return;
    }
    const query = `INSERT INTO subjects_users(user_id, subject_id) VALUES(${id}, ${parseInt(subjectId)})`;
    client.query(query)
    .then(res => {
      code = 200;
      response = 'Usuario anotado en materia exitosamente';
    })
    .catch(err => {
      code = 400;
      response = err;
    })
    .finally(() => {
      client.release();
      res.status(code).json({msg: response});
    });
  });
}
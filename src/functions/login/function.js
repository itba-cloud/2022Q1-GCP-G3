const {Pool} = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const dbSocketAddr = process.env.DB_HOST.split(':');

const credentials = {
  "user": process.env.DB_USER,
  "password": process.env.DB_PASS, 
  "database": process.env.DB_NAME, 
  "host": dbSocketAddr[0], 
  "port": dbSocketAddr[1]
}

const JWT_KEY = 'cloud-tp-key'; // exportar a process.env

const pool = new Pool(credentials);

exports.login = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if(req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  pool.connect(async (error, client, release) => {
    if(error) {
      res.status(500).json({msg: 'Error getting pg client'})
      return;
    }
    const email = req.body.email;
    const userPassword = req.body.password;
    let response;
    let code;
    const query = `SELECT id, full_name, password FROM users WHERE email='${email}';`;
    client.query(query)
      .then(async res => {
        if(res.rowCount == 0) {
          response = 'Las credenciales de acceso son incorrectas';
          code = 401;
        } else {
          const {id, full_name, password} = res.rows[0];
          const samePasswords = await bcrypt.compare(userPassword, password);
          if(!samePasswords) {
            response = 'Las credenciales de acceso son incorrectas';
            code = 401;
          } else {
            response = jwt.sign({
              id,
              email,
              fullName: full_name
            }, JWT_KEY);
            code = 200;
          }
        }
      })
      .catch(err => {
        console.error(err);
        response = err;
        code = 422;
      })
      .finally(() => {
        client.release();
        res.status(code).json({msg: response});
      });
  });
}
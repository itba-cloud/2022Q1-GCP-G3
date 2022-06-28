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

const pool = new Pool(credentials);

const JWT_KEY = 'cloud-tp-key'; // exportar a process.env

exports.postUser = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if(req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }
  pool.connect((error, client, release) => {
    if(error) {
      res.status(500).json({msg: 'Error getting pg client'})
      client.release();
      res.status(code).json({msg: response});
      return;
    }
    const {fullName, email, password} = req.body;
    let response;
    let code;
    bcrypt.hash(password, 1, (err, hash) => {
      if(err) {
        response = err;
        code = 500;
        return;
      }
      const query = `INSERT INTO users(full_name, email, password) VALUES ('${fullName}', '${email}', '${hash}') RETURNING id;`;
      client.query(query)
      .then(res => {
        const id = res.rows[0].id;
        response = jwt.sign({id, email, fullName}, JWT_KEY);
        code = 200;
      })
      .catch(err => {
        response = err;
        code = 422;
      })
      .finally(() => {
        client.release();
        res.status(code).json({msg: response});
      });
    });
  });
}
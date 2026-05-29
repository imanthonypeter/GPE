const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    if (!['student', 'leader', 'teacher'].includes(role)) {
      return res.status(400).json({ error: 'Papel inválido' });
    }

    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const result = await db.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, password_hash, role]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    console.error('Error in register:', error);
    if (error.code === '23505') { // violação de unicidade
      return res.status(400).json({ error: 'E-mail já existe' });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: 'E-mail ou senha inválidos' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

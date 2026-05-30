const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuração do Multer para salvar imagens na pasta uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'avatar-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Formato de arquivo inválido. Apenas imagens são permitidas.'));
    }
  }
}).single('avatar');

const updateProfile = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  if (!name) {
    return res.status(400).json({ error: 'O nome é obrigatório.' });
  }

  try {
    const result = await db.query(
      'UPDATE users SET name = $1 WHERE id = $2 RETURNING id, name, email, role, avatar_url',
      [name, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    res.json({ message: 'Perfil atualizado com sucesso!', user: result.rows[0] });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(500).json({ error: 'Erro interno ao atualizar perfil.' });
  }
};

const uploadAvatar = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem foi enviada.' });
    }

    const userId = req.user.id;
    // Constrói a URL para acessar a imagem (assumindo que o express serve a rota /uploads)
    // O ideal é salvar apenas o path relativo e o frontend anexa a URL base se necessário
    const avatarUrl = `/uploads/${req.file.filename}`;

    try {
      // Pega a URL antiga para apagar o arquivo antigo (opcional, boa prática)
      const userRes = await db.query('SELECT avatar_url FROM users WHERE id = $1', [userId]);
      const oldUrl = userRes.rows[0]?.avatar_url;

      if (oldUrl && oldUrl.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '../..', oldUrl);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      const result = await db.query(
        'UPDATE users SET avatar_url = $1 WHERE id = $2 RETURNING id, name, email, role, avatar_url',
        [avatarUrl, userId]
      );

      res.json({ 
        message: 'Avatar atualizado com sucesso!', 
        user: result.rows[0],
        avatar_url: avatarUrl 
      });
    } catch (error) {
      console.error('Erro ao salvar avatar no banco:', error);
      res.status(500).json({ error: 'Erro interno ao salvar avatar.' });
    }
  });
};

module.exports = {
  updateProfile,
  uploadAvatar
};

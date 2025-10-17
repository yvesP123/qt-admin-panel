const db = require('../config/database');
const { hashEmail, signHash } = require('../utils/crypto');
const { encodeUsers } = require('../utils/protobuf');

// Create User
exports.createUser = (req, res) => {
  const { email, role, status } = req.body;

  if (!email || !role || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Check if email already exists
  const checkSql = 'SELECT email FROM users WHERE email = ?';
  db.get(checkSql, [email], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (row) {
      return res.status(409).json({ error: 'User is  already exists' });
    }

    // Email doesn't exist, proceed with user creation
    const createdAt = new Date().toISOString();
    const emailHash = hashEmail(email);
    const signature = signHash(emailHash);

    const sql = `INSERT INTO users (email, role, status, createdAt, emailHash, signature) 
                 VALUES (?, ?, ?, ?, ?, ?)`;

    db.run(sql, [email, role, status, createdAt, emailHash, signature], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        id: this.lastID,
        email,
        role,
        status,
        createdAt,
        emailHash,
        signature
      });
    });
  });
};
exports.createdefaultuser = (req, res) => {
  const email = 'default1@example.com';
  const role = 'user';
  const status = 'active';

  const createdAt = new Date().toISOString();
  const emailHash = hashEmail(email);
  const signature = "62e56f5b25010682a9703fc12727fc31305c9858d5210ed95f1ba97b669ca0053c132fa9a30577cbc1ebfcd6e0cd5129a60380dd5440bc0a3fca982822cc3dcfe242050dbdd9d12a88fb7ade436b9845a3224332bceaea737243af06182e302a0a75f8df4e8dc302c3df2a56be0d1119143b2b2d9c64322da8b149c0b77f3c1faefe109669197d480d225c48aae9b4a0be33a13b7612244fc3ffb7dd7cec24b2f30446fd714fff89bf74531fcba05d42528f5133865c0ad6187fdae344d49bd08c88dd9b4956e64c20e555c422b31d3804346889061606f04ab6e4ce2c552a7a7fb57673c91b8ee4ef5e122fd15db9f6eb8ec5f8463b8288a045da0b09e75235";  

  const sql = `INSERT INTO users (email, role, status, createdAt, emailHash, signature) 
               VALUES (?, ?, ?, ?, ?, ?)`;

  db.run(sql, [email, role, status, createdAt, emailHash, signature], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({
      id: this.lastID,
      email,
      role,
      status,
      createdAt,
      emailHash,
      signature
    });
  });
};

// Get All Users
exports.getUsers = (req, res) => {
  const sql = `SELECT * FROM users ORDER BY createdAt DESC`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};

// Get User by ID
exports.getUserById = (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM users WHERE id = ?`;

  db.get(sql, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(row);
  });
};

// Update User
exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { email, role, status } = req.body;

  if (!email || !role || !status) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const emailHash = hashEmail(email);
  const signature = signHash(emailHash);

  const sql = `UPDATE users SET email = ?, role = ?, status = ?, emailHash = ?, signature = ? 
               WHERE id = ?`;

  db.run(sql, [email, role, status, emailHash, signature, id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User updated successfully' });
  });
};

// Delete User
exports.deleteUser = (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM users WHERE id = ?`;

  db.run(sql, [id], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  });
};

// Export Users as Protobuf
exports.exportUsers = (req, res) => {
  const sql = `SELECT * FROM users ORDER BY createdAt DESC`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const buffer = encodeUsers(rows);
    
    res.set('Content-Type', 'application/octet-stream');
    res.set('Content-Disposition', 'attachment; filename="users.pb"');
    res.send(Buffer.from(buffer));
  });
};

// Get users created per day (last 7 days)
exports.getUserStats = (req, res) => {
  const sql = `
    SELECT DATE(createdAt) as date, COUNT(*) as count
    FROM users
    WHERE DATE(createdAt) >= DATE('now', '-7 days')
    GROUP BY DATE(createdAt)
    ORDER BY date ASC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
};
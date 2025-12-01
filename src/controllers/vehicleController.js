// src/controllers/vehicleController.js
const pool = require('../db');

// GET /api/vehicles
exports.getAllVehicles = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vehicles ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
};

// GET /api/vehicles/:id
exports.getVehicleById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query('SELECT * FROM vehicles WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch vehicle' });
  }
};

// POST /api/vehicles
exports.createVehicle = async (req, res) => {
  const { owner_name, vehicle_type, brand, model, plate_number, year } = req.body;

  if (!owner_name || !vehicle_type || !brand || !model || !plate_number) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO vehicles (owner_name, vehicle_type, brand, model, plate_number, year)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [owner_name, vehicle_type, brand, model, plate_number, year || null]
    );

    const [rows] = await pool.query('SELECT * FROM vehicles WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Plate number already exists' });
    }
    res.status(500).json({ error: 'Failed to create vehicle' });
  }
};

// PUT /api/vehicles/:id
exports.updateVehicle = async (req, res) => {
  const { id } = req.params;
  const { owner_name, vehicle_type, brand, model, plate_number, year } = req.body;

  try {
    const [result] = await pool.query(
      `UPDATE vehicles 
       SET owner_name = ?, vehicle_type = ?, brand = ?, model = ?, plate_number = ?, year = ?
       WHERE id = ?`,
      [owner_name, vehicle_type, brand, model, plate_number, year || null, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    const [rows] = await pool.query('SELECT * FROM vehicles WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update vehicle' });
  }
};

// DELETE /api/vehicles/:id
exports.deleteVehicle = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await pool.query('DELETE FROM vehicles WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json({ message: 'Vehicle deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete vehicle' });
  }
};

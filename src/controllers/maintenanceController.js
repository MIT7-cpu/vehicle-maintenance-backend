const pool = require('../db'); 

// GET /api/maintenance?vehicleId=?
exports.getMaintenance = async (req, res) => {
  try {
    const { vehicleId } = req.query;

    let sql = 'SELECT * FROM maintenance_records';
    const params = [];

    if (vehicleId) {
      sql += ' WHERE vehicle_id = ?';
      params.push(vehicleId);
    }

    sql += ' ORDER BY service_date DESC';

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching maintenance records:', err);
    res.status(500).json({ error: 'Failed to fetch maintenance records' });
  }
};

// POST /api/maintenance
exports.createMaintenance = async (req, res) => {
  try {
    const {
      vehicle_id,
      service_type,
      description,
      mileage,
      cost,
      service_date,
      next_service_date,
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO maintenance_records
       (vehicle_id, service_type, description, mileage, cost, service_date, next_service_date)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        vehicle_id,
        service_type,
        description || null,
        mileage || null,
        cost || null,
        service_date,
        next_service_date || null,
      ]
    );

    const [rows] = await pool.query(
      'SELECT * FROM maintenance_records WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Error creating maintenance record:', err);
    res.status(500).json({ error: 'Failed to create maintenance record' });
  }
};

// PUT /api/maintenance/:id
exports.updateMaintenance = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      vehicle_id,
      service_type,
      description,
      mileage,
      cost,
      service_date,
      next_service_date,
    } = req.body;

    await pool.query(
      `UPDATE maintenance_records
       SET vehicle_id = ?, service_type = ?, description = ?, mileage = ?, cost = ?,
           service_date = ?, next_service_date = ?
       WHERE id = ?`,
      [
        vehicle_id,
        service_type,
        description || null,
        mileage || null,
        cost || null,
        service_date,
        next_service_date || null,
        id,
      ]
    );

    const [rows] = await pool.query(
      'SELECT * FROM maintenance_records WHERE id = ?',
      [id]
    );

    res.json(rows[0]);
  } catch (err) {
    console.error('Error updating maintenance record:', err);
    res.status(500).json({ error: 'Failed to update maintenance record' });
  }
};

// DELETE /api/maintenance/:id
exports.deleteMaintenance = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('DELETE FROM maintenance_records WHERE id = ?', [id]);

    res.json({ message: 'Maintenance record deleted' });
  } catch (err) {
    console.error('Error deleting maintenance record:', err);
    res.status(500).json({ error: 'Failed to delete maintenance record' });
  }
};

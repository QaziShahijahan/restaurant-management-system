import Table from "../models/Table.js";

/**
 * Keep tables sequential when deleting:
 * After deletion, we will renumber tables to be 1..N
 */
export const listTables = async (req, res, next) => {
  try {
    const tables = await Table.find().sort({ tableNumber: 1 }).lean();
    res.json({ success: true, data: tables });
  } catch (err) {
    next(err);
  }
};

export const createTable = async (req, res, next) => {
  try {
    // Find current max tableNumber
    const last = await Table.findOne().sort({ tableNumber: -1 }).lean();
    const nextNumber = last ? last.tableNumber + 1 : 1;
    const payload = {
      tableNumber: nextNumber,
      seats: req.body.seats || 2,
      name: req.body.name || "",
      reserved: req.body.reserved || false
    };
    const table = await Table.create(payload);
    res.status(201).json({ success: true, data: table });
  } catch (err) {
    next(err);
  }
};

export const updateTable = async (req, res, next) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: table });
  } catch (err) {
    next(err);
  }
};

export const deleteTable = async (req, res, next) => {
  try {
    const deleting = await Table.findByIdAndDelete(req.params.id);
    if (!deleting) return res.status(404).json({ success: false, message: "Not found" });

    // Renumber all tables sequentially
    const tables = await Table.find().sort({ tableNumber: 1 });
    for (let i = 0; i < tables.length; i++) {
      tables[i].tableNumber = i + 1;
      await tables[i].save();
    }

    res.json({ success: true, message: "Deleted and renumbered" });
  } catch (err) {
    next(err);
  }
};

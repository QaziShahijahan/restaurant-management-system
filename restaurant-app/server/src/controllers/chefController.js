import Chef from "../models/Chef.js";

export const listChefs = async (req, res, next) => {
  try {
    const chefs = await Chef.find().lean();
    res.json({ success: true, data: chefs });
  } catch (err) {
    next(err);
  }
};

export const createChef = async (req, res, next) => {
  try {
    const chef = await Chef.create(req.body);
    res.status(201).json({ success: true, data: chef });
  } catch (err) {
    next(err);
  }
};

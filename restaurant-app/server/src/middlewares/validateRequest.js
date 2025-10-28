/**
 * validateRequest(schema)
 * -----------------------
 * Generic middleware to validate req.body (or req.query) against a given schema.
 * Schema is a simple JS object where:
 * - key = field name
 * - value = "required" | "optional" | custom validator function(value)
 *
 * Example usage:
 * router.post("/", validateRequest({
 *   name: "required",
 *   price: (v) => typeof v === "number" && v > 0
 * }), createMenuItem);
 */

export function validateRequest(schema, target = "body") {
  return (req, res, next) => {
    const data = req[target];

    for (const [key, rule] of Object.entries(schema)) {
      const value = data[key];

      // Case 1: Required field missing or empty
      if (rule === "required" && (value === undefined || value === null || value === "")) {
        return res.status(400).json({
          success: false,
          message: `Missing required field: ${key}`
        });
      }

      // Case 2: Custom validator function returns false
      if (typeof rule === "function") {
        const valid = rule(value);
        if (!valid) {
          return res.status(400).json({
            success: false,
            message: `Invalid value for field: ${key}`
          });
        }
      }

      // "optional" fields are ignored
    }

    next(); // All checks passed
  };
}

const { z } = require('zod');

const locationSchema = z.string()
  .min(1, 'Location is required')
  .max(200, 'Location is too long')
  .transform(s => s.trim());

const dateSchema = z.string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
  .refine(s => !isNaN(Date.parse(s)), 'Invalid date');

const createWeatherSchema = z.object({
  location: locationSchema,
  start_date: dateSchema.optional(),
  end_date: dateSchema.optional(),
  notes: z.string().max(500).optional()
}).refine(data => {
  if (data.start_date && data.end_date) {
    return new Date(data.start_date) <= new Date(data.end_date);
  }
  return true;
}, { message: 'start_date must be on or before end_date', path: ['end_date'] });

const updateWeatherSchema = z.object({
  location: locationSchema.optional(),
  start_date: dateSchema.optional(),
  end_date: dateSchema.optional(),
  temperature: z.number().min(-100).max(100).optional(),
  weather_condition: z.string().max(100).optional(),
  humidity: z.number().int().min(0).max(100).optional(),
  wind_speed: z.number().min(0).optional(),
  notes: z.string().max(500).optional()
});

const queryParamsSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
  location: z.string().optional()
});

function validate(schema, data) {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = result.error.errors.map(e => ({
      field: e.path.join('.'),
      message: e.message
    }));
    return { valid: false, errors, data: null };
  }
  return { valid: true, errors: [], data: result.data };
}

module.exports = { createWeatherSchema, updateWeatherSchema, queryParamsSchema, validate };

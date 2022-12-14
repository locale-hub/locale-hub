import Joi from 'joi';

/**
 * Validate that the request follows the given schema
 * @template T
 * @param {Joi.ObjectSchema} schema The schema the request should follow
 * @param {T} object The object to validate
 * @return {boolean} true if config is valid, false otherwise
 */
export const validateObject = async <T>(
  schema: Joi.ObjectSchema,
  object: T
): Promise<boolean> => {
  try {
    const validation = await schema.validate(object);
    if (undefined !== validation.error) {
      console.error(validation.error.message);
    }
    return undefined === validation.error;
  } catch (err) {
    return false;
  }
};

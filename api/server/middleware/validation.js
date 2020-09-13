import { logError } from "../config/pino";
/*
La variable propiedad nos sirve para hacer validaciones en body,params,query,etc''
*/
const validation = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);
    if (!error) {
      next();
    } else {
      const { details } = error;
      logError(details[0].message);
      res.status(422).json({ errors: details });
    }
  };
};

export default validation;

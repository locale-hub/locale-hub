
declare namespace Express {
  interface Request {
    user: import('../../data/models/user.model');
    jwt: import('../../data/models/jwt.model');
  }
}

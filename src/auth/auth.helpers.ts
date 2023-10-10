import { ExtractJwt } from 'passport-jwt';
import { Request } from 'express';

export const extractJwt = ExtractJwt.fromExtractors([
  (req: Request) => {
    const token = req.cookies['Authorization'];
    return token?.replace('Bearer', '')?.trim();
  },
  ExtractJwt.fromAuthHeaderAsBearerToken(),
]);

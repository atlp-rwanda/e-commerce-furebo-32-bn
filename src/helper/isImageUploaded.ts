/* eslint-disable import/no-extraneous-dependencies */
import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

const isImageUploaded = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message, code: err.code });
  } if (typeof err === 'string') {
    return res.status(400).json({ error: err });
  } if (err && typeof err === 'object' && err.message) {
    return res.status(400).json({ error: err.message, code: err.code });
  } if (err) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
  next();
};

export default isImageUploaded;

/* eslint-disable no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
import { Request } from 'express';

import multer from 'multer';

const storage = multer.diskStorage({
  filename(
    _req: Request,
    file: any,
    cb: (error: Error | null, filename: string) => void
  ) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

export default upload;

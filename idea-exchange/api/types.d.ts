import { UserDocument } from 'src/users/models/user.model';

declare module 'express' {
  interface Request {
    user: UserDocument;
  }
}

import { UUID } from 'crypto';
import { IProduct } from '../interfaces/IProduct';

export interface IUser {
  email?: string;
  password?: string;
  id?: UUID;
  products?: IProduct[];
  access_token?: string;
  refresh_token?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

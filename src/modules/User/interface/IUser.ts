import { UUID } from 'crypto';
import { IProduct } from '../../Product/interface/IProduct';

export interface IUser {
  email?: string;
  password?: string;
  id?: UUID;
  products?: IProduct[];
  access_token?: JsonWebKey;
  refresh_token?: JsonWebKey;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}

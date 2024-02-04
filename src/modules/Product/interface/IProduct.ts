import { UUID } from 'crypto';

export interface IProduct {
  name?: string;
  price?: number;
  quantity?: number;
  id?: UUID;
}

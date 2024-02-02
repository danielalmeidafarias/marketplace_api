import { UUID } from "crypto";
import { IProduto } from "src/modules/Produto/interfaces/IProduto";

export interface IUser {
  email?: string;
  password?: string;
  id?: UUID
  produtos?: IProduto[],
  access_token?: JsonWebKey,
  refresh_token?: JsonWebKey,
  created_at?: Date,
  updated_at?: Date,
  deleted_at?: Date
}

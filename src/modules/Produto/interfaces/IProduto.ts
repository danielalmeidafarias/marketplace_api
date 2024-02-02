import { UUID } from "crypto";

export interface IProduto {
  name?: string,
  price?: number,
  quantity?: number,
  id?: UUID
}
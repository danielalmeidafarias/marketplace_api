import { Injectable } from "@nestjs/common";
import { OrderRepository } from "./repository/order.repository";

@Injectable()
export class OrderService {
  constructor(private orderRepository: OrderRepository) {}
}
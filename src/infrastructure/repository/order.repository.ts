import Order from "../../domain/entity/order";
import OrderRepositoryInterface from "../../domain/repository/order-repository.interface";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";
import OrderItem from "../../domain/entity/order_item";

export default class OrderRepository implements OrderRepositoryInterface {

    async create(entity: Order): Promise<void> {
        await OrderModel.create({
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.total(),
            items: entity.items.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price / item.quantity,
                product_id: item.productId,
                quantity: item.quantity,
            })),
        }, {
            include: [{ model: OrderItemModel }],
        });
    }

    async update(entity: Order): Promise<void> {
        await OrderModel.update(
            {
                customer_id: entity.customerId,
                total: entity.total(),
            },
            {
                where: { id: entity.id },
            }
        );

        await OrderItemModel.destroy({
            where: { order_id: entity.id },
        });

        try {
            for (const item of entity.items) {
                await OrderItemModel.create({
                    id: item.id,
                    name: item.name,
                    price: item.price / item.quantity,
                    product_id: item.productId,
                    quantity: item.quantity,
                    order_id: entity.id,
                });
            }
        } catch (error) {
            console.error('Erro ao criar itens do pedido:', error);
            throw error;
        }
    }

    async find(id: string): Promise<Order> {
        const orderModel = await OrderModel.findOne({
            where: { id },
            include: [{ model: OrderItemModel }],
        });

        if (!orderModel) {
            throw new Error("Order not found");
        }

        const orderItems = orderModel.items.map(item => 
            new OrderItem(
                item.id,
                item.name,
                item.price,
                item.product_id,
                item.quantity
            )
        );

        return new Order(orderModel.id, orderModel.customer_id, orderItems);
    }

    async findAll(): Promise<Order[]> {
        const orderModels = await OrderModel.findAll({
            include: [{ model: OrderItemModel }],
        });

        return orderModels.map(orderModel => {
            const orderItems = orderModel.items.map(item => 
                new OrderItem(
                    item.id,
                    item.name,
                    item.price,
                    item.product_id,
                    item.quantity
                )
            );

            return new Order(orderModel.id, orderModel.customer_id, orderItems);
        });
    }

    async delete(id: string): Promise<void> {
        const result = await OrderModel.destroy({
            where: { id },
        });
        if (result === 0) {
            throw new Error("Order not found");
        }
    }
}
import { Sequelize } from "sequelize-typescript";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";

import CustomerModel from "../../../customer/repository/sequilize/customer.model";
import ProductModel from "../../../product/repository/sequilize/product.model";

import ProductRepository from "../../../product/repository/sequilize/product.repository";
import OrderRepository from "./order.repository";
import OrderModel from "./order.model";
import OrderItemModel from "./order-item.model";
import CustomerRepository from "../../../customer/repository/sequilize/customer.repository";
import Customer from "../../../../domain/customer/entity/customer";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Order from "../../../../domain/checkout/entity/order";

describe("Order repository test", () => {

    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });
        sequelize.addModels([CustomerModel, OrderModel, OrderItemModel, ProductModel]);
        await sequelize.sync();
    });
    
    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a new customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 123, "Zipcode 12345", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const order = new Order("1", "123", [orderItem]);

        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({ 
            where: { id: order.id },
            include: ["items"],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "1",
            customer_id: "123",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: 10,
                    quantity: orderItem.quantity,
                    order_id: "1",
                    product_id: "123",
                },
            ],
        });    
    });

    it("should update an order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 123, "Zipcode 12345", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const order = new Order("1", "123", [orderItem]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const newProduct = new Product("456", "Product 2", 20);
        await productRepository.create(newProduct);
        const newOrderItem = new OrderItem(
            "2",
            "Product 2",
            20,
            "456",
            3
        );
        order.addItem(newOrderItem);
        await orderRepository.update(order);

        const orderModel = await OrderModel.findOne({ 
            where: { id: order.id },
            include: ["items"],
        });

        expect(orderModel.toJSON()).toStrictEqual({
            id: "1",
            customer_id: "123",
            total: order.total(),
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: 10,
                    quantity: orderItem.quantity,
                    order_id: "1",
                    product_id: "123",
                },
                {
                    id: newOrderItem.id,
                    name: newOrderItem.name,
                    price: 20,
                    quantity: newOrderItem.quantity,
                    order_id: "1",
                    product_id: "456",
                },
            ],
        });
    });

    it("should find an order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 123, "Zipcode 12345", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const order = new Order("1", "123", [orderItem]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);

        const foundOrder = await orderRepository.find(order.id);

        expect(foundOrder).toEqual(order);
    });

    it("should throw error when order not found", async () => {
        const orderRepository = new OrderRepository();
        await expect(orderRepository.find("999")).rejects.toThrow("Order not found");
    });

    it("should find all orders", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 123, "Zipcode 12345", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const order = new Order("1", "123", [orderItem]);
        const orderRepository = new OrderRepository();
        
        const product2 = new Product("789", "Product 3", 30);
        await productRepository.create(product2);
        const order2 = new Order("2", "123", [
            new OrderItem("3", "Product 3", 30, "789", 1)
        ]);

        await orderRepository.create(order);
        await orderRepository.create(order2);

        const orders = await orderRepository.findAll();

        expect(orders).toHaveLength(2);
        expect(orders).toEqual([order, order2]);
    });

    it("should delete an order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street 1", 123, "Zipcode 12345", "City 1");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const productRepository = new ProductRepository();
        const product = new Product("123", "Product 1", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem(
            "1",
            product.name,
            product.price,
            product.id,
            2
        );

        const order = new Order("1", "123", [orderItem]);
        const orderRepository = new OrderRepository();
        await orderRepository.create(order);
        await orderRepository.delete(order.id);

        await expect(orderRepository.find("1")).rejects.toThrow("Order not found");
    });
});
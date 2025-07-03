import OrderItem from "../entity/order_item";
import Order from "../entity/order";
import OrderService from "./order.service";
import Customer from "../../entity/customer";

describe("Order service unit test", () => {
    it("should place an order", () => {

        const customer = new Customer("c1", "Customer 1");
        const item1 = new OrderItem("i1", "item 1", 10, "p1", 1);

        const order = OrderService.placeOrder(customer, [item1]);

        expect(customer.rewardPoints).toBe(5);
        expect(order.total()).toBe(10);

    });

    it("should get total of all orders", () => {

        const item = new OrderItem("i1", "item 1", 100, "p1", 1);
        const item2 = new OrderItem("i2", "item 2", 200, "p2", 2);

        const order = new Order("o1", "c1", [item]);
        const order2 = new Order("o2", "c1", [item2]);

        const total = OrderService.total([order, order2]);

        expect(total).toBe(500);
    });

    it("should add reward points", () => {
        const customer = new Customer("c1", "Customer 1");
        expect(customer.rewardPoints).toBe(0);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(10);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(20);

    });

});
import Order from "./order";
import OrderItem from "./order_item";

describe("Order unit tests", () => {
    it(" should throw error when id is empty", () => {
        expect(() => {
            let order = new Order("", "123", []);
        }).toThrowError("Id is required");
    });

     it(" should throw error when customerId is empty", () => {
        expect(() => {
            let order = new Order("123", "", []);
        }).toThrowError("CustomerID is required");
    });

     it(" should throw error when customerId is empty", () => {
        expect(() => {
            let order = new Order("123", "123", []);
        }).toThrowError("Items are required");
    });

    it(" should calculate total", () => {
        const item = new OrderItem("1", "Item 1", 100, "p1", 2);
        const item2 = new OrderItem("2", "Item 2", 200, "p2", 2);
        const order = new Order("o1", "c1", [item])

        let total = order.total();

        expect(total).toBe(200);

        const order2 = new Order("o1", "c1", [item,item2]);
        total = order2.total();

        expect(total).toBe(600);

    });

    it(" should throw error if the item qtd is less or equal zero", () => {
        
        expect(() => {
            const item = new OrderItem("1", "Item 1", 100, "p1", 0);
            const order = new Order("o1", "c1", [item])
            
        }).toThrowError("Quantity must be greater than 0");

    });
})
import Address from "../value-object/address";
import CustomerFactory from "./customer.factory";

describe("Customer Factory unit test", () => {

    it("shoud create a customer", () => {
        const customer = CustomerFactory.create("John Doe");

        expect(customer.id).toBeDefined();
        expect(customer.name).toBe("John Doe");
        expect(customer.address).toBeUndefined();

    });

    it("should creat a customer with an address", () => {
        const address = new Address("Street", 12345,"1330-250", "São Paulo" );
        let customer = CustomerFactory.createWithAddress("John", address);

        expect(customer.id).toBeDefined();
        expect(customer.name).toBe("John");
        expect(customer.address).toBe(address);

    });

});
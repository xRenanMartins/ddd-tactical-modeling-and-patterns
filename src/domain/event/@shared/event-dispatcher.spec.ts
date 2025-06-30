import Address from "../../entity/address";
import Customer from "../../entity/customer";
import CustomerAddressChangedEvent from "../customer/customer-address-changed.event";
import CustomerCreatedEvent from "../customer/customer-created.event";
import EnviaConsoleLogHandler from "../customer/handler/envia-console-log.handler";
import EnviaConsoleLog1Handler from "../customer/handler/envia-console-log1.handler";
import EnviaConsoleLog2Handler from "../customer/handler/envia-console-log2.handler";
import SendEmailWhenProductIsCreatedHandler from "../product/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../product/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {

    it("should register and event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
        
    });

    it("should unregister an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
        eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0);
    });

    it("should unregister all event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);
        eventDispatcher.unregisterAll();

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeUndefined();
    });

    it("should notify all event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const spyOnEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        const productCreatedEvent = new ProductCreatedEvent({
            name: "Product 1",
            description: "Description of Product 1",
            price: 10.0,
        });

        // Quando o notify for executado o sendEmailWhenProductIsCreatedHandler deve ser chamado
        eventDispatcher.notify(productCreatedEvent);

        expect(spyOnEventHandler).toHaveBeenCalled();

    });

});


describe("Event Customer tests", () => {
    it("should send CustomerCreatedEvent and execute two handlers console.log", () => {
        const eventDispatcher = new EventDispatcher();
        const handler1 = new EnviaConsoleLog1Handler();
        const handler2 = new EnviaConsoleLog2Handler();
        const spy1 = jest.spyOn(handler1, "handle");
        const spy2 = jest.spyOn(handler2, "handle");
        eventDispatcher.register("CustomerCreatedEvent", handler1);
        eventDispatcher.register("CustomerCreatedEvent", handler2);

        const customer = new Customer("1", "Client Test");
        
        const event = new CustomerCreatedEvent({ id: customer.id, name: customer.name });
        eventDispatcher.notify(event);

        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it("should send CustomerAddressChangedEvent and execute handler console.log", () => {
        const eventDispatcher = new EventDispatcher();
        const handler = new EnviaConsoleLogHandler();
        const spy = jest.spyOn(handler, "handle");
        eventDispatcher.register("CustomerAddressChangedEvent", handler);

        const customer = new Customer("2", "Client address");
        const address = new Address("Rua A", 123, "00000-000", "Cidade");
        customer.changeAddress(address);
        
        const event = new CustomerAddressChangedEvent({
            id: customer.id,
            name: customer.name,
            address: address.toString()
        });
        eventDispatcher.notify(event);

        expect(spy).toHaveBeenCalled();
        expect(spy.mock.calls[0][0].eventData).toEqual({
            id: "2",
            name: "Client address",
            address: address.toString()
        });
    });
}); 
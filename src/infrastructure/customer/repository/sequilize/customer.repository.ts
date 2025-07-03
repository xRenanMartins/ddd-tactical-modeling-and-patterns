import Customer from "../../../../domain/customer/entity/customer";
import CustomerRepositoryInterface from "../../../../domain/customer/repository/customer-repository.interface";
import Address from "../../../../domain/customer/value-object/address";
import CustomerModel from "./customer.model";

export default class CustomerRepository implements CustomerRepositoryInterface {

    async create(entity: Customer): Promise<void> {
        await CustomerModel.create({
            id: entity.id,
            name: entity.name,
            street: entity.address.street,
            number: Number(entity.address.number),
            zipcode: entity.address.zip,
            city: entity.address.city,
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints,
        });
    }
    async update(entity: Customer): Promise<void> {

        await CustomerModel.update(
            {
                name: entity.name,
                street: entity.address.street,
                number: Number(entity.address.number),
                zipcode: entity.address.zip,
                city: entity.address.city,
                active: entity.isActive(),
                rewardPoints: entity.rewardPoints,
            },
            {
                where: { id: entity.id },
            }
        );
    }
    async find(id: string): Promise<Customer> {
        let customerModel;
        try{
            customerModel = await CustomerModel.findOne({ where: { id }, rejectOnEmpty: true });

        }
        catch (error) {
            throw new Error("Customer not found");
        }
        const customer = new Customer(customerModel.id, customerModel.name);
        const address = new Address(
            customerModel.street,
            Number(customerModel.number),
            customerModel.zipcode,
            customerModel.city
        );
        customer.changeAddress(address);
        return customer;
    }
    async findAll(): Promise<Customer[]> {
        const customerModels = await CustomerModel.findAll();
        const customers = customerModels.map((customerModel) => {
            let customer =new Customer(customerModel.id, customerModel.name);
            customer.addRewardPoints(customerModel.rewardPoints);
            const address = new Address(
                customerModel.street,
                Number(customerModel.number),
                customerModel.zipcode,
                customerModel.city
            );
            customer.changeAddress(address);
            if (customerModel.active) {
                customer.activate();
            }
            return customer;
        });
        return customers;
    }

    async delete(id: string): Promise<void> {
        const result = await CustomerModel.destroy({ where: { id } });
        if (result === 0) {
            throw new Error("Customer not found");
        }
    }
}
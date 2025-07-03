import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerAddressChangedEvent from "../event/customer/customer-address-changed.event";
import CustomerCreatedEvent from "../event/customer/customer-created.event";
import Address from "../value-object/address";

export default class Customer {

    private _id: string;
    private _name: string;
    private _address?: Address;
    private _active: boolean = true;
    private _rewardPoints: number = 0;
    private _eventDispatcher?: EventDispatcher;

    constructor(id: string, name: string, eventDispatcher?: EventDispatcher) {
        this._id = id;
        this._name = name;
        this.validate();
        this._eventDispatcher = eventDispatcher;
        if (this._eventDispatcher) {
            const event = new CustomerCreatedEvent({ id: this._id, name: this._name });
            this._eventDispatcher.notify(event);
        }
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get address(): Address | undefined {
        return this._address;
    }
    
    get rewardPoints(): number {
        return this._rewardPoints;
    }

    validate() {
        if (this._id.length === 0) {
            throw new Error("Id is required");
        }
        if (this._name.length === 0) {
            throw new Error("Name is required");
        }
    }

    changeName(name: string) {
        this._name = name;
        this.validate();
    }

    changeAddress(address: Address) {
        this._address = address;
        this._address.validate();
        if (this._eventDispatcher) {
            const event = new CustomerAddressChangedEvent({
                id: this._id,
                name: this._name,
                address: address.toString()
            });
            this._eventDispatcher.notify(event);
        }
    }

    isActive(): boolean {
        return this._active;
    }   
    
    activate() {
        if (this._address === undefined) {
            throw new Error("Address is mandatory to activate a customer");
        }
        this._active = true;
    }
    deactivate() {
        this._active = false;
    }

    set Address(address: Address) {
        this._address = address;
    }

    addRewardPoints(points: number) {
        if (points < 0) {
            throw new Error("Points must be greater than or equal to 0");
        }
        this._rewardPoints += points;
    }

}
import OrderItem from "./order_item";

export default class Order{
    private _id: string;
    private _customerId: string;
    private _items: OrderItem[] = [];
    private _total: number = 0;

    constructor(_id: string, _customerId: string, _items: OrderItem[] = []) {
        this._id = _id;
        this._customerId = _customerId;
        this._items = _items;
        this._total = this.total();
        this.validate();
    }

    get id(): string {
        return this._id;
    }

    get customerId(): string {
        return this._customerId;
    }

    get items(): OrderItem[] {
        return this._items;
    }

    validate(): boolean {
        if (this._id.length === 0) {
            throw new Error("Id is required");
        }
        if (this._customerId.length === 0) {
            throw new Error("CustomerID is required");
        }
        if (this._items.length === 0) {
            throw new Error("Items are required");
        }

        if( this._items.some(item => item.quantity <= 0)) {
            throw new Error("Quantity must be greater than 0");
        }

        return true;
    }

    total(): number {
        return this._items.reduce((acc, item) => acc + item.orderItemTotal(), 0);
    }

    addItem(item: OrderItem): void {
        this._items.push(item);
        this._total = this.total();
        this.validate();
    }
}
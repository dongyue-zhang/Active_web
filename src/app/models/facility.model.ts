import { Address } from "./address.model";

export class Facility {
    constructor(
        public id: number,
        public title: string,
        public phone: string,
        public email: string,
        public url: string,
        public address: Address,
        public longitude: number,
        public latitude: number,
        public distance: number
    ) { }
}
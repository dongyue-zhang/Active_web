import { Facility } from "./facility.model";

export class Activity {
    dayOfWeek: string;
    constructor(
        public id: number,
        public title: string,
        public category: string,
        public reservationURL: string,
        public isAvailable: boolean,
        public startTime: Date,
        public endTime: Date,
        public minAge: number,
        public maxAge: number,
        public lastUpdated: Date,
        public facility: Facility
    ) {
        this.dayOfWeek = this.getDayOfWeek();
    }

    getDayOfWeek() {
        const today = new Date();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1)
        let dayOfWeek;
        if (this.startTime.toLocaleDateString() === today.toLocaleDateString()) {
            dayOfWeek = "Today";
        } else if (this.startTime.toLocaleDateString() === tomorrow.toLocaleDateString()) {
            dayOfWeek = "Tomorrow";
        } else {
            dayOfWeek = this.startTime.toLocaleDateString("en", { weekday: "long" }).split(' ')[0];
        }
        return dayOfWeek;
    }
}

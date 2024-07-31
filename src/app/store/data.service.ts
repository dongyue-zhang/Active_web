import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { ActivityState, AppState, Pagenation, TypeState } from "./reducer";
import * as ActiveActions from "./actions";
import { Activity } from "../models/activity.model";
import { filter, map, take } from "rxjs/operators";
import { Category } from "../models/category.model";
import { Type } from "../models/type.model";
import { Observable } from "rxjs";
import { Location } from "./reducer";
import { isEmpty } from "lodash";

@Injectable({ providedIn: 'root' })
export class DataService {

    activityStates: ActivityState[];
    defaultSortBy: string;

    private location: Location = { lat: 0, lng: 0 };

    constructor(private store: Store<AppState>) {

        this.getActivities().subscribe(activityStates => {
            this.activityStates = activityStates;
        })

        this.store.select('locationState').pipe(
            filter(location => location !== null),
            take(1)
        ).subscribe(location => {
            this.location = location;
            if (isEmpty(location)) {
                this.defaultSortBy = 'title';
            } else {
                this.defaultSortBy = 'distance';
            }
        })
    }

    getCurrentLocation() {
        return this.location;
    }

    getLocationObs() {
        return this.store.select('locationState');
    }

    getLoadingStatus(): Observable<boolean> {
        return this.store.select('appState').pipe(
            map((appState) => appState.loading)
        );
    }

    getCategories(): Observable<Category[]> {
        return this.store.select('appState').pipe(
            map((appState) => appState.categories)
        );
    }

    getTypes(): Observable<{ pagenation: Pagenation; state: TypeState[]; }> {
        return this.store.select('appState').pipe(
            map((appState) => appState.types)
        );
    }

    getPopularTypes(): Observable<{ categoryName: string; type: Type; activities: Activity[]; pagenation: Pagenation }[]> {
        return this.store.select('appState').pipe(
            map((appState) => appState.popularTypes)
        );
    }

    getActivities(): Observable<ActivityState[]> {
        return this.store.select('appState').pipe(
            map((appState) => appState.activities)
        );
    }

    getFacilities() {
        return this.store.select('appState').pipe(
            map((appState) => appState.facilities)
        );
    }

    // getActivityById(typeId: number, activityId: number): Activity {
    //     return this.activities.find((activity, index) => {
    //         return activity.typeId === typeId;
    //     }).activities.find((activity, index) => {
    //         return activity.id === activityId;
    //     })
    // }

    fetchActivitiesById(id: number) {
        return this.store.dispatch(ActiveActions.fetchActivityById({ id }))
    }

    fetchPopluarTypes() {
        this.store.dispatch(ActiveActions.fetchPopularTypes());
    }

    fetchTypesByCategory(categoryId: number) {
        this.store.dispatch(ActiveActions.fetchTypesByCategory({ categoryId }));
    }

    fetchActivitiesByType(typeId: number, page: number = 0) {
        const found = this.activityStates.find((activityState, index) => activityState.typeId === typeId);
        if (!found || page) {
            this.store.dispatch(ActiveActions.fetchActivitiesByType({ typeId, page }));
        }

    }

    fetchActivitiesByPopularType(typeId: number, page: number = 0) {
        this.store.dispatch(ActiveActions.fetchActivitiesByPopularType({ typeId, page }));
    }

    fetchPopularTypes_ActivitiesForPopularType(typeId: number, page: number = 0) {
        this.store.dispatch(ActiveActions.fetchPopularTypes_ActivitiesForPopularType({ typeId, page }));
    }

    fetchAllCategories() {
        this.store.dispatch(ActiveActions.fetchAllCategories());
    }

    fetchCategoryByFactility(facilityId: number) {
        this.store.dispatch(ActiveActions.fetchCategoriesByFacility({ facilityId }));
    }

    fetchAllFacilities(page: number = 0, sortBy: string = this.defaultSortBy) {
        this.store.dispatch(ActiveActions.fetchAllFacilities({ page, sortBy }));
    }

    fetchFacilityById(facilityId: number) {
        this.store.dispatch(ActiveActions.fetchFacilityById({ facilityId }));
    }
    fetchFacilityAndTypesByFacility(facilityId: number) {
        this.store.dispatch(ActiveActions.fetchFacilityAndTypesByFacility({ id: facilityId }));
    }

    fetchTypesByFacility(facilityId: number) {
        this.store.dispatch(ActiveActions.fetchTypesByFacility({ facilityId }));
    }

    fetchAllFacilitiesAndTypesByFacility(facilityId: number) {
        this.store.dispatch(ActiveActions.fetchAllFacilitiesAndTypesByFacility({ facilityId }));
    }

    fetchActivitiesByFacilityAndType(facilityId: number, categoryName: string, typeId: number, page: number = 0, location: Location = this.location) {
        this.store.dispatch(ActiveActions.fetchActivitiesByFacilityAndType({ facilityId, categoryName, typeId, page, location }));
    }

    fetchAllFacilities_TypesAndActivitiesByFacility(facilityId: number, categoryName: string, typeId: number) {
        this.store.dispatch(ActiveActions.fetchAllFacilities_TypesAndActivitiesByFacility({ facilityId, categoryName, typeId }));
    }
}



import { ActionReducerMap, createReducer, on } from "@ngrx/store";
import { Category } from "../models/category.model";
import * as Actions from "./actions";
import { Type } from "../models/type.model";
import { Activity } from "../models/activity.model";
import { Facility } from "../models/facility.model";

export type Pagenation = {
    first: boolean;
    last: boolean;
    number: number;
}

export type Location = {
    lat: number;
    lng: number;
}

export type FacilityState = {
    facility: Facility;
    activities: {
        categoryName: string;
        types: {
            type: Type;
            activities: Activity[];
            pagenation: Pagenation
        }[]

    }[]
};

export type TypeState = {
    categoryId: number;
    types: Type[];
}

export type ActivityState = {
    typeId: number;
    pagenation: Pagenation;
    activities: Activity[];
}

export type State = {
    loading: boolean;
    categories: Category[];
    types: {
        pagenation: Pagenation;
        state: TypeState[];
    }
    popularTypes: {
        categoryName: string,
        type: Type,
        activities: Activity[],
        pagenation: Pagenation
    }[];
    activities: ActivityState[];
    facilities: {
        sortBy: string,
        pagenation: Pagenation;
        state: FacilityState[];
    }
}

export interface AppState {
    appState: State;
    locationState: Location;
}

const initialState: State = {
    loading: false,
    categories: [],
    types: {
        pagenation: {
            first: false,
            last: false,
            number: 0
        },
        state: []
    },
    popularTypes: [],
    activities: [],
    facilities: {
        sortBy: '',
        pagenation: {
            first: false,
            last: false,
            number: 0
        },
        state: []
    }
}

const locationState: Location = null;

const reducer = createReducer(
    initialState,
    on(Actions.startFetching, (state, action) => {
        return {
            ...state,
            loading: true
        }
    }),
    on(Actions.setCategories, (state, action) => {
        return {
            ...state,
            categories: [...action.categories],
            loading: false
        };
    }),
    on(Actions.setTypes, (state, action) => {
        return {
            ...state,
            types: {
                pagenation: action.pagenation,
                state: [...state.types.state, {
                    categoryId: action.categoryId,
                    types: action.types
                }],
            },
            loading: false
        }
    }),
    on(Actions.setPopularTypes, (state, action) => {

        let types = action.types.map(type => {
            return {
                categoryName: type.category,
                type: type,
                activities: [],
                pagenation: {
                    first: false,
                    last: false,
                    number: 0
                }
            }
        })
        return {
            ...state,
            popularTypes: types,
            loading: false
        }
    }),
    on(Actions.setActivities, (state, action) => {
        let updatedActivities = state.activities;
        let found = updatedActivities.find((activity, index) => {
            return activity.typeId === action.typeId;
        });
        if (found) {
            // found.activities = found.activities.concat(action.activities);
            updatedActivities = updatedActivities.map(activity => {
                if (activity.typeId === action.typeId) {
                    return {
                        typeId: found.typeId,
                        pagenation: action.pagenation,
                        activities: found.activities.concat(action.activities)
                    }
                } else {
                    return activity;
                }
            });
            return {
                ...state,
                activities: updatedActivities,
                loading: false
            }
        } else {
            return {
                ...state,
                activities:
                    [...state.activities, {
                        typeId: action.typeId,
                        pagenation: action.pagenation,
                        activities: action.activities
                    }]
                ,
                loading: false
            }
        }

    }),
    on(Actions.setActivitiesForPopularType, (state, action) => {
        let updatedPopularTypes = state.popularTypes;
        updatedPopularTypes = updatedPopularTypes.map(type => {
            if (type.type.id === action.typeId) {
                return {
                    ...type,
                    activities: [...type.activities, ...action.activities],
                    pagenation: action.pagenation
                }
            } else {
                return type;
            }
        }

        )
        return {
            ...state,
            popularTypes: updatedPopularTypes,
            loading: false
        }
    }),
    on(Actions.setFacilities, (state, action) => {
        let newFacilityState = action.facilities.map(
            facility => {
                return {
                    facility: facility,
                    activities: []
                }
            });
        let stateArr: FacilityState[] = [];
        if (action.sortBy === state.facilities.sortBy) {
            stateArr = [...state.facilities.state, ...newFacilityState];
            if (action.sortBy === "distance") {
                stateArr = stateArr.sort((a, b) => a.facility.distance - b.facility.distance);
            } else if (action.sortBy === "title") {
                stateArr = stateArr.sort((a, b) => a.facility.title.localeCompare(b.facility.title));
            }
            stateArr = stateArr.filter((item, index) => {
                return index === stateArr.findIndex(other => other.facility.id === item.facility.id);
            })

        } else {
            stateArr = [...newFacilityState];
        }

        return {
            ...state,
            facilities: {
                pagenation: action.pagenation,
                sortBy: action.sortBy,
                state: stateArr
            },
            loading: false
        }

    }),
    on(Actions.setTypesInFacility, (state, action) => {
        let updatedActivities = state.facilities.state.find((facility, index) => {
            return facility.facility.id === action.facilityId;
        }).activities;
        // { categoryName: string, types: { type: Type; activities: [], pagenation: Pagenation }[] }[] = [];

        let types: Type[] = [...action.types];
        types.sort((a, b) => a.category.localeCompare(b.category));
        let cateogry: string = '';
        types.forEach(type => {
            if (type.category !== cateogry) {
                updatedActivities = [
                    ...updatedActivities,
                    {
                        categoryName: type.category,
                        types: []

                    }
                ]
                // updatedActivities.push(
                //     {
                //         categoryName: type.category,
                //         types: []

                //     }
                // )
            }

            updatedActivities = updatedActivities.map((activity) => {
                if (activity.categoryName === type.category) {
                    return {
                        ...activity,
                        types: [
                            ...activity.types,
                            {
                                type: type,
                                pagenation: {
                                    first: false,
                                    last: false,
                                    number: 0
                                },
                                activities: []
                            }
                        ]
                    }

                } else {
                    return activity;
                }
            })

            cateogry = type.category;
        });

        let updatedFacilities = state.facilities.state;
        updatedFacilities = updatedFacilities.map(facility => {
            if (facility.facility.id === action.facilityId) {
                return {
                    facility: facility.facility,
                    activities: updatedActivities
                }
            } else {
                return facility;
            }
        })

        return {
            ...state,
            facilities: {
                ...state.facilities,
                state: updatedFacilities,
            },
            loading: false
        }
    }),
    on(Actions.setActivitiesInFacilityWithType, (state, action) => {
        let updatedFacilities = state.facilities.state;
        updatedFacilities = updatedFacilities.map(facility => {
            if (facility.facility.id === action.facilityId) {
                return {
                    facility: facility.facility,
                    activities: facility.activities.map(activity => {
                        if (activity.categoryName === action.categoryName) {
                            return {
                                categoryName: activity.categoryName,
                                types: activity.types.map(type => {
                                    if (type.type.id === action.typeId) {
                                        return {
                                            type: type.type,
                                            activities: [...action.activities],
                                            pagenation: action.pagenation
                                        }
                                    } else {
                                        return type;
                                    }
                                })
                            }
                        } else {
                            return activity;
                        }
                    })
                }
            } else {
                return facility;
            }
        });

        return {
            ...state,
            facilities: {
                ...state.facilities,
                state: updatedFacilities
            },
            loading: false
        }
    }),
    on(Actions.setFacility, (state, action) => {
        const newFacilityState: FacilityState = {
            facility: action.facility,
            activities: []
        };

        return {
            ...state,
            facilities: {
                ...state.facilities,
                state: [...state.facilities.state, newFacilityState]
            },
            loading: false
        }
    })
    // on(Actions.setCategoriesInFacility, (state, action) => {
    //     let facilityState = state.facitlites.find((facilityState, index) => {
    //         return facilityState.facility.id === action.facilityId;
    //     });
    //     action.categories.forEach(newCategory => {
    //         facilityState.activities.push(
    //             {
    //                 category: newCategory,
    //                 types: [],
    //                 activities: []
    //             }
    //         )
    //     })
    //     return {
    //         ...state,
    //         facitlites: [
    //             ...state.facitlites,
    //             facilityState
    //         ]
    //     }
    // })
)

const locationReducer = createReducer(
    locationState,
    on(Actions.setLocation, (state, action) => {
        return {
            ...state,
            ...action.location
        }
    })
)

// const taskReducer = createReducer(
//     initialTaskState,
//     on(Actions.completeTask, (state, action) => {
//         return {
//             ...state,
//             completedTasks: [...state.completedTasks, action.taskId]
//         }
//     })
// )

export const appReducer: ActionReducerMap<AppState> = {
    appState: reducer,
    locationState: locationReducer
};
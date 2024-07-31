import { createAction, props } from "@ngrx/store";
import { Category } from "../models/category.model";
import { Type } from "../models/type.model";
import { Facility } from "../models/facility.model";
import { Activity } from "../models/activity.model";
import { Pagenation, Location } from "./reducer";


export const startFetching = createAction(
    'Start Fetching'
)

export const fetchAllTypes = createAction(
    '[Types] Fetch All Types'
);

export const fetchPopularTypes = createAction(
    '[Types] Fetch Popular Types'
);

export const fetchTypeById = createAction(
    '[Type] Fetch Type By Id',
    props<{ id: number }>()
);

export const fetchTypesByFacility = createAction(
    '[Types] Fetch Types By Facility',
    props<{ facilityId: number }>()
);

export const fetchTypesByFacilityAndCategory = createAction(
    '[Types] Fetch Types By Facility and Category',
    props<{ facilityId: number, categoryId: number }>()
);

export const fetchTypesByCategory = createAction(
    '[Types] Fetch Types By Category',
    props<{ categoryId: number }>()
);

export const setTypes = createAction(
    '[Types] Set Types',
    props<{ categoryId: number, types: Type[], pagenation: Pagenation }>()
);

export const setPopularTypes = createAction(
    '[Types] Set Popular Types',
    props<{ types: Type[] }>()
);

export const setTypesInFacility = createAction(
    '[Types] Set Types in Facility',
    props<{ facilityId: number, types: Type[] }>()
)

export const fetchAllFacilities = createAction(
    '[Facilities] Fetch All Facilities',
    props<{ page: number, sortBy: string }>()
);

export const fetchFacilityByType = createAction(
    '[Facility] Fetch Facility By Type',
    props<{ typeId: number }>()
);

export const fetchAllFacilitiesAndTypesByFacility = createAction(
    '[Facilities and Types] Fetch All Facilities and Types By Facility',
    props<{ facilityId: number }>()
)

export const fetchFacilityById = createAction(
    '[Facility] Fetch Facility By Id',
    props<{ facilityId: number }>()
);

export const fetchFacilityAndTypesByFacility = createAction(
    '[Facility] Fetch Facility By Id and Types By Facility',
    props<{ id: number }>()
);

export const setFacilities = createAction(
    '[Facilities] Set Facilities',
    props<{ facilities: Facility[], pagenation: Pagenation, sortBy: string }>()
);

export const setFacility = createAction(
    '[Facility] Set A Facility',
    props<{ facility: Facility }>()
)
export const setCategoriesInFacility = createAction(
    '[Types] Set Categories in Facility',
    props<{ facilityId: number, categories: Category[], pagenation: Pagenation }>()
)

export const fetchAllActivities = createAction(
    '[Activities] Fetch All Activities'
);

export const fetchActivitiesByType = createAction(
    '[Activities] Fetch Activities By Type',
    props<{ typeId: number, page: number }>()
);

export const fetchActivitiesByPopularType = createAction(
    '[Activities] Fetch Activities By Popular Type',
    props<{ typeId: number, page: number }>()
);

export const fetchPopularTypes_ActivitiesForPopularType = createAction(
    '[Types and Activities] Fetch Popular Types and Activities For Popular Type',
    props<{ typeId: number, page: number }>()
);

export const fetchActivityById = createAction(
    '[Activity] Fetch Activity By Id',
    props<{ id: number }>()
);

export const fetchActivitiesByFacilityAndType = createAction(
    '[Activities] Fetch Activities By Facility and Type',
    props<{ facilityId: number, categoryName: string, typeId: number, page: number, location: Location }>()
);

export const fetchAllFacilities_TypesAndActivitiesByFacility = createAction(
    '[Facilities, Types and Activities Fetch All facilities, Types and Activities By Facility',
    props<{ facilityId: number, categoryName: string, typeId: number }>()
);

export const setActivities = createAction(
    '[Activities] Set Activities',
    props<{ typeId: number, activities: Activity[], pagenation: Pagenation }>()
);

export const setActivitiesForPopularType = createAction(
    '[Activities] Set Activities For Popular Type',
    props<{ typeId: number, activities: Activity[], pagenation: Pagenation }>()
)

export const setActivitiesInFacilityWithType = createAction(
    '[Activities] Set Activities in Facility with Type',
    props<{ facilityId: number, categoryName: string, typeId: number, activities: Activity[], pagenation: Pagenation }>()
)

export const fetchAllCategories = createAction(
    '[Categories] Fetch All Categories'
);

export const fetchCategoriyById = createAction(
    '[Category] Fetch Category By Id',
    props<{ id: number }>()
);

export const fetchCategoriesByFacility = createAction(
    '[Categories] Fetch Categories By Facility',
    props<{ facilityId: number }>()
);

export const setCategories = createAction(
    '[Categories] Set Categories',
    props<{ categories: Category[] }>()
);
export const getLocation = createAction(
    '[Location] Get Location'
)
export const setLocation = createAction(
    '[Location] Set Location',
    props<{ location: Location }>()
)

// export const completeTask = createAction(
//     '[Task] Complete Task',
//     props<{ taskId: string }>()
// )
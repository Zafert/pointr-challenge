export interface Site {
    id: string;
    name: string;
    description: string;
    location: string;
    coordinates: Coordinates | null;
    buildings: string[];
    createdAt: string;
    updatedAt: string;
}
export interface CreateSiteRequest {
    name: string;
    description?: string;
    location: string;
    coordinates?: Coordinates;
}
export interface Building {
    id: string;
    name: string;
    description: string;
    siteId: string;
    address: string;
    coordinates: Coordinates | null;
    floors: number;
    levels: string[];
    createdAt: string;
    updatedAt: string;
}
export interface CreateBuildingRequest {
    name: string;
    description?: string;
    siteId: string;
    address?: string;
    coordinates?: Coordinates;
    floors?: number;
}
export interface Level {
    id: string;
    name: string;
    description: string;
    buildingId: string;
    floorNumber: number;
    mapData: any | null;
    coordinates: Coordinates | null;
    createdAt: string;
    updatedAt: string;
}
export interface CreateLevelRequest {
    name: string;
    description?: string;
    buildingId: string;
    floorNumber: number;
    mapData?: any;
    coordinates?: Coordinates;
}
export interface BulkLevelRequest {
    levels: CreateLevelRequest[];
}
export interface Coordinates {
    latitude: number;
    longitude: number;
    altitude?: number;
}
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
    count?: number;
}
export interface BulkResponse {
    success: boolean;
    message: string;
    data: Level[];
    count: number;
}
export interface BulkErrorResponse {
    success: false;
    message: string;
    errors: string[];
    importedCount: number;
    totalCount: number;
}
export type TPermissions = {
    role: string;
    project: {
        create: boolean;
        edit: boolean; 
        view: boolean;
        delete: boolean;
        validate: boolean;
        copyProjectPhases: boolean;
    };
    home: boolean;
    roleCostPremises: {
        create: boolean;
        edit: boolean; 
        view: boolean;
        delete: boolean;
    };
    dashboard: boolean;
    isAdmin: boolean;
    isGSOrBDPowerUser?: boolean;
    isGSOrBDUser?: boolean;
    isDivisionUser?: boolean;
    isPowerUser?: boolean;
    isPublic?: boolean;
}
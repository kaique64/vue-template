import AuthService from '../service/integration/AuthService';
import { JwtService } from '../service/integration/JwtService';
import { JwtTokenType } from '../service/integration/type/JwtTokenType';
import { TDivision } from '../type/TDivisions';
import { TPermissions } from '../type/TPermissions';

const authService = new AuthService();

export async function getUserPermissions(): Promise<TPermissions> {
    const token = await authService.getToken();
    const jwtToken = new JwtService().parseJwt(token) as JwtTokenType;

    const toLowerCase = (value: string) => value.toLowerCase();
    const roles = await authService.getRoles(jwtToken);
    const division: TDivision = toLowerCase(roles[0]).slice(0, 2) as TDivision;
    const isPowerUser = toLowerCase(roles[0]).includes('power-user');
    const isGSOrBDPowerUser = isPowerUser && (toLowerCase(roles[0]).includes('gs') || toLowerCase(roles[0]).includes('bd'));
    const isGSOrBDUser = (toLowerCase(roles[0]).includes('gs-user') || toLowerCase(roles[0]).includes('bd-user'));
    const isDivisionUser = toLowerCase(roles[0]).includes(division + '-user');
    const isAdmin = toLowerCase(roles[0]) === 'admin';
    const isPublic = toLowerCase(roles[0]) === 'public';

    function getPowerUserPermissions(): TPermissions {
        return {
            role: roles[0],
            project: {
                create: true,
                edit: true, 
                view: true,
                delete: true,
                validate: false,
                copyProjectPhases: true
            },
            home: true,
            roleCostPremises: {
                create: true,
                edit: true, 
                view: true,
                delete: true,
            },
            dashboard: true,
            isAdmin,
            isPowerUser
        }
    }

    function getDivisionUserPermissions(): TPermissions {
        return {
            role: roles[0],
            project: {
                create: false,
                edit: false, 
                view: true,
                delete: false,
                validate: false,
                copyProjectPhases: false
            },
            home: true,
            roleCostPremises: {
                create: false,
                edit: false, 
                view: true,
                delete: false,
            },
            dashboard: true,
            isAdmin,
            isGSOrBDUser
        }
    }

    function getAdminUserPermissions(): TPermissions {
        return {
            role: roles[0],
            project: {
                create: true,
                edit: true, 
                view: true,
                delete: true,
                validate: true,
                copyProjectPhases: true
            },
            home: true,
            roleCostPremises: {
                create: true,
                edit: true, 
                view: true,
                delete: true,
            },
            dashboard: true,
            isAdmin,
        }
    }

    function getGSOrBDPowerUserPermissions(): TPermissions {
        return {
            role: roles[0],
            project: {
                create: false,
                edit: false, 
                view: true,
                delete: false,
                validate: false,
                copyProjectPhases: false
            },
            home: true,
            roleCostPremises: {
                create: true,
                edit: true, 
                view: true,
                delete: true,
            },
            dashboard: true,
            isAdmin,
            isGSOrBDPowerUser,
        }
    }

    function getPublicUserPermissions(): TPermissions {
        return {
            role: roles[0],
            project: {
                create: false,
                edit: false, 
                view: true,
                delete: false,
                validate: false,
                copyProjectPhases: false
            },
            home: false,
            roleCostPremises: {
                create: false,
                edit: false, 
                view: false,
                delete: false,
            },
            dashboard: false,
            isAdmin,
            isPublic
        }
    }

    if (isPowerUser && !isGSOrBDPowerUser) {
        return getPowerUserPermissions();
    }

    if (isAdmin) {
        return getAdminUserPermissions();
    }

    if (isGSOrBDPowerUser) {
        return getGSOrBDPowerUserPermissions();
    }

    if (isDivisionUser) {
        return getDivisionUserPermissions();
    }

    return getPublicUserPermissions();
}

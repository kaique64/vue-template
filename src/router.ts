import {createRouter, createWebHistory} from 'vue-router';
import {AccessRoleService} from '@/modules/access-role/service/AccessRoleService';
import {AccessRoleDto} from '@/modules/access-role/type/AccessRoleDto';
import AuthService from './common/service/integration/AuthService';
import {JwtService} from './common/service/integration/JwtService';

const accessRoleService = AccessRoleService();

const routes = [
    {
        name: 'Home',
        path: '/',
        component: () => import('./pages/Home.vue')
    },
    {
        name: 'Projects',
        path: '/projects',
        component: () => import('./pages/DhtmlxGantt.vue')
    },
    {
        name: 'Project',
        path: '/project/projectId=:projectId',
        component: () => import('./pages/Project.vue')
    },
    {
        name: 'New Project',
        path: '/project/new',
        component: () => import('./pages/Project.vue')
    },
    {
        name: 'Upload',
        path: '/upload',
        component: () => import('./pages/Upload.vue'),
        meta: {requiresAuth: true}
    },
    {
        name: 'DhtmlGantt',
        path: '/gantt',
        component: () => import('./pages/DhtmlxGantt.vue'),
        meta: {requiresAuth: true}
    },
    {
        name: 'Experts',
        path: '/experts',
        component: () => import('./pages/RoleCostPremises.vue')
    },
    {
        name: 'Master Data',
        path: '/master-data',
        component: () => import('./pages/MasterData.vue')
    },
    {
        name: 'Project Type',
        path: '/project-type',
        component: () => import('./pages/ProjectType.vue')
    },
    {
        name: 'Dashboards',
        path: '/dashboards',
        component: () => import('./pages/Dashboards.vue')
    },
    {
        name: 'Unauthorized',
        path: '/unauthorized',
        component: () => import('@/pages/Unauthorized.vue')
    },
    {
        name: 'Error',
        path: '/error',
        component: () => import('@/pages/Error.vue')
    },
    {
        name: 'NoAccess',
        path: "/no-access",
        component: () => import('@/pages/NoAccessPage.vue')
    },
    {path: '/:catchAll(.*)', redirect: '/'}
];

// TODO: Remove this whitelist and use user role
const whiteList = [
    'vlm1ca@bosch.com',
    'crr2jvl@bosch.com',
    'mes9ca@bosch.com',
    'bca4ca@bosch.com',
    'cok1ca@bosch.com',
    'gla8ca@bosch.com',
    'zac6ca@bosch.com',
    'sjt5ca@bosch.com',
    'ang3jvl@bosch.com',
    'stn2ca@bosch.com'
];

const userLoggedIn: string | null = localStorage.getItem('auth-upn');

const router = createRouter({
    history: createWebHistory(import.meta.env.VITE_ROOT_DIRECTORY),
    routes: routes,
    linkActiveClass: 'active'
});

router.beforeEach(async (to, from, next) => {

    if (to.path === "/no-access") {
        return next();
    }

    const isAllowed = whiteList.includes(userLoggedIn);
    const isUnauthorizedRoute = to.path === "/unauthorized";
    const accessToken = await new AuthService().getToken();
    const jwtAccessToken = new JwtService().parseJwt(accessToken);
    const roles = await new AuthService().getRoles(jwtAccessToken || "");
    const result: AccessRoleDto | undefined = await accessRoleService.getAccessRole(
        accessToken
    )

    //Public role
    if (result && result.divisionId === -2) {
        // Allow access only to 'Projects' and 'Project' routes
        if (to.name === "Projects" || to.name === "Project") {
            return next();
        } else {
            // Redirect to 'Projects' route
            return next({name: "Projects"});
        }
    }

    //Admin role
    if (roles[0] !== "admin" && to.name === "Master Data") {
        return next({name: "Home"});
    }
    
    // Admin and Power user role
    if (roles[0] !== "admin" && to.name === "Project Type") {
        return next({name: "Home"});
    }

    //Multiple roles
    if (result && result.divisionId === -1 && to.name !== "Unauthorized") {
        return next({name: "Unauthorized"});
    }

    if (to.meta.requiresAuth && !isAllowed && !isUnauthorizedRoute && to.name !== "Unauthorized" && to.name !== "Projects") {
        return next('/unauthorized');
    }

    return next();
});

export default router;

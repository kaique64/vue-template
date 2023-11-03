import AuthService from "@/common/service/integration/AuthService";

export async function verifyAdminPermission() {
    return await new AuthService().isAdmin()
}
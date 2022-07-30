import { UserJson } from "constants/interfaces";
import { AdminUserFormData } from "./typing";

export const initAdminForm = (data: UserJson): AdminUserFormData => {
    return {
        username: "",
        password: "",
        name: data.name,
        department: data.department,
        role: data.role
    }
}
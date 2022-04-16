import { Routes as RouteInterface } from "@angular/router";
import { RolesTableComponent } from "./table/roles-table.component";
import { RoleComponent } from "./role/role.component";

export const Routes: RouteInterface = [
    {
        path: "",
        component: RolesTableComponent,
    },
    {
        path: ":id",
        component: RoleComponent,
    }
];

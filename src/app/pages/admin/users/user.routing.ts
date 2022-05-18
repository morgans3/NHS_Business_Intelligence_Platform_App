import { Routes as RouteInterface } from "@angular/router";
import { UsersTableComponent } from "./table/users-table.component";
import { UserComponent } from "./user/user.component";

export const Routes: RouteInterface = [
    {
        path: "",
        component: UsersTableComponent,
    },
    {
        path: ":id",
        component: UserComponent,
    },
];

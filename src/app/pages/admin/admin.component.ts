import { Component, ViewEncapsulation } from "@angular/core";

@Component({
    selector: "app-admin",
    templateUrl: "./admin.component.html",
    styleUrls: ["./admin.component.scss"],
    encapsulation: ViewEncapsulation.None,
})
export class AdminComponent {
    menuItems = [
        {
            name: "Users",
            sub: [
                { name: "All users", link: "/admin/users" },
                { name: "User requests", link: "/admin/requests" },
                { name: "User access logs", link: "/admin/access-logs" },
            ],
        },
        { name: "Teams", link: "/admin/teams" },
        { name: "Organisations", link: "/admin/organisations" },
        {
            name: "Role based access",
            sub: [
                { name: "Roles", link: "/admin/roles" },
                { name: "Capabilities", link: "/admin/capabilities" },
            ],
        },
        { name: "Apps", link: "/admin/apps" },
        {
            name: "Other",
            sub: [
                { name: "Alerts", link: "/admin/alerts" },
                { name: "Dashboards", link: "/admin/dashboards" },
                { name: "News Feeds", link: "/admin/newsfeeds" },
            ],
        },
    ];

    subMenuItems = [];

    constructor() {}
}

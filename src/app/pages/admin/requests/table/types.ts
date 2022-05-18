export const requestTypes = {
    AccountRequest: {
        columns: [
            {
                def: "user_name",
                name: "User's name",
                key: "${this.item.data.firstname} ${this.item.data.surname}|html",
            },
            {
                def: "user_email",
                name: "User's email",
                key: "data.email",
            },
            {
                def: "status",
                name: "Status",
                key:
                    "${this.item.data.approved === null ? 'Requires action' : " +
                    "(this.item.data.approved === true ? 'Approved' : 'Denied')}| html",
            },
            {
                def: "submitted",
                name: "Submitted",
                key: "created_at",
            },
        ],
        actions: [
            {
                name: "View",
                type: "link",
                link: "/admin/requests/${this.item.id}| html",
            },
        ],
    },
    AccountRequestComplete: {
        columns: [
            {
                def: "officer",
                name: "Officer",
                key: "data.officer",
            },
            {
                def: "officer_job",
                name: "Officer job",
                key: "data.officer_job",
            },
            {
                def: "organisation",
                name: "Organisation",
                key: "data.organisation",
            },
            {
                def: "action",
                name: "Action",
                key: "data.action",
            },
            {
                def: "submitted",
                name: "Submitted",
                key: "created_at",
            },
        ],
        actions: [],
    },
};

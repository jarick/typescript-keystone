import fixtures = require("pow-mongoose-fixtures");

export default function load(db: any, done: (err: any) => void) {
    fixtures.load({
        HelpPage: [
            {
                content: "<div>test</div>",
                meta: [
                    `{"name":"description","value":"test"}`,
                    `{"name":"description2","value":"test2"}`,
                ],
                name: "Help page",
                title: "Help page",
            },
        ],
        HomePage: [
            {
                content: "<div>test</div>",
                meta: [
                    `{"name":"description","value":"test"}`,
                    `{"name":"description2","value":"test2"}`,
                ],
                name: "Home page",
                title: "Home page",
            },
        ],
        SettingsPage: [
            {
                content: "<div>test</div>",
                meta: [
                    `{"name":"description","value":"test"}`,
                    `{"name":"description2","value":"test2"}`,
                ],
                name: "Settings page",
                title: "Settings page",
            },
        ],
        SiteLayout: [
            {
                code: "main",
                icon: "#",
                name: "Main layout",
            },
        ],
    }, db, done);
}

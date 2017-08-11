import fixtures = require("pow-mongoose-fixtures");

export default function load(db: any, done: (err: any) => void) {
    fixtures.load({
        Menu: [
            {
                active: true,
                createdAt: Date.now(),
                items: [
                    {
                        href: "/example-1",
                        id: "item-1",
                        path: "",
                        title: "Item 1",
                        type: "casual",
                    },
                    {
                        href: "/example-2",
                        id: "item-2",
                        path: "item-1",
                        title: "Item 2",
                        type: "casual",
                    },
                    {
                        href: "/example-3",
                        id: "item-3",
                        path: "item-1#item-2",
                        title: "Item 3",
                        type: "casual",
                    },
                ],
                name: "Test menu",
                slug: "test-menu",
            },
        ],
    }, db, done);
}

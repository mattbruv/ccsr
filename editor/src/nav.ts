
export const links = [
    {
        to: "load",
        text: "Load Episode",
        icon: "mdi-upload",
        divider: true,
    },
    {
        to: "",
        text: "Maps",
        icon: "mdi-map",
        subLinks: [
            {
                to: "/layers",
                text: "Layers",
                icon: "mdi-layers",
            },
            {
                to: "/collision",
                text: "Collision",
                icon: "mdi-set-none",
            },
        ],
    },
    {
        to: "characters",
        text: "Characters",
        icon: "mdi-account-outline",
    },
    {
        to: "items",
        text: "Items",
        icon: "mdi-key-variant",
    },
    {
        to: "textures",
        text: "Textures",
        icon: "mdi-texture-box",
    },
    {
        to: "",
        text: "Events",
        icon: "mdi-file-tree",
        divider: true,
        subLinks: [
            {
                to: "/event-graph",
                text: "Event Graph",
                icon: "mdi-graph-outline",
            },
            {
                to: "/event-editor",
                text: "Event Editor",
                icon: "mdi-vector-polyline-edit",
            },
        ],
    },
    {
        to: "save",
        text: "Save Episode",
        icon: "mdi-download",
    },
    {
        to: "settings",
        text: "Settings",
        icon: "mdi-cog",
    },
];
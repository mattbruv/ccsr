
export const links = [
    {
        to: "load",
        text: "Load Episode",
        icon: "mdi-upload",
        divider: true,
    },
    {
        to: "maps",
        text: "Maps",
        icon: "mdi-map",
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
        to: "metadata",
        text: "Metadata",
        icon: "mdi-code-json",
        divider: true,
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
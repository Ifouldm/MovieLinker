function Route(name, htmlName, defaultRoute) {
    try {
        if (!name || !htmlName) {
            console.error('name and htmlName are required');
        }
        this.constructor(name, htmlName, defaultRoute);
    } catch (e) {
        console.error(e);
    }
}

Route.prototype = {
    name: undefined,
    htmlName: undefined,
    default: undefined,
    constructor(name, htmlName, defaultRoute) {
        this.name = name;
        this.htmlName = htmlName;
        this.default = defaultRoute;
    },
    isActiveRoute(hashedPath) {
        return hashedPath.replace('#', '') === this.name;
    },
};

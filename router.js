const tabbar = document.getElementById('tabbar');

function Router(routes) {
    try {
        if (!routes) {
            console.error('Routes parameter is required');
        }
        this.constructor(routes);
        this.init();
    } catch (e) {
        console.error(e);
    }
}

Router.prototype = {
    routes: undefined,
    rootElement: undefined,
    constructor(routes) {
        this.routes = routes;
        this.rootElement = document.getElementById('app');
    },
    init() {
        const r = this.routes;
        (function (scope, r) {
            window.addEventListener('hashchange', () => {
                scope.hasChanged(scope, r);
            });
        }(this, r));
        this.hasChanged(this, r);
    },
    hasChanged(scope, r) {
        // if # path exists
        if (window.location.hash.length > 0) {
            for (let i = 0; i < r.length; i += 1) {
                const route = r[i];
                if (route.isActiveRoute(window.location.hash.substr(1))) {
                    scope.goToRoute(route);
                }
            }
        } else { // Else use default path
            for (let i = 0; i < r.length; i += 1) {
                const route = r[i];
                if (route.default) {
                    scope.goToRoute(route);
                }
            }
        }
    },
    goToRoute(route) {
        const { htmlName, name } = route;
        (function (scope) {
            Array.prototype.forEach.call(tabbar.children, (tab) => (tab.id === name ? tab.classList.add('active') : tab.classList.remove('active')));
            const url = `pages/${htmlName}`;
            const xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState === 4 && this.status === 200) {
                    scope.rootElement.innerHTML = this.responseText;
                    // Run scripts for each script tag
                    Array.from(scope.rootElement.querySelectorAll('script')).forEach((oldScript) => {
                        const newScript = document.createElement('script');
                        Array.from(oldScript.attributes)
                            .forEach((attr) => newScript.setAttribute(attr.name, attr.value));
                        newScript.appendChild(document.createTextNode(oldScript.innerHTML));
                        oldScript.parentNode.replaceChild(newScript, oldScript);
                    });
                }
            };
            xhttp.open('GET', url, true);
            xhttp.send();
        }(this));
    },
};

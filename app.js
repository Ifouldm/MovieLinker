(function () {
    function init() {
        const router = new Router([
            new Route('home', 'home.html', true),
            new Route('application', 'application.html'),
        ]);
    }
    init();
}());

{% load url from future %}
{% load i18n %}
var AppRouter = Backbone.Router.extend({
        routes: {
            "{% url 'login_nt' %}": "login",
            "*actions": "defaultRoute" // Backbone will try match the route above first
        },
        getPost: function( id ) {
            // Note the variable in the route definition being passed in here
        },
        defaultRoute: function( actions ){
        }
    });
    // Instantiate the router
    var app_router = new AppRouter;
    // Start Backbone history a neccesary step for bookmarkable URL's
    Backbone.history.start();

//    new LoginView();

{% load url from future %}
{% load i18n %}
var PostRouter = Backbone.Router.extend({
    initialize: function(options) {
        if(options == undefined) options = {};
        if(options.postListView == undefined){
            this.postListView = new PostListView();
        }else{
            this.postListView = options.postListView;
        }
    },
    routes: {
        'p:page': 'list',
        'add': 'add',
        'get': 'get',
        'save': 'save',
        '*actions': 'defaultRoute' // Backbone will try match the route above first
    },
    list: function(page){
        this.postListView.list(page);
    },
    add: function(){
        var modelPost = new Post();
        modelPost.url = '{%url "add_post" %}';
        var postView = new PostView({model:modelPost});
        postView.renderForm(this.postListView);
    },
    get: function(id) {
        // Note the variable in the route definition being passed in here
    },
    save: function(){
    },
    defaultRoute: function( actions ){
        return false;
    }
});




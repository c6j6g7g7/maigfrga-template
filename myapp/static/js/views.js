 LoginView = Backbone.View.extend({
                initialize: function(){
                    console.log('view');
                },
                events: {
                    "click #loginBtn": "login"
                },
                login: function(e){
                    console.log('peguelo niño');
                    e.preventDefault();
                }
             });

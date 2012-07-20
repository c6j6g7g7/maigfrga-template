var  LoginView = Backbone.View.extend({
                render: function(){
                    Backbone.Validation.bind(this);
                },
                
                initialize: function(){
                    console.log('view');
                },
                events: {
                 //   "click #loginBtn": "login"
                },
                login: function(e){
                    e.preventDefault();
                    //console.log(this.model.isValid('username'));
                    
                }
             });

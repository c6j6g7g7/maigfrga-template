var  LoginView = Backbone.View.extend({
                el: '#login-container',

                initialize: function(params){
                    //If models is not setted in params, we must create a model instance
                    if(params != undefined){
                        if(params.model == undefined){
                            this.model = new UserLogin;
                        }
                    }
                    else{
                        this.model = new UserLogin;
                    }
                },

                events: {
                   "click #loginBtn": "login"
                },

                render: function(params) {
                    if (params == undefined) params = {};
                    if(params.errors != undefined ){
                        //If param.errors is definided, a validation error has happen and has to be rendered
                        notempo.utils.show_errors(this.$el, params);
                        }
                    return this;
                },

                login: function(e){
                    e.preventDefault();
                    //set the input values to the model and perform validation
                    this.model.set({'username': this.$("#id_username").val(),
                                    'password': this.$("#id_password").val()
                                    });
                    Backbone.Validation.bind(this);

                    if (!this.model.isValid(['username', 'password'])){
                        var params = {'errors': this.model.validate()};
                        this.render(params);
                    }
                    else{
                        //success function tha executes after response has delivered from server
                        var current_view = this;
                        var success = function(model, response){
                            if(response.errors != undefined){
                                var params = {'errors': response.errors};
                                current_view.render(params);
                            }else{
                                if(response.ok != undefined){
                                        window.location.replace(response.ok.url);
                                    }
                            }
                         };

                         this.model.save({},{success: success});
                    }
                }
             });

var PostListView = Backbone.View.extend({
        url: '/post/'
});

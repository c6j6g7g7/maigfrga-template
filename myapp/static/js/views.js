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
                        var show_errors = function(value, field){
                                var template = _.template('<div class="alert  alert-error"> <strong>oops!</strong>  <%= error %></div>');

                                var control_group = this.$('li.'+field);
                                control_group.addClass('error');
                                control_group.find('div.controls').append(template({'error': value}));

                            };
                        _.each(params.errors, show_errors);
                        }
                    return this;
                },

                login: function(e){
                    //Backbone.emulateJSON = true;

                    e.preventDefault();
                    this.model.set({'username': this.$("#id_username").val(),
                                    'password': this.$("#id_password").val()
                                    });
                    Backbone.Validation.bind(this);
                    if (!this.model.isValid(['username', 'password'])){
                        var params = {'errors': this.model.validate()};
                        this.render(params);
                    }else{
                        var success = function(response, b){
                            
                            console.log('not error');
                            console.log(response);
                            console.log(b);
                         };
                        var error = function(response){
                            console.log('error');
                                console.log(response);
                            };
                         /*
                         var data={};
                         data.parameters = this.model.toJSON();
                         data.error_func = error;
                         data.success_func = success;
                         data.url = this.model.url;
                         notempo.utils.do_post(data);*/
                         this.model.save({success:success});
                        //console.log(this.model.validate());
                    }
                }
             });

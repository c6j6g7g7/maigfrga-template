var UserLogin = Backbone.Model.extend({
    url : '/login/',
    initialize: function(options){
        //check if validation rules has been seeted in constuction time
        if(options == undefined) options = {};
        if(options.validation != undefined){
                if(options.validation.username != undefined){
                        this.validation.username = options.validation.username;
                    }
                if(options.validation.password != undefined){
                        this.validation.password = options.validation.password;
                    }
            }
    },

    /*validation : {

        username: {
            required: true,
            msg: 'Please enter your username'
        },
        password: {
            required: true,
            msg: 'Please enter your password'
        }
    }*/
});

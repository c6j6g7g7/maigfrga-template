var UserLogin = Backbone.Model.extend({
    validation : {
        email: {
            required: true,
            pattern: 'email'
        }
    }
});

var User = Backbone.Model.extend({
    });

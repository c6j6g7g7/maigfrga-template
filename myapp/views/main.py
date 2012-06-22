"""main.py Main views for your app"""
from django import http
from django.core.serializers import serialize
from django.db.models.query import QuerySet
from django.template import RequestContext, loader
from django.utils import simplejson
from django.utils.log import getLogger
from django.views.generic import View

logger = getLogger('django.request')


class BaseView(View):
    """
    Base django class based view
    """
    def __init__(self, **kwargs):
        """
        by default the view will map every request in this way:
        get : will call the list method
        post : will call the create method
        put : will call the update method
        delete: will call the delete method

        If action_name param  is defined in kwargs the view will not call
        the default method, instead serch by a method whith action_name name
        and execute it
        """
        super(BaseView, **kwargs)

    def dispatch(self, *args, **kwargs):
        """
        dispatch to the appriatte method:
        GET POST PUT DELETE
        if 'action' is defined in kwargs, every method will redirect to a method with this param value
        Override this method in order to aply any desired decorator
        https://docs.djangoproject.com/en/dev/topics/class-based-views/#decorating-the-class
        """
        return super(BaseView, self).dispatch(*args, **kwargs)

    def get(self, *args, **kwargs):
        return super(BaseView, self).get(*args, **kwargs)

    def post(self, *args, **kwargs):
        """
        following REST philosophy post can be used in order to create new resources
        http://en.wikipedia.org/wiki/Representational_state_transfer
        """
        return self.create(*args, **kwargs)

    def put(self, *args, **kwargs):
        """
        Django does not support PUT this piece of code is from django piston in order to support PUT
        https://bitbucket.org/jespern/django-piston/src/c4b2d21db51a/piston/utils.py
        PUT method is used in REST approach to update previously created resources
        """
        request = args[0]
        if hasattr(request, '_post'):
            del request._post
            del request._files
        try:
            request.method = "POST"
            request._load_post_and_files()
            request.method = "PUT"
        except AttributeError:
            request.META['REQUEST_METHOD'] = 'POST'
            request._load_post_and_files()
            request.META['REQUEST_METHOD'] = 'PUT'
        request.PUT = request.POST

        if 'action' in kwargs:
            """
            if action param is defined un urls.py the view will call a method with this param name
            otherwise update method will called by default
            """
            func = getattr(self, kwargs.get('action'))
            return func(*args, **kwargs)

        return self.update(*args, **kwargs)

    def delete(self, *args, **kwargs):
        return self.delete(*args, **kwargs)

    def template_response(self, request, template_name='base.html', context={}):
        t = loader.get_template(template_name)
        c = RequestContext(request, context)
        return http.HttpResponse(t.render(c))

    def json_to_response(self, obj={}):
        if type(obj) == QuerySet:
            content = serialize('json', obj={})
        else:
            content = simplejson.dumps(obj)
        return http.HttpResponse(content, mimetype='application/json')




class IndexView(BaseView):
    """
    A very simple basic view
    """
    def get(self, request, *args, **kwargs):
        if 'id' in kwargs:
            return self.edit(request,*args,**kwargs)
        else:
            return self.list(request,*args,**kwargs)
        context = {}
        return self.template_to_response(context=context)

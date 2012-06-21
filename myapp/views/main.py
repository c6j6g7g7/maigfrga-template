"""main.py Main views for your app"""
from darksite.common.http.response import JSONResponse
from django import http
from django.utils.log import getLogger
from django.template import RequestContext, loader
from django.views.generic import View

logger = getLogger('django.request')


class DarkSiteBaseView(View):
    """
    Class based in generic views class,encapsulates
    request an response for all app
    """
    def __init__(self, **kwargs):
        super(DarkSiteBaseView, **kwargs)

    def template_response(self, request, template_name='base.html', context={}):
        t = loader.get_template(template_name)
        c = RequestContext(request, context)
        return http.HttpResponse(t.render(c))

    def json_response(self, response_dict={}):
        return JSONResponse(response_dict)

    def dispatch(self, *args, **kwargs):
        """
         dispatch to the appriatte method:
         GET POST PUT DELETE
         if 'action' is defined in kwargs, every method will redirect
         to a method with this param value
        """
        return super(DarkSiteBaseView, self).dispatch(*args, **kwargs)

    def get(self, *args, **kwargs):
        return super(DarkSiteBaseView, self).get(*args, **kwargs)

    def post(self, *args, **kwargs):
        return self.create(*args, **kwargs)

    def put(self, *args, **kwargs):
        """
        Django does not support PUT/DELETE this piece of code is from django piston in order to support PUT
        https://bitbucket.org/jespern/django-piston/src/c4b2d21db51a/piston/utils.py
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

"""main.py Main views for your app"""
from django import http
from django.core.serializers import serialize
from django.core.urlresolvers import reverse
from django.contrib.auth.decorators import login_required
from django.db.models.query import QuerySet
from django.template import RequestContext, loader
from django.utils import simplejson
from django.utils.decorators import method_decorator
from django.utils.log import getLogger
from django.views.generic import View

from myapp.models.main import PostModel,BaseModel
from myapp.forms.main import PostForm

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
        '''
        if 'action' in kwargs:
            """
            if action param is defined un urls.py the view will call a method with this param name
            otherwise update method will called by default
            """
            func = getattr(self, kwargs.get('action'))
            return func(*args, **kwargs)
        '''
        return self.update(*args, **kwargs)

    def delete(self, *args, **kwargs):
        return self.delete(*args, **kwargs)

    def template_response(self, request, template_name='index.html', context={}):
        t = loader.get_template(template_name)
        c = RequestContext(request, context)
        return http.HttpResponse(t.render(c))

    def json_to_response(self, obj={}):
        try:
            content = simplejson.dumps(obj)
        except Exception as a:
            print a
            content = {}
        return http.HttpResponse(content, mimetype='application/json')


class IndexView(BaseView):
    """
    A very simple basic view
    """
    def get(self, request, *args, **kwargs):
        context = {}
        return self.template_response(request, context=context)

class PostView(BaseView):
    @method_decorator(login_required)
    def dispatch(self,*args, **kwargs):
        return super(PostView, self).dispatch(*args, **kwargs)

    def get(self, *args, **kwargs):
        """
        If id params is set, will render a sigle PostModel object,
        otherwise will render a PostModel list
        """
        if 'id' in kwargs:
            return self.edit(*args, **kwargs)
        else:
            return self.object_list(*args, **kwargs)

    def delete(self, *args, **kwargs):
        return self.remove(*args, **kwargs)

    def object_list(self, *args, **kwargs):
        request= args[0]
        object_list = PostModel.get_list()
        context = {'object_list': object_list}
        return self.template_response(request, template_name='post/list.html', context=context)

    def edit(self, *args, **kwargs):
        request= args[0]
        context={}
        try:
            context['obj'] = PostModel.objects.get(id=kwargs.get('id'))
            context['form'] = PostForm(initial={'title': context['obj'].title,
                                                'content': context['obj'].content,
                                                'slug': context['obj'].slug})
        except PostModel.DoesNotExist:
            return http.HttpResponseRedirect(reverse('post'))

        return self.template_response(request, template_name='post/edit.html', context=context)

    def create(self, *args, **kwargs):
        request= args[0]
        if request.method != "POST":
            return http.HttpResponseRedirect(reverse('post'))
        form = PostForm(data=request.POST)
        if form.is_valid():
            obj = form.save()
            obj_dict={'id': obj.id, 'slug': obj.slug, 'title': obj.title, 'content': obj.content, 'create_datetime': str(obj.create_datetime)}
            return self.json_to_response(obj=obj_dict)
        else:
            return self.json_to_response(obj={'errors':form.errors})

    def update(self, *args, **kwargs):
        request= args[0]
        if request.method != "PUT":
            return http.HttpResponseRedirect(reverse('post'))
        try:
            obj = PostModel.objects.get(pk=kwargs.get('id'))
            form = PostForm( request.PUT )
            if form.is_valid():
                obj = form.save(obj_post=obj)
                obj_dict={'id': obj.id, 'slug': obj.slug, 'title': obj.title, 'content': obj.content, 'create_datetime': str(obj.create_datetime)}
                return self.json_to_response(obj=obj_dict)
            else:
                return self.json_to_response(obj={'errors':form.errors})
        except PostModel.DoesNotExist:
            return self.json_to_response(obj={'errors': 'can not update'})

    def remove(self, *args, **kwargs):
        request= args[0]
        if request.method != 'DELETE' or not 'id' in kwargs:
            return self.json_to_response(obj={'error':'can not delete post'})
        try:
            obj = PostModel.objects.get(id=kwargs.get('id'))
            obj.delete()
            return self.json_to_response(obj={'ok':'post deleted'})
        except:
            return self.json_to_response(obj={'error':'can not delete post'})


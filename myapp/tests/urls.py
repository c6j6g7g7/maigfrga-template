from django.conf.urls.defaults import *
from myapp.views.main import IndexView
from myapp.views.main import PostView
urlpatterns = patterns('',
                       url(r'^$', IndexView.as_view(), name='index'),
                       url(r'^login/$', IndexView.as_view(), name='login', kwargs={'action': 'login'}),
                       url(r'^post/add/$', PostView.as_view(), name='add_post', kwargs={'action': 'edit'}),
                       url(r'^post/(?P<id>\d+)/$', PostView.as_view(), name='update_post'),
                       url(r'^post/$', PostView.as_view(), name='post'),
                      )

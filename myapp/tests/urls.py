from django.conf.urls.defaults import *
from myapp.views.main import IndexView
from myapp.views.main import PostView
urlpatterns = patterns('',
                       url(r'^$', IndexView.as_view(), name='index'),
                       url(r'^post/$', PostView.as_view(), name='post'),
                       url(r'^post/(?P<id>\d+)/$', PostView.as_view(), name='post'),

                      )

from django.conf.urls.defaults import patterns, include, url
from myapp.views.main import IndexView, PostView
urlpatterns = patterns('',
    url(r"^login/$", IndexView.as_view(), name='login_nt', kwargs={'action': 'login'}),
    url(r'^post/$', PostView.as_view(), name='post'),
    url(r'^post/add/$', PostView.as_view(), name='add_post', kwargs={'action': 'edit'}),
    url(r'^post/(?P<id>\d+)/$', PostView.as_view(), name='post'),
    url(r"^", IndexView.as_view(), name='index'),
)


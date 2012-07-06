from django.conf.urls.defaults import patterns, include, url
from myapp.views.main import IndexView
urlpatterns = patterns('',
    url(r"^", IndexView.as_view(), name='index'),
)


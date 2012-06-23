from django.conf.urls.defaults import *
from myapp.views.main import IndexView

urlpatterns = patterns('',
                       url(r'^$',IndexView.as_view(),name='index'),
                      )

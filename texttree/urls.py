from django.conf.urls import patterns, include, url

from texttree import views

urlpatterns = patterns('',
    url(r'^$', views.tree, name='tree'),
    url(r'^toc$', views.toc, name='toc'),
    url(r'^tree$', views.tree, name='tree'),
    url(r'^getinfo/content/(.*)$', views.getcontent, name='getcontent'),
    url(r'^getinfo/(.*)$', views.getinfo, name='getinfo')
)


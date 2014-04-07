import json
from django.shortcuts import render

from django.http import Http404, HttpResponse

from texttree.models import SampleData as Sam

# table of contents
def toc(request):
    every_text = [(slug, Sam.index[slug]['title']) 
                    for slug in Sam.index if Sam.index[slug]['kind'] == 'Text']
    context = {'links': every_text }
    return render(request, 'worldlit/toc.html', context)

# the top of the tree
def tree(request):
    top_slug = Sam.top_slug
    context = {'links': [(top_slug, Sam.index[top_slug]['title'])] }
    return render(request, 'worldlit/tree.html', context)

# get a piece of the data hierachy in JSON form
def getinfo(request, slug):
    response = Sam.get_hunk(slug)
    if response:
        return HttpResponse(json.dumps(response), content_type='application/json')
    raise Http404

# get the contents of a text
def getcontent(request, slug):
    response = Sam.get_hunk(slug)
    if response['kind'] == 'Text':
        return HttpResponse(response['content'])
    raise Http404


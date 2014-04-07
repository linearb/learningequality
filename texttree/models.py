import modeldata

from django.conf import settings

class SampleData:

    index, top_slug = modeldata.get_data(settings.MODELDATA)

    @classmethod
    def get_hunk(cls, slug):
        if slug == '':
            slug = SampleData.top_slug
        return modeldata.get_hunk(slug, SampleData.index)


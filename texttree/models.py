import modeldata

class SampleData:

    index, top_slug = modeldata.get_data('sample_topictree.json')

    @classmethod
    def get_hunk(cls, slug):
        if slug == '':
            slug = SampleData.top_slug
        return modeldata.get_hunk(slug, SampleData.index)


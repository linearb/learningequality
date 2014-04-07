import json

def get_data(filename):

    index = {}

    def make_index(input_data):
        # index the tree of data to make lookup faster
        slug = input_data['slug']
        index[slug] = input_data
        if input_data['kind'] == 'Topic':
            for i in input_data['children']:
                make_index(i)
        elif input_data['kind'] == 'Text':
            pass
        else:
            raise ValueError('Unable to parse JSON data')

    with open(filename) as f:
        data = json.load(f)

    first_slug = data['slug'] 
    make_index(data)
    return index, first_slug

def get_hunk(slug, index):

    if not slug in index:
        return False
    this_entry = index[slug]
    if this_entry['kind'] == 'Text':
        return this_entry
    children = [ {'kind':child['kind'], 
                 'slug':child['slug'], 
                 'title':child['title']} for child in this_entry['children'] ]
    return {'kind': 'Topic', 
            'slug': slug, 
            'title': this_entry['title'], 
            'children': children }


if __name__ == '__main__':
    # do some quick tests

    FILENAME = '../sample_topictree.json'
    data_index, first_slug = get_data(FILENAME)

    print(first_slug)
    print(get_hunk(first_slug, data_index))
    print(get_hunk('stories-and-literature', data_index))
    print(get_hunk('fairy-tales', data_index))
    print(get_hunk('tao-te-ching', data_index))
    print(get_hunk('classic-literature', data_index))



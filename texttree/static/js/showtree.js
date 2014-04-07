
    'use strict';

    var app = {}; 
    
    //--------------
    // Models
    //--------------
    app.Topic = Backbone.Model.extend({
      idAttribute: 'slug',
      url: function() {
        return 'getinfo/' + this.id;
        },
      defaults: {
        slug : '',
        kind: '',
        title: ''}
    });

    //--------------
    // Collections
    //--------------
    app.TopicTree = Backbone.Collection.extend({
      model: app.Topic
    });

    // instance of the Collection
    app.TopicTree = new app.TopicTree();

    // load model of top level topic
    // no need for addOne callback as its 
    // button is already displayed on page
    app.firsttopic = new app.Topic();
    app.firsttopic.fetch();
    app.TopicTree.add(app.firsttopic);

    //--------------
    // Views
    //--------------
    
    // renders button for topic item (li)
    app.TopicView = Backbone.View.extend({
      tagName: 'li',
      template: _.template($('#topic-template').html()),
      render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this; // enable chained calls
      }
    });

    // renders subtopic list (ul)
    app.TopicListView = Backbone.View.extend({
      tagName: 'ul',
      template: _.template($('#topic-list-template').html()),
      render: function(){
        this.$el.html(this.template(this.model.toJSON()));
        return this; // enable chained calls
      }
    });

    // renders the buttons
    app.AppView = Backbone.View.extend({
      el: '#clickable_list',
      initialize: function () {
        app.TopicTree.on('add', this.addOne, this);
      },
      events: {
        'click button.defaultclick' : 'clickButton',
        'click button.toggleclick' : 'toggleClick',
        'click button.textclick' : 'textClick'
      },
      toggleClick: function(which){
            var clicked_slug = which.target.id;
            $(this.listId(clicked_slug)).toggleClass("hidden");
        },
      textClick: function(which){
            var clicked_slug = which.target.id;
            window.location = 'getinfo/content/'+clicked_slug
        },
      clickButton: function(which){
        var clicked_slug = which.target.id;
        var clicked_model = app.TopicTree.get(clicked_slug).attributes;
        if (clicked_model.kind == 'Text') {
            $('#' + clicked_slug).toggleClass('defaultclick textclick');
            window.location = 'getinfo/content/'+clicked_slug;
        } else { 
            $('#' + clicked_slug).toggleClass('defaultclick toggleclick');

            // get model data for each child from the server
            var child_slugs = clicked_model.children;
            var newtopic, child;
            for (var i=0; i<child_slugs.length; i++) {
                child = child_slugs[i];
                // create the model with some initial attributes so that 
                // button can be made without waiting for the fetch to complete
                newtopic = new app.Topic({'slug': child.slug,
                                        'title': child.title,
                                        'kind': child.kind,
                                        'parent': clicked_slug});
                newtopic.fetch({'slug': child.slug});
                app.TopicTree.add(newtopic);
            }
        }
      },
      addOne: function(newbutton){
        var view = new app.TopicView({model: newbutton});

        if (newbutton.attributes.kind == 'Text') {
            $(this.listId(newbutton.attributes.parent)).
                    append(view.render().el).append(view.render().el);
        } else {
            // only topic nodes have a view list
            var viewlist = new app.TopicListView({model: newbutton});
            $(this.listId(newbutton.attributes.parent)).
                    append(view.render().el).append(view.render().el).
                    append(viewlist.render().el);
        }
      },
        listId: function(slug){
        return '#' + slug + '_list'
        }
    });

    app.appView = new app.AppView(); 



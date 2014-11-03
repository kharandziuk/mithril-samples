/*global m: false */
'use strict';

var app = {};

app.PostList = function(list) {
  return m.prop(list || []);
};

app.vm = {};

app.Post = function(data) {
  var data = data || {};
  this.id = m.prop(data.id);
  this.title = m.prop(data.title);
  this.content = m.prop(data.content);
};

app.vm.init = function() {
  var self = this;
  self.posts = new app.PostList();
  m.request({method: 'GET', url: '/posts', background: true, type: app.Post})
    .then(self.posts)
    .then(m.redraw);
};

app.controller = function() {
  app.vm.init();
};

app.view = function(ctrl) {
  return m('body', [
      m('h1', 'My blog'),
      m('ul',
        app.vm.posts().map(function(el){
          return m('li', [
            m('a[href="/posts/'+el.id()+'"]', {config: m.route}, JSON.stringify(el))
          ]);
        })
      ),
      m('a[href="/posts/add/"]', {config: m.route}, 'add new post')
  ]);
};

var add = {};

add.newPost = function(data) {
  data = data || {};
  this.title = data.title || '';
  this.content = data.content || '';
};

add.controller = function() {
  var post = new add.newPost();
  this.post = post;
  this.create = function(e) {
    e.preventDefault();
    m.request({
      method: 'POST',
      url: '/posts',
      data: post
    }).then(function() {m.route('/');});
  };
};

// data binding helper function
// http://lhorie.github.io/mithril-blog/asymmetrical-data-bindings.html
function formBinds(data) {
  return function(e) {data[e.target.name] = e.target.value;};
}

add.view = function(ctrl) {
  return m('body', [
    m('form', {
      onsubmit: ctrl.create,
      onchange: formBinds(ctrl.post)
    }, [
      m('a[href="/"]', {config: m.route}, 'All Posts'),
      m('br'),
      m('input[type=text][name=title][placeholder="post title"][required]'),
      m('br'),
      m('textarea[name=content][placeholder="post content"][required]'),
      m('br'),
      m('input[type=submit][value=Post]')
    ])
  ]);
};

var details = {};

details.vm = {};
details.vm.init = function(postId) {
  var self = this;
  self.comment = {
    postId: postId,
    name: '',
    body: ''
  };
  self.post = new app.Post();
  m.request({method: 'GET', url: '/posts/'+postId, type: app.Post}).then(function(data) {
    data = data[0];
    self.post = data;
  });
  self.comments = m.request({method: 'GET', url: '/posts/'+postId+'/comments'});

  self.add = function(e) {
    e.preventDefault();
    if (self.comment.body) {
      var newComment = self.comment;
      // TODO: add request error handler (how to?)
      m.request({method: 'POST', url: '/posts/'+postId+'/comments', data: newComment}).then(function() {
        var comments = self.comments();
        comments.push(newComment);
        self.comments(comments);
      });
    }
  }.bind(self);
};

details.controller = function() {
  var postId = +m.route.param('postId');
  this.postId = postId;
  details.vm.init(postId);
};

details.view = function(ctrl) {
  return m('body', [
    m('a[href="/"]', {config: m.route}, 'All posts'),
    m('h1', details.vm.post.title()),
    m('p', details.vm.post.content()),
    m('form', {
      onsubmit: details.vm.add,
      onchange: formBinds(details.vm.comment)
    }, [
      m('input[type=text][name=name][placeholder="your name"][required]'),
      m('br'),
      m('textarea[name=body][placeholder="comment body"][required]'),
      m('br'),
      m('input[type=submit][value=Post]')
    ]),
    m('ul', details.vm.comments().map(function(comment) {
      return m('li', comment.name+': '+comment.body);
    }))
  ]);
};

//setup routes to start w/ the `#` symbol
m.route.mode = 'hash';

//define a route
m.route(document, '/', {
    '/' : app,
    '/posts/add': add,
    '/posts/:postId': details
});


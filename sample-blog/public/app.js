/*global m: false */
'use strict';

var app = {};

app.PostList = function(list) {
  return m.prop(list || []);
};

app.vm = {};
app.vm.init = function() {
  this.posts = new app.PostList();
  this.posts = m.request({method: 'GET', url: '/posts'});
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
            m('a[href="/posts/'+el.id+'"]', {config: m.route}, el.title)
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

details.controller = function() {
  this.post = {};
  this.post.id = m.route.param('postId');
};

details.view = function(ctrl) {
  return m('body', [
    m('a[href="/"]', {config: m.route}, 'All posts'),
    m('h1', 'post id: '+ctrl.post.id)
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


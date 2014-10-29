var app = {}

app.Post = function(data) {
    this.title = m.prop(data.title);
}


app.PostList = Array;

app.vm = {}
app.vm.init = function() {
  posts = new app.PostList();
  this.posts = posts;

  m.request({method: 'GET', url: '/posts'}).then(function(list){
    list.forEach(function(el) {
      posts.push(el);
    });
  });
}

app.controller = function() {
  app.vm.init()
  this.click = function() {
    m.route('posts/add');
  }
}

app.view = function(ctrl) {
  return m('body', [
      m('h1', 'My blog'),
      m('ul', app.vm.posts.map(function(el){
          return m('li', [
            m(
              'a[href="posts/' + el.id + '"]',
              { config: m.route },
              el.title
            )
          ]);
        })
      ),
      m(
        'button', { onclick: ctrl.click }, 'add new post'
      )
  ])
};

var addModule = {};
addModule.vm = {}
addModule.vm.init = function() {

  this.title = m.prop('')
  this.text = m.prop('')

  this.add = function() {
    var title = this.title();
    var text = this.text();

    if (title) {
      var newPost = {
        title: title,
        text: text
      }
      m.request({method: 'POST', url: '/posts', data: newPost});
      m.route('');
    }
  }.bind(this)
}

addModule.controller = function() {
  addModule.vm.init()
};

addModule.view = function(ctrl) {
  return m('body', [
    m('a[href=""]>', {config: m.route}, 'All Posts'),
    m('br'),
    m(
      'input[type="text",placeholder="post title"]',
      {
        onchange: m.withAttr('value', addModule.vm.title),
        value: addModule.vm.title()
      }
    ),
    m(
      'textarea',
      {
        onchange: m.withAttr('value', addModule.vm.text),
        value: addModule.vm.text()
      }
    ),
    m('br'),
    m('button', { onclick: addModule.vm.add }, 'Post'),
  ])
}

var singlePost = {};

singlePost.controller = function() {

}

singlePost.view = function(ctrl) {
  return m('body', [
    m('a[href=""]', 'All posts')
    m('h1', ctrl.post.title)
    m('br')
  ])
}

m.route(document, '/', {
    '' : app,
    'posts/add': addModule,
    'posts/:id': singlePost
})

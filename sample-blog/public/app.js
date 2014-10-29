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
    console.log(list)
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
          return m('li', el.title);
        })
      ),
      m(
        'button', { onclick: ctrl.click }, 'add new post'
      )
  ])
};

var addModule = {};

addModule.controller = function() {

};

addModule.view = function(ctrl) {
  return m('body', [
            m('a[href=""]>', {config: m.route}, 'All Posts'),
            m('br'),
            m('input[type="text",placeholder="post title"]'),
            m('textarea'),
            m('br'),
            m('button', 'Post'),
  ])
}



m.route(document, '/', {
    '' : app,
    'posts/add': addModule,
    //'posts/new': newPost,
    //'posts/:id': singlePost
})
     

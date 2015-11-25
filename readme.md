# DMV

## Intro

DMV is a MEAN stack library that lets you define define roles and permissions. It let's you express thoughts like:

_student_ can *read* **chapter**.
_teacher_ can *assign* **chapter**.

I like to think about the previous sentance like this


```
  [Role] can [Permission]
                  ^
                /   \
            [Verb] [Noun]
```

## Practical Example

We use DMV to regester the roles and nouns:

```js
dmv.role('author');
dmv.role('moderator');
dmv.role('admin');

dmv.noun('post', function(postNoun) {
  // by default the noun has crud verbs
  // we're adding the approve verb here
  postNoun.can('approve');

  // we say that admins can do all verbs
  postNoun.authorize('admin', '*');

  // moderators can 
  postNoun.authorize('moderator', ['approve', 'read']);

  // authors can
  postNoun.authorize('author', ['create', 'update'])

});

dmv.noun('comment', function(commentNoun) {
  commentNoun.can('approve');

  // we say that admins can do all verbs
  commentNoun.authorize('admin', '*');

  // moderators can 
  commentNoun.authorize('moderator', ['approve']);
});
```

### Mongoose

```js

const userSchema = new mongoose.Schema({
  name: String
  // ...
});

//

/**
 * This plugin will add three paths to your user model
 * 
 * - roles
 * - permissionWhitelist
 * - permissionBlacklist
 * 
 * More on the latter two in a minute.
 * It will also add the `can` method.
 */
userSchema.plugin(dmv.mongoosePlugin);

mongoose.model('User', userSchema);

```

To use your user instances can method like this

```js

const sarah = new User({
  roles: ['author'],
  name: 'Sarah'
});

const alex = new User({
  roles: ['moderator'],
  name: 'Alex'
});

const hilary = new User({
  roles: ['admin'],
  name: 'Hilary'
});

sarah.can('create', 'post'); // => true
sarah.can('update', 'post'); // => true
sarah.can('delete', 'post'); // => false

alex.can('approve', 'post'); // true
alex.can('create', 'post');  // false

hilary.can('delete', 'post') // true
hilary.can('aprove', 'post') // true

```

### Express


```js
const dmv = require('dmv');
const auth = dmv.expressMiddleware

// posts router

// everyone can read all posts
router.get('/', controller.index);
router.post('/', auth.can('create', 'post'), controller.create);

router.use('/:id', controller.load);

router.get('/:id', controller.read);


router.put('/:id', auth.can('update', 'post'), controller.update);
router.delete('/:id', auth.can('delete', 'post'), controller.delete);
```

### Angular

Note: we assume you use ui-router for now.

First, you can use our browser file

```html
<script src="./path/to/browser.js"></script>
```

We expose the `dmv` object on the global scope. Dmv is isomorphic so you can run the same code defining permissions and roles that you ran on the server. Doing this will depend on your build process and environment. 

Once your frontend knows about the roles and permissions you can plug in our angular module

```js
angular.module('yourApp', ['ui.router', 'dmv']);
```

Then, you need to hook us into your user model. We expose a factory called `canPlugin`. `canPlugin` is a function that gives your user model a `can` method by modifying its prototype. You pass the prototype to `canPlugin`. You do it like this.

```js
yourModule.factory('YourUserClass', funciton($httpMaybe?, canPlugin) {
  const User = function() {
    // your constructor
  };

  canPlugin(User.prototype);

  return User;
})
```

In your login life-cycle you must regester the logged in user with us like this:

```js
yourModule
  .run(function(authConfig) {
    authConfig.enable(); // <-- hooks into ui-router events
  })
  .controller('yourLoginCtrl', function($state, yourAuth, authConfig) {

    $scope.login = function() {
      yourAuth.checkWithServer()
        .then(function(yourUserInstance) {
          // NOTE: we assume `yourUserInstance` is an instance of the class we plugged into above
          authConfig.setUser(yourUserInstance);
        });
    }
  })
```

Then you can add a specail `auth` property to your ui-router state defs.

```js
yourModule
  .config(function($stateProvider) {
    $stateProvider
      .state('posts', {
        url: '/posts',
        template: 'everyone can see these great posts',
        auth: false // you could omit this, it just documents here
      })
      .state('new_post', {
        url: '/newpost',
        template: 'form only for those who can write',
        auth: {
          create: 'post'
        }
      });

  }) 
```

The auth property can take a boolean or an object. If you pass `true` to auth it will ensure the user has logged in. An object let's you specify the nouns and verbs that the user must have access to to load the route.

Our module will broadcast a `NOT_AUTHORIZED` event on the root scope if a user goes to a route they are not authorized to see. We will broadcast a `NOT_AUTHENTICATED` event if a user that hasn't logged in attempts to see a route that has a truthy auth property.

With these events you can configure the behavior of failed route loads.

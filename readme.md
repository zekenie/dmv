![Build status](https://codeship.com/projects/411fa760-efb2-0133-4ce2-762d210387aa/status?branch=master
) [![Code Climate](https://codeclimate.com/github/zekenie/dmv/badges/gpa.svg)](https://codeclimate.com/github/zekenie/dmv) [![Dependency Status](https://gemnasium.com/badges/github.com/zekenie/dmv.svg)](https://gemnasium.com/github.com/zekenie/dmv)


# DMV

## Intro

DMV is a MEAN stack library that lets you define roles and permissions. It lets you express thoughts like:

_student_ can *read* **chapter**.
_teacher_ can *assign* **chapter**.

I like to think about the previous sentence like this


```
  [Role] can [Permission]
                  ^
                /   \
            [Verb] [Noun]
```

## Practical Example

We use DMV to register the roles and nouns:

```js
dmv.role('author');
dmv.role('moderator');
dmv.role('admin');

dmv.noun('article', function(articleNoun) {
  // by default the noun has crud verbs
  // we're adding the approve verb here
  articleNoun.verb('approve');

  // we say that admins can do all verbs
  articleNoun.authorize('admin', '*');

  // moderators can 
  articleNoun.authorize('moderator', ['approve', 'read']);

  // authors can
  articleNoun.authorize('author', ['create', 'update'])

});

dmv.noun('comment', function(commentNoun) {
  commentNoun.verb('approve');

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

userSchema.plugin(require('dmv/mongoosePlugin'));

mongoose.model('User', userSchema);

```

You can use your user instance's can method like this

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

sarah.can('create', 'article'); // => true
sarah.can('update', 'article'); // => true
sarah.can('delete', 'article'); // => false

alex.can('approve', 'article'); // true
alex.can('create', 'article');  // false

hilary.can('delete', 'article') // true
hilary.can('approve', 'article') // true

```

### Express


```js
const dmv = require('dmv');
const auth = require('dmv/expressMiddleware');

// articles router

// everyone can read all articles
router.get('/', controller.index);
router.post('/', auth.permits('create', 'article'), controller.create);

router.use('/:id', controller.load);

router.get('/:id', controller.read);


router.put('/:id', auth.permits('update', 'article'), controller.update);
router.delete('/:id', auth.permits('delete', 'article'), controller.delete);
```

Dmv's express middleware calls the `can` method on the `req.user` by default. If your application doesn't have a `req.user`, you can define another function to return a user object.

```js
auth.user(function(req, res) {
  return req.yourOtherUserObject;
});
```

If you have a router that really only concerns itself with one noun (like above), you can use `permitsFactory` to generate a version of permits that only works for one noun. That would look like this.

```js
const dmv = require('dmv');
const auth = dmv.expressMiddleware
const permits = auth.permitsFactory('article')

// articles router

// everyone can read all articles
router.get('/', controller.index);
router.post('/', permits('create'), controller.create);

// ...
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

You can call `can` on any of your user instances. In addition, we've added a `hasRole` method on your user class.

You need to tell dmv how to find your logged in user. We've exposed a method called `getUser` on our `authConfig` factory. The `getUser` method should return your user synchronously. You can inject your own angular services. You just need to return your user. The `getUser` method also attaches `can` and `hasRole` to your `$rootScope` so you can show and hide view segments easily.

```js
yourModule
  .run(function(authConfig) {
    // Note, ng-annotate and others won't annotate the dependencies for this method. So if you minify in your build process, you should annotate your own dependencies.
    authConfig.getUser(function(YourUserService, YourAuthService) {
      return YouAuthService.getLoggedInUser();
    })
  })
  
```

Then you can add a special `auth` property to your ui-router state definitions.

```js
yourModule
  .config(function($stateProvider) {
    $stateProvider
      .state('articles', {
        url: '/articles',
        template: 'everyone can see these great articles',
        auth: false // you could omit this, it just documents here
      })
      .state('new_article', {
        url: '/newarticle',
        template: 'form only for those who can write',
        auth: {
          create: 'article'
        }
      });

  }) 
```

The auth property can take a boolean, function or an object. If you pass `true` to auth it will ensure the user has logged in. An object lets you specify the nouns and verbs that the user must have access to to load the route. You can also pass auth a function. If you return true from that function, the user will be allowed to enter the state. The function's `this` is bound to the state change event. It is passed the `user` object and the `next` state.

Our module will broadcast a `NOT_AUTHORIZED` event on the root scope if a user goes to a route they are not authorized to see. We will broadcast a `NOT_AUTHENTICATED` event if a user that hasn't logged in attempts to see a route that has a truthy auth property.

With these events you can configure the behavior of failed route loads.

If you would like the auth property to be evaluated only after the user has been fetched asynchronously, you may pass a method that returns a Promise for your user to the `authConfig` via the `getUserAsync` method.

```js
yourModule
  .run(function(authConfig) {

    // optionally tell dmv how to get the user asynchronously
    authConfig.getUserAsync(function (YourUserService, YourAuthService) {
      return YourAuthService.getLoggedInUserAsync();
    })

    // you still must tell dmv how to get the user synchronously - it is required!
    authConfig.getUser(function(YourUserService, YourAuthService) {
      return YourAuthService.getLoggedInUser();
    })
  })
  
```
If an asynchronous method is present, `dmv` will use it to obtain the user before evaluating the auth property. Note any front-end caching is the responsibility of your Angular services - `dmv` will only expect to receive a Promise for the user.

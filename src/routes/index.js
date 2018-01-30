import React from 'react';
import UniversalRouter from 'universal-router/main.js';

// The list of all application routes where each route contains a URL path string (pattern),
// the list of components to load asynchroneously (chunks), data requirements (GraphQL query),
// and a render() function which shapes the result to be passed into the top-level (App) component.
// For more information visit https://github.com/kriasoft/universal-router
const routes = [
  {
    path: '',
    components: () => [import(/* webpackChunkName: 'home' */ './Home')],
    render: ({ user, components: [Home] }) => ({
      title: 'SocialCake',
      body: <Home user={user} />,
    }),
  },
  {
    path: '/account',
    components: () => [import(/* webpackChunkName: 'Account' */ './Account')],
    render: ({ user, components: [Account] }) => ({
      title: 'Upload File',
      body: <Account user={user} />,
    }),
  },
  {
    path: '/about',
    components: () => [import(/* webpackChunkName: 'about' */ './About')],
    render: ({ user, components: [About] }) => ({
      title: 'About Us • React Firebase Starter',
      body: <About user={user} />,
    }),
  },
  {
    path: '/privacy',
    components: () => [import(/* webpackChunkName: 'privacy' */ './Privacy')],
    render: ({ user, components: [Privacy] }) => ({
      title: 'Privacy Policy • React Firebase Starter',
      body: <Privacy user={user} />,
    }),
  },
  {
    path: '/upload',
    components: () => [import(/* webpackChunkName: 'upload' */ './Upload')],
    render: ({ user, components: [Upload] }) => ({
      title: 'Upload File',
      body: <Upload user={user} />,
    }),
  },
];

function resolveRoute(ctx) {
  const { route } = ctx;

  if (!route.render) {
    return ctx.next();
  }

  return Promise.all(route.components()).then(components =>
    ctx.render({
      user: ctx.user,
      location: ctx.location,
      route: route.render({
        user: ctx.user,
        location: ctx.location,
        components: components.map(x => x.default),
      }),
    }),
  );
}

export default new UniversalRouter(routes, { resolveRoute });

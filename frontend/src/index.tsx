import { initializeFaro } from '@grafana/faro-web-sdk';
import { injectDecoratorClientSide } from '@navikt/nav-dekoratoren-moduler';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router-dom';
import { App } from './app/app';
import { ENVIRONMENT } from './environment/environment';

const getFaroUrl = () => {
  if (ENVIRONMENT.isProduction) {
    return 'https://telemetry.nav.no/collect';
  }

  if (ENVIRONMENT.isDevelopment) {
    return 'https://telemetry.ekstern.dev.nav.no/collect';
  }

  return 'http://localhost:12347/collect';
};

initializeFaro({ url: getFaroUrl(), app: { name: 'klage-dittnav' } });

if (ENVIRONMENT.isLocal) {
  injectDecoratorClientSide({
    env: 'dev',
    simple: true,
    chatbot: true,
    redirectToApp: false,
    logoutUrl: '/oauth2/logout',
  });
}

Sentry.init({
  dsn: 'https://ec59cb6bad7f4a30be759b6cdfccc968@sentry.gc.nav.no/140',
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.reactRouterV6Instrumentation(
        useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes
      ),
    }),
  ],
  tracesSampleRate: 1.0,
  environment: ENVIRONMENT.environment,
  release: ENVIRONMENT.version,
  normalizeDepth: 10,
  enabled: ENVIRONMENT.isDeployed,
});

const container = document.getElementById('root');

if (container !== null) {
  const root = createRoot(container);
  root.render(<App />);
}

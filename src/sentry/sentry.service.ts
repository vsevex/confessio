import * as Sentry from "@sentry/node";

interface SentryConfig {
  nodeEnv: string;
  sentryTracesSampleRate: string;
}

export default class SentryService {
  constructor(sentryUrl: string, config: SentryConfig) {
    Sentry.init({
      dsn: sentryUrl,
      environment: config.nodeEnv,
      tracesSampleRate: parseFloat(config.sentryTracesSampleRate),
    });
  }

  captureException(error: Error): void {
    Sentry.captureException(error);
  }

  close(): Promise<boolean> {
    return Sentry.close();
  }
}

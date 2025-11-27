/**
 * @module logger
 * @description A centralized logging service.
 *
 * This service provides a wrapper around the console for logging messages.
 * It can be extended to integrate with a third-party logging service like Sentry,
 * Datadog, or LogRocket without changing the code that uses it.
 */

// In a real-world application, you would initialize your logging service here.
// For example, with Sentry:
// import * as Sentry from "@sentry/react";
// Sentry.init({
//   dsn: "YOUR_SENTRY_DSN",
// });


export const logger = {
  /**
   * Logs an error message.
   * @param {any} error - The error to log.
   * @param {Record<string, any>} context - Additional context to log with the error.
   */
  error: (error: any, context?: Record<string, any>) => {
    // In a real-world application, you would send the error to your logging service.
    // For example, with Sentry:
    // Sentry.withScope(scope => {
    //   if (context) {
    //     scope.setExtras(context);
    //   }
    //   Sentry.captureException(error);
    // });

    console.error("[ERROR]", error, context ? JSON.stringify(context) : "");
  },

  /**
   * Logs an informational message.
   * @param {string} message - The message to log.
   * @param {Record<string, any>} context - Additional context to log with the message.
   */
  info: (message: string, context?: Record<string, any>) => {
    // For example, with Sentry:
    // Sentry.captureMessage(message, { level: 'info', extra: context });
    console.log("[INFO]", message, context ? JSON.stringify(context) : "");
  },

  /**
   * Logs a warning message.
   * @param {string} message - The message to log.
   * @param {Record<string, any>} context - Additional context to log with the message.
   */
  warn: (message: string, context?: Record<string, any>) => {
    // For example, with Sentry:
    // Sentry.captureMessage(message, { level: 'warning', extra: context });
    console.warn("[WARN]", message, context ? JSON.stringify(context) : "");
  }
};

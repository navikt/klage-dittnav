import { isDevelopment } from '../environment';
import { v4 as uuidv4 } from 'uuid';
import { detect } from 'detect-browser';

const logCorrelation = uuidv4();

interface ValuePairs {
    [name: string]: string | number | boolean | object | undefined;
}

export function loggEvent(action: string, location: string, extraTags?: ValuePairs, fields?: ValuePairs) {
    if (!uselogger()) {
        return;
    }
    const event = {
        table: 'klage-dittnav',
        fields: { ...fields, logCorrelation: logCorrelation },
        tags: {
            action: action,
            location: location,
            ...extraTags
        }
    };
    window['frontendlogger'].event(
        event.table,
        emptyStringToUndefined(event.fields),
        emptyStringToUndefined(event.tags)
    );
}

export function loggInfo(message: string, fields?: ValuePairs) {
    const info = {
        message: message,
        ...fields
    };
    console.info(info);
    if (uselogger()) {
        window['frontendlogger'].info(info);
    }
}
export function loggWarning(error: Error, message?: string, fields?: ValuePairs, extraTagsLogEvent?: ValuePairs) {
    const browser = detect();
    const info = {
        message: `${message ? message + ': ' : ''} ${error.name} ${error.message}`,
        url: document.URL,
        error: error.stack,
        browser: (browser && browser.name) || undefined,
        ...fields
    };
    console.warn(info);
    if (uselogger()) {
        loggEvent('Warning', 'Logger', extraTagsLogEvent);
        window['frontendlogger'].warn(info);
    }
}

export function loggError(error: Error, message?: string, fields?: ValuePairs, extraTagsLogEvent?: ValuePairs) {
    const browser = detect();
    const info = {
        message: `${message ? message + ': ' : ''} ${error.name} ${error.message}`,
        url: document.URL,
        error: error.stack,
        browser: (browser && browser.name) || undefined,
        ...fields
    };
    console.error(info);
    if (uselogger()) {
        loggEvent('Error', 'Logger', extraTagsLogEvent);
        window['frontendlogger'].error(info);
    }
}

function frontendLoggerIsInitialized(): boolean {
    if (!window['frontendlogger']) {
        console.warn('frontend-logger not initialized properly');
        return false;
    }
    return true;
}

function uselogger(): boolean {
    return !isDevelopment && frontendLoggerIsInitialized();
}

function emptyStringToUndefined(valuePairs: ValuePairs) {
    return Object.keys(valuePairs).reduce(
        (acc: ValuePairs, key: string) => ({
            ...acc,
            [key]: valuePairs[key] === '' ? undefined : valuePairs[key]
        }),
        {}
    );
}

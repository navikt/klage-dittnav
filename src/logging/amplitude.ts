import amplitude from 'amplitude-js';
import { TemaKey } from '../tema/tema';

export enum PageIdentifier {
    KLAGESKJEMA_BEGRUNNElSE = 'KLAGESKJEMA_BEGRUNNElSE',
    KLAGESKJEMA_KVITTERING = 'KLAGESKJEMA_KVITTERING',
    KLAGESKJEMA_OPPSUMMERING = 'KLAGESKJEMA_OPPSUMMERING',
    INNGANG_INNSENDING_POST = 'INNGANG_INNSENDING_POST',
    INNGANG_INNSENDING_DIGITAL = 'INNGANG_INNSENDING_DIGITAL',
    INNGANG_HOVEDKATEGORIER = 'INNGANG_HOVEDKATEGORIER',
    INNGANG_KATEGORIER = 'INNGANG_KATEGORIER',
    NOT_FOUND = 'NOT_FOUND'
}

const APP_NAME = 'klage-dittnav';

enum AmplitudeEvent {
    PAGE_VIEW = 'sidevisning',
    RESUME_KLAGE = 'gjenoppta_klage'
}

const client = amplitude.getInstance();

client.init('default', '', {
    apiEndpoint: 'amplitude.nav.no/collect-auto',
    saveEvents: false,
    includeUtm: true,
    includeReferrer: true,
    platform: window.location.origin
});

interface PageViewEventData {
    page: PageIdentifier;
    temaKey?: TemaKey;
    title?: string;
}

interface ResumeKlageEventData {
    klageId: string;
    klageTemaKey: TemaKey;
    klageModifiedDate: string;
    klageFritekstLength: number;
    klageSelectedCheckboxes: number;
    klageHasSaksnummer: boolean;
    klageHasInternalSaksnummer: boolean;
    klageNumberOfVedlegg: number;
    klageHasVedtakDate: boolean;
    ytelse: string;
}

type EventData = {
    app: string;
    url: string;
};

async function logAmplitudeEvent<T>(eventName: AmplitudeEvent, eventProperties: T) {
    return await new Promise<void>((resolve, reject) => {
        const eventData: EventData & T = {
            ...eventProperties,
            app: APP_NAME,
            url: window.location.href
        };
        client.logEvent(eventName, eventData, responseCode => {
            if (responseCode === 200) {
                resolve();
                return;
            }
            reject();
            return;
        });
    });
}

export const logPageView = (page: PageIdentifier, temaKey?: TemaKey, title?: string) =>
    logAmplitudeEvent<PageViewEventData>(AmplitudeEvent.PAGE_VIEW, {
        page,
        title,
        temaKey
    });

export const logResumeKlage = (data: ResumeKlageEventData) => logAmplitudeEvent(AmplitudeEvent.RESUME_KLAGE, data);

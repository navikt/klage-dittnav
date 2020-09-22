import { Vedlegg } from './vedlegg';
import { Vedtak } from './vedtak';
import { dateStringToDate, formatDate } from '../utils/date-util';
import { datoValg } from '../components/begrunnelse/datoValg';

export interface KlageDraft {
    fritekst: string;
    tema: string;
    ytelse: string;
    vedtak: string;
    saksnummer?: string;
    vedlegg: Vedlegg[];
    journalpostId?: string;
    referrer?: string;
}

export interface Klage extends KlageDraft {
    readonly id: number;
}

export interface KlageSkjema {
    id?: number;
    fritekst: string;
    tema: string;
    ytelse: string;
    datoalternativ: string;
    vedtak?: string;
    vedtaksdato?: Date;
    saksnummer?: string;
    vedlegg: Vedlegg[];
    referrer?: string;
}

export const klageSkjemaBasedOnVedtak = (vedtak: Vedtak): KlageSkjema => ({
    fritekst: '',
    tema: vedtak.tema,
    ytelse: vedtak.ytelse,
    datoalternativ: '',
    saksnummer: vedtak.saksnummer,
    vedlegg: []
});

const getVedtaksDato = (klageSkjema: KlageSkjema): string => {
    const foundDatoAlternativ = datoValg.find(valg => valg.value === klageSkjema.datoalternativ);
    const { vedtaksdato } = klageSkjema;

    if (foundDatoAlternativ !== undefined) {
        return (
            foundDatoAlternativ.value +
            (foundDatoAlternativ.id === 'tidligereVedtak' ? ' - ' + formatDate(vedtaksdato) : '')
        );
    }

    if (vedtaksdato) {
        return datoValg.find(valg => valg.id === 'tidligereVedtak')?.value + ' - ' + formatDate(vedtaksdato);
    }

    return '';
};

export const klageSkjemaToKlageDraft = (klageSkjema: KlageSkjema): KlageDraft => ({
    fritekst: klageSkjema.fritekst,
    tema: klageSkjema.tema,
    ytelse: klageSkjema.ytelse,
    vedtak: getVedtaksDato(klageSkjema),
    saksnummer: klageSkjema.saksnummer,
    vedlegg: klageSkjema.vedlegg,
    referrer: klageSkjema.referrer
});

export const klageSkjemaToKlage = (klageSkjema: KlageSkjema): Klage => {
    if (typeof klageSkjema.id === 'undefined') {
        throw new Error("KlageSkjema is missing required property 'id'.");
    }
    return {
        id: klageSkjema.id,
        fritekst: klageSkjema.fritekst,
        tema: klageSkjema.tema,
        ytelse: klageSkjema.ytelse,
        vedtak: getVedtaksDato(klageSkjema),
        saksnummer: klageSkjema.saksnummer,
        vedlegg: klageSkjema.vedlegg,
        referrer: klageSkjema.referrer
    };
};

export const klageToKlageSkjema = (klage: Klage): KlageSkjema => ({
    id: klage.id,
    fritekst: klage.fritekst,
    tema: klage.tema,
    ytelse: klage.ytelse,
    datoalternativ: getDatoAlternativ(klage.vedtak),
    vedtak: klage.vedtak,
    vedtaksdato: vedtakToDate(klage.vedtak),
    saksnummer: klage.saksnummer,
    vedlegg: klage.vedlegg,
    referrer: klage.referrer
});

const vedtakToDate = (vedtak: string) => {
    if (vedtak.startsWith('Tidligere vedtak') && vedtak !== 'Tidligere vedtak - Ingen dato satt') {
        return dateStringToDate(vedtak.substr(19));
    }
    return undefined;
};

const getDatoAlternativ = (vedtak: string) => {
    if (vedtak.startsWith('Tidligere vedtak')) {
        return 'Tidligere vedtak';
    }
    if (vedtak.startsWith('Siste vedtak')) {
        return 'Siste vedtak';
    }
    return '';
};

import React, { useEffect, useRef, useState } from 'react';
import { RadioPanelGruppe, Textarea } from 'nav-frontend-skjema';
import {
    CenteredContainer,
    FlexCenteredContainer,
    Margin40Container,
    Margin48Container,
    Margin48TopContainer,
    MarginContainer,
    MarginTopContainer
} from '../../styled-components/main-styled-components';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Normaltekst, Undertittel, Element, Undertekst } from 'nav-frontend-typografi';
import { toFiles, VedleggFile, getVedleggErrorMessage } from '../../types/vedlegg';
import VedleggVisning from './vedlegg';
import { setKlageId, updateKlage } from '../../store/actions';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '../../store/reducer';
import { addVedleggToKlage, deleteVedlegg } from '../../services/fileService';
import AlertStripe, { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { DatoValg, datoValg } from './datoValg';
import { Datovelger } from 'nav-datovelger';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { logError } from '../../utils/logger/frontendLogger';
import { KlageSkjema } from '../../types/klage';

interface Props {
    next: () => void;
}

const Begrunnelse = (props: Props) => {
    const dispatch = useDispatch();
    const { activeKlage, activeKlageSkjema, activeVedlegg } = useSelector((state: Store) => state);

    const [activeBegrunnelse, setActiveBegrunnelse] = useState<string>(activeKlageSkjema.fritekst);
    const [activeDatoISO, setActiveDatoISO] = useState<string | null>(activeKlageSkjema.vedtak);
    const [datoalternativ, setDatoalternativ] = useState<DatoValg>(activeKlageSkjema.datoalternativ);
    const [vedleggLoading, setVedleggLoading] = useState<boolean>(false);
    const [vedleggFeilmelding, setVedleggFeilmelding] = useState<string>('');
    const [submitted, setSubmitted] = useState<boolean>(false);

    useEffect(() => {
        setDatoalternativ(activeKlageSkjema.datoalternativ);
        setActiveDatoISO(activeKlageSkjema.vedtak);
        setActiveBegrunnelse(activeKlageSkjema.fritekst);
        if (typeof activeKlage !== 'undefined') {
            dispatch(setKlageId(activeKlage.id.toString()));
        }
    }, [dispatch, activeKlage, activeKlageSkjema]);

    const INPUTDESCRIPTION =
        'Skriv inn hvilke endringer du ønsker i vedtaket, og beskriv hva du begrunner klagen med. Legg ved dokumenter som du mener kan være til støtte for klagen.';

    const fileInput = useRef<HTMLInputElement>(null);

    const handleAttachmentClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        fileInput.current?.click();
    };

    const uploadAttachment = async (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();

        if (typeof activeKlage === 'undefined') {
            return;
        }

        const files = event.target.files;
        if (files === null || files.length === 0) {
            return;
        }

        setVedleggLoading(true);
        setVedleggFeilmelding('');

        const uploads = Array.from(files).map(async file => {
            try {
                const vedlegg = await addVedleggToKlage(activeKlage.id, file);
                dispatch({
                    type: 'VEDLEGG_ADD_SUCCESS',
                    value: vedlegg
                });
            } catch (err) {
                logError(err);
                setVedleggFeilmelding(err.response.data.message);
            }
        });

        Promise.all(uploads).then(() => setVedleggLoading(false));
    };

    const removeAttachment = async (vedlegg: VedleggFile) => {
        setVedleggLoading(true);
        setVedleggFeilmelding('');
        try {
            await deleteVedlegg(vedlegg.klageId, vedlegg.id);
            dispatch({
                type: 'VEDLEGG_REMOVE',
                value: vedlegg
            });
            setVedleggLoading(false);
        } catch (err) {
            logError(err);
            setVedleggLoading(false);
        }
    };

    const submitBegrunnelseOgDato = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        setSubmitted(true);
        if (!validForm()) {
            return;
        }
        const klageSkjema: KlageSkjema = {
            ...activeKlageSkjema,
            fritekst: activeBegrunnelse,
            datoalternativ: datoalternativ,
            vedtak: activeDatoISO
        };
        dispatch({
            type: 'KLAGE_FORM_SET',
            klageSkjema
        });
        updateKlage(klageSkjema);
        props.next();
    };

    const validForm = () => validBegrunnelse() && validDatoalternativ();
    const validBegrunnelse = () => activeBegrunnelse !== null && activeBegrunnelse !== '';
    const validDatoalternativ = () => datoalternativ !== DatoValg.INGEN;

    const getFeilmeldinger = () => {
        const feilmeldinger: string[] = [];
        if (!validDatoalternativ()) {
            feilmeldinger.push('Du må velge hvilket vedtak du ønsker å klage på før du går videre.');
        }
        if (!validBegrunnelse()) {
            feilmeldinger.push('Du må skrive en begrunnelse før du går videre.');
        }
        return feilmeldinger;
    };

    return (
        <>
            {submitted && !validForm() && (
                <MarginContainer>
                    <AlertStripeFeil>
                        {getFeilmeldinger().map((feilmelding, index) => {
                            return (
                                <p className="no-margin" key={index}>
                                    {feilmelding}
                                </p>
                            );
                        })}
                    </AlertStripeFeil>
                </MarginContainer>
            )}

            <MarginContainer>
                <Undertittel>Hvilket vedtak gjelder klagen?</Undertittel>
            </MarginContainer>
            <MarginContainer>
                <RadioPanelGruppe
                    name="datoValg"
                    radios={datoValg}
                    checked={datoalternativ}
                    onChange={(_, value: DatoValg) => setDatoalternativ(value)}
                    feil={submitted && !validDatoalternativ() && 'Du må velge hvilket vedtak du ønsker å klage på.'}
                />
            </MarginContainer>

            {datoalternativ === DatoValg.TIDLIGERE_VEDTAK && (
                <MarginContainer>
                    <Element>Vedtaksdato (valgfritt)</Element>
                    <Datovelger
                        onChange={dateISO => setActiveDatoISO(dateISO ?? '')}
                        valgtDato={activeDatoISO ?? undefined}
                        visÅrVelger={true}
                        avgrensninger={{
                            maksDato: new Date().toISOString().substring(0, 10)
                        }}
                    />
                </MarginContainer>
            )}

            <Margin48Container className="override-overlay">
                <Undertittel>Begrunn klagen din</Undertittel>
                <Textarea
                    name="begrunnelse"
                    value={activeBegrunnelse}
                    description={INPUTDESCRIPTION}
                    placeholder="Skriv inn din begrunnelse her."
                    onChange={e => setActiveBegrunnelse(e.target.value)}
                    maxLength={0}
                    textareaClass="expanded-height"
                    feil={submitted && !validBegrunnelse() && 'Du må skrive en begrunnelse før du går videre.'}
                />
            </Margin48Container>

            <MarginContainer>
                <Undertittel>Vedlegg ({activeVedlegg.length || '0'})</Undertittel>

                <VedleggVisning vedlegg={toFiles(activeVedlegg)} deleteAction={vedlegg => removeAttachment(vedlegg)} />
                {vedleggLoading && (
                    <CenteredContainer>
                        <NavFrontendSpinner type={'XL'} />
                    </CenteredContainer>
                )}

                <MarginTopContainer className="override-overlay">
                    <Normaltekst>
                        Om du har ny eller oppdatert informasjon du ønsker å legge ved kan det lastes opp her.
                    </Normaltekst>
                    <MarginTopContainer>
                        <Normaltekst>
                            All informasjon du har sendt inn tidligere i denne saken vil følge med klagen din og trenger
                            ikke lastes opp på nytt.
                        </Normaltekst>
                    </MarginTopContainer>
                </MarginTopContainer>

                {vedleggFeilmelding !== '' && (
                    <MarginContainer>
                        <AlertStripeFeil>
                            <p className="no-margin">{getVedleggErrorMessage(vedleggFeilmelding)}</p>
                        </AlertStripeFeil>
                    </MarginContainer>
                )}
            </MarginContainer>

            <Margin40Container>
                <Knapp onClick={e => handleAttachmentClick(e)}>Last opp nytt vedlegg</Knapp>
                <input
                    type="file"
                    multiple
                    accept="image/png, image/jpeg, image/jpg, .pdf"
                    ref={fileInput}
                    onChange={e => {
                        uploadAttachment(e);
                        e.currentTarget.value = '';
                    }}
                    style={{ display: 'none' }}
                />
            </Margin40Container>

            <MarginContainer>
                <AlertStripe type="info" form="inline">
                    <Undertekst className="no-margin">
                        Filtyper som støttes: <b>PNG</b>, <b>JPEG</b>, og <b>PDF</b>.
                    </Undertekst>
                    <Undertekst>
                        Filstørrelsen kan ikke være større enn 8 MB, og total størrelse av alle vedlegg kan ikke være
                        større enn 32 MB.
                    </Undertekst>
                </AlertStripe>
            </MarginContainer>

            <Margin48TopContainer className="override-overlay">
                <FlexCenteredContainer>
                    <Hovedknapp className="row-element" onClick={event => submitBegrunnelseOgDato(event)}>
                        Gå videre
                    </Hovedknapp>
                </FlexCenteredContainer>
            </Margin48TopContainer>
        </>
    );
};

export default Begrunnelse;

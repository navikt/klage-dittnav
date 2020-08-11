import React, { useState, useRef, useEffect } from 'react';
import { Textarea, RadioPanelGruppe } from 'nav-frontend-skjema';
import {
    MarginContainer,
    FlexCenteredContainer,
    Margin48Container,
    Margin48TopContainer,
    Margin32TopContainer,
    MarginTopContainer
} from '../../styled-components/main-styled-components';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import { Normaltekst, Undertittel, Element } from 'nav-frontend-typografi';
import { VEDLEGG_STATUS, VedleggProps, toVedleggProps, VedleggErrorMessages } from '../../types/vedlegg';
import VedleggVisning from './vedlegg';
import { postNewKlage, updateKlage } from '../../store/actions';
import { useSelector, useDispatch } from 'react-redux';
import { Store } from '../../store/reducer';
import { addVedleggToKlage, deleteVedlegg } from '../../services/fileService';
import { klageSkjemaBasertPaaVedtak, KlageSkjema } from '../../types/klage';
import { toISOString } from '../../utils/date-util';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { datoValg } from './datoValg';
import { Datovelger } from 'nav-datovelger';
import NavFrontendSpinner from 'nav-frontend-spinner';

const Begrunnelse = (props: any) => {
    const dispatch = useDispatch();
    const { activeKlage, activeKlageSkjema, activeVedlegg } = useSelector((state: Store) => state);

    const [activeBegrunnelse, setActiveBegrunnelse] = useState<string>(activeKlageSkjema.fritekst ?? '');
    const [activeDatoISO, setActiveDatoISO] = useState<string>(
        activeKlageSkjema.vedtaksdatoobjekt ? toISOString(activeKlageSkjema.vedtaksdatoobjekt) : ''
    );
    const [datoalternativ, setDatoalternativ] = useState<string>(activeKlageSkjema.datoalternativ ?? '');
    const [vedleggLoading, setVedleggLoading] = useState<boolean>(false);
    const [vedleggFeilmelding, setVedleggFeilmelding] = useState<string>('');
    const [submitted, setSubmitted] = useState<boolean>(false);

    useEffect(() => {
        const erFamilieOgPensjonEnhet = (): boolean => {
            // TODO: Litt midlertidlig losning
            return ['foreldrepenger', 'engangsstonad', 'svangerskapspenger'].indexOf(props.ytelse) > -1;
        };

        if (!activeKlage || !activeKlage.id) {
            let klageskjema: KlageSkjema;
            if (props.chosenVedtak) {
                klageskjema = klageSkjemaBasertPaaVedtak(props.chosenVedtak);
                setActiveDatoISO(props.chosenVedtak.vedtaksdato);
            } else {
                klageskjema = {
                    fritekst: activeBegrunnelse,
                    ytelse: props.ytelse,
                    tema: erFamilieOgPensjonEnhet() ? 'FOR' : '',
                    enhetId: erFamilieOgPensjonEnhet() ? 'FOP' : '',
                    datoalternativ: datoalternativ,
                    referanse: ''
                };
                if (activeDatoISO !== '') {
                    klageskjema.vedtaksdatoobjekt = new Date(activeDatoISO);
                }
            }
            dispatch(postNewKlage(klageskjema));
        }
    }, [activeKlage, dispatch, activeBegrunnelse, activeDatoISO, datoalternativ, props.chosenVedtak, props.ytelse]);

    const INPUTDESCRIPTION =
        'Skriv inn hvilke endringer du ønsker i vedtaket, og beskriv hva du begrunner klagen med. Legg ved dokumenter som du mener kan være til støtte for klagen.';

    const fileInput = useRef<HTMLInputElement>(null);

    const handleAttachmentClick = (event: any) => {
        event.preventDefault();
        let node = fileInput.current;
        if (node) {
            node?.click();
        } else {
            return;
        }
    };

    const handleDatoalternativClick = (event: any, value: string) => {
        setDatoalternativ(value);
    };

    const uploadAttachment = (event: any) => {
        event.preventDefault();
        if (event.target.files.length > 0) {
            setVedleggLoading(true);
            setVedleggFeilmelding('');
        }
        for (let key of Object.keys(event.target.files)) {
            if (key !== 'length') {
                const formData = new FormData();
                const vedlegg = event.target.files[key];
                formData.append('vedlegg', vedlegg);

                addVedleggToKlage(activeKlage.id!!, formData)
                    .then(response => {
                        console.log(response);
                        dispatch({
                            type: 'VEDLEGG_ADD_SUCCESS',
                            value: { status: VEDLEGG_STATUS.OK, vedlegg: toVedleggProps(response.data) }
                        });
                        setVedleggLoading(false);
                    })
                    .catch(err => {
                        console.log(err);
                        setVedleggFeilmelding(err.response.data.message);
                        setVedleggLoading(false);
                    });
            }
        }
    };

    const removeAttachment = (vedlegg: VedleggProps) => {
        setVedleggLoading(true);
        setVedleggFeilmelding('');
        deleteVedlegg(vedlegg.vedlegg)
            .then(response => {
                console.log(response);
                dispatch({
                    type: 'VEDLEGG_REMOVE',
                    value: vedlegg
                });
                setVedleggLoading(false);
            })
            .catch(err => {
                console.log(err);
                setVedleggLoading(false);
            });
    };

    const submitBegrunnelseOgDato = (event: any) => {
        event.preventDefault();
        setSubmitted(true);
        if (!validForm()) {
            return;
        }
        dispatch(
            updateKlage({
                ...activeKlageSkjema,
                fritekst: activeBegrunnelse,
                datoalternativ: datoalternativ,
                vedtaksdatoobjekt: new Date(activeDatoISO)
            })
        );
        props.next();
    };

    const validForm = (): boolean => {
        return validBegrunnelse() && validDatoalternativ();
    };

    const validBegrunnelse = (): boolean => {
        return activeBegrunnelse !== null && activeBegrunnelse !== '';
    };

    const validDatoalternativ = (): boolean => {
        return datoalternativ !== '';
    };

    const getFeilmeldinger = (): string[] => {
        let feilmeldinger = [];
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
                        {getFeilmeldinger().map(feilmelding => {
                            return <p className="no-margin">{feilmelding}</p>;
                        })}
                    </AlertStripeFeil>
                </MarginContainer>
            )}

            {!props.chosenVedtak && (
                <>
                    <MarginContainer>
                        <Undertittel>Hvilket vedtak gjelder klagen?</Undertittel>
                    </MarginContainer>
                    <MarginContainer>
                        <RadioPanelGruppe
                            name="datoValg"
                            radios={datoValg}
                            checked={datoalternativ}
                            onChange={(event: any, value: string) => handleDatoalternativClick(event, value)}
                            feil={
                                submitted &&
                                !validDatoalternativ() &&
                                'Du må velge hvilket vedtak du ønsker å klage på.'
                            }
                        />
                    </MarginContainer>
                </>
            )}

            {datoalternativ === 'Tidligere vedtak' && (
                <MarginContainer>
                    <Element>Vedtaksdato (valgfritt)</Element>
                    <Datovelger
                        onChange={(dateISO: any) => setActiveDatoISO(dateISO)}
                        valgtDato={activeDatoISO}
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
                <VedleggVisning vedlegg={activeVedlegg} deleteAction={vedlegg => removeAttachment(vedlegg)} />
                {vedleggLoading && <NavFrontendSpinner type={'XL'} />}

                {vedleggFeilmelding !== '' && (
                    <MarginContainer>
                        <AlertStripeFeil>
                            <p className="no-margin">
                                {VedleggErrorMessages[vedleggFeilmelding] ?? vedleggFeilmelding}
                            </p>
                        </AlertStripeFeil>
                    </MarginContainer>
                )}
            </MarginContainer>

            <MarginContainer>
                <Knapp onClick={e => handleAttachmentClick(e)}>Last opp nytt vedlegg</Knapp>
                <input
                    type="file"
                    multiple
                    accept="image/png, image/jpeg, image/jpg, .pdf"
                    id="uploadbutton"
                    ref={fileInput}
                    onChange={e => {
                        uploadAttachment(e);
                        e.currentTarget.value = '';
                    }}
                    style={{ display: 'none' }}
                />
            </MarginContainer>
            <MarginContainer>
                <Knapp onClick={e => handleAttachmentClick(e)}>Last opp nytt vedlegg</Knapp>
                <input
                    type="file"
                    multiple
                    accept="image/png, image/jpeg, image/jpg, .pdf"
                    id="uploadbutton"
                    ref={fileInput}
                    onChange={e => uploadAttachment(e)}
                    style={{ display: 'none' }}
                />
            </MarginContainer>

            <Margin32TopContainer className="override-overlay">
                <Normaltekst>
                    Om du har ny eller oppdatert informasjon du ønsker å legge ved kan det lastes opp her.
                </Normaltekst>
                <MarginTopContainer>
                    <Normaltekst>
                        All informasjon du har sendt inn tidligere i denne saken vil følge med klagen din og trenger
                        ikke lastes opp på nytt.
                    </Normaltekst>
                </MarginTopContainer>
            </Margin32TopContainer>

            <Margin48TopContainer className="override-overlay">
                <FlexCenteredContainer>
                    <Hovedknapp className="row-element" onClick={(event: any) => submitBegrunnelseOgDato(event)}>
                        Gå videre
                    </Hovedknapp>
                </FlexCenteredContainer>
            </Margin48TopContainer>
        </>
    );
};

export default Begrunnelse;

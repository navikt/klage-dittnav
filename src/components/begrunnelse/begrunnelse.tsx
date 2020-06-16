import React, { useState, useRef, useReducer, useEffect } from 'react';
import { Textarea } from 'nav-frontend-skjema';
import {
    MarginContainer,
    ContainedContent,
    CenteredContainer,
    FlexCenteredContainer
} from '../../styled-components/main-styled-components';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import godt_bilde_guide from '../../assets/images/godt_bilde_guide.svg';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { VEDLEGG_STATUS, VedleggProps } from '../../types/vedlegg';
import VedleggVisning from './vedlegg';
import { postNewKlage, updateKlage } from '../../store/actions';
import { useSelector } from 'react-redux';
import { Store } from '../../store/reducer';
import { addVedleggToKlage } from '../../services/fileService';

const ACTION_ADD = 'add';
const ACTION_REMOVE = 'remove';

const ekspanderbartPanelTittel = (
    <Normaltekst>
        Ønsker du å legge ved et bilde? Av en legeerklæring eller lignende? Les denne veiledningen først.
    </Normaltekst>
);

const Begrunnelse = (props: any) => {
    const { activeKlage } = useSelector((state: Store) => state);
    const [activeBegrunnelse, setActiveBegrunnelse] = useState<string>(props.activeBegrunnelse ?? '');
    const [activeVedlegg, dispatch] = useReducer((activeVedlegg: VedleggProps[], { type, value }: any) => {
        switch (type) {
            case ACTION_ADD:
                return [...activeVedlegg, value];
            case ACTION_REMOVE:
                const vIndex = activeVedlegg.indexOf(value);
                return activeVedlegg.filter((_: any, index: number) => index !== vIndex);
            default:
                return activeVedlegg;
        }
    }, []);

    useEffect(() => {
        postNewKlage(activeKlage);
        if (props.activeVedtak) {
            updateKlage({
                ...activeKlage,
                ...props.activeVedtak
            });
        }
    }, [activeKlage, props.activeVedtak]);

    const INPUTDESCRIPTION =
        'Gjør rede for hvilken endring du ønsker i vedtaket, og beskriv hva du begrunner klagen med. Legg ved erklæringer eller bevis som du mener kan være til støtte for klagen.';

    const fileInput = useRef<HTMLInputElement>(null);

    const handleClick = (event: any) => {
        event.preventDefault();
        let node = fileInput.current;
        if (node) {
            node?.click();
        } else {
            return;
        }
    };

    const uploadAttachment = (event: any) => {
        event.preventDefault();
        for (let key of Object.keys(event.target.files)) {
            if (key !== 'length') {
                const formData = new FormData();
                const vedlegg = event.target.files[key];
                formData.append('tittel', vedlegg.name);
                formData.append('content', vedlegg);

                addVedleggToKlage(activeKlage.id!!, formData)
                    .then(response => {
                        console.log(response);
                        dispatch({ type: ACTION_ADD, value: { status: VEDLEGG_STATUS.OK, file: vedlegg } });
                    })
                    .catch(err => {
                        console.log(err);
                        dispatch({
                            type: ACTION_ADD,
                            value: { status: VEDLEGG_STATUS.ERROR, message: 'error', file: vedlegg }
                        });
                    });
            }
        }
    };

    const removeAttachment = (vedlegg: VedleggProps) => {
        dispatch({ type: ACTION_REMOVE, value: vedlegg });
    };

    const submitBegrunnelse = (event: any) => {
        event.preventDefault();
        updateKlage({
            ...activeKlage,
            fritekst: activeBegrunnelse
        });
        props.next();
    };

    return (
        <form onSubmit={(event: any) => submitBegrunnelse(event)}>
            <Undertittel>Begrunn din klage</Undertittel>
            <Textarea
                name="begrunnelse"
                value={activeBegrunnelse}
                description={INPUTDESCRIPTION}
                placeholder="Skriv inn din begrunnelse her."
                onChange={e => setActiveBegrunnelse(e.target.value)}
                maxLength={0}
                textareaClass="expanded-height"
            />
            <MarginContainer>
                <Undertittel>Vedlegg</Undertittel>
                <MarginContainer>
                    <Knapp onClick={e => handleClick(e)}>Last opp nytt vedlegg</Knapp>
                    <input
                        type="file"
                        multiple
                        accept="image/png, .pdf"
                        id="uploadbutton"
                        ref={fileInput}
                        onChange={e => uploadAttachment(e)}
                        style={{ display: 'none' }}
                    />
                </MarginContainer>
                <Normaltekst>
                    Om du har ny eller oppdatert informasjon du ønsker å legge ved kan det lastes opp her.
                </Normaltekst>
                <br />
                <Normaltekst>
                    All informasjon du har sendt inn tidligere i denne saken vil følge med klagen din og trenger ikke
                    lastes opp på nytt.
                </Normaltekst>
            </MarginContainer>

            <MarginContainer>
                <Ekspanderbartpanel tittel={ekspanderbartPanelTittel}>
                    <ContainedContent>
                        <img src={godt_bilde_guide} alt="Slik tar du et godt bilde" />
                    </ContainedContent>
                </Ekspanderbartpanel>
            </MarginContainer>
            <VedleggVisning vedlegg={activeVedlegg} deleteAction={vedlegg => removeAttachment(vedlegg)} />

            <MarginContainer>
                <CenteredContainer>
                    <FlexCenteredContainer>
                        <Knapp className="row-element" onClick={() => props.previous()}>
                            Tilbake
                        </Knapp>
                        <Hovedknapp className="row-element">Gå videre</Hovedknapp>
                    </FlexCenteredContainer>
                </CenteredContainer>
            </MarginContainer>
        </form>
    );
};

export default Begrunnelse;

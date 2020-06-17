import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import InformationPointBox from '../general/information-point-box';
import { formatDate } from '../../utils/date-util';
import { PointsFlexListContainer } from '../../styled-components/main-styled-components';
import {Klage} from "../../types/klage";

const VEDTAK_OPPLYSNINGER_POINTS = [
    { displayName: 'Tema', content: (klage: Klage) => <Normaltekst>{klage.tema || ''}</Normaltekst> },
    {
        displayName: 'Vedtaksdato',
        content: (klage: Klage) => <Normaltekst>{formatDate(klage.vedtaksdato)}</Normaltekst>
    },
    { displayName: 'Enhet', content: (klage: Klage) => <Normaltekst>{klage.enhetId}</Normaltekst> },
    { displayName: 'NAV-referanse', content: (klage: Klage) => <Normaltekst>{klage.referanse}</Normaltekst> }
];

interface Props {
    klage: Klage;
}

const VedtakSummary = (props: Props) => {
    return (
        <PointsFlexListContainer>
            {VEDTAK_OPPLYSNINGER_POINTS.map(point => {
                return (
                    <InformationPointBox
                        key={point.displayName}
                        header={point.displayName}
                        info={point.content(props.klage)}
                    />
                );
            })}
        </PointsFlexListContainer>
    );
};

export default VedtakSummary;

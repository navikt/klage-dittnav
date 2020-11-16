import React from 'react';
import { Systemtittel, Normaltekst, Sidetittel, Undertittel } from 'nav-frontend-typografi';
import Veilederpanel from 'nav-frontend-veilederpanel';
import VeilederIcon from '../../assets/Veileder.svg';
import { INNGANG_KATEGORIER } from '../../kategorier/kategorier';
import { KlageFlexLinkPanel } from '../../link/link';
import { PageIdentifier } from '../../logging/amplitude';
import { useLogPageView } from '../../logging/use-log-page-view';
import { Margin40TopContainer, Margin40Container, PointsFlexListContainer } from '../../styled-components/common';

const InngangHovedkategorier = () => {
    useLogPageView(PageIdentifier.INNGANG_HOVEDKATEGORIER);
    return (
        <section>
            <div>
                <Margin40TopContainer>
                    <Sidetittel>Klage eller anke på vedtak</Sidetittel>
                </Margin40TopContainer>

                <Margin40TopContainer>
                    <Veilederpanel type={'plakat'} kompakt svg={<img src={VeilederIcon} alt="Veileder" />}>
                        <Normaltekst>
                            Hvis NAV har behandlet en sak som gjelder deg og du er uenig i vedtaket, har du flere
                            valgmuligheter for å belyse saken bedre og få en ny vurdering. Start med å velge hvilket
                            tema saken gjelder. Du finner denne informasjonen i vedtaket som du har mottatt fra NAV.
                        </Normaltekst>
                    </Veilederpanel>
                </Margin40TopContainer>

                <Margin40Container>
                    <Systemtittel>Hvilket tema gjelder det?</Systemtittel>
                </Margin40Container>
            </div>
            <PointsFlexListContainer>{getLinks()}</PointsFlexListContainer>
        </section>
    );
};

const getLinks = () =>
    INNGANG_KATEGORIER.map(({ title, path, beskrivelse }) => (
        <KlageFlexLinkPanel key={title} href={`/${path}`} border>
            <div>
                <Undertittel className="lenkepanel__heading">{title}</Undertittel>
                <Normaltekst>{beskrivelse}</Normaltekst>
            </div>
        </KlageFlexLinkPanel>
    ));

export default InngangHovedkategorier;

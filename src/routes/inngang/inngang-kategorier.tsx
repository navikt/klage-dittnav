import React from 'react';
import { Sidetittel, Systemtittel, Undertittel } from 'nav-frontend-typografi';
import { InngangKategori } from '../../kategorier/kategorier';
import { Margin40Container, Margin40TopContainer, PointsFlexListContainer } from '../../styled-components/common';
import { PageIdentifier } from '../../logging/amplitude';
import { useLogPageView } from '../../logging/use-log-page-view';
import { KlageFlexLinkPanel } from '../../link/link';

interface Props {
    inngangkategori: InngangKategori;
}

const InngangKategorier = ({ inngangkategori }: Props) => {
    useLogPageView(PageIdentifier.INNGANG_KATEGORIER);
    return (
        <section>
            <div>
                <Margin40TopContainer>
                    <Sidetittel>{inngangkategori.title}</Sidetittel>
                </Margin40TopContainer>
                <Margin40Container>
                    <Systemtittel>Hvilken tjeneste eller ytelse gjelder det?</Systemtittel>
                </Margin40Container>
            </div>
            <PointsFlexListContainer>{getLinks(inngangkategori)}</PointsFlexListContainer>
        </section>
    );
};

const getLinks = ({ kategorier, path }: InngangKategori) =>
    kategorier.map(kategori => (
        <KlageFlexLinkPanel key={kategori.title} href={`/${path}/${kategori.path}`} border>
            <div>
                <Undertittel className="lenkepanel__heading">{kategori.title}</Undertittel>
            </div>
        </KlageFlexLinkPanel>
    ));

const arePropsEqual = (prevProps: Props, nextProps: Props) => prevProps.inngangkategori === nextProps.inngangkategori;

export default React.memo(InngangKategorier, arePropsEqual);

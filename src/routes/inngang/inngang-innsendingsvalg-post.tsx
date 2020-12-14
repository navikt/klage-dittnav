import React from 'react';
import styled from 'styled-components/macro';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { LenkepanelBase } from 'nav-frontend-lenkepanel';
import Veileder from 'nav-frontend-veileder';
import LetterOpened from '../../icons/LetterOpenedIcon';
import { IconContainer, LenkePanelContentWithImage, MarginTopContainer } from '../../styled-components/common';
import { useLogPageView } from '../../logging/use-log-page-view';
import { PageIdentifier } from '../../logging/amplitude';
import { TemaKey, Tema } from '../../tema/tema';
import { getUrlToPaperForm } from '../../tema/ytelse';
import VeilederIcon from '../../icons/VeilederIcon';
import { InngangMainContainer } from '../../styled-components/main-container';
import { ContentContainer } from '../../styled-components/content-container';
import { ExternalLink } from '../../link/link';
import { CenteredPageTitle } from '../../styled-components/page-title';
import { WhiteSection } from '../../styled-components/white-section';
import { CenteredSectionTitle } from '../../styled-components/section-title';
import { PageParagraph } from '../../styled-components/page-paragraph';
import { InlineRow } from '../../styled-components/row';
import { usePageInit } from '../../page-init/page-init';
import { InngangKategori } from '../../kategorier/kategorier';
import { Breadcrumb, useBreadcrumbs } from '../../breadcrumbs/use-breadcrumbs';

interface Props {
    temaKey: TemaKey;
    title?: string;
    inngangkategori: InngangKategori;
}

const InngangInnsendingPost = ({ temaKey, title = Tema[temaKey], inngangkategori }: Props) => {
    useLogPageView(PageIdentifier.INNGANG_INNSENDING_POST, temaKey, title);
    usePageInit(`${title} \u2013 klage eller anke`);
    const breadcrumbs: Breadcrumb[] = [
        {
            title: inngangkategori.title,
            url: `/${inngangkategori.path}`,
            handleInApp: true
        }
    ];
    useBreadcrumbs(breadcrumbs, title);

    const paperUrl = getUrlToPaperForm(temaKey);

    return (
        <InngangMainContainer>
            <ContentContainer>
                <CenteredPageTitle>{title}</CenteredPageTitle>
                <WhiteSection>
                    <CenteredSectionTitle>Innsending via post</CenteredSectionTitle>
                    <VeilederContainer fargetema={'info'}>
                        <VeilederIcon />
                    </VeilederContainer>
                    <PageParagraph>
                        Klage eller anke på denne tjenesten krever at du må du sende inn via post. Veiviseren hjelper
                        deg med utfylling av en førsteside og klageskjema. Dette må du skrive ut ut og sende inn til den
                        adressen som står på førstesiden, sammen med kopi av eventuelle andre dokumenter eller
                        kvitteringer.
                    </PageParagraph>
                    <InlineRow>
                        <LenkepanelBase href={paperUrl} border>
                            <LenkePanelContentWithImage>
                                <IconContainer>
                                    <LetterOpened />
                                </IconContainer>
                                <div>
                                    <Systemtittel className="lenkepanel__heading">Skjema for klager</Systemtittel>
                                    <MarginTopContainer>
                                        <Normaltekst>
                                            Dette velger du når du skal klage på et vedtak du har fått fra NAV.
                                        </Normaltekst>
                                    </MarginTopContainer>
                                </div>
                            </LenkePanelContentWithImage>
                        </LenkepanelBase>
                    </InlineRow>
                    Les mer om{' '}
                    <ExternalLink href="https://www.nav.no/no/nav-og-samfunn/kontakt-nav/klage-ris-og-ros/klagerettigheter">
                        dine klagerettigheter på våre tema-sider
                    </ExternalLink>
                    . Du kan se{' '}
                    <ExternalLink href="https://www.nav.no/no/nav-og-samfunn/kontakt-nav/klage-ris-og-ros/klagerettigheter">
                        forventet saksbehandlingstid for klage og anke
                    </ExternalLink>{' '}
                    i egen oversikt.
                </WhiteSection>
            </ContentContainer>
        </InngangMainContainer>
    );
};

const VeilederContainer = styled(Veileder)`
    && {
        margin-bottom: 32px;
    }
`;

const arePropsEqual = (prevProps: Props, nextProps: Props) =>
    prevProps.temaKey === nextProps.temaKey && prevProps.title === nextProps.title;

export default React.memo(InngangInnsendingPost, arePropsEqual);

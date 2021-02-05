import React, { useMemo } from 'react';
import { useLocation } from 'react-router';
import queryString from 'query-string';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { LenkepanelBase } from 'nav-frontend-lenkepanel';
import LetterOpened from '../../icons/LetterOpenedIcon';
import { IconContainer, LenkePanelContentWithImage, MarginTopContainer } from '../../styled-components/common';
import MobilePhone from '../../icons/MobilePhoneIcon';
import MobilePhoneIdCard from '../../icons/MobilePhoneIdCardIcon';
import { useLogPageView } from '../../logging/use-log-page-view';
import { PageIdentifier } from '../../logging/amplitude';
import { ExternalLink, KlageLinkPanel } from '../../link/link';
import { TemaKey } from '../../tema/tema';
import { InngangMainContainer } from '../../styled-components/main-container';
import { ContentContainer } from '../../styled-components/content-container';
import { CenteredPageTitle } from '../../styled-components/page-title';
import { WhiteSection } from '../../styled-components/white-section';
import { InlineRow } from '../../styled-components/row';
import { usePageInit } from '../../page-init/page-init';
import { InngangKategori } from '../../kategorier/kategorier';
import { Breadcrumb, useBreadcrumbs } from '../../breadcrumbs/use-breadcrumbs';
import LawBook from '../../icons/LawBook';
import { klageFormUrl } from '../../kategorier/kategorier';
import { useTitleOrYtelse } from '../../language/titles';

interface Props {
    temaKey: TemaKey;
    titleKey: string | null;
    ytelse: string | null;
    internalSaksnummer?: string | null;
    inngangkategori?: InngangKategori | null;
    digitalKlageFullmakt?: boolean;
    allowsAnke?: boolean;
    mailKlageUrl?: string;
    mailAnkeUrl?: string;
}

const InngangInnsendingDigital = ({
    temaKey,
    titleKey,
    ytelse,
    internalSaksnummer = null,
    inngangkategori = null,
    digitalKlageFullmakt,
    allowsAnke,
    mailKlageUrl,
    mailAnkeUrl
}: Props) => {
    useLogPageView(PageIdentifier.INNGANG_INNSENDING_DIGITAL, temaKey, titleKey ?? ytelse ?? temaKey);
    const title = useTitleOrYtelse(temaKey, titleKey, ytelse);
    usePageInit(`${title} \u2013 klage eller anke`);
    const breadcrumbs = useMemo(() => getBreadcrumbs(inngangkategori), [inngangkategori]);
    useBreadcrumbs(breadcrumbs, title);

    return (
        <InngangMainContainer>
            <ContentContainer>
                <CenteredPageTitle>{title}</CenteredPageTitle>

                <WhiteSection>
                    <DigitalContent
                        temaKey={temaKey}
                        titleKey={titleKey}
                        ytelse={ytelse}
                        saksnummer={internalSaksnummer}
                        digitalKlageFullmakt={digitalKlageFullmakt ?? false}
                    />
                    <InlineRow>
                        <LenkepanelBase href={mailKlageUrl ?? klageFormUrl} target="_blank" border>
                            <LenkePanelContentWithImage>
                                <IconContainer>
                                    <LetterOpened />
                                </IconContainer>
                                <div>
                                    <Systemtittel className="lenkepanel__heading">Klage via post</Systemtittel>
                                    <MarginTopContainer>
                                        <Normaltekst>
                                            Klageskjema som sendes inn via post. Også for deg som skal klage på vegne av
                                            andre.
                                        </Normaltekst>
                                    </MarginTopContainer>
                                </div>
                            </LenkePanelContentWithImage>
                        </LenkepanelBase>
                    </InlineRow>
                    {allowsAnke && (
                        <InlineRow>
                            <LenkepanelBase href={mailAnkeUrl ?? klageFormUrl} target="_blank" border>
                                <LenkePanelContentWithImage>
                                    <IconContainer>
                                        <LawBook />
                                    </IconContainer>
                                    <div>
                                        <Systemtittel className="lenkepanel__heading">Innsending av anke</Systemtittel>
                                        <MarginTopContainer>
                                            <Normaltekst>
                                                For å sende inn en anke fyller du ut et skjema som sendes via post.
                                            </Normaltekst>
                                        </MarginTopContainer>
                                    </div>
                                </LenkePanelContentWithImage>
                            </LenkepanelBase>
                        </InlineRow>
                    )}
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

interface DigitalContentProps {
    temaKey: TemaKey;
    titleKey: string | null;
    ytelse: string | null;
    saksnummer: string | null;
    digitalKlageFullmakt: boolean;
}

const DigitalContent = ({ temaKey, titleKey, ytelse, saksnummer, digitalKlageFullmakt }: DigitalContentProps) => {
    const { search } = useLocation();
    if (saksnummer === null) {
        const query = queryString.parse(search);
        saksnummer = getQueryValue(query.saksnummer);
    }
    const query = queryString.stringify(
        {
            tema: temaKey,
            tittel: titleKey,
            ytelse,
            saksnummer
        },
        {
            skipNull: true
        }
    );

    return (
        <>
            <InlineRow>
                <KlageLinkPanel href={`/ny?${query}`} border>
                    <LenkePanelContentWithImage>
                        <IconContainer>
                            <MobilePhone />
                        </IconContainer>
                        <div>
                            <Systemtittel className="lenkepanel__heading">Klage digitalt</Systemtittel>
                            <MarginTopContainer>
                                <Normaltekst>For å sende inn digitalt må du logge inn med elektronisk ID.</Normaltekst>
                            </MarginTopContainer>
                        </div>
                    </LenkePanelContentWithImage>
                </KlageLinkPanel>
                <ExternalLink href="https://www.norge.no/elektronisk-id" showIcon>
                    Slik skaffer du deg elektronisk ID
                </ExternalLink>
            </InlineRow>
            {digitalKlageFullmakt && (
                <InlineRow>
                    <KlageLinkPanel href={`${window.location.pathname}/fullmakt`} border>
                        <LenkePanelContentWithImage>
                            <IconContainer>
                                <MobilePhoneIdCard />
                            </IconContainer>
                            <div>
                                <Systemtittel className="lenkepanel__heading">Klage på vegne av andre</Systemtittel>
                                <MarginTopContainer>
                                    <Normaltekst>
                                        Digital innsending av klage når du har fullmakt på vegne av andre.
                                    </Normaltekst>
                                </MarginTopContainer>
                            </div>
                        </LenkePanelContentWithImage>
                    </KlageLinkPanel>
                    <ExternalLink href="https://www.nav.no/soknader/nb/person/diverse/fullmaktskjema" showIcon>
                        Slik gir du fullmakt til andre
                    </ExternalLink>
                </InlineRow>
            )}
        </>
    );
};

function getBreadcrumbs(inngangkategori: InngangKategori | null): Breadcrumb[] {
    if (inngangkategori === null) {
        return [];
    }

    return [
        {
            title: inngangkategori.title,
            url: `/${inngangkategori.path}`,
            handleInApp: true
        }
    ];
}

function getQueryValue(queryValue: string | string[] | null | undefined) {
    if (typeof queryValue === 'string' && queryValue.length !== 0) {
        return queryValue;
    }
    return null;
}

const arePropsEqual = (prevProps: Props, nextProps: Props) =>
    prevProps.temaKey === nextProps.temaKey &&
    prevProps.internalSaksnummer === nextProps.internalSaksnummer &&
    prevProps.titleKey === nextProps.titleKey &&
    prevProps.ytelse === nextProps.ytelse;

export default React.memo(InngangInnsendingDigital, arePropsEqual);

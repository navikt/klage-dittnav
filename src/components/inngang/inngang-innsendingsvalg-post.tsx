import { Normaltekst, Sidetittel, Systemtittel } from 'nav-frontend-typografi';
import React from 'react';
import LetterOpened from '../../assets/images/icons/LetterOpened';
import {
    CenterInMobileContainer,
    Margin40Container,
    MarginTopContainer,
    WhiteBackgroundContainer
} from '../../styled-components/main-styled-components';
import { Tema, TemaKey } from '../../types/tema';
import { LenkepanelBase } from 'nav-frontend-lenkepanel';
import Lenke from 'nav-frontend-lenker';
import { getUrlToPaperForm } from '../../types/ytelse';
import { useLogPageView } from '../../utils/logger/use-log-page-view';
import { PageIdentifier } from '../../utils/logger/amplitude';

interface Props {
    temaKey: TemaKey;
    title?: string;
}

const InngangInnsendingPost = ({ temaKey, title = Tema[temaKey] }: Props) => {
    useLogPageView(PageIdentifier.INNGANG_INNSENDING_POST, temaKey, title);
    const paperUrl = getUrlToPaperForm(temaKey);

    return (
        <div>
            <CenterInMobileContainer>
                <Sidetittel>{title}</Sidetittel>
            </CenterInMobileContainer>

            <WhiteBackgroundContainer>
                <Margin40Container>
                    <Systemtittel>Innsending via post</Systemtittel>
                    <MarginTopContainer>
                        <Normaltekst>
                            Klage eller anke på denne tjenesten krever at du må du sende inn via post. Veiviseren
                            hjelper deg med utfylling av en førsteside og klageskjema. Dette må du skrive ut ut og sende
                            inn til den adressen som står på førstesiden, sammen med kopi av eventuelle andre dokumenter
                            eller kvitteringer.
                        </Normaltekst>
                    </MarginTopContainer>
                </Margin40Container>
                <Margin40Container>
                    <LenkepanelBase href={paperUrl} border>
                        <div className="lenkepanel-content-with-image">
                            <div className="icon-container">
                                <LetterOpened />
                            </div>
                            <div>
                                <Systemtittel className="lenkepanel__heading">Skjema for klager</Systemtittel>
                                <MarginTopContainer>
                                    <Normaltekst>
                                        Dette velger du når du skal klage på et vedtak du har fått fra NAV.
                                    </Normaltekst>
                                </MarginTopContainer>
                            </div>
                        </div>
                    </LenkepanelBase>
                </Margin40Container>

                <div>
                    Les mer om{' '}
                    <Lenke
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://www.nav.no/no/nav-og-samfunn/kontakt-nav/klage-ris-og-ros/klagerettigheter"
                    >
                        dine klagerettigheter på våre tema-sider
                    </Lenke>
                    .
                </div>
            </WhiteBackgroundContainer>
        </div>
    );
};

export default InngangInnsendingPost;

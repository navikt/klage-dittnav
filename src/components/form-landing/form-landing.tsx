import React, { useState, useEffect } from 'react';
import { Vedtak } from '../../types/vedtak';
import { useDispatch, useSelector } from 'react-redux';
import {
    checkAuth,
    getExistingKlage,
    postNewKlage,
    setKlageId,
    setStorageContent,
    setValgtTema,
    setValgtYtelse
} from '../../store/actions';
import { Store } from '../../store/reducer';
import { logError, logInfo } from '../../utils/logger/frontendLogger';
import { queryToVedtak } from '../../mock-api/get/vedtak';
import MainFormPage from '../../pages/form-landing-page/main-form-page';
import Error from '../../components/error/error';
import queryString from 'query-string';
import * as H from 'history';
import { AxiosError } from 'axios';
import { getReferrer, getTemaObject } from '../../services/klageService';
import { KlageSkjema } from '../../types/klage';
import { getResumeState } from '../../utils/get-resume-state';
import { DatoValg } from '../begrunnelse/datoValg';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { CenteredContainer } from '../../styled-components/main-styled-components';
import NotFoundPage from '../../pages/not-found/not-found-page';

interface Props {
    query: queryString.ParsedQuery<string>;
    location: H.Location;
    path: string;
}

const FormLanding = (props: Props) => {
    const dispatch = useDispatch();
    const { loading, chosenTema, chosenYtelse, getKlageError, klageId, activeKlage } = useSelector(
        (state: Store) => state
    );

    const [chosenVedtak, setChosenVedtak] = useState<Vedtak>();
    const [temaNotSet, setTemaNotSet] = useState<boolean>(false);
    const [isLoadingDraft, setIsLoadingDraft] = useState<boolean>(true);
    const [errorState, setErrorState] = useState<boolean>(false);

    useEffect(() => {
        dispatch(checkAuth(props.location.search));

        const { klageId, tema, ytelse, saksnummer } = getResumeState(
            props.location.search,
            sessionStorage,
            props.location.pathname
        );
        setStorageContent(klageId, tema, ytelse, saksnummer);

        if (ytelse !== null) {
            dispatch(setValgtYtelse(ytelse));
        }
        if (tema !== null) {
            dispatch(setValgtTema(tema));
        }

        if (klageId !== null) {
            dispatch(setKlageId(klageId));
            setIsLoadingDraft(false);
        } else if (ytelse !== null && tema !== null) {
            const klageSkjema: KlageSkjema = {
                id: null,
                ytelse,
                tema,
                saksnummer: saksnummer,
                datoalternativ: DatoValg.INGEN,
                vedtak: null,
                fritekst: '',
                vedlegg: [],
                referrer: getReferrer()
            };
            dispatch(postNewKlage(klageSkjema));
            setIsLoadingDraft(false);
        } else if (tema !== null) {
            getTemaObject(tema)
                .then(temaObject => {
                    dispatch(setValgtYtelse(ytelse ?? temaObject.value));
                    setIsLoadingDraft(false);
                })
                .catch((err: AxiosError) => {
                    if (err.response?.status === 404) {
                        setErrorState(true);
                        setIsLoadingDraft(false);
                        return;
                    }
                    logError(err);
                });
        } else {
            setIsLoadingDraft(false);
        }

        if (
            typeof klageId !== 'undefined' &&
            klageId !== null &&
            klageId.length !== 0 &&
            typeof activeKlage === 'undefined'
        ) {
            dispatch(getExistingKlage(klageId));
        }

        const vedtak = queryToVedtak(props.query);
        if (vedtak !== null) {
            setChosenVedtak(vedtak);
        }

        setTemaNotSet(chosenTema === null);
    }, [dispatch, props.location.search, props.location.pathname, props.query, chosenTema, klageId, activeKlage]);

    useEffect(() => {
        const { klageId, tema, ytelse, saksnummer } = getResumeState(
            props.location.search,
            sessionStorage,
            props.location.pathname
        );
        setStorageContent(klageId, tema, ytelse, saksnummer);

        if (ytelse !== null) {
            dispatch(setValgtYtelse(ytelse));
        }
        if (tema !== null) {
            dispatch(setValgtTema(tema));
        }

        if (klageId !== null) {
            dispatch(setKlageId(klageId));
            setIsLoading(false);
        } else if (ytelse !== null && tema !== null) {
            const klageSkjema: KlageSkjema = {
                id: null,
                ytelse,
                tema,
                saksnummer: saksnummer,
                datoalternativ: DatoValg.INGEN,
                vedtak: null,
                fritekst: '',
                vedlegg: [],
                referrer: getReferrer()
            };
            dispatch(postNewKlage(klageSkjema));
            setIsLoading(false);
        } else if (tema !== null) {
            getTemaObject(tema)
                .then(temaObject => {
                    dispatch(setValgtYtelse(ytelse ?? temaObject.value));
                    setIsLoading(false);
                })
                .catch((err: AxiosError) => {
                    if (err.response?.status === 404) {
                        setErrorState(true);
                        setIsLoading(false);
                        return;
                    }
                    logError(err);
                });
        } else {
            setIsLoading(false);
        }
    }, [dispatch, props.location.search, props.location.pathname]);

    logInfo('Form landing page visited.', { chosenYtelse: chosenYtelse, referrer: document.referrer });

    if (loading || isLoadingDraft) {
        return (
            <CenteredContainer>
                <NavFrontendSpinner type={'XL'} />
            </CenteredContainer>
        );
    }

    if (errorState) {
        return <NotFoundPage />;
    }

    if (temaNotSet) {
        logInfo('Form landing page visited with no tema.', { referrer: document.referrer });
        return (
            <Error
                error={{
                    code: 400,
                    text:
                        'Ytelse du ønsker å klage på er ikke spesifisert. Dersom du navigerer til denne siden via en lenke på Ditt NAV vil ytelse bli satt riktig.'
                }}
            />
        );
    } else if (getKlageError) {
        logInfo('Form landing page visited, get klage failed.', { referrer: document.referrer });
        return (
            <Error
                error={{
                    code: 400,
                    text: 'Klagen du ba om kan ikke hentes. Prøv på nytt fra lenken på Ditt NAV.'
                }}
            />
        );
    }

    return <MainFormPage path={props.path} ytelse={chosenYtelse} chosenVedtak={chosenVedtak} />;
};

export default FormLanding;

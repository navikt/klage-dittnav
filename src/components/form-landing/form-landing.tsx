import React, { useState, useEffect } from 'react';
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
import MainFormPage from '../../pages/main-form-page/main-form-page';
import Error from '../../components/error/error';
import { AxiosError } from 'axios';
import { getTemaObject } from '../../services/klageService';
import { KlageSkjema } from '../../types/klage';
import { getResumeState } from '../../utils/get-resume-state';
import { DatoValg } from '../begrunnelse/datoValg';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { CenteredContainer } from '../../styled-components/main-styled-components';
import NotFoundPage from '../../pages/not-found/not-found-page';
import { useLocation } from 'react-router-dom';

const FormLanding = () => {
    const location = useLocation();
    const dispatch = useDispatch();
    const { loading, chosenTema, chosenYtelse, getKlageError, klageId, activeKlage } = useSelector(
        (state: Store) => state
    );

    const [temaNotSet, setTemaNotSet] = useState<boolean>(false);
    const [isLoadingDraft, setIsLoadingDraft] = useState<boolean>(true);
    const [errorState, setErrorState] = useState<boolean>(false);

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    useEffect(() => {
        const { klageId, tema, ytelse, saksnummer } = getResumeState(
            location.search,
            sessionStorage,
            location.pathname
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
                vedlegg: []
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

        setTemaNotSet(chosenTema === null);
    }, [dispatch, location.search, location.pathname, chosenTema, klageId, activeKlage]);

    useEffect(() => {
        if (typeof klageId !== 'undefined' && klageId.length !== 0 && typeof activeKlage === 'undefined') {
            dispatch(getExistingKlage(klageId));
        }
    }, [dispatch, klageId, activeKlage]);

    logInfo('Form landing page visited.', { chosenYtelse: chosenYtelse });

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
        logInfo('Form landing page visited with no tema.');
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
        logInfo('Form landing page visited, get klage failed.');
        return (
            <Error
                error={{
                    code: 400,
                    text: 'Klagen du ba om kan ikke hentes. Prøv på nytt fra lenken på Ditt NAV.'
                }}
            />
        );
    }

    return <MainFormPage path={location.pathname} />;
};

export default FormLanding;

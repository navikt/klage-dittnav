import React, { useEffect } from 'react';
import PersonligeOpplysningerSummary from '../../components/summary/personlige-opplysninger-summary';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from '../../store/reducer';
import { checkAuth } from '../../store/actions';
import NavFrontendSpinner from 'nav-frontend-spinner';
import { MarginContainer, CenteredContainer } from '../../styled-components/main-styled-components';
import { Hovedknapp } from 'nav-frontend-knapper';

const PersonligeOpplysningerPage = (props: any) => {
    const dispatch = useDispatch();
    const { loading, person } = useSelector((state: Store) => state);

    useEffect(() => {
        dispatch(checkAuth());
    }, [dispatch]);

    if (loading) {
        return <NavFrontendSpinner type={'XL'} />;
    }

    return (
        <>
            <PersonligeOpplysningerSummary person={person} />
            <MarginContainer>
                <CenteredContainer>
                    <Hovedknapp onClick={() => props.next()}>Gå videre</Hovedknapp>
                </CenteredContainer>
            </MarginContainer>
        </>
    );
};

export default PersonligeOpplysningerPage;

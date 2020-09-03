import React, { useEffect, useState } from 'react';
import InngangInfoBox from '../../components/skjema-inngang/inngang-info-box';
import { Margin80TopContainer } from '../../styled-components/main-styled-components';
import queryString from 'query-string';
import { setReferrer } from '../../store/actions';
import { useDispatch } from 'react-redux';
import { getBruker } from '../../services/userService';
import { useHistory } from 'react-router-dom';
import WithLoading from '../../components/general/loading/withLoading';

const SkjemaInngang = (props: any) => {
    const history = useHistory();
    const dispatch = useDispatch();

    const query = queryString.parse(props.location.search);
    const [loading, setLoading] = useState<boolean>(true);

    getBruker()
        .then(() => {
            history.push(`/klage${props.location.search}`);
            setLoading(false);
        })
        .catch(err => {
            console.log('User is not logged in');
            setLoading(false);
        });

    useEffect(() => {
        dispatch(setReferrer(document.referrer ?? ''));
    }, [dispatch]);

    return (
        <Margin80TopContainer>
            <WithLoading loading={loading}>
                <InngangInfoBox query={query} />
            </WithLoading>
        </Margin80TopContainer>
    );
};

export default SkjemaInngang;

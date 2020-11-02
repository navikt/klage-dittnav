import React, { useState, useEffect } from 'react';
import Kvittering from '../../components/kvittering/kvittering';
import { useSelector } from 'react-redux';
import { Store } from '../../store/reducer';
import KvitteringLoading from '../../components/kvittering/kvitteringLoading';
import { getJournalpostId } from '../../services/klageService';
import { Redirect } from 'react-router-dom';
import { logError } from '../../utils/logger/frontendLogger';

const KvitteringPage = () => {
    const [waitingForJoark, setWaitingForJoark] = useState<boolean>(true);
    const [informStillWorking, setInformStillWorking] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [journalPostId, setJournalPostId] = useState<string>('');

    const { activeKlage } = useSelector((state: Store) => state);

    useEffect(() => {
        let waitingJoark = true;

        // Melding om at den fortsatt jobber etter 8 sek
        setTimeout(() => {
            setInformStillWorking(true);
        }, 8000);

        // Gi opp med å vente på journalpost-ID etter 15 sek
        setTimeout(() => {
            waitingJoark = false;
        }, 15000);

        const waitForJournalpostId = (klageId: string | number) => {
            getJournalpostId(klageId)
                .then(response => {
                    if (response === '') {
                        if (waitingJoark) {
                            // Spør etter journalpost-ID hvert sekund
                            setTimeout(() => waitForJournalpostId(klageId), 1000);
                        } else {
                            setWaitingForJoark(false);
                        }
                    } else {
                        setSuccess(true);
                        setWaitingForJoark(false);
                        setJournalPostId(response);
                        waitingJoark = false;
                    }
                })
                .catch(err => logError(err));
        };

        if (waitingForJoark && typeof activeKlage !== 'undefined') {
            waitForJournalpostId(activeKlage.id);
        }
    }, [waitingForJoark, activeKlage]);

    if (typeof activeKlage === 'undefined') {
        return <Redirect to="/" />;
    } else {
        if (waitingForJoark || activeKlage.finalizedDate === null) {
            return <KvitteringLoading informStillWorking={informStillWorking} />;
        } else {
            return (
                <Kvittering
                    klageId={activeKlage.id}
                    journalPostId={journalPostId}
                    finalizedDate={activeKlage.finalizedDate}
                    success={success}
                />
            );
        }
    }
};

export default KvitteringPage;

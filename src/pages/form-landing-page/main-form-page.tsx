import React, { useState } from 'react';
import { Vedtak } from '../../types/vedtak';
import BegrunnelsePage from '../begrunnelse/begrunnelse-page';
import { routesStepsIkkeValgtVedtak, routesStepsValgtVedtak } from '../../utils/routes.config';
import { MarginContainer } from '../../styled-components/main-styled-components';
import Steps from '../../components/steps/steps';
import OppsummeringSkjemaPage from '../oppsummering-skjema-page/oppsummering-skjema-page';
import { useHistory } from 'react-router-dom';

interface Props {
    path: string;
    chosenVedtak?: Vedtak;
    ytelse: string;
}

const MainFormPage = (props: Props) => {
    const history = useHistory();

    const activeRoutes = props.chosenVedtak ? routesStepsValgtVedtak : routesStepsIkkeValgtVedtak;

    const stepFromPath = (path: string) => activeRoutes.find(route => route.path === path)?.step ?? 0;
    const [activeStep, setActiveStep] = useState<number>(stepFromPath(props.path));

    const activeRoute = activeRoutes[activeStep];

    window.onbeforeunload = function () {
        return 'Your work will be lost.';
    };

    const chooseStep = (step: number) => setActiveStep(step);

    const next = () => {
        history.push(activeRoutes[activeStep + 1].path);
        setActiveStep(activeStep + 1);
    };

    const previous = () => {
        history.push(activeRoutes[activeStep - 1].path);
        setActiveStep(activeStep - 1);
    };

    return (
        <>
            <MarginContainer>
                <Steps activeRoutes={activeRoutes} activeStep={activeStep} chooseStep={chooseStep} />
            </MarginContainer>
            <MarginContainer>
                {activeRoute.label === 'Begrunnelse' && (
                    <BegrunnelsePage
                        ytelse={props.ytelse}
                        chosenVedtak={props.chosenVedtak}
                        next={() => next()}
                        previous={() => previous()}
                    />
                )}
                {activeRoute.label === 'Oppsummering' && <OppsummeringSkjemaPage previous={previous} />}
            </MarginContainer>
        </>
    );
};

export default MainFormPage;

import React from 'react';
import Stegindikator from 'nav-frontend-stegindikator';
import { StegindikatorStegProps } from 'nav-frontend-stegindikator/lib/stegindikator-steg';
import { KlageStatus } from '../../klage/klage';
import { Row } from '../../styled-components/row';

interface Props {
    klageStatus: KlageStatus;
    activeStep: number;
}

export const stepLabels = ['Begrunnelse', 'Oppsummering', 'Kvittering'];

const Steps = ({ klageStatus, activeStep }: Props) => {
    const klageIsDone = klageStatus === KlageStatus.DONE;

    const formSteps: StegindikatorStegProps[] = [
        {
            index: 0,
            label: stepLabels[0],
            aktiv: true,
            ferdig: klageIsDone,
            disabled: klageIsDone
        },
        {
            index: 1,
            label: stepLabels[1],
            aktiv: true,
            ferdig: klageIsDone,
            disabled: false
        },
        {
            index: 2,
            label: stepLabels[2],
            aktiv: true,
            ferdig: false,
            disabled: !klageIsDone
        }
    ];

    return (
        <Row>
            <Stegindikator steg={formSteps} aktivtSteg={activeStep} autoResponsiv kompakt />
        </Row>
    );
};

const propsAreEqual = (prevProps: Props, nextProps: Props): boolean =>
    prevProps.activeStep === nextProps.activeStep && prevProps.klageStatus === nextProps.klageStatus;

export default React.memo(Steps, propsAreEqual);

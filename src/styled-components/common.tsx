import styled from 'styled-components/macro';
import FileFC from 'forhandsvisningsfil';
import { Normaltekst } from 'nav-frontend-typografi';
import { device } from './media-queries';

export const CenteredContainer = styled.div`
    text-align: center;
`;

export const MarginTopContainer = styled.div`
    margin-top: 16px;
    width: 100%;
    display: inline-block;
`;

export const MarginContainer = styled.div`
    margin-top: 16px;
    margin-bottom: 16px;
    width: 100%;
`;

export const SpaceBetweenFlexListContainer = styled.div`
    display: flex;
    justify-content: space-between;
    flex-flow: row wrap;
`;

export const FlexWithSpacingContainer = styled.div`
    display: flex;
    flex-flow: row wrap;

    > * {
        margin-right: 10px;
    }

    @media ${device.mobileS} {
        > *:last-child {
            margin-right: 10px;
        }
    }
    @media ${device.mobileL} {
        > *:last-child {
            margin-right: 0;
        }
    }
`;

export const FlexCenteredOnMobile = styled(FlexWithSpacingContainer)`
    @media ${device.mobileS} {
        justify-content: center;
    }
    @media ${device.mobileL} {
        justify-content: flex-start;
    }
`;

export const CenteredOnMobile = styled.div`
    @media ${device.mobileS} {
        text-align: center;
    }
    @media ${device.mobileL} {
        text-align: initial;
    }
`;

export const FileFlexItem = styled(FileFC)`
    margin-right: 25px;
    margin-bottom: 25px;

    @media ${device.mobileS} {
        &:last-child {
            margin-right: 25px;
        }
    }
    @media ${device.mobileL} {
        &:last-child {
            margin-right: 0px;
        }
    }

    .deleteLink {
        svg {
            width: 20px;
            > path {
                stroke: #ba3a26;
            }
        }
    }
`;

export const WrapNormaltekst = styled(Normaltekst)`
    white-space: pre-line;
    word-break: break-all;
`;

export const IconContainer = styled.div`
    margin-right: 0;
    margin-bottom: 2rem;

    @media ${device.mobileL} {
        margin-right: 2rem;
        margin-bottom: 0;
    }
`;

export const LenkePanelContentWithImage = styled.div`
    padding: 0.5rem 1rem;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    justify-content: center;

    svg {
        display: block;
        width: 60px;
        height: 80px;
    }

    @media ${device.tablet} {
        padding: 2rem 2.5rem 2rem 2rem;
    }

    @media ${device.mobileL} {
        padding: 0.5rem 2rem;
        justify-content: initial;
        flex-wrap: nowrap;
    }
`;

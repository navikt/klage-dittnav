import React from 'react';
import { VEDLEGG_STATUS, VedleggProps } from '../../types/vedlegg';
import { getDeleteVedleggUrl } from '../../clients/apiUrls';
import Check from '../../assets/images/Check';
import Cross from '../../assets/images/Cross';
import Bin from '../../assets/images/Bin';
import Lenke from 'nav-frontend-lenker';

interface Props {
    vedlegg: VedleggProps[];
    deleteAction: (vedlegg: VedleggProps) => void;
}

const VedleggVisning = (props: Props) => {
    if (props.vedlegg.length === 0) {
        return null;
    }

    const deleteVedlegg = (event: any, vedlegg: VedleggProps) => {
        event.preventDefault();
        if (!vedlegg.id) {
            props.deleteAction(vedlegg);
            return;
        }
        // TODO: Change when klageid is known
        fetch(getDeleteVedleggUrl(1, vedlegg.id), {
            method: 'DELETE'
        })
            .then(result => {
                console.log(result);
                props.deleteAction(vedlegg);
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <table className="tabell">
            <thead>
                <tr>
                    <th>Fil</th>
                    <th>Status</th>
                    <th>Melding</th>
                    <th>Slett</th>
                </tr>
            </thead>
            <tbody>
                {Array.from(props.vedlegg).map((vedlegg: VedleggProps, index: number) => (
                    <tr key={index}>
                        <td>{vedlegg.file.name}</td>
                        <td>{vedlegg.status === VEDLEGG_STATUS.OK ? <Check /> : <Cross />}</td>
                        <td>{vedlegg.message}</td>
                        <td>
                            <Lenke className="no-style" href={'#'} onClick={(e: any) => deleteVedlegg(e, vedlegg)}>
                                <Bin />
                            </Lenke>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default VedleggVisning;

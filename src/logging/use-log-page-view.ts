import { useEffect } from 'react';
import { TemaKey } from '../tema/tema';
import { logPageView, PageIdentifier } from './amplitude';

export function useLogPageView(page: PageIdentifier, temaKey?: TemaKey, title?: string) {
    useEffect(() => {
        logPageView(page, temaKey, title);
    }, [page, temaKey, title]);
}

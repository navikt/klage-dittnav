import FetchMock, { Middleware } from 'yet-another-fetch-mock';
import {
    getKlagerUrl,
    getAddKlageUrl,
    getUserDataUrl,
    getVedtakUrl,
    getTemaerUrl,
    getAddVedleggUrl
} from '../clients/apiUrls';
import { KLAGER } from './get/klager';
import { withDelayedResponse } from '../utils/fetch-utils';
import faker from 'faker/locale/nb_NO';
import navfaker from 'nav-faker';
import { okPerson } from './get/bruker';
import { okVedtak } from './get/vedtak';
import { TEMAER } from './get/temaer';
import {okVedlegg} from "./get/vedlegg";

const STATUS_OK = () => 200;

const loggingMiddleware: Middleware = (request, response) => {
    return response;
};

function randomDelay() {
    if (navfaker.random.vektetSjanse(0.05)) {
        return faker.random.number(5000);
    }
    return faker.random.number(750);
}

function setupGetKlager(mock: FetchMock) {
    mock.get(
        getKlagerUrl(),
        withDelayedResponse(randomDelay(), STATUS_OK, () => KLAGER)
    ); // Returns the object as the json-response
}

function setupGetPerson(mock: FetchMock) {
    mock.get(
        getUserDataUrl(),
        withDelayedResponse(randomDelay(), STATUS_OK, () => okPerson)
    );
}

function setupGetTemaer(mock: FetchMock) {
    mock.get(
        getTemaerUrl(),
        withDelayedResponse(randomDelay(), STATUS_OK, () => TEMAER)
    );
}

function setupGetVedtak(mock: FetchMock) {
    mock.get(
        getVedtakUrl(),
        withDelayedResponse(randomDelay(), STATUS_OK, () => okVedtak)
    );
}

function addKlageToLocalStorage(request: any): any {
    let klagerRaw = localStorage.getItem('klager');
    let klager = [];
    if (klagerRaw) {
        klager = JSON.parse(klagerRaw);
    }
    klager.push(request.body);
    localStorage.setItem('klager', JSON.stringify(klager));
    return request.body;
}

function setupPostKlage(mock: FetchMock) {
    mock.post(
        getAddKlageUrl(),
        withDelayedResponse(randomDelay(), STATUS_OK, request => addKlageToLocalStorage(request))
    ); // Returns the object as the json-response
}

function setupPostVedlegg(mock: FetchMock) {
    mock.post(
        getAddVedleggUrl(1),
        withDelayedResponse(randomDelay(), STATUS_OK, () => okVedlegg)
    );
}

function setup() {
    const mock = FetchMock.configure({
        enableFallback: true, // default: true
        middleware: loggingMiddleware // default: (req, resp) => resp
    });
    return mock;
}

export function setupMockPerson() {
    const mock = setup();
    setupGetPerson(mock);
    setupGetVedtak(mock);
}

export function setupMock() {
    const mock = setup();
    setupGetPerson(mock);
    setupGetKlager(mock);
    setupGetVedtak(mock);
    setupPostKlage(mock);
    setupGetTemaer(mock);
    setupPostVedlegg(mock);
}

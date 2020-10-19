export enum Tema {
    AAP = 'Arbeidsavklaringspenger',
    AAR = 'Aa-registeret',
    AGR = 'Ajourhold - Grunnopplysninger',
    BAR = 'Barnetrygd',
    BID = '1 - Bidrag',
    BII = '2 - Bidrag innkreving',
    BIL = 'Bil',
    DAG = 'Dagpenger',
    ENF = 'Enslig forsørger',
    ERS = 'Erstatning',
    FAR = 'Farskap',
    FEI = 'Feilutbetaling',
    FOR = 'Foreldre- og svangerskapspenger',
    FOS = 'Forsikring',
    FRI = 'Kompensasjon selvstendig næringsdrivende/frilansere',
    FUL = 'Fullmakt',
    GEN = 'Generell',
    GRA = 'Gravferdsstønad',
    GRU = 'Grunn- og hjelpestønad',
    HEL = 'Helsetjenester og ort. hjelpemidler',
    HJE = 'Hjelpemidler',
    IAR = 'Inkluderende Arbeidsliv ',
    IND = 'Individstønad',
    KLA = 'Klage/Anke',
    KNA = 'Kontakt NAV',
    KOM = 'Kommunale tjenester',
    KON = 'Kontantstøtte',
    KTR = 'Kontroll',
    LGA = 'Lønnsgaranti',
    MED = 'Medlemskap',
    MOB = 'Mob.stønad',
    MOT = '3 - Skanning',
    OKO = 'Økonomi',
    OMS = 'Omsorgspenger, Pleiepenger og opplæringspenger',
    OPA = 'Oppfølging - Arbeidsgiver',
    OPP = 'Oppfølging',
    OVR = '4 - Øvrig',
    PEN = 'Pensjon',
    PER = 'Permittering og masseoppsigelser',
    REH = 'Rehabilitering',
    REK = 'Rekruttering og Stilling',
    RPO = 'Retting av personopplysninger',
    RVE = 'Rettferdsvederlag',
    SAA = 'Sanksjon - Arbeidsgiver',
    SAK = 'Saksomkostning',
    SAP = 'Sanksjon - Person',
    SER = 'Serviceklager',
    SIK = 'Sikkerhetstiltak',
    STO = 'Regnskap/utbetaling',
    SUP = 'Supplerende stønad',
    SYK = 'Sykepenger',
    SYM = 'Sykemeldinger',
    TIL = 'Tiltak',
    TRK = 'Trekkhåndtering',
    TRY = 'Trygdeavgift  ',
    TSO = 'Tilleggsstønad',
    TSR = 'Tilleggsstønad arbeidssøkere',
    UFM = 'Unntak fra medlemskap',
    UFO = 'Uføretrygd',
    UKJ = 'Ukjent',
    VEN = 'Ventelønn',
    YRA = 'Yrkesrettet attføring',
    YRK = 'Yrkesskade / Menerstatning'
}

export enum TemaKey {
    AAP = 'AAP',
    AAR = 'AAR',
    AGR = 'AGR',
    BAR = 'BAR',
    BID = 'BID',
    BII = 'BII',
    BIL = 'BIL',
    DAG = 'DAG',
    ENF = 'ENF',
    ERS = 'ERS',
    FAR = 'FAR',
    FEI = 'FEI',
    FOR = 'FOR',
    FOS = 'FOS',
    FRI = 'FRI',
    FUL = 'FUL',
    GEN = 'GEN',
    GRA = 'GRA',
    GRU = 'GRU',
    HEL = 'HEL',
    HJE = 'HJE',
    IAR = 'IAR',
    IND = 'IND',
    KLA = 'KLA',
    KNA = 'KNA',
    KOM = 'KOM',
    KON = 'KON',
    KTR = 'KTR',
    LGA = 'LGA',
    MED = 'MED',
    MOB = 'MOB',
    MOT = 'MOT',
    OKO = 'OKO',
    OMS = 'OMS',
    OPA = 'OPA',
    OPP = 'OPP',
    OVR = 'OVR',
    PEN = 'PEN',
    PER = 'PER',
    REH = 'REH',
    REK = 'REK',
    RPO = 'RPO',
    RVE = 'RVE',
    SAA = 'SAA',
    SAK = 'SAK',
    SAP = 'SAP',
    SER = 'SER',
    SIK = 'SIK',
    STO = 'STO',
    SUP = 'SUP',
    SYK = 'SYK',
    SYM = 'SYM',
    TIL = 'TIL',
    TRK = 'TRK',
    TRY = 'TRY',
    TSO = 'TSO',
    TSR = 'TSR',
    UFM = 'UFM',
    UFO = 'UFO',
    UKJ = 'UKJ',
    VEN = 'VEN',
    YRA = 'YRA',
    YRK = 'YRK'
}

export const TEMA_KEYS = Object.values(TemaKey);

export const getYtelseByTema = (temaKey: TemaKey | string | null): Tema | null => {
    const ensuredTemaKey = ensureStringIsTema(temaKey);
    if (ensuredTemaKey === null) {
        return null;
    }
    return Tema[ensuredTemaKey];
};

export const ensureStringIsTema = (potentialTemaKey: string | null): TemaKey | null => {
    if (potentialTemaKey === null) {
        return null;
    }
    return TEMA_KEYS.find(temaKey => temaKey === potentialTemaKey) ?? null;
};

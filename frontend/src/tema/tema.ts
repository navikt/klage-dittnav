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
  YRK = 'YRK',
}

const TEMA_KEYS = Object.values(TemaKey);

export const ensureStringIsTema = (potentialTemaKey: string | null): TemaKey | null => {
  if (potentialTemaKey === null) {
    return null;
  }

  return TEMA_KEYS.find((temaKey) => temaKey === potentialTemaKey) ?? null;
};

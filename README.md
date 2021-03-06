# Klageskjema

Frontend for klageskjema som legges ut på [klage.nav.no](https://klage.nav.no).

## Hvordan kommer bruker seg til en digital klage?

Det er to måter for en bruker å komme seg til en digital klage på.
Enten via klageløsningens egen inngang eller sendt direkte til klageskjemaet fra en annen tjeneste.

### Klageløsningen sin egen inngang

Brukere kan navigere seg frem til riktig tema og tittel/ytelse via [klage.nav.no](https://klage.nav.no).
Innlogging kreves ikke før bruker forsøker å gå til klageskjemaet.

```
https://klage.nav.no
```

### Direkte lenke

Brukere kan være logget inn i en tjeneste som har nødvendig informasjon for å sende brukeren direkte til klageskjemaet, f.eks. en vedtaksløsning (selvbetjeningsløsning).

1. Bruker ser vedtak i selvbetjeningsløsning.
2. Bruker trykker på knappen `Klag på vedtak`.
3. Bruker sendes til klageskjema.

For å lenke direkte til klageskjemaet må `tema` være satt i URLen som query parametere.

`tittel` må være en nøkkel som kan oversettes til tekst av klageløsningen. Om `tittel` ikke er satt faller den tilbake på `tema`.

I tillegg til `tema` og `tittel` kan `saksnummer` også settes i query.
`saksnummer` settes i klagen, men bruker kan **ikke** endre det. Saksnummer er valgfritt.

Eksempel på en fullstendig URL til klageskjema:

```
https://klage.nav.no/ny?tema=FOR&tittel=NAV_LOVEN_14A&saksnummer=12345
```

#### Legge til ny tittel

Om ingen av titlene som støttes passer deres behov er det mulig å opprette en PR i `klage-dittnav-api`-prosjektet eller kontakte teamet på Slack i kanalen `#team-digital-klage`.

> Merk at alle titler må legges inn på norsk og engelsk.

### Fullmakt

Det er også støtte for å oppgi fullmaktsgiver i URLen med query-parameteret `fullmaktsgiver` sammen med de andre parameterne.

Dette parameteret må være fødselsnummeret til personen som har gitt fullmakten til brukeren som skal sende inn klagen (fullmaktsgiver).

Om fullmakten ikke er gyldig blir bruker møtt med en feilmelding. Om fullmakten er gyldig vil bruker få en tydelig infoboks gjennom hele skjemaet om at de klager på vegne av den andre.

Ved hjelp av dette parameteret kan vi i tillegg gi brukere muligheten til å klage på vegne av fullmaktsgiver gjennom et GUI.

Under visse ytelser vil inngangen for klage gi bruker muligheten til å trykke på en knapp "Klage på vegne av andre" som tar bruker til en skjerm der de kan skrive inn fødselsnummer. Når de trykker søk vil systemet enten:

1. Bekrefte at bruker har fullmakt fra person med oppgitt fødselsnummer. Da kan bruker gå videre til skjemaet der `fullmaktsgiver`-queryen automatisk blir satt til oppgitt fødselsnummer.
2. Ikke bekrefte og gi bruker en feilmelding. Ingen informasjon rundt oppgitt fødselsnummer blir vist til bruker.

## Fortsette på påbegynt klage

Når brukere oppretter klager ved å gå til klageskjemaet, men ikke sender inn klagene, blir de liggende som uferdige klager.

Dersom en bruker går til klageskjemaet med samme parametere igjen senere, vil bruker fortsette på den uferdige klagen.

### Permanente lenker til klageskjemaer

Alle klager blir opprettet med en unik ID som vises i URLen. Dvs. at en bruker kan ta vare på lenken til en spesifikk klage og bruke den senere.

Klager som ikke er sendt inn vil kunne redigeres og sendes inn.

Klager som er sendt inn vil kun vise en oppsummering og lenke til innsendt klage som PDF.

> Vedlegg vil være en del av PDFen og ikke eksistere som frittstående filer etter klagen er innsendt.

## Miljøer

-   `PREPROD`: https://klage.dev.nav.no
-   `PROD`: https://klage.nav.no

## Utvikling

Front end for klageskjema som skal legges ut på DittNAV.

### Kjøre lokalt

```
npm install
```

#### Dev server

```
npm start
```

#### Lokal kjøring med Node.js backend

Dette er den eneste måten Dekoratøren laster.

```
npm run build
cd server
node server.js
```

### Kjøre med docker-compose

Kjøre med mock:

```
docker-compose up
```

Kjøre mot reell backend lokalt (og sørge for at du har nyeste versjon):

-   Ha naisdevice (eller navTunnell) kjørende
-   Vær koblet mot dev-gcp

```
npm run build
docker-compose -f docker-compose.backend.yml up --build
```

## Videre flyt

Denne klienten interagerer med https://github.com/navikt/klage-dittnav-api, som igjen sender info videre til https://github.com/navikt/klage-arkiver-journalpost. Se README i sistnevnte for informasjon om hvordan journalposter opprettes i Joark.

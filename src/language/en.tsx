import React from 'react';
import { KlageStatus, Reason } from '../klage/klage';
import { ExternalLink } from '../link/link';
import { TemaKey } from '../tema/tema';
import { Language } from './nb';

export const en: Language = {
    inngang: {
        title_postfix: 'complain or appeal',
        hovedkategorier: {
            title: 'Complain or appeal against decision',
            description:
                'You have a right to complain if you have reived a decision from NAV and disagree with the decision. Start by selecting the topic of your case.',
            chooseTema: 'Select topic'
        },
        kategorier: {
            title: 'Which service or benefit is applicable?'
        },
        innsendingsvalg: {
            common: {
                read_more: [
                    'Read more about ',
                    <ExternalLink href="https://www.nav.no/en/home/rules-and-regulations/appeals">
                        your right to complain on our topic pages
                    </ExternalLink>,
                    '.'
                ],
                estimate: [
                    'You can see ',
                    <ExternalLink href="https://www.nav.no/no/nav-og-samfunn/om-nav/saksbehandlingstider-i-nav/relatert-informasjon/klage-og-anke">
                        the expected case processing time for complaints and appeals
                    </ExternalLink>,
                    ' in a separate overview.'
                ]
            },
            digital: {
                cards: {
                    digital: {
                        title: 'Complain digitally',
                        description: 'You must log in with your electronic ID to submit a digital complaint.'
                    },
                    post: {
                        title: 'Complaint by post',
                        description:
                            'Complaint form to be submitted by post. Also for those who lodge a complaint on behalf of others.'
                    },
                    anke: {
                        title: 'Submission of appeal',
                        description: 'To submit an appeal, you must fill out a form sent by post.'
                    },
                    fullmakt: {
                        title: 'Complaint on behalf of others',
                        description: 'Digital submission of complaint when you are authorised on behalf of others.'
                    }
                },
                elektronisk_id: {
                    text: 'How to obtain an electronic ID',
                    url: 'https://www.norge.no/elektronisk-id'
                },
                fullmakt_help: {
                    text: 'How to give power of attorney to others',
                    url: 'https://www.nav.no/soknader/en/person/diverse/fullmaktskjema'
                }
            },
            post: {
                title: 'Submission by post',
                description: `Complaints or appeals against this service must be submitted by post.
                The guide will help you fill out a cover page and complaint form.
                You must print it out and send it to the address listed on the cover page together with a copy of any other documents or receipts.`,
                cards: {
                    post: {
                        title: 'Form for complaints',
                        description: 'Select this when you are complaining about a decision you have received from NAV.'
                    },
                    anke: {
                        title: 'Submission of appeal',
                        description:
                            'Select this when you have submitted a complaint earlier and wish to appeal to Trygderetten.'
                    }
                }
            },
            fullmakt: {
                title_postfix: 'Complain on behalf of others',
                title: 'Complain on behalf of others',
                who: 'On whose behalf are you lodging a complaint?',
                nin: 'National identification number of the person you have power of atorney for',
                invalid_nin: 'Invalid national identity number',
                search: 'Search'
            }
        }
    },
    klageskjema: {
        common: {
            title_fragment: 'complain',
            page_title: 'Complain against decision',
            logged_out: {
                text: 'You have been logged out. To continue, you just need to log in again.',
                log_in: 'Log in'
            },
            steps: ['Reason', 'Summary', 'Receipt']
        },
        begrunnelse: {
            fullmakt: {
                label: 'Complaint on behalf of:'
            },
            reasons: {
                title: 'What do you disagree with? (optional)',
                not_specified: 'Not specified.',
                texts: {
                    [Reason.AVSLAG_PAA_SOKNAD]: 'My application has been rejected',
                    [Reason.FOR_LITE_UTBETALT]: 'The payment I received was too little',
                    [Reason.UENIG_I_NOE_ANNET]: 'I disagree with something else in my decision',
                    [Reason.UENIG_I_VEDTAK_OM_TILBAKEBETALING]: 'I disagree with the decision concerning repayment'
                }
            },
            vedtak_date: {
                title: 'Date of decision (optional)'
            },
            saksnummer: {
                title: 'Case number (optional)'
            },
            begrunnelse_text: {
                title: 'Why do you disagree?',
                placeholder: 'State your reason here.',
                description:
                    'Explain in your own words what you disagree with and what you wish to have changed. Attach documents that can show NAV why you disagree.',
                begrunnelse_mangler: 'You must state a reason before continuing.',
                error_empty: 'You must state a reason before continuing.'
            },
            autosave: {
                popover: 'We are saving your changes automatically.',
                saving: 'Saving',
                saved: 'Saved',
                failed: 'Failed to save'
            },
            attachments: {
                title: 'Attachments',
                upload_button_text: 'Upload new attachment',
                upload_error: ({ name, type, size }: File, reason: string = 'Unknown reason.') =>
                    `Could not upload attachment "${name}" of type "${type}" of ${size} bytes. ${reason}`,
                description: 'If you have information you wish to attach, upload it here.',
                supported_types: ['Supported file types: ', <b>PNG</b>, ', ', <b>JPEG</b>, ' and ', <b>PDF</b>, '.'],
                size_limit:
                    'The file size cannot exceed 8 MB, and the total size of all attachments cannot exceed 32 MB.'
            },
            attachments_preview: {
                delete_error: (name: string, id: string, reason: string = 'Ukjent årsak.') =>
                    `Could not delete attachment "${name}" with ID "${id}". ${reason}`
            },
            next_button: 'Continue'
        },
        summary: {
            title: 'Review before you submit',
            submit_error: 'Failed to submit complaint. Unknown error.',
            sections: {
                person: {
                    title: <>Personal data</>,
                    info_from:
                        'Obtained from the National Registry (Folkeregisteret) and the Common Contact Register (Kontakt- og reserverasjonsregisteret).',
                    given_name: 'First and middle name(s)',
                    surname: 'Last name',
                    nin: 'National identity number',
                    phone: 'Phone number',
                    address: 'Address',
                    change_name_address: {
                        text: 'Change name or address (National Registry / Folkeregisteret)',
                        url: 'https://www.skatteetaten.no/person/folkeregister/'
                    },
                    change_phone: {
                        text: 'Change phone number (Common Contact Register / Kontakt- og reservasjonsregisteret)',
                        url: 'https://brukerprofil.difi.no/minprofil'
                    }
                },
                case: {
                    title: 'Information from the case',
                    vedtak: 'Date of decision',
                    no_date: 'No date entered',
                    saksnummer: 'Case number',
                    not_specified: 'Not specified.',
                    given_by_user: 'Specified by user',
                    from_system: 'Obtained from internal system'
                },
                begrunnelse: {
                    title: 'Reason in your complaint',
                    what: 'What do you disagree with?',
                    why: 'Why do you disagree?',
                    documents: 'Attched documents'
                }
            },
            back: 'Back',
            next: (status: KlageStatus) => (status === KlageStatus.DRAFT ? 'Submit' : 'See submitted complaint')
        },
        kvittering: {
            title: 'Receipt for submitted complaint',
            download: 'See and download your complaint',
            sent: 'Submitted',
            general_info: {
                title: 'The rest is now our responsibility',
                description: `You don't have to do anything else. We will contact you if we have any questions or if we need further information from you.`
            },
            read_more: [
                'You can read more about the further processing of your complaint on our ',
                <ExternalLink href="https://www.nav.no/en/home/rules-and-regulations/appeals">
                    topic pages about complaints and appeals
                </ExternalLink>,
                '.'
            ],
            see_estimate: [
                'You can see ',
                <ExternalLink href="https://www.nav.no/no/nav-og-samfunn/om-nav/saksbehandlingstider-i-nav/relatert-informasjon/klage-og-anke">
                    the expected case processing time for complaints and appeals
                </ExternalLink>,
                ' in a separate overview.'
            ],
            dine_saker: 'See your cases on Your page',
            loading: {
                title: 'Submitting complaint...',
                still_working: 'Still working...'
            }
        }
    },
    create: {
        invalid_tema: (tema?: string) => `Invalid topic "${tema}".`,
        format_error: (tema: TemaKey, ytelse: string, saksnummer: string | null): string => {
            if (saksnummer === null) {
                return `Failed to create complaint with topic "${tema}" and title "${ytelse}".`;
            }
            return `Failed to create complaint with topic "${tema}", title "${ytelse}" and case number "${saksnummer}".`;
        },
        create_error: 'Could not create complaint',
        finne_fullmaktsgiver_error: (nin: string) =>
            `Could not find grantor of power of attorney with national identity number ${nin}.`,
        creating: 'Creating complaint...'
    },
    user_loader: {
        loading_user: 'Loading user...',
        network_error: 'Could not load user because your browser cannot reach NAV. Do you still have internet access?',
        other_error: 'Could not load user, please try again later.',
        error_message: (message: string) => `Error message: "${message}"`,
        log_in: 'Log in'
    },
    klage_loader: {
        loading_klage: 'Loading complaint...',
        restoring: 'Restoring complaint...',
        format_error: (klageId: string, error: Error) =>
            `Failed to retrieve complaint with ID "${klageId}". ${error.message}`
    },
    landing_page: {
        checking_user: 'Checking user...'
    },
    not_found_page: {
        title: '404 Page not found'
    }
};

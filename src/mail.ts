export interface MailtoDataUnencoded {
  mailAddress: string,
  subject: string,
  body: string
}

export function makeMailtoUri(data: MailtoDataUnencoded) {
  return `mailto:${encodeURI(data.mailAddress)}?subject=${encodeURIComponent(data.subject)}&body=${encodeURIComponent(data.body)}`;
}

import { Either, left, right } from '@/shared/either';
import { InvalidEmailError } from './errors/invalid-email-error';

export class Email {
  private static readonly LOCAL_PART_ATOM_REGEX = /^[\w!#$%&'*+/=?^`{|}~-]+$/;
  private static readonly DOMAIN_LABEL_REGEX = /^[\dA-Za-z-]+$/;
  private static readonly MAX_LENGTH = 254;
  private static readonly LOCAL_PART_MAX_LENGTH = 64;
  private static readonly DOMAIN_LABEL_MAX_LENGTH = 63;

  private constructor(private readonly email: string) {}

  get value() {
    return this.email;
  }

  static create(email: string): Either<InvalidEmailError, Email> {
    if (!Email.isValid(email)) {
      return left(new InvalidEmailError(email));
    }

    return right(new Email(email));
  }

  private static isValid(email: string) {
    if (!Email.isLengthValid(email) || !Email.includesOneAtSymbol(email)) {
      return false;
    }

    const [localPart, domain] = email.split('@');

    return Email.isLocalPartValid(localPart) && Email.isDomainValid(domain);
  }

  private static isLengthValid(email: string) {
    return email.length > 0 && email.length <= Email.MAX_LENGTH;
  }

  private static includesOneAtSymbol(email: string) {
    const atSymbolRegex = /@/g;
    const atSymbols = email.match(atSymbolRegex);

    return atSymbols?.length === 1;
  }

  private static isLocalPartValid(localPart: string) {
    if (!Email.isLocalPartLengthValid(localPart)) {
      return false;
    }

    const atoms = localPart.split('.');

    return atoms.every((atom) => Email.LOCAL_PART_ATOM_REGEX.test(atom));
  }

  private static isLocalPartLengthValid(localPart: string) {
    return (
      localPart.length > 0 && localPart.length <= Email.LOCAL_PART_MAX_LENGTH
    );
  }

  private static isDomainValid(domain: string) {
    const labels = domain.split('.');

    return labels.every((label) => Email.isDomainLabelValid(label));
  }

  private static isDomainLabelValid(label: string) {
    if (!Email.isDomainLabelLengthValid(label)) {
      return false;
    }

    const firstCharacter = label[0];
    const lastCharacter = label[label.length - 1];

    return (
      firstCharacter !== '-' &&
      lastCharacter !== '-' &&
      Email.DOMAIN_LABEL_REGEX.test(label)
    );
  }

  private static isDomainLabelLengthValid(label: string) {
    return label.length > 0 && label.length <= Email.DOMAIN_LABEL_MAX_LENGTH;
  }
}

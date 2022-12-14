import _ from 'lodash';
import { Manifest } from '@locale-hub/data/models/manifest.model';

type ManifestContent = { [locale: string]: Manifest };

export enum FormattedType {
  value = 'value',
  array = 'array',
  plural = 'plural',
}

type FormattedManifest = {
  [locale: string]: {
    [key: string]: {
      type: FormattedType;
      value: string;
      array: { [idx: number]: string };
      plural: {
        one: string;
        many: string;
      };
    };
  };
};

export const getFormattedManifest = (
  manifest: ManifestContent
): FormattedManifest => {
  const formatted: FormattedManifest = {};

  _.forEach(manifest, (manifest, locale) => {
    formatted[locale] = {};
    _.forEach(manifest, (value, key) => {
      if (undefined === value || null === value || 0 === value.trim().length) {
        return;
      }

      // split key to get prefix and bracket idx
      const regexSearch = key.match(/\[(.*?)\]/) ?? ['', '0'];
      const keyPrefix = key.replace(regexSearch[0], ''); // regexSearch[0] value is '[one]'
      const keyBracketIdx = regexSearch[1] ?? ''; // regexSearch[0] value is 'one'

      // if formatted does not exists, initialize
      if (undefined === formatted[locale][keyPrefix]) {
        formatted[locale][keyPrefix] = {
          type: FormattedType.value,
          value: '',
          array: {},
          plural: { one: '', many: '' },
        };
      }

      if (isArrayKey(key)) {
        formatted[locale][keyPrefix].type = FormattedType.array;
        if (null === formatted[locale][keyPrefix].array) {
          formatted[locale][keyPrefix].array = {};
        }
        formatted[locale][keyPrefix].array[parseInt(keyBracketIdx)] = value;
      } else if (isPluralKey(key)) {
        formatted[locale][keyPrefix].type = FormattedType.plural;
        if (null === formatted[locale][keyPrefix].plural) {
          formatted[locale][keyPrefix].plural = { one: '', many: '' };
        }
        if ('one' === keyBracketIdx) {
          formatted[locale][keyPrefix].plural.one = value;
        } else {
          formatted[locale][keyPrefix].plural.many = value;
        }
      } else {
        // is Key a simple string
        formatted[locale][keyPrefix].type = FormattedType.value;
        formatted[locale][keyPrefix].value = value;
      }
    });
  });

  return formatted;
};

const isPluralKey = (key: string): boolean => {
  return key.includes('[one]') || key.includes('[many]');
};

const isArrayKey = (key: string): boolean => {
  const keyMatches = key.match(/\[[0-9]+\]/) ?? [];
  return 0 !== keyMatches.length;
};

export default {
  formatManifest: getFormattedManifest,
};

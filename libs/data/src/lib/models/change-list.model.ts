import {Manifest} from './manifest.model';

export interface ChangeList {
  locales: string[];
  keys: string[];
  manifest: { [locale: string]: Manifest };
}

import {ManifestEntry} from './manifest-entry.model';

export interface ManifestWithStatus {
  locales: string[];
  keys: string[];
  manifest: { [locale: string]: { [key: string]: ManifestEntry } };
}

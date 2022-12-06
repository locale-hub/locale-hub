import { Manifest } from './manifest.model';

export interface ManifestWithStatus {
  locales: string[];
  keys: string[];
  manifest: { [locale: string]: Manifest };
}

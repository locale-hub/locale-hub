import {KeyStatus} from '../enums/key-status.enum';

export interface ManifestEntry {
  key: string;
  locale: string;
  value: string;
  translatable: boolean;
  status: KeyStatus;
}

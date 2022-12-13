import { LocaleRepository } from '@locale-hub/data/repositories/locale.repository';

const localeRepository = new LocaleRepository();

/**
 * List all available locales
 * @return {Locale[]} List of available locales
 */
// TODO has been moved as a static file
export const getLocales = async (): Promise<any[]> => {
  return localeRepository.findAll();
};

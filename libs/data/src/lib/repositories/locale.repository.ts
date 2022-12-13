import {dbMultiple, dbSingle} from './db.repository';
import {Locale} from '../models/locale.model';
import {ApiException} from '../exceptions/api.exception';
import {ErrorCode} from '../enums/error-code.enum';

export class LocaleRepository {
  private readonly collectionName = 'locales';

  /**
   * Find an locale by its tag
   * @throws ApiException
   * @param {string} localeTag Tag of the locale
   * @return {Locale} The locale found, null otherwise
   */
  find = async (localeTag: string): Promise<Locale> => {
    const locale = await dbSingle<Locale>(this.collectionName, {tag: localeTag});

    if (null === locale) {
      throw new ApiException({
        code: ErrorCode.localeNotFound,
        message: `Could not find locale: ${localeTag}`,
        statusCode: 404,
      });
    }

    return locale;
  }

  /**
   * Find a list of entries from a set a keys
   * @throws ApiException
   * @param {string[]} localeTags List of locale tags to look for
   * @return {Locale[]} The list locales found, empty array if no result found
   */
  findIn = async (localeTags: string[]): Promise<Locale[]> => {
    const locales = await dbMultiple<Locale>(this.collectionName, {tag: {$in: localeTags}});

    if (null === locales) {
      throw new ApiException({
        code: ErrorCode.localeNotFound,
        message: 'Could not find Locales',
        statusCode: 404,
      });
    }

    return locales;
  }

  /**
   * Retrieve all locales
   * @throws ApiException
   * @return {Locale[]} The complete list of locales
   */
  findAll = async (): Promise<Locale[]> => {
    const locales = await dbMultiple<Locale>(this.collectionName, {});

    if (null === locales) {
      throw new ApiException({
        code: ErrorCode.localeNotFound,
        message: 'Could not find Locales',
        statusCode: 404,
      });
    }

    return locales;
  }
}

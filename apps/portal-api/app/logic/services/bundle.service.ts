import _ from 'lodash';
import fs from 'fs';
import { dirname } from 'path';

import archiver from '../utils/archiver.util';
import bundleFormatter, { FormattedType } from '../utils/bundle.util';
import { Manifest } from '@locale-hub/data/models/manifest.model';
import { FileFormat } from '@locale-hub/data/enums/file-format.enum';
import { BundleRepository } from '@locale-hub/data/repositories/bundle.repository';

type FilesList = { [key: string]: string };
type ManifestContent = { [locale: string]: Manifest };

const rootFolder = '/tmp/locale-hub';

const bundleRepository = new BundleRepository();

/**
 * Generate a bundle for a given project
 * @param {string} projectId The Project Id
 * @param {FileFormat} format The desired format of the bundle
 * @return {string|null} The path of the generated bundle
 */
export const getBundle = async (
  projectId: string,
  format: FileFormat
): Promise<string> => {
  const manifest = await bundleRepository.getBundle(projectId);
  const files = getFilesContent(format, manifest);

  for (const locale of Object.keys(files)) {
    const path = getFilePath(projectId, locale, format);
    await fs.promises.mkdir(dirname(path), { recursive: true });
    await fs.promises.writeFile(path, files[locale]);
  }
  await fs.promises.mkdir(`${rootFolder}/archives/${projectId}`, {
    recursive: true,
  });
  await archiver.zipDirectory(
    `${rootFolder}/projects/${projectId}`,
    `${rootFolder}/archives/${projectId}/bundle-export.zip`
  );
  await fs.promises.rmdir(`${rootFolder}/projects/${projectId}`, {
    recursive: true,
  });
  return `${rootFolder}/archives/${projectId}/bundle-export.zip`;
  // TODO: Add TTL to the zip file
};

/**
 * Util function that get the file path for a project|locale|format combination
 * @param {string} projectId Project Id
 * @param {string} locale Locale of the desired path
 * @param {FileFormat} format The desired file format
 * @return {string} the path for the given combination
 */
const getFilePath = (
  projectId: string,
  locale: string,
  format: FileFormat
): string => {
  const root = `${rootFolder}/projects/${projectId}`;

  switch (format) {
    case FileFormat.ANDROID:
      return `${root}/values-${locale}/strings.xml`;
    case FileFormat.IOS:
      return `${root}/${locale}.lproj/Localizable.strings`;
    default:
      throw new Error(`File format ${format} is not supported.`);
  }
};

/**
 * Generate Bundle for the given format
 * @param {FileFormat} format The desired format for bundle
 * @param {ManifestContent} manifest The manifest used to generate bundle
 * @return {FileList} List of files
 */
const getFilesContent = (
  format: FileFormat,
  manifest: ManifestContent
): FilesList => {
  switch (format) {
    case FileFormat.ANDROID:
      return getAndroidBundle(manifest);
    case FileFormat.IOS:
      return getIOSBundle(manifest);
    default:
      throw new Error(`File format ${format} is not supported.`);
  }
};

/**
 * Generate Bundle for Android export
 * @param {ManifestContent} content The manifest used to generate bundle
 * @return {FileList} List of files
 */
const getAndroidBundle = (content: ManifestContent): FilesList => {
  const files: { [key: string]: string } = {};
  const formattedContent = bundleFormatter.formatManifest(content);

  _.forEach(formattedContent, (manifest, locale) => {
    let xml =
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<resources xmlns:xliff="urn:oasis:names:tc:xliff:document:1.2">\n';
    _.forEach(manifest, (item, key) => {
      switch (item.type) {
        case FormattedType.array:
          xml += `<string-array name="${key}">\n`;
          _.forEach(item.array, (value, idx) => {
            xml += `    <item name="${key}${idx}">${value}</item>\n`;
          });
          xml += '</string-array>\n';
          break;
        case FormattedType.plural:
          xml +=
            `<plurals name="${key}">\n` +
            `    <item quantity="one">${item.plural.one}</item>\n` +
            `    <item quantity="other">${item.plural.many}</item>\n` +
            '</plurals>\n';
          break;
        case FormattedType.value:
        default:
          xml += `    <string name="${key}">${item.value}</string>\n`;
          break;
      }
    });
    xml += '</resources>\n';

    files[locale] = xml;
  });

  return files;
};

/**
 * Generate Bundle for iOS export
 * @param {ManifestContent} content The manifest used to generate bundle
 * @return {FileList} List of files
 */
const getIOSBundle = (content: ManifestContent): FilesList => {
  const files: { [key: string]: string } = {};
  const formattedContent = bundleFormatter.formatManifest(content);

  _.forEach(formattedContent, (manifest, locale) => {
    let strings = '';
    _.forEach(manifest, (item, key) => {
      switch (item.type) {
        case FormattedType.array:
          _.forEach(item.array, (value, idx) => {
            strings += `"${key}[${idx}]" = "${value}";\n`;
          });
          break;
        case FormattedType.plural:
          strings += `"${key}" = "${item.plural.one}";\n`;
          strings += `"${key}-plural" = "${item.plural.many}";\n`;
          break;
        case FormattedType.value:
        default:
          strings += `"${key}" = "${item.value}";\n`;
          break;
      }
    });

    files[locale] = strings;
  });

  return files;
};

import nodemailer from 'nodemailer';
import Queue from 'better-queue';
import fs from 'fs';
import path from 'path';
import * as _ from 'lodash';
import * as Sentry from '@sentry/node';
import { environment } from '../../../environments/environment';

// '../../' is to go back to root folder as __dirname is giving the current folder.
const htmlFolder = path.join(
  __dirname,
  '../../',
  environment.email.resources.html
);
const textFolder = path.join(
  __dirname,
  '../../',
  environment.email.resources.text
);

type MailOptions = {
  to: string;
  subject: string;
  template: string;
  data: KeyValueObject;
};
type KeyValueObject = { [key: string]: string };

/**
 * Replace the `{{ key }}` values by the desired values
 * @param {string} content The content to be updated
 * @param {KeyValueObject} data List of key-value items to be replaced in the content
 * @return {string} The updated content
 */
const replaceAll = (content: string, data: KeyValueObject): string => {
  const formattedData: KeyValueObject = _.mapKeys(
    data,
    (value: string, key: string) => `{{ ${key} }}`
  );
  const regex = new RegExp(Object.keys(formattedData).join('|'), 'gi');

  return content.replace(regex, function (matched) {
    return formattedData[matched];
  });
};

const mailQueue = new Queue(async (options: MailOptions, cb) => {
  let htmlContent = await fs.promises.readFile(
    `${htmlFolder}${options.template.replace('.', '/')}.html`,
    { encoding: 'utf-8' }
  );
  let textContent = await fs.promises.readFile(
    `${textFolder}${options.template.replace('.', '/')}.txt`,
    { encoding: 'utf-8' }
  );

  htmlContent = replaceAll(htmlContent, options.data);
  textContent = replaceAll(textContent, options.data);

  const info = await transporter.sendMail({
    from: environment.email.from,
    to: options.to,
    subject: options.subject,
    html: htmlContent,
    text: textContent,
  });

  if ('production' !== environment.environment) {
    console.log(`Message sent: ${info.messageId}`);
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  }

  cb();
});

const transporter = nodemailer.createTransport({
  host: environment.email.host,
  port: environment.email.port,
  secure: environment.email.secure,
  auth: {
    user: environment.email.auth.user,
    pass: environment.email.auth.password,
  },
});

/**
 * Send an email
 * @param {string} to Target email
 * @param {string} subject Subject of the email
 * @param {string} template path from resources/email/ folder. Sub-folder should be expressed as '.'
 * @param {KeyValueObject} data KeyValue to use in the email. { 'key': 'value'} will replace '\{\{ key \}\}' by 'value'
 */
export const send = (
  to: string,
  subject: string,
  template: string,
  data: KeyValueObject = {}
): void => {
  try {
    mailQueue.push({
      to,
      subject,
      template,
      data,
    });
  } catch (exception) {
    if ('production' === environment.environment) {
      Sentry.captureException(exception);
    } else {
      console.error(exception);
    }
  }
};

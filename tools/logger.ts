
export const logError = (error: any) => {
  process.stdout.write('\r' + ' '.repeat(100));
  console.error('\r  - Something went wrong with the script');
  console.error('###');
  console.error(error);
  console.error('###');
  process.exit(1);
};

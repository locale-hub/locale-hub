import { app } from './app';
import { redisConnect } from '@locale-hub/data/repositories/redis.service';
import { validateObject } from './app/logic/middlewares/validateObject.middleware';
import { dbConnect } from '@locale-hub/data/repositories/db.repository';
import { environment } from './environments/environment';
import { environmentSchema } from './app/environment.schema';

const validateConfig = async (): Promise<void> => {
  const isConfigValid = await validateObject(environmentSchema, environment);
  if (!isConfigValid) {
    throw new Error('Configuration is not valid');
  }
};

const validateDbConnection = async (): Promise<void> => {
  const isConnected = await dbConnect(
    environment.database.uri,
    environment.database.name
  );
  if (!isConnected) {
    throw new Error('Connexion failure with the DB.');
  }
};

const validateRedisConnection = async (): Promise<void> => {
  if (!environment.features.sdk) {
    return; // feature not enabled
  }

  const isConnected = await redisConnect(environment.sdk.redis.uri);
  if (!isConnected) {
    throw new Error('Connexion failure with Redis.');
  }
};

const startApp = async (): Promise<void> => {
  await validateConfig();
  await validateDbConnection();
  await validateRedisConnection();
};

startApp()
  .then(() => {
    const port = environment.portal.api.port;
    app.listen(port, function () {
      console.log(`Portal API is listening on port ${port}!`);
    });
  })
  .catch((error: Error) => {
    console.error('Something wrong happened...');
    console.error(error);
    process.exit(-1);
  });

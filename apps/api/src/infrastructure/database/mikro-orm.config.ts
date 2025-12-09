import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { IamOrmEntities } from 'src/modules/iam/infrastructure/database/iam.orm-entities';

export default defineConfig({
  host: process.env['DB_HOST'],
  port: Number(process.env['DB_PORT']),
  user: process.env['DB_USER'],
  password: process.env['DB_PASSWORD'],
  dbName: process.env['DB_NAME'],

  entities: [...IamOrmEntities],

  metadataProvider: TsMorphMetadataProvider,
  debug: process.env.NODE_ENV !== 'production',
  allowGlobalContext: true,

  migrations: {
    path: './src/infrastructure/database/migrations',
    transactional: true,
  },
});

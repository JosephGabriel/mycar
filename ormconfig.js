var configDb = {
  synchronize: false,
  migrations: ['migrations/*.js'],
  cli: {
    migrationsDir: 'migrations',
  },
};

switch (process.env.NODE_ENV) {
  case 'development':
    Object.assign(configDb, {
      type: 'sqlite',
      database: 'db.sqlite',
      entities: ['**/*.entity.js'],
    });
    break;

  case 'test':
    Object.assign(configDb, {
      type: 'sqlite',
      database: 'test.sqlite',
      keepConnectionAlive: true,
      entities: ['**/*.entity.ts'],
      migrationsRun: true,
    });

    break;

  case 'production':
    Object.assign(configDb, {
      type: 'sqlite',
      database: 'test.sqlite',
      entities: ['**/*.entity.ts'],
    });
    break;

  default:
    throw new Error('unknown enviroment');
    break;
}

module.exports = configDb;

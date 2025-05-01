export default () => ({
  postgres: {
    host: process.env.PG_HOST ?? 'localhost',
    port: process.env.PG_PORT ? parseInt(process.env.PG_PORT, 10) : 5432,
    username: process.env.PG_USER ?? 'postgres',
    password: process.env.PG_PASSWORD ?? 'postgres',
    database: process.env.PG_DATABASE ?? 'vehicle_repair_db',
  },
  accessSecret: process.env.ACCESS_SECRET,
});

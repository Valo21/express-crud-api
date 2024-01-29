import pg from 'pg';

const dbPool: pg.Pool = new pg.Pool({
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    ssl: true
});

export let db: pg.PoolClient
dbPool.connect().then((client: pg.PoolClient )=>{
    db = client;
    console.log("Connected to db")
})
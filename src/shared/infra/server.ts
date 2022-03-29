import { client } from '../../modules/user/services/auth/implementation/redis/clientRedis';
import { dataSource } from './database/dataSourceTypeorm';
import { app } from './http/app';

client.connect();

dataSource
  .initialize()
  .then(() => {
    console.log(`Successful connection to a database ${process.env.DB_NAME}`);
  })
  .catch(error => {
    console.log(error);
    process.exit();
  });

const port = 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

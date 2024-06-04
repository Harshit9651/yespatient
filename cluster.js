const cluster = require('cluster');
const os = require('os');

if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  console.log(`Master ${process.pid} is running`);

  // Fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    console.log('Forking a new worker...');
    cluster.fork(); // Fork a new worker when one dies
  });
} else {
  // Workers can share any TCP connection
  // In this case, it is an HTTP server
  require('./app.js');
  console.log(`Worker ${process.pid} started`);
}
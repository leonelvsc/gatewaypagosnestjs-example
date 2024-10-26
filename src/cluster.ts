import cluster from 'node:cluster';
import * as os from 'node:os';

export class Cluster {
  static register(workers: number, callback: () => any): void {
    if (cluster.isPrimary) {
      console.log(`Master server started on ${process.pid}`);

      //ensure workers exit cleanly
      process.on('SIGINT', () => {
        console.log('Cluster shutting down...');
        for (const id in cluster.workers) {
          cluster.workers[id].kill();
        }
        // exit the master process
        process.exit(0);
      });

      const cpus = os.cpus().length;

      if (workers > cpus) {
        workers = cpus;
      }

      for (let i = 0; i < workers; i++) {
        cluster.fork();
      }

      cluster.on('online', (worker) => {
        console.log('Worker %s is online', worker.process.pid);
      });

      cluster.on('exit', (worker) => {
        console.log(`Worker ${worker.process.pid} died. Restarting`);
        cluster.fork();
      });
    } else {
      callback();
    }
  }
}

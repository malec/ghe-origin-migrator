import fs from 'fs-extra';
import Logger from 'jet-logger';
import * as childProcess from 'child_process';
import { exists } from 'fs';

const logger = new Logger();
function exec(cmd: string, loc: string): Promise<string> {
  return new Promise((res, rej) => {
    return childProcess.exec(cmd, { cwd: loc }, (err, stdout, stderr) => {
      if (!!stdout) {
        // logger.info(stdout);
      }
      if (!!stderr) {
        logger.warn(stderr);
      }
      return (!!err ? rej(err) : res(stdout));
    });
  });
}

const main = async () => {
  const projectRoot = '../***REMOVED***';
  const dirRes = await exec('ls -d */', projectRoot);
  const dirs = dirRes.trim().split('\n');
  dirs.forEach(async dir => {
    try {
      await logger.info('pwd: ' + await exec('pwd', `${projectRoot}/${dir}`));
      let origin = await exec(`git remote get-url origin`, `${projectRoot}/${dir}`);
      logger.info('origin ' + origin);
      if (!origin.includes('***REMOVED***:***REMOVED***')) {
        logger.warn(`can't migrate repo ${dir}`);
        return;
      }
      origin = origin.replace('***REMOVED***:***REMOVED***', 'github.com:***REMOVED***')
      await exec(`git remote set-url origin ${origin}`, `${projectRoot}/${dir}`)
    } catch (e) {
      if (e.toString().includes('not a git repository')) {
        return;
      }
      throw e;
    }
  });
}

main();
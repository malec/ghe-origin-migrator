import Logger from 'jet-logger';
import * as childProcess from 'child_process';
import { program, Argument } from 'commander';

program.version('1.1');
program.addArgument(new Argument('sourceUrl', 'url of the enterprise git server Ex. ghe.yourCompany.com'))
program.addArgument(new Argument('targetUrl', 'destination to migrate to. Ex. github.com'))
program.addArgument(new Argument('sourceOrg', 'org to migrate from. Ex. ***REMOVED***'))
program.addArgument(new Argument('targetOrg', 'org to migrate to. Ex. ***REMOVED***'))
program.option('-d, --workdir <string>', 'target url to migrate to', '../')
program.parse();
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

const main = async (projectRoot: string, sourceUrl: string, targetUrl: string, sourceOrg: string, targetOrg: string) => {
  const dirRes = await exec('ls -d */', projectRoot);
  const dirs = dirRes.trim().split('\n');
  dirs.forEach(async dir => {
    try {
      let origin = await exec(`git remote get-url origin`, `${projectRoot}/${dir}`);
      if (!origin.includes(sourceUrl)) {
        logger.info(`skipping directory ${dir}`);
        return;
      }
      origin = origin.replace(`${sourceUrl}:${sourceOrg}`, `${targetUrl}:${targetOrg}`);
      await exec(`git remote set-url origin ${origin}`, `${projectRoot}/${dir}`)
      logger.info(`migrated ${dir}!`);
    } catch (e) {
      if (e.toString().includes('not a git repository')) {
        return;
      }
      throw e;
    }
  });
}

const { workdir, sourceUrl, targetUrl, sourceOrg, targetOrg } = program.opts();
main(workdir, sourceUrl, targetUrl, sourceOrg, targetOrg);
import Logger from 'jet-logger';
import * as childProcess from 'child_process';
import { program, Argument } from 'commander';

program.version('1.2');
program.addArgument(new Argument('sourceUrl', 'url of the enterprise git server Ex. ghe.yourCompany.com'))
program.addArgument(new Argument('targetUrl', 'destination to migrate to. Ex. github.com'))
program.addArgument(new Argument('sourceOrg', 'org to migrate from. Ex. ***REMOVED***'))
program.addArgument(new Argument('targetOrg', 'org to migrate to. Ex. ***REMOVED***'))
program.option('-d, --workdir <string>', 'target url to migrate to', '..')
program.parse();
const logger = new Logger();

const sleep = async (timeout: number) => {
  await new Promise((res) => {
    setTimeout(res, timeout);
  })
}

function exec(cmd: string, loc: string): Promise<string> {
  return new Promise((res, rej) => {
    return childProcess.exec(cmd, { cwd: loc }, (err, stdout, stderr) => {
      if (stderr.includes('not a git repository') || stderr.includes('No such remote')) {
        return res('skipped');
      }
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
  let migrated = 0;
  await sleep(3000);
  const dirRes = await exec('ls -d */', projectRoot);
  const dirs = dirRes.trim().split('\n');
  for (const dir of dirs) {
    let origin = await exec(`git remote get-url origin`, `${projectRoot}/${dir}`);
    if (!origin.includes(`${sourceUrl}:${sourceOrg}`)) {
      logger.info(`skipping directory ${dir}`);
      continue;
    }
    origin = origin.replace(`${sourceUrl}:${sourceOrg}`, `${targetUrl}:${targetOrg}`);
    const result = await exec(`git remote set-url origin ${origin}`, `${projectRoot}/${dir}`);
    if (result !== 'skipped') {
      logger.info(`migrated ${dir}!`);
      migrated++;
      continue;
    }
  }
  logger.info(`Migrated ${migrated} repo(s). Exiting.`)
}

const { workdir } = program.opts();
const [sourceUrl, targetUrl, sourceOrg, targetOrg] = program.args;
main(workdir, sourceUrl, targetUrl, sourceOrg, targetOrg).catch(x => console.log('x', x));

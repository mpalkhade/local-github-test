const fs = require('fs');
const credentialPath = process.argv[2];

const writeCredentialExport = (pathToCredentials) => {
  let data = fs.readFileSync(pathToCredentials, {encoding: 'utf-8'});
  let credJson = JSON.parse(data);
  let {
    SecretAccessKey: accessKey,
    AccessKeyId: accessKeyId
  } = credJson.Credentials;

  let sw = fs.createWriteStream('export_secrets.sh');
  sw.once('open', () => {
   sw.write('#!\n');
   sw.write(`aws configure set aws_access_key_id ${accessKeyId};\n`);
   sw.write(`aws configure set aws_secret_access_key ${accessKey};\n`);
   sw.write(`echo "configuration set!"`);
   sw.end();
   console.log('export_secrets created!');
  });
}

writeCredentialExport(credentialPath);

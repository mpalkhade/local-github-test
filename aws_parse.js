const fs = require('fs');
const credentialPath = process.argv[2];

const writeCredentialExport = (pathToCredentials) => {
  let data = fs.readFileSync(pathToCredentials, {encoding: 'utf-8'});
  let credJson = JSON.parse(data);
  let {
    SecretAccessKey: accessKey,
    SessionToken: sessionToken,
    AccessKeyId: accessKeyId
  } = credJson.Credentials;

  let sw = fs.createWriteStream('export_secrets');
  sw.once('open', () => {
   sw.write(`export AWS_ACCESS_KEY_ID=${accessKeyId}\n`);
   sw.write(`export AWS_SECRET_ACCESS_KEY=${accessKey}\n`);
   sw.write(`export AWS_SESSION_TOKEN=${sessionToken}\n`);
   sw.end();
   console.log('export_secrets created!');
  });
}

writeCredentialExport(credentialPath);

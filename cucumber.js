require('dotenv').config();

const common = `
  --require-module ts-node/register
  --require src/**/*.ts
  --format json:reports/report.json 
  --format message:reports/report.ndjson
  --format html:reports/report.html
  --format summary 
  --format progress-bar 
  --format @cucumber/pretty-formatter
  --format-options ${JSON.stringify({ snippetInterface: 'async-await' })}
  --publish-quiet
  `;

const getWorldParams = () => {
  const params = {
    baseUrl:
      process.env.DR_REGION_TYPE == 'secondary'
        ? process.env.SECONDARY_INGRESS_URL
        : process.env.BASE_URL,
  };

  return `--world-parameters ${JSON.stringify({ params })}`;
};

module.exports = {
  default: `${common} ${getWorldParams()}`,
};

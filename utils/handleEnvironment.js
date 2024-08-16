const envVariables = require('../config/env')

const environment = {
  hostname: '',
  apiKey: ''
}

function setEnvironment(host) {
  environment.hostname = envVariables.TEST.HOST;
  environment.apiKey = envVariables.TEST.API_KEY;
  
  if (host.includes('tst-')) {
      environment.hostname = envVariables.STAGE.HOST;
      environment.apiKey = envVariables.STAGE.API_KEY;
  } else if (host.includes('prd-') || host.toLowerCase() === 'www.salonline.com.br') {
      environment.hostname = envVariables.PROD.HOST;
      environment.apiKey = envVariables.PROD.API_KEY;
  }
}

module.exports = { environment, setEnvironment};
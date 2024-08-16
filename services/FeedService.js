"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FeedService = void 0;
var _occ = require("../api/occ");
var _fs = _interopRequireDefault(require("fs"));
var _axios = _interopRequireDefault(require("axios"));
var _FileUtils = require("../utils/FileUtils");
var _MakeXMLString = require("../utils/MakeXMLString");
var _MakeXMLStringTiktok = require("../utils/MakeXMLStringTiktok");
var _fastXmlParser = require("fast-xml-parser");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class FeedService {
  streams = {
    standard: null,
    tiktok: null,
    pinterest: null
  };
  constructor() {
    this.scheduleFeedGeneration();
  }
  createFeed = async () => {
    try {
      const fileContents = {
        standard: `
        <rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
        <channel>
        <title>Salon Line</title>
        <link>https://www.salonline.com.br/</link>
        <description>Feed de Produtos - Salon Line</description>
        `
      };
      await Promise.all([(0, _FileUtils.writeFilePromise)('products_feed.xml', fileContents.standard)]);

      // Inicializa os streams
      this.streams.standard = _fs.default.createWriteStream('products_feed.xml', {
        flags: 'a'
      });
      const [responseInactiveProducts, responseActiveProducts] = await Promise.all([(0, _occ.findInactiveProducts)({
        offset: 0
      }), (0, _occ.findActiveProducts)({
        offset: 0
      })]);

      //const responseInactiveProducts = await findInactiveProducts({ offset: 0 });
      const inactiveRepositoryIds = responseInactiveProducts.map(product => product.repositoryId);

      //const responseActiveProducts = await findActiveProducts({ offset: 0 });
      const filteredActiveProducts = responseActiveProducts.filter(product => !inactiveRepositoryIds.includes(product.repositoryId));
      console.log('inactiveRepositoryIds', inactiveRepositoryIds);
      const [productsList] = await Promise.all([(0, _MakeXMLString.makeXMLString)(filteredActiveProducts)]);
      if (this.streams.standard) {
        this.streams.standard.write(productsList.products_list);
        this.streams.standard.write(`
        </channel>
        <date>${new Date().toISOString()}</date>
        </rss>`);
        this.streams.standard.end();
      }
      const [validateXMLFile] = await Promise.all([this.validateXMLFile('products_feed.xml')]);
      if (validateXMLFile) {
        console.log('Todos os arquivos XML são válidos.');
        //todo: criar workset no occ

        const responseGetWorkset = await (0, _occ.getWorkset)();

        //todo: Pegar id do workset no occ

        if (responseGetWorkset) {
          console.log('workset', responseGetWorkset);
          const {
            repositoryId
          } = responseGetWorkset; // Acesse 'repositoryId' dentro de 'data'
          this.worksetId = repositoryId;
        } else {
          const responseCreateWorkset = await (0, _occ.createWorkset)();
          const {
            repositoryId
          } = responseCreateWorkset;
          this.worksetId = repositoryId;
        }
        console.log('this.worksetId', this.worksetId);
        const [responseuploadStandardFeed] = await Promise.all([await (0, _occ.uploadStandardFeed)(this.worksetId)]);
        if (responseuploadStandardFeed) {
          console.log('responseuploadStandardFeed', responseuploadStandardFeed);
          return await this.createFeedPinterest();
          //const responsePublishFeed = await publish(this.worksetId);

          //console.log('responsePublishFeed', responsePublishFeed);
          // if(responsePublishFeed) {
          // ;
          // }
          //return responsePublishFeed;
        }
        ;
      } else {
        throw new Error('Um ou mais arquivos XML são inválidos. Por favor tente novamente...');
      }
    } catch (error) {
      console.log('Error createFeed', error);
      if (this.streams.standard && !this.streams.standard.writableEnded) {
        this.streams.standard.end();
      }
      if (this.streams.tiktok && !this.streams.tiktok.writableEnded) {
        this.streams.tiktok.end();
      }
      if (this.streams.pinterest && !this.streams.pinterest.writableEnded) {
        this.streams.pinterest.end();
      }
    }
  };
  createFeedPinterest = async () => {
    try {
      const fileContents = {
        pinterest: `<?xml version="1.0"?>
        <rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
         <channel>
        `
      };
      await Promise.all([(0, _FileUtils.writeFilePromise)('pinterest_feed.xml', fileContents.pinterest)]);

      // Inicializa os streams
      this.streams.pinterest = _fs.default.createWriteStream('pinterest_feed.xml', {
        flags: 'a'
      });
      const [responseInactiveProducts, responseActiveProducts] = await Promise.all([(0, _occ.findInactiveProducts)({
        offset: 0
      }), (0, _occ.findActiveProducts)({
        offset: 0
      })]);

      //const responseInactiveProducts = await findInactiveProducts({ offset: 0 });
      const inactiveRepositoryIds = responseInactiveProducts.map(product => product.repositoryId);

      //const responseActiveProducts = await findActiveProducts({ offset: 0 });
      const filteredActiveProducts = responseActiveProducts.filter(product => !inactiveRepositoryIds.includes(product.repositoryId));
      console.log('inactiveRepositoryIds', inactiveRepositoryIds);
      const [productsListPinterest] = await Promise.all([(0, _MakeXMLStringTiktok.MakeXMLStringTiktok)(filteredActiveProducts)]);
      if (this.streams.pinterest) {
        this.streams.pinterest.write(productsListPinterest.products_list);
        this.streams.pinterest.write(`
        </channel>
        <date>${new Date().toISOString()}</date>
        </rss>`);
        this.streams.pinterest.end();
      }

      // Consolidar a validação dos arquivos XML em uma única chamada de Promise.all
      const [validateXMLFilePinterest] = await Promise.all([this.validateXMLFile('pinterest_feed.xml')]);

      // //Validação de arquivo xml
      // await this.validateXMLFile('pinterest_feed.xml');
      // await this.validateXMLFile('products_feed.xml');
      // await this.validateXMLFile('tiktok_feed.xml');

      if (validateXMLFilePinterest) {
        console.log('Todos os arquivos XML são válidos.');
        //todo: criar workset no occ

        const responseGetWorkset = await (0, _occ.getWorkset)();

        //todo: Pegar id do workset no occ

        if (responseGetWorkset) {
          console.log('workset', responseGetWorkset);
          const {
            repositoryId
          } = responseGetWorkset; // Acesse 'repositoryId' dentro de 'data'
          this.worksetId = repositoryId;
        } else {
          const responseCreateWorkset = await (0, _occ.createWorkset)();
          const {
            repositoryId
          } = responseCreateWorkset;
          this.worksetId = repositoryId;
        }
        console.log('this.worksetId', this.worksetId);

        //todo: Pulicar no occ with workset

        // const responseuploadStandardFeed = await uploadStandardFeed(this.worksetId);
        // const responseuploadTiktokFeed = await uploadTiktokFeed(this.worksetId);
        // const responseuploadPinterestFeed = await uploadPinterestFeed(this.worksetId);

        const [responseuploadPinterestFeed] = await Promise.all([await (0, _occ.uploadPinterestFeed)(this.worksetId)]);
        if (responseuploadPinterestFeed) {
          console.log('responseuploadPinterestFeed', responseuploadPinterestFeed);

          // const responsePublishFeed = await publish(this.worksetId);

          // console.log('responsePublishFeed', responsePublishFeed);

          return await this.createFeedTiktok();

          //return responsePublishFeed;
        }
        ;
      } else {
        throw new Error('Um ou mais arquivos XML são inválidos. Por favor tente novamente...');
      }
    } catch (error) {
      console.log('Error createFeed', error);
      if (this.streams.standard && !this.streams.standard.writableEnded) {
        this.streams.standard.end();
      }
      if (this.streams.tiktok && !this.streams.tiktok.writableEnded) {
        this.streams.tiktok.end();
      }
      if (this.streams.pinterest && !this.streams.pinterest.writableEnded) {
        this.streams.pinterest.end();
      }
    }
  };
  createFeedTiktok = async () => {
    try {
      const fileContents = {
        tiktok: `<?xml version="1.0" encoding="utf-8"?>
            <feed xmlns="http://www.w3.org/2005/Atom">`
      };
      await Promise.all([(0, _FileUtils.writeFilePromise)('tiktok_feed.xml', fileContents.tiktok)]);

      // Inicializa os streams

      this.streams.tiktok = _fs.default.createWriteStream('tiktok_feed.xml', {
        flags: 'a'
      });
      const [responseInactiveProducts, responseActiveProducts] = await Promise.all([(0, _occ.findInactiveProducts)({
        offset: 0
      }), (0, _occ.findActiveProducts)({
        offset: 0
      })]);

      //const responseInactiveProducts = await findInactiveProducts({ offset: 0 });
      const inactiveRepositoryIds = responseInactiveProducts.map(product => product.repositoryId);

      //const responseActiveProducts = await findActiveProducts({ offset: 0 });
      const filteredActiveProducts = responseActiveProducts.filter(product => !inactiveRepositoryIds.includes(product.repositoryId));
      console.log('inactiveRepositoryIds', inactiveRepositoryIds);
      const [productsListTiktok] = await Promise.all([(0, _MakeXMLStringTiktok.MakeXMLStringTiktok)(filteredActiveProducts)]);
      if (this.streams.tiktok) {
        this.streams.tiktok.write(productsListTiktok.products_list);
        this.streams.tiktok.write(`
        <!-- PROCESSED DATE: ${new Date().toISOString()} -->
        </feed>`);
        this.streams.tiktok.end();
      }

      // Consolidar a validação dos arquivos XML em uma única chamada de Promise.all
      const [validateXMLFileTiktok] = await Promise.all([this.validateXMLFile('tiktok_feed.xml')]);

      // //Validação de arquivo xml
      // await this.validateXMLFile('pinterest_feed.xml');
      // await this.validateXMLFile('products_feed.xml');
      // await this.validateXMLFile('tiktok_feed.xml');

      if (validateXMLFileTiktok) {
        console.log('Todos os arquivos XML são válidos.');
        //todo: criar workset no occ

        const responseGetWorkset = await (0, _occ.getWorkset)();

        //todo: Pegar id do workset no occ

        if (responseGetWorkset) {
          console.log('workset', responseGetWorkset);
          const {
            repositoryId
          } = responseGetWorkset; // Acesse 'repositoryId' dentro de 'data'
          this.worksetId = repositoryId;
        } else {
          const responseCreateWorkset = await (0, _occ.createWorkset)();
          const {
            repositoryId
          } = responseCreateWorkset;
          this.worksetId = repositoryId;
        }
        console.log('this.worksetId', this.worksetId);

        //todo: Pulicar no occ with workset

        // const responseuploadStandardFeed = await uploadStandardFeed(this.worksetId);
        // const responseuploadTiktokFeed = await uploadTiktokFeed(this.worksetId);
        // const responseuploadPinterestFeed = await uploadPinterestFeed(this.worksetId);

        const [responseuploadTiktokFeed] = await Promise.all([await (0, _occ.uploadTiktokFeed)(this.worksetId)]);
        if (responseuploadTiktokFeed) {
          console.log('responseuploadTiktokFeed', responseuploadTiktokFeed);
          const responsePublishFeed = await (0, _occ.publish)(this.worksetId);
          console.log('responsePublishFeed', responsePublishFeed);
          return responsePublishFeed;
        }
        ;
      } else {
        throw new Error('Um ou mais arquivos XML são inválidos. Por favor tente novamente...');
      }
    } catch (error) {
      console.log('Error createFeed', error);
      if (this.streams.standard && !this.streams.standard.writableEnded) {
        this.streams.standard.end();
      }
      if (this.streams.tiktok && !this.streams.tiktok.writableEnded) {
        this.streams.tiktok.end();
      }
      if (this.streams.pinterest && !this.streams.pinterest.writableEnded) {
        this.streams.pinterest.end();
      }
    }
  };
  async deleteFileIfExists(filePath) {
    try {
      if (_fs.default.existsSync(filePath)) {
        await _fs.default.promises.unlink(filePath);
        console.log(`File ${filePath} deleted!`);
      } else {
        console.log(`File ${filePath} does not exist.`);
      }
    } catch (error) {
      console.error(`Error deleting file ${filePath}:`, error);
    }
  }
  scheduleFeedGeneration() {
    setInterval(async () => {
      try {
        await this.deleteFileIfExists('pinterest_feed.xml');
        await this.deleteFileIfExists('products_feed.xml');
        await this.deleteFileIfExists('tiktok_feed.xml');
        const response = await _axios.default.get('https://p7724145c1prd-admin.occa.ocs.oraclecloud.com/ccstorex/custom/v1/feedGenerator/generate');
        console.log('Schedule Feed com sucesso:', response.data);
      } catch (error) {
        console.error('Erro ao gerar feed:', error);
      }
    }, 1800000); // 30 minutos em milissegundos
  }

  async validateXMLFile(filePath) {
    try {
      const fileContent = await _fs.default.promises.readFile(filePath, 'utf-8');
      const parser = new _fastXmlParser.XMLParser();
      const parsedContent = parser.parse(fileContent);
      console.log(`File ${filePath} is a valid XML.`);
      return parsedContent;
    } catch (error) {
      console.error(`Error validating XML file ${filePath}:`, error);
      throw error;
    }
  }
}

// public createFeed = async () => {

//   try {

//     const fileContents = {
//       standard: `
//       <rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
//       <channel>
//       <title>Salon Line</title>
//       <link>https://www.salonline.com.br/</link>
//       <description>Feed de Produtos - Salon Line</description>
//       `,
//       tiktok: `<?xml version="1.0" encoding="utf-8"?>
//           <feed xmlns="http://www.w3.org/2005/Atom">`,
//       pinterest: `<?xml version="1.0"?>
//       <rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
//        <channel>
//       `,
//     };

//     await Promise.all([
//       writeFilePromise('products_feed.xml', fileContents.standard),
//       writeFilePromise('tiktok_feed.xml', fileContents.tiktok),
//       writeFilePromise('pinterest_feed.xml', fileContents.pinterest),
//     ]);

//       // Inicializa os streams
//      this.streams.standard = fs.createWriteStream('products_feed.xml', { flags: 'a' });
//      this.streams.tiktok = fs.createWriteStream('tiktok_feed.xml', { flags: 'a' });
//      this.streams.pinterest = fs.createWriteStream('pinterest_feed.xml', { flags: 'a' });

//     const [responseInactiveProducts,responseActiveProducts] = await Promise.all([
//       findInactiveProducts({ offset: 0 }),
//       findActiveProducts({ offset: 0 })
//     ]);   

//     //const responseInactiveProducts = await findInactiveProducts({ offset: 0 });
//     const inactiveRepositoryIds = responseInactiveProducts.map((product: Product) => product.repositoryId);

//     //const responseActiveProducts = await findActiveProducts({ offset: 0 });
//     const filteredActiveProducts = responseActiveProducts.filter((product: Product) => !inactiveRepositoryIds.includes(product.repositoryId));

//     console.log('inactiveRepositoryIds', inactiveRepositoryIds)

//     const [productsList, productsListPinterest, productsListTiktok] = await Promise.all([
//       makeXMLString(filteredActiveProducts),
//       MakeXMLStringPinterest(filteredActiveProducts),
//       MakeXMLStringTiktok(filteredActiveProducts)
//     ]);

//     if (this.streams.standard) {
//       this.streams.standard.write(productsList.products_list);
//       this.streams.standard.write(`
//       </channel>
//       <date>${new Date().toISOString()}</date>
//       </rss>`);
//       this.streams.standard.end();
//     }

//     if (this.streams.tiktok) {
//       this.streams.tiktok.write(productsListTiktok.products_list);
//       this.streams.tiktok.write(`
//       <!-- PROCESSED DATE: ${new Date().toISOString()} -->
//       </feed>`);
//       this.streams.tiktok.end();
//     }

//     if (this.streams.pinterest) {
//       this.streams.pinterest.write(productsListPinterest.products_list);
//       this.streams.pinterest.write(`
//       </channel>
//       <date>${new Date().toISOString()}</date>
//       </rss>`);
//       this.streams.pinterest.end();
//     }

//     // Consolidar a validação dos arquivos XML em uma única chamada de Promise.all
//     const [validateXMLFileTiktok, validateXMLFileProducts, validateXMLFilePinterest] = await Promise.all([
//       this.validateXMLFile('tiktok_feed.xml'),
//       this.validateXMLFile('products_feed.xml'),
//       this.validateXMLFile('pinterest_feed.xml')
//     ]);

//     // //Validação de arquivo xml
//     // await this.validateXMLFile('pinterest_feed.xml');
//     // await this.validateXMLFile('products_feed.xml');
//     // await this.validateXMLFile('tiktok_feed.xml');

//     if(validateXMLFileTiktok && validateXMLFileProducts&& validateXMLFilePinterest){

//       console.log('Todos os arquivos XML são válidos.');
//       //todo: criar workset no occ

//     const responseGetWorkset = await getWorkset();

//     //todo: Pegar id do workset no occ

//     if (responseGetWorkset) {
//       console.log('workset', responseGetWorkset);
//       const { repositoryId } = responseGetWorkset; // Acesse 'repositoryId' dentro de 'data'
//       this.worksetId = repositoryId;

//     } else {
//       const responseCreateWorkset = await createWorkset();
//       const { repositoryId } = responseCreateWorkset;
//       this.worksetId = repositoryId;
//     }

//     console.log('this.worksetId', this.worksetId);

//     //todo: Pulicar no occ with workset

//     // const responseuploadStandardFeed = await uploadStandardFeed(this.worksetId);
//     // const responseuploadTiktokFeed = await uploadTiktokFeed(this.worksetId);
//     // const responseuploadPinterestFeed = await uploadPinterestFeed(this.worksetId);

//     const [responseuploadStandardFeed, responseuploadTiktokFeed, responseuploadPinterestFeed]: [AxiosResponse, AxiosResponse, AxiosResponse] = await Promise.all([
//       await uploadStandardFeed(this.worksetId),
//       await uploadTiktokFeed(this.worksetId),
//       await uploadPinterestFeed(this.worksetId)
//     ]);

//     if (responseuploadStandardFeed && responseuploadTiktokFeed && responseuploadPinterestFeed) {
//       console.log('responseuploadStandardFeed', responseuploadStandardFeed);
//       console.log('responseuploadTiktokFeed', responseuploadTiktokFeed);
//       console.log('responseuploadPinterestFeed', responseuploadPinterestFeed)

//       const responsePublishFeed = await publish(this.worksetId);

//       console.log('responsePublishFeed', responsePublishFeed);
//       return responsePublishFeed;
//     };

//     }else{

//       throw new Error('Um ou mais arquivos XML são inválidos. Por favor tente novamente...');
//     }    

//   } catch (error) {
//     console.log('Error createFeed', error);

//     if (this.streams.standard && !this.streams.standard.writableEnded) {
//       this.streams.standard.end();
//     }
//     if (this.streams.tiktok && !this.streams.tiktok.writableEnded) {
//       this.streams.tiktok.end();
//     }
//     if (this.streams.pinterest && !this.streams.pinterest.writableEnded) {
//       this.streams.pinterest.end();
//     }

//   }

// };

// private createWorkset = async () => {

//   try {
//     const instanceAdmin = axios.create({
//       baseURL: `${process.env.OCC_ADMIN_URL}/ccadmin/v1`,
//     });

//     function login(): Promise<AxiosResponse<{ access_token: string }>> {
//       const data = new URLSearchParams();
//       data.append('grant_type', 'client_credentials');

//       return instanceAdmin.post('login', data, {
//         headers: {
//           Authorization: `Bearer ${process.env.OCC_APP_KEY}`,
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//       });
//     }

//     const {
//       data: { access_token }
//     } = await login();
//     const responseCreateWorkset = await instanceAdmin.post('/worksets', {
//       headers: {
//         Authorization: `Bearer ${access_token}`,
//       },
//       body: JSON.stringify({
//         "name": "novoFeedXml"
//       })
//     });

//     console.log('responseCreateWorkset', responseCreateWorkset);
//     //const {repositoryId} = responseCreateWorkset;

//     return responseCreateWorkset;
//   } catch (error) {
//     console.log('Error createWorkset', error);

//   }
// }

// private findInactiveProducts = async () => {

//   try {
//     const responseInactiveProducts = await findInactiveProducts({ offset: 0 });
//     return responseInactiveProducts;
//   } catch (error) {
//     console.log('Error findInactiveProducts', error);

//   }
// }

// private findActiveProducts = async () => {

//   try {
//     const responseActiveProducts = await findActiveProducts({ offset: 0 });
//     return responseActiveProducts;
//   } catch (error) {
//     console.log('Error findActiveProducts', error);

//   }
// }

// private uploadStandardFeed = () => { };
// private uploadTiktokFeed = () => { };
// private uploadPinterestFeed = () => { };

// private uploadStandardFeed = () => {
//   return new Promise((resolve, reject) => {
//     console.log("Uploading standard file...");
//     const fileStream = fs.createReadStream('./feed_standard.xml');
//     let form = new FormData();
//     form.append('filename', 'xml/feed_standard.xml');
//     form.append('uploadType', "thirdPartyFile");
//     form.append('fileUpload', fileStream, './feed_standard.xml');
//     let headers = form.getHeaders();
//     headers.Authorization = 'Bearer ' + storeSDK.accessToken;
//     headers["x-cc-workset"] = feed_workset_id;
//     let urlForFiles = storeSDK.host + "/ccadmin/v1/files";
//     axios.request({
//       url: urlForFiles,
//       method: 'POST',
//       headers: headers,
//       data: form
//     }).then(resp => {
//       resolve();
//     }).catch(error => {
//       reject(error);
//     });
//   });
// };

// private uploadTiktokFeed = () => {
//   return new Promise((resolve, reject) => {
//     console.log("Uploading tiktok file...");
//     const fileStreamTiktok = fs.createReadStream('./tiktok_feed.xml');
//     let form = new FormData();
//     form.append('filename', 'xml/tiktok_feed.xml');
//     form.append('uploadType', "thirdPartyFile");
//     form.append('fileUpload', fileStreamTiktok, './tiktok_feed.xml');
//     let headers = form.getHeaders();
//     headers.Authorization = 'Bearer ' + storeSDK.accessToken;
//     headers["x-cc-workset"] = feed_workset_id;
//     let urlForFiles = storeSDK.host + "/ccadmin/v1/files";
//     axios.request({
//       url: urlForFiles,
//       method: 'POST',
//       headers: headers,
//       data: form
//     }).then(resp => {
//       resolve();
//     }).catch(error => {
//       reject(error);
//     });
//   });
// };

// private uploadPinterestFeed = () => {
//   return new Promise((resolve, reject) => {
//     console.log("Uploading Pinterest file...");
//     const fileStreamPinterest = fs.createReadStream('./pinterest_feed.xml');
//     let form = new FormData();
//     form.append('filename', 'xml/pinterest_feed.xml');
//     form.append('uploadType', "thirdPartyFile");
//     form.append('fileUpload', fileStreamPinterest, './pinterest_feed.xml');
//     let headers = form.getHeaders();
//     headers.Authorization = 'Bearer ' + storeSDK.accessToken;
//     headers["x-cc-workset"] = feed_workset_id;
//     let urlForFiles = storeSDK.host + "/ccadmin/v1/files";
//     axios.request({
//       url: urlForFiles,
//       method: 'POST',
//       headers: headers,
//       data: form
//     }).then(resp => {
//       resolve();
//     }).catch(error => {
//       reject(error);
//     });
//   });
// };

//! não utilizamos mais updateMarketCloudProducts 

//   const updateMarketCloudProducts = (res, attempt, resolve, reject) => {
//     loggers.error(`SB: [updateMarketCloudProducts]`);
//     let marketCloudProductsLastCall = process.env['marketCloudProductsLastCall'];
//     loggers.error(`[updateMarketCloudProducts] ${marketCloudProductsLastCall}`);

//     if (marketCloudProductsLastCall < moment().subtract(1, "hour").format("YYYY-MM-DDTHH:mm:ss.000")) {
//         axios.post("https://mc2mp9dxtw5jg8ndk3vw1svjgjkq.auth.marketingcloudapis.com/v2/token", {
//             "client_id": "l3mj6bqqyogzutvzooqkws40",
//             "client_secret": "3bfk4KrAigV32cvUo4PwTfhV",
//             "grant_type": "client_credentials"
//         }).then(resp => {
//             loggers.error(`SB: [updateMarketCloudProducts] token RESPONSE `);
//             loggers.error(resp);
//             if (resp.data && resp.data.access_token) {
//                 let customConfig = {
//                     headers: {
//                         'Authorization': 'Bearer ' + resp.data.access_token
//                     }
//                 };

//                 axios.post("https://mc2mp9dxtw5jg8ndk3vw1svjgjkq.rest.marketingcloudapis.com/data/v1/async/dataextensions/key:2022110195874/rows", {
//                         "items": arr_items
//                     },
//                     customConfig
//                 ).then(resp2 => {
//                     loggers.error(`SB: [updateMarketCloudProducts] update token  `);
//                     loggers.error(resp2);
//                     let customOCcConfig = {
//                         headers: {
//                             'Authorization': 'Bearer ' + storeSDK.accessToken
//                         }
//                     };
//                     axios.put(storeSDK.host + "/ccadmin/v1/extensionEnvironmentVariables/400001", {
//                             "name": "marketCloudProductsLastCall",
//                             "value": moment().format("YYYY-MM-DDTHH:mm:ss.000")
//                         },
//                         customOCcConfig
//                     ).then(resp2 => {
//                         loggers.error(`SB: [updateMarketCloudProducts] /ccadmin/v1/extensionEnvironmentVariables/400001  `);
//                         loggers.error(resp2);
//                         resolve("Finalizado. End: " + new Date().toISOString());
//                         // res.status(200).json({
//                         //     status: 200,
//                         //     message: "Finalizado. End: " + new Date().toISOString()
//                         // });
//                     }).catch(error => {
//                         loggers.error(`SB: [updateMarketCloudProducts] /ccadmin/v1/extensionEnvironmentVariables/400001 error `);
//                         loggers.error(error);
//                         console.log(`[updateMarketCloudProducts] ${error}`);
//                         reject(error);
//                     });
//                 }).catch(error => {
//                     loggers.error(`SB: [updateMarketCloudProducts] update token  error`);
//                     loggers.error(error);
//                     if (attempt < 5) {
//                         updateMarketCloudProducts(res, ++attempt)
//                     } else {
//                         console.log(`[updateMarketCloudProducts] ${error}`);
//                         // res.status(500).json({
//                         //     status: 500,
//                         //     message: error.message ? error.message : "internal serve error"
//                         // })
//                         reject(error);
//                     }
//                 });
//             }

//         }).catch(error => {
//             loggers.error(`SB: [updateMarketCloudProducts] token RESPONSE error`);
//             loggers.error(error);
//             console.log(`[updateMarketCloudProducts] ${error}`);
//             reject(error);
//         });
//     } else {
//         resolve("Finalizado sem publicar, End: " + new Date().toISOString());
//         // res.status(200).json({
//         //     status: 200,
//         //     message: "Finalizado sem publicar, End: " + new Date().toISOString()
//         // });
//     }
// }
exports.FeedService = FeedService;
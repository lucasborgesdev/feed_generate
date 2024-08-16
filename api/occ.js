"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findUserByEmail = exports.findInactiveProducts = exports.findActiveProducts = exports.createWorkset = void 0;
exports.getErrorData = getErrorData;
exports.listProductsPrice = exports.getWorkset = void 0;
exports.login = login;
exports.publish = publish;
exports.uploadExtension = uploadExtension;
exports.uploadPinterestFeed = uploadPinterestFeed;
exports.uploadStandardFeed = uploadStandardFeed;
exports.uploadTiktokFeed = uploadTiktokFeed;
var _fs = _interopRequireDefault(require("fs"));
var _path = _interopRequireDefault(require("path"));
var _axios = _interopRequireDefault(require("axios"));
var _formData = _interopRequireDefault(require("form-data"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const instanceAdmin = _axios.default.create({
  baseURL: `${process && process.env && process.env.OCC_ADMIN_URL || "https://p7724145c1prd-admin.occa.ocs.oraclecloud.com"}/ccadmin/v1`
});
const instanceStore = _axios.default.create({
  baseURL: `${process && process.env && process.env.OCC_STORE_URL || "https://p7724145c1prd-store.occa.ocs.oraclecloud.com"}/ccstore/v1`,
  headers: {
    Authorization: 'Basic YWRtaW46YWRtaW4='
  }
});
function login() {
  const data = new URLSearchParams();
  data.append('grant_type', 'client_credentials');
  return instanceAdmin.post('login', data, {
    headers: {
      Authorization: `Bearer ${process && process.env && process.env.OCC_APP_KEY || "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxNGIxMmQ5My0xYzRiLTQzOTctYTFjMS0zMDI3NTMwNWMzNmYiLCJpc3MiOiJhcHBsaWNhdGlvbkF1dGgiLCJleHAiOjE3NTQxNTM0MjEsImlhdCI6MTcyMjYxNzQyMX0=.CJb6/lqZP5Yh00+uvCP/AJPbrjwRFJAJbwiyxnT9+cI="}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  });
}
function uploadExtension(access_token) {
  const filePath = _path.default.resolve(process.cwd(), 'dist', 'bundle.zip');
  const data = new _formData.default();
  data.append('filename', `${process && process.env && process.env.SSE_NAME || "LH_feedGenerator"}.zip`);
  data.append('uploadType', 'extensions');
  data.append('force', 'true');
  data.append('fileUpload', _fs.default.createReadStream(filePath));
  return instanceAdmin.post('serverExtensions', data, {
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'multipart/form-data'
    }
  });
}
const listProductsPrice = async ({
  offset = 0
}) => {
  const {
    data
  } = await instanceStore.get('/products', {
    params: {
      fields: 'id,listPrices,childSKUs.repositoryId',
      limit: 250,
      offset
    }
  });
  return data;
};
exports.listProductsPrice = listProductsPrice;
const findInactiveProducts = async ({
  offset = 0,
  accumulatedItems = []
}) => {
  const {
    data: {
      access_token
    }
  } = await login();
  const {
    data
  } = await instanceAdmin.get('/products', {
    headers: {
      Authorization: `Bearer ${access_token}`
    },
    params: {
      queryFormat: 'scim',
      offset,
      categoryId: 339,
      q: 'type ne "blog" and displayName ne null and active eq true',
      fields: "repositoryId"
    }
  });
  const newAccumulatedItems = accumulatedItems.concat(data.items);
  if (data.items.length === 250) {
    return findActiveProducts({
      offset: offset + 250,
      accumulatedItems: newAccumulatedItems
    });
  }
  return newAccumulatedItems;
};
exports.findInactiveProducts = findInactiveProducts;
const findActiveProducts = async ({
  offset = 0,
  accumulatedItems = []
}) => {
  const {
    data: {
      access_token
    }
  } = await login();
  try {
    const {
      data
    } = await instanceAdmin.get('/products', {
      headers: {
        Authorization: `Bearer ${access_token}`
      },
      params: {
        unassigned: "false",
        orphaned: "false",
        showInactiveProducts: "false",
        queryFormat: "SCIM",
        q: 'type ne "blog" and type ne "gift" and displayName ne null and active eq true',
        fields: "displayName,excludeFromSitemap,route,description,repositoryId,primaryFullImageURL,sourceImageURLs,listPrice,salePrice,brand,barcode,childSKUs,x_productType",
        minimalList: "false",
        offset
      }
    });

    // Acumular os itens retornados
    const newAccumulatedItems = accumulatedItems.concat(data?.items);

    // Verificar se há mais produtos a serem buscados
    if (data.items.length === 250) {
      return findActiveProducts({
        offset: offset + 250,
        accumulatedItems: newAccumulatedItems
      });
    }
    return newAccumulatedItems;
  } catch (error) {
    console.log(error);
  }
};
exports.findActiveProducts = findActiveProducts;
const findUserByEmail = async email => {
  try {
    const {
      data: {
        access_token
      }
    } = await login();
    const params = {
      includeResult: "full",
      queryFormat: "SCIM",
      "q": "email" + " eq " + '"' + email + '"',
      access_token: access_token // Add this line to pass the access_token in the URL
    };

    return await instanceAdmin.get('profiles', {
      params
    });
  } catch (error) {
    // handle error
  }
};
exports.findUserByEmail = findUserByEmail;
const getWorkset = async () => {
  try {
    const {
      data: {
        access_token
      }
    } = await login();
    const response = await instanceAdmin.get('/worksets', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    const items = response.data.items;
    const getWorksetFeed = items.find(item => item.name === 'novoFeedXml');
    console.log('getWorksetFeed', getWorksetFeed);
    if (getWorksetFeed) {
      return getWorksetFeed;
    } else {
      return null;
    }
  } catch (error) {
    console.log('error ====>', error);
  }
};
exports.getWorkset = getWorkset;
const createWorkset = async () => {
  //!Tive que criar dessa forma pois no modelo padrão não estava conseguindo criar.

  try {
    const {
      data: {
        access_token
      }
    } = await login();
    let data = JSON.stringify({
      "name": "novoFeedXml",
      "repositoryId": "novoFeedXml"
    });
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://p7724145c1prd-admin.occa.ocs.oraclecloud.com/ccadmin/v1/worksets',
      headers: {
        'Authorization': `Bearer ${access_token}`,
        'Content-Type': 'application/json'
      },
      data: data
    };
    const responseRequestCreateWorkset = await _axios.default.request(config).then(response => {
      console.log(JSON.stringify(response.data));
      return response.data;
    }).catch(error => {
      console.log(error);
    });
    return await responseRequestCreateWorkset;
  } catch (error) {
    console.log('eeror workset', error.message);
  }
};
exports.createWorkset = createWorkset;
function getErrorData(error) {
  return _axios.default.isAxiosError(error) && error.response?.data || error.message;
}
async function uploadStandardFeed(feed_workset_id) {
  const {
    data: {
      access_token
    }
  } = await login();
  console.log('*** upload standard feed ***');
  const filePath = _path.default.resolve(process.cwd(), 'products_feed.xml');
  const data = new _formData.default();
  const fileStream = _fs.default.createReadStream(filePath);
  data.append('filename', 'xml/products_feed.xml');
  data.append('uploadType', "thirdPartyFile");
  data.append('fileUpload', fileStream);
  const returnUploadStandardFeed = await instanceAdmin.post('files', data, {
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'multipart/form-data',
      "x-cc-workset": feed_workset_id
    }
  });
  const {
    success
  } = returnUploadStandardFeed.data;
  return success;
}
async function uploadTiktokFeed(feed_workset_id) {
  const {
    data: {
      access_token
    }
  } = await login();
  console.log('*** upload tiktok feed ***');
  const filePath = _path.default.resolve(process.cwd(), 'tiktok_feed.xml');
  const data = new _formData.default();
  const fileStream = _fs.default.createReadStream(filePath);
  data.append('filename', 'xml/tiktok_feed.xml');
  data.append('uploadType', "thirdPartyFile");
  data.append('fileUpload', fileStream);
  const retunUploadTiktok = await instanceAdmin.post('files', data, {
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'multipart/form-data',
      "x-cc-workset": feed_workset_id
    }
  });
  const {
    success
  } = await retunUploadTiktok.data;
  return success;
}
async function uploadPinterestFeed(feed_workset_id) {
  const {
    data: {
      access_token
    }
  } = await login();
  console.log('*** upload pinterest feed ***');
  const filePath = _path.default.resolve(process.cwd(), 'pinterest_feed.xml');
  const data = new _formData.default();
  const fileStream = _fs.default.createReadStream(filePath);
  data.append('filename', 'xml/pinterest_feed.xml');
  data.append('uploadType', "thirdPartyFile");
  data.append('fileUpload', fileStream);
  const returnUploadPinterest = await instanceAdmin.post('files', data, {
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'multipart/form-data',
      "x-cc-workset": feed_workset_id
    }
  });
  const {
    success
  } = returnUploadPinterest.data;
  return success;
}
async function publish(feed_workset_id) {
  const {
    data: {
      access_token
    }
  } = await login();
  const data = {
    operationType: "selective_publish",
    name: "feed do lucas",
    worksetId: feed_workset_id
  };
  console.log('*** publish ***');
  const responsePublish = await instanceAdmin.post('publishingChangeLists/publish', data, {
    headers: {
      Authorization: `Bearer ${access_token}`,
      "x-cc-workset": feed_workset_id
    }
  });
  const {
    statusMessage
  } = responsePublish.data;
  return statusMessage;
}
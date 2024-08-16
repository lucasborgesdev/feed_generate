"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeXMLString = void 0;
// Certifique-se de ajustar o caminho conforme necessário

const makeXMLString = async response => {
  console.log('ola');
  let products_list = "";
  const arrayNotDisplayProducts = []; // Defina este array conforme necessário
  const DOMAIN_URL = process && process.env && process.env.DOMAIN_URL || "https://www.salonline.com.br"; // Defina o domínio correto
  let excludeFromSitemapCounter = 0;
  const arr_items = []; // Defina o tipo correto se necessário

  try {
    if (response) {
      //console.log('response ===>', response);
      response.forEach(product => {
        if (product.childSKUs?.length > 0) {
          for (let index_2 in product.childSKUs) {
            let sku = product.childSKUs[index_2];
            let secondaryImage = sku.sourceImageURLs?.lenght > 1 ? sku.sourceImageURLs[1] : "";
            if (secondaryImage == "") {
              secondaryImage = product.sourceImageURLs && product.sourceImageURLs.lenght > 1 ? product.sourceImageURLs[1] : "";
            }
            let salePrice = sku.salePrice ? sku.salePrice + " BRL" : product.salePrice ? product.salePrice + " BRL" : "";
            let listPrice = sku.listPrice ? sku.listPrice + " BRL" : product.listPrice ? product.listPrice + " BRL" : "";
            let hasStock = sku.quantity;
            let brand = sku.brand ? sku.brand : product.brand;
            let barcode = sku.barcode ? sku.barcode : product.barcode;
            if (!product.excludeFromSitemap) {
              products_list = products_list + `        <item>
        <title>
        <![CDATA[ ${product.displayName} ]]>
        </title>
        <link>${DOMAIN_URL}${product.route}</link>
        <description>
        <![CDATA[ ${product.description} ]]>
        </description>
        <g:id>${product.repositoryId}</g:id>
        <g:image_link>${DOMAIN_URL}${product.primaryFullImageURL}</g:image_link>
        <g:additional_image_link>${DOMAIN_URL}${secondaryImage}</g:additional_image_link>
        <g:price>${listPrice}</g:price>
        <g:sale_price>${salePrice}</g:sale_price>
        <g:brand>${brand}</g:brand>
        <g:gtin>${barcode}</g:gtin>
        <g:condition>new</g:condition>
        <g:availability>${hasStock ? 'in stock' : 'out of stock'} </g:availability>
        <g:producttype/>
    </item>
`;
              arr_items.push({
                "nome_produto": product.displayName ? product.displayName : "",
                "descricao_produto": product.description ? product.description : "",
                "disponibilidade": "disponível",
                "url_produto": product.route ? DOMAIN_URL + product.route : "",
                "url_imagem": product.primaryFullImageURL ? DOMAIN_URL + product.primaryFullImageURL : "",
                "cod_produto": product.repositoryId ? product.repositoryId : "",
                "sku": sku.repositoryId ? sku.repositoryId : "",
                "Preco": salePrice ? salePrice : listPrice,
                "Marca": brand ? brand : ""
              });
            } else {
              excludeFromSitemapCounter++;
              return products_list;
            }
          }
        }
      });
    }
  } catch (error) {
    console.log('error');
  }
  return {
    products_list,
    arr_items
  };
};
exports.makeXMLString = makeXMLString;
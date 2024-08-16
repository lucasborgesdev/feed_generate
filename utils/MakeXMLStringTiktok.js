"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MakeXMLStringTiktok = void 0;
// Certifique-se de ajustar o caminho conforme necessário

const MakeXMLStringTiktok = async response => {
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
          // console.log("SB Child SKUs found");
          for (let index_2 in product.childSKUs) {
            // console.log("SB in for loop for product.childSKUs");
            let sku = product.childSKUs[index_2];
            let secondaryImage = sku?.sourceImageURLs?.length > 1 ? sku.sourceImageURLs[1] : "";
            if (secondaryImage == "") {
              secondaryImage = product.sourceImageURLs?.length > 1 ? product.sourceImageURLs[1] : "";
            }
            let salePrice = sku.salePrice ? sku.salePrice + " BRL" : product.salePrice ? product.salePrice + " BRL" : "";
            let listPrice = sku.listPrice ? sku.listPrice + " BRL" : product.listPrice ? product.listPrice + " BRL" : "";
            let hasStock = sku.quantity;
            let brand = sku.brand ? sku.brand : product.brand;
            let barcode = sku.barcode ? sku.barcode : product.barcode;
            if (!product.excludeFromSitemap) {
              // console.log("SB: If loop to write products_list");
              products_list = products_list + `        
                <entry>
                  <g:id>${product.repositoryId || 'xx'}</g:id>
                  <g:title> <![CDATA[ ${product.displayName || 'xx'} ]]> </g:title>
                  <g:description> <![CDATA[ ${product.description || 'xx'} ]]> </g:description>
                  <g:availability>${hasStock ? 'in stock' : 'out of stock'} </g:availability>
                  <g:condition>new</g:condition>
                  <g:price>${listPrice || 'xx'}</g:price>
                  <g:link>${DOMAIN_URL}${product.route}</g:link>
                  <g:image_link>${DOMAIN_URL}${product.primaryFullImageURL}</g:image_link>
                  <g:brand>${brand || 'xx'}</g:brand>
                  ${product.sl_videoLink ? `<g:video_link>${product.sl_videoLink}</g:video_link>` : ''}
                  <g:additional_image_link></g:additional_image_link>
                  <g:age_group>${product.sl_ageRange || 'xx'}</g:age_group>
                  <g:color>${product.sl_colorTag || 'xx'}</g:color>
                  <g:gender>unisex</g:gender>
                  <g:item_group_id>xx</g:item_group_id>
                  <g:google_product_category>xx</g:google_product_category>
                  <g:material>xx</g:material>
                  <g:pattern>xx</g:pattern>
                  <g:product_type>${product.x_productType || 'xx'}</g:product_type>
                  <g:sale_price>${salePrice || 'xx'}</g:sale_price>
                  <g:sale_price_effective_date>${product.salePriceStartDate || 'xx'}</g:sale_price_effective_date>
                  <g:shipping>
                      <g:country>UK</g:country>
                      <g:state>CA</g:state>
                      <g:shipping_type>Standard</g:shipping_type>
                      <g:price>4.95 GBP</g:price>
                      <g:service>Standard</g:service>
                  </g:shipping>
                  <g:shipping_weight>${product.weight || 'xx'}</g:shipping_weight>
                  <g:size>${product.sl_productSize || 'xx'}</g:size>
                  <g:tax>${product.taxCode || 'xx'}</g:tax>
                  <g:custom_label_0>xx</g:custom_label_0>
                  <g:custom_label_1>xx</g:custom_label_1>
                  <g:custom_label_2>xx</g:custom_label_2>
                  <g:custom_label_3>xx</g:custom_label_3>
                  <g:custom_label_4>xx</g:custom_label_4>
                  <applink property="ios_url" content="example-ios://electronic" />
                  <applink property="ios_app_store_id" content="42" />
                  <applink property="ios_app_name" content="Electronic Example." />
                  <applink property="iphone_url" content="example-..." />
                  <applink property="iphone_app_store_id" content="43" />
                  <applink property="iphone_app_name" content="Electronic Example" />
                  <applink property="ipad_url" content="example-ipad://electronic" />
                  <applink property="ipad_app_store_id" content="44" />
                  <applink property="ipad_app_name" content="Electronic iPad" />
                  <applink property="android_url" content="example-android://" />
                  <applink property="android_package" content="com.electronic" />
                  <applink property="android_app_name" content="Example" />
                  <g:gtin>${barcode}</g:gtin>
                  <g:mpn>xxxx</g:mpn>
      </entry>
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
exports.MakeXMLStringTiktok = MakeXMLStringTiktok;
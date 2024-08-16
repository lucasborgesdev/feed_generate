"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOrderDeliveryType = exports.getOrderCommerceItemUnitPrice = exports.getOrderCardType = void 0;
const getOrderCommerceItemUnitPrice = commerceItem => {
  const {
    listPrice,
    salePrice
  } = commerceItem.priceInfo;
  const hasSalePrice = salePrice && Number(salePrice) > 0;
  return hasSalePrice ? salePrice : listPrice;
};
exports.getOrderCommerceItemUnitPrice = getOrderCommerceItemUnitPrice;
const getOrderCardType = cardType => {
  if (cardType.toLowerCase() === 'creditcard') return 'CREDITO';
  if (cardType.toLowerCase() === 'debitcard') return 'DEBITO';
  return cardType.toUpperCase();
};
exports.getOrderCardType = getOrderCardType;
const getOrderDeliveryType = dType => {
  if (dType === 'Entrega Normal') return 'ENTREGA';
  if (dType === 'Entrega Express') return 'EXPRESS';
  if (dType === 'Entrega Drive Thru') return 'DRIVE';
  return dType.toUpperCase();
};
exports.getOrderDeliveryType = getOrderDeliveryType;
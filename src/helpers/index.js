import handle400Error from './handle400Error';

function ordinalSuffixOf(i) {
  var j = i % 10,
      k = i % 100;
  if (j == 1 && k != 11) {
      return i + "st";
  }
  if (j == 2 && k != 12) {
      return i + "nd";
  }
  if (j == 3 && k != 13) {
      return i + "rd";
  }
  return i + "th";
}

const getDeleteApiQueryParam = (selectedIndexes, list, paramName = '', key = 'id') => {
  let queryParam = '';
  
  if(paramName == '') {
    return '';
  }

  selectedIndexes.forEach((currentIndex) => {
    const currentObject = list[currentIndex];
    const paramString = `${paramName}=${currentObject[key]}`;

    if(queryParam == '') {
        queryParam = `?${paramString}`
    } else {
        queryParam = queryParam + `&${paramString}`
    }
  });

  return queryParam;
};

const getFormattedVouchers = (voucherObj = {}) => {
  const { 
      vouchers = [],
      is_single,
      client,
      expiry_date,
      cost,
      voucher_detail,
      image
  } = voucherObj;

  const formattedVouchers = vouchers.map((voucher) => {
    return {
        ...voucher,
        is_single,
        client,
        expiry_date,
        cost,
        voucher_detail,
        ...(image ? {image} : {})
    }
  });

  return formattedVouchers;
};

const getQueryParamFromUrl = (url = window.location.search, key) => {
  const queryParam = new URLSearchParams(url);
  const param = queryParam.get(key);

  return param;
}

export default {
  handle400Error,
  ordinalSuffixOf,
  getDeleteApiQueryParam,
  getFormattedVouchers,
  getQueryParamFromUrl
};
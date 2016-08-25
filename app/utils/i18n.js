import I18n from 'react-native-i18n';

I18n.fallbacks = true;

I18n.translations = {
  en: {
    main: 'Bitcoin Calculator',
    add: 'Add',
    details: 'Details',
    more: 'More',
    info: 'Info',
    others: 'Others',
    disclaimer: 'Disclaimer',
    disclaimer_full: 'All data is gathered from Bitcoin Average, we do not guarantee its accuracy for any use.\n\nNothing presented here is an investment recommendation and any data or content should not be relied upon for any investment activities.\n\nIn no event will we be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this app.',
    rate_us: 'Rate us!',
    view_more_bt_this_developer: 'View More by This Developer'
  },
  zh: {
    main: 'Bitcoin 計算器',
    add: '添加',
    details: '詳細資料',
    more: '更多',
    info: '信息',
    others: '其他',
    disclaimer: '免責聲明',
    disclaimer_full: '本應用程序內的資料由 Bitcoin Average 提供，只供參考和一般資訊之用，而並非有提供全面資訊或任何投資或其他專業意見之意。我們並不保證或陳述該等資料是否完整、準確或最新，如因使用或進入本應用程序而招致任何損失或損害，我們概不負上任何責任。',
    rate_us: '請給我們評價',
    view_more_bt_this_developer: '你可能有興趣的應用程式'
  },
};

export default I18n;

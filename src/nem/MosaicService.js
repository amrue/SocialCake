exports.__esModule = true;
var nem_library_1 = require('nem-library');
var TransactionService_1 = require('./TransactionService');
var _ = require('lodash');
var AccountUtils_1 = require('./AccountUtils');
var mosaicHttp = new nem_library_1.MosaicHttp();
// TODO: description should be passed in
var createMosaic = function(mosaicName, namespaceName) {
  var mosaicDefinitionTransaction = nem_library_1.MosaicDefinitionCreationTransaction.create(
    nem_library_1.TimeWindow.createWithDeadline(),
    new nem_library_1.MosaicDefinition(
      AccountUtils_1.getPublicAccount('org'),
      new nem_library_1.MosaicId(namespaceName, mosaicName),
      'this is a description',
      new nem_library_1.MosaicProperties(0, 100000, false, true),
    ),
  );
  return TransactionService_1.signAndBroadcastTransaction(
    mosaicDefinitionTransaction,
  );
};
exports.createMosaic = createMosaic;
var getAllMosaics = function(namespaceName) {
  return mosaicHttp.getAllMosaicsGivenNamespace(namespaceName).map(function(m) {
    return m.map(function(m) {
      return _.get(m, 'id.name');
    });
  });
};
exports.getAllMosaics = getAllMosaics;
var sendSingleMosaic = function(namespaceName, mosaicName, recipientAddress) {
  var mosaicId = new nem_library_1.MosaicId(namespaceName, mosaicName);
  return mosaicHttp
    .getMosaicTransferableWithAmount(mosaicId, 1)
    .map(function(m) {
      return nem_library_1.TransferTransaction.createWithMosaics(
        nem_library_1.TimeWindow.createWithDeadline(),
        new nem_library_1.Address(recipientAddress),
        [m],
        nem_library_1.EmptyMessage,
      );
    })
    .flatMap(function(t) {
      return TransactionService_1.signAndBroadcastTransaction(t);
    });
};
exports.sendSingleMosaic = sendSingleMosaic;

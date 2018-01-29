exports.__esModule = true;
var nem_library_1 = require('nem-library');
var TransactionService_1 = require('./TransactionService');
var _ = require('lodash');
var AccountUtils_1 = require('./AccountUtils');
var mosaicHttp = new nem_library_1.MosaicHttp();
var createMosaic = function(mosaicName, namespaceName, fileData) {
  // update so price is = to price minus fees which I think are 15000 XEM? verify
  var mosaicLevy = new nem_library_1.MosaicLevy(
    nem_library_1.MosaicLevyType.Absolute,
    new nem_library_1.Address(fileData.owner),
    new nem_library_1.MosaicId('nem', 'xem'),
    fileData.price,
  );
  // if not limited quantity, then set arbitrary quantity and allow supply to be mutated
  var defaultProperties = new nem_library_1.MosaicProperties(
    0,
    100000,
    false,
    true,
  );
  var mosaicDefinitionTransaction = nem_library_1.MosaicDefinitionCreationTransaction.create(
    nem_library_1.TimeWindow.createWithDeadline(),
    new nem_library_1.MosaicDefinition(
      AccountUtils_1.getPublicAccount(),
      new nem_library_1.MosaicId(namespaceName, mosaicName.toLowerCase()),
      'this is a description',
      fileData.limitedQuantity
        ? new nem_library_1.MosaicProperties(
            0,
            fileData.limitedQuantity,
            false,
            false,
          )
        : defaultProperties,
      mosaicLevy,
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

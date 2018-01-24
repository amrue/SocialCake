exports.__esModule = true;
var nem_library_1 = require('nem-library');
var userPrivateKey = ''; // hardcode in a private key for now
var account = nem_library_1.Account.createWithPrivateKey(userPrivateKey);
var getAddress = function() {
  return account.address;
};
exports.getAddress = getAddress;
var getAccount = function() {
  return account;
};
exports.getAccount = getAccount;
var getPublicAccount = function() {
  return nem_library_1.PublicAccount.createWithPublicKey(account.publicKey);
};
exports.getPublicAccount = getPublicAccount;

import { Address, Account, PublicAccount } from "nem-library";

const userPrivateKey: string = process.env.USER_PRIVATE_KEY;
const orgPrivateKey: string = process.env.ORG_PRIVATE_KEY;

let accounts:{ [index:string] : Account} = {};
accounts['org'] = Account.createWithPrivateKey(orgPrivateKey);
accounts['user'] = Account.createWithPrivateKey(userPrivateKey);

const getAddress = (type : string) => {
  return accounts[type].address;
}

const getAccount = (type: string) => {
  return accounts[type];
}

const getPublicAccount = (type: string) => {
  return PublicAccount.createWithPublicKey(accounts[type].publicKey);
}

export {
  getAddress,
  getAccount,
  getPublicAccount
}

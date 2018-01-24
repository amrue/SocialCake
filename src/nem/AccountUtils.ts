import { Address, Account, PublicAccount } from "nem-library";

const userPrivateKey: string = ''; // hardcode in a private key for now

let account: Account = Account.createWithPrivateKey(userPrivateKey);

const getAddress = () => {
  return account.address;
}

const getAccount = () => {
  return account;
}

const getPublicAccount = () => {
  return PublicAccount.createWithPublicKey(account.publicKey);
}

export {
  getAddress,
  getAccount,
  getPublicAccount
}

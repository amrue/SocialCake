import { TimeWindow, MosaicDefinition, MosaicDefinitionCreationTransaction, Address, EmptyMessage, TransferTransaction, PublicAccount, MosaicId, MosaicProperties, MosaicLevy, MosaicHttp, MosaicLevyType, Message } from "nem-library";
import { XEM } from "nem-library/dist/src/models/mosaic/XEM";
import { signAndBroadcastTransaction } from "./TransactionService";
import * as Rx from 'rxjs';
import * as _ from 'lodash';
import { getPublicAccount, getAccount, getPublicAccountFromKey } from './AccountUtils';
import * as NamespaceService from "./NamespaceService";
declare let process: any;

const mosaicHttp = new MosaicHttp();

const createMosaic = (mosaicName: string, namespaceName: string, fileData) => {
  // update so price is = to price minus fees which I think are 15000 XEM? verify
  const mosaicLevy: MosaicLevy = new MosaicLevy(MosaicLevyType.Absolute, new Address(fileData.owner), new MosaicId('nem', 'xem'), fileData.price);

  // if not limited quantity, then set arbitrary quantity and allow supply to be mutated
  const defaultProperties: MosaicProperties = new MosaicProperties(0, 100000, false, true);

  const mosaicDefinitionTransaction = MosaicDefinitionCreationTransaction.create(
    TimeWindow.createWithDeadline(),
    new MosaicDefinition(
      getPublicAccount(),
      new MosaicId(namespaceName, mosaicName.toLowerCase()),
      "this is a description",
      fileData.limitedQuantity ? new MosaicProperties(0, fileData.limitedQuantity, false, false) : defaultProperties,
      mosaicLevy,
    )
  )

  return signAndBroadcastTransaction(mosaicDefinitionTransaction);
};

const getAllMosaics = (namespaceName: string) => {
  return mosaicHttp
    .getAllMosaicsGivenNamespace(namespaceName)
    .map(m => m.map(m => _.get(m, 'id.name')));
}

const sendSingleMosaicWithEncryptedMessage = (namespaceName: string, mosaicName: string, recipientKey: string, message: string) => {
  const account = getAccount();
  const recipientAccount: PublicAccount = getPublicAccountFromKey(recipientKey);
  const encryptedMessage = account.encryptMessage(message, recipientAccount);

  return sendSingleMosaic(namespaceName, mosaicName, recipientAccount.address, encryptedMessage);
};

const sendSingleMosaic = (namespaceName: string, mosaicName: string, recipientAddress: Address, messageObject: Message) => {
  return mosaicHttp
    .getMosaicTransferableWithAmount(new MosaicId(namespaceName, mosaicName), 1)
    .map(m => TransferTransaction.createWithMosaics(
      TimeWindow.createWithDeadline(),
      recipientAddress,
      [m],
      messageObject
    ))
    .flatMap(t => signAndBroadcastTransaction(t));
}

export {
  createMosaic,
  getAllMosaics,
  sendSingleMosaic,
}

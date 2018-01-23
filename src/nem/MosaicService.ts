import { TimeWindow, MosaicDefinition, MosaicDefinitionCreationTransaction, Address, EmptyMessage, TransferTransaction, PublicAccount, MosaicId, MosaicProperties, MosaicLevy, MosaicHttp } from "nem-library";
import { XEM } from "nem-library/dist/src/models/mosaic/XEM";
import { signAndBroadcastTransaction } from "./TransactionService";
import * as Rx from 'rxjs';
import * as _ from 'lodash';
import { getPublicAccount } from './AccountUtils';
import * as NamespaceService from "./NamespaceService";
declare let process: any;

const mosaicHttp = new MosaicHttp();

// TODO: description should be passed in
const createMosaic = (mosaicName: string, namespaceName: string) => {
  const mosaicDefinitionTransaction = MosaicDefinitionCreationTransaction.create(
    TimeWindow.createWithDeadline(),
    new MosaicDefinition(
      getPublicAccount('org'),
      new MosaicId(namespaceName, mosaicName),
      "this is a description",
      new MosaicProperties(0, 100000, false, true),
    )
  )

  return signAndBroadcastTransaction(mosaicDefinitionTransaction);
};

const getAllMosaics = (namespaceName: string) => {
  return mosaicHttp
    .getAllMosaicsGivenNamespace(namespaceName)
    .map(m => m.map(m => _.get(m, 'id.name')));
}

const sendSingleMosaic = (namespaceName: string, mosaicName: string, recipientAddress: string) => {
  const mosaicId: MosaicId = new MosaicId(namespaceName, mosaicName)

  return mosaicHttp
    .getMosaicTransferableWithAmount(mosaicId, 1)
    .map(m => TransferTransaction.createWithMosaics(
      TimeWindow.createWithDeadline(),
      new Address(recipientAddress),
      [m],
      EmptyMessage
    ))
    .flatMap(t => signAndBroadcastTransaction(t));
};

export {
  createMosaic,
  getAllMosaics,
  sendSingleMosaic,
}

import { createCollectionDatasource, Collection, Initialized, Transfer, RoleGranted, RoleRevoked, Mint } from '../types';
import { MoonbeamEvent } from '@subql/contract-processors/dist/moonbeam';
import { BigNumber, utils } from "ethers";

// Setup types from ABI
type CreateCollectionEventArgs = [string, BigNumber, string, string] & { collection: string; royalties: BigNumber; owner: string; collectionId: string };
type InitializedEventArgs = [string, string] & { owner: string; collectionId: string };
type TransferEventArgs = [string, string, BigNumber] & { from: string; to: string; tokenId: BigNumber; };
type RoleGrantedEventArgs = [string, string, string] & { role: string; account: string; sender: string; };
type RoleRevokedEventArgs = [string, string, string] & { role: string; account: string; sender: string; };
type MintEventArgs = [string, string, BigNumber, string] & { minter: string; to: string; tokenId: BigNumber; tokenHash: string; };

// Events emitted by the factory contract

export async function handleNewCollection(event: MoonbeamEvent<CreateCollectionEventArgs>): Promise<void> {
    const collection = new Collection(event.transactionHash);
    collection.collection = event.args.collection;
    collection.royalties = event.args.royalties.toBigInt();
    collection.owner = event.args.owner;
    collection.collectionId = event.args.collectionId;
    await collection.save();
    await createCollectionDatasource({ address: collection.collection });
    logger.info(`Collection creation event processed: collection address: ${collection.collection}`);
}

// Events emitted by the Collection contracts

export async function handleCollectionInitialized(event: MoonbeamEvent<InitializedEventArgs>): Promise<void> {
    const initialized = new Initialized(event.transactionHash);
    initialized.owner = event.args.owner;
    initialized.collectionId = event.args.collectionId;
    initialized.collection = event.address;
    await initialized.save();
    logger.info(`Initialize event processed at address: ${event.address}`);
}


export async function handleTransfer(event: MoonbeamEvent<TransferEventArgs>): Promise<void> {
    const transfer = new Transfer(event.transactionHash);
    transfer.from = event.args.from;
    transfer.to = event.args.to;
    transfer.tokenId = event.args.tokenId.toBigInt();
    transfer.collection = event.address;
    await transfer.save();
    logger.info(`Transfer event processed at address: ${event.address}`);
}

export async function handleRoleGranted(event: MoonbeamEvent<RoleGrantedEventArgs>): Promise<void> {
    const roleGranted = new RoleGranted(event.transactionHash);
    roleGranted.role = utils.parseBytes32String(event.args.role);
    roleGranted.account = event.args.account;
    roleGranted.sender = event.args.sender;
    roleGranted.collection = event.address;
    await roleGranted.save();
    logger.info(`RoleGranted event processed at address: ${event.address}`);
}

export async function handleRoleRevoked(event: MoonbeamEvent<RoleRevokedEventArgs>): Promise<void> {
    const roleRevoked = new RoleRevoked(event.transactionHash);
    roleRevoked.role = utils.parseBytes32String(event.args.role);
    roleRevoked.account = event.args.account;
    roleRevoked.sender = event.args.sender;
    roleRevoked.collection = event.address;
    await roleRevoked.save();
    logger.info(`RoleRevoked event processed at address: ${event.address}`);
}   

export async function handleMint(event: MoonbeamEvent<MintEventArgs>): Promise<void> {
    const mint = new Mint(event.transactionHash);
    mint.minter = event.args.minter;
    mint.to = event.args.to;
    mint.tokenId = event.args.tokenId.toBigInt();
    mint.tokenHash = event.args.tokenHash;
    mint.collection = event.address;
    await mint.save();
    logger.info(`Mint event processed at address: ${event.address}`);
}


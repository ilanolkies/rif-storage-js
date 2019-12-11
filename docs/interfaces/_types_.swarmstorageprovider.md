[rif-storage](../README.md) › ["types"](../modules/_types_.md) › [SwarmStorageProvider](_types_.swarmstorageprovider.md)

# Interface: SwarmStorageProvider

## Hierarchy

* [StorageProvider](_types_.storageprovider.md)‹[Address](../modules/_types_.md#address), object, object›

  ↳ **SwarmStorageProvider**

## Index

### Properties

* [bzz](_types_.swarmstorageprovider.md#bzz)
* [type](_types_.swarmstorageprovider.md#type)

### Methods

* [get](_types_.swarmstorageprovider.md#get)
* [getReadable](_types_.swarmstorageprovider.md#getreadable)
* [put](_types_.swarmstorageprovider.md#put)

## Properties

###  bzz

• **bzz**: *Bzz*

*Defined in [src/types.ts:111](https://github.com/rsksmart/rds-libjs/blob/1cdc7dd/src/types.ts#L111)*

___

###  type

• **type**: *[Provider](../enums/_types_.provider.md)*

*Inherited from [StorageProvider](_types_.storageprovider.md).[type](_types_.storageprovider.md#type)*

*Defined in [src/types.ts:71](https://github.com/rsksmart/rds-libjs/blob/1cdc7dd/src/types.ts#L71)*

## Methods

###  get

▸ **get**(`address`: [Address](../modules/_types_.md#address), `options?`: GetOpts): *Promise‹[Directory](../modules/_types_.md#directory)‹Buffer› | Buffer›*

*Inherited from [StorageProvider](_types_.storageprovider.md).[get](_types_.storageprovider.md#get)*

*Defined in [src/types.ts:82](https://github.com/rsksmart/rds-libjs/blob/1cdc7dd/src/types.ts#L82)*

Retrieves data from provider's network.

You can distinguish between returned objects using `isDirectory(obj)` or `isFile(obj)`.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | [Address](../modules/_types_.md#address) | string hash or CID |
`options?` | GetOpts | options passed to either IPFS's `get()` or Erebos's `download()` functions |

**Returns:** *Promise‹[Directory](../modules/_types_.md#directory)‹Buffer› | Buffer›*

`Buffer` if the address was pointing to single file. [Directory](../modules/_types_.md#directory) if the address was pointing to directory

___

###  getReadable

▸ **getReadable**(`address`: [Address](../modules/_types_.md#address), `options?`: GetOpts): *Promise‹Readable›*

*Inherited from [StorageProvider](_types_.storageprovider.md).[getReadable](_types_.storageprovider.md#getreadable)*

*Defined in [src/types.ts:91](https://github.com/rsksmart/rds-libjs/blob/1cdc7dd/src/types.ts#L91)*

Retrieves data from provider's network using streaming support.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`address` | [Address](../modules/_types_.md#address) | string hash or CID |
`options?` | GetOpts | options passed to either IPFS's `get()` or Erebos's `download()` functions |

**Returns:** *Promise‹Readable›*

`Readable` in object mode that yields [DirectoryArrayEntry](../modules/_types_.md#directoryarrayentry) objects with `Readable` as `data`. The `data` has to be fully processed before moving to next entry.

___

###  put

▸ **put**(`data`: string | Buffer | Readable, `options?`: PutOpts): *Promise‹[Address](../modules/_types_.md#address)›*

*Inherited from [StorageProvider](_types_.storageprovider.md).[put](_types_.storageprovider.md#put)*

*Defined in [src/types.ts:100](https://github.com/rsksmart/rds-libjs/blob/1cdc7dd/src/types.ts#L100)*

Stores data on provider's network

**Parameters:**

Name | Type |
------ | ------ |
`data` | string &#124; Buffer &#124; Readable |
`options?` | PutOpts |

**Returns:** *Promise‹[Address](../modules/_types_.md#address)›*

Address of the stored data

▸ **put**(`data`: [Directory](../modules/_types_.md#directory)‹string | Buffer | Readable› | [DirectoryArray](../modules/_types_.md#directoryarray)‹Buffer | Readable›, `options?`: PutOpts): *Promise‹[Address](../modules/_types_.md#address)›*

*Inherited from [StorageProvider](_types_.storageprovider.md).[put](_types_.storageprovider.md#put)*

*Defined in [src/types.ts:101](https://github.com/rsksmart/rds-libjs/blob/1cdc7dd/src/types.ts#L101)*

**Parameters:**

Name | Type |
------ | ------ |
`data` | [Directory](../modules/_types_.md#directory)‹string &#124; Buffer &#124; Readable› &#124; [DirectoryArray](../modules/_types_.md#directoryarray)‹Buffer &#124; Readable› |
`options?` | PutOpts |

**Returns:** *Promise‹[Address](../modules/_types_.md#address)›*
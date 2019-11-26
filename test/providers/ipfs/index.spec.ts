import { ipfs as ipfsProvider } from '../../../src'
import * as utils from '../../../src/utils'
import { IpfsClient } from 'ipfs-http-client'
import { EntryType, IpfsStorageProvider } from '../../../src/types'
import createIpfs from './utils'

import chai from 'chai'
import dirtyChai from 'dirty-chai'
import chaiAsPromised from 'chai-as-promised'
import { ValueError } from '../../../src/errors'

// Do not reorder these statements - https://github.com/chaijs/chai/issues/1298
chai.use(chaiAsPromised)
chai.use(dirtyChai)
const expect = chai.expect

describe('IPFS provider', () => {
  let ipfs: IpfsClient
  let provider: IpfsStorageProvider
  let teardown: () => Promise<void[]>

  before(async () => {
    const factory = createIpfs()
    ipfs = await factory.setup()
    teardown = factory.teardown

    provider = ipfsProvider(ipfs)
  })

  after(() => {
    teardown()
  })

  describe('.put()', () => {
    it('should store file', async () => {
      const cid = await provider.put(Buffer.from('hello world'))

      const result = await ipfs.get(cid)
      expect(result.length).to.eq(1)

      const fetchedFromIpfs = result[0]
      expect(fetchedFromIpfs.path).to.equal(cid)
      expect(fetchedFromIpfs.content && fetchedFromIpfs.content.toString()).to.equal('hello world')
    })

    it('should store directory', async () => {
      const file = { data: Buffer.from('data') }

      const dir = {
        file: file,
        'other-file': file,
        'folder/and/file': file
      }

      const [rootCid, dirResult] = await provider.put(dir)

      expect(rootCid).to.be.a('string')
      expect(Object.values(dirResult).length).to.eq(5)
      expect(dirResult).to.eql({
        file: {
          hash: 'QmSBpYfb6AM4ioR4qDeqP5wzbVP5z85fGsKUxvHSkvKTqg',
          size: 12,
          type: EntryType.FILE
        },
        'other-file': {
          hash: 'QmSBpYfb6AM4ioR4qDeqP5wzbVP5z85fGsKUxvHSkvKTqg',
          size: 12,
          type: EntryType.FILE
        },
        folder: {
          hash: 'QmUe2Cu2suPBjRqvDCZE9FJUjnG1BWCY3NCPBVPxunPRoe',
          size: 111,
          type: EntryType.DIRECTORY
        },
        'folder/and': {
          hash: 'QmNz6geNPct9dZxmcgrHaCZn74uLAkrEYVwyDgR6GXPB6x',
          size: 62,
          type: EntryType.DIRECTORY
        },
        'folder/and/file':
          {
            hash: 'QmSBpYfb6AM4ioR4qDeqP5wzbVP5z85fGsKUxvHSkvKTqg',
            size: 12,
            type: EntryType.FILE
          }
      })

      const result = await ipfs.get(rootCid)
      expect(result.length).to.eq(6) // one more then dirResult because dirResult does not have the root folder

      // @ts-ignore
      result.forEach(entry => entry.content && expect(entry.content.toString()).to.eq('data'))

      const paths = result.map(entry => entry.path)
      expect(paths).to.include.members([
        `${rootCid}`,
        `${rootCid}/file`,
        `${rootCid}/folder`,
        `${rootCid}/folder/and`,
        `${rootCid}/folder/and/file`,
        `${rootCid}/other-file`
      ])
    })
  })

  describe('.get()', () => {
    it('should get file', async () => {
      const cid = (await ipfs.add(Buffer.from('hello world')))[0].hash

      const fetchedFromIpfs = await provider.get(cid)
      expect(utils.isFile(fetchedFromIpfs)).to.be.true()
      expect(fetchedFromIpfs.toString()).to.equal('hello world')
    })

    // it('should throw when not found', () => {
    //   const cid = 'QmY2ERw3nB19tVKKVF18Wq5idNL91gaNzCk1eaSq6S1J1i'
    //
    //   return expect(provider.get(cid)).to.be.eventually.fulfilled()
    // })

    it('should get multiple files', async () => {
      const cid1 = (await ipfs.add(Buffer.from('hello world1')))[0].hash
      const cid2 = (await ipfs.add(Buffer.from('hello world2')))[0].hash
      const cid3 = (await ipfs.add(Buffer.from('hello world3')))[0].hash

      const fetchedFromIpfs = await provider.get(cid1, cid2, cid3)
      expect(fetchedFromIpfs.length).to.equal(3)
      fetchedFromIpfs.forEach((data) => {
        expect(utils.isFile(data)).to.be.true()
      })

      const data = fetchedFromIpfs.map(b => b.toString())
      expect(data).to.eql([
        'hello world1',
        'hello world2',
        'hello world3'
      ])
    })

    it('should get directory', async () => {
      const emptyDir = (name: string): { path: string } => ({ path: `test-folder/${name}` })
      const content = (name: string, value = 'some-data'): { path: string, content: Buffer } => ({
        path: `test-folder/${name}`,
        content: Buffer.from(value)
      })

      const dir = [
        content('file1'),
        content('file2'),
        content('folder/and/file'),
        content('folder/other_file'),
        emptyDir('so_empty') // This will be ignored
      ]
      const result = await ipfs.add(dir)
      const cid = result[result.length - 1].hash

      const fetchedFromIpfs = await provider.get(cid)
      expect(utils.isDirectory(fetchedFromIpfs)).to.be.true()

      expect(fetchedFromIpfs).to.have.all.keys(
        [
          'file1',
          'file2',
          'folder/and/file',
          'folder/other_file',
          utils.DIRECTORY_SYMBOL
        ]
      )

      Object.values(fetchedFromIpfs).forEach(file => expect(file).to.eql({
        size: 9,
        data: Buffer.from('some-data')
      }))
    })
  })
})

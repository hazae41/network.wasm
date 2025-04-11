import { Memory, NetworkMixin, NetworkWasm, base16_decode_mixed, base16_encode_lower } from "../index.js"

await NetworkWasm.initBundled()

/**
 * Version
 */
const versionZeroHex = "0x1"
const versionBase16 = versionZeroHex.slice(2).padStart(64, "0")
using versionMemory = base16_decode_mixed(versionBase16)

/**
 * Address
 */
const addressZeroHex = "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4"
const addressBase16 = addressZeroHex.slice(2).padStart(64, "0")
using addressMemory = base16_decode_mixed(addressBase16)

/**
 * Nonce
 */
const nonceBytes = crypto.getRandomValues(new Uint8Array(32))
using nonceMemory = new Memory(nonceBytes)
const nonceBase16 = base16_encode_lower(nonceMemory)

/**
 * Price
 */
const minimumBigInt = 100000n
const minimumBase16 = minimumBigInt.toString(16).padStart(64, "0")
using minimumMemory = base16_decode_mixed(minimumBase16)

using mixin = new NetworkMixin(versionMemory, addressMemory, nonceMemory)

const start = performance.now()
using generated = mixin.generate(minimumMemory)
const end = performance.now()

using secretMemory = generated.to_secret()
const secretBase16 = base16_encode_lower(secretMemory)

using proofMemory = generated.to_proof()
const proofBase16 = base16_encode_lower(proofMemory)

const valueBase16 = base16_encode_lower(generated.to_value())
const valueBigInt = BigInt("0x" + valueBase16)

console.log(nonceBase16, valueBigInt, secretBase16, proofBase16)

console.log(`Generated ${valueBigInt} wei in ${end - start}ms`)
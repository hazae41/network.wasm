# network.wasm

WebAssembly bundle for Network

```bash
npm i @hazae41/network.wasm
```

[**Node Package 📦**](https://www.npmjs.com/package/@hazae41/network.wasm)

## Features
- Reproducible building
- Pre-bundled and streamed
- Zero-copy memory slices

## Bundles
- base16.wasm
- sha3.wasm

## Algorithms
- Network
- Base16
- SHA-3

## Usage

```typescript
import { Memory, NetworkMixin, NetworkWasm, base16_decode_mixed, base16_encode_lower } from "@hazae41/network.wasm";

// Wait for WASM to load
await NetworkWasm.initBundled();

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

console.log(valueBigInt, secretBase16, proofBase16)

console.log(`Generated ${valueBigInt} wei in ${end - start}ms`)
```

## Building

### Unreproducible building

You need to install [Rust](https://www.rust-lang.org/tools/install)

Then, install [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/)

```bash
cargo install wasm-pack
```

Finally, do a clean install and build

```bash
npm ci && npm run build
```

### Reproducible building

You can build the exact same bytecode using Docker, just be sure you're on a `linux/amd64` host

```bash
docker compose up --build
```

Then check that all the files are the same using `git status`

```bash
git status --porcelain
```

If the output is empty then the bytecode is the same as the one I commited

### Automated checks

Each time I commit to the repository, the GitHub's CI does the following:
- Clone the repository
- Reproduce the build using `docker compose up --build`
- Throw an error if the `git status --porcelain` output is not empty

Each time I release a new version tag on GitHub, the GitHub's CI does the following:
- Clone the repository
- Do not reproduce the build, as it's already checked by the task above
- Throw an error if there is a `npm diff` between the cloned repository and the same version tag on NPM

If a version is present on NPM but not on GitHub, do not use!

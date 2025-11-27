# 🎨 Bapp Quest NFT Checker

A beautiful web application to check if a wallet address owns the Bapp Quest NFT on Citrea Testnet.

## Features

✨ **Beautiful UI** - Animated gradient background with glassmorphism design
🎉 **Confetti Animation** - Celebrates when NFT is found
🔗 **Transaction Links** - Direct links to Citrea Explorer
📱 **Responsive** - Works on all devices
⚡ **Fast** - Uses Citrea Explorer API for instant results

## Quick Start

### Option 1: Simple HTTP Server (Node.js)

```bash
cd nft-checker
node server.js
```

Then open http://localhost:3000 in your browser.

### Option 2: Python HTTP Server

```bash
cd nft-checker
python3 -m http.server 3000
```

Then open http://localhost:3000 in your browser.

### Option 3: VS Code Live Server

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## How to Use

1. Enter any Ethereum wallet address (0x...)
2. Click "Check NFT Ownership"
3. If the address owns the NFT:
   - 🎉 Confetti animation plays
   - Shows NFT details (Token ID, Contract, Mint Date)
   - Provides link to transaction on Citrea Explorer
4. If not:
   - Shows "Sorry, Bad Luck" message
   - Option to try another address

## NFT Details

- **Contract**: `0x425EAcda57DBB68c7eEC250759AA9A5573Cc5540`
- **Collection**: Bapp Quest NFT (BAPPER)
- **Network**: Citrea Testnet
- **Type**: ERC-721

## Technical Details

- Pure HTML/CSS/JavaScript (no build step required)
- Uses Citrea Explorer API
- Tailwind CSS for styling
- Canvas Confetti for animations
- No backend required (all API calls from browser)

## Example Addresses

Try these addresses:

- **Has NFT**: `0x74d3352e3fd9220615f205d9ba26a026287d5521`
- **No NFT**: `0x0000000000000000000000000000000000000000`

## API Endpoints Used

- NFT Holdings: `https://explorer.testnet.citrea.xyz/api/v2/addresses/{address}/nft`
- Transfer History: `https://explorer.testnet.citrea.xyz/api/v2/tokens/{contract}/instances/{tokenId}/transfers`

## Browser Support

Works on all modern browsers:
- Chrome/Edge (recommended)
- Firefox
- Safari
- Opera

## License

MIT

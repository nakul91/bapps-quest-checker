// NFT Checker Configuration
const NFT_CONTRACT = '0x425EAcda57DBB68c7eEC250759AA9A5573Cc5540';
const EXPLORER_API_BASE = 'https://explorer.testnet.citrea.xyz/api/v2';

// DOM Elements
const inputSection = document.getElementById('inputSection');
const loadingSection = document.getElementById('loadingSection');
const successSection = document.getElementById('successSection');
const failureSection = document.getElementById('failureSection');
const errorSection = document.getElementById('errorSection');

const walletAddressInput = document.getElementById('walletAddress');
const checkButton = document.getElementById('checkButton');
const checkAnotherButton = document.getElementById('checkAnotherButton');
const tryAnotherButton = document.getElementById('tryAnotherButton');
const retryButton = document.getElementById('retryButton');

// Success section elements
const tokenIdElement = document.getElementById('tokenId');
const contractElement = document.getElementById('contract');
const mintDateElement = document.getElementById('mintDate');
const txLinkElement = document.getElementById('txLink');
const errorMessageElement = document.getElementById('errorMessage');

// Confetti configuration
function triggerConfetti() {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
        });
        confetti({
            ...defaults,
            particleCount,
            origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
        });
    }, 250);
}

// Show/Hide sections
function showSection(section) {
    [inputSection, loadingSection, successSection, failureSection, errorSection].forEach(s => {
        s.classList.add('hidden');
    });
    section.classList.remove('hidden');
}

// Validate Ethereum address
function isValidAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Check NFT ownership
async function checkNFTOwnership(walletAddress) {
    try {
        showSection(loadingSection);

        // Normalize address
        const normalizedAddress = walletAddress.toLowerCase();

        // Fetch NFT holdings from Citrea Explorer API
        const nftUrl = `${EXPLORER_API_BASE}/addresses/${normalizedAddress}/nft`;
        const response = await fetch(nftUrl);

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();

        // Find Bapps Quest NFT
        const bappNFT = data.items?.find(item => 
            item.token?.name?.toLowerCase().includes('bapps quest') ||
            item.token?.name?.toLowerCase().includes('bapp quest') ||
            item.token?.address_hash?.toLowerCase() === NFT_CONTRACT.toLowerCase()
        );

        if (bappNFT) {
            // User owns the NFT!
            await showSuccessResult(bappNFT, normalizedAddress);
        } else {
            // User doesn't own the NFT
            showSection(failureSection);
        }

    } catch (error) {
        console.error('Error checking NFT:', error);
        errorMessageElement.textContent = error.message || 'Unable to check NFT ownership. Please try again.';
        showSection(errorSection);
    }
}

// Show success result with NFT details
async function showSuccessResult(nftData, walletAddress) {
    try {
        const tokenId = nftData.id || nftData.token_id || 'Unknown';
        const contractAddress = nftData.token?.address_hash || NFT_CONTRACT;

        // Update UI with NFT details
        tokenIdElement.textContent = tokenId;
        contractElement.textContent = contractAddress;

        // Fetch transfer history to get transaction hash
        if (tokenId !== 'Unknown') {
            const transferUrl = `${EXPLORER_API_BASE}/tokens/${contractAddress}/instances/${tokenId}/transfers`;
            const transferResponse = await fetch(transferUrl);
            
            if (transferResponse.ok) {
                const transferData = await transferResponse.json();
                
                if (transferData.items && transferData.items.length > 0) {
                    const mintTransfer = transferData.items[0];
                    const txHash = mintTransfer.transaction_hash;
                    const timestamp = mintTransfer.timestamp;

                    // Update transaction link
                    if (txHash) {
                        txLinkElement.href = `https://explorer.testnet.citrea.xyz/tx/${txHash}`;
                    }

                    // Format date
                    if (timestamp) {
                        const date = new Date(timestamp);
                        mintDateElement.textContent = date.toLocaleString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        });
                    }
                }
            }
        }

        // Show success section
        showSection(successSection);

        // Trigger confetti celebration!
        setTimeout(() => {
            triggerConfetti();
        }, 100);

    } catch (error) {
        console.error('Error fetching transfer details:', error);
        // Still show success even if we can't get all details
        tokenIdElement.textContent = nftData.id || 'Unknown';
        contractElement.textContent = NFT_CONTRACT;
        mintDateElement.textContent = 'Unable to fetch';
        txLinkElement.href = `https://explorer.testnet.citrea.xyz/address/${walletAddress}`;
        
        showSection(successSection);
        setTimeout(() => {
            triggerConfetti();
        }, 100);
    }
}

// Reset to input form
function resetForm() {
    walletAddressInput.value = '';
    showSection(inputSection);
}

// Event Listeners
checkButton.addEventListener('click', () => {
    const address = walletAddressInput.value.trim();

    if (!address) {
        alert('Please enter a wallet address');
        return;
    }

    if (!isValidAddress(address)) {
        alert('Please enter a valid Ethereum address (0x...)');
        return;
    }

    checkNFTOwnership(address);
});

// Allow Enter key to submit
walletAddressInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkButton.click();
    }
});

checkAnotherButton.addEventListener('click', resetForm);
tryAnotherButton.addEventListener('click', resetForm);
retryButton.addEventListener('click', resetForm);

// Auto-fill if address is in URL
const urlParams = new URLSearchParams(window.location.search);
const addressParam = urlParams.get('address');
if (addressParam && isValidAddress(addressParam)) {
    walletAddressInput.value = addressParam;
}

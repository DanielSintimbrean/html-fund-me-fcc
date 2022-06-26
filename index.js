import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const conncestButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")

conncestButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({ method: "eth_requestAccounts" })
        conncestButton.innerHTML = "Connected!"
        console.log
    } else {
        conncestButton.innerHTML = "Pless install metamask!"
    }
}

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponce = await contract.fund({
                value: ethers.utils.parseEther(ethAmount),
            })

            await listenForTransactionMine(transactionResponce, provider)

            console.log("Done")
        } catch (error) {
            console.log(error)
        }
    }
}

async function getBalance() {
    if (typeof window.ethereum != "undifined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

async function withdraw() {
    if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const transactionResponce = await contract.withdraw()
            await listenForTransactionMine(transactionResponce, provider)
        } catch (error) {
            console.log(error)
        }
    }
}

function listenForTransactionMine(transactionResponce, provider) {
    console.log(`Mining ${transactionResponce.hash}...`)

    return new Promise((resolve, reject) => {
        provider.once(transactionResponce.hash, (transactionReceipt) => {
            console.log(
                `Compelted with ${transactionReceipt.confirmations}  confirmations`
            )

            resolve()
        })
    })
}

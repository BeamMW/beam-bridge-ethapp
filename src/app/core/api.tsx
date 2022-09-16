export function connectToMetamask() {
    if (window.ethereum) {
        window.ethereum
            .request({ method: 'eth_requestAccounts' })
            .then(accounts => console.log('success!'))
    } else {
        localStorage.setItem('wasReloaded', '1');
        window.location.reload();
    }
}
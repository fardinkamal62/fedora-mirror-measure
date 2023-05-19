const speedTest = module.exports;
let stop = false;
let abortController;

const getSpeed = async (u, version, ostm, archi) => {
    abortController = new AbortController();
    stop = false;
    var newUrl = `${u}/${version}/${ostm}/Everything/${archi}/os/images/efiboot.img`;
    const response = await fetch(newUrl, {cache: "no-store", method: "HEAD"});
    if (response.status !== 200) {
        if (u.endsWith('/linux')) {
            return {
                message: `Skipping ${u} \nReason: file not found\nError code: ${response.status}\n`,
                code: response.status,
                speed: 0,
            }
        }
        u = u + '/linux'
        newUrl = `${u}/${version}/${ostm}/Everything/${archi}/os/images/efiboot.img`;
    }
    const start = Date.now();
    const response2 = await fetch(newUrl, {signal: abortController.signal});

    // if (!response.ok) {
    //     throw new Error(`HTTP error! Status: ${response.status}`);
    // }

    const reader = response2.body.getReader();
    let receivedBytes = 0;
    let chunks = [];

    while (true) {
        const {
            done,
            value
        } = await reader.read();

        if (done) {
            break;
        }

        if (stop) {
            break;
        }

        receivedBytes += value.length;
        chunks.push(value);
    }

    const end = Date.now();
    const duration = end - start;
    const fileSize = receivedBytes;
    const speed = (fileSize / (duration / 1000) / 1000000).toFixed(2); // Calculate speed in Mbps

    return {speed, code: 200, u}

};

// Checking if Fedora version is pre-release or stable
speedTest.checkRelease = async (ostm, archi) => {
    const template = `${ostm}/Everything/${archi}/os/images/efiboot.img`;
    const preReleaseUrl = `https://ap.edge.kernel.org/fedora/development/${template}`;

    try {
        const response = await fetch(preReleaseUrl, {cache: "no-store", method: "HEAD"});
        if (response.status === 200) {
            return 'development';
        } else {
            return 'releases';
        }
    } catch (error) {
        console.error(error);
    }
};

speedTest.main = async (url, version, ostm, archi) => {
    try {
        return await getSpeed(url, version, ostm, archi);
    } catch (error) {
        console.error(error);
        return error;
    }
};

speedTest.stop = () => {
    stop = true;
    abortController.abort();
}

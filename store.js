const electron = require('electron');
const path = require('path');
const fs = require('fs');

const store = module.exports

store.store = (opts) => {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData');
    const filePath = path.join(userDataPath, opts.configName + '.json');
    const data = parseDataFile(filePath, opts.defaults);

    const get = (key) => {
        return data[key];
    };

    const set = (key, val) => {
        data[key] = val;
        console.log(path, data);
        fs.writeFileSync(path, JSON.stringify(data));
    };

    return {
        get,
        set,
    };
};

store.parseDataFile = (filePath) => {
    checkFile(filePath)
    filePath = filePath + '/mirrors.json'
    try {
        return JSON.parse(fs.readFileSync(filePath));
    } catch (error) {
        return error;
    }
};

store.saveDataFile = (filePath, data, version, archi) => {
    checkFile(filePath)
    filePath = filePath + '/mirrors.json';
    const json = {
        mirrors: data,
        info: { downloadedAt: new Date().getTime(), version, archi }
    }
    try{
        fs.writeFileSync(filePath, JSON.stringify(json));
    }
    catch (e){
        return e;
    }
}

function checkFile(filePath){
    filePath = filePath + '/mirrors.json';
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {

            // Create the file
            fs.writeFile(filePath, JSON.stringify({}), (err) => {
                if (err) throw err;
            });
        } else {
        }
    });
}

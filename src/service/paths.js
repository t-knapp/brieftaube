const path = require('path');
const fs = require('fs');

module.exports = class Paths {
    constructor(basePath) {
        this.basePath = basePath;
        this.uploadPath = path.join(this.basePath, 'uploaded');
        this.pendingPath = path.join(this.basePath, 'pending');
        this.donePath = path.join(this.basePath, 'done');

        this.ensureExists(this.basePath);
        this.ensureExists(this.uploadPath);
        this.ensureExists(this.pendingPath);
        this.ensureExists(this.donePath);
    }

    getUploadPath() {
        return this.uploadPath;
    }

    getPendingPath(filename = null) {
        if(!filename)
            return this.pendingPath;
        
        return path.join(this.pendingPath, filename);
    }

    getDonePath(filename = null) {
        if(!filename)
            return this.donePath;

        return path.join(this.donePath, filename);
    }

    ensureExists(path) {
        if(!fs.existsSync(path))
            fs.mkdirSync(path, { recursive: true });
    }
}
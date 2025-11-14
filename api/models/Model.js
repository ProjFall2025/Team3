const knex = require('../config/database');
const fs = require('fs')
const archiver = require('archiver')
const stream = require('stream');
const path = require('path');

class Model {
  static async getAll() {
    return await knex('models').select('*');
  }

  static async getModel(path){
    const { filepath } = path;
    let stats;
    try {
      stats = await fs.promises.stat(filepath);
    } catch (err) {
      throw new Error(`Unable to access filepath: ${err.message}`);
    }

    return new Promise((resolve, reject) => {
      const archive = archiver('zip', { zlib: { level: 9 } });
      const pass = new stream.PassThrough();
      const chunks = [];

      pass.on('data', (chunk) => chunks.push(chunk));
      pass.on('end', () => resolve(Buffer.concat(chunks)));
      pass.on('error', (err) => reject(err));

      archive.on('warning', (err) => {
        if (err.code === 'ENOENT') {
          console.warn('Archiver warning:', err);
        } else {
          reject(err);
        }
      });
      archive.on('error', (err) => reject(err));

      archive.pipe(pass);

      archive.directory(filepath, false);

      archive.finalize().catch(reject);
    });
  }
}

module.exports = Model;
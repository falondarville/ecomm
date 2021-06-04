const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

const scrypt = util.promisify(crypto.scrypt);

// checks for filename and creates a file if it does not exist in the dir that it's executed from
class UsersRepository {
    constructor(filename) {
        if(!filename) {
            throw new Error('Creating a new repository requires a filename.');
        }

        this.filename = filename;
        try {
            fs.accessSync(this.filename);
        } catch (err) {
            fs.writeFileSync(this.filename, '[]');
        }
    }

    async getAll() {
        // open file and parse content (look back at Promises module)
        return JSON.parse(await fs.promises.readFile(this.filename));
    }

    async create(attrs) {
        // attrs === { email: '', password: '' }
        attrs.id = this.randomId();

        // generate unique salt for each new user
        const salt = crypto.randomBytes(8).toString('hex');
        const buf = await scrypt(attrs.password, salt, 64);

        const records = await this.getAll();

        const record = {
            ...attrs,
            password: `${buf.toString('hex')}.${salt}`
        }
        records.push(record);
        
        await this.writeAll(records);

        return record;
    }

    async writeAll(records){
        await fs.promises.writeFile(
            this.filename, 
            JSON.stringify(records, null, 2)
        );
    }

    async getOne(id) {
        const records = await this.getAll();

        return records.find(record => record.id === id);
    }

    async delete(id) {
        const records = await this.getAll();
        // we use filter because we are not actually deleting a record by selecting it
        // we are rewriting the entire file then writing it all
        const filteredRecords = records.filter(record.id !== id);
        await this.writeAll(filteredRecords);
    }

    async update(id, attrs){
        const records = await this.getAll();
        const record = records.find(record => record.id === id);

        if(!record) {
            throw new Error(`Record with id ${id} not found.`);
        }

        // takes all attrs and copies them over to records
        Object.assign(record, attrs);
        await this.writeAll(records);
    }

    // filters are an object of filters with values (first instance)
    async getOneBy(filters) {
        const records = await this.getAll();

        // for versus in: for goes through an array, in goes through an object
        for (let record of records) {
            let found = true;

            for (let key in filters) {
                // compares values to find those passed to the function versus those in our file system
                if (record[key] !== filters[key]) {
                    found = false;
                }
            }

            if (found) {
                return record;
            }
        }
    }

    randomId() {
        // see node.js documentation crypto section
        return crypto.randomBytes(4).toString('hex');
    }
}

// makes an instance of UserRepository available to other files. In other files, all you need to do is require the file. 
module.exports =  new UsersRepository('users.json');
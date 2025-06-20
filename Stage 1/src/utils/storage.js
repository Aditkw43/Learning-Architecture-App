export class StorageUtil {
    constructor(key) {
        this.key = key;
        this.data = JSON.parse(localStorage.getItem(this.key)) || [];
    }

    save() {
        localStorage.setItem(this.key, JSON.stringify(this.data));
    }
    add(item) {
        this.data.push(item);
        this.save();
    }
    getAll() {
        return this.data;
    }
    delete(id) {
        this.data = this.data.filter(item => item.id !== id);
        this.save();
    }
    update(id, updatedItem) {
        const index = this.data.findIndex(item => item.id === id);
        if (index !== -1) {
            this.data[index] = { ...this.data[index], ...updatedItem };
            this.save();
        }
    }
    clear() {
        this.data = [];
        this.save();
    }
    findById(id) {
        return this.data.find(item => item.id === id);
    }
    find(predicate) {
        return this.data.filter(predicate);
    }
    sort(compareFn) {
        this.data.sort(compareFn);
        this.save();
    }
}
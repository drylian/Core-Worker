import { merge } from "lodash";

/**
 * Represents a collection of key-value pairs.
 * @template K - The type of keys in the collection.
 * @template V - The type of values in the collection.
 */
export class Collection<K extends string | number | symbol, V> {
    private items: { key: K, value: V }[];

    /**
     * Creates a new instance of Collection.
     */
    constructor() {
        this.items = [];
    }

    /**
     * Sets a value for the specified key in the collection.
     * If the key already exists, updates its corresponding value.
     * @param {K} key - The key to set.
     * @param {V} value - The value to associate with the key.
     */
    public set(key: K, value: V): void {
        const index = this.items.findIndex(item => item.key === key);
        if (index !== -1) {
            this.items[index].value = value;
        } else {
            this.items.push({ key, value });
        }
    }
    
    /**
     * Merges an object with the existing value associated with the specified key.
     * If the existing value is an object, the properties of the given object are merged with it.
     * Otherwise, sets the given object as the value for the key.
     * @param {K} key - The key to merge or set.
     * @param {V} obj - The object to merge or set as the value.
     */
    public merge(key: K, obj: V ) {
        const existingValue = this.get(key);
		if (existingValue && typeof existingValue === "object" && typeof obj === "object") {
			this.set(key, merge(existingValue, obj));
		} else {
			this.set(key, obj);
		}
    }

    /**
     * Gets the value associated with the specified key from the collection.
     * @param {K} key - The key to get the value for.
     * @returns {V | undefined} - The value associated with the key, or undefined if the key is not found.
     */
    public get(key: K): V | undefined {
        const item = this.items.find(item => item.key === key);
        return item ? item.value : undefined;
    }

    /**
     * Checks whether the collection contains the specified key.
     * @param {K} key - The key to check for.
     * @returns {boolean} - True if the key exists in the collection, otherwise false.
     */
    public has(key: K): boolean {
        return this.items.some(item => item.key === key);
    }

    /**
     * Deletes the key and its associated value from the collection.
     * @param {K} key - The key to delete.
     * @returns {boolean} - True if the key was found and deleted, otherwise false.
     */
    public delete(key: K): boolean {
        const index = this.items.findIndex(item => item.key === key);
        if (index !== -1) {
            this.items.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * Removes all keys and values from the collection.
     */
    public clear(): void {
        this.items = [];
    }

    /**
     * Gets the number of key-value pairs in the collection.
     * @returns {number} - The number of key-value pairs in the collection.
     */
    public get size(): number {
        return this.items.length;
    }

    /**
     * Gets an array containing all keys in the collection.
     * @returns {K[]} - An array of keys.
     */
    public keys(): K[] {
        return this.items.map(item => item.key);
    }

    /**
     * Gets an array containing all values in the collection.
     * @returns {V[]} - An array of values.
     */
    public values(): V[] {
        return this.items.map(item => item.value);
    }

    /**
     * Gets an array containing all key-value pairs in the collection.
     * @returns {[K, V][]} - An array of key-value pairs.
     */
    public entries(): [K, V][] {
        return this.items.map(item => [item.key, item.value]);
    }
}

import AsyncStorage from '@react-native-async-storage/async-storage';

import { FilterStatus } from '@/types';

const ITEMS_STORAGE_KEY = '@comprar:items';

export type ItemStorage = {
  id: string;
  status: FilterStatus;
  description: string;
}

async function get(): Promise<ItemStorage[]> {
  try {
    const data = await AsyncStorage.getItem(ITEMS_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    throw new Error('GET_ITEMS: ' + error);
  }
}

async function getByStatus(status: FilterStatus): Promise<ItemStorage[]> {
  try {
    const items = await get();
    return items.filter(item => item.status === status);
  } catch (error) {
    throw new Error('GET_ITEMS_BY_STATUS: ' + error);
  }
}

async function save(items: ItemStorage[]): Promise<void> {
  try {
    await AsyncStorage.setItem(ITEMS_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    throw new Error('SAVE_ITEMS: ' + error);
  }
}

async function add(item: ItemStorage): Promise<ItemStorage[]> {
  try {
    const currentItems = await get();
    const updatedItems = [...currentItems, item];
    await save(updatedItems);
    return updatedItems;
  } catch (error) {
    throw new Error('ADD_ITEM: ' + error);
  }
}

async function remove(id: string): Promise<void> {
  try {
    const currentItems = await get();
    const updatedItems = currentItems.filter(item => item.id !== id);
    await save(updatedItems);
  } catch (error) {
    throw new Error('REMOVE_ITEM: ' + error);
  }
}

async function clearAll(): Promise<void> {
  try {
    await AsyncStorage.removeItem(ITEMS_STORAGE_KEY);
  } catch (error) {
    throw new Error('CLEAR_ITEMS: ' + error);
  }
}

async function toggleStatus(id: string): Promise<void> {
  const items = await get();

  const updatedItems = items.map(item => {
    if (item.id === id) {
      return {
        ...item,
        status: item.status === FilterStatus.PENDING ? FilterStatus.DONE : FilterStatus.PENDING
      };
    }

    return item;
  });

  await save(updatedItems);
}

export const itemsStorage = {
  get,
  getByStatus,
  add,
  remove,
  clearAll,
  toggleStatus,
}
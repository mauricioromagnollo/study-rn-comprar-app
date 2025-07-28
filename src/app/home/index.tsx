import { useState, useEffect } from 'react';
import {
  Alert,
  Image,
  View,
  TouchableOpacity,
  Text,
  FlatList
} from 'react-native';

import { Button, Input, Filter, Item } from '@/components';
import { FilterStatus } from '@/types';
import { itemsStorage, ItemStorage } from '@/storage';

import { styles } from './styles';

const FILTER_STATUS: FilterStatus[] = [FilterStatus.PENDING, FilterStatus.DONE];

export function Home() {
  const [description, setDescription] = useState('');
  const [items, setItems] = useState<ItemStorage[]>([]);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.PENDING);

  async function handleAddItem() {
    if (!description.trim()) {
      return Alert.alert('Atenção', 'Por favor, insira uma descrição.');
    }

    const newItem = {
      id: Math.random().toString(36).substring(2),
      description,
      status: filter
    }

    await itemsStorage.add(newItem);
    await itemsByStatus();

    setDescription('');
    setFilter(FilterStatus.PENDING);
  }

  async function itemsByStatus(): Promise<void> {
    try {
      const items = await itemsStorage.getByStatus(filter);
      setItems(items);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os itens.');
    }
  }

  async function handleRemoveItem(id: string): Promise<void> {

    try {
      await itemsStorage.remove(id);
      await itemsByStatus();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível remover o item.');
    }
  }

  function handleClearAll() {
    Alert.alert("Limpar", "Deseja realmente limpar todos os itens?", [
      {
        text: "Não",
        style: "cancel"
      },
      {
        text: "Sim",
        onPress: () => onClear()
      }
    ])
  }

  async function onClear() {
    try {
      await itemsStorage.clearAll();
      setItems([]);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível limpar os itens.');

    }
  }

  async function handleToggleItemStatus(id: string) {
    try {
      await itemsStorage.toggleStatus(id);
      await itemsByStatus();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível alterar o status do item.');
    }
  }

  useEffect(() => {
    itemsByStatus()
  }, [filter]);

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/logo.png')}
        style={styles.logo}
      />

      <View style={styles.form}>
        <Input
          placeholder="O que você deseja comprar?"
          onChangeText={setDescription}
          value={description}
        />
        <Button
          title="Adicionar"
          onPress={handleAddItem}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          {FILTER_STATUS.map((status) => (
            <Filter
              key={status}
              status={status}
              isActive={filter === status}
              onPress={() => setFilter(status)}
            />
          ))}

          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearAll}
          >
            <Text style={styles.clearText}>Limpar</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Item
              data={item}
              onRemove={() => handleRemoveItem(item.id)}
              onStatus={() => handleToggleItemStatus(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={() => (
            <Text style={styles.empty}>Nenhum item aqui.</Text>
          )}
        />
      </View>
    </View>
  );
}



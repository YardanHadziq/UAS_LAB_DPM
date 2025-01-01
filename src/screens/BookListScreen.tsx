import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { fetchBooks, deleteBook } from '../services/api';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Book, RootStackParamList } from '../types';

const BookListScreen = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const loadBooks = async () => {
    const fetchedBooks = await fetchBooks();
    setBooks(fetchedBooks);
  };

  useEffect(() => {
    loadBooks();
  }, []);

  const handleDelete = async (id: string) => {
    if (!id) {
      console.error('Book id is undefined');
      return;
    }
    await deleteBook(id);
    setBooks(books.filter((book) => book.id !== id));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.author}>{item.author}</Text>
            <Text style={styles.genre}>{item.genre}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.totalPages}>Pages: {item.totalPages}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.buttonEdit}
                onPress={() => navigation.navigate('BookDetail', { id: item.id })}
              >
                <Icon name="create-outline" size={16} color="#fff" />
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.buttonDelete}
                onPress={() => handleDelete(item.id)}
              >
                <Icon name="trash-outline" size={16} color="#fff" />
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('BookDetail', {})}
      >
        <Icon name="add-circle-outline" size={18} color="#000" />
        <Text style={styles.addButtonText}>Add New Book</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212', // Dark theme background
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  bookItem: {
    flex: 1,
    margin: 10,
    padding: 20,
    backgroundColor: '#1E1E1E', // Dark card background
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#292929',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
    marginBottom: 6,
  },
  author: {
    fontSize: 16,
    color: '#BBBBBB',
    marginBottom: 4,
  },
  genre: {
    fontSize: 14,
    color: '#888888',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 10,
    lineHeight: 20,
  },
  totalPages: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 12,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  buttonEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    width: '48%',
    justifyContent: 'center',
  },
  buttonDelete: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 8,
    width: '48%',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF', // White button
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000', // Black text
    marginLeft: 10,
  },
});

export default BookListScreen;

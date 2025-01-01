import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { fetchBook, createBook, updateBook } from '../services/api';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Book } from '../types';

const BookDetailScreen = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('');
  const [description, setDescription] = useState('');
  const [totalPages, setTotalPages] = useState('');
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params as { id?: string } || {};

  useEffect(() => {
    if (id) {
      const loadBook = async () => {
        const book: Book = await fetchBook(id);
        setTitle(book.title);
        setAuthor(book.author);
        setGenre(book.genre);
        setDescription(book.description);
        setTotalPages(book.totalPages.toString());
      };
      loadBook();
    }
  }, [id]);

  const handleSave = async () => {
    try {
      const bookData = { title, author, genre, description, totalPages: parseInt(totalPages, 10) };
      if (id) {
        await updateBook(id, bookData);
      } else {
        await createBook(bookData);
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error saving book:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Title"
        placeholderTextColor="#777"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Author"
        placeholderTextColor="#777"
        value={author}
        onChangeText={setAuthor}
      />
      <TextInput
        style={styles.input}
        placeholder="Genre"
        placeholderTextColor="#777"
        value={genre}
        onChangeText={setGenre}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        placeholderTextColor="#777"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Total Pages"
        placeholderTextColor="#777"
        value={totalPages}
        onChangeText={setTotalPages}
        keyboardType="numeric"
      />
      <View style={styles.buttonContainer}>
        <View style={[styles.button, styles.saveButton]}>
          <Text style={[styles.buttonText, styles.saveButtonText]} onPress={handleSave}>Save</Text>
        </View>
        <View style={[styles.button, styles.cancelButton]}>
          <Text style={styles.buttonText} onPress={() => navigation.goBack()}>Cancel</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#121212', // Dark theme background
  },
  input: {
    height: 40,
    borderColor: '#333',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#1E1E1E',
    color: '#FFF', // White text
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: '#FFFFFF', // White button
  },
  saveButtonText: {
    color: '#000000', // Black text
  },
  cancelButton: {
    backgroundColor: '#FF6347', // Modern red
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BookDetailScreen;

import React from 'react'
import './App.css'
import PropTypes from 'prop-types'
import { Route } from 'react-router-dom';
import { Link } from 'react-router-dom';
import BookDetails from './BookDetails';
import * as BooksAPI from './BooksAPI';

class BooksApp extends React.Component {
  static propTypes = {
    books: PropTypes.array,
    query: PropTypes.string,
    searchResult: PropTypes.array
  }

  constructor() {
    super();
    this.state = {
      books: [],
      query: '',
      searchResult: []
    };
  }

  componentDidMount() {
    this.fetchBooks();
  }

  /**
  * @description Fetches books using the BooksAPI
  */
  fetchBooks = () => {
    BooksAPI.getAll()
      .then((books) => {
        this.setState(() => ({
          ...this.state,
          books
        }))
      });
  }

  /**
  * @description Adds the text entered in the search field to the state
  * @param {string} query - Text entered to search a book
  */
  onQueryChanged = (query) => {
    this.setState(() => ({
      ...this.state,
      query
    }));
    if (query !== '') {
      this.searchBook(query);
    }
  }

  /**
  * @description Searches books using the BooksAPI
  * @param {string} query - Text entered to search a book
  */
  searchBook = (query) => {
    BooksAPI.search(query)
      .then((books) => {
        if (books && books.error) {
          this.setState(() => ({
            ...this.state,
            searchResult: []
          }))
        } else if (books && Array.isArray(books)) {
          this.setState(() => ({
            ...this.state,
            searchResult: books
          }))
        } else {
          this.setState(() => ({
            ...this.state,
            searchResult: []
          }))
        } 
      })
  }

  /**
  * @description Clears the search query
  */
  clear() {
    this.setState(() => ({
      ...this.state,
      query: ''
    }));
    this.fetchBooks();
  }

  /**
  * @description Updates the shelf of a book using the BooksAPI
  * @param {object} book - The book whose shelf is being updated
  * @param {string} shelf - The updated shelf for the book
  */
  updateBook = (book, shelf) => {
    BooksAPI.update(book, shelf)
      .then((updatedShelves) => {
        let updatedBooks = []
        for (let eachBookIndex in this.state.books) {
          let eachBook = this.state.books[eachBookIndex];
          if (updatedShelves.currentlyReading.includes(eachBook.id)) {
            eachBook['shelf'] = 'currentlyReading'
          } else if (updatedShelves.wantToRead.includes(eachBook.id)) {
            eachBook['shelf'] = 'wantToRead'
          } else if (updatedShelves.read.includes(eachBook.id)) {
            eachBook['shelf'] = 'read'
          } else {
            eachBook['shelf'] = 'none'
          }
          updatedBooks.push(eachBook);
        }
        this.setState(() => ({
          ...this.state,
          books: updatedBooks
        }))
      });
  }

  render() {
    const { books, query, searchResult } = this.state
    return (
      <div className="app">
        <Route exact path='/' render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Currently Reading</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                      {books.filter((b) => { return b.shelf === 'currentlyReading' }).map((book) => (
                        <li key={book.id}>
                          <BookDetails
                            book={book}
                            onUpdate={this.updateBook}
                          />
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Want to Read</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                      {books.filter((b) => { return b.shelf === 'wantToRead' }).map((book) => (
                        <li key={book.id}>
                          <BookDetails
                            book={book}
                            onUpdate={this.updateBook}
                          />
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Read</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">
                      {books.filter((b) => { return b.shelf === 'read' }).map((book) => (
                        <li key={book.id}>
                          <BookDetails
                            book={book}
                            onUpdate={this.updateBook}
                          />
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="open-search">
              <Link to='/search'>
                <button>Add a book</button>
              </Link>
            </div>
          </div>
        )} />
        <Route path='/search' render={() => (
          <div className="search-books">
            <div className="search-books-bar">
              <Link to='/'>
                <button className="close-search" onClick={() => this.clear()}>Close</button>
              </Link>
              <div className="search-books-input-wrapper">
                <input
                  type="text"
                  placeholder="Search by title or author"
                  value={query}
                  onChange={(event) => this.onQueryChanged(event.target.value)} />
              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">
                {searchResult && searchResult.length > 0 && searchResult.map((book) => (
                  <li key={book.id}>
                    <BookDetails
                      book={book}
                      onUpdate={this.updateBook}
                    />
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )} />
      </div>
    )
  }
}

export default BooksApp

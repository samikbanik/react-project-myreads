import React, { Component } from 'react';

class BookDetails extends Component {

    /**
     * @description Invokes the updateShelf method in the parent component passed as a prop
     * @param {string} updatedShelf - The updated shelf for the book
     */
    onUpdateBook(updatedShelf) {
        this.props.onUpdate(this.props.book, updatedShelf);
    }

    render() {
        const { title, authors, shelf, imageLinks } = this.props.book
        const imageURL = imageLinks ? imageLinks.thumbnail : ''
        return (
            <div className="book">
                <div className="book-top">
                    <div className="book-cover" style={{ width: 128, height: 192, backgroundImage: `url(${imageURL})` }}></div>
                    <div className="book-shelf-changer">
                        <select
                            onChange={(event) => this.onUpdateBook(event.target.value)}
                            defaultValue={shelf}>
                            <option value="move" disabled>Move to...</option>
                            <option value="currentlyReading">Currently Reading</option>
                            <option value="wantToRead">Want to Read</option>
                            <option value="read">Read</option>
                            <option value="none">None</option>
                        </select>
                    </div>
                </div>
                <div className="book-title">{title}</div>
                {authors && Array.isArray(authors) && authors.length > 0 && (
                    authors.map((author) => (
                        <div key={authors.indexOf(author)} className="book-authors">{author}</div>
                    ))
                )}
            </div>
        )
    }
}

export default BookDetails;
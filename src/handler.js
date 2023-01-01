const { nanoid } = require("nanoid");
const books = require("./books");

// Fungsi untuk add data buku
const addBook = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
    };
    
    const noName = !name;
    const overPage = readPage > pageCount;

    if (noName) {
      const response = h.response({
          status: 'fail',
          message: 'Gagal menambahkan buku. Mohon isi nama buku'
      });
      response.code(400);
      return response;
  };
  if (overPage) {
      const response = h.response({
          status: 'fail',
          message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
      });
      response.code(400);
      return response;
  };

    books.push(newBook);

    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: {
            bookId: id,
          },
        });
        response.code(201);
        return response;
    }; 
      const response = h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
      });
      response.code(500);
      return response;
};

// Fungsi Menampilkan Seluruh Buku
const getAllBooks = (request,h) =>  {
  const { name, reading, finished } = request.query;
  const readingBook = reading !== undefined;
  const finishedBook = finished !== undefined;

  if (!reading && !finished) {
    const response = h.response({
        status: 'success',
        data: {
            books: books.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
        })),
      },
    });

    response.code(200);
    return response;
  }
    
    if (readingBook) {
      const book = books.filter(
          (buku) => Number(buku.reading) === Number(reading),
      );

      const response = h.response({
        status: 'success',
        data: {
          books: book.map((buku) => ({
            id: buku.id,
            name: buku.name,
            publisher: buku.publisher,
          }),
          ),
        },
      });
  
      response.code(200);
      return response;
    }
  
    if (finishedBook) {
      const book = books.filter(
          (book) => Number(book.finished) === Number(finished),
      );
  
      const response = h.response({
        status: 'success',
        data: {
          books: book.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher,
          }),
          ),
        },
      });
  
      response.code(200);
      return response;
    }
  
    const response = h.response({
      status: 'success',
      data: {
        books: books.map((book) => ({
          id: book.id,
          name: book.name,
          publisher: book.publisher,
        }),
        ),
      },
    });
  
    response.code(200);
    return response;
};

// Fungsi Menampilkan Detail dari Buku by id
const getBookById = (request, h) => {
  const {bookId} = request.params;
  const book = books.filter((book) => book.id === bookId)[0];

  if (book !== undefined) {
    const response = h.response({
      status: "success",
      data: {
       book,
      },
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  response.code(404);
  return response;
};

// Fungsi untuk Mengubah Data Buku
const editBookById = (request, h) => {
    const { bookId } = request.params;

    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === bookId);
    const finished = pageCount === readPage

    if (name === undefined) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      });
  
      response.code(400);
      return response;
    }
  
    if (readPage > pageCount) {
      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      });
  
      response.code(400);
      return response;
    }
    if (index !== -1) {
        books[index] = {
          ...books[index],
          name, year, author, 
          summary, publisher, 
          pageCount, readPage, reading,
          finished, updatedAt,
        };
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
      }

      const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      });
      response.code(404);
      return response;
};

// Fungsi untuk Menghapus Buku
const deleteBookById = (request, h) => {
    const { bookId } = request.params;

    const index = books.findIndex((book) => book.id === bookId);

    if (index !== -1) {
        books.splice(index, 1);
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil dihapus',
        });
        
        response.code(200);
        return response;
    }
    const response = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
      response.code(404);
      return response;
};
module.exports = { addBook, getAllBooks, getBookById, editBookById, deleteBookById };

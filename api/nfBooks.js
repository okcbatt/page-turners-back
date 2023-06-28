const express = require("express");
const nfBooksRouter = express.Router();
const {createNFBook, getAllNFBooks, getAllNFBooksByISBN, updateNFBook, destroyNFBook } = require("../db/nfBooks.js");

nfBooksRouter.get("/", async (req, res, next) => {
  try {
    const allNFBooks = await getAllNFBooks()
    res.send(allNFBooks);
  } catch (error) {
    next(error);
  }
});

nfBooksRouter.get("/:isbn", async (req, res, next) => {
    try {
      console.log(req.params.isbn)
      const singleNFBook = await getAllNFBooksByISBN(Number(req.params.isbn))
      res.send(singleNFBook)
    } catch (error) {
      next (error)
    }
    });


nfBooksRouter.post("/", async (req, res, next) => {
  try {
    console.log(req.body);
    const newNFBook = await createNFBook(req.body);
    res.send(newNFBook);
  } catch (error) {
    next(error);
  }
});

nfBooksRouter.delete("/:isbn", async (req, res) => {
  try {
    console.log(req.params.isbn)
    const deletedNFBook = await destroyNFBook(Number(req.params.isbn))
    res.send(deletedNFBook)
  } catch (error) {
    throw (error)
  }
});

nfBooksRouter.put("/:isbn", async (req, res) => {
  try {
    console.log(req.params.isbn)
    const bookISBN = Number(req.params.isbn)
    const updatedData = req.body
    const NewlyUpdatedNFBook = await updateNFBook(bookISBN, updatedData)
    res.send(NewlyUpdatedNFBook)
  } catch (error) {
    throw (error)
  }
})

module.exports = nfBooksRouter;
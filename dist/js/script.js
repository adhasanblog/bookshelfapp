const books = [];
let bookSearch;
const RENDER_DATA = "render-data";
const SAVED_STORAGE = "saved-storage";
const BOOKS_KEY_STORAGE = "BOOKS_APPS";

document.addEventListener(RENDER_DATA, function () {
  const booksContainerUnread = document.querySelector(".unread");
  booksContainerUnread.innerHTML = "";

  const booksContainerRead = document.querySelector(".read");
  booksContainerRead.innerHTML = "";
  if (bookSearch == null) {
    for (const bookItems of books) {
      const bookItem = makeBookItems(bookItems);
      if (!bookItems.iscompleted) {
        booksContainerUnread.append(bookItem);
      } else {
        booksContainerRead.append(bookItem);
      }
    }
  } else {
    for (const bookItems of bookSearch) {
      const bookItem = makeBookItems(bookItems);
      if (!bookItems.iscompleted) {
        booksContainerUnread.append(bookItem);
      } else {
        booksContainerRead.append(bookItem);
      }
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const inputForm = document.querySelector("form");
  optionYear();
  sliderMenuItem();
  maxTitleInput();
  maxWriterNameInput();
  maxDescriptionInput();
  inputForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (inputForm.classList.contains("form-create")) {
      addBook();
      inputForm.reset();
    }
  });
  document.getElementById("inputSearch").addEventListener("input", function () {
    if (document.getElementById("inputSearch").value.length === 0) {
      bookSearch = null;
    }
    searchBookByTitle();
  });
  document.getElementById("inputSearch").addEventListener("click", function () {
    document.getElementById("inputSearch").style.animation =
      "search 1.5s forwards";
  });
  document.getElementById("inputSearch").addEventListener("blur", function () {
    if (document.getElementById("inputSearch").value.length === 0) {
      document.getElementById("inputSearch").style.animation = "";
    }
  });
  if (checkLocalStorageSupport) {
    loadDataFromLocalStorage();
  }
  totalBookHasBeenReadOrUnread();
});
function optionYear() {
  const selectYear = document.querySelector("#year");
  const thisYear = new Date().getFullYear();
  for (i = 1990; i <= thisYear; i++) {
    const itemYear = document.createElement("option");
    itemYear.innerText = i;
    itemYear.setAttribute("value", i);
    selectYear.append(itemYear);
  }
}

function sliderMenuItem() {
  const bookMenu = document.querySelector("#menu");
  const bookMenuItem = document.querySelectorAll(".menu-items");
  const menuSlide = document.querySelector(".slide");
  bookMenu.addEventListener("click", function (e) {
    if (e.target.classList.contains("menu-items")) {
      bookMenuItem.forEach(function (menu) {
        menu.classList.remove("menu-active");
        if (e.target.classList.contains("menu-item2")) {
          menuSlide.style.animation = "slideRight 0.5s forwards";
          document.querySelector(".unread").style.display = "none";
          document.querySelector(".read").style.display = "flex";
        } else {
          menuSlide.style.animation = "slideLeft 0.5s forwards";
          document.querySelector(".unread").style.display = "flex";
          document.querySelector(".read").style.display = "none";
        }
      });
    }

    e.target.classList.toggle("menu-active");
  });
}
function maxTitleInput() {
  const alertMaxTitleBook = document.createElement("span");
  alertMaxTitleBook.style.position = "relative";
  alertMaxTitleBook.style.top = "-20px";
  document.getElementById("title").addEventListener("input", function () {
    const titleBookMaxLength = document.getElementById("title").maxLength;
    const titleBookTypingLength = document.getElementById("title").value.length;
    const titleRemainingTyping = titleBookMaxLength - titleBookTypingLength;
    alertMaxTitleBook.innerText = `Sisa karakter : ${titleRemainingTyping.toString()}`;
    document
      .getElementById("title")
      .insertAdjacentElement("afterend", alertMaxTitleBook);
    if (titleRemainingTyping === 0) {
      alertMaxTitleBook.innerText = "Karakter sudah max";
    } else if (titleRemainingTyping <= 6) {
      alertMaxTitleBook.style.color = "red";
    } else {
      alertMaxTitleBook.style.color = "var(--primary-white)";
    }
  });
  document.getElementById("title").addEventListener("focus", function () {
    alertMaxTitleBook.style.visibility = "visible";
  });
  document.getElementById("title").addEventListener("blur", function () {
    alertMaxTitleBook.style.visibility = "hidden";
  });
}
function maxWriterNameInput() {
  const alertWriterNameInput = document.createElement("span");
  alertWriterNameInput.style.position = "relative";
  alertWriterNameInput.style.top = "-20px";
  document.getElementById("writer").addEventListener("input", function () {
    const writerNameMaxLength = document.getElementById("writer").maxLength;
    const writerNameTypingLength =
      document.getElementById("writer").value.length;
    const writerNameRemainingTyping =
      writerNameMaxLength - writerNameTypingLength;
    alertWriterNameInput.innerText = `Sisa karakter : ${writerNameRemainingTyping.toString()}`;
    document
      .getElementById("writer")
      .insertAdjacentElement("afterend", alertWriterNameInput);
    if (writerNameRemainingTyping === 0) {
      alertWriterNameInput.innerText = "Karakter sudah max";
    } else if (writerNameRemainingTyping <= 6) {
      alertWriterNameInput.style.color = "red";
    } else {
      alertWriterNameInput.style.color = "var(--primary-white)";
    }
  });
  document.getElementById("writer").addEventListener("focus", function () {
    alertWriterNameInput.style.visibility = "visible";
  });
  document.getElementById("writer").addEventListener("blur", function () {
    alertWriterNameInput.style.visibility = "hidden";
  });
}
function checkStorage() {
  if (typeof Storage === undefined) {
    alert("Browser tidak mendukung Local Storage");
  } else {
    return true;
  }
}
function maxDescriptionInput() {
  const alertMaxDescriptionBook = document.createElement("span");
  alertMaxDescriptionBook.style.position = "relative";
  alertMaxDescriptionBook.style.top = "-20px";

  document.getElementById("desc").addEventListener("input", function () {
    const descriptionBookMaxLength = document.getElementById("desc").maxLength;
    const descriptionBookTyping = document.getElementById("desc").value.length;
    const descriptionBookRemainingTyping =
      descriptionBookMaxLength - descriptionBookTyping;
    alertMaxDescriptionBook.innerText = `Sisa karakter : ${descriptionBookRemainingTyping.toString()}`;
    document
      .getElementById("desc")
      .insertAdjacentElement("afterend", alertMaxDescriptionBook);

    if (descriptionBookRemainingTyping === 0) {
      alertMaxDescriptionBook.innerText = "Karakter sudah max";
    } else if (descriptionBookRemainingTyping <= 50) {
      alertMaxDescriptionBook.style.color = "red";
    } else {
      alertMaxDescriptionBook.style.color = "var(--primary-white)";
    }
  });

  document.getElementById("desc").addEventListener("focus", function () {
    alertMaxDescriptionBook.style.visibility = "visible";
  });

  document.getElementById("desc").addEventListener("blur", function () {
    alertMaxDescriptionBook.style.visibility = "hidden";
  });
}
function addBook() {
  const titleBook = document.getElementById("title").value;
  const writerBook = document.getElementById("writer").value;
  const yearBook = document.getElementById("year").value;
  const descriptionBook = document.getElementById("desc").value;
  const checkIscomplated = document.getElementById("check").checked;
  const randomId = getRandomId();
  const bookObject = createBookObject(
    randomId,
    titleBook,
    writerBook,
    yearBook,
    descriptionBook,
    checkIscomplated,
  );
  books.unshift(bookObject);
  document.dispatchEvent(new Event(RENDER_DATA));
  sendDataFromInputToStorage();
  totalBookHasBeenReadOrUnread();
}

function getRandomId() {
  const timestamp = new Date();
  return (
    timestamp.getDate().toString() +
    timestamp.getMonth().toString() +
    timestamp.getFullYear().toString() +
    timestamp.getMilliseconds().toString()
  );
}

function createBookObject(id, title, author, year, desc, iscompleted) {
  return {
    id,
    title,
    author,
    year,
    desc,
    iscompleted,
  };
}

function makeBookItems(bookItemObject) {
  const bookItemContainer = document.createElement("div");
  bookItemContainer.classList.add(
    "book-items",
    `book-item-${bookItemObject.id}`,
  );
  const titleBookField = document.createElement("h3");
  titleBookField.innerText = bookItemObject.title;

  const writerBookField = document.createElement("span");
  writerBookField.innerText = bookItemObject.author;

  const yearBookField = document.createElement("span");
  yearBookField.innerText = bookItemObject.year;

  const descriptionBookField = document.createElement("p");
  descriptionBookField.innerText = bookItemObject.desc + " ...";

  bookItemContainer.append(
    titleBookField,
    writerBookField,
    yearBookField,
    descriptionBookField,
  );

  if (!bookItemObject.iscompleted) {
    const checkButton = document.createElement("span");
    checkButton.classList.add("check-icon");
    bookItemContainer
      .querySelector("h3")
      .insertAdjacentElement("afterend", checkButton);

    checkButton.addEventListener("click", function () {
      addBookHasBeenRead(bookItemObject.id);
    });

    const deleteButton = document.createElement("span");
    deleteButton.classList.add("delete-icon");
    bookItemContainer
      .querySelector("h3")
      .insertAdjacentElement("afterend", deleteButton);

    deleteButton.addEventListener("click", function () {
      deleteBookItem(bookItemObject.id);
    });

    const editButton = document.createElement("span");
    editButton.classList.add("edit-icon");
    bookItemContainer
      .querySelector("h3")
      .insertAdjacentElement("afterend", editButton);

    editButton.addEventListener("click", function () {
      moveDatatoFormEdit(bookItemObject.id);
      document.querySelector("form").classList.add("form-edit");
      document.querySelector("form").classList.remove("form-create");
      updateArraySendObject(bookItemObject.id);
    });
  } else {
    const refreshButton = document.createElement("span");
    refreshButton.classList.add("refresh-icon");
    bookItemContainer
      .querySelector("h3")
      .insertAdjacentElement("afterend", refreshButton);

    refreshButton.addEventListener("click", function () {
      moveBookToUnread(bookItemObject.id);
      totalBookHasBeenReadOrUnread();
    });

    const deleteButton = document.createElement("span");
    deleteButton.classList.add("delete-icon");
    bookItemContainer
      .querySelector("h3")
      .insertAdjacentElement("afterend", deleteButton);

    deleteButton.addEventListener("click", function () {
      deleteBookItem(bookItemObject.id);
    });

    const editButton = document.createElement("span");
    editButton.classList.add("edit-icon");
    bookItemContainer
      .querySelector("h3")
      .insertAdjacentElement("afterend", editButton);

    editButton.addEventListener("click", function () {
      moveDatatoFormEdit(bookItemObject.id);
      document.querySelector("form").classList.add("form-edit");
      document.querySelector("form").classList.remove("form-create");
      updateArraySendObject(bookItemObject.id);
    });
  }

  return bookItemContainer;
}

function addBookHasBeenRead(bookItemObjectId) {
  const bookItemInput = findBookItemObjectInput(bookItemObjectId);

  if (bookItemInput == null) return;

  bookItemInput.iscompleted = true;
  document.dispatchEvent(new Event(RENDER_DATA));
  sendDataFromInputToStorage();
  totalBookHasBeenReadOrUnread();
}

function moveBookToUnread(bookItemObjectId) {
  const bookItemInput = findBookItemObjectInput(bookItemObjectId);

  if (bookItemInput == null) return;

  bookItemInput.iscompleted = false;
  document.dispatchEvent(new Event(RENDER_DATA));
  sendDataFromInputToStorage();
}

function findBookItemObjectInput(bookItemObjectId) {
  for (const bookItemObject of books) {
    if (bookItemObject.id === bookItemObjectId) {
      return bookItemObject;
    }
  }

  return null;
}

function deleteBookItem(bookItemObjectId) {
  const bookItemInput = findBooksArrayIndex(bookItemObjectId);
  const notificationDelete = confirm("Apakah and yakin menghapus data ?");
  if (bookItemInput === null) return;

  if (notificationDelete == true) {
    books.splice(bookItemInput, 1);
  }
  document.dispatchEvent(new Event(RENDER_DATA));
  sendDataFromInputToStorage();
  totalBookHasBeenReadOrUnread();
}
function moveDatatoFormEdit(bookItemObjectId) {
  const getBookItem = findBookItemObjectInput(bookItemObjectId);
  document.getElementById("title").value = getBookItem.title;
  document.getElementById("writer").value = getBookItem.author;
  document.getElementById("year").value = getBookItem.year;
  document.getElementById("desc").value = getBookItem.desc;
  document.getElementById("check").checked = getBookItem.iscompleted;
}
function updateArraySendObject(bookItemObjectId) {
  const getBookItem = findBookItemObjectInput(bookItemObjectId);
  const getBookItemIndex = findBooksArrayIndex(bookItemObjectId);
  const formEdit = document.querySelector("form");
  formEdit.addEventListener("submit", function () {
    if (formEdit.classList.contains("form-edit")) {
      const titleBook = document.getElementById("title").value;
      const writerBook = document.getElementById("writer").value;
      const yearBook = document.getElementById("year").value;
      const descriptionBook = document.getElementById("desc").value;
      const checkIscomplated = document.getElementById("check").checked;
      const bookObject = createBookObject(
        getBookItem.id,
        titleBook,
        writerBook,
        yearBook,
        descriptionBook,
        checkIscomplated,
      );
      books[getBookItemIndex] = bookObject;
      formEdit.reset();
      document.dispatchEvent(new Event(RENDER_DATA));
      sendDataFromInputToStorage();
      totalBookHasBeenReadOrUnread();
    }
    formEdit.classList.add("form-create");
    formEdit.classList.remove("form-edit");
  });
}
function findBooksArrayIndex(bookItemObjectId) {
  for (const bookIndexArray in books) {
    if (books[bookIndexArray].id === bookItemObjectId) {
      return bookIndexArray;
    }
  }

  return null;
}

function checkLocalStorageSupport() {
  if (typeof Storage === undefined) {
    alert("Browser yang anda gunakan tidak mendukung Local Storage!");
  }
  return true;
}

document.addEventListener(SAVED_STORAGE, function () {
  // console.log(localStorage.getItem(BOOKS_KEY_STORAGE).JSON);
});

function loadDataFromLocalStorage() {
  const loadDataBooksObject = localStorage.getItem(BOOKS_KEY_STORAGE);

  let dataBooksObject = JSON.parse(loadDataBooksObject);

  if (dataBooksObject !== null) {
    for (const booksObject of dataBooksObject) {
      books.push(booksObject);
    }
  }

  document.dispatchEvent(new Event(RENDER_DATA));
}

function sendDataFromInputToStorage() {
  if (checkLocalStorageSupport()) {
    const parsedArrayBooks = JSON.stringify(books);
    localStorage.setItem(BOOKS_KEY_STORAGE, parsedArrayBooks);
  }

  document.dispatchEvent(new Event(SAVED_STORAGE));
  console.log("data berhasil di simpan ke local storage");
}

function inputTextSearch(value) {
  return value.title
    .toLowerCase()
    .includes(document.getElementById("inputSearch").value.toLowerCase());
}

function searchBookByTitle() {
  const data = books.filter(inputTextSearch);
  bookSearch = data;
  totalBookHasBeenReadOrUnread();
  document.dispatchEvent(new Event(RENDER_DATA));
}

function searchIsComplatedIsTrue(value) {
  return value.iscompleted === true;
}
function searchIsComplatedIsFalse(value) {
  return value.iscompleted === false;
}

function totalBookHasBeenReadOrUnread() {
  if (bookSearch == null) {
    const data1 = books.filter(searchIsComplatedIsTrue).length;
    const data2 = books.filter(searchIsComplatedIsFalse).length;
    document.querySelector(
      ".menu-item1",
    ).innerText = `BUKU YANG BELUM DIBACA : ${data2}`;
    document.querySelector(
      ".menu-item2",
    ).innerText = `BUKU YANG SUDAH DIBACA : ${data1}`;
  } else {
    const data1 = bookSearch.filter(searchIsComplatedIsTrue).length;
    const data2 = bookSearch.filter(searchIsComplatedIsFalse).length;
    document.querySelector(
      ".menu-item1",
    ).innerText = `BUKU YANG BELUM DIBACA : ${data2}`;
    document.querySelector(
      ".menu-item2",
    ).innerText = `BUKU YANG SUDAH DIBACA : ${data1}`;
  }
}

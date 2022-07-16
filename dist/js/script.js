const books = [];
let bookSearch;
let booksEdit;
const RENDER_DATA = "render-data";
const SAVED_STORAGE = "saved-storage";
const BOOKS_KEY_STORAGE = "BOOKS_APPS";
const TITLE_KEY = "TITLE_KEY";
const AUTOR_KEY = "AUTOR_KEY";
const YEAR_KEY = "YEAR_KEY";
const DESC_KEY = "DESC_KEY";

document.addEventListener(RENDER_DATA, function () {
  const booksContainerUnread = document.querySelector(".unread");
  booksContainerUnread.innerHTML = "";

  const booksContainerRead = document.querySelector(".read");
  booksContainerRead.innerHTML = "";
  if (bookSearch == null) {
    for (const bookItems of books) {
      const bookItem = makeBookItems(bookItems).bookItemContainer;
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
  showFormInMobileDevice();
  sliderMenuItem();
  maxTitleInput();
  maxWriterNameInput();
  maxDescriptionInput();
  if (inputForm.classList.contains("form-create")) {
    saveInputValueInSessionStorage();
    getInputValueInSessionStorage();
  }
  inputForm.addEventListener("submit", function (event) {
    event.preventDefault();
    if (inputForm.classList.contains("form-create")) {
      addBook();
      inputForm.reset();
    } else {
      updateArraySendObject(booksEdit.id, booksEdit.index);
      inputForm.reset();
      inputForm.classList.remove("form-edit");
      inputForm.classList.add("form-create");
    }
    const mediaScreen = window.matchMedia(
      "(max-width: 869px) and (min-width: 300px)",
    );
    if (mediaScreen.matches === true) {
      document.querySelector(".input-logo").classList.remove("active");
      document
        .querySelector(".input-logo")
        .setAttribute("src", "./assets/img/input.svg");
      document.querySelector("aside").style.animation =
        "hideFormAnimationInMobileDevice 0.5s forwards";
      document.querySelector("form").style.animation =
        "hideFormAnimationInMobileDevice 0.25s forwards";
    }
    deleteInputValueInSessionStorage();
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
  const mediaScreen = window.matchMedia(
    "(max-width: 1309px) and (min-width: 300px)",
  );
  bookMenu.addEventListener("click", function (e) {
    if (e.target.classList.contains("menu-items")) {
      bookMenuItem.forEach(function (menu) {
        menu.classList.remove("menu-active");
        if (e.target.classList.contains("menu-item2")) {
          if (mediaScreen.matches === true) {
            menuSlide.style.animation = "slideBottom 0.5s forwards";
          } else {
            menuSlide.style.animation = "slideRight 0.5s forwards";
          }
          document.querySelector(".unread").style.display = "none";
          document.querySelector(".read").style.display = "flex";
        } else {
          if (mediaScreen.matches === true) {
            menuSlide.style.animation = "slideTop 0.5s forwards";
          } else {
            menuSlide.style.animation = "slideLeft 0.5s forwards";
          }
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
  const bookObjectTrue = books.filter(searchIsComplatedIsTrue).length;
  const bookObjectFalse = books.filter(searchIsComplatedIsFalse).length;
  if (
    bookObjectFalse >= 10 &&
    checkIscomplated === false &&
    bookObjectTrue < 10
  ) {
    alert("Rak buku sudah penuh, segera selesaikan bacaanmu");
  } else if (
    bookObjectTrue >= 10 &&
    checkIscomplated === true &&
    bookObjectFalse < 10
  ) {
    alert(
      "Rak sudah penuh, segera hapus buku yang telah selesai dibaca pada rak",
    );
  } else if (bookObjectTrue == 10 && bookObjectFalse == 10) {
    alert("Kedua rak buku penuh, hapus buku di salah satu rak atau keduanya");
  } else {
    books.unshift(bookObject);
    document.dispatchEvent(new Event(RENDER_DATA));
    totalBookHasBeenReadOrUnread();
    setTimeout(sendDataFromArrayToStorage, 500);
  }
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
      const bookObjectTrue = books.filter(searchIsComplatedIsTrue).length;
      if (bookObjectTrue < 10) {
        addBookHasBeenRead(bookItemObject.id);
      } else {
        alert(
          "Kamu tidak bisa memindahkan buku ke rak BUKU YANG SUDAH DIBACA, karena rak sudah penuh",
        );
      }
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
      const mediaScreen = window.matchMedia(
        "(max-width: 869px) and (min-width: 460px)",
      );
      if (mediaScreen.matches === true) {
        document.querySelector(".input-logo").classList.add("active");
        document
          .querySelector(".input-logo")
          .setAttribute("src", "./assets/img/close.svg");
        addShowAnimationFormMobileView();
      }
      const getBookArrayIndex = findBooksArrayIndex(bookItemObject.id);
      booksEdit = { id: bookItemObject.id, index: getBookArrayIndex };
    });
  } else {
    const refreshButton = document.createElement("span");
    refreshButton.classList.add("refresh-icon");
    bookItemContainer
      .querySelector("h3")
      .insertAdjacentElement("afterend", refreshButton);

    refreshButton.addEventListener("click", function () {
      const bookObjectFalse = books.filter(searchIsComplatedIsFalse).length;
      if (bookObjectFalse < 10) {
        moveBookToUnread(bookItemObject.id);
      } else {
        alert(
          "Kamu tidak bisa mengembalikan buku ke rak BUKU YANG BELUM DIBACA, karena rak sudah penuh",
        );
      }
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
      const mediaScreen = window.matchMedia(
        "(max-width: 869px) and (min-width: 460px)",
      );
      if (mediaScreen.matches === true) {
        document.querySelector(".input-logo").classList.add("active");
        document
          .querySelector(".input-logo")
          .setAttribute("src", "./assets/img/close.svg");
        addShowAnimationFormMobileView();
      }
      const getBookArrayIndex = findBooksArrayIndex(bookItemObject.id);
      booksEdit = { id: bookItemObject.id, index: getBookArrayIndex };
    });
  }
  return { bookItemContainer, bookSelectId: bookItemObject.id };
}

function addBookHasBeenRead(bookItemObjectId) {
  const bookItemInput = findBookItemObjectInput(bookItemObjectId);
  if (bookItemInput == null) return;
  bookItemInput.iscompleted = true;
  document.dispatchEvent(new Event(RENDER_DATA));
  totalBookHasBeenReadOrUnread();
  setTimeout(sendDataFromArrayToStorage, 500);
}

function moveBookToUnread(bookItemObjectId) {
  const bookItemInput = findBookItemObjectInput(bookItemObjectId);
  if (bookItemInput == null) return;
  bookItemInput.iscompleted = false;
  document.dispatchEvent(new Event(RENDER_DATA));
  totalBookHasBeenReadOrUnread();
  setTimeout(sendDataFromArrayToStorage, 500);
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
  const notificationDelete = confirm("Apakah kamu yakin menghapus data ?");
  if (bookItemInput === null) return;

  if (notificationDelete == true) {
    books.splice(bookItemInput, 1);
    setTimeout(sendDataFromArrayToStorage, 500);
  }
  document.dispatchEvent(new Event(RENDER_DATA));
  totalBookHasBeenReadOrUnread();
}

function moveDatatoFormEdit(bookItemObjectId) {
  const getBookItem = findBookItemObjectInput(bookItemObjectId);
  console.log(getBookItem);
  document.getElementById("title").value = getBookItem.title;
  document.getElementById("writer").value = getBookItem.author;
  document.getElementById("year").value = getBookItem.year;
  document.getElementById("desc").value = getBookItem.desc;
  document.getElementById("check").checked = getBookItem.iscompleted;
}

function updateArraySendObject(bookItemId, bookArrayIndex) {
  const titleBook = document.getElementById("title").value;
  const writerBook = document.getElementById("writer").value;
  const yearBook = document.getElementById("year").value;
  const descriptionBook = document.getElementById("desc").value;
  const checkIscomplated = document.getElementById("check").checked;
  bookItemObject = createBookObject(
    bookItemId,
    titleBook,
    writerBook,
    yearBook,
    descriptionBook,
    checkIscomplated,
  );
  const bookObjectTrue = books.filter(searchIsComplatedIsTrue).length;
  const bookObjectFalse = books.filter(searchIsComplatedIsFalse).length;
  if (
    bookObjectFalse >= 10 &&
    checkIscomplated === false &&
    bookObjectTrue < 10
  ) {
    alert(
      "Gagal merubah data buku, ubah judul, penulis, tahun maupun deskripsi buku namun tidak untuk rak, karena rak sudah penuh",
    );
  } else if (
    bookObjectTrue >= 10 &&
    checkIscomplated === true &&
    bookObjectFalse < 10
  ) {
    alert(
      "Gagal merubah data buku, ubah judul, penulis, tahun maupun deskripsi buku namun tidak untuk rak, karena rak sudah penuh",
    );
  } else if (bookObjectTrue == 10 && bookObjectFalse == 10) {
    alert("Kedua rak buku penuh, hapus buku di salah satu rak atau keduanya");
  } else {
    books[bookArrayIndex] = bookItemObject;
    document.dispatchEvent(new Event(RENDER_DATA));
    totalBookHasBeenReadOrUnread();
    setTimeout(sendDataFromArrayToStorage, 500);
  }
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
    alert("Browser yang kamu gunakan tidak mendukung Local Storage!");
  }
  return true;
}

document.addEventListener(SAVED_STORAGE, function () {
  alert("Data pada Storage berhasil di perbarui");
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

function sendDataFromArrayToStorage() {
  if (checkLocalStorageSupport()) {
    const parsedArrayBooks = JSON.stringify(books);
    localStorage.setItem(BOOKS_KEY_STORAGE, parsedArrayBooks);
  }
  document.dispatchEvent(new Event(SAVED_STORAGE));
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

function saveInputValueInSessionStorage() {
  const titleBook = document.getElementById("title");
  const writerBook = document.getElementById("writer");
  const yearBook = document.getElementById("year");
  const descriptionBook = document.getElementById("desc");

  titleBook.addEventListener("input", function () {
    sessionStorage.setItem(TITLE_KEY, titleBook.value);
  });

  writerBook.addEventListener("input", function () {
    sessionStorage.setItem(AUTOR_KEY, writerBook.value);
  });

  yearBook.addEventListener("input", function () {
    sessionStorage.setItem(YEAR_KEY, yearBook.value);
  });

  descriptionBook.addEventListener("input", function () {
    sessionStorage.setItem(DESC_KEY, descriptionBook.value);
  });
}
function deleteInputValueInSessionStorage() {
  sessionStorage.removeItem(TITLE_KEY);
  sessionStorage.removeItem(AUTOR_KEY);
  sessionStorage.removeItem(YEAR_KEY);
  sessionStorage.removeItem(DESC_KEY);
}

function getInputValueInSessionStorage() {
  let titleBook = document.getElementById("title");
  let writerBook = document.getElementById("writer");
  let yearBook = document.getElementById("year");
  let descriptionBook = document.getElementById("desc");
  titleBook.value = sessionStorage.getItem(TITLE_KEY);
  writerBook.value = sessionStorage.getItem(AUTOR_KEY);
  yearBook.value = sessionStorage.getItem(YEAR_KEY);
  descriptionBook.value = sessionStorage.getItem(DESC_KEY);
}

function showFormInMobileDevice() {
  document.querySelector(".input-logo").addEventListener("click", function () {
    const mediaScreen = window.matchMedia(
      "(max-width: 869px) and (min-width: 300px)",
    );
    if (mediaScreen.matches === true) {
      document.querySelector(".input-logo").classList.toggle("active");
      if (document.querySelector(".input-logo").classList.contains("active")) {
        document
          .querySelector(".input-logo")
          .setAttribute("src", "./assets/img/close.svg");
        addShowAnimationFormMobileView();
      } else {
        document
          .querySelector(".input-logo")
          .setAttribute("src", "./assets/img/input.svg");
        addHideAnimationFormMobileView();
      }
    }
  });
}

function addShowAnimationFormMobileView() {
  document
    .querySelector("aside")
    .style.setProperty(
      "animation",
      "showFormAnimationInMobileDevice 0.5s forwards",
    );
  document
    .querySelector("form")
    .style.setProperty(
      "animation",
      "showFormAnimationInMobileDevice 0.2s forwards",
    );
}

function addHideAnimationFormMobileView() {
  document
    .querySelector("aside")
    .style.setProperty(
      "animation",
      "hideFormAnimationInMobileDevice 0.5s forwards",
    );
  document
    .querySelector("form")
    .style.setProperty(
      "animation",
      "hideFormAnimationInMobileDevice 0.3s forwards",
    );
}

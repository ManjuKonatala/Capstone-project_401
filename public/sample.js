document.addEventListener("DOMContentLoaded", ()=> {
    var item, title, author, publisher, bookLink, bookImg;
    var outputList = document.getElementById("list-output");
    var bookUrl = "https://www.googleapis.com/books/v1/volumes?q=";
    var apiKey = "AIzaSyCjaV4cOnFRWZeybP6QtCX9KQRNhpHX0ds";
    var placeHldr = '<img src="https://via.placeholder.com/150">';
    var searchData;
  
    // Function to display book details
    function displayBooks(data) {
      outputList.innerHTML = ""; 
      searchData = data.items;
  
      searchData.forEach(function(book, index) {
        item = document.createElement("div");
        item.classList.add("book-item");
  
        title = document.createElement("h2");
        title.innerHTML = book.volumeInfo.title;
  
        author = document.createElement("p");
        author.innerHTML = "Author: " + book.volumeInfo.authors;
  
        publisher = document.createElement("p");
        publisher.innerHTML = "Publisher: " + book.volumeInfo.publisher;
  
        bookLink = document.createElement("a");
        bookLink.href = book.volumeInfo.previewLink;
        bookLink.target = "_blank";
        bookLink.innerHTML = "Read Book";
  
        bookImg = document.createElement("img");
        if (book.volumeInfo.imageLinks) {
          bookImg.src = book.volumeInfo.imageLinks.thumbnail;
        } else {
          bookImg.src = "https://via.placeholder.com/150";
        }
  
        item.appendChild(bookImg);
        item.appendChild(title);
        item.appendChild(author);
        item.appendChild(publisher);
        item.appendChild(bookLink);
        outputList.appendChild(item);
        
      });
    }
  
    // Function to perform a book search
    function searchBooks() {
      var searchTerm = document.getElementById("search-box").value;
      var finalUrl = bookUrl + searchTerm + "&maxResults=6&"+ apiKey;
  
      fetch(finalUrl)
        .then(function(response) {
          return response.json();
        })
        .then(function(data) {
          console.log(data);
          displayBooks(data);
        })
        .catch(function(error) {
          console.log("Error: " + error);
        });
    }
    document.getElementById("search").addEventListener("click", searchBooks);
    
  });
  
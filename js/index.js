const END_POINT = "https://jsonplaceholder.typicode.com/photos";
const IMAGES_STORAGE_KEY = "images";
const MAX_ITEM_IN_CHUNK = 10;

let currentIndex = 0;
let currentImage = 0;
let images = [];

async function fetchImages() {
  try {
    const response = await fetch(END_POINT);

    const data = await response.json();

    const splitedImages = splitArrayIntoChunks(data);
    localStorage.setItem(IMAGES_STORAGE_KEY, JSON.stringify(splitedImages));

    images = splitedImages;
    showImage(currentIndex);
  } catch (error) {
    console.error("Error fetching images:", error);
  }
}

const getStoredImages = () => {
  images = JSON.parse(localStorage.getItem(IMAGES_STORAGE_KEY));
  showImage(currentIndex);
};

const displayImage = async () => {
  const images = JSON.parse(localStorage.getItem(IMAGES_STORAGE_KEY));

  if (!images) {
    await fetchImages();
    return;
  }
  getStoredImages();
};

const splitArrayIntoChunks = (arr = []) => {
  let imageIndex = 0;
  const imagesChunks = [[]];
  let chunkIndex = 0;

  while (imageIndex < arr.length) {
    if (imagesChunks[chunkIndex].length < MAX_ITEM_IN_CHUNK) {
      imagesChunks[chunkIndex].push(arr[imageIndex]);
    } else {
      chunkIndex++;
      imagesChunks[chunkIndex] = [arr[imageIndex]];
    }
    imageIndex++;
  }

  return imagesChunks;
};

function showImage(index) {
  const imageContainer = document.getElementById("image-container");
  imageContainer.innerHTML = "";
  const image = document.createElement("img");

  image.src = images[index][currentImage].url;
  image.alt = images[index][currentImage].title;
  image.className = "carousel-image";
  imageContainer.appendChild(image);
}

function prevImage() {
  const currentArray = images[currentIndex];
  currentImage = (currentImage - 1 + currentArray.length) % currentArray.length;
  showImage(currentIndex);

  // Check if the current image has reached the beginning of the current array
  if (currentImage === 0) {
    // Move to the previous array in the nested array
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    currentImage = images[currentIndex].length - 1; // Set currentImage to the last index of the new array
  }
}

function nextImage() {
  const currentArray = images[currentIndex];
  currentImage = (currentImage + 1) % currentArray.length;
  showImage(currentIndex);

  // Check if the current array has reached its end
  if (currentImage === 0) {
    // Move to the previous array in the nested array
    currentIndex = (currentIndex + 1 + images.length) % images.length;
  }
}
document.getElementById("prevBtn").addEventListener("click", prevImage);
document.getElementById("nextBtn").addEventListener("click", nextImage);

displayImage();

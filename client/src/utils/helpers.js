export function pluralize(name, count) {
  return count === 1 ? name : `${name}s`;
}

export function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("shop-shop", 1);
    let db, tx, store;

    request.onupgradeneeded = function (e) {
      const db = request.result;
      db.createObjectStore("products", { keyPath: "_id" });
      db.createObjectStore("categories", { keyPath: "_id" });
      db.createObjectStore("cart", { keyPath: "_id" });
    };

    request.onerror = function (e) {
      console.error("There was an error:", e);
      reject(e);
    };

    request.onsuccess = function (e) {
      db = request.result;
      tx = db.transaction(storeName, "readwrite");
      store = tx.objectStore(storeName);

      db.onerror = function (e) {
        console.error("Database error:", e);
        reject(e);
      };

      switch (method) {
        case "put":
          store.put(object);
          resolve(object);
          break;
        case "get":
          const all = store.getAll();
          all.onsuccess = function () {
            resolve(all.result);
          };
          break;
        case "delete":
          store.delete(object._id);
          resolve();
          break;
        default:
          console.error("No valid method");
          reject("No valid method");
          break;
      }

      tx.oncomplete = function () {
        db.close();
      };
    };
  });
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function getRemainingTime(endTime) {
  const currentTime = Date.now();
  const remainingTime = endTime - currentTime;

  const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

  return {
    minutes: minutes < 10 ? `0${minutes}` : minutes,
    seconds: seconds < 10 ? `0${seconds}` : seconds,
  };
}

export function convertTimestampToDate(timestamp) {
  const date = new Date(parseInt(timestamp, 10));
  return date.toLocaleString();
}

export const logRequestDetails = (
  operationName,
  headers,
  timeLeft,
  highestBidUser
) => {
  console.log(`Operation: ${operationName}`);
  console.log("Request headers:", headers);
  console.log("Current time left:", timeLeft, "seconds");
  console.log(
    "Current highest bid user:",
    highestBidUser ? highestBidUser.username : "None"
  );
};

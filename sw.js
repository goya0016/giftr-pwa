self.addEventListener("install", evt => {
    console.log('sw installed',evt)
    self.skipWaiting();
});
self.addEventListener("activate", evt => {console.log("sw activated",evt)})
self.addEventListener("fetch", evt => {console.log("sw fetch",evt)})
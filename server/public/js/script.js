const socket = io();
const app = document.getElementById('app');

socket.on("dumpUpdate", (dump) => {
    console.log("update");
    app.innerHTML = dump;
    // Symfony script to reorder dumps correctly
    const articles = app.getElementsByTagName('article');
    console.log(articles);
    for(let i = 1; i < articles.length; i++){
        app.insertBefore(articles[i], articles[0]);
    }
});
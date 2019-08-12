let socket = io();

socket.on("dumpUpdate", (dump) => {
    console.log("update");
    document.getElementById('app').innerHTML = dump;
});
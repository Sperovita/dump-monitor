let socket = io();

const reverseChildren = (element) => {
  for (var i=1;i<element.childNodes.length;i++){
    element.insertBefore(element.childNodes[i], element.firstChild);
  }
}

socket.on("dumpUpdate", (dump) => {
    console.log("update");
    document.getElementById('app').innerHTML = dump;
    // Symfony script to reorder dumps correctly
    reverseChildren(document.getElementsByTagName('header')[0]);
});
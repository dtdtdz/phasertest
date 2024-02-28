document.addEventListener("DOMContentLoaded", function() {
    var socket = new WebSocket("ws://localhost:8080/binary");
    socket.binaryType = "arraybuffer"; // 바이너리 데이터 타입 설정

    socket.onopen = function(e) {
        console.log("Connection established");
    };

    socket.onmessage = function(event) {
        console.log(`Data received from server: ${event.data}`);
    };

    socket.onclose = function(event) {
        if (event.wasClean) {
            console.log(`Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            console.log('Connection died');
        }
    };

    socket.onerror = function(error) {
        console.log(`WebSocket error: ${error.message}`);
    };
    if(socket.readyState === WebSocket.OPEN)
        socket.send(new ArrayBuffer(100));

    document.getElementById("sendButton").addEventListener("click", function() {
        if(socket.readyState === WebSocket.OPEN) {
            var arrayBuffer = new ArrayBuffer(100); // 예시로 100바이트의 ArrayBuffer 생성
            // ArrayBuffer에 데이터 채우기 (예제에서는 실제로 데이터를 채우지 않았습니다)
            var uint8View = new Uint8Array(arrayBuffer);
            uint8View[0] = 1;

            socket.send(arrayBuffer);
            console.log("Binary data sent");
        } else {
            console.log("WebSocket is not open. Unable to send data.");
        }
    });
});

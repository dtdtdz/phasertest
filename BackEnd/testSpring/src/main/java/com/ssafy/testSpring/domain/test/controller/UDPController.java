package com.ssafy.testSpring.domain.test.controller;

import java.io.IOException;
import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;

public class UDPController {
    public static void main(String[] args) {
        DatagramSocket socket = null;
        try {
            // 서버의 DatagramSocket을 생성합니다. 포트 번호를 지정하지 않으면 시스템이 자동으로 할당합니다.
            socket = new DatagramSocket();

            // 보낼 메시지를 바이트 배열로 변환합니다.
            String message = "Hello UDP Client!";
            byte[] buffer = message.getBytes();

            // 클라이언트의 IP 주소와 포트 번호를 지정합니다. (예시에서는 로컬호스트와 12345 포트를 사용)
            InetAddress clientAddress = InetAddress.getByName("localhost");
            int clientPort = 12345;

            // 데이터와 클라이언트의 주소, 포트 정보를 담은 DatagramPacket을 생성합니다.
            DatagramPacket packet = new DatagramPacket(buffer, buffer.length, clientAddress, clientPort);

            // 패킷을 클라이언트로 전송합니다.
            socket.send(packet);
            System.out.println("Message sent to the client: " + message);

        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (socket != null) {
                socket.close();
            }
        }
    }
}

package com.ssafy.testSpring.domain.test.handler;


import com.ssafy.testSpring.domain.test.domain.RoomInfo;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.AbstractWebSocketHandler;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
public class MyWebSocketHandler extends AbstractWebSocketHandler {

    public enum  MessageType {
        LOGIN,
        CREATE_ROOM,
        ENTER_ROOM,
        READY,
        UNREADY
    }

    private final static CopyOnWriteArraySet<WebSocketSession> sessions = new CopyOnWriteArraySet<>();
    private final static HashMap<WebSocketSession, RoomInfo> usermap = new HashMap<>();
    private final static LinkedList<RoomInfo> roomList = new LinkedList<>();
//    private final
    @Override
    protected void handleBinaryMessage(WebSocketSession session, BinaryMessage message) throws Exception {
        ByteBuffer byteBuffer = message.getPayload();

        // 여기에서 바이너리 데이터 처리
        byte[] arr = byteBuffer.array();
        MessageType type = MessageType.values()[arr[0]];
        switch (type){
            case LOGIN -> login(session, arr);
            case CREATE_ROOM -> create(session, arr);
            case ENTER_ROOM -> enter(session, arr);
            case READY -> System.out.println(0);
            case UNREADY -> System.out.println(1);
        }
        System.out.println(type);
        System.out.println();
        System.out.println("Received binary message of size: " + byteBuffer.remaining());

        // 필요에 따라 응답 보내기
//         session.sendMessage(new BinaryMessage("response".getBytes()));

    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        System.out.println("Connection established");
        sessions.add(session);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        System.out.println("Connection closed: " + status);
        if (sessions.remove(session)){
//            System.out.println("close");
        }
    }

    private void login(WebSocketSession session, byte[] arr){

    }

    private void create(WebSocketSession session, byte[] arr){
        System.out.println("create");
        roomList.add(new RoomInfo());
//        System.out.println(roomList.size());

    }

    private void enter(WebSocketSession session, byte[] arr){
//        usermap.put(session, arr[1]);
    }

    private void gameStart(){

    }

    @Scheduled(fixedRate = 10)
    private void physics (){
        for (RoomInfo roomInfo: roomList){
            if (Duration.between(roomInfo.getTime(), LocalDateTime.now()).getSeconds()>=1){
                System.out.println("game close");
                roomList.remove(roomInfo);
            } else {
                System.out.println("game logic");
                for (WebSocketSession session:sessions){
                    try {
//                        System.out.println(1);
//                        session.sendMessage(new BinaryMessage("11".getBytes()));
                        float a = 1;
                        float b = 1.4f;
                        String textMessage = a+","+b;
                        session.sendMessage(new TextMessage(a+","+b));
                        System.out.println(textMessage);
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                }
            }
        }
//        usermap.put(sessions, new RoomInfo());
    }
}
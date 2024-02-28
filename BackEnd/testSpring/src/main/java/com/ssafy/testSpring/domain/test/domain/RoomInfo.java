package com.ssafy.testSpring.domain.test.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Getter
@AllArgsConstructor
public class RoomInfo {
    LocalDateTime time;
    public RoomInfo(){
        time = LocalDateTime.now();
    }
}

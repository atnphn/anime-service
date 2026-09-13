package com.myservice.controller;

import com.myservice.dto.CodeRequest;
import com.myservice.dto.CodeResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

@RestController
@RequestMapping("/api/manager")
public class ManagerCodeController {

    @Value("${manager.code}")
    private String managerCode;

    @PostMapping("/verify-code")
    public CodeResponse verifyCode(@RequestBody CodeRequest request) {
        String submitted = request.getCode() == null ? "" : request.getCode();
        boolean valid = constantTimeEquals(submitted, managerCode);
        return new CodeResponse(valid);
    }

    // So sánh chuỗi theo cách chống timing attack, thay vì dùng .equals() thông thường
    private boolean constantTimeEquals(String a, String b) {
        byte[] aBytes = a.getBytes(StandardCharsets.UTF_8);
        byte[] bBytes = b.getBytes(StandardCharsets.UTF_8);
        return MessageDigest.isEqual(aBytes, bBytes);
    }
}
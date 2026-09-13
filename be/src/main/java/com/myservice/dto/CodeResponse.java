package com.myservice.dto;

public class CodeResponse {
    private boolean valid;

    public CodeResponse(boolean valid) {
        this.valid = valid;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }
}
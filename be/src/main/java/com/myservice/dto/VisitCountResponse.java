package com.myservice.dto;

public class VisitCountResponse {
    private long count;

    public VisitCountResponse(long count) {
        this.count = count;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }
}

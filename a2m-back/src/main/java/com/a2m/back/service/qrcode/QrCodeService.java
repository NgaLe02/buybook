package com.a2m.back.service.qrcode;

import java.io.IOException;
import java.io.OutputStream;

import com.google.zxing.NotFoundException;
import com.google.zxing.WriterException;

public interface QrCodeService {
//    void generateQr(String data, OutputStream outputStream) throws WriterException, IOException;
    
    void generateQr(String data) throws WriterException, IOException;

    
    String decodeQr(byte[] data) throws IOException, NotFoundException;
    
    String getQrCode(String fileName);
}

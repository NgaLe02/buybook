package com.a2m.back.controller.qrcode;
import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.MissingRequestValueException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.a2m.back.model.qrcode.GenerateQrRequest;
import com.a2m.back.model.resp.DecodedQrResponse;
import com.a2m.back.service.qrcode.QrCodeService;
import com.google.zxing.NotFoundException;
import com.google.zxing.WriterException;

@RestController
public class QrCodeController {

    @Autowired
    private QrCodeService qrCodeService;

    @PostMapping(path = "/api/public/qr/generate", produces = MediaType.IMAGE_JPEG_VALUE)
    public void generateQr(@RequestBody GenerateQrRequest request, HttpServletResponse response) throws MissingRequestValueException, WriterException, IOException {
        if( request==null || request.getQrString()==null || request.getQrString().trim().equals("") ) {
            throw new MissingRequestValueException("QR String is required");
        }
//        qrCodeService.generateQr(request.getQrString(), response.getOutputStream());
        qrCodeService.generateQr(request.getQrString());

        response.getOutputStream().flush();
    }

    @PostMapping(path = "/api/public/qr/decode")
    public DecodedQrResponse decodeQr(@RequestParam("qrCode") MultipartFile qrCode) throws IOException, NotFoundException {
        String qrCodeString =  qrCodeService.decodeQr(qrCode.getBytes());
        return new DecodedQrResponse(qrCodeString);
    }

}
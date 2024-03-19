package com.a2m.back.service.qrcode.impl;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

import javax.imageio.ImageIO;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.a2m.back.service.qrcode.QrCodeService;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.BinaryBitmap;
import com.google.zxing.MultiFormatReader;
import com.google.zxing.NotFoundException;
import com.google.zxing.Result;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.common.HybridBinarizer;
import com.google.zxing.qrcode.QRCodeWriter;

@Service
public class QrCodeServiceImpl implements QrCodeService{

	@Value("${path.default.uploaddirbook}")
	private String pathBook;

	@Override
	public void generateQr(String data) throws WriterException, IOException {
        BitMatrix bitMatrix = new QRCodeWriter().encode(data, BarcodeFormat.QR_CODE, 200, 200);
       
        String filePath = pathBook + data + "qr"  + ".jpg";
        
        File outputFile = new File(filePath);

        MatrixToImageWriter.writeToStream(bitMatrix, "jpeg", new FileOutputStream(outputFile));

//        MatrixToImageWriter.writeToStream(bitMatrix, "jpeg", outputStream);

        
//      }
	}

	@Override
	public String decodeQr(byte[] data) throws IOException, NotFoundException {
		Result result = new MultiFormatReader()
                .decode(new BinaryBitmap(new HybridBinarizer(new BufferedImageLuminanceSource(
                        ImageIO.read(new ByteArrayInputStream(data))))));
        return result != null ? result.getText() : null;
	}

	@Override
	public String getQrCode(String fileName) {
		String base64Image = "";
		try {
			Path imagePath = null;
			if (fileName.equals("no-image.png"))
				imagePath = Paths.get("src/main/resources/assets/qrBook/no-image.png");
			else
				imagePath = Paths.get("src/main/resources/assets/qrBook/" + fileName + ".jpg");
			byte[] imageBytes = Files.readAllBytes(imagePath);
			base64Image = Base64.getEncoder().encodeToString(imageBytes);
			return base64Image;
		} catch (Exception e) {
			e.printStackTrace();
		}
		return base64Image;
	}

}

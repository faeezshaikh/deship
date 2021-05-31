import { Injectable } from '@angular/core';

import { Camera, CameraResultType, CameraSource, CameraPhoto } from '@capacitor/camera';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { MoralisService } from './moralis.service';
// import { Storage } from @capacitor/storage;

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  public photos: Photo[] = [];

  constructor(private moralisService : MoralisService) { }

  public async addNewToGallery() {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });

  // this.photos.unshift({
  //   filepath: 'soon',
  //   webviewPath: capturedPhoto.webPath
  // });

    // Save the picture and add it to photo collection
    const savedImageFile = await this.savePicture(capturedPhoto);
    this.photos.unshift(savedImageFile);

    console.log('Final response:' ,savedImageFile);



  }

  private async savePicture(cameraPhoto: CameraPhoto) {
    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(cameraPhoto);

    // Write the file to the data directory
    const fileName = new Date().getTime() + '.jpeg';
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    const resp = await this.moralisService.saveImage(cameraPhoto.webPath,fileName,base64Data);
    console.log('Resonse from moralis save ipfs hash',resp.hash);
    console.log('Resonse from moralis save ipfs: ',resp.ipfs);
    console.log('Resonse from moralis save moralis url : ',resp.moralisurl);



    // Use webPath to display the new image instead of base64 since it's
    // already loaded into memory
    return {
      filepath: fileName,
      webviewPath: cameraPhoto.webPath,
      ipfs:resp.ipfs,
      hash:resp.hash,
      moralisImgUrl:resp.moralisurl
    };
  }

  private async readAsBase64(cameraPhoto: CameraPhoto) {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(cameraPhoto.webPath!);
    const blob = await response.blob();

    return await this.convertBlobToBase64(blob) as string;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader = new FileReader;
    reader.onerror = reject;
    reader.onload = () => {
        resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });
}

export interface Photo {
  filepath: string;
  webviewPath: string;
  ipfs: string;
  hash: string;
  moralisImgUrl:string
}

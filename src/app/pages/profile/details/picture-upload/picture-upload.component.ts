import { Component, Output, EventEmitter } from "@angular/core";
import { ImageUploaderOptions, FileQueueObject, Status } from "ngx-image-uploader-next";
import { environment } from "src/environments/environment";
declare const window: any;

@Component({
    selector: "app-profile-picture-upload",
    templateUrl: "./picture-upload.component.html",
})
export class ProfilePictureUploadComponent {
    options: ImageUploaderOptions = {
        thumbnailHeight: 150,
        thumbnailWidth: 150,
        uploadUrl: this.uploadURL(),
        allowedImageTypes: ["image/png", "image/jpeg"],
        maxImageSize: 1,
    };
    @Output() imageChanged = new EventEmitter<string>();

    onUpload(file: FileQueueObject) {
        const reader = new FileReader();
        reader.readAsDataURL(file.file);
        reader.onload = () => {
            this.updateImage(reader.result);
        };
    }

    updateImage(value: any) {
        this.imageChanged.emit(value);
    }

    statusChanged(status: any) {
        if (status === Status.NotSelected || status === Status.Error) {
            this.imageChanged.emit();
        }
    }

    uploadURL() {
        const output = window.location.href.toString();
        return (
            (output
                .replace("http:", "https:")
                .replace("localhost:4200", "www." + environment.websiteURL)
                .replace("www", "selection")
                .replace("dev", "dev.selection")
                .replace("demo", "demo.selection") as string) + "/file/register"
        );
    }
}

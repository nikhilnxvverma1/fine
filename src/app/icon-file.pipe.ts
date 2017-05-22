/**
 * Created by NikhilVerma on 02/09/16.
 */

import { Pipe, PipeTransform } from '@angular/core';
import {DataItem} from '../core/data-item';
import {Folder} from "../core/folder";

/*
 * Returns path to the icon file for a given data item.
 * If no corresponding icon file exists, it return a generic one.
 * Usage:
 *   dataItem | iconFile
 */
@Pipe({name: 'iconFile'})
export class IconFile implements PipeTransform{

    //for the sake of maintenance, please keep this list in alphabetical order
    static availableIcons=["7z","aac","aep","ai","aiff","app","avi","bmp","class","cpp","cs","css","csv","dll","doc",
        "docx","exe","exif","flac","flv","gif","h","html","jar","java","jpeg","jpg","js","json","key","less" +
        "m","mkv","mm","mp3","mp4","mpg","numbers","odp","ods","odt","ogg","pages","pdf","php","png","ppt","pptx",
        "psd","py","rar","rtf","sass","scss","sketch","sql","srt","svg","tiff","ts","txt","wav","webm","wma","wmv",
        "xaml","xls","xlsx","xml","zip"];

    transform(dataItem:DataItem, args:any):string {

        var iconFile:string;

        if(dataItem.isDirectory()){

            //check if the folder is a dummy folder
            if((<Folder>dataItem).depth==-100){
                iconFile= "new-folder.svg";
            }else{
                var extension=dataItem.getExtension();
                if(extension===".app"){
                    iconFile= "app.svg";
                }else{
                    iconFile="generic-folder.svg";
                }
            }
        }else{
            //get extension and remove the dot in front of the extension
            var extension=dataItem.getExtension().substr(1);

            //if extension is available return corresponding file icon
            iconFile=IconFile.iconFor(extension);
        }
        return "images/file-icons/"+iconFile;
    }

    static iconFor(extension:string):string{

        for(var i=0;i<IconFile.availableIcons.length;i++){
            if(IconFile.availableIcons[i]===extension){
                return IconFile.availableIcons[i]+".svg";
            }
        }
        return "generic-file.svg";
    }

}
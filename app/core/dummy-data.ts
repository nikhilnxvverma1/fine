/**
 * Created by NikhilVerma on 18/06/16.
 */

import {DataItem} from "./data-item";
import {ScanTarget} from "./scan-target";
import {Folder} from "./folder";
import {File} from "./file";
import {ScanTargetType} from "./scan-target-type";
/**
 * Used to populate the data structure for development purposes.
 * The code is majorly borrowed from dummy-generator.js except the persistence part.
 */
export class DummyData{
    private extensions=[
        'txt',
        'mp3',
        'jpg',
        'png',
        'pdf',
        'psd',
        'java',
        'js',
        'html',
        'avi',
        'ogg',
        'mp4',
        'xml',
        'css'
    ];
    private adjectives=[
        '',
        'good',
        'bad',
        'ugly',
        'beautiful',
        'hard',
        'boring',
        'black',
        'white',
        'romantic',
        'urgent',
        'educational',
        'old',
        'new',
        'young',
        'stupid',
        'nice',
        'real',
        'fake'
    ];
    private nouns=[
        'project',
        'homework',
        'assignment',
        'history',
        'pictures',
        'music',
        'photo',
        'library',
        'campaign',
        'harddisk',
        'filter',
        'folder',
        'footage',
        'script',
        'code',
        'event',
        'college',
        'reunion'
    ];

    private seperators=[
        '',
        ' ',
        '_',
        '-'
    ];

    /**
     * Creates a dummy tree based DataItem data structure in memory that can be used as a mock
     */
    public dummyDataItems(depth:number,maxFilesPerFolder:number,maxFolderPerFolder:number,path:string,name:string):DataItem{
        console.log("depth "+depth+" maxFilesPerFolder "+maxFilesPerFolder+" maxFolderPerFolder "+maxFolderPerFolder+" path "+path+" folderName "+name);
        var root={
            "name":name,
            "isFile":false,
            "children":[]
        };
        this.randomTree(root,0,depth,maxFilesPerFolder,maxFolderPerFolder);
        return this.populate(path,root);
    }

    /**
     * Creates a list of scan targets used as a mock
     * @param n number of scan targets to create
     * @returns list of scan targets
     */
    public dummyScanTargets():ScanTarget[]{

        //3 dummy targets
        var list:ScanTarget[]=[];
        list.push(new ScanTarget("Macintosh HD",ScanTargetType.HardDisk,12.4,101.4,50));
        list.push(new ScanTarget("Nikhil USB",ScanTargetType.USBStick,10.4,4.4,0));
        list.push(new ScanTarget("Local folder",ScanTargetType.Folder,12.4,0,0));

        return list;
    }

    private uniqueIdentifier(alreadyUsed,isFile:boolean){
        do {
            var adjective = this.adjectives[this.random(this.adjectives.length)];
            var seperator1 = this.seperators[this.random(this.seperators.length)];
            var noun = this.nouns[this.random(this.nouns.length)];
            var seperator2 = this.seperators[this.random(this.seperators.length)];
            var randomElement = this.random(100);
            var name;
            if (isFile) {
                var extension = this.extensions[this.random(this.extensions.length)];
                name = adjective + seperator1 + noun + seperator2 + randomElement +'.'+extension;
            } else {
                name = adjective + seperator1 + noun + seperator2 + randomElement;
            }
        } while (alreadyUsed.indexOf(name)>-1);
        return name;
    }

    private random(max:number){
        return Math.floor((Math.random() * max));
    }

    private randomTree(node,currentDepth,maxDepth,maxFilesPerFolder,maxFolderPerFolder){

        //random number of files (always above 0)
        var totalFiles=this.random(maxFilesPerFolder)+1;
        var totalFolders=this.random(maxFolderPerFolder)+1;

        //list of used up identifiers across this folder
        var usedIdentifiers=[];

        //make all the files first
        for(var i=0;i<totalFiles;i++){
            var filename=this.uniqueIdentifier(usedIdentifiers,true);
            usedIdentifiers.push(filename);
            var fileNode={
                "name":filename,
                "isFile":true,
                "children":[]
            };
            node.children.push(fileNode);
        }

        if (currentDepth+1<maxDepth) {

            //next add all the folders
            for (var j = 0; j < totalFolders; j++) {
                var folderName = this.uniqueIdentifier(usedIdentifiers, false);
                usedIdentifiers.push(folderName);
                var folderNode = {
                    "name": folderName,
                    "isFile": false,
                    "children": []
                };
                node.children.push(folderNode);
            }

            //iterate through each child of the node and recursively call this method for each folder node
            for(j=0;j<node.children.length;j++){
                if(!node.children[j].isFile){
                    this.randomTree(node.children[j],currentDepth+1,maxDepth,maxFilesPerFolder,maxFolderPerFolder);
                }
            }
        }
    }

    private populate(path,node):DataItem{
        if(node.isFile){
            //console.log(">"+node.name);
            let file = new File(path, node.name, null);
            file.size=this.random(9999999999);
            return file;
        }else{
            //console.log("[]"+node.name);
            var folder=new Folder(path,node.name,null);
            folder.size=this.random(9999999999);
            for(var i=0;i<node.children.length;i++){
                folder.addDataItem(this.populate(path+node.name+'/',node.children[i]));
            }
            return folder;
        }
    }

}

/**
 * Created by NikhilVerma on 11/06/16.
 */

var fs = require('fs-extra');

var extensions=[
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
var adjectives=[
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
var nouns=[
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

var seperators=[
    '',
    ' ',
    '_',
    '-'
];

exports.dummy=function(depth,maxFilesPerFolder,maxFolderPerFolder,path,name){
    console.log("depth "+depth+" maxFilesPerFolder "+maxFilesPerFolder+" maxFolderPerFolder "+maxFolderPerFolder+" path "+path+" folderName "+name);
    var root={
        "name":name,
        "isFile":false,
        "children":[]
    };
    randomTree(root,0,depth,maxFilesPerFolder,maxFolderPerFolder);
    persist(path,root);
    console.log("Dummy file structure created :"+path+name);
};

function uniqueIdentifier(alreadyUsed,isFile){
    do {
        var adjective = adjectives[random(adjectives.length)];
        var seperator1 = seperators[random(seperators.length)];
        var noun = nouns[random(nouns.length)];
        var seperator2 = seperators[random(seperators.length)];
        var randomElement = random(100);
        var name;
        if (isFile) {
            var extension = extensions[random(extensions.length)];
            name = adjective + seperator1 + noun + seperator2 + randomElement +'.'+extension;
        } else {
            name = adjective + seperator1 + noun + seperator2 + randomElement;
        }
    } while (alreadyUsed.indexOf(name)>-1);
    return name;
}

function random(max){
    return Math.floor((Math.random() * max));
}

function randomTree(node,currentDepth,maxDepth,maxFilesPerFolder,maxFolderPerFolder){

    //random number of files (always above 0)
    var totalFiles=random(maxFilesPerFolder)+1;
    var totalFolders=random(maxFolderPerFolder)+1;

    //list of used up identifiers across this folder
    var usedIdentifiers=[];

    //make all the files first
    for(var i=0;i<totalFiles;i++){
        var filename=uniqueIdentifier(usedIdentifiers,true);
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
            var folderName = uniqueIdentifier(usedIdentifiers, false);
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
                randomTree(node.children[j],currentDepth+1,maxDepth,maxFilesPerFolder,maxFolderPerFolder);
            }
        }
    }
}

function persist(path,node){
    if(node.isFile){
        //console.log(">"+node.name);

        fs.writeFile(path+node.name, "Dummy file", function(err) {
            if(err) throw err;
        });
    }else{
        //console.log("[]"+node.name);
        fs.mkdirs(path+node.name+'/', function (err) {
           if(err) throw err;

            for(var i=0;i<node.children.length;i++){
                persist(path+node.name+'/',node.children[i]);
            }
        });

    }
}

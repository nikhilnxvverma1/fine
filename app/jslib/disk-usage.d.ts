
declare interface DriveInfo{
    mountPoint:string,
    total:number,
    used:number,
    available:number,
    name:string,
    usedPercentage:number,
    freePercentage:number
}

declare function getDriveInfo():DriveInfo[];
/**
 * Created by NikhilVerma on 29/06/16.
 */


function getDriveInfo(){
    var njds = require('nodejs-disks');

    var driveInfoList=[];
    njds.drives(
        function (err, drives) {
            njds.drivesDetail(
                drives,
                function (err, data) {
                    for(var i = 0; i<data.length; i++)
                    {
                        /* Get drive mount point */
                        //console.log(data[i].mountpoint);

                        /* Get drive total space */
                        //console.log(data[i].total);

                        /* Get drive used space */
                        //console.log(data[i].used);

                        /* Get drive available space */
                        //console.log(data[i].available);

                        /* Get drive name */
                        //console.log(data[i].drive);

                        /* Get drive used percentage */
                        //console.log(data[i].usedPer);

                        /* Get drive free percentage */
                        //console.log(data[i].freePer);

                        var driveInfo={
                            "mountPoint":data[i].mountpoint,
                            "total":data[i].total,
                            "used":data[i].used,
                            "available":data[i].available,
                            "name":data[i].drive,
                            "usedPercentage":data[i].usedPer,
                            "freePercentage":data[i].freePer,
                        }
                        driveInfoList.push(driveInfo);
                    }
                }
            );
        }
    );
    return driveInfoList;
}

console.log("info list "+getDriveInfo());
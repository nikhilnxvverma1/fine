/**
 * Created by NikhilVerma on 10/06/16.
 */

import {DataItem} from "./data-item";
import {DataOperation} from './data-operation'
export interface ServiceProgress{
    operationStarted(operation:DataOperation);
    beganProcessingDataItem(dataItem:DataItem,operation:DataOperation);
    processedDataItem(count:number,total:number,operation:DataOperation);
    operationCompleted(total:number,operation:DataOperation);
    errorOnDataItem(err,dataItem:DataItem,operation:DataOperation);
    errorOnDataOperation(err,operation:DataOperation);
}
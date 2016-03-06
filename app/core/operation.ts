import {DataItem} from './data-item'

export interface Operation {
    perform(selection:DataItem[]);
}
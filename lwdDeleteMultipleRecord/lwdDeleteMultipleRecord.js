import { LightningElement,api,wire,track} from 'lwc';
import fetchProjectRecord from '@salesforce/apex/lwcAppExampleApex.fetchProjectRecord';
import deleteMultipleProjectRecord from '@salesforce/apex/lwcAppExampleApex.deleteMultipleProjectRecord';
import { refreshApex } from '@salesforce/apex';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';


export default class LwdDeleteMultipleRecord extends LightningElement {
    
    @api  columns =[
        { label: 'Name', fieldName: 'Name', type:'text'},
        { label: 'ProjectType', fieldName: 'ProjectType__c',type:'Picklist' },
        { label: 'Owner', fieldName: 'Owner__c', type:'Picklist'},    
        { label: 'End Date', fieldName: 'End_Date__c', type:'Date'},
        { label: 'Status', fieldName: 'Status__c', type:'Picklist'},
        { label: 'Priority', fieldName: 'Priority__c', type:'Picklist'},   
    ];
 
        
    @wire (fetchProjectRecord) wireProject__c;
 
    @api selectedProjectIdList=[];
    @track errorMsg;
 
 
    getSelectedIdAction(event){
        const selectedProjectRows = event.detail.selectedRows;
        window.console.log('selectedProjectRows# ' + JSON.stringify(selectedProjectRows));
        this.selectedProjectRows=[];
        
        for (let i = 0; i<selectedProjectRows.length; i++){
            this.selectedProjectIdList.push(selectedProjectRows[i].Id);
        }
 
       // window.console.log('selectedContactRows1 ' + this.selectedContactRows + selectedContactRows.length );
    }
  
   
    deleteProjectRowAction(){
        deleteMultipleProjectRecord({proObj:this.selectedProjectIdList})
        .then(()=>{
            this.template.querySelector('lightning-datatable').selectedProjectRows=[];
 
            const toastEvent = new ShowToastEvent({
                title:'Success!',
                message:'Record deleted successfully',
                variant:'success'
              });
              this.dispatchEvent(toastEvent);
 
            return refreshApex(this.wireProject__c);
        })
        .catch(error =>{
            this.errorMsg =error;
            window.console.log('unable to delete the record due to ' + JSON.stringify(this.errorMsg));
        });
    }
}
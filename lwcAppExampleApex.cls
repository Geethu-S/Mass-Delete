public with sharing class lwcAppExampleApex {
    public lwcAppExampleApex() {

    }
    @AuraEnabled(cacheable=true)
    public static List<Project__c> fetchProjectRecord(){
        List<Project__c> proList = [Select Id, Name,ProjectType__c,Owner__c, End_Date__c,Status__c,Priority__c From Project__c Order By createdDate desc Limit 10 ];
        return proList;
    }
    @AuraEnabled
    public static List<Project__c> deleteMultipleProjectRecord(List<String> proObj){
        List<Project__c> proObjItem = new   List<Project__c>();
      List<Project__c> proObjList = [Select Id, Name  From Project__c Where Id IN:proObj];
      for(Project__c pro:proObjList){
        proObjItem.add(pro);
      }
      if(proObjItem.size()>0){
          try{
            delete proObjItem;           
          }
          catch (Exception exp) {
            throw new AuraHandledException(exp.getMessage());
        }
      }
      return fetchProjectRecord();
    }
}

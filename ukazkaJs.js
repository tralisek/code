var Test4 = Test4 || {};

Test4.View = (function(){
    
    function Test4Main()
    {
        var config = {        
                 
        gridTank: {
            name: "gridTank",
            header: "Nádrže",
            autoLoad: true,
            multiSelect: false,
            postData: {entityMapping: {entity: 'eu.otenergy.chemis3.emptytanks.entity.Tanks'}},     
            sortData: [{field:'name'}],
            url: {
                get: 'get-grid-data.sf',
                save: 'save-grid-data.sf'
            },           
            recid: 'tankId',
            show: {header: true, toolbar:true, footer: true, navigation: true},           
            export: {                     
                showHeader  : true,                                         
                fileName    : moment().format('YYYY_MM_DD') + '_' + 'Kontrolní nádrže', 
                limit       : 1000                                             
            },
            columns: [
                { field: 'name', caption: 'Název', size: '20%', sortable: true},
                { field: 'block', caption: 'Blok', size: '20%', sortable: true},
                { field: 'rch', caption: 'RCH', size: '20%', sortable: true},
                { field: 'limit_av1', caption: 'Limit1 Av(gama)<br> [Bq/l]', size: '20%', sortable: true,
                render: function(record){
                        var html = formatNumber(record.limit_av1);
                        return html;
                }},
                { field: 'limit_av2', caption: 'Limit2 Av(gama)<br> [Bq/l]', size: '20%', sortable: true,
                render: function(record){
                        var html = formatNumber(record.limit_av2);
                        return html;
                }},
                { field: 'limit_tr1', caption: 'Limit1 Av(T)<br> [Bq/l]', size: '20%', sortable: true,
                render: function(record){
                        var html = formatNumber(record.limit_tr1);
                        return html;
                }},
                { field: 'limit_tr2', caption: 'Limit2 Av(T)<br> [Bq/l]', size: '20%', sortable: true,
                render: function(record){
                        var html = formatNumber(record.limit_tr2);
                        return html;
                }},    
                { field: 'tritium', caption: 'Tritium', size: '20%', render: 'checkbox', sortable: true},
                { field: 'bapp', caption: 'BAPP',  size: '20%', render: 'checkbox', sortable: true},
                { field: 'note', caption: 'Poznámka',  size: '20%'},
                { field: 'changeddt', caption: 'Zmìnìno', size: '20%', render: 'datetime'},
                { field: 'changedby', caption: 'Zmìnil', size: '20%', sortable: true}
            ],
            searches: [
               {field: 'name', caption: 'Název', type: 'text'},
               {field: 'block', caption: 'Blok', type: 'int'},
               {field: 'rch', caption: 'RCH', type: 'text'},
               {field: 'limit_av1', caption: 'Limit1 Av(gama) [Bq/l]', type: 'text'},
               {field: 'limit_av2', caption: 'Limit2 Av(gama) [Bq/l]', type: 'text'},
               {field: 'limit_tr1', caption: 'Limit1 Av(T) [Bq/l]', type: 'text'},
               {field: 'limit_tr2', caption: 'Limit2 Av(T) [Bq/l]', type: 'text'},
               {field: 'tritium', caption: 'Tritium', type: 'int'},
               {field: 'bapp', caption: 'BAPP', type: 'int'},
               {field: 'note', caption: 'Poznámka', type: 'text'},
               {field: 'changeddt', caption: 'Zmìnìno', type: 'date'},
               {field: 'changedby', caption: 'Zmìnil', type: 'text'}
            ],
            toolbar: {
            items: [
                {type: 'button', icon: 'icon-plus', id: 'add', caption: 'Pøidat',onClick: function(event) {

                    if(UserDetailsUtils.hasCurrentUserRight("EMPTYTANKS_ADMIN")) {
                     w2popup.open({
                        title: "Pøidání nádrže",width: 400,height: 500,style: 'padding: 5px 0px 0px 0px',
                        content: $().w2form(config.formTank)});
                    }else w2alert('Nemáte dostateèná oprávnìní!');                   
                }},
                {type: 'button', icon: 'icon-repeat', id: 'edit', caption: 'Opravit', onClick: function(event) {

                    if(UserDetailsUtils.hasCurrentUserRight("EMPTYTANKS_ADMIN")) {                                                             
                        var sel = w2ui.gridTank.getSelection();
                        if(sel.length === 0){
                             w2alert('Nevybrali jste žádný záznam!');
                        } else {
                            w2confirm('Opravdu chcete provést úpravu vybraného záznamu?').yes(function () {                                         
                                var form =  $().w2form(config.formTank);
                                form.load(w2ui.gridTank.get(sel[0]));
                                w2popup.open({
                                    title: "Editace záznamu o nádrži", width: 400, height: 500, style: 'padding: 5px 0px 0px 0px',
                                    content: form 
                                });
                            });
                        }   
                    } else w2alert('Nemáte dostateèná oprávnìní!');
                }},
                {type: 'button', icon: 'icon-trash', id: 'delete', caption: 'Smazat', onClick: function(event) {
                   
                   if(UserDetailsUtils.hasCurrentUserRight("EMPTYTANKS_ADMIN")) {                                                             
                        var sel = w2ui.gridTank.getSelection();
                        if(sel.length === 0){
                             w2alert('Nevybrali jste žádný záznam!');
                        } else {
                            w2confirm('Opravdu chcete smazat vybraný záznam?').yes(function () {                                         
                               Chemis.Utils.ajax({cmd: 'fce-call', functionCall:{function:'eu.otenergy.chemis3.emptytanks.dao.EmptyTanksDao.deleteTank', tankId:sel[0]}} )
                                .done(function(data,status,xhr){
                                    if(data.status === 'error') 
                                        w2alert(data.message);
                                    else {
                                        w2success('Záznam byl smazán.');                                             
                                        w2popup.close();
                                        w2ui.gridTank.reload();
                                    }   
                                });  
                            });
                        }   
                    } else w2alert('Nemáte dostateèná oprávnìní!');                  
                }}
            ]}           
        },
        formTank:        
        {
            name: 'formTank',
            url: {
                load: 'load-form-data.sf',
                save: 'save-form-data.sf'
            },
               
            postData: {entityMapping:{entity: 'eu.otenergy.chemis3.emptytanks.entity.Tanks'}},
            fields: [
                { name: 'name', type: 'text', html: {caption: "Název"}, required:true},
                { name: 'block', type: 'int', html: {caption: "Blok"}, options: {arrows: true, min: 0, max: 9}, required:true},
                { name: 'rch', type: 'text', html: {caption: "RCH"}},
                { name: 'tritium', type: 'checkbox', html: {caption: "Tritium",page: 0, column: 0}},
                { name: 'bapp', type: 'checkbox', html: {caption: "Bapp",page: 0, column: 1}},
                { name: 'limit_av1', type: 'text', options:{number:true},  html: {caption: "Limit1 Av(gama)", text: "[Bq/l]"}, required:true},
                { name: 'limit_av2', type: 'text', options:{number:true}, html: {caption: "Limit2 Av(gama)", text: "[Bq/l]"}, required:true},
                { name: 'limit_tr1', type: 'text', options:{number:true}, html: {caption: "Limit1 Av(T)", text: "[Bq/l]"}},
                { name: 'limit_tr2', type: 'text', options:{number:true}, html: {caption: "Limit2 Av(T)", text: "[Bq/l]"}},
                { name: 'note', type: 'textarea', html: {caption: "Poznámka", attr: 'cols="22" rows="3"'}},
            ],                                        
            focus: -1,
            load: function(rec){
                this.recid = rec.recid;
                this.record  = rec; 
                
                for(var i in this.fields) {
                    var f = this.fields[i];
                   
                    if(f.options && f.options.hasOwnProperty('number') && rec[f.field]) { 
                        this.record[f.field] = formatNumber(rec[f.field]);
                    }
                } 
                this.refresh();                        
            },                
            
            onValidate: function (event) { 
                for(var i in this.fields) {
                    var f = this.fields[i];
                    if(f.options && f.options.hasOwnProperty('number') && this.record[f.field]) { 
                        var strNum = this.record[f.field];
                        if( !Chemis.Utils.isNull(strNum) && Commons.isString(strNum) ) strNum = strNum.replace(',','.');
                        var number = Number(strNum);
                        this.record[f.field] = number;
                    }
                } 
                if (event.errors.length > 0) return;            
                else if (Chemis.Utils.isNull(this.record.name)) $(this.get('name').el).w2tag('Povinné pole');  
                else if (Chemis.Utils.isNull(this.record.limit_av1) 
                        || isNaN(this.record.limit_av1) || this.record.limit_av1<=0 ) $(this.get('limit_av1').el).w2tag('Zadejte platné èíslo > 0');  
                else if (Chemis.Utils.isNull(this.record.limit_av2) 
                        || isNaN(this.record.limit_av2) || this.record.limit_av2<=0 ) $(this.get('limit_av2').el).w2tag('Zadejte platné èíslo > 0');  
                else if (!Chemis.Utils.isNull(this.record.limit_tr1) 
                        && ( isNaN(this.record.limit_tr1) || this.record.limit_tr1<=0 ) ) $(this.get('limit_tr1').el).w2tag('Zadejte platné èíslo > 0');  
                else if (!Chemis.Utils.isNull(this.record.limit_tr2) 
                        && (  isNaN(this.record.limit_tr2) || this.record.limit_tr2<=0 ) ) $(this.get('limit_tr2').el).w2tag('Zadejte platné èíslo > 0');                                                 
                                                
                else if (!Chemis.Utils.isNull(this.record.limit_av2) && !Chemis.Utils.isNull(this.record.limit_av1) 
                        && this.record.limit_av2 <= this.record.limit_av1) $(this.get('limit_av2').el).w2tag('Limit2 Av(gama) musí být vìtší než Limit1 Av(gama)');       
                else if (!Chemis.Utils.isNull(this.record.limit_tr2) && !Chemis.Utils.isNull(this.record.limit_tr1) 
                        &&this.record.limit_tr2 <= this.record.limit_tr1) $(this.get('limit_tr2').el).w2tag('Limit2 Av(T) musí být vìtší než Limit1 Av(T)');       

                else return;
                event.preventDefault();            
            },  

            onSubmit: function(event){
                
                event.postData.record.localityId = UserDetailsUtils.getLocality();
                event.postData.record.changedbyId = UserDetailsUtils.getId();
                event.postData.record.changeddt = Date.now();                                                                               
                
                delete event.postData.record.changedby;
            },
                       
            actions: {
              Save: function(event) {
                                          
                    var form = this;
                    if(form.validate().length>0)
                        return;
 
                    if( this.recid === 0 ){//new
                          this.save({}, function (data) {
                          if (data.status === 'error') {
                              console.log('ERROR: ' + data.message);
                              return;
                          }
                          else {
                              w2ui.gridTank.reload();
                              w2popup.close();
                          }
                      });  
                    }else{ //update

                        if(form.record === null ) 
                            return;

                        Chemis.Utils.ajax({cmd: 'fce-call', functionCall:{function:'eu.otenergy.chemis3.emptytanks.dao.EmptyTanksDao.updateTank', record: form.record}} )
                            .done(function(data,status,xhr){
                                if(data.status === 'error') 
                                    w2alert(data.message);
                                else {
                                    w2success('Záznam byl opraven.');                                             
                                    w2popup.close();
                                    w2ui.gridTank.reload();
                                }   
                        });                                 

                    }
              },
             
              Cancel: function() {
                  w2popup.close();
              }
            }
        },
        
        gridLimit: {
            name: 'gridLimit',
            header: 'Limity',
            autoLoad:true,
            url: {
                get: 'get-grid-data.sf',
                save: 'save-grid-data.sf'
            },
            postData: {entityMapping: {entity: 'eu.otenergy.chemis3.emptytanks.entity.Limit'}},
            recid: 'limitId',
            sortData: [{field:'valid_from',direction:'desc'}],
            show: {header: true, toolbar:true, footer: true, navigation: true},           
            export: {                     
                showHeader  : true,                                         
                fileName    : moment().format('YYYY_MM_DD') + '_' + 'Limity', 
                limit       : 1000                                             
            },
            columns: [
                { field: 'valid_from', caption: 'Platný od', size: '100px', render: 'datetime', sortable: true},
                { field: 'period1', caption: 'Doba platnosti ', size: '100px', sortable: true},
                { field: 'limit_av1', caption: 'A(gama)1 [Bq]', size: '100px', sortable: true,
                render: function (record, index, col_index) {
                        var html = '';                        
                        var cellValue = formatNumber(this.getCellValue(index, col_index));
                        html = '<div style="background-color:yellow; color:black">'+cellValue+'</div>';
                        return html;
                    }
                },
                { field: 'limit_av2', caption: 'A(gama)2 [Bq]', size: '100px',
                render: function (record, index, col_index) {
                        var html = '';                        
                        var cellValue = formatNumber(this.getCellValue(index, col_index));
                        html = '<div style="background-color:red; color:black">'+cellValue+'</div>';
                        return html;
                }},
                { field: 'limit_tr1', caption: 'A(T)1 [Bq]', size: '100px',
                render: function (record, index, col_index) {
                        var html = '';                        
                        var cellValue = formatNumber(this.getCellValue(index, col_index));
                        html = '<div style="background-color:yellow; color:black">'+cellValue+'</div>';
                        return html;
                    }
                },
                { field: 'limit_tr2', caption: 'A(T)2 [Bq]', size: '100px',
                render: function (record, index, col_index) {
                        var html = '';                        
                        var cellValue = formatNumber(this.getCellValue(index, col_index));
                        html = '<div style="background-color:red; color:black">'+cellValue+'</div>';
                        return html;
                }},
                { field: 'changeddt', caption: 'Naposledy zmìnìno', size: '120px', render: 'datetime', sortable: true},
                { field: 'changedby', caption: 'Zmìnil', size: '100px'}                        
            ],
            searches: [
                {field: 'valid_from', caption: 'Platný od', type: 'datetime'},
                {field: 'period1', caption: 'Platnost', type: 'text'},
                {field: 'limit_av1', caption: '1. úroveò OA', type: 'float'},
                {field: 'limit_av2', caption: '2. úroveò OA', type: 'float'},
                {field: 'limit_tr1', caption: '1. úroveò tritia', type: 'float'},
                {field: 'limit_tr2', caption: '2. úroveò tritia', type: 'float'},
                {field: 'changeddt', caption: 'Naposledy zmìnìno', type: 'datetime'},
                {field: 'changedby', caption: 'Zmìnil', type: 'text'}
            ],
            toolbar: {
               items: [
                {type: 'button', icon: 'icon-plus', id: 'add', caption: 'Pøidat',
                    onClick: function(event) {
                        if(UserDetailsUtils.hasCurrentUserRight("EMPTYTANKS_ADMIN")) {
                         w2popup.open({
                            title: "Pøidání limity",width: 400, height: 350,style: 'padding: 5px 0px 0px 0px',
                            content: $().w2form(config.formLimit)});
                        } else w2alert('Nemáte dostateèná oprávnìní!');
                }},
                {type: 'button', icon: 'icon-repeat', id: 'edit', caption: 'Opravit',
                    onClick: function(event) {
                        if(UserDetailsUtils.hasCurrentUserRight("EMPTYTANKS_ADMIN")) {                                                             
                           var sel = w2ui.gridLimit.getSelection();
                           if(sel.length === 0){
                                w2alert('Nevybrali jste žádný záznam!');
                           } else {
                               w2confirm('Opravdu chcete provést úpravu nebo smazání vybraného záznamu?').yes(function () {                                         
                                   var form =  $().w2form(config.formLimit);
                                   form.load(w2ui.gridLimit.get(sel[0]));
                                   w2popup.open({
                                       title: "Editace záznamu o nádrži", width: 400, height: 350, style: 'padding: 5px 0px 0px 0px',
                                       content: form 
                                   });
                               })
                           }   
                        } else w2alert('Nemáte dostateèná oprávnìní!');
                }},
                {type: 'button', icon: 'icon-trash', id: 'delete', caption: 'Smazat', onClick: function(event) {
                   
                   if(UserDetailsUtils.hasCurrentUserRight("EMPTYTANKS_ADMIN")) {                                                             
                        var sel = w2ui.gridLimit.getSelection();
                        if(sel.length === 0){
                             w2alert('Nevybrali jste žádný záznam!');
                        } else {
                            w2confirm('Opravdu chcete smazat vybraný záznam?').yes(function () {                                         
                               Chemis.Utils.ajax({cmd: 'fce-call', functionCall:{function:'eu.otenergy.chemis3.emptytanks.dao.EmptyTanksDao.deleteLimit', limitId:sel[0]}} )
                                .done(function(data,status,xhr){
                                    if(data.status === 'error') 
                                        w2alert(data.message);
                                    else {
                                        w2success('Záznam byl smazán.');                                             
                                        w2popup.close();
                                        w2ui.gridLimit.reload();
                                    }   
                                });  
                            });
                        }   
                    } else w2alert('Nemáte dostateèná oprávnìní!');                  
                }}
            ]}
        },
        formLimit:{
            name: 'formLimit',
            url: {
                load: 'load-form-data.sf',
                save: 'save-form-data.sf'
            },
            postData: {entityMapping:{entity: 'eu.otenergy.chemis3.emptytanks.entity.Limit'}},
            fields: [
                { name: 'valid_from', type: 'datetime', html: {caption: "Datum platnosti", attr:'style="width:155px;"'}, required:true},
                { name: 'period1', type: 'list', html: {caption: "Doba platnosti", attr: 'size="18"'},options: { items: ['Y', 'M'] }, required:true},
                { name: 'limit_av1', type: 'text', options:{number:true}, html: {caption: "A(gama) 1",text: "[Bq]"}, required:true},
                { name: 'limit_av2', type: 'text', options:{number:true}, html: {caption: "A(gama) 2",text: "[Bq]"}, required:true},
                { name: 'limit_tr1', type: 'text', options:{number:true}, html: {caption: "A(T) 1",text: "[Bq]"}, required:true},
                { name: 'limit_tr2', type: 'text', options:{number:true}, html: {caption: "A(T) 2",text: "[Bq]"}, required:true}
            ],
            focus: -1,
            
            load: function(rec){
                this.recid = rec.recid;
                this.record  = rec;     
                
                for(var i in this.fields) {
                    var f = this.fields[i];
                    if(f.options && f.options.hasOwnProperty('number') && rec[f.field]) { 
                        this.record[f.field] = formatNumber(rec[f.field]);
                    }
                }                 
                this.refresh();                        
            },
            
            onValidate: function (event) {  
                for(var i in this.fields) {
                    var f = this.fields[i];
                    if(f.options && f.options.hasOwnProperty('number') && this.record[f.field]) { 
                        var strNum = this.record[f.field];
                        if( !Chemis.Utils.isNull(strNum) && Commons.isString(strNum) ) strNum = strNum.replace(',','.');
                        var number = Number(strNum);
                        this.record[f.field] = number;
                    }
                } 
                
                if (event.errors.length > 0) return;            
                else if (Chemis.Utils.isNull(this.record.valid_from) )$(this.get('valid_from').el).w2tag('Povinné pole');  
                else if (Chemis.Utils.isNull(this.record.period1) )$(this.get('period1').el).w2tag('Povinné pole');
                else if (Chemis.Utils.isNull(this.record.limit_av1) 
                        || isNaN(this.record.limit_av1) || this.record.limit_av1<=0 ) $(this.get('limit_av1').el).w2tag('Zadejte platné èíslo > 0');  
                else if (Chemis.Utils.isNull(this.record.limit_av2) 
                        || isNaN(this.record.limit_av2) || this.record.limit_av2<=0 ) $(this.get('limit_av2').el).w2tag('Zadejte platné èíslo > 0');  
                else if (Chemis.Utils.isNull(this.record.limit_tr1) 
                        || isNaN(this.record.limit_tr1) || this.record.limit_tr1<=0 ) $(this.get('limit_tr1').el).w2tag('Zadejte platné èíslo > 0');  
                else if (Chemis.Utils.isNull(this.record.limit_tr2) 
                        || isNaN(this.record.limit_tr2) || this.record.limit_tr2<=0 ) $(this.get('limit_tr2').el).w2tag('Zadejte platné èíslo > 0');                                                                                            
                else if (!Chemis.Utils.isNull(this.record.limit_av2) && !Chemis.Utils.isNull(this.record.limit_av1)
                        && this.record.limit_av2 <= this.record.limit_av1) $(this.get('limit_av2').el).w2tag('A(gama) 2 musí být vìtší než A(gama) 1');       
                else if (!Chemis.Utils.isNull(this.record.limit_tr2) && !Chemis.Utils.isNull(this.record.limit_tr1)
                        && this.record.limit_tr2 <= this.record.limit_tr1) $(this.get('limit_tr2').el).w2tag('A(T) 2 musí být vìtší než A(T) 1');       
                else return;
                event.preventDefault();            
            },  

            onSubmit: function(event){                
                event.postData.record.localityId = UserDetailsUtils.getLocality();
                event.postData.record.changedbyId = UserDetailsUtils.getId();
                event.postData.record.changeddt = Date.now();                                                                               

                delete event.postData.record.changedby;
            },                                      
            actions: {
                Save: function() {
                    this.save({}, function (data) {
                    if (data.status === 'error') {
                        console.log('ERROR: ' + data.message);
                        return;
                    }
                    else {
                        w2ui.gridLimit.reload();
                        w2popup.close();
                    }
                    });  

                },               
                Cancel: function() {
                    w2popup.close();
                }
            }
        }, 
        gridDrain: {
            name: 'gridDrain',
            header: 'Vypouštìní',
            autoLoad:true,
            url: {
                get: 'get-grid-data.sf',
                save: 'save-grid-data.sf'
            },
            postData: {entityMapping: {entity: 'eu.otenergy.chemis3.emptytanks.entity.Drain1'}},
            recid: 'drainId',
            multiSelect: false,
            export: {                     
                showHeader  : true,                                         
                fileName    : moment().format('YYYY_MM_DD') + '_' + 'Vypouštìní kontrolních nádrží', 
                limit       : 1000                                             
            },
            show: {header: true, toolbar:true, footer: true},
            columns: [
                { field: 'drainStartDt', caption: 'Zaèátek vyp.', size: '100px', render: 'datetime'},
                { field: 'drainPermit', caption: 'Povolení vyp.', size: '100px', render: 'datetime'},
                { field: 'tank', caption: 'Nádrž', size: '70px',
                render: function (record, index, col_index) {
                        var cellValue = record.tank;//this.getCellValue(index, col_index);
                        var html = '';   
                        if(record.tankVa === -1 || record.tankVa === 0 || record.tankT === -1 || record.tankT === 0){

                        html = '<div style="background-color:blue; color:white">'+cellValue+'</div>';
                        } else {
                            html = cellValue;
                        }
                        return html;
                    }},
                { field: 'block', caption: 'Blok', size: '30px'},
                { field: 'rch', caption: 'RCH', size: '40px'},
                //{ field: 'technode', caption: 'Celek', size: '40px'},
                { field: 'volActivity', caption: 'Av(gama)<br>[Bq/l]', size: '70px'},
                { field: 'tritium', caption: 'Av(T)<br>[Bq/l]', size: '60px',
                render: function(record){
                        var html = formatNumber(record.tritium);
                        return html;
                }},
                { field: 'volume', caption: 'Objem <br>[m<sup>3</sup>]', size: '60px'},
                { field: 'dilution', caption: 'Øedìní<br>[m<sup>3</sup>/h]', size: '60px'},
                { field: 'drainStopDt', caption: 'Konec vypouštìní', size: '100px', render: 'datetime'},
                { field: 'sumMonthVA', caption: 'Souèet A(gama)/mìs<br>[Bq]', size: '100px',
                render: function (record, index, col_index) {
                       var number = formatNumber(record.sumMonthVA);
                        var html = number;   
                        if (record.monthAv2 === -1 || record.monthAv2 === 0 ){
                        html = '<div style="background-color:red; color:black">'+number+'</div>';
                        } else if(record.monthAv1 === -1 || record.monthAv1 === 0 ){
                        html = '<div style="background-color:yellow; color:black">'+number+'</div>';
                        }
                        return html;
                 }},
                { field: 'sumMonthT', caption: 'Souèet A(T)/mìs<br>[Bq]', size: '90px',
                render: function (record, index, col_index) {
                       var number = formatNumber(record.sumMonthT);
                        var html = number;   
                        if(record.monthTr2 === -1 || record.monthTr2 === 0 ){
                        html = '<div style="background-color:red; color:black">'+number+'</div>';
                        } else if(record.monthTr1 === -1 || record.monthTr1 === 0 ){
                        html = '<div style="background-color:yellow; color:black">'+number+'</div>';
                        }
                        return html;
                 }},
                { field: 'sumYearVA', caption: 'Souèet A(gama)/rok<br>[Bq]', size: '100px',
                render: function (record, index, col_index) {
                       var number = formatNumber(record.sumYearVA);
                        var html = number;   
                        if(record.yearAv2 === -1 || record.yearAv2 === 0 ){
                        html = '<div style="background-color:red; color:black">'+number+'</div>';
                        } else if(record.yearAv1 === -1 || record.yearAv1 === 0 ){
                        html = '<div style="background-color:yellow; color:black">'+number+'</div>';
                        }
                        return html;
                 }},
                { field: 'sumYearT', caption: 'Souèet A(T)/rok<br>[Bq]', size: '90px',
                   render: function (record, index, col_index) {
                        var number = formatNumber(record.sumYearT);
                        var html = number;   
                        if(record.yearTr2 === -1 || record.yearTr2 === 0 ){
                        html = '<div style="background-color:red; color:black">'+number+'</div>';
                        } else if(record.yearTr1 === -1 || record.yearTr1 === 0 ){
                        html = '<div style="background-color:yellow; color:black">'+number+'</div>';
                        } 
                        return html;
                 }},
                { field: 'correctionVa', caption: 'Korekce A(gama)<br>[Bq]', size: '100px',
                    render: function(record){
                        var html = formatNumber(record.correctionVa);
                        return html;
                }},
                { field: 'correctionT', caption: 'Korekce A(T)<br>[Bq]', size: '80px',
                    render: function(record){
                        var html = formatNumber(record.correctionT);
                        return html;
                }},
                { field: 'startRefDt', caption: 'Zapsán zaèátek', size: '100px', render: 'datetime'},
                { field: 'start_refdtby', caption: 'Zapsal zaèátek', size: '100px'},
                { field: 'stopRefDt', caption: 'Zapsán konec', size: '100px', render: 'datetime'},
                { field: 'stop_refdtby', caption: 'Zapsal konec', size: '100px'},
                { field: 'changedDt', caption: 'Zmìnìno', size: '100px', render: 'datetime'},
                { field: 'changedby', caption: 'Zmìnil', size: '100px'}

            ],
            searches: [
                {field: 'drainStartDt', caption: 'Zaèátek', type: 'date'},
                {field: 'drainPermit', caption: 'Povolení vypouštìní', type: 'date'},
                {field: 'tank', caption: 'Nádrž', type: 'text'},
                {field: 'rch', caption: 'RCH', type: 'text'},
                {field: 'drainStopDt', caption: 'Konec vypouštìní', type: 'date'},
                {field: 'startRefDt', caption: 'Zapsán zaèátek', type: 'date'},
                {field: 'start_refdtby', caption: 'Zapsal zaèátek', type: 'text'},
                {field: 'stopRefDt', caption: 'Zapsán konec', type: 'date'},
                {field: 'stop_refdtby', caption: 'Zapsal konec', type: 'text'},
                {field: 'changedDt', caption: 'Zmìnìno', type: 'date'},
                {field: 'changedby', caption: 'Zmìnil', type: 'text'}
            ],
            toolbar: {
                items: [
                    { type: 'button', icon:'icon-plus', id: 'add', caption: 'Pøidat',
                        onClick: function() {
                           if(UserDetailsUtils.hasCurrentUserRight("EMPTYTANKS_ADMIN") || UserDetailsUtils.hasCurrentUserRight("EMPTYTANKS_EDIT")) {
                                w2ui.gridDrain.addemptying();
                                } else {
                                 w2alert('Nemáte dostateèná oprávnìní!');
                                } 
                    }},
                    { type: 'button', icon:'icon-remove', id: 'close', caption: 'Konec',
                        onClick: function() {
                            if(UserDetailsUtils.hasCurrentUserRight("EMPTYTANKS_ADMIN") || UserDetailsUtils.hasCurrentUserRight("EMPTYTANKS_EDIT")) {
                            var rec;
                            var grid = w2ui.gridDrain;
                            var sel = grid.getSelection();
                            if(sel.length === 1) {
                                rec = grid.get(sel[0]);                                        
                            }
                            if(sel.length === 0){
                                     w2alert('Nevybrali jste žádný záznam!');
                                 } else {
                            w2confirm('Opravdu si pøejete ukonèit vypouštìní?').yes(function () {
                            grid.addEnd(rec);
                            });};
                            } else {
                                   w2alert('Nemáte dostateèná oprávnìní!');
                                   }
                    }},
                    { type: 'button', icon:'icon-repeat', id: 'change_record', caption: 'Opravit',
                        onClick: function() {
                            if(UserDetailsUtils.hasCurrentUserRight("EMPTYTANKS_ADMIN") || UserDetailsUtils.hasCurrentUserRight("EMPTYTANKS_EDIT")) {
                            var rec;
                            var grid = w2ui.gridDrain;
                            var sel = grid.getSelection();
                            if(sel.length === 1) {
                                rec = grid.get(sel[0]);                                        
                            }
                            if(sel.length === 0){
                                     w2alert('Nevybrali jste žádný záznam!');
                            } else {
                            w2confirm('Opravdu si pøejete opravit vybraný záznam?').yes(function () {
                            grid.repair(rec);
                            });};
                            } else {
                                   w2alert('Nemáte dostateèná oprávnìní!');
                                   }
                    }},
                    {type: 'button', icon: 'icon-trash', id: 'delete', caption: 'Smazat', onClick: function(event) {                   
                        if(UserDetailsUtils.hasCurrentUserRight("EMPTYTANKS_ADMIN") || UserDetailsUtils.hasCurrentUserRight("EMPTYTANKS_EDIT")) {                                                             
                             var sel = w2ui.gridDrain.getSelection();
                             if(sel.length === 0){
                                  w2alert('Nevybrali jste žádný záznam!');
                             } else {
                                 w2confirm('Opravdu chcete smazat vybraný záznam?').yes(function () {                                         
                                    Chemis.Utils.ajax({cmd: 'fce-call', functionCall:{function:'eu.otenergy.chemis3.emptytanks.dao.EmptyTanksDao.deleteDrain', drainId:sel[0]}} )
                                     .done(function(data,status,xhr){
                                         if(data.status === 'error') 
                                             w2alert(data.message);
                                         else {
                                             w2success('Záznam byl smazán.');                                             
                                             w2popup.close();
                                             w2ui.gridDrain.reload();
                                         }   
                                     });  
                                 });
                             }   
                         } else w2alert('Nemáte dostateèná oprávnìní!');                  
                    }},
                    { type: 'button', icon:'icon-plus', id: 'korekce', caption: 'Korekce',
                        onClick: function() {
                            if(UserDetailsUtils.hasCurrentUserRight("EMPTYTANKS_ADMIN") || UserDetailsUtils.hasCurrentUserRight("EMPTYTANKS_EDIT")) {
                            var rec;
                            var grid = w2ui.gridDrain;
                            var sel = grid.getSelection();
                            if(sel.length === 1) {
                                rec = grid.get(sel[0]);                                        
                            }
                            if(sel.length === 0){
                                     w2alert('Nevybrali jste žádný záznam!');
                            } else {
                            if(rec.korFlag === 1){    
                            w2confirm('Opravdu si pøejete pøidat korekci?').yes(function () {
                            grid.correction(rec);
                            });} else {
                                w2alert('K tomuto záznamu nelze pøidávat korekci!')
                            };
                            }} else {
                                   w2alert('Nemáte dostateèná oprávnìní!');
                                   }
                    }},
                    { type: 'button', icon:'icon-remove', id: 'removeC', caption: 'Smazat korekci',
                        onClick: function() {
                            if(UserDetailsUtils.hasCurrentUserRight("EMPTYTANKS_ADMIN") || UserDetailsUtils.hasCurrentUserRight("EMPTYTANKS_EDIT")) {
                            var rec;
                            var grid = w2ui.gridDrain;
                            var sel = grid.getSelection();
                            if(sel.length === 1) {
                                rec = grid.get(sel[0]);                                        
                            }
                            if(sel.length === 0){
                                     w2alert('Nevybrali jste žádný záznam!');
                                 } else {
                            w2confirm('Opravdu si pøejete smazat korekci?').yes(function () {
                                //grid.deleteCorrection(rec.recid);
                                grid.deleteCor(rec);

                            });};
                            } else {
                                   w2alert('Nemáte dostateèná oprávnìní!');
                                   }
                    }},
                    { type: 'button', id: 'week', caption: 'Týden',
                        onClick: function() {
                            w2popup.open({
                            title: "Týdenní pøehled",
                            width: 400,
                            height: 370,
                            style: 'padding: 5px 0px 0px 0px',
                            content: $().w2form({
                            name: 'formWeek',
                            url: 'get-form-data.sf',
                            focus: 2,
                            postData: {entityMapping:{entity: 'eu.otenergy.chemis3.emptytanks.entity.Drain'}},
                            fields: [
                                { name: 'date_from', type: 'datetime',html:{ caption: "Datum od:", attr:'style="width:155px;"'}},
                                { name: 'date_to', type: 'datetime', html:{caption: "do:", attr:'style="width:155px;"'}},
                                { name: 'hvb1g', type: 'text', html: {caption: "HVB1: Av(gama)", text: "[MBq]", attr: 'readonly'}},
                                { name: 'hvb1t', type: 'text', html: {caption: "Av(T)", text: "[GBq]", attr: 'readonly'}},
                                { name: 'hvb2g', type: 'text', html: {caption: "HVB2: Av(gama)", text: "[MBq]", attr: 'readonly'}},
                                { name: 'hvb2t', type: 'text', html: {caption: "Av(T)", text: "[GBq]", attr: 'readonly'}}
                            ],
                            actions: {
                              Aktualizovat: function() {
                                    var grid = w2ui.gridDrain;
                                    var form = this;
                                    var sumGama1 = 0;
                                    var sumGama2 = 0;
                                    var sumT1 = 0;
                                    var sumT2 = 0;
                                    var from = 0;
                                    var to = 0;
                                    if(  !Chemis.Utils.isNull( form.record.date_from  ) && (typeof form.record.date_from  === 'string' || form.record.date_from  instanceof String)  )
                                    {
                                        var dt = Chemis.Utils.dateTimeParse(form.record.date_from );                
                                        from = dt.getTime();                 
                                    }
                                    if(  !Chemis.Utils.isNull( form.record.date_to  ) && (typeof form.record.date_to  === 'string' || form.record.date_to  instanceof String)  )
                                    {
                                        var dt = Chemis.Utils.dateTimeParse(form.record.date_to);                
                                        to = dt.getTime();                 
                                    }
                                    grid.records.forEach(function(r)
                                    {
                                        if( r.drainStartDt >= from && r.drainStartDt <= to && r.block === '0' ){
                                            if(!Chemis.Utils.isNull(r.volActivity)) sumGama1 += r.volActivity*r.volume;
                                            if(!Chemis.Utils.isNull(r.tritium)) sumT1 += r.tritium*r.volume;
                                            console.log(r);
                                        }
                                        if( r.drainStartDt >= from && r.drainStartDt <= to && r.block === '7' ){
                                             if(!Chemis.Utils.isNull(r.volActivity)) sumGama2 += r.volActivity*r.volume;
                                             if(!Chemis.Utils.isNull(r.tritium)) sumT2 += r.tritium*r.volume;
                                        }

                                    });

                                    this.record.hvb1g = sumGama1/1000000;
                                    this.record.hvb2g = sumGama2/1000000;
                                    this.record.hvb1t = sumT1/1000000000;
                                    this.record.hvb2t = sumT2/1000000000;
                                    form.refresh();
                            },
                              Zavøít: function() {
                                  w2popup.close();
                            }}})});
                        }}
                ]
            },
            deleteCorrection: function(drainId){
             $.post('delete-correction.sf', {drainId : drainId}, function (response){
                     if (response) {
                         w2ui.gridDrain.reload();
                     }else {
                         w2alert("Nepodaøilo se smazat korekci");
                     }});  
            },
            deleteCorrectionVa: function(drainId){
             $.post('delete-correction-va.sf', {drainId : drainId}, function (response){
                     if (response) {
                         w2ui.gridDrain.reload();
                     }else {
                         w2alert("Nepodaøilo se smazat korekci");
                     }});  
            },
            deleteCorrectionT: function(drainId){
             $.post('delete-correction-t.sf', {drainId : drainId}, function (response){
                     if (response) {
                         w2ui.gridDrain.reload();
                     }else {
                         w2alert("Nepodaøilo se smazat korekci");
                     }});  
            },
            addemptying: function() {
                var limitAv1;
                var limitAv2;
                var limitTr1;
                var limitTr2;
                w2popup.open({

                    title: "Pøidání záznamu o vypouštìní",
                    width: 400,
                    height: 400,
                    style: 'padding: 5px 0px 0px 0px',
                    content: $().w2form({

                        name: 'formAddDrain',
                        url: {
                            get: 'get-form-data.sf',
                            save: 'save-form-data.sf'
                        },
                        postData: {entityMapping:{entity: 'eu.otenergy.chemis3.emptytanks.entity.Drain'}},
                        fields: [
                            { name: 'tankId', type: 'list', html: {caption: "Nádrž"}, required:true, options:{minLength:0, url: "get-field-data.sf", postData: {cmd:"get-items", entityMapping: {entity:'eu.otenergy.chemis3.emptytanks.entity.Tanks',
                               mapping:{id:'tankId',text:'name',limitav1:'limit_av1',limitav2:'limit_av2',limitt1:'limit_tr1',limitt2:'limit_tr2'}}}}},
                            { name: 'drain_start_dt', type: 'datetime', html: {caption: "Zaèátek", attr:'style="width:155px;"'}, required:true},
                            { name: 'drain_permit', type: 'datetime', html: {caption: "Povolení", attr:'style="width:155px;"'}},
                            { name: 'vol_activity', type: 'text', options:{number:true}, html: {caption: "Av(gama) [Bq/l]"}, required:true},
                            { name: 'tritium', type: 'text', options:{number:true}, html: {caption: "Av(T) [Bq/l]"}},
                            { name: 'volume', type: 'text', options:{number:true}, html: {caption: "Objem [m<sup>3</sup>]"}, required:true},
                            { name: 'dilution', type: 'text', options:{number:true}, html: {caption: "Øedìní [m<sup>3</sup>]"}}
                        ],
                                               
                        onChange: function (event){
                           event.onComplete = function() {
                               if(event.target === "tankId"){
                                    limitAv1 = event.value_new.limitav1;
                                    limitAv2 = event.value_new.limitav2;
                                    limitTr1 = event.value_new.limitt1;
                                    limitTr2 = event.value_new.limitt2;
                                    this.record.vol_activity = "";
                                    this.record.tritium = "";
                                    this.refresh();
                               }
                               if(event.target === "vol_activity" && typeof(this.record.tankId)==="undefined" || event.target === "tritium" && typeof(this.record.tankId)==="undefined"){
                                   w2alert("Nejdøíve vyberte nádrž!");
                                   this.record.vol_activity = "";
                                   this.record.tritium = "";
                                   this.refresh();
                               }
                           };
                        },
                        
                        onSubmit: function(event) {  
                            event.postData.record.start_refdt = Date.now();
                            event.postData.record.start_refdtby_id = UserDetailsUtils.getId();
                            event.postData.record.localityId = UserDetailsUtils.getLocality();
                            event.postData.record.changedby_id = UserDetailsUtils.getId();
                            event.postData.record.changeddt = Date.now();              
                        },  
                        
                        confirmSave: function(){
                            var form = this;
                            w2confirm('Pøekroèení limitu nádrže, první úroveò.<br>Povolení vypouštìní jen za podmínek uvedených v B116. Pøejete si pokraèovat?')
                                .yes(function () {                                         
                                 
                                form.addDrain();
                                return true;
                            });
                        },
                        
                        addDrain: function(){
                            this.save({}, function (data) {
                                if (data.status === 'error') {
                                    console.log('ERROR: ' + data.message);
                                    return;
                                }
                                else {
                                    w2ui.gridDrain.reload();
                                    w2popup.close();
                                }
                            });  
                        },
                        
                        validateForm: function (event) { 
                            var form = this;
                            
                            for(var i in this.fields) {
                                var f = this.fields[i];   
                                
                                if(f.options && f.options.hasOwnProperty('number') && this.record[f.field]) { 
                                    var strNum = this.record[f.field];
                                    if( !Chemis.Utils.isNull(strNum) && Commons.isString(strNum) ) strNum = strNum.replace(',','.');
                                    var number = Number(strNum);
                                    this.record[f.field] = number;
                                }  
                                
                                if(f.type === 'datetime' && this.record[f.field]) { 
                                    var item = this.record[f.field];
                                    if(  !Chemis.Utils.isNull( item ) && (typeof item === 'string' || item instanceof String)  )
                                    {
                                        var dt = Chemis.Utils.dateTimeParse(item);    
                                        item = dt.getTime();   
                                        this.record[f.field] = item;
                                    }
                                }
                                if( Chemis.Utils.isNull(this.record[f.field] ) )
                                    this.record[f.field] = null;
                            }
                            
                            if(Chemis.Utils.isNull(this.record.tankId) )$(this.get('tankId').el).w2tag('Povinné pole');            
                            else if (Chemis.Utils.isNull(this.record.drain_start_dt) )$(this.get('drain_start_dt').el).w2tag('Povinné pole');                                
                            else if (Chemis.Utils.isNull(this.record.vol_activity) 
                                || isNaN(this.record.vol_activity) || this.record.vol_activity<=0 ) $(this.get('vol_activity').el).w2tag('Zadejte platné èíslo > 0');
                            else if (Chemis.Utils.isNull(this.record.volume) 
                                || isNaN(this.record.volume) || this.record.volume<=0 ) $(this.get('volume').el).w2tag('Zadejte platné èíslo > 0');
                            else if ( !Chemis.Utils.isNull(this.record.dilution) && this.record.dilution<=0 )$(this.get('dilution').el).w2tag('Zadejte platné èíslo > 0');    
                            else if ( !Chemis.Utils.isNull(this.record.tritium) && (isNaN(this.record.tritium) || this.record.tritium<=0)  )$(this.get('tritium').el).w2tag('Zadejte platné èíslo > 0');     
                            else if (this.record.vol_activity >= limitAv2)
                                $(this.get('vol_activity').el).w2tag('Pøekroèení limitu nádrže, druhá úroveò.<br>Zákaz vypouštìní!<br>Nutno snížit koncentraci Av(gama) v KN (viz B116)'); 
                            else if (this.record.tritium > limitTr2)
                                $(this.get('tritium').el).w2tag('Pøekroèení limitu nádrže, druhá úroveò.<br>Zákaz vypouštìní!<br>Nutno snížit koncentraci Av(T) v KN (viz B116)');                                                                              
                            else if (this.record.vol_activity >= limitAv1 || this.record.tritium > limitTr1)                                     
                                form.confirmSave();
                            else form.addDrain();
                        },  
                        
                        actions: {
                            Save: function(event) {
                                this.validateForm();                                    
                            },
                            Cancel: function() {
                                w2popup.close();
                            }
                        }
                    })
                });
            },
            correction: function(rec) {
                w2popup.open({
                    title: "Pøidání korekce",
                    width: 400,
                    height: 200,
                    style: 'padding: 5px 0px 0px 0px',
                    content: $().w2form({
                    name: 'formCorrection',
                    url: {save: 'save-form-data.sf'},
                    postData: {entityMapping:{entity: 'eu.otenergy.chemis3.emptytanks.entity.Drain'}},
                    fields: [
                        { name: 'correction_va', type: 'text', html: {caption: "A(gama)/rok", text: "[Bq]"}},
                        { name: 'correction_t', type: 'text', html: {caption: "A(T)/rok", text: "[Bq]"}}
                    ],
                    onSave: function (event) {
                        event.onComplete = function () {
                            w2ui.gridDrain.reload();
                        }.bind(w2ui.gridDrain);
                    },
                    onRender : function (event) {
                        console.log(rec);
                        this.record.correction_va = rec.correctionVa;
                        this.record.correction_t = rec.correctionT;


                    },     
                    actions: {
                      Vložit: function() {
                          var strNum = this.record.correction_va;
                          var strNum1 = this.record.correction_t;

                          if( !Chemis.Utils.isNull(strNum) && Commons.isString(strNum) ) strNum = strNum.replace(',','.');
                          var number = Number(strNum);
                          this.record.correction_va = number;
                          if(isNaN(strNum) || this.record.correction_va === 0){
                              //w2ui.gridDrain.deleteCorrectionVa(rec.recid);
                              this.record.correction_va= "";
                          }

                          if( !Chemis.Utils.isNull(strNum1) && Commons.isString(strNum1) ) strNum1 = strNum1.replace(',','.');
                          var number1 = Number(strNum1);
                          this.record.correction_t = number1;
                          if(isNaN(strNum1) || this.record.correction_t === 0){
                              //w2ui.gridDrain.deleteCorrectionT(rec.recid);
                              this.record.correction_t = "";
                          }
                          //this.record.correction_va = o;
                          this.recid = rec.drainId;
                          this.record.changedby_id = UserDetailsUtils.getId();
                          this.record.changeddt = Date.now();
                          this.save();

                          w2popup.close();
                      },
                      Zavøít: function() {
                          w2popup.close();
                      }
                }})});
            },
            repair: function(rec) {
               w2popup.open({ 
                    title: "Oprava záznamu o vypouštìní",
                    width: 400,
                    height: 380,
                    style: 'padding: 5px 0px 0px 0px',
                    content: $().w2form({
                        name: 'formRepair', 
                        url: {
                        save: 'save-form-data.sf'
                        },
                        focus: -1,
                        postData: {entityMapping:{entity: 'eu.otenergy.chemis3.emptytanks.entity.Drain'}},
                        fields: [
                            { name: 'drain_start_dt', type: 'datetime', html: {caption: "Zaèátek", attr:'style="width:155px;"'}, required:true},
                            { name: 'drain_permit', type: 'datetime', html: {caption: "Povolení vypouštìní", attr:'style="width:155px;"'}},
                            { name: 'start_refdtby', type: 'text', html: {caption: "Zapsal", attr:'readonly style="width:155px;"'}},
                            { name: 'vol_activity', type: 'text', options:{number:true}, html: {caption: "Av(gama) [Bq/l]"}, required:true},
                            { name: 'tritium', type: 'text', options:{number:true}, html: {caption: "Av(T) [Bq/l]"}},
                            { name: 'volume', type: 'text', options:{number:true}, html: {caption: "Objem [m<sup>3</sup>]"}, required:true},
                            { name: 'dilution', type: 'text', options:{number:true}, html: {caption: "Øedìní [m<sup>3</sup>]"}}
                        ],
                        onChange: function (event) {
                            event.onComplete = function() {

                                if (event.target === "drain_start_dt") {                                            
                                    var datetime = event.value_new;
                                    var datetime1 = event.value_previous;

                                    if( !Chemis.Utils.isNull( datetime ) && (typeof datetime === 'string' || datetime instanceof String) ){
                                        var dt = Chemis.Utils.dateTimeParse(datetime); 
                                        datetime = dt.getTime(); 
                                    }
                                    if( !Chemis.Utils.isNull( datetime1 ) && (typeof datetime1 === 'string' || datetime1 instanceof String) ){
                                        var dt = Chemis.Utils.dateTimeParse(datetime1); 
                                        datetime1 = dt.getTime(); 
                                    }
                                    if (datetime !== datetime1){
                                        this.record.start_refdtby = UserDetailsUtils.getName();
                                        this.record.start_refdtby_id = UserDetailsUtils.getId();
                                    }
                                    this.refresh();
                                }                                       
                            };
                        },

                        onRender : function (event) {

                            this.recid = rec.drainId;
                            this.record.drainId = rec.drainId;
                            this.record.drain_start_dt = rec.drainStartDt;
                            this.record.drain_permit = rec.drainPermit;
                            this.record.start_refdtby = rec.start_refdtby;
                            this.record.vol_activity = rec.volActivity;
                            this.record.start_refdtby_id = rec.startRefdtById;
                            this.record.tritium = rec.tritium;
                            this.record.volume = rec.volume;
                            this.record.dilution = rec.dilution;                                    
                                                        
                            for(var i in this.fields) {
                                var f = this.fields[i];

                                if(f.options && f.options.hasOwnProperty('number') &&  this.record[f.field]) { 
                                    this.record[f.field] = formatNumber( this.record[f.field]);
                                }
                            } 
                            this.refresh();       
                        },
                                                                      
                        updateDrain: function(record){
                            
                            var form = this;
                            if(form.record === null ) 
                                return;
                            
                            Chemis.Utils.ajax({cmd: 'fce-call', functionCall:{function:'eu.otenergy.chemis3.emptytanks.dao.EmptyTanksDao.updateDrain', record: form.record}} )
                                .done(function(data,status,xhr){
                                    if(data.status === 'error') 
                                        w2alert(data.message);
                                    else {
                                        w2success('Záznam byl opraven.');                                             
                                        w2popup.close();
                                        w2ui.gridDrain.reload();
                                    }   
                            });                                 
                        },
                        confirmSave: function(){
                            var form = this;
                            w2confirm('Pøekroèení limitu nádrže, první úroveò.<br>Povolení vypouštìní jen za podmínek uvedených v B116. Pøejete si pokraèovat?')
                                .yes(function () {                                         
                                 return form.updateDrain();
                            });
                        },
                        actions: {
                            Save: function() { 
                                var form = this;                        
                                for(var i in this.fields) {
                                    var f = this.fields[i];   

                                    if(f.options && f.options.hasOwnProperty('number') && this.record[f.field]) { 
                                        var strNum = this.record[f.field];
                                        if( !Chemis.Utils.isNull(strNum) && Commons.isString(strNum) ) strNum = strNum.replace(',','.');
                                        var number = Number(strNum);
                                        this.record[f.field] = number;
                                    }  

                                    if(f.type === 'datetime' && this.record[f.field]) { 
                                        var item = this.record[f.field];
                                        if(  !Chemis.Utils.isNull( item ) && (typeof item === 'string' || item instanceof String)  )
                                        {
                                            var dt = Chemis.Utils.dateTimeParse(item);    
                                            item = dt.getTime();   
                                            this.record[f.field] = item;
                                        }
                                    }
                                    if( Chemis.Utils.isNull(this.record[f.field] ) )
                                        this.record[f.field] = null;
                                }         
                                
                                if (Chemis.Utils.isNull(this.record.drain_start_dt) )$(this.get('drain_start_dt').el).w2tag('Povinné pole');                                
                                else if (Chemis.Utils.isNull(this.record.vol_activity) 
                                    || isNaN(this.record.vol_activity) || this.record.vol_activity<=0 ) $(this.get('vol_activity').el).w2tag('Zadejte platné èíslo > 0');
                                else if (Chemis.Utils.isNull(this.record.volume) 
                                    || isNaN(this.record.volume) || this.record.volume<=0 ) $(this.get('volume').el).w2tag('Zadejte platné èíslo > 0');
                                else if ( !Chemis.Utils.isNull(this.record.dilution) && this.record.dilution<=0 )$(this.get('dilution').el).w2tag('Zadejte platné èíslo > 0');    
                                else if ( !Chemis.Utils.isNull(this.record.tritium) && (isNaN(this.record.tritium) || this.record.tritium<=0)  )$(this.get('tritium').el).w2tag('Zadejte platné èíslo > 0');     
                                else if (this.record.vol_activity >= rec.tankAv2 )
                                    $(this.get('vol_activity').el).w2tag('Pøekroèení limitu nádrže, druhá úroveò.<br>Zákaz vypouštìní!<br>Nutno snížit koncentraci Av(gama) v KN (viz B116)'); 
                                else if (this.record.tritium > Number(rec.tankTr2) )
                                    $(this.get('tritium').el).w2tag('Pøekroèení limitu nádrže, druhá úroveò.<br>Zákaz vypouštìní!<br>Nutno snížit koncentraci Av(T) v KN (viz B116)'); 
                                else if (this.record.vol_activity >= rec.tankAv1 || this.record.tritium > rec.tankTr1 )
                                     form.confirmSave();                                            
                                else form.updateDrain(); 
                            },
                 
                            Cancel: function() {
                                w2popup.close();
                            }
                        }
                    })
                });

            },
            deleteCor: function(rec) {
              w2popup.open({
                    title: "Smazání korekce",
                    width: 400,
                    height: 180,
                    style: 'padding: 5px 0px 0px 0px',
                    content: $().w2form({
                        name: 'formDeleteCorrection',
                        fields: [
                                    { name: 'correction_va', type: 'checkbox', html: {caption: "Korekce A(gama)"}},
                                    { name: 'correction_t', type: 'checkbox', html: {caption: "Korekce A(T)"}}
                        ],
                        onRender: function (event) {
                          this.record.correction_va = false;
                          this.record.correction_t = false;
                        },
                        onAction: function (event) {
                            event.onComplete = function () {
                                w2ui.gridDrain.reload();
                            }.bind(w2ui.gridDrain);
                        },
                        actions: {
                          Smazat: function() {


                              if(this.record.correction_va === true && this.record.correction_t === true) {
                                w2ui.gridDrain.deleteCorrection(rec.recid);
                              } else if(this.record.correction_va === false && this.record.correction_t === true) {
                                w2ui.gridDrain.deleteCorrectionT(rec.recid);  
                              } else if(this.record.correction_va === true && this.record.correction_t === false) {
                                w2ui.gridDrain.deleteCorrectionVa(rec.recid);  
                              }
                              w2popup.close();

                          },
                          Zavøít: function() {
                              w2popup.close();
                          }
                          }})});  
            },
            addEnd: function(rec) {
            w2popup.open({
                title: "Ukonèení vypouštìní",
                width: 400,
                height: 300,
                style: 'padding: 5px 0px 0px 0px',
                content: $().w2form({
                    name: 'formAddEnd',
                    url: {
                        save: 'save-form-data.sf'
                    },
                    postData: {entityMapping:{entity: 'eu.otenergy.chemis3.emptytanks.entity.Drain'}},
                    fields: [
                                { name: 'drain_start_dt', type: 'datetime', html: {caption: "Zaèátek", attr:'readonly style="width:155px;"'}},
                                { name: 'start_refdtby', type: 'text', html: {caption: "Zapsal", attr:'readonly style="width:155px;"'}},
                                { name: 'drain_stop_dt', type: 'datetime', html: {caption: "Konec vypouštìní", attr:'style="width:155px;"'}},
                                { name: 'stop_refdt', type: 'datetime', html: {caption: "Konec zapsán", attr:'readonly style="width:155px;"'}},
                                { name: 'stop_refdtby', type: 'text', html: {caption: "Konec zapsal", attr:'readonly'}}
                    ],
                    onSave: function (event) {
                        event.onComplete = function () {
                            w2ui.gridDrain.reload();
                        }.bind(w2ui.gridDrain);
                    },
                    onRender : function (event) {
                        this.record.drain_start_dt = rec.drainStartDt;
                        this.record.start_refdtby = rec.start_refdtby;
                        this.record.drain_stop_dt = rec.drainStopDt;
                        this.record.stop_refdt = Date.now();
                        this.record.stop_refdtby = UserDetailsUtils.getName();
                    },     
                    actions: {
                      Uložit: function() {
                          this.recid = rec.drainId;
                          this.record.stop_refdtby_id = UserDetailsUtils.getId();
                          this.record.changedby_id = UserDetailsUtils.getId();
                          this.record.changeddt = Date.now();
                          this.save();
                          w2popup.close();
                    },
                      Zavøít: function() {
                          w2popup.close();
                    }}})});
            }
        },/*
        gridLimitYear:{
          name: 'gridLimitYear',
          header: 'Limitní hodnoty',
          autoLoad: true,
          //url: 'data-service.sf',
          //postData: {cmd:'get-records', functionCall:{function:'eu.otenergy.chemis3.emptytanks.dao.Test4Dao.getYearLimits'}},
          recid:'year',
          columns: [
              {field: 'year', caption: 'Platnost', size: '10%'},
              {field: 'sum_vol_activity', caption: 'Souè. obj. akt.', size: '10%'},
              {field: 'limit_av1', caption: 'Limit AV1', size: '10%'},// render: sumLimitControl},
              {field: 'limit_av2', caption: 'Limit AV2', size: '10%'},// render: sumLimitControl},
              {field: 'sum_tritium', caption: 'Souè. tritia', size: '10%'},
              {field: 'limit_tr1', caption: 'Limit TR1', size: '10%'},// render: sumLimitControl},
              {field: 'limit_tr2', caption: 'Limit TR2', size: '10%'},// render: sumLimitControl}
            ],
            load: function(){
            console.log(this);
            Chemis.Utils.ajax({cmd: 'fce-call', functionCall:{function:'eu.otenergy.chemis3.emptytanks.dao.Test4Dao.getYearLimits'}})
              .done(function(data,status,xhr){
                  if(data.status === 'error') 
                      w2alert(data.message);
                  else console.log(data);
              } );
            }
        },*/
        toolbarMenu: {
            name: 'toolbarMenu',
            items: [
                { type: 'button', id: 'drain', caption: 'Kapalné výpusti', icon: 'icon-folder', checked: true },
                { type: 'button', id: 'tank', caption: 'Nádrže', icon: 'icon-folder'},
                { type: 'button', id: 'limit', caption: 'Limity', icon: 'icon-folder'}
            ],
           
            onClick: function(event) {
                
                this.items.forEach(function(item){  w2ui.toolbarMenu.set(item.id, { checked: false }); });
                this.set(event.target, { checked: true });
                
                switch(event.target){
                    case "limit":                       
                        w2ui.layout.content('main', w2ui.gridLimit);
                        break; 
                    case "tank":
                        w2ui.layout.content('main', w2ui.gridTank);
                        break;
                    case "drain":
                        w2ui.layout.content('main', w2ui.gridDrain);
                        break;  
                    default:break;
                }
            }
        }
};

formatNumber = function (num) {
    try {
        if (num * 1 !== num) {
            return num;
        }
        if (num > 10 && num < 10000) {
            num = (num * 1).toPrecision(4);
        } else if (num < 0.01 && num !== 0) {
            num = (num * 1).toExponential(3);
        } else if (num >= 10000) {
            num = (num * 1).toExponential(4);
        } else {
            num = (num * 1).toPrecision(3);
        }
        return num.replace('.', ',');
    } catch (err) {
        return num;
    }
};

this.render = function() {

if( UserDetailsUtils.hasCurrentUserRight("EMPTYTANKS_RUN") && UserDetailsUtils.getLocality() === 'DU' ){
    w2ui.layout.set('top', {size:'4%'});
    w2ui.layout.show('top', true);

    w2ui.layout.set('main',{size:'96%'});
    w2ui.layout.show('main', true);

    w2ui.layout.content('top', grid = $().w2toolbar(config.toolbarMenu));
    w2ui.layout.content('main', grid = $().w2grid(config.gridDrain));

    $().w2grid(config.gridTank);
    //$().w2grid(config.gridDrain);
    $().w2grid(config.gridLimit);
}
else
    w2ui.layout.content('main', chemisGlobals.emptyStates('icon-exclamation-circle', 'Modul Vypouštìní KN je pøístupný pouze v lokalitì DU a s pøíslušným oprávnìním.'));

}    
};
    
return {Test4Main: Test4Main};    
})();

$(function() {
    $.secretImprovements = true;
    (new Test4.View.Test4Main).render(); 
});
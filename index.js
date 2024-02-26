var leadProjectTable

var selectedData=undefined
$(document).ready(function () {
  
    
       
          leadProjectTable=$('#lead-project').DataTable({
            destroy:true,
            responsive:true,
            columns:[
              {data:'id'},
              {data:'name'},
              {data:'email'},
              {data:'mobileNumber'},
              {data:'pincode'},  
              {data:'address'},
            //  {'data': null, wrap: true, "render": function (data) { return '<button class="btn btn-mini btn-primary pull-right"> Schedule</button>' } },           
             {
                data: null,
                wrap: true,
                render: function (list) {
                  return '<div class="btn-group"> <button type="button"  class="btn btn-primary" data-toggle="modal" data-target="#projectModal">Schedule</button></div>';
                },
              },

            ]
          })
         
    
            leadProjects();
        
  
            leadProjectTable.on("click", "button", function (e) {
                let data = leadProjectTable.row(e.target.closest("tr")).data();
                selectedData = data;
                console.log(data)
                $("#scheduleModal").modal("toggle");
            
                // $("#leadId").val(data.code);
            
                // $("#projectDescription").val("");
            
                // $("#projectName").val("");
                // $("#home-type-radio").prop("checked", true);
            
                // $("#scratchProject-type-radio").prop("checked", true);
                // $("#projectTypeDiv").css("display", "none");
                // $("#projectModal").modal("toggle");
              });  
    })


    $('#scheduleButton').click(function () {
        let fromDate=$('#fromDateTime').val()
        let toDate=$('#toDateTime').val()
       console.log(selectedData)

    })
    
 function leadProjects(){
    leadProjectTable.clear().draw()
  
    $.ajax({
      url: "https://apidev.asianpaints.com/hack/customers",
      type: 'GET',
      dataType: "json",
      success: function (response) {

          console.log(response)

          if (response != undefined && response.customerList.length!=0) {
            var list = response.customerList
            for(let i=0;i<list.length;i++){
             if(list[i].name==undefined)
             list[i].name=""
             if(list[i].email==undefined)
             list[i].email=""
             if(list[i].mobileNumber==undefined)
             list[i].mobileNumber=""
             if(list[i].pincode==undefined)
             list[i].pincode=""
             if(list[i].address==undefined)
             list[i].address=""
          }
  
           leadProjectTable.rows.add(list).draw()   
          }
          
      },
      error: function (jqXHR) {
  
          let response = jqXHR.responseText;
            if (response != undefined) {
                response = JSON.parse(response)
                if (response != undefined && response.message != undefined) {
                
                } 
            }
      }
  
  
    });
  
  }
    
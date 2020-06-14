//let request = require("request");


function fnExcelReport()
{
    var tab_text="<table border='2px'>";
    var textRange; var j=0;
    tab = document.getElementById('result_table'); // id of table

    for(j = 0 ; j < tab.rows.length ; j++) 
    {     
        tab_text=tab_text+tab.rows[j].innerHTML+"</tr>";
        //tab_text=tab_text+"</tr>";
    }

    tab_text=tab_text+"</table>";
    tab_text= tab_text.replace(/<A[^>]*>|<\/A>/g, "");//remove if u want links in your table
    tab_text= tab_text.replace(/<img[^>]*>/gi,""); // remove if u want images in your table
    tab_text= tab_text.replace(/<input[^>]*>|<\/input>/gi, ""); // reomves input params

    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE "); 

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))      // If Internet Explorer
    {
        txtArea1.document.open("txt/html","replace");
        txtArea1.document.write(tab_text);
        txtArea1.document.close();
        txtArea1.focus(); 
        sa=txtArea1.document.execCommand("SaveAs",true,"Xported_table.xls");
    }  
    else                 //other browser not tested on IE 11
        sa = window.open('data:application/vnd.ms-excel,' + encodeURIComponent(tab_text));  

    return (sa);
}





let ret_html = ``;
let result_div = document.querySelector(".result");
const run = () => {

    console.log("button pressed");

    let offset = document.getElementById("pages_field").value;
    let offset_min = 0;
    let offset_max = 100;

    let token = document.getElementById("token_field").value;
    let keyword =  document.getElementById("keyword_field").value;

    console.log(token);
    let tbl = document.getElementById("result_table");
    tbl.style.width = "100%";
    tbl.setAttribute('border', "1");
    //tbl.setAttribute('class', 'sortable');
    //result_div.appendChild(tbl);

    for(let j = 0; j < offset; j++){
        let url = "https://api.spotify.com/v1/search?q=%22" + keyword + "%22&type=playlist&market=IT&limit=50&offset=" + j*50;

        console.log(url);
        let headers = new Headers({
            "Accept":"application/json",
            "Content-Type":"application/json",
            "Authorization": "Bearer " + token
        });




        let request = new Request(url, {headers: headers});
        console.log(headers.get("Authorization"));
        console.log(request);
        
        fetch(url, {headers : headers})
            .then( (data) => data.json())
            .then( (playlists) => generate_result(playlists, headers))

    }
    
    
    
}



//let prova = request({url : url, headers : headers});

const generate_result = (data, headers) => {
    console.log("generating result");
    let result_array = data.playlists.items;
    //let tbl = document.createElement('table');
    //let result_div = document.getElementById("result_div");
    let tbl = document.getElementById("result_table");
    tbl.style.width = "100%";
    //tbl.setAttribute("class", "border_Class");
    //tbl.setAttribute('border', "0");
    tbl.setAttribute('class', 'sortable');
    //result_div.appendChild(tbl);
    /*let tbl_head_array = ["image", "playlist_id", "name", "collaborative", "link", "followers", "owner"]; 
    let tbl_head = document.createElement('thead');
    tbl.appendChild(tbl_head);
    for (var i = 0; i<tbl_head_array.length; i++){
        console.log("gattini");
        let tbl_head_field = document.createElement('th');
        tbl_head.appendChild(tbl_head_field);
        let head_text = document.createTextNode(tbl_head_array[i]);
        tbl_head_field.appendChild(head_text);
    }*/
    let tbl_body = document.getElementById('result_body');
    //tbl_body.setAttribute("class", "border_Class");
    //tbl.appendChild(tbl_body)
    console.log(result_array);
    for (let i = 0; i < result_array.length; i++){
        console.log("sono nel for");
        let plist_id = result_array[i].id;
        let local_url = "https://api.spotify.com/v1/playlists/" + plist_id;
        //let tbl_row = document.createElement('tr');
        //tbl_row.setAttribute("class", "border_Class");
        //tbl_body.appendChild(tbl_row);

        fetch(local_url, {headers: headers})
            .then( (local_data) => local_data.json() )
            .then( function(data){
                console.log(data);
                let thumbnails = data.images; 
                if (thumbnails.length < 3){
                    thumbnails = ["./default.png", "./default.png", "./default.png"];
                }
                value_array = [thumbnails[2].url, data.id, data.name, data.collaborative, data.external_urls.spotify, data.followers.total, data.owner.external_urls.spotify];
                
                let filter_collaborative = document.getElementById("collab_filter");
                
                if (filter_collaborative.checked){
                    tbl_body.appendChild(tbl_row);
                    if (data.collaborative == true) {
                        let tbl_row = document.createElement('tr');
                        tbl_row.setAttribute("class", "border_Class");
                        let tbl_field = document.createElement('td');
                        tbl_field.setAttribute("class", "border_Class");
                        image = document.createElement("img");
                        image.src = value_array[0];
                        tbl_field.appendChild(image);
                        tbl_row.appendChild(tbl_field);


                    for (let i = 1; i< value_array.length; i++){
                        let tbl_field = document.createElement('td');
                        tbl_field.appendChild(document.createTextNode(value_array[i]));
                        tbl_row.appendChild(tbl_field);
                    }
                    }
                }
                else{
                   let tbl_row = document.createElement('tr');
                   tbl_row.setAttribute("class", "border_Class");
                   tbl_body.appendChild(tbl_row);
                let tbl_field = document.createElement('td');
                tbl_field.setAttribute("class", "border_Class");
                image = document.createElement("img");
                image.src = value_array[0];
                tbl_field.appendChild(image);
                tbl_row.appendChild(tbl_field);


                for (let i = 1; i< value_array.length; i++){
                    let tbl_field = document.createElement('td');
                    tbl_field.appendChild(document.createTextNode(value_array[i]));
                    tbl_row.appendChild(tbl_field);
                }
                }
            }
        )
    }
   
}



const print_plist_info = (data) => {
    console.log(data);
    let thumbnails = data.images; 
    if (thumbnails.length < 3){
        thumbnails = ["./default.png", "./default.png", "./default.png"]
    }
/*    ret_html = `
        <tr>
        <td><img src = "${thumbnails[2].url}"></td>
        <td>${data.id}</td>
        <td>${data.name}</td>
        <td>${data.collaborative}</td>
        <td><a href="${data.external_urls.spotify}">${data.external_urls.spotify}</a></td>
        <td>${data.followers.total}</td>
        <td>${data.owner.display_name}</td>
        </tr>
    `;
*/
    value_array = [thumbnails[2].url, data.id, data.name, data.collaborative, "<a href=\"${data.external_urls.spotify}\">${data.external_urls.spotify}</a>", data.followers.total, data.owner.display_name];
    for (let i = 0; i< value_array.length; i++){
        let tbl_field = document.createElement('td');
        tbl_field.appendChild(document.createTextNode(value_array[i]));
        tbl_row.appendChild(tbl_field);
    }
    /*
    let result_div = document.querySelector(".result");
    result_div.innerHTML += html;*/
    //result_div.innerHTML += ret_html;
    
}

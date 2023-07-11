var cheerio =require('cheerio');
var express = require('express');
var router = express.Router();
require('dotenv').config();
const https=require('https');
const axios = require('axios');
var sslRootCAs = require('ssl-root-cas')
sslRootCAs.inject()
let bigArrayOut=[];
let endpoints=[];


router.get('/', async function(req,resc, next) {
  resglobal=resc;
  await axiosCall1(req, null, next);
  await axiosBookCall3();
  let out=bigArrayOut.toLocaleString();
 
  resc.send(out);
  bigArrayOut=[];
});



const axiosCall1 = async(req, rescall, next) =>{
  
  let bigArray=[];
  let errorCode = req.query.errorCode;
  let bookPath="http://10.236.208.15:31475/search?searchString="+errorCode+"&lang=en-US"
   await axios.get(bookPath)
           .then(data=>{
             //console.log(data.data.items);
             let priority1=data.data.items.filter((item)=>item.title.toLocaleLowerCase().indexOf(errorCode)>-1)
             //console.log(priority1);
             //console.log(priority1);
             let priority1Index=data.data.items.indexOf(priority1);
             let maxItems=3
             let finalList=[];
             if(priority1!=null && priority1.length>0)
             finalList.push(priority1[0]);
             for(let i=0;i<data.data.items.length;i++)
             {
               if(i==maxItems-1)
               {
                 break;
               }
               if(i!=priority1Index)
               {
                 finalList.push(data.data.items[i]);
               }
             }

             if(finalList.length==0)
             {
              resglobal.send(finalList);
             }
           
            let base_bookAPI="http://10.236.208.15:31395/api/showBook/";
            
            for(let index=0;index<finalList.length;index++)
            {
              let id=finalList[index].id.toString().split('_')[0];
              let helpLink=finalList[index].helpLink;
              let bookAPI=base_bookAPI+id+"/"+helpLink+"&rhhlterm="+errorCode;
              endpoints.push(bookAPI);

            }
            
          
          
           

           });
}


const axiosBookCall3=async()=>{
  await axios.all(endpoints.map((endpoint) => axios.get(endpoint))).then(
    (data) => {
      parseHTMLContent(data);
    }
     
  );
  
}


/* GET users listing. */


async function axioscall(index)
{
  let id=finalList[index].id.toString().split('_')[0];
  let helpLink=finalList[index].helpLink;
  let bookAPI=base_bookAPI+id+"/"+helpLink+"&rhhlterm="+errorCode;
  await axiosBookCall3(bookAPI);
}

function parseHTMLContent(htmlBook)
{
 
  try
  {
    for(let k=0;k<htmlBook.length;k++)
    {
      const $ = cheerio.load(htmlBook[k].data);
      //console.log($);
      bigArrayOut.push($('#ariaid-title1').html().trim());
      bigArrayOut.push($('.xref').html()[0]);
      let pss=$('.p');
      for(let i=0;i<pss.length;i++)
      {
        //if(bigArrayOut.indexOf($(pss).html().replace("\n",""))==-1)
        {
          bigArrayOut.push($(pss[i]).html().replace("\n","").replace("-\n",""));
        }
       
       
      }
    }
   
  }
  catch
  {
    return "";
  }
   
}


module.exports = router;

var data=
{"items":[{
  "id":"3027b146e1c971cc3800473c23750516bc745954afe287662a1e0f08c2994ca7_001_en-US_PD_Diagnostic_D-SE-0064712_html",
  "title":"Acknowledging Diagnostic Messages",
  "language":"en-US",
  "helpId":"3027b146e1c971cc3800473c23750516bc745954afe287662a1e0f08c2994ca7_001_en-US",
  "helpLink":"PD.Diagnostic/D-SE-0064712.html?rhfulllayout=true",
  "url":"PD.Diagnostic/D-SE-0064712.html","score":12
},{"id":"3027b146e1c971cc3800473c23750516bc745954afe287662a1e0f08c2994ca7_001_en-US_PD_Diagnostic_D-SE-0064519_html","title":"Diagnostic Messages Overview","language":"en-US","helpId":"3027b146e1c971cc3800473c23750516bc745954afe287662a1e0f08c2994ca7_001_en-US","helpLink":"PD.Diagnostic/D-SE-0064519.html?rhfulllayout=true","url":"PD.Diagnostic/D-SE-0064519.html","score":8},{"id":"3027b146e1c971cc3800473c23750516bc745954afe287662a1e0f08c2994ca7_001_en-US_PD_Diagnostic_D-SE-0063868_html","title":"8132 Tracking deviation limit exceeded","language":"en-US","helpId":"3027b146e1c971cc3800473c23750516bc745954afe287662a1e0f08c2994ca7_001_en-US","helpLink":"PD.Diagnostic/D-SE-0063868.html?rhfulllayout=true","url":"PD.Diagnostic/D-SE-0063868.html","score":7},{"id":"3027b146e1c971cc3800473c23750516bc745954afe287662a1e0f08c2994ca7_001_en-US_PD_Diagnostic_D-SE-0104223_html","title":"8100 - 8159","language":"en-US","helpId":"3027b146e1c971cc3800473c23750516bc745954afe287662a1e0f08c2994ca7_001_en-US","helpLink":"PD.Diagnostic/D-SE-0104223.html?rhfulllayout=true","url":"PD.Diagnostic/D-SE-0104223.html","score":4}],"pageInfo":{"pageNumber":1,"pageSize":25,"pageCount":1,"totalItemCount":4,"hasPreviousPage":false,"hasNextPage":false,"isFirstPage":true,"isLastPage":true,"firstItemOnPage":1,"lastItemOnPage":4}}

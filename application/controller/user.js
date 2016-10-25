 var async = require('async');
 user={
register:function()
{
    
    var usermod = this.loadmodel('user');
    this.req.postdata.activated = false;
    var _id = usermod.createObjectId();
    this.req.postdata._id = _id;
    var activationidlink = 'http://www.'+simple.config.BASEURL+'/user/activate/'+_id+'/cli';
    this.req.postdata.type='client';
    usermod.addUser(this.req.postdata,(doc)=>{
        var nodemailer = require('nodemailer');
          
        var smtpTransport = nodemailer.createTransport({
        host: 'smtp.live.com',
        port: 25,
        auth: {
        user: 'jozreel@live.com',
        pass: 'inf200316'
        }});
      var mailOptions={
          from:'noreply@boya.com',
       to : this.req.postdata.email,
       subject : 'Confirmation email from booya',
       text : 'Hello '+this.req.postdata.fullname+' this is a confirmation email sent to you to confirm your account. click this link' +activationidlink+' to acctivate your account'
      }
      console.log(mailOptions);
      smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
        console.log(error);
        this.jsonResp({error:'Activation email failed'});

      }else{
           console.log("Message sent: " + response.response);
           this.jsonResp(doc);

       }
    });
   
   
});
        
   
    
},

registerbusiness:function()
{
    
    var usermod = this.loadmodel('user');
    this.req.postdata.activated = false;
    var _id = usermod.createObjectId();
    this.req.postdata._id = _id;
    var activationidlink = simple.config.BASEURL+'/user/activate/'+_id+'/srv';
    this.req.postdata.type='server';
  
    var tmodel = this.loadmodel('towns');
   var town = this.req.postdata.businesstwn;
   var country = this.req.postdata.country;
   if(this.req.password === this.req.passwordr)
   {
   tmodel.addone(town,country,(tdoc)=>{
       this.req.postdata.businesstwn = tdoc.name; 
       usermod.addUser(this.req.postdata,(doc)=>{
      if(doc.success !== false)
      {
        var nodemailer = require('nodemailer');
          
        var smtpTransport = nodemailer.createTransport({
        host: 'smtp.live.com',
        port: 25,
        auth: {
        user: 'jozreel@live.com',
        pass: 'inf200316'
        }});
      var mailOptions={
          from:'noreply@boya.com',
       to : this.req.postdata.mainemail,
       subject : 'Confirmation email from booya',
       text : 'Hello '+this.req.postdata. contactname+' this is a confirmation email sent to you to confirm your account. click this link ' +activationidlink+' to acctivate your account'
      }
      console.log(mailOptions);
      smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
        console.log(error);
        this.jsonResp({error:'Activation email failed'});

      }else{
           
           console.log("Message sent: " + response.response);
           this.jsonResp(doc);

       }
    });
   
    }
    else(this.jsonResp(doc));
    });
        
   
    });
   }
   else{
      this.jsonResp({success:false, message:'Passwords do not match',error:'MISMATCH_PASSWD' }); 
   }
 
    
},
businessregistrationpage:function()
{
   
    this.loadview('businessregistrar');
},
activate:function(activateid,type)
{
    var mod = this.loadmodel('user');
    uid = mod.createObjectId(activateid);
    mod.findAndUpdate({_id:uid,activated:false},{activated:true},(obj,res)=>{
       if(obj === null)
       {
           res.success=false;
           res.message="ERROR USER CANNOT BE ACTIVATED";
            this.jsonResp(res); 
       }
       else
       {   this.viewholder.userid = activateid;
         if(type === 'cli')
           this.loadview('editprofile');
         else if(type === 'srv')
           this.loadview('editbusinessprofile');
           //this.jsonResp(res);
       }
       
      
    });
},
editprofile:function(uid)
{
    this.viewholder.userid = uid;
    this.loadview('editprofile');
},
findbyid:function(uid)
{ 
   var usermod = this.loadmodel('user');
   var id = usermod.createObjectId(uid);
  
    
    usermod.findOne({_id:id},{password:0,passwordr:0},{},(doc)=>
    {
       if(doc !==null)
       {
       doc.mobilelist = doc.mobile;
       delete doc.mobile;
       if(doc.opendaysexception !== undefined){
        doc.opendaysexception.sort((a,b)=>{
                          
                           return(new Date(a.specialdate) - new Date(b.specialdate));
       });}
       delete doc.password;
       delete doc.passwordr;
       this.jsonResp(doc); 
       }
       else
       {
           this.jsonResp({})
       }
    });
},
finworkers:function(id)
{
    var worker =  this.loadmodel('worker');
    var _id = worker.createObjectId(id);
    worker.findOne({_id:_id},{},{},(doc)=>{this.jsonResp(doc);});
    
},
updateuser:function()
{  var usermod = this.loadmodel('user');
   console.log('lll');
    var _id = usermod.createObjectId(this.req.postdata._id);
   
    var uobj = this.req.postdata;
    delete uobj._id;
    if(this.req.postdata.servicename !== undefined)
    {
        var businessmod = this.loadmodel('businesstype');
        businessmod.addnew(this.req.postdata.servicename,(res)=>{console.log(res);});
    }
    if(this.req.postdata.businesstwn !== undefined)
    {
        console.log('hello with town');
        var town = this.loadmodel('towns');
        var utown = this.req.postdata.businesstwn;
        var country = this.req.postdata.country;
        console.log(utown,country);
        town.addone(utown,country,(tdoc)=>{
        this.req.postdata.businesstwn = tdoc.name; 
        usermod.saveUser(_id, uobj,(res)=>{ 
        
        delete res.password;
        delete res.passwordr;  
        res.mobilelist = doc.mobile;
        delete res.mobile; 
        this.jsonResp(res)});
    });
    }
    else{
        console.log('hello no town');
    usermod.saveUser(_id, uobj,(res)=>{ 
        
        delete res.password;
        delete res.passwordr;   
        this.jsonResp(res)});
    }
},
saveprofileimage:function()
{
     var usermod = this.loadmodel('user');
     var _id = usermod.createObjectId(this.req.postdata._id);
      var largeimage = this.req.postdata.largeimage;
     filedata={type:largeimage.type, filename:largeimage.filename};
     
     
    usermod.savetogrid(largeimage.data,filedata,(doc)=>
     {
         var saveobj = {gridid:doc._id, profilethumb:this.req.postdata.profilethumb}
         if(doc._id !== undefined)
         {
             usermod.saveUser(_id, saveobj,(res)=>this.jsonResp(res));
         }
     });
    
},

savemobile:function()
{
    var usermod = this.loadmodel('user');
     var _id = usermod.createObjectId(this.req.postdata._id);
     var temp =[];
     temp.push(this.req.postdata.tel);
     
     usermod.addtoarray({_id:_id},temp,'mobile',(doc)=>
     {
         usermod.findOne({_id:_id},{mobile:true}, {},(docm)=>{
            
             docm.mobilelist = docm.mobile;
             delete docm.mobile;
            
             doc.mobile = docm;
            
              this.jsonResp(doc);
            
        });
        
     }
     );
},
editbusinessprofile:function(id)
{
    this.viewholder.userid=id;
    this.loadview('editbusinessprofile');
},
savelocationdetails:function()
{
    var mod =this.loadmodel('user');
    var id = mod.createObjectId(this.req.postdata._id);
    console.log(this.req.postdata);
    mod.findAndUpdateByID(id,{mapMarkers:this.req.postdata.markers},(doc)=>{this.jsonResp(doc);});
},
saveadorphoto:function()
{
     var usermod = this.loadmodel('user');
     var _id = usermod.createObjectId(this.req.postdata._id);
      var largeimage = this.req.postdata.image;
     filedata={type:largeimage.type, filename:largeimage.filename};
     
     
    usermod.savetogrid(largeimage.data,filedata,(doc)=>
     {
         var thumb={gridid:doc._id, mediatype:this.req.postdata.mediatype, thumb:this.req.postdata.imagethumb}
         var temp=[];
         temp.push(thumb);
         if(doc._id !== undefined)
         {
            usermod.addtoarray({_id:_id},temp,'images',(docus)=>
            {
                usermod.findOne({_id:_id},{images:true},{},(docim)=>{
                    docus.imagedata = docim;
                     this.jsonResp(docus);
                });
               
            }
            );
         }
     });
},
getimagefromgrid:function(gridid)
{
    var umod = this.loadmodel('user');
    
    var gid = umod.createObjectId(gridid);
    var bits = '';
    umod.streamfromgrid(gid, (chnk, end,closed)=>
    {
        
        if(end === false)
        {
            bits +=chnk;
        }
        else
        {
           // console.log(bits);
            this.jsonResp({file:bits});
        }
        
    });
},
saveopeninghours:function()
{
    var usermod = this.loadmodel('user');
    var _id = usermod.createObjectId(this.req.postdata._id);
   
    delete this.req.postdata._id;
    
   // usermod.addtoarray({_id:_id},temp,'opendays', (doc)=>this.jsonResp(doc));
   usermod.findOne({_id:_id, 'opendays.day':this.req.postdata.day},{_id:true},{},(docf)=>
   {
       console.log(docf);
       if(docf === null)
       {  
           
            var temp = [];
            temp.push(this.req.postdata);
            console.log(temp);
          
            usermod.addtoarray({_id:_id},temp,'opendays', (doc)=>this.jsonResp(doc));
       }
       else
       {
          
          
            usermod.updateinarray({_id:_id, 'opendays.day':this.req.postdata.day}, {'opendays.$':this.req.postdata},(doc)=>this.jsonResp(doc), false);
       }
   }
   );
  
},
savespecialhours:function()
{
  console.log(this.req.postdata._id);
    var usermod = this.loadmodel('worker');
    var _id = usermod.createObjectId(this.req.postdata._id);
    var temp =[];
    delete this.req.postdata._id;
    
   usermod.insertcounters('specialhrid');
    usermod.generateNextSequence('specialhrid',(oid)=>{
        
        this.req.postdata.specialhrid =parseInt(oid);
         temp.push(this.req.postdata);
        
          usermod.findOne({_id:_id,$or:[{specialhours:{$elemMatch:{specialdate:this.req.postdata.specialdate, specialopeninghour:this.req.postdata.specialopeninghour}}},{specialhours:{$elemMatch:{specialdate :this.req.postdata.specialdate, closed:"true"}}}]}
          ,{_id:true,closed:true},{},(sdoc)=>
          {
            
             if(sdoc === null)
             {
                 var workerid = this.req.postdata.workerid;
               
                 usermod.addtoarray({_id:_id},temp,'specialhours', (doc)=>
                 {
                    
                     usermod.findall((docr)=>
                     {
                        console.log(docr,'tst');
                       doc.workers = docr;
                       this.jsonResp(doc)
                     },true);
                 }); 
             }
             else
             {
                 this.jsonResp({success:false, message:'An exception to the rules of business alrady exist with these parameters', error:'RULE_EXIST'});
             }
          });
         
        
    });
  
},

removeopendaysexception:function()
{
    var usermod = this.loadmodel('worker');
    
    console.log(this.req.postdata.specialdayid, 'spdayid');
    var _id = usermod.createObjectId(this.req.postdata._id);
   
    usermod.removefromarray({_id:_id,'specialhours.specialhrid':parseInt(this.req.postdata.specialdayid)},{'specialhours':{specialhrid:parseInt(this.req.postdata.specialdayid)}},false,(doc)=>
    {
        usermod.findOne({_id:_id}, {workers:{$elemMatch:{workerid:parseInt(this.req.postdata.workerid)}}},{},(docr)=>
        {
            console.log(docr);
            resdoc={};
            resdoc.success=true;
            resdoc.workers = docr;
            
            this.jsonResp(resdoc);
        });
        
        }
        );
    
},

findwithname:function(id)
{
    console.log(id);
    var usermod = this.loadmodel('worker');
     var _id = usermod.createObjectId(id);
    usermod.aggregate([{$match:{_id:_id}},{$unwind:"$specialhours"},{$sort:{'specialhours.specialdate':-1}},{$project:{specialhours:true}}],(dd)=>this.jsonResp(dd));
   // usermod.findAndSort({_id:_id},{opendaysexception:true},{'opendaysexception.specialdate':-1},false,(dd)=>this.jsonResp(dd));
},

removemobile:function()
{
   
    var usermod = this.loadmodel('user');
    var _id = usermod.createObjectId(this.req.postdata._id);
   
    usermod.removefromarray({_id:_id},{mobile:{$in:[this.req.postdata.mobile]}},false,(doc)=>
    {
        usermod.findOne({_id:_id}, {mobile:true},{},(docr)=>
        {
            resdoc={};
            resdoc.success=true;
            resdoc.mobiles={};
            resdoc.mobiles.mobilelist = docr.mobile;
            resdoc.mobiles._id = docr._id;
            
            this.jsonResp(resdoc);
        });
        
        }
        );
},

searchresults:function(needle,needletype, srvid)
{
     console.log(needle, needletype, srvid);
    this.viewholder.searchvalue = this.req.urlencode.checkandecode(needle);
    this.viewholder.searchtype = needletype;
    if(srvid !== undefined)
      this.viewholder.jobid = srvid;
    this.loadview('searchresultpage');
    
}
,
search:function()
{
    var usermod =this.loadmodel('user');
    ///console.log(this.req.postdata,'pp');
     var regex = new RegExp(this.req.postdata.searchtext,'i'); 
      if(this.req.postdata.searchtype === 'service')
    usermod.find({'jobs.jobname':{$regex:regex}},{password:false,passwordr:false},{},true,(doc)=>{this.jsonResp(doc);});
   if(this.req.postdata.searchtype === 'provider')
     usermod.find({businessname:this.req.postdata.searchtext},{password:false,passwordr:false},{},true,(doc)=>this.jsonResp(doc));
},
savejob:function()
{
     var usermod = this.loadmodel('user');
    var _id = usermod.createObjectId(this.req.postdata._id);
    var temp =[];
    delete this.req.postdata._id;
    usermod.insertcounters('jobid');
    usermod.generateNextSequence('jobid',(oid)=>{
        this.req.postdata.jobid =parseInt(oid);
         temp.push(this.req.postdata);
        
          var regex = new RegExp(this.req.postdata.jobname,'i'); 
           usermod.findOne({'jobs.jobname':{$regex:regex}},{_id:true},{},(doc)=>{
               if(doc === null)
               {
                   var servicemod = this.loadmodel('service');
                   servicemod.addnew(this.req.postdata.jobname,(res)=>{console.log(res);});
                   
                 usermod.addtoarray({_id:_id},temp,'jobs', (doca)=>
                 {
                     
                     usermod.findOne({_id:_id}, {jobs:true},{},(docr)=>
                     {
                         
                         docr.jobs.sort((a,b)=>{return a.jobduration-b.jobduration});
                         console.log(docr.jobs);
                         usermod.saveUser(_id,{smalestjob:docr.jobs[0].jobduration},(doc)=>{console.log('it save',_id)})
                         doca.jobs = docr;
                         this.jsonResp(doca);
                     }
                     );
                 });  
               }
               else{
                   this.jsonResp({success:false, message:'Already exist'});
               }
                   
           });
    });
},

removetask:function()
{
  
    var usermod = this.loadmodel('user');
    var _id = usermod.createObjectId(this.req.postdata._id);
   console.log(parseInt(this.req.postdata.jobid));
    usermod.removefromarray({_id:_id},{jobs:{jobid:parseInt(this.req.postdata.jobid)}},false,(doc)=>
    {
        usermod.findOne({_id:_id}, {jobs:true},{},(docr)=>
        {
            resdoc={};
            resdoc.success=true;
            resdoc.jobs={};
            resdoc.jobs.jobs = docr.jobs;
            resdoc.jobs._id = docr._id;
            
            this.jsonResp(resdoc);
        });
        
        }
        );
},
fillSlot:function()
{
  
 
    var totaldaymins = 0;
    var weekday = new Array(7);
    weekday[0]=  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    var beginhour = this.req.postdata.starthour;
   
    var begintimemin = this.req.postdata.beginTime;
    var endtimemin =  this.req.postdata.endTime;
    var schudleeName = this.req.postdata.name;
    var userid = this.req.postdata.email;
    var contactnumber = this.req.postdata.contactnumber;
    var email = this.req.postdata.email;
    var usermod = this.loadmodel('worker');
    var _id = usermod.createObjectId(this.req.postdata._id);
    
     var ad= this.req.postdata.date.split('-');
  
    var seldate = new Date(parseInt(ad[0]),parseInt(ad[1])-1,parseInt(ad[2]),0,0,0,0);
   
  
    var selectedday =  weekday[seldate.getDay()];
    usermod.findOne({_id:_id},{roster:{$elemMatch:{date:this.req.postdata.date}},workdays:{$elemMatch:{workday:selectedday}},workbreak:true, specialhours:true, skills:true},{},(srvdoc)=>
  //  usermod.aggregate([{$match:{_id:_id}},{$unwind:'$workers'},{$match:{'workers.workerid':parseInt(workerid)}},{$unwind:{'path':'$workers.roster',"preserveNullAndEmptyArrays": true}},
     //{$match:{$or:[{'workers.roster.date':this.req.postdata.date}, {'workers.roster':{$exists:false}}, {$and:[{'workers.roster.date':{$ne:this.req.postdata.date}},{'workers.roster':{$exists:true}}]}]}},
    // {$project:{ workers:1, smalestjob:1}}], (srvdoc)=>
     {
        //console.log(srvdoc, 'the doc');
       
       var worker = srvdoc;
     
      worker.skills.sort((a,b)=>{return a.skillduration-b.skillduration});
      var smalestjob = worker.skills[0].skillduration;
      
      var workday;
      var specialday = false;
      var spdayobject;
      var opentime;
      var closetime;
      var workbreak = worker.workbreak;
      console.log(this.req.postdata);
      worker.skills.sort((a,b)=>{return a.skilid - b.skilid}); 
      var skill =  searchInArr(worker.skills,parseInt(this.req.postdata.service),'skilid')
      var jobduration = parseInt(skill.skillduration);
     
      //the datetime for both sartreserv and close reserv
      var startresarray = beginhour.split(':');
     // var closeresarray = endhour.split(':');
      var startReserv = new Date(seldate.getTime());
      startReserv.setHours(parseInt(startresarray[0]));
      startReserv.setMinutes(parseInt(startresarray[1]));
      var closeResrv = new Date(startReserv.getTime()+(jobduration*60000));
      var clhr = closeResrv.getHours();
      var clmn = closeResrv.getMinutes();
      if(clhr < 10)
        clhr = '0'+clhr;
      if(clmn<10)
         clmn = '0'+clmn;
      var endhour = clhr+':'+clmn;
     
    //  closeResrv.setHours(parseInt(closeresarray[0]));
     // closeResrv.setMinutes(parseInt(closeresarray[1]));
     // var seldate = this.req.postdata.date;
      //calculate total opentime for the day 
       var currspday =[]; 
       var untouched=[];
       var spopening;
       var spclosing;
      
      
      if(worker.specialhours !== undefined)
      {
     
      var spobj;
      for(var oei=0; oei<worker.specialhours.length; oei++) 
      {
          
          //go through the array of special hours get the startig and closinh hrs and  if the date of the special hour is eq to the date passed add it to athe array to be processed
        
          var openhrar =  worker.specialhours[oei].specialopeninghour.split(':'); 
          var closehar  = worker.specialhours[oei].specialclosinghour.split(':');
          var spdatear = worker.specialhours[oei].specialdate.split('-');
          var month = parseInt(spdatear[1])-1;
          var year = parseInt(spdatear[0]);
          var day = parseInt(spdatear[2]);
          var tdate = new Date(year,month,day);
          var closedate = new Date(tdate.getTime());
          closedate.setHours(parseInt(closehar[0]));
          closedate.setMinutes(parseInt(closehar[1]));
          tdate.setHours(parseInt(openhrar[0]));
          
         
          tdate.setMinutes(parseInt(openhrar[1]));
          var totalmins = (closedate.getTime()-tdate.getTime())/60000;
         if(tdate.toLocaleDateString() === seldate.toLocaleDateString())
         {
          console.log(tdate.toLocaleDateString(), seldate.toLocaleDateString(), 'testing comparing special dates');
          // create an object with the times for opening closing and hours and add it to array to be processed
          var cday= {startwork:worker.specialhours[oei].specialopeninghour, endwork:worker.specialhours[oei].specialclosinghour, endtime:totalmins, opening:tdate, closing:closedate};
        
           currspday.push(cday);
          //if the time for the reservation is within the boundries of this special working hours then it is this one we use for adding schedule
          console.log(startReserv.getTime() , tdate.getTime(), closedate.getTime(), 'testing comparing times within');
          if((startReserv.getTime() >= tdate.getTime() && startReserv.getTime() <closedate.getTime()))
          {
              
            specialday = true; 
            workday = cday;
            spopening = tdate;
            spclosing = closedate;
            console.log('we got opening and closing', spopening,spclosing);
           // spdayobject = opendaysexception[i];
          
          }
          else{
             //else we will not be using this special opening hours for that date for scheduling put it in untouched array to be used as availabletimes
              untouched.push({beginhour:worker.specialhours[oei].specialopeninghour, endhour:worker.specialhours[oei].specialclosinghour, endtime:totalmins, begintime:0,closing:closedate})
          }
         }
      }
      if(specialday)
      {
          
       // if we have special opening hours on that date sort them  in ascending order and take the first ones time as opening time and the last one closing time as closing time
      currspday.sort((a,b)=>{return a.opening-b.opening});
      opentime=currspday[0].startwork;
      closetime =currspday[currspday.length-1].endwork;
      }
      
    
     
     
      }
     
      if(specialday ===false) // if not then it is a normal opening day 
      {
      
     
            workday = worker.workdays[0];
            opentime = workday.startwork;
            closetime = workday.endwork;
      }
      
     // get the opening time and mins for the normal hour day
      var opentimearray = opentime.split(':');
      var closingtimearray = closetime.split(':'); 
      
      
      var opening = new Date(seldate.getTime());
      var closing = new Date(seldate.getTime());
     
      opening.setHours(opentimearray[0]);
      opening.setMinutes(opentimearray[1]); 
      closing.setHours(closingtimearray[0]); 
      closing.setMinutes(closingtimearray[1]);
      
      var dif = closing.getTime() - opening.getTime();
      
      var totaldaymins = (dif /60000);
      
      // we got the total nnumber mins we are opened for the day
    
     //  temp.push({begintime:beginTime, endtime:endTime, })
     closeResrv = new Date(closeResrv.getTime()+ workbreak*60000);
 
   
    //closeResrv.setMinutes(closeResrv.getMinutes()+ srvdoc.workbreak);
    var temproster = [];
    var bt = parseInt(startReserv.getTime()-opening.getTime()); 
    bt = bt/60000;
    var et = parseInt(closeResrv.getTime() - opening.getTime());
    console.log('closerssv', beginhour, endhour);
   // if(specialday)
     // et = parseInt(closeResrv.getTime() - spopening.getTime());
    et = et/60000;
            
    var tempch = closeResrv.getHours();
    
    var tempcm = closeResrv.getMinutes();
    if(tempch <10) tempch ="0"+tempch;
    if(tempcm <10) tempcm ="0"+tempcm; 
    endhour = tempch+":"+tempcm;
    var closinginmins = parseInt((closing.getTime()-opening.getTime()) /60000);
    if(worker.roster !== undefined)
        var roster = worker.roster[0];
  
   // usermod.findOne({_id:_id, roster:{$elemMatch:{date:this.req.postdata.date}}},{_id:true, roster: { $elemMatch: { date: this.req.postdata.date }}},{},(rostid)=>
    //{
        
        var mintime = parseInt(smalestjob) + parseInt(workbreak);
       //calculate available times when the roster is null or the available times array is empty 
        if(roster === undefined || roster.length === 0)
        {
            
            // todo add logick for if user sets the scheduling type to restricted
            //calculate the times for each skill the worker has and add them to an array containing objects for each skill with an array of times 
            
            var endfreetime = '';
            var startfreetime = '';
            var atimes = [];
            var nextAvailableTime = et;
            var clt = totaldaymins;
            if(specialday)
               clt = (spclosing - opening) /60000;
               
             // when the appointment starts after the amount of thime it would take to complete the smallest task
             if(bt >mintime) 
             {
                 var ndd = new Date(startReserv.getTime() - workbreak*60000);
                 var efth = ndd.getHours();
                 var eftm = ndd.getMinutes();
                 if(efth < 10) efth = "0"+efth;
                 if(eftm <10) eftm = "0"+eftm;
                endfreetime = efth+':'+eftm;
                
                var rbt = 0;
                var rct = closinginmins;
                if(specialday)
                {
                  rbt = (workday.opening - opening)/60000;
                  rct = (workday.closing - opening)/60000; 
                }
                  
                
                 
                //logic for spdayobject
                //*** to come here
                 atimes.push({begintime:rbt, endtime:bt-workbreak ,beginhour:workday.startwork, endhour:endfreetime});
                
            
                atimes.push({begintime:nextAvailableTime, endtime:rct, beginhour:endhour, endhour:workday.endwork});
               
             }
             else
             {   
                 atimes.push({begintime:nextAvailableTime, endtime:clt,beginhour:endhour,endhour:workday.endwork});
             }
             
            if(specialday)
            {
                //if it is a special day  do this. remember the untouched array ?
                for(var un =0; un<untouched.length; un ++)
                {
                    var ubopar = untouched[un].beginhour.split(':');
                    var unbt = new Date(seldate.getTime());
                    unbt.setHours(parseInt(ubopar[0]));
                    unbt.setMinutes(parseInt(ubopar[1]));
                    var tp = unbt - opening;
                    untouched[un].begintime = tp / 60000;
                    untouched[un].endtime = (untouched[un].closing -opening) /60000
                    delete untouched[un].closing;
                    atimes.push(untouched[un]);
                }
               
            }
            // add it to the temproster to be saved
            temproster.push({date:this.req.postdata.date,schedule:[{begintime:bt,endtime:et,beginhour:beginhour,endhour:endhour}],availabletimes:atimes}); 
        
             console.log(bt, et, 'timetest');
           
             
            
            usermod.addtoarray({_id:_id}, temproster, 'roster',(resdoc)=>{this.jsonResp(resdoc)});
        }
        else{
            //calculate available times if it is not empty
            var freetimeArr = [];
                 var tempsched = [];
                 var spsched = [];
                 // array holding the new appointment
                 tempsched.push({begintime:bt,endtime:et,beginhour:beginhour,endhour:endhour});
                
            // we put the existing roster in an arrray and we append the new appt to it
             var schedArrMem = roster.schedule; 
             
            
             schedArrMem.push(tempsched[0]);
            
           
           var spuntouched = [];

           if(specialday)
           {
             
              
             // we calculate for special days when we have a roster for that day
             // we go through the atimes and if they are not within the currentspday times we add them to an array as untouched atimes
             if(roster.availabletimes !== undefined)
              {
               for(var rat =0 ;rat< roster.availabletimes.length; rat++) 
               {
                   var objtime = new Date(seldate.getTime());
                   var objshr = roster.availabletimes[rat].beginhour.split(':');
                   
                   objtime.setHours(parseInt(objshr[0]));
                   objtime.setMinutes(parseInt(objshr[01]));
                   
                  
                   if(objtime >spclosing || objtime < spopening) 
                   {
                     
                     spuntouched.push(roster.availabletimes[rat]);
                   }
                   
                    
               }
              }
               
             
             // we do not need to do this if restricted all we have to do is get the index of the  slot used and splice the array since all atimes will be created on init  
               
              if(roster.schedule !== undefined)
              {
                // we go through the existing schedule and we add all the schedule between the curspecialhours timeto a temp array as they will be needed to recalculate atimes for that sphr perion
               for(var bat =0 ;bat< roster.schedule.length; bat++) 
               {
                   var objtime = new Date(seldate.getTime());
                   var objshr = roster.schedule[bat].beginhour.split(':');
                   
                   objtime.setHours(parseInt(objshr[0]));
                   objtime.setMinutes(parseInt(objshr[01]));
                   
                  
                   if(objtime < spclosing && objtime >= spopening) 
                   {
                     
                     spsched.push(roster.schedule[bat]);
                   }
                   
                    
               }
              }      
                schedArrMem = spsched;
           }
            
           // sort the schedule array 
            schedArrMem.sort((a,b)=>{return a.begintime - b.begintime});
          
          
                
            var scheduleLength = schedArrMem.length; 
            var schedule = schedArrMem;
                 
                var atsort = roster.availabletimes.sort((a,b)=>{return a.begintime - b.begintime});
                //remove all available times
                 usermod.findAndUpdate({_id:_id, 'roster.date':this.req.postdata.date},{'roster.$.availabletimes':[]},(rmdoc)=>{
                 //save the schedule 
                  usermod.addtoarray({_id:_id,  'roster.date':this.req.postdata.date}, tempsched, 'roster.$.schedule',(resdoc)=>{
               
                  //after we save schedule we recalculate freetimes   
                 //not needed in restricted 
                  console.log(schedule, 'test for schedule');
                 for(var i=0; i<scheduleLength; i++)
                 {
                    
                  
                       
                     if(i == 0)
                     {
                         var btime = 0;
                         var bhr = opentime;
                         console.log(mintime);
                         var firstresv = schedule[0];
                         var fbt =  firstresv.begintime;
                         if(specialday)
                         {
                             var begintimeday = new Date(currspday[0].opening.getTime()+ (firstresv.begintime * 60000));
                             fbt = (begintimeday - spopening) / 60000;
                             console.log(fbt,'it is a special day');
                             btime =  (spopening-currspday[0].opening)/60000;
                             bhr = workday.startwork;
                         }
                         
                        
                         if(fbt> mintime) // subtract interval start time
                         {
                           
                             var endtbefore = firstresv.begintime-workbreak;
                             var enddt = new Date(opening.getTime()+(endtbefore*60000));
                             var endhour  = enddt.getHours();
                             if(endhour <10)
                              endhour = "0"+endhour;
                            var endmin = enddt.getMinutes();
                            if(endmin <10)
                              endmin = "0"+endmin;
                           
                             if(isWithinAvail(atsort,btime))
                             {
                              console.log('something done', endhour, endmin);
                              freetimeArr.push({begintime:btime, endtime:endtbefore,beginhour:bhr,endhour:endhour+':'+endmin });
                          
                             }
                         }
                     }
                     
                     if(i === scheduleLength-1)
                     {  
                        
                      
                             var ct= closetime;
                             var cm  = closinginmins;
                             
                             console.log(closinginmins, closetime,schedule[i].endtime);
                             if(specialday)
                             {
                              ct = workday.endwork;
                              cm = (workday.closing.getTime() - opening.getTime())/60000;
                             }
                             if((cm-schedule[i].endtime) > mintime && isWithinAvail(atsort,schedule[i].endtime))
                             {
                                 
                                freetimeArr.push({begintime:schedule[i].endtime, endtime:cm,beginhour:schedule[i].endhour, endhour:ct});
                             }
                            
                             
                         //}
                     }
                     else{
                         
                         var freetime = schedule[i+1].begintime - schedule[i].endtime-srvdoc.workbreak;
                         if(freetime > mintime)
                         {
                             var opt = (spopening - opening)/60000;
                             var clt = (spclosing - opening) /60000;
                             var endfree = schedule[i+1].begintime;
                             var shtm = new Date(opening.getTime()+((schedule[i+1].begintime-workbreak)*60000));
                             var bghr = shtm.getHours();
                             if(bghr < 10) bghr ='0'+bghr;
                             var bgmn = shtm.getMinutes();
                             if(bgmn < 10) bgmn='0'+bgmn;
                             
                             if((!specialday || (specialday && (schedule[i].begintime >= opt && schedule[i].endtime <=clt))) && isWithinAvail(atsort,schedule[i].endtime))
                                  freetimeArr.push({begintime:schedule[i].endtime,endtime:endfree, beginhour:schedule[i].endhour,endhour:bghr+':'+bgmn});
                           
                         }
                     }
                 }
                  console.log(freetimeArr, 'array of freetimes');
                 
                 //now we add all the untouched freetimes to the freetimearr
                 for(var un=0; un < spuntouched.length; un++)
                 {
                     freetimeArr.push(spuntouched[un]);
                 }
                   freetimeArr.sort((a,b)=>{return a.begintime-b.begintime});
                   console.log(spuntouched,'test for untouched free time');
              
                 // usermod.findAndUpdate({_id:_id, 'roster.date':this.req.postdata.date},{'roster.$.availabletimes':freetimeArr},(resdoc)=>{this.jsonResp(resdoc)});
                 usermod.addtoarray({_id:_id, 'roster.date':this.req.postdata.date}, freetimeArr, 'roster.$.availabletimes',(resdoc)=>{
                     resdoc.availabletimes = freetimeArr;
                     this.jsonResp(resdoc)});
                 });
                     
                 });
                
                 
            }
        
    //}
   // );
   // usermod.addtoarray({_id:_id})
  
         
     });
    
},
getavailabletimes:function(servid,date,serv)
{ 
    console.log(serv, 'service');
   
    var weekday = new Array(7);
    weekday[0]=  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    var umod  =  this.loadmodel('worker');
    var _id = umod.createObjectId(servid);
    var reqServ = serv; 
      var today = new Date();
  
    var seldatearr = date.split('-');
    var selecteddate = new Date(parseInt(seldatearr[0]),parseInt(seldatearr[1])-1, parseInt(seldatearr[2]),today.getHours(), today.getMinutes(), today.getSeconds(), today.getMilliseconds());
    var curropenday;
    var worker;
    var workersTimes = [];
   if(selecteddate < today)
   {
       this.jsonResp({success:false, message:'The dat selected is not valid'});
   }
   else{
    
     var quer = {employer:_id};
     var project= {roster: {$elemMatch:{date:date}}, specialhours:true, name:true, workdays:true, skills:true};
     if(reqServ !== undefined)
     {
       quer =  {employer:_id,skills:{$elemMatch:{skilid:parseInt(reqServ)}}};
       project = {roster: {$elemMatch:{date:date}}, name:true, workdays:true, specialhours:true, skills:{$elemMatch:{'skilid':parseInt(reqServ)}}};
     }
     
  // old way  umod.findOne({_id:_id},{roster: { $elemMatch: { date: date }}, opendays:true, daysahead:true, opendaysexception:true,jobs:true,profilethumb:true,  businessname:true},{},(doc)=>{
     umod.find(quer,project,{},true,(doc)=>{
       var userf = this.loadmodel('user');
       userf.findOne({_id:_id}, {opendays:true, daysahead:true},{},(usr)=>{
      var datedif = ((selecteddate-today) / 3600000)/24;
     
    // console.log(doc);
             
             //add logic in this loop to get time for workers
     var daysahead= usr.daysahead;       
      
     //check if it is a special day if it is look to see it is a single opened interval else get the different opened intervals
     
     var daytoday = weekday[selecteddate.getDay()];
     
      if(datedif <= parseInt(daysahead))
      {
        
       var closed = false;  
          
      for(var d = 0; d < usr.opendays.length; d++)
       {  
           
            if(usr.opendays[d].day === daytoday && usr.opendays[d].closed ==="true")
             closed = true;
           if(usr.opendays[d].day === daytoday && usr.opendays[d].closed ==="false")
           {
               
               
               curropenday = usr.opendays[d];
                ;
               break;
           }
           
          
            
       }
       
     if(!closed)
     { 
         
        console.log("not closed dudr"); 
      if(doc.length !== undefined && doc.length !==0) 
      {
       for(var wk=0; wk < doc.length; wk++)
       {
             var dayOpenTimes=[];
           var dayisspecial = false;
           var specialday = [];
           var workertmp={};
            worker = doc[wk];
            
            
          
      if(worker.specialhours !== undefined)
       {
        var sph =doc[wk].specialhours;
       for(var de=0; de<sph.length; de++)
       {
            var spdatear = sph[de].specialdate.split('-');
           var edate = new Date(parseInt(spdatear[0]), parseInt(spdatear[1])-1,parseInt(spdatear[2]));
           console.log(edate.toLocaleDateString())
           if(edate.toLocaleDateString() === selecteddate.toLocaleDateString())
           {
            console.log('seettttttt');
               var openharr = sph[de].specialopeninghour.split(':');
               var closehharr =sph[de].specialclosinghour.split(':');
               var closedate = new Date(edate.getTime());
               edate.setHours(parseInt(openharr[0]));
               edate.setMinutes(parseInt(openharr[1]));
               closedate.setHours(parseInt(closehharr[0]));
               closedate.setMinutes(parseInt(closehharr[1]));
               var spct = (closedate-edate) / 60000;
              dayisspecial = true;
              sph[de].endtime = spct;
               sph[de].slotopentime = edate;
              
              specialday.push(sph[de]);
              dayOpenTimes.push({open:sph[de].specialopeninghour, close:sph[de].specialclosinghour});
              //break;
             
             
           }
           
  
       }
      
   
       }
       
      
      
       
        var availableforday = [];
        
      // if(! dayisspecial)
      // {
       
      // variable worker is for the current worker in the loop
       var day ={startwork:'00:00', endwork:'00:00', off:'false'};
       if(worker.workdays !== undefined)
       {
       for(var wd=0; wd<worker.workdays.length; wd++)
       {
          
           if(worker.workdays[wd].workday === daytoday && worker.workdays[wd].off ==="false")
           {
              
               day = worker.workdays[wd];
           }
       }
       }
       
      
    
      if(!dayisspecial)
       dayOpenTimes.push({open:day.startwork, close:day.endwork});
      var opentimearray = day.startwork.split(':');
      closetimearray = day.endwork.split(':');
      var opentime = new Date();
      var closetime = new Date();
      opentime.setHours(opentimearray[0]);
      opentime.setMinutes(opentimearray[1]);
      closetime.setHours(closetimearray[0]);
      closetime.setMinutes(closetimearray[1]);
    
    
      dayOpenTimes.sort((a,b)=>{return a.open-b.open});
      var doorOpener = dayOpenTimes[0];
      var smallestot = new Date(selecteddate.getTime());
      var sopar = doorOpener.open.split(':');
      console.log(sopar);
      smallestot.setHours(parseInt(sopar[0]));
      smallestot.setMinutes(parseInt(sopar[1])); 
      smallestot.setSeconds(0);
      smallestot.setMilliseconds(0);
      var minnsforday = (closetime.getTime()-opentime.getTime()) / 60000;
     
      
      if(worker.roster === undefined || worker.roster[0] === undefined || worker.roster[0].length === 0 ||(worker.roster[0] !== undefined && worker.roster[0].availabletimes=== undefined) || (worker.roster[0] !== undefined && worker.roster[0].availabletimes !== undefined && worker.roster[0].availabletimes.length===0))
      {
           console.log('ROSTEERRRR!', dayisspecial);
      
         if(dayisspecial)
         {
            
             for(var sd=0; sd < specialday.length; sd++)
             {
                 var spbt = (specialday[sd].slotopentime-smallestot)/60000;
                 console.log(spbt,  specialday[sd].endtime,'yes');
                 availableforday.push({beginhour:specialday[sd].specialopeninghour, endhour:specialday[sd].specialclosinghour, begintime:spbt, endtime:specialday[sd].endtime+spbt});
                 
             }
             availableforday.sort((a,b)=>{return a.beginhour-b.beginhour})
             
         }
         else{
         availableforday=[{begintime:0, endtime:minnsforday, beginhour:day.startwork,endhour:day.endwork}];
         }
      }
      else
      {
         
          for(var ad =0;ad<worker.roster.length;ad++)
          {
                
              if(worker.roster[ad].date === date)
              {
                
                  availableforday = worker.roster[ad].availabletimes;
                  console.log(availableforday, 'jojojo');
                  break;
              }
             
          }
          console.log(availableforday, 'please');
          if(availableforday.length ===0 && day !== undefined)
              availableforday=[{begintime:0, endtime:minnsforday, beginhour:day.startwork,endhour:day.endwork}];
              
        }
        workertmp.availabletimes = availableforday;
        workertmp._id = worker._id;
        workertmp.name = worker.name;
        workertmp.dayisspecial = dayisspecial;
        workertmp.worktimes =dayOpenTimes;
        workertmp.skills = worker.skills;
         var doorCloser = dayOpenTimes.length >1 ? dayOpenTimes[dayOpenTimes.length -1] : dayOpenTimes[0];
         workertmp.doorcloser=doorCloser;
         workertmp.dooropener=doorOpener;
         workersTimes.push(workertmp);
       }
       //close cond for workers array check
      }
       
        var jobarr =[];
     
      if(usr.jobs !== undefined)
      {
          for(var job=0; job<doc.jobs.length; job++)
          {
             
            //  if(doc.jobs[job].jobduration <= minnsforday)
             // {
                jobarr.push(doc.jobs[job]);
              //}
           }
      }
      
      
      
     
  
       this.jsonResp({workers:workersTimes, profilethumb:doc.profilethumb,
           dooropener:curropenday.opentime, doorcloser:curropenday.closetime
    }); 
      
   
     }
     else
     {
          this.jsonResp({success:false, message:'closed for the day'});
     }
    
     }
     else
     {
         this.jsonResp({success:false, message:'You have selected a date past the available days'});
     }
     
     });
    
   });
   
   }
},
saveSkill:function()
{
    var usermod = this.loadmodel('worker');
        console.log(this.req.postdata);
    var _id = usermod.createObjectId(this.req.postdata._id);
    var skills = [];
    skills.push({skillname:this.req.postdata.jobname, skilid:parseInt(this.req.postdata.jobid), skillduration:this.req.postdata.jobduration});

    usermod.addtoarray({_id:_id}, skills,'skills',(resdoc)=>{console.log(resdoc);
        this.jsonResp(resdoc);});
},
getimageandads:function(id)
{
    console.log('requested');
    var umod = this.loadmodel('user');
    var _id= umod.createObjectId(id);
   
    umod.findOne({_id:_id},{images:{$slice:5},_id:true},{},(doc)=>{
       
        async.map(doc.images, (image, callback)=>
        {
            var bits='';
             umod.streamfromgrid(image.gridid,(chnk, end,closed)=>{
                 
                 if(end === false)
                  {
                   bits +=chnk;
                  }
                  else
                {
                  console.log('l');
                   image.image=bits;
                   callback(null, 'success');
                 }
                 
                
             });
        },
        (err, res)=>
        {
            console.log('finiti');
             this.jsonResp(doc);
        }
        );
       
        
       
    });
},
businesspage:function(id,jobid)
{
    console.log(this.method);
    if(this.method === 'GET')
    {
    this.viewholder.businessid = id;
    this.viewholder.jobid = jobid;
   
    this.loadview('businesspage');
     console.log('hh');
    }
    
},
//get 
find:function(id)
{
    
    var usermod = this.loadmodel('user');
    var uid = usermod.createObjectId(id);
    usermod.findOne({_id:uid},{},{},(doc)=>{this.jsonResp(doc)});
}
,
addemployer:function()
{
    console.log('this is all');
    var usermod = this.loadmodel('worker');
    var _id = usermod.createObjectId(this.req.postdata._id);
  
   //usermod.insertcounters('workerid');
   // usermod.generateNextSequence('workerid',(oid)=>{ console.log(oid);
         var wrk = {employer:_id,name:this.req.postdata.employeename, roster:[], skills:[], alias:this.req.postdata.alias};
     usermod.insertOrUpdate(wrk,(resdoc)=>{
         usermod.findall((doc)=>{this.jsonResp(resdoc);},true);
         
        });
   
},

saveemployeehours:function()
{
    
    var daysarr =[{workday:this.req.postdata.workday,startwork:this.req.postdata.beginwork,endwork:this.req.postdata.endwork, off:this.req.postdata.off}]
    var umod = this.loadmodel('worker');
  
    var _id = umod.createObjectId(this.req.postdata.worker);
    umod.addtoarray({_id:_id}, daysarr,'workdays',(resdoc)=>{
      
        this.jsonResp(resdoc); 
       
    } );
    
}
,
saveworkbreak:function()
{
    console.log(this.req.postdata);
    var umod = this.loadmodel('worker');
    var _id = umod.createObjectId(this.req.postdata._id);
    umod.updateOne({_id:_id},{workbreak:this.req.postdata.workbreak},(doc)=>{this.jsonResp(doc),  false});
},
getworkers:function(employer) 
{
    var wmod = this.loadmodel('worker');
    var empid= wmod.createObjectId(employer);
    wmod.find({employer:empid}, {},{},true,(doc)=>this.jsonResp(doc))
},
getbasicuserinfo:function(id)
{
    var umod = this.loadmodel('user');
    var _id = umod.createObjectId(id);
    umod.findOne({_id:_id},{businessname:true, opendays:true, profilethumb:true, jobs:true},{},(doc)=>{
        this.jsonResp(doc);
        
    })
}
}

function isWithinAvail(arr, startt)
{
   console.log(startt, arr, 'patat');
    var start = 0;
    var end = arr.length;
    
   while(start <= end)
    {
       
         var mid = Math.floor((start + end) / 2);
          console.log(start,mid,end); 
         if(startt >= arr[mid].begintime && startt <= arr[mid].endtime)
         {
             console.log('yay i found it');
             return true;
         }
       
        if(startt >= arr[mid].begintime)
        {
          start = mid+1;
          console.log('more');
        }
        else{
            console.log('less');
            end=mid-1;
        }
    }
    console.log('oh no you did not');
    return false;
}


function searchInArr(array, val, key)
{
    console.log(array);
    
    var start =0;
    var end = array.length;
   
    while(start < end)
    {
        var mid = Math.floor((start+end)/ 2);
        if(typeof array[mid] === 'object')
        {
          
            var curr = array[mid];
              console.log('it is an obj', curr[key],  val);
            if(curr[key] == val)
            {
                return curr;
            }
            else if(curr[key] > val)
            {
                end = mid-1;
            }
            else
            {
                start = mid+1;
            }
        }
        else
        {
            if(array[mid] == val)
              return array[mid];
             else if(array[mid] > val)
             {
                 end= mid-1;
             }
             else
             {
                 start = mid+1
             }
        }
    }
}





module.exports = user;